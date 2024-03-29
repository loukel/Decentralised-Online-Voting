from block import Block
from event import EventBlock, load_event
import time
import threading
import requests
from datetime import datetime, timedelta
from dateutil import parser
from register_seeder import verify_signature
import json

class Blockchain:
    difficulty = 4
    tx_per_block = 2

    def __init__(self):
        self.mempool = []
        self.chain = []
        self.pollers = []
        self.poller = ''
        self.ip = ''
        self.port = ''
        self.interrupt_mining = threading.Event()
        self.mining_thread = None
        self.current_event = None
        self.checker_thread = None
        self.blocked = False
        self.destroyed = False

    @classmethod
    def load(cls, chain):
        blockchain = cls()
        for block in chain:
            if 'event' in block:
                blockchain.chain.append(EventBlock.load(block))
            else:
                blockchain.chain.append(Block.load(block))

        return blockchain
    
    # Load new chain returning a new object based on this one
    def template(self, chain):
        blockchain = Blockchain.load(chain)

        blockchain.mempool = self.mempool
        blockchain.pollers = self.pollers
        blockchain.poller = self.poller
        blockchain.ip = self.ip
        blockchain.port = self.port

        return blockchain
        
    @property
    def last_event(self):
        if self.current_event == None:
            for block in self.chain[::-1]:
                if isinstance(block, EventBlock):
                    self.event = block
                    return block
        else:
            if self.event_active:
                return self.current_event
            
    @property
    def event_active(self):
        event = self.last_event.event

        start_time = parser.isoparse(event['start_date'])
        end_time = parser.isoparse(event['end_date'])
        now = datetime.now(start_time.tzinfo)

        if start_time <= now <= end_time:
            return True
        else:
            self.current_event = None
            return False
            
    @property
    def last_block(self):
        return self.chain[-1]
    
    @property
    def chain_dict(self):
        return [b.__dict__ for b in self.chain]
    
    def create_genesis_block(self, eventLoc='event.json', register='register.txt', duration=3):
        register_file = open(register, 'r')
        public_ids = register_file.read().splitlines()
        register_file.close()

        transactions = [{
            "amount": 1,
            "receiver": pk,
            "sender": 'coinbase',
        } for pk in public_ids]

        event = load_event(eventLoc)

        # Set the start and end date time
        buffer = timedelta(minutes=0)
        start = datetime.now() + buffer
        duration_minutes = timedelta(minutes=duration)
        end = start + duration_minutes

        event['start_date'] = start.isoformat()
        event['end_date'] = end.isoformat()

        genesis_block = EventBlock(index=0, transactions=transactions, timestamp=time.time(), previous_hash="0", nonce=0, event=event, poller=self.poller)

        print('Started mining genesis block')
        proof = self.proof_of_work(genesis_block)

        genesis_block.hash = proof

        self.chain.append(genesis_block)

        self.start_mining()
    
    def validate_tx(self, transaction):
        # 1. Check transaction is in mempool, check spender has the funds
        if transaction['amount'] != 1:
            return False
        bal = 0
        all_transactions = self.transactions

        for tx in all_transactions:
            if tx['sender'] == transaction['sender']:
                bal -= tx['amount']
            if tx['receiver'] == transaction['sender']:
                bal += tx['amount']
            
        if bal != 1:
            print('User is not authenticated to vote')
            return False

        # 2. Check the digital signature is correct
        base_transaction = transaction.copy()
        del base_transaction['signature']
        del base_transaction['timestamp']
        transaction_string = json.dumps(base_transaction, separators=(',', ':'))

        return verify_signature(public_key=transaction['sender'], signature=transaction['signature'], plain_text=transaction_string)
    
    @property
    def transactions(self):
        T = []
        for block in self.chain:
            T.extend(block.transactions)
        return T
        
    def add_transaction(self, transaction):
        # tx includes amount, sender ('coinbase' for minted / candidate address), receiver
        # Validate tx
        if self.validate_tx(transaction):
            self.mempool.append(transaction)
        else:
            raise ValueError('Invalid key')

    def add_block(self, block):
        self.chain.append(block)

        # Remove transactions that have been added
        self.refresh_mempool()

        self.blocked = False

    def start_mining(self):
        # Start mining if there are enough transactions or the event is over
        self.checker_thread = threading.Thread(target=self.check_to_mine)
        self.checker_thread.start()

    def check_to_mine(self):
        while not self.destroyed:
            if (len(self.mempool) >= Blockchain.tx_per_block or (not self.event_active and len(self.mempool) != 0)) and not self.blocked:
                self.interrupt_mining.clear()
                if self.mining_thread and self.mining_thread.is_alive():
                    return
                self.mining_thread = threading.Thread(target=self.mine)
                self.mining_thread.start()
            time.sleep(2)

    def stop_mining(self):
        self.interrupt_mining.set()
        self.blocked = True
    
    def mine(self):
        last_block = self.last_block

        transactions = self.mempool[0:Blockchain.tx_per_block]

        new_block = Block(index=last_block.index + 1,
                transactions=transactions,
                timestamp=time.time(),
                previous_hash=last_block.hash,
                poller=self.poller)
        
        print('Started mining')
        
        # What happens if block receives a block before proof is calculated or at the same etc -> requires thread that stops in this case
        proof = self.proof_of_work(new_block)

        if proof != None:
            new_block.hash = proof
            self.add_block(new_block)
            print('Finished mining')

            print('Started broadcasting')
            failed_broadcasts = 0
            # Broadcast block to self.pollers
            for addr in self.pollers:
                try:
                    headers = {
                        "Port": str(self.port),
                        "Ip": str(self.ip),
                    }

                    response = requests.post(f'http://{addr}/blocks', json=new_block.__dict__, headers=headers)
                    print(f'Sent block to {addr}')

                    response.raise_for_status()
                except Exception as e:
                    print(f'Failed sending block to {addr} - {e}')
                    failed_broadcasts += 1
                    continue

            print('Finished broadcasting new block', f'{len(self.pollers) - failed_broadcasts}/{len(self.pollers)}')
        else:
            print('Mining stopped abruptly')

    def proof_of_work(self, block):
        # block.nonce = 0
        # For showcasing the functionality of the code a random int will be used instead of a sequential nonce selection
        block.nonce = Block.random_nonce()

        computed_hash = block.compute_hash()
        while not self.valid_hash(computed_hash) and not self.interrupt_mining.is_set():
            block.nonce = Block.random_nonce()
            computed_hash = block.compute_hash()
            # print(computed_hash)

        return computed_hash if self.valid_hash(computed_hash) else None
    
    @staticmethod
    def valid_hash(hash):
        return hash.startswith('0' * Blockchain.difficulty)

    @staticmethod
    def is_valid_proof(block, block_hash):
        return Blockchain.valid_hash(block_hash) and block_hash == block.compute_hash()
    
    @property
    def valid(self):
        result = True
        previous_hash = "0"
        index = 0

        for block in self.chain:
            block_hash = block.hash
            # remove the hash field to recompute the hash again
            # using `compute_hash` method.
            delattr(block, "hash")

            # 1a. Is the hash generated from the block
            # 1b. Does the hash obey the difficulty
            # 2. Does the block have the correct previous block hash
            # 3. Does the block have the correct sequential index  
            if not Blockchain.is_valid_proof(block, block_hash) or \
                    previous_hash != block.previous_hash or \
                        index != block.index:
                result = False
                break

            index += 1

            block.hash, previous_hash = block_hash, block_hash

        return result
    
    def valid_block(self, block):
        # 1. Check if transactions are valid
        # Get transactions not in mempool
        unchecked_txs = [tx for tx in block.transactions if tx not in self.mempool]

        # Validate transaction
        for tx in unchecked_txs:
            if not self.validate_tx(tx):
                return False

        # 2. Check the hash  is validate
        block_hash = block.hash
        delattr(block, "hash")

        if Blockchain.is_valid_proof(block, block_hash):
           block.hash = block_hash
           return True 
        else:
            return False

    def refresh_mempool(self):
        added_transactions = [{'amount': tx['amount'], 'sender': tx['sender'], 'receiver': tx['receiver']} for tx in self.transactions]
        self.mempool = [tx for tx in self.mempool if {'amount': tx['amount'], 'sender': tx['sender'], 'receiver': tx['receiver']} not in added_transactions]

    def destroy(self):
        self.stop_mining()  # Signal all threads to stop
        self.destroyed = True
        if self.checker_thread.is_alive():
            self.checker_thread.join()  # Wait for the mining thread to finish

        del self


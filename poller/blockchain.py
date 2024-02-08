from block import Block
from event import EventBlock, load_event
import time
import numpy as np

class Blockchain:
    difficulty = 3
    tx_per_block = 1

    def __init__(self):
        self.mempool = []
        self.chain = []
        self.mining = False

    @classmethod
    def load(cls, chain):
        blockchain = cls()
        for block in chain:
            if 'event' in block:
                blockchain.chain.append(EventBlock.load(block))
            else:
                blockchain.chain.append(Block.load(block))

        return blockchain
    
    @property
    def last_event(self):
        for block in self.chain[::-1]:
            if isinstance(block, EventBlock):
                return block
            
    @property
    def last_block(self):
        return self.chain[-1]
    
    @property
    def chain_dict(self):
        return [b.__dict__ for b in self.chain]
    
    def create_genesis_block(self, eventLoc='event.json', register='register.txt'):
        register_file = open(register, 'r')
        public_ids = register_file.read().splitlines()

        transactions = [{
            "amount": 1,
            "receiver": pk,
            "sender": 'coinbase',
        } for pk in public_ids]

        event = load_event(eventLoc)

        genesis_block = EventBlock(index=0, transactions=transactions, timestamp=time.time(), previous_hash="0", nonce=0, event=event)

        self.proof_of_work(genesis_block)

        genesis_block.hash = genesis_block.compute_hash()

        self.chain.append(genesis_block)
    
    def validate_tx(self, transaction):
        # Check transaction is in mempool, check spender has the funds
        if transaction['amount'] != 1:
            return False

        transactions = []
        for block in self.chain:
            transactions.extend(block.transactions)

        bal = 0
        for tx in transactions:
            if tx['sender'] == transaction['sender']:
                bal -= tx['amount']
            if tx['receiver'] == transaction['sender']:
                bal += tx['amount']

        if bal != 1:
            print('User is not authenticated to vote')
            return False
        
        return True
    
    def add_transaction(self, transaction):
        # tx includes amount, sender ('coinbase' for minted / candidate address), receiver
        # Validate tx
        if self.validate_tx(transaction):
            print('1')
            self.mempool.append(transaction)

            # Or pass end_date
            if len(self.mempool) >= Blockchain.tx_per_block and not self.mining:
                self.start_mining()
        else:
            raise ValueError('Invalid key')

    def add_block(self, block, hash):
        # Check validity of block
        # Check if hash is valid and hashing the blocking generates that block
        # If so add to chain
        block.hash = hash
        self.chain.append(block)
    
    def start_mining(self):
        print('started mining')
        last_block = self.last_block

        transactions = self.mempool[0:Blockchain.tx_per_block]

        new_block = Block(index=last_block.index + 1,
                transactions=transactions,
                timestamp=time.time(),
                previous_hash=last_block.hash)
        
        # What happens if block receives a block before proof is calculated or at the same etc -> requires thread that stops in this case
        proof = self.proof_of_work(new_block)

        if proof != None:
            self.add_block(new_block, proof)

            # Remove transactions that have been added
            self.mempool = self.mempool[Blockchain.tx_per_block:]

        print('Finished mining', self.chain)

        # Send other pollers block

    def proof_of_work(self, block):
        """
        Function that tries different values of nonce to get a hash
        that satisfies our difficulty criteria.
        """
        block.nonce = 0

        computed_hash = block.compute_hash()
        while not self.valid_hash(computed_hash):
            block.nonce += 1
            computed_hash = block.compute_hash()

        return computed_hash if self.valid_hash(computed_hash) else None
    
    @staticmethod
    def valid_hash(hash):
        return hash.startswith('0' * Blockchain.difficulty)

    @staticmethod
    def is_valid_proof(block, block_hash):
        """
        Check if block_hash is valid hash of block and satisfies
        the difficulty criteria.
        """
        return Blockchain.valid_hash(block_hash) and block_hash == block.compute_hash()
    
    @property
    def valid(self):
        result = True
        previous_hash = "0"

        for block in self.chain:
            block_hash = block.hash
            # remove the hash field to recompute the hash again
            # using `compute_hash` method.
            delattr(block, "hash")

            if not Blockchain.is_valid_proof(block, block_hash) or \
                    previous_hash != block.previous_hash:
                result = False
                break

            block.hash, previous_hash = block_hash, block_hash

        return result
from block import Block
from event import EventBlock
import time

class Blockchain:
    difficulty = 1

    def __init__(self, eventLoc='event.json'):
        self.mempool = []
        self.chain = []

        self.create_genesis_block(eventLoc)

    @classmethod
    def load(cls, chain):
        blockchain = cls()

        for block in chain:
            blockchain.chain.append(Block.load(block))

        return blockchain
    
    @property
    def last_event(self):
        for block in self.chain[::-1]:
            if block.event:
                return block
    
    def create_genesis_block(self, eventLoc, register='register.txt'):
        register_file = open(register, 'r')
        public_ids = register_file.read().splitlines()

        transactions = [{
            "amount": 1,
            "receiver": pk,
            "sender": 'coinbase',
        } for pk in public_ids]

        genesis_block = EventBlock(eventLoc=eventLoc, index=0, transactions=transactions, timestamp=time.time(), previous_hash="0", nonce=0)

        self.proof_of_work(genesis_block)

        genesis_block.hash = genesis_block.compute_hash()

        self.chain.append(genesis_block)

    
    def add_transaction(self, transaction):
        # tx includes amount, sender ('coinbase' for minted / candidate address), receiver

        self.mempool.append(transaction)
        print(self.mempool)
    
    @property
    def last_block(self):
        return self.chain[-1]

    def proof_of_work(self, block):
        """
        Function that tries different values of nonce to get a hash
        that satisfies our difficulty criteria.
        """
        block.nonce = 0

        computed_hash = block.compute_hash()
        while not computed_hash.startswith('0' * Blockchain.difficulty):
            block.nonce += 1
            computed_hash = block.compute_hash()

        return computed_hash
    
    @staticmethod
    def is_valid_proof(block, block_hash):
        """
        Check if block_hash is valid hash of block and satisfies
        the difficulty criteria.
        """
        return (block_hash.startswith('0' * Blockchain.difficulty) and
                block_hash == block.compute_hash())
    
    @staticmethod
    def check_chain_validity(chain):
        result = True
        previous_hash = "0"

        for block in chain:
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
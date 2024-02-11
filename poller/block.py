# Copied from https://github.com/ngocbh/voting-blockchain/blob/master/bcb_server/blockchain.py

from hashlib import sha256
import json
import random

class Block:
    max_nonce = 2**32 - 1

    def __init__(self, index, transactions, timestamp, previous_hash, poller='', nonce = 0):
        self.index = index
        self.transactions = transactions
        self.timestamp = timestamp
        self.previous_hash = str(previous_hash)
        self.poller = poller
        self.nonce = nonce

    @staticmethod
    def load(block_dict):
        block = Block(
            index=block_dict['index'],
            transactions=block_dict['transactions'],
            timestamp=block_dict['timestamp'],
            previous_hash=block_dict['previous_hash'],
            poller=block_dict['poller'],
            nonce=block_dict['nonce'],
        )
        block.hash = block_dict['hash']
        return block
    
    @staticmethod
    def random_nonce():
        return random.randint(0, Block.max_nonce)
    
    def compute_hash(self):
        """
        A function that return the hash of the block contents.
        """
        block_string = json.dumps(self.__dict__, sort_keys=True)
        
        return sha256(block_string.encode()).hexdigest()

    
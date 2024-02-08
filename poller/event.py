import json
from block import Block

def load_event(loc):
    with open(loc) as json_file:
        return json.load(json_file)

class EventBlock(Block):
    def __init__(self, index, transactions, timestamp, previous_hash, nonce, event):
        super().__init__(index, transactions, timestamp, previous_hash, nonce)
        self.event = event

    @staticmethod
    def load(block_dict):
        event_block = EventBlock(
            block_dict['index'],
            block_dict['transactions'],
            block_dict['timestamp'],
            block_dict['previous_hash'],
            block_dict['nonce'], 
            block_dict['event'],
        )

        event_block.hash = block_dict['hash']
        return event_block
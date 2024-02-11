import json
from block import Block

def load_event(loc):
    with open(loc) as json_file:
        return json.load(json_file)

class EventBlock(Block):
    def __init__(self, index, transactions, timestamp, previous_hash, poller, nonce, event):
        super().__init__(index=index, transactions=transactions, timestamp=timestamp, previous_hash=previous_hash, poller=poller, nonce=nonce)
        self.event = event

    @staticmethod
    def load(block_dict):
        event_block = EventBlock(
            index=block_dict['index'],
            transactions=block_dict['transactions'],
            timestamp=block_dict['timestamp'],
            previous_hash=block_dict['previous_hash'],
            nonce=block_dict['nonce'], 
            poller=block_dict['poller'],
            event=block_dict['event'],
        )

        event_block.hash = block_dict['hash']
        return event_block
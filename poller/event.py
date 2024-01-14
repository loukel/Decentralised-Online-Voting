import json
from block import Block

class Event:
    def __init__(self, data):
        self.name = data['name']
        self.description = data['description']
        self.start_date = data['startDateTime']
        self.end_date = data['endDateTime']
        self.options = data['options']

    @staticmethod
    def load(loc):
        with open(loc) as json_file:
            event_json = json.load(json_file)

            return Event(event_json)

class EventBlock(Block):
    def __init__(self, eventLoc='event.json'):
        super().__init__()
        self.event = Event.load(eventLoc)

    @staticmethod
    def load(block_dict):
        event_block = EventBlock(
            block_dict['index'],
            block_dict['transactions'],
            block_dict['timestamp'],
            block_dict['previous_hash'],
            block_dict['nonce'], 
            Event(block_dict['event']),
        )
        block.hash = block_dict['hash']
        return event_block
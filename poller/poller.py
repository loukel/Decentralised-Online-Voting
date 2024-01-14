from flask import Flask, request, jsonify
from blockchain import Blockchain

import time

# Initialise Flask app
app = Flask(__name__)

# Get node's local blockchain
blockchain = Blockchain()

# Endpoint to add a transaction to the mempool
@app.route('/transaction', methods=['POST'])
def add_transaction():
    tx_data = request.get_json()

    tx_data["timestamp"] = time.time()

    # Add to blockchain
    blockchain.add_transaction(tx_data)
    
    return "Success", 201
    
      
if __name__ == "__main__":
    # event = Event.load('event.json')
    # print(event.__dict__)
    app.run(host='0.0.0.0', debug = True, threaded = True)


# Endpoints
# add_node 3
# add_transaction 1
# add_block (and validate_block) 2
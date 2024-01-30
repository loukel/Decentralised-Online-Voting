from flask import Flask, request
from flask_cors import CORS
from blockchain import Blockchain

import time

# Initialise Flask app
app = Flask(__name__)
CORS(app)

# Get node's local blockchain
blockchain = Blockchain()

@app.route('/event', methods=['GET'])
def get_event():
    return blockchain.last_event.event

# Endpoint to add a transaction to the mempool
@app.route('/transaction', methods=['POST'])
def add_transaction():
    tx_data = request.get_json()

    tx_data["timestamp"] = time.time()

    # Add to blockchain
    blockchain.add_transaction(tx_data)
    
    return "Success", 201
      
if __name__ == "__main__":
    app.run(host='0.0.0.0', debug = True, threaded = True)

# Endpoints
# add_node 3
# add_transaction 1
# add_block (and validate_block) 2
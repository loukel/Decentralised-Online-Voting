from flask import Flask, request
from flask_cors import CORS
from blockchain import Blockchain
from block import Block
import requests
import os
import time
from dotenv import load_dotenv
load_dotenv()
from utils import get_ip

pollers = set()
ip = 0
port = 0

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
    try:
        blockchain.add_transaction(tx_data)

        return "Success", 201
    except:
        return "Unauthorized", 401

@app.route('/chain', methods=['GET'])
def get_chain():
    return blockchain.chain_dict

@app.route('/blocks', methods=['POST'])
def add_block():
    # Validate block: are the transactions valid and exist in the mempool, is the block valid: hash matches block and hash PoW valid -> maybe needs more? 
    # Does block fit into the local chain (correct previous hash) if not is the chain longer?
    # Add block: stop mining, remove transactions in block from mempool,

    # 1a. Check that previous hash is correct, Check that block is valid -> add block
    # 1b. Check that chain is longer (index is greater), Check chain is valid
    # 2. Stop mining
    # 3. Update chain and mempool
    # 4. Starting mining on new block
    global blockchain

    data = request.get_json()
    block = Block.load(data)
    block.hash = data["hash"]

    previous_block = blockchain.last_block

    # Validate Block: txs are in mempool, hash is from block, hash is correct
    if blockchain.valid_block(block):
        if block.previous_hash == previous_block.hash:
            blockchain.stop_mining()
            blockchain.add_block(block)
            return "Success", 201
        elif block.index > previous_block.index:
            # Get chain
            try:
                response = requests.get(f'http://{addr}/chain')
                response.raise_for_status()

                data = response.data
                new_blockchain = blockchain.template(data)

                if new_blockchain.valid:
                    blockchain.stop_mining()
                    blockchain = new_blockchain

                    # Remove added transactions
                    blockchain.refresh_mempool()

                    # Start mining a new block
                    blockchain.start_mining()
                    return "Success", 2001
            except:
                return "Not Accepted", 406

    return "Not Accepted", 406
        

@app.route('/pollers', methods=['GET'])
def local_pollers():
    return list(pollers)

@app.route('/pollers', methods=['POST'])
def add_poller():
    # Validate -> ensure only permissioned node can join
    # Get IP and save object about
    # Send chain
    data = request.get_json()

    if not data:
        return 'Invalid data' , 400
    
    request_addr = data['ip']
    port = data['port']

    node = request_addr + ':' + str(port)

    pollers.add(node)
    blockchain.pollers = pollers

    return blockchain.chain_dict

def join_network(ip, port):
    global blockchain

    trusted_pollers = os.environ.get('TRUSTED_POLLERS', '[]')
    trusted_pollers = trusted_pollers.split(',')

    self = f'{ip}:{port}'
    if self in trusted_pollers:
        trusted_pollers.remove(self)
    
    for addr in trusted_pollers:
        try:
            response = requests.get(f'http://{addr}/pollers')
            response.raise_for_status()

            found_pollers = response.json()

            if self in found_pollers:
                found_pollers.remove(self)

            pollers.update(found_pollers)

            pollers.add(addr)
        except requests.exceptions.HTTPError:
            print(f"HTTP Error occurred for {addr}")
        except requests.exceptions.ConnectionError:
            print(f"Connection Error occurred for {addr}")
        except requests.exceptions.Timeout:
            print(f"Timeout Error occurred for {addr}")
        except requests.exceptions.RequestException:
            print(f"An unexpected error occurred for {addr}")

    if len(pollers) == 0:
        return False

    failed_attempts = 0
    chains = []
    for addr in pollers:
        try:
            response = requests.post(f'http://{addr}/pollers', json={'ip': ip, 'port': port})
            response.raise_for_status()

            found_chain = response.json()

            # Check if chain already exists based on last hash
            exists = len([c for c in chains if c[-1]['hash'] == found_chain[-1]['hash']]) == 1

            # Add chain if it hasn't been added already
            if not exists:
                chains.append(found_chain)
        except:
            failed_attempts += 1
    
    if failed_attempts == len(pollers):
        return False
    else:
        # ---Select the longest valid chain--
        chains = [Blockchain.load(c) for c in chains]
        chains = [c for c in chains if c.valid]

        if len(chains) == 0:
            print('No valid chains found')
            return False

        # 2. Select longest chain
        def chain_length(c):
            return len(c.chain)
        
        longest_chain = max(chains, key=chain_length)
        blockchain = longest_chain

        blockchain.pollers = pollers
        blockchain.port = port
        blockchain.ip = ip

        print('Connection successfull')
        return True

if __name__ == "__main__":
    from argparse import ArgumentParser

    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000, type=int)
    parser.add_argument('-f', '--first', default=False, type=bool)
    parser.add_argument('-l', '--local', default=True, type=bool)
    args = parser.parse_args()
    port = args.port
    local = args.local
    first_poller = args.first

    if not first_poller:
        ip = '127.0.0.1' if local else get_ip()

        while not join_network(ip=ip, port=port):
            time.sleep(5)
            print('Retrying connection')
    else:
        blockchain.port = port
        blockchain.create_genesis_block()

    app.run(host='0.0.0.0', port=port, debug=True, threaded=True)


    

# Endpoints
# add_node 3
# add_transaction 1
# add_block (and validate_block) 2
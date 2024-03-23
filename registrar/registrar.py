# 3 roles: verifier (passport and address), validator (BioID - ensures uniqueness), leader (allocates roles and registrars)
from flask import Flask
from flask_cors import CORS
import time
from utils import get_ip
import os
import requests

# Init Flask app
app = Flask(__name__)
CORS(app)

# Store registrar nodes
nodes = []

def join_network():
    initial_registrars = os.environ.get('INITIAL_REGISTRARS', '[]')
    initial_registrars = initial_registrars.split(',')

    self = f'{ip}:{port}'
    if self in initial_registrars:
        initial_registrars.remove(self)
    
    for addr in initial_registrars:
        try:
            response = requests.get(f'http://{addr}/pollers')
            response.raise_for_status()
# + public key
            found_nodes = response.json()

            if self in found_nodes:
                found_nodes.remove(self)

            nodes.update(found_nodes)

            nodes.add(addr)
        except requests.exceptions.HTTPError:
            print(f"HTTP Error occurred for {addr}")
        except requests.exceptions.ConnectionError:
            print(f"Connection Error occurred for {addr}")
        except requests.exceptions.Timeout:
            print(f"Timeout Error occurred for {addr}")
        except requests.exceptions.RequestException:
            print(f"An unexpected error occurred for {addr}")

    if len(nodes) == 0:
        return False

if __name__ == "__main__":
    from argparse import ArgumentParser

    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=8000, type=int)
    parser.add_argument('-f', '--first', default=False, type=bool)
    parser.add_argument('-l', '--local', default=True, type=bool)
    args = parser.parse_args()
    port = args.port

    # Whether to use local addresses
    local = args.local

    # Wallet address of the poller so rewards can be claimed
    poller = args.reward

    first_poller = args.first

    if not first_poller:
        ip = '127.0.0.1' if local else get_ip()

        while not join_network(ip=ip, port=port, poller=poller):
            time.sleep(5)
            print('Retrying connection')
    else:
        port = port

    app.run(host='0.0.0.0', port=port, debug=True, threaded=True)
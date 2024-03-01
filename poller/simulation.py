# Fetch register public/private keys
# Get event details
# Get total time
# Get all pollers on the network 

# Calculate number of requests to send
  # Delay TXs to different pollers randomly on a levy distribution
  # 98% of user vote over the time
  # Calculate stack and time between each request
    # Calculate order of sent transactions then mix them up with randomness

# Advanced
# Tests
  # Attempts to double spend (revote)

import requests
from datetime import datetime, timedelta
from dateutil import parser
import numpy as np
from register_seeder import sign
import json
import math
import time

# Get public keys
public_register='register.txt'
register_file = open(public_register, 'r')
public_keys = register_file.read().splitlines()
register_file.close()

# Get private keys
private_register='private_register.txt'
register_file = open(private_register, 'r')
private_keys = register_file.read().splitlines()
register_file.close()

# Get all pollers
trusted_poller = '127.0.0.1:5001'
pollers = requests.get(f'http://{trusted_poller}/pollers').json()
pollers.append(trusted_poller)

# Get Event
event = requests.get(f'http://{trusted_poller}/event').json()

candidateIds = [c['id'] for c in event['candidates']]

R = []
for i in range(len(public_keys)):
  candidateId = np.random.choice(candidateIds)
  tx = {
    'amount': 1,
    'sender': public_keys[i],
    'receiver': candidateId,
  }
  tx_string = json.dumps(tx, separators=(',', ':'))

  signature = sign(private_key=private_keys[i], plain_text=tx_string)
  tx['signature'] = signature

  R.extend([{'address': p, **tx} for p in pollers])

# Jumble R
# for i in range(len(public_keys)):
#   for j in range(len(pollers)):
#     index = j + i*len(pollers)
#     max_normal = len(pollers) * len(public_keys) - index - 1
#     normal_number = math.floor(abs(np.random.normal(0,1) * (max_normal/2)))
#     normal_number = normal_number if normal_number < max_normal else max_normal

#     R[index], R[index+normal_number] = R[index+normal_number], R[index]


# Calculate time in between to send each request
# start_time = parser.isoparse(event['start_date'])
# end_time = parser.isoparse(event['end_date'])
# now = datetime.now(start_time.tzinfo)
    
for r in R:
  address = r['address']
  json_data = {k: v for k, v in r.items() if k != 'address'}
  response = requests.post(f'http://{address}/transaction', json=json_data)
  print(address, json_data['sender'])
  time.sleep(1)




# https://pypi.org/project/ecdsa/
from ecdsa import SigningKey, SECP128r1

def create_key_pair():
    # Generate private and public key -> should use greater key size: curve=SECP256k1
    private_key = SigningKey.generate(curve=SECP128r1)
    public_key = private_key.get_verifying_key()

    # Convert to string bytes
    private_key_bytes = private_key.to_string()
    public_key_bytes = public_key.to_string()

    # Convert to more readable hex
    private_key_hex = private_key_bytes.hex()
    public_key_hex = public_key_bytes.hex()

    return public_key_hex, private_key_hex

# Create 20 wallets
key_pairs = [create_key_pair() for _ in range(20)]
public_keys = [public_key for public_key, _ in key_pairs]
private_keys = [private_key for _, private_key in key_pairs]

with open('register.txt', 'a') as file:
    for pk in public_keys:
        file.write(pk + "\n")

with open('private_register.txt', 'a') as file:
    for pk in private_keys:
        file.write(pk + "\n")




# Making keys readable

# private_key = SigningKey.generate(curve=SECP128r1)
# public_key = private_key.get_verifying_key()

# Convert to string bytes
# private_key_bytes = private_key.to_string()
# public_key_bytes = public_key.to_string()

# import base58
# public_key_base58 = base58.b58encode(public_key.to_string())
# print("Public Key in Base58:", public_key_base58.decode())

# from mnemonic import Mnemonic

# mnemo = Mnemonic("english")

# mnemonic_phrase = mnemo.to_mnemonic(private_key_bytes)
# print("Mnemonic Phrase:", mnemonic_phrase)

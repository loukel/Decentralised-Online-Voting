# https://pypi.org/project/ecdsa/
from ecdsa import SigningKey, SECP256k1, BadSignatureError, VerifyingKey, util
from hashlib import sha256

def create_key_pair():
    # Generate private and public key -> should use greater key size: curve=SECP256k1
    private_key = SigningKey.generate(curve=SECP256k1)
    public_key = private_key.get_verifying_key()

    # Convert to string bytes
    private_key_bytes = private_key.to_string()
    public_key_bytes = public_key.to_string()

    # Convert to more readable hex
    private_key_hex = private_key_bytes.hex()
    public_key_hex = public_key_bytes.hex()

    return public_key_hex, private_key_hex

def sign(private_key, plain_text):
    private_key_bytes = bytes.fromhex(private_key)
    signing_key = SigningKey.from_string(private_key_bytes, curve=SECP256k1)
    string_to_sign_bytes = plain_text.encode()
    signature = signing_key.sign(string_to_sign_bytes, sigencode=util.sigencode_der).hex()

    return signature

def verify_signature(signature, public_key, plain_text):
    try:
        # Convert hex back to bytes
        public_key_bytes = bytes.fromhex(public_key)
        signature_bytes = bytes.fromhex(signature)

        # Create a VerifyingKey object from the public key bytes
        verifying_key = VerifyingKey.from_string(public_key_bytes, curve=SECP256k1)
        # Verify the signature
        verified = verifying_key.verify(signature_bytes, plain_text.encode(), sigdecode=util.sigdecode_der)
        return verified
    except BadSignatureError as e:
        print(f'Invalid signature: {e}')
        return False
    except Exception as e:
        print(e)
        return False

if __name__ == "__main__":
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

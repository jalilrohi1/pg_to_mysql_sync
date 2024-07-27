import jwt
import datetime

# Define a secret key (in a real application, this should be stored securely)
SECRET_KEY = "your_secret_key_here"


# Function to create and sign a JWT
def create_jwt(payload, secret_key):
    # Add expiration time to the payload
    payload["exp"] = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    # Create and sign the token
    token = jwt.encode(payload, secret_key, algorithm="HS256")
    return token


# Function to verify a JWT
def verify_jwt(token, secret_key):
    try:
        # Decode the token
        decoded_token = jwt.decode(token, secret_key, algorithms=["HS256"])
        return decoded_token
    except jwt.ExpiredSignatureError:
        return "Token has expired"
    except jwt.InvalidTokenError:
        return "Invalid token"


# Define the payload
payload = {"user_id": 123, "username": "john_doe", "role": "admin"}

# Create and print the JWT
token = create_jwt(payload, SECRET_KEY)
print("Generated JWT:", token)

# Verify and print the result
decoded_payload = verify_jwt(token, SECRET_KEY)
print("Decoded JWT:", decoded_payload)

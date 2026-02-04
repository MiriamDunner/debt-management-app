import requests

url = 'http://127.0.0.1:8002/settle'
data = [
    {"name": "Alice", "email": "alice@example.com", "amount_paid": 100.0},
    {"name": "Bob", "email": "bob@example.com", "amount_paid": 50.0}
]

response = requests.post(url, json=data)
print("Status:", response.status_code)
print("Response:", response.json())
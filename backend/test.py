from main import calculate_settlements, Participant

participants = [
    Participant(name="Alice", email="alice@example.com", amount_paid=100),
    Participant(name="Bob", email="bob@example.com", amount_paid=50)
]

settlements = calculate_settlements(participants)
print("Settlements:", settlements)
print("Starting app")
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import smtplib
from email.mime.text import MIMEText

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Participant(BaseModel):
    name: str
    email: str
    amount_paid: float

def calculate_settlements(participants: List[Participant]):
    if not participants:
        return []
    total = sum(p.amount_paid for p in participants)
    share = total / len(participants)
    balances = {p.name: p.amount_paid - share for p in participants}
    # Sort by balance ascending (most negative first)
    sorted_bal = sorted(balances.items(), key=lambda x: x[1])
    settlements = []
    i = 0
    j = len(sorted_bal) - 1
    while i < j:
        if sorted_bal[i][1] >= 0:
            break
        if sorted_bal[j][1] <= 0:
            break
        amount = min(-sorted_bal[i][1], sorted_bal[j][1])
        settlements.append({
            "from_participant": sorted_bal[i][0],
            "to_participant": sorted_bal[j][0],
            "amount": round(amount, 2)
        })
        sorted_bal[i] = (sorted_bal[i][0], sorted_bal[i][1] + amount)
        sorted_bal[j] = (sorted_bal[j][0], sorted_bal[j][1] - amount)
        if sorted_bal[i][1] == 0:
            i += 1
        if sorted_bal[j][1] == 0:
            j -= 1
    return settlements

def send_email(to_email: str, subject: str, body: str):
    # For demo purposes, print the email
    print(f"Sending email to {to_email}:")
    print(f"Subject: {subject}")
    print(f"Body:\n{body}")
    print("-" * 50)
    # To send real email, uncomment and configure:
    # msg = MIMEText(body)
    # msg['Subject'] = subject
    # msg['From'] = 'your@email.com'
    # msg['To'] = to_email
    # with smtplib.SMTP('smtp.gmail.com', 587) as server:
    #     server.starttls()
    #     server.login('your@email.com', 'your_password')
    #     server.sendmail('your@email.com', to_email, msg.as_string())

@app.post("/settle")
def settle_expenses(participants: list = Body(...)):
    print("Received participants:", participants)
    parsed = []
    for p in participants:
        parsed.append(Participant(**p))
    try:
        settlements = calculate_settlements(parsed)
        print("Settlements:", settlements)
        # Group settlements by participant for emails
        owes = {}
        receives = {}
        for s in settlements:
            owes.setdefault(s['from_participant'], []).append((s['to_participant'], s['amount']))
            receives.setdefault(s['to_participant'], []).append((s['from_participant'], s['amount']))
        
        for p in parsed:
            body = f"Hello {p.name},\n\n"
            if p.name in owes:
                body += "You need to pay:\n"
                for to, amt in owes[p.name]:
                    body += f"- ${amt:.2f} to {to}\n"
                body += "\n"
            if p.name in receives:
                body += "You should receive:\n"
                for fr, amt in receives[p.name]:
                    body += f"- ${amt:.2f} from {fr}\n"
                body += "\n"
            if p.name not in owes and p.name not in receives:
                body += "You are all settled up!\n\n"
            # send_email(p.email, "Expense Settlement Notification", body)
        
        return settlements
    except Exception as e:
        print("Error:", e)
        import traceback
        traceback.print_exc()
        raise
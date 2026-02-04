# Expense Splitting Web Application

A modern, clean web application for splitting expenses among participants with automatic email notifications.

## Features

- Add participants with name, email, and amount paid
- Calculate fair share and settlements
- Minimize number of transactions
- Send email notifications to participants
- Responsive React frontend with Tailwind CSS
- FastAPI backend

## Setup

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

The backend will run on http://localhost:8002

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will run on http://localhost:5174 (or similar port if 5173 is in use)

## Usage

1. Open the frontend in your browser
2. Add participants by filling in name, email, and amount paid
3. Click "Add" to add each participant
4. View the summary table
5. Click "Settle Expenses" to calculate settlements
6. View the settlement results
7. Check the backend console for email notifications (printed for demo)

## Email Configuration

For production, configure the SMTP settings in `backend/main.py` in the `send_email` function.

## API

- POST `/settle`: Accepts list of participants, returns settlements and sends emails
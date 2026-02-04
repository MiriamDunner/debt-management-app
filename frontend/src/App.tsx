import { useState } from 'react'

interface Participant {
  name: string
  email: string
  amount_paid: number
}

interface Settlement {
  from_participant: string
  to_participant: string
  amount: number
}

function App() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [settlements, setSettlements] = useState<Settlement[]>([])
  const [loading, setLoading] = useState(false)

  const [error, setError] = useState('')

  const addParticipant = () => {
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const parsedAmount = parseFloat(amount)

    if (!trimmedName) {
      setError('Name is required')
      return
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Valid email is required')
      return
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be a positive number')
      return
    }

    setParticipants([...participants, { name: trimmedName, email: trimmedEmail, amount_paid: parsedAmount }])
    setName('')
    setEmail('')
    setAmount('')
    setError('')
  }

  const submitExpenses = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8002/settle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(participants)
      })
      const data = await response.json()
      setSettlements(data.settlements)
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Expense Splitting App</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Add Participants</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Amount Paid"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
            <button
              onClick={addParticipant}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Participants</h2>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Amount Paid</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">{p.email}</td>
                  <td className="px-4 py-2">${p.amount_paid.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={submitExpenses}
            disabled={loading || participants.length === 0}
            className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {loading ? 'Calculating...' : 'Settle Expenses'}
          </button>
        </div>

        {settlements.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Settlements</h2>
            <ul className="space-y-2">
              {settlements.map((s, i) => (
                <li key={i} className="text-lg">
                  {s.from_participant} pays ${s.amount.toFixed(2)} to {s.to_participant}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

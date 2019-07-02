const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())

// morgan token for req content body
morgan.token('content', (req, res) => {
  return JSON.stringify(req.body)
})
// Log all but 'POST'
app.use(morgan('tiny', {
  skip: (req, res) => (req.method === "POST")
}))
// Log 'POST' with content body
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content' , {
  skip: (req, res) => (req.method !== "POST")
}))

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  },
  {
    "name": "Ukko Uusi",
    "number": "045-123-1412",
    "id": 5
  }
]

// Get all persons
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// Get single person
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

// Delete person
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

// Add new person
app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }
  if (persons.find(p => p.name === body.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }
  
  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 10000)
  }

  persons.concat(person)

  res.json(person)
})

//Get info
app.get('/info', (req, res) => {
  const count = persons.length
  const info = `
    <div>
      <p>Phonebook has info for ${count} people</p>
      <p>${new Date()}</p>
    </div>`
  res.send(info)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
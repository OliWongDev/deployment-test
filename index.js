import express from "express"
import { UserModel } from "./db.js"

// Declare express under 'app' and assign a port number
const app = express()
const port = 4001

// Parses incoming requests with JSON headers
app.use(express.json())

// app.get/.put/.post etc is middle ware that comes with express and needs to go before 'app.listen'
// First parameter is the path, and can take a callback function second, which takes two parameters 'request' and 'response' (req, res)
// We can send responses using 'response.send()'.... This can be HTML, objects etc..
app.get('/', (req, res) => res.status(200).send({info: `Physio App 2023`}))


// Retrieve all Users
app.get('/users', async (req, res) => res.status(200).send(await UserModel.find()))

// Create an User
app.post('/signup/', async (req, res) => {
    try {
        const { username, email, password } = req.body

        const newUser = { username, email, password }

        const insertedUser = await UserModel.create(newUser)

        res.status(201).send(insertedUser)     
    }
    catch (err) {
         res.status(500).send({ error: err.message })
    }
})


// Tell express to listen for connections (default is localhost)
// Can add a callback function, in this case a console log showing the URL
app.listen(port, () => console.log(`App running at http://localhost:${port}`))


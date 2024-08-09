const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
import axios from 'axios'
const ManagerModal = require('./models/Manager')

const app = express()
app.use(cors())
app.post('/managers', async (req, res) => {
	const { username, password } = req.body

	try {
		await ManagerModal.create({ username, pwhash: password })
		res.send({ message: 'Credentials stored successfully.' })
	} catch (err) {
		console.error('Error storing credentials:', err)
		res.status(500).send({ message: 'Error storing credentials.' })
	}
})

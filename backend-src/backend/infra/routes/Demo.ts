const express = require('express')
const ManagerModal = require('../models/manager.model')

const app = express()

app.post('/', async (req, res) => {
	try {
		const { username, pwhash } = req.body
		const manager = await ManagerModal.create({ username, pwhash })
		res.send({ message: 'Credentials stored successfully.' }).json(manager)
	} catch (error) {
		console.error('Error storing credentials:', error)
	}
})

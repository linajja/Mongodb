import express from 'express'
import Orders from '../models/orders.js'

const Router = express.Router()

Router.post('/save-order', async (req, res) => {
    const newOrder = new Orders(req.body)
    newOrder.save()
        .then(result => {
            res.send({ message: "Užsakymas sėkmingai priimtas!" })
        })
        .catch(err => {
            res.send({ message: "Įvyko techninė klaida" })
        })
})

Router.get('/order-info', async (req, res) => {
    const data = await Orders.find()

    res.json(data)
})

export default Router
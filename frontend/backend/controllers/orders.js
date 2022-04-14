import express from 'express'
import Orders from '../models/orders.js'
import products from '../models/products.js'


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
    let data = await Orders.find()
    let index = 0;

    for (let order of data) {
        const product = await products.findOne({ _id: order.product })
        data[index].product = product.product_name
        index++
    }

    res.json(data)
})

Router.delete('/delete-order/:id', (req, res) => {
    let id = req.params.id
    Orders.findByIdAndDelete(id).exec()
    Orders.find((err, data) => {
        if (err)
            return console.log(err)

        res.json(data)

    })
})

export default Router
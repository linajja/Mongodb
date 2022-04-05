
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

const app = express()

app.use(cors())

app.use(express.json())

app.use(express.urlencoded({
    extended: false
}))

mongoose.connect('mongodb://localhost/OrderManagement', (err) => {
    if (!err)
        console.log('Prisijungimas prie duomenu bazes pavyko')
});

const productsSchema = new mongoose.Schema({
    product_name: String,
    description: String,
    price: Number,
    discount_price: Number
})

const Products = mongoose.model('Products', productsSchema, 'Products')

app.get('/show-products', async (req, res) => {
    const data = await Products.find()

    res.json(data)
})

app.listen(5001)
import express, { json } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

const app = express()
app.use(cors())

app.use(express.json())

app.use(express.urlencoded({
    extended: false
}))

const database = 'mongodb://localhost/OrderManagement'

mongoose.connect('mongodb://localhost/OrderManagement', (err) => {
    if (!err)
        console.log("Prisijungimas prie duomenų bazės pavyko")
});
const productsSchema = new mongoose.Schema({
    product_name: String,
    description: String,
    price: String,
    discount_price: String
})

const products = mongoose.model('Products', productsSchema, 'Products')

// newPost.content = "Test"
// newPost.data = '2022-03-30'
// newPost.save()

app.get('/show-data', (req, res) => {
    products.find((err, data) => {
        if (err)
            return console.log(err)
        res.json(data)
    })
})

app.delete('/delete-data/:id', (req, res) => {
    let id = req.params.id
    products.findByIdAndDelete(id).exec()
    products.find((err, data) => {
        if (err)
            return console.log(err)
        res.json(data)
    })
})

app.post('/save-data', (req, res) => {
    const newPost = new products()
    if (
        req.body.product_name === "" ||
        req.body.description === "" ||
        req.body.price === "" ||
        req.body.discount_price === ""
    ) {
        res.send('Užpildykite duomenis')

    } else {
        newPost.product_name = req.body.product_name
        newPost.description = req.body.description
        newPost.price = req.body.price
        newPost.discount_price = req.body.discount_price
        newPost.save()
        res.send({ message: "Failas įrašytas", product_name: req.body.product_name, description: req.body.description, price: req.body.price, discount_price: req.body.discount_price })

    }
})

// let post = posts.findByIdAndUpdate('6245d03761d2b4a7df2b73f2', {
//     content: "Programiskai redaguotas irasas"
// })
//     .then(data => {
//         console.log('Irasas sekmingai atnaujintas')
//     })


app.put('/edit-data/:id', (req, res) => {
    let id = req.params.id
    let product_name = req.body.product_name
    products.findByIdAndUpdate(id, {
        product_name: product_name,
    })
        .then(data => {
            res.send("Info changed")
        })

})





app.listen(5001, () => {
    console.log('Serveris veikia')
})
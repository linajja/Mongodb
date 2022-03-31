import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

const app = express()
app.use(cors())

app.use(express.json())

app.use(express.urlencoded({
    extended: false
}))

const database = 'mongodb://localhost/facebook'

mongoose.connect('mongodb://localhost/facebook', (err) => {
    if (!err)
        console.log("Prisijungimas prie duomenų bazės pavyko")
});
const postsSchema = new mongoose.Schema({
    content: String,
    data: Date
})

const posts = mongoose.model('posts', postsSchema)

// newPost.content = "Test"
// newPost.data = '2022-03-30'
// newPost.save()

app.get('/show-data', (req, res) => {
    posts.find((err, data) => {
        if (err)
            return console.log(err)
        res.json(data)
    })
})

app.delete('/delete-data/:id', (req, res) => {
    posts.findByIdAndDelete(req.body._id).exec()
    posts.find((err, data) => {
        if (err)
            return console.log(err)

        res.send(data)
    })
})

app.post('/save-data', (req, res) => {
    const newPost = new posts()
    if (
        req.body.content === "" ||
        req.body.data === ""
    ) {
        res.send('Užpildykite duomenis')

    } else {
        newPost.content = req.body.content
        newPost.data = req.body.data
        newPost.save()
        res.send({ message: "Failas įrašytas", content: req.body.content, data: req.body.data })

    }
})

app.listen(5001, () => {
    console.log('Serveris veikia')
})
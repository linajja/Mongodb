import express, { response } from 'express'
import mongoose from 'mongoose'
import { writeFile, readFile } from 'fs'

const app = express()

app.use(express.json())

app.use(express.urlencoded({
    extended: false
}))


// const newPost = new posts()
// newPost.content = "Test"
// newPost.data = '2022-03-30'
// newPost.save()


app.post('/save-data', (req, res) => {
    // mongoose.connect('mongodb://localhost/facebook', (err) => {
    //     if (!err)
    //         res.send("Prisijungimas prie duomenų bazės pavyko")
    // });

    const posts = mongoose.model('posts', postsSchema)
    const newPost = new posts()
    if (
        newPost.content != "" &&
        newPost.data != ""
    ) {
        res.send('Uzpildykite duomenis')

    } else {
        writeFile(req.body.content, req.body.date, 'utf8', err => {
            if (err) {
                res.send('Nepavyko įrašyti failo')
            }
            newPost.save()
            res.send("Duomenys sekmingai issaugoti")
        })

    }
})


app.listen(5001, () => {
    console.log('Serveris veikia')
})
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'

dotenv.config();

mongoose.connect(process.env.mongoConnect).then(() => {
  console.log("Connect to MONGODB")
}).catch((err) => {
  console.log(err)
})

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
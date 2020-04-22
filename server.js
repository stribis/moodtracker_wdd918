const express = require('express')
const Datastore = require('nedb')
const fetch = require('node-fetch')
require('dotenv').config()

const app = express()

const port = process.env.PORT || 3000

app.listen( port, () => {
  console.log(`App is listening at port : ${port}`)
})
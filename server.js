const express = require('express')
const Datastore = require('nedb')
const fetch = require('node-fetch')
require('dotenv').config()

const app = express()

const port = process.env.PORT || 3004

app.listen( port, () => {
  console.log(`App is listening at port : ${port}`)
})

app.use(express.static('public'))

//* Limit JSON size */
app.use(express.json({
  limit: '1mb'
}))

// We only need one database, lets call it 'database' and load it from database/database.db
const database = new Datastore('database/database.db')
// make sure to load the database
database.loadDatabase()
// We can start making our API endpoints



  // GET /api
// app.get('/api', (req, res) => {

// })

  // POST /api
// app.post('/api', (req, res) => {

// })


// Weather API Endpoint

app.get('/weather/:latlon', async (req, res) => {
  const latlon = req.params.latlon.split(',')
  const lat = latlon[0]
  const lon = latlon[1]
  // Api Keys
  const apiKey = process.env.API_KEY
  
  const weatherUrl = `https://api.darksky.net/forecast/${apiKey}/${lat},${lon}`
  const weatherResponse = await fetch(weatherUrl)
  const weatherJSON = await weatherResponse.json()


  const data = {  
    weather: weatherJSON,
  }

  res.json(data)

})

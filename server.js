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
app.get('/api', (req, res) => {
  // Send the information from the database to the client
  database.find({}, (err, data) => {
    if (err) {
      console.error(err)
      res.end()
    }
    // send data to client
    res.json(data)
  })
})

  // POST /api
app.post('/api', (req, res) => {
  console.log('Database post endpoint got a request')
  const data = req.body
  const timestamp = Date.now()
  data.timestamp = timestamp
  database.insert(data)
  res.json(data)
})


// Weather API Endpoint

app.get('/weather/:latlon', async (req, res) => {
  const latlon = req.params.latlon.split(',')
  const lat = latlon[0]
  const lon = latlon[1]
  // Api Keys
  const apiKey = process.env.API_KEY
  const apiKey2 = process.env.API_KEY2
  // request for weather
  const weatherUrl = `https://api.darksky.net/forecast/${apiKey}/${lat},${lon}`
  const weatherResponse = await fetch(weatherUrl)
  const weatherJSON = await weatherResponse.json()
  // request for AQI
  const aqUrl = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${apiKey2}`
  const aqResponse = await fetch(aqUrl)
  const aqJson = await aqResponse.json()


  const data = {  
    weather: weatherJSON,
    air_quality: aqJson
  }

  res.json(data)

})

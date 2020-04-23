// Start the p5js setup function 
function setup () {
  // Remove Canvas
  noCanvas()
  // Capture video from webcam
  const video = createCapture(VIDEO)
  video.parent('main-container')
  video.size(320, 240)

  //Geo-locate
  let lat, lon
  let air, weather, city
  if ('geolocation' in navigator){
    //console.log(navigator)
    navigator.geolocation.getCurrentPosition( async function(position) {
      try {
        lat = position.coords.latitude
        lon = position.coords.longitude
        // Use the weather api with latitude and longitude to get the weather
        const apiUrl = `weather/${lat},${lon}`

        const response = await fetch(apiUrl)
        const json = await response.json()
        console.log(json)

        city = json.weather.timezone
        weather = json.weather.currently
        air = json.air_quality.data.aqi

        const template = `<div class="more_info">
        <div class="weatherDis" >
          <i class="fas fa-thermometer-empty"></i>
          <div>
            <div class="temp">${weather.temperature}</div>
            <div class="summary">${weather.summary}</div>
          </div>
        </div>
        <div>
          <i class="fas fa-map-marker-alt"></i>
          <p class="location" title="${lat}°, ${lon}°" >${city}</p>
        </div>
        <div class="airDis" >
          <div><i class="fas fa-wind"></i></div>
          <div>
            <div class="aqi">AQI: ${air}</div>
          </div>
          
        </div>
      </div>`

      const weatherDiv = document.createElement('div')
      weatherDiv.innerHTML = template
      document.querySelector('main').append(weatherDiv)

        
        
      }catch(error){
        console.log(error)
      }
    })
  } else {
    console.log('geolocation is not available')
  }
  

  document.querySelector('button').addEventListener( 'click', async e => {
    e.preventDefault()
    // Get mood from user input
    const mood = document.querySelector('input').value
    video.loadPixels()
    const image64 = video.canvas.toDataURL()
    // Save other objects
    const location = {}
    const weather_status= {}
    const mood_info = {}
    // Mood data
    mood_info.mood = mood
    mood_info.face = image64
    // Location Data
    location.latitude = lat
    location.longitude = lon
    location.city = city
    // Weather Data
    weather_status.summary = weather.summary
    weather_status.temperature = weather.temperature

    const data = { location, mood_info, weather_status, air}

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
    // Send data to API endpoint
    const response = await fetch('/api', options)
    const json = await response.json()

    console.log(json)

  })

}
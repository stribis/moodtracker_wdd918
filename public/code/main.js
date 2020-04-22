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

        const city = json.weather.timezone
        const weather = json.weather.currently

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
            <div class="aqi">AQI:</div>
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
 

}
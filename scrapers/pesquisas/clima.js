const apiKey = "ac3976b1ab5f5c70fec9cd0a2b2bb9df"
const getWeatherData = async (nome) => {
const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${nome}&units=metric&appid=${apiKey}&lang=pt_br`
const res = await fetch(apiWeatherURL)
const data = await res.json()
return data
}
const showWeatherData = (data) => {
const weatherInfo = {
city: data.name,
temperature: parseInt(data.main.temp),
description: data.weather[0].description,
weatherIcon: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
countryFlag: `https://flagsapi.com/${data.sys.country}/flat/64.png`,
humidity: `${data.main.humidity}%`,
windSpeed: `${data.wind.speed}km/h`
}
console.log(weatherInfo) 
return weatherInfo
}
module.exports = { getWeatherData }
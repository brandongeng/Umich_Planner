const PORT = 8000
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const NodeGeocoder = require('node-geocoder');
require('dotenv').config()

const app = express()
app.listen(8000, ()=>{console.log(`Server is running on port ${PORT}`)})

app.use(cors())

app.get('/', (req,res) => {
    res.json('hi')
})

app.get('/weather', (req,res)=>{

    const options = {
        method: 'get',
        url: `https://api.openweathermap.org/data/2.5/weather?lat=42.279594&lon=-83.732124&units=imperial&appid=${REACT_APP_OPEN_WEATHER_KEY}`
    }
    axios.request(options).then((response)=>{
        res.json(response.data)
    }).catch((error)=>{
        console.log(error)
        res.json(response.data)
    })
})

app.get('/location', (req,res)=>{
    const options = {
        provider: "google",
        apiKey: process.env.REACT_APP_MAPS_API_KEY,
        formatter: null 
    }
    const fullName = req.query.fullName
    const geocoder = NodeGeocoder(options);
    geocoder.geocode(fullName).then((response)=>{
        res.json({lat: response[0].latitude, lng: response[0].longitude});
    }).catch((err)=> {
        console.log(err);
    });
})

app.get('/walking', (req,res)=>{
    const options = {
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/directions/json?origin=${req.query.origin}&destination=${req.query.destination}&mode=walking&key=${process.env.REACT_APP_MAPS_API_KEY}`
    }
    axios.request(options).then((response)=>{
        res.json(response.data)
    }).catch((error)=>{
        console.log(error)
    })
})

app.get('/transit', (req,res)=>{
    const options = {
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/directions/json?origin=${req.query.origin}&destination=${req.query.destination}&mode=transit&key=${process.env.REACT_APP_MAPS_API_KEY}`
    }
    axios.request(options).then((response)=>{
        res.json(response.data)
    }).catch((error)=>{
        console.log(error)
    })
})



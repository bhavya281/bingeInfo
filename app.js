const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const port = process.env.PORT || 3000;

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('home')
})
app.get('/movies', (req, res) => {
    res.render('display/movie')
})
app.get('/series', (req, res) => {
    res.render('display/series')
})
app.get('/random', (req, res) => {
    res.render('display/random')
})
app.listen(port, () => {
    console.log("Port Running")
})
const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('<html><h1>sdasdsdasda</h1></html>'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))
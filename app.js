const express = require('express');
const path = require('path');
const app = express();
var port = 3000;
app.use(express.static(path.join(__dirname,"public")));
app.get('/', (req, res) => {
    res.sendfile(path.join(__dirname,"views/index.html"));
});

app.listen(port, () => console.log('Listening port:' + port));
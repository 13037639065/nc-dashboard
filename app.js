const express = require('express');
const path = require('path');
const app = express();
const request = require("request");

var port = 3000;
app.use(express.static(path.join(__dirname, "public")));

////////////////////////////////////////////////////////////////////
//construct request url 
function construcUrl(name, token, url) {
    var resUrl = url;
    var pos = resUrl.indexOf("://");
    if (pos != -1) {
        resUrl = resUrl.slice(0, pos + 3) + name + ':' + token + '@' + resUrl.slice(pos + 3);
    }
    if (resUrl.charAt(resUrl.length - 1) == '/') {
        resUrl = resUrl.slice(0, resUrl.length - 1);
    }
    return resUrl;
}

////////////////////////////////////////////////////////////////////
// route

app.get('/', (req, res) => {
    res.sendfile(path.join(__dirname, "views/index.html"));
});

app.get('/status/:id', (req, res) => {
    var id = parseInt(req.params.id);
    var data = require(path.join(__dirname, "data/projects.json"));
    if (id >= data.length || id < 0) {
        res.send("The project does not exist");
        return;
    }
    var info = data[id];
    var url = construcUrl(info.user, info.token, info.url) + "/api/json";
    try {
        request.get(url, function (err, response) {
            res.send(response.body);
        });
    }
    catch(err) {
        res.send("request error!");
    }
})

// return projects.json
app.get('/data', (req, res) => {
    var data = require(path.join(__dirname, "data/projects.json"));
    data.forEach(element => {
        element.token = "******";
    });
    res.send(data);
});


////////////////////////////////////////////////////////////////////

app.listen(port, () => console.log('Listening port:' + port));
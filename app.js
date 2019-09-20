const express = require('express');
const path = require('path');
const app = express();
const request = require("request");
const fs = require('fs');

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
    var data = JSON.parse(fs.readFileSync(path.join(__dirname, "data/projects.json"), 'utf8'));
    if (id >= data.length || id < 0) {
        res.send("The project does not exist");
        return;
    }
    var info = data[id];
    var url = construcUrl(info.user, info.token, info.url) + "/api/json?tree=color,lastBuild[timestamp]";
    try {
        request.get(url, function (err, response) {
            var status;
            try {
                status = JSON.parse(response.body);
            }
            catch (e) {
                return;
            }
            var color = status['color'];
            if (status['color'].indexOf("_anime") != -1) {
                color = status['color'].substr(0, status['color'].length - 6) + " building";
            }
            var ret = {
                color: color,
                timestamp: status['lastBuild'] ? status['lastBuild']["timestamp"] : 0
            }
            res.send(ret);
        });
    }
    catch (err) {
        res.send("request error!");
    }
})

// return projects.json
app.get('/data', (req, res) => {
    var data = JSON.parse(fs.readFileSync(path.join(__dirname, "data/projects.json"), 'utf8'));
    data.forEach(element => {
        element.token = "******";
    });
    res.send(data);
});


////////////////////////////////////////////////////////////////////

app.listen(port, () => console.log('Listening port:' + port));
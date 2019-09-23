var width = window.innerWidth;
var height = window.innerHeight;
var projects = null;

$.get("/data", function (json) {
    projects = json;
    var data = constructD3Data();
    var treemap = d3.treemap()
        .tile(d3.treemapResquarify)
        .size([width, height])
        .round(true)
        .paddingInner(5);

    var hi = d3.hierarchy(data).sum(function (d) { return d.size; })
        .sort(function (a, b) { return b.value - a.value; });

    // 设置不同的平铺策略，d3js本身提供以下几种内置的策略可供选用 (treemapBinary, treemapDice, treemapSlice, treemapSliceDice, treemapSquarify) 
    treemap.tile(d3.treemapSquarify);

    treemap(hi);

    hi.children.forEach(element => {
        addOneBox(element.data.id, element.x0, element.y0, element.x1, element.y1);
    });
    updateAllProjects();
});

function constructD3Data() {
    var data = {
        "name": "Nc-dashboard",
        "children": []
    }
    var id = 0;
    projects.forEach(element => {
        element.id = id++;
        data['children'].push({
            name: element.name,
            size: element.importance,
            id: element.id
        });
    });
    return data;
}

function addOneBox(id, x0, y0, x1, y1) {
    var pos = document.getElementById("NC-DashBoard");
    pos.innerHTML = pos.innerHTML + `<div id='${id}' style='left:${x0}px;top:${y0}px;\
        width:${x1 - x0}px;height:${y1 - y0}px;'><div id='${id}-name' class='text-name'></div></div>`;
}

////////////////////////////////////////////////////////////////////////////////////////////

//schedule
setInterval(updateAllProjects, 5000);


// for update
function updateAllProjects() {
    projects.forEach(element => {
        updateProject(element.id);
    });
}
function updateProject(id) {
    $("#" + id).addClass("blue");
    $("#" + id + "-name").html("<h1>"+projects[id].name+"</h1>");
    $.getJSON("/status/" + id, function (data) {
        $("#" + id).removeClass();
        $("#" + id).addClass(data.color);
    });
}
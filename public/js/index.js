var width = window.innerWidth;
var height = window.innerHeight;

d3.json("/data").then(function (json) {
    var data = constructD3Data(json);
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

    hi.children.forEach(element=>{
        console.log(element);
        addOneBox(element.data.name,element.x0,element.y0,element.x1,element.y1);
        //addOneBox(element.)
    });
})

function constructD3Data(oriData) {
    var data = {
        "name": "Nc-dashboard",
        "children": []
    }
    oriData.forEach(element => {
        data['children'].push({
            name: element.name,
            size: element.importance
        });
    });
    return data;
}

function addOneBox(id,x0,y0,x1,y1) {
    var pos = document.getElementById("NC-DashBoard");
    pos.innerHTML = pos.innerHTML + `<div id='${id}' style='left:${x0}px;top:${y0}px;\
        width:${x1-x0}px;height:${y1-y0}px;background-color: #3fa7f2;'></div>`;
}
var width =screen.width, height = screen.height;
var daats = d3.json("/data");

daats.then(function (json) {
    var data = constructD3Data(json);
    var treemap = d3.treemap()
        .tile(d3.treemapResquarify)
        .size([width, height])
        .round(true)
        .paddingInner(10);

    var hi = d3.hierarchy(data).sum(function (d) { return d.size; })
        .sort(function (a, b) { return b.value - a.value; });

    // 设置不同的平铺策略，d3js本身提供以下几种内置的策略可供选用 (treemapBinary, treemapDice, treemapSlice, treemapSliceDice, treemapSquarify) 
    treemap.tile(d3.treemapSquarify);

    treemap(hi);

    var svg = d3.select("svg");
    var nodes = svg.selectAll("g")
        .data(hi.leaves())
        .enter().append("g");

    nodes.append("rect")
        .attr("x", function (d) { return d.x0; })
        .attr("y", function (d) { return d.y0; })
        .attr("width", function (d) { return d.x1 - d.x0; })
        .attr("height", function (d) { return d.y1 - d.y0; })
        .attr("fill", function (d) { return "blue"; });

    nodes.append("text")
        .attr("x", function (d) { return d.x0; })
        .attr("y", function (d) { return d.y0; })
        .attr("dx", "0.5em")
        .attr("dy", "1.5em")
        .attr("fill", "red")
        .attr("font-size", 30)
        .text(function (d) {
            return d.data.name + ":" + d.data.size;
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


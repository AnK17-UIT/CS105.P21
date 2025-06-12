var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var width = canvas.width = 800;
var height = canvas.height = 600;

var painter = {
    points: [],
    addPoint: function (p) {
        this.points.push(p);
    },
    draw: function (p1, p2) {
        if (!p1 || !p2) return;
        
        var x0 = p1[0], y0 = p1[1];
        var x1 = p2[0], y1 = p2[1];
        
        var dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
        var sx = (x0 < x1) ? 1 : -1;
        var sy = (y0 < y1) ? 1 : -1;
        var err = dx - dy;
        
        while (true) {
            context.fillRect(x0, y0, 1, 1);
            if (x0 === x1 && y0 === y1) break;
            var e2 = 2 * err;
            if (e2 > -dy) { err -= dy; x0 += sx; }
            if (e2 < dx) { err += dx; y0 += sy; }
        }
    }
}

function getPosOnCanvas(x, y) {
    var bbox = canvas.getBoundingClientRect();
    return [Math.floor(x - bbox.left), Math.floor(y - bbox.top)];
}

canvas.addEventListener("mousedown", function (e) {
    var p = getPosOnCanvas(e.clientX, e.clientY);
    painter.addPoint(p);
    if (painter.points.length === 2) {
        painter.draw(painter.points[0], painter.points[1]);
        painter.points = [];
    }
})

// Do mouse down
// Do key down (up)
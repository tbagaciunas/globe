var width = 700,
    height = 700,
    speed = -1e-2,
    start = Date.now();

var sphere = {type: "Sphere"};

var projection = d3.geo.orthographic()
    .scale(width / 2.1)
    .translate([width / 2, height / 2])
    .precision(.5);

var graticule = d3.geo.graticule();

var canvas = d3.select("body").append("canvas")
    .attr("width", width)
    .attr("height", height);

var context = canvas.node().getContext("2d");

var path = d3.geo.path()
    .projection(projection)
    .context(context);

d3.json("https://s3-us-west-2.amazonaws.com/s.cdpn.io/95802/world-110m.json", function(error, topo) {
  if (error) throw error;

  var land = topojson.feature(topo, topo.objects.land),
      grid = graticule();

  d3.timer(function() {
    context.clearRect(0, 0, width, height);

    projection.rotate([speed * (Date.now() - start), -15]).clipAngle(90);

    context.beginPath();
    path(sphere);
    context.lineWidth = 0;
    context.strokeStyle = "transparent";
    context.stroke();
    context.fillStyle = "transparent";
    context.fill();

    projection.clipAngle(180);

    context.beginPath();
    path(land);
    context.fillStyle = "#0057CC";
    context.fill();

    context.beginPath();
    path(grid);
    context.lineWidth = .5;
    context.strokeStyle = "rgba(119,119,119,0)";
    context.stroke();

    projection.clipAngle(90);

    context.beginPath();
    path(land);
    context.fillStyle = "#19008E";
    context.fill();
    context.lineWidth = 0;
    context.strokeStyle = "transparent";
    context.stroke();
  });
});

d3.select(self.frameElement).style("height", height + "px");

/*Config Data File Starts*/
/*-- Scaling Functions Starts ---*/
var DragDropScale; //For Drag and Drop Scaling
var click = { x: 0, y: 0 };
var zoomFactor = 1;
function resizeHandler() {
  setTimeout(function () {
    var stageRef = $("#wrapper");
    //var _window = window.nativeWindow();
    var stageWidth = 780;
    var stageHeight = 750;
    var newWidth = 0;
    var newLeft = 0;
    var scale = { x: 0, y: 0 };
    var x = Number(Math.max(document.documentElement.clientWidth, window.innerWidth || 0)) / stageWidth;
    var y = Number(Math.max(document.documentElement.clientHeight, window.innerHeight || 0)) / stageHeight;

    if (x < y) { scale = { x: x, y: x }; }
    else { scale = { x: y, y: y }; }
    newWidth = Number(scale.x) * stageWidth;
    newLeft = (Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - newWidth) / 2;
    DragDropScale = scale;
    var TempTop = $("#wrapper").offset().top;
    var stageScaling = "-webkit-transform: scale(" + scale.x + "," + scale.y + "); -moz-transform: scale(" + scale.x + "," + scale.y + "); -ms-transform: scale(" + scale.x + "," + scale.y + "); -o-transform: scale(" + scale.x + "," + scale.y + "); transform: scale(" + scale.x + "," + scale.y + "); -webkit-transform-origin: left top; -moz-transform-origin: left top; -ms-transform-origin: left top; -o-transform-origin: left top; transform-origin: left top; position: fixed; top: 0px; left:" + newLeft + "px";
    document.getElementById("wrapper").setAttribute("style", stageScaling);

  }, 10);
}

$(window).resize(function () {
  resizeHandler()
  //$(window).scrollTop(0,0);
});

/*-- Scaling Functions Ends ---*/
var n;
var circle_being_moved = null;
var cX = 0;
var cY = 0;

function init() {
	console.info("initialized");
	var stage = new createjs.Stage("game");
	createjs.Ticker.framerate = 30;
	createjs.Ticker.timingMode =
			createjs.Ticker.RAF_SYNCHED;  
	createjs.Ticker.addEventListener(
		'tick',
		stage
	);
	
	/*var bg = new createjs.Shape();
	stage.addChild(bg);
	bg.graphics
		.beginFill("LightCyan") //цвет
		.drawRect(-250, -150, 500, 300);
	bg.x = 250;
	bg.y = 150;*/
	
	n = 10;
	
	var matrix = createGraph(n);
	var pLoc = createLocations(n);
	var circles = new Array();
	for(var i = 0; i < n; i++) {
		circles[i] = new createjs.Shape();
		stage.addChild(circles[i]);
		circles[i]
		.graphics 
		.beginFill("DeepSkyBlue")
		.drawCircle(0, 0, 10);
		circles[i].x = pLoc[i][0] + 250;
		circles[i].y = pLoc[i][1] + 150;
		circles[i].addEventListener( 
			"mousedown",
			function(event) {
				cX = event.localX;
				cY = event.localY;
			    circle_being_moved = event.target;
				stage.update();
			}
		); 		
	}
	var lines = new Array();
	for(var i = 0; i < n; i++) {
		for(var j = i + 1; j < n; j++) {
			if(matrix[i][j] == 1) {
				lines.push(
					{
						point1: circles[i],
						point2: circles[j],
						shape: new createjs.Shape(),
						crossed: false
					}
				)
				var l = lines[lines.length - 1];
				stage.addChild(l.shape);
			}
		}
	}
	checkLines(lines);
	lines.forEach(function(item, i, lines) {
		var g = item.shape.graphics;
		g.clear();
		g.setStrokeStyle(3);
		if (item.crossed) {
			g.beginStroke("red");
		} else {
			g.beginStroke("green");
		}	
		g.moveTo(item.point1.x, item.point1.y);
		g.lineTo(item.point2.x, item.point2.y);
		g.endStroke();
		});
	
	stage.addEventListener(
		"stagemouseup",
		function() {
			circle_being_moved = null;
			console.info("pressup");
			checkEnd(lines);
		}
	);
	stage.addEventListener(
		"stagemousemove",
		function(event) {
			if(circle_being_moved != null) {
				circle_being_moved.x = event.stageX - cX;
				circle_being_moved.y = event.stageY - cY;
				checkLines(lines);
				lines.forEach(function(item, i, lines) {
					var g = item.shape.graphics;
					console.info("!!!");
					g.clear();
					g.setStrokeStyle(3);
					if (item.crossed) {
						g.beginStroke("red");
					} else {
						g.beginStroke("green");
					}	
					g.moveTo(item.point1.x, item.point1.y);
					g.lineTo(item.point2.x, item.point2.y);
					g.endStroke();
				});
				stage.update();
			}
		}
	);
	stage.update(); 
}

function checkEnd(lines) {
	for(var i = 0; i < lines.length; i++){
		for(var j = 0; j < lines.length; j++){
			var onePoint = lines[i].point1 == lines[j].point1 ||
			lines[i].point1 == lines[j].point2 ||
			lines[i].point2 == lines[j].point1 ||
			lines[i].point2 == lines[j].point2;
			if(!onePoint) {
				if(checkCross(lines[i], lines[j])) {
					return false;
				}
			}			
		}
	}
	endOfGame();
	return true;
}

function endOfGame() {
	console.info('Win');
}

function checkLines(lines) {
	for(var i = 0; i < lines.length; i++){
		var crossedI = false;
		for(var j = 0; j < lines.length; j++){
			var onePoint = lines[i].point1 == lines[j].point1 ||
			lines[i].point1 == lines[j].point2 ||
			lines[i].point2 == lines[j].point1 ||
			lines[i].point2 == lines[j].point2;
			if(!onePoint) {
				if(checkCross(lines[i], lines[j])) {
					crossedI = true;
					break;
				}
			}			
		}
		lines[i].crossed = crossedI;
		
	}					
}

function checkCross(line1, line2) {
	var y1 = line1.point1.y;
	var y2 = line1.point2.y;
	var x1 = line1.point1.x;
	var x2 = line1.point2.x;
	var a = (y1 - y2)*line2.point1.x + (x2 - x1)*line2.point1.y + (x1*y2 - x2*y1);
	var b = (y1 - y2)*line2.point2.x + (x2 - x1)*line2.point2.y + (x1*y2 - x2*y1);
	if (a*b < 0) {
		var y1 = line2.point1.y;
		var y2 = line2.point2.y;
		var x1 = line2.point1.x;
		var x2 = line2.point2.x;
		a = (y1 - y2)*line1.point1.x + (x2 - x1)*line1.point1.y + (x1*y2 - x2*y1);
		b = (y1 - y2)*line1.point2.x + (x2 - x1)*line1.point2.y + (x1*y2 - x2*y1);
		if(a*b < 0) {
			return true;
		}
	}
	return false;
	
}

function createGraph(n) {
	var matrix = new Array();
    for(var i = 0; i < n; i++) {
		matrix[i] = new Array();
		for(var j = 0; j < n; j++) {
			matrix[i][j] = 0;
		}
	}
	for(var i = 1; i < n; i++) {
		j = getRandomInt(0, i);
		matrix[i][j] = 1;
		matrix[j][i] = 1;
	}
	var r = getRandomInt(1.5 * n, 2 * n);
	for(var i = 1; i < r; i++) {
		x = getRandomInt(0, n);
		y = getRandomInt(0, n);
		if(x != y) {
			matrix[x][y] = 1;
			matrix[y][x] = 1;
		} else {
			r++;
		}
		
	}
  return matrix;
}

function createLocations(n) {
	var pLoc = new Array();
	var a = 2 * Math.PI / n;
	for(var i = 0; i < n; i++) {
		pLoc[i] = new Array();
		pLoc[i][0] = Math.round(Math.cos(i * a) * 70);
		pLoc[i][1] = Math.round(Math.sin(i * a) * 70);
		
	}
	return pLoc;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

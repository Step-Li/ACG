var img = new Image();
img.src = "bg.jpg";

function init() {
	console.info("initialized animation");
	var canvas = document.getElementById("game");
	var ctx = canvas.getContext('2d');
	
	ctx.translate(canvas.width / 2, canvas.height / 2);
	
	var poland = new Image();
    poland.src = "poland.png";
	var boom = new Image();
    boom.src = "boom.png";
	requestAnimationFrame(draw_frame);
	var program_start_time = new Date().getTime();
	var FRAMES_PER_SECONS = 10;
	var POLAND_SPRITE = {
	  x0: 0, y0: 0,
	  w: 113, h: 113,
	  num: 4  
    };
	var BOOM_SPRITE = {
	  x0: 0, y0: 0,
	  w: 100, h: 100,
	  num: 15  
    };
	var b = [{
		X: 250,
		Y: 100,
		size: 30,
		dX: 1,
		dY: -1,
		deleted: false,
		count: 0,
		oldFrame: 0
	}, {
		X: 150,
		Y: 80,
		size: 40,
		dX: -4,
		dY: -2,
		deleted: false,
		count: 0,
		oldFrame: 0
	}, {
		X: 350,
		Y: 200,
		size: 50,
		dX: 2,
		dY: 3,
		deleted: false,
		count: 0,
		oldFrame: 0
	}];
	
	rectX1 = 100;
	rectX2 = 400;
	rectY1 = 50;
	rectY2 = 250;
	lw = 10;
	
	canvas.addEventListener("mousedown", function(event) {
		var deleted = false;
		for (var i = 0; i < b.length; i++) {
			console.info(event.offsetX + " " + b[i].X);
			console.info(event.offsetY + " " + b[i].Y);
			if(Math.sqrt((event.offsetX - b[i].X - (b[i].size / 2))*(event.offsetX - b[i].X - (b[i].size / 2)) + 
				(event.offsetY - b[i].Y - (b[i].size / 2))*(event.offsetY - b[i].Y - (b[i].size / 2))) < (b[i].size / 2)) {
				b[i].deleted = true;
				deleted = true;
			}
		}
		if(!deleted) {
			var size = getRandomInt(30, 80);
			b.push({
					X: event.offsetX - (size / 2),
					Y: event.offsetY - (size / 2),
					size: size,
					dX: getRandomInt(-3, 4),
					dY: getRandomInt(-3, 4),
					deleted: false,
					count: 0,
					oldFrame: 0
				});
		}
	});	
		
	
	function draw_frame() {
		requestAnimationFrame(draw_frame);
		var current_time = new Date().getTime();
		var time_from_start = current_time - program_start_time;
		var frame = Math.round(
			time_from_start / 1000 * FRAMES_PER_SECONS
		);
		
		ctx.save();
		ctx.translate(-canvas.width / 2 , -canvas.height / 2);
		
		//фон прямоугольника
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		var pattern = ctx.createPattern(img, "repeat");
		ctx.fillStyle = pattern;
		ctx.fillRect(rectX1, rectY1, rectX2 - rectX1, rectY2 - rectY1);
		
		//обводка прямоугольника
		ctx.lineCap = "round";
		ctx.lineWidth = lw;
		ctx.strokeStyle = "rgba(178, 34, 34, 0.7)";
		ctx.strokeRect(rectX1, rectY1, rectX2 - rectX1, rectY2 - rectY1);
		
		//кружки-польши
		for (var i = 0; i < b.length; i++) {
			if(b[i].deleted) {
				var sprite_x = BOOM_SPRITE.x0 + BOOM_SPRITE.w * b[i].count;
				ctx.drawImage(
				boom, 
				sprite_x, BOOM_SPRITE.y0, 
				BOOM_SPRITE.w, BOOM_SPRITE.h,
				b[i].X, b[i].Y, 
				b[i].size, b[i].size);
				if(b[i].oldFrame != frame) {
					b[i].count++;
					b[i].oldFrame = frame;
				}
				if(b[i].count == BOOM_SPRITE.num) {
					b.splice(i, 1);
				}
				
			} else {
				b[i].X += b[i].dX;
				b[i].Y += b[i].dY;
				
				rx2 = rectX2 - lw/2;
				rx1 = rectX1 + lw/2;
				ry1 = rectY1 + lw/2;
				ry2 = rectY2 - lw/2;
				
				if (b[i].X + b[i].size >= rx2) {
					b[i].X = b[i].X - 2 * (b[i].X + b[i].size - rx2);
					b[i].dX = -b[i].dX;
				};
				if (b[i].Y + b[i].size >= ry2) {
					b[i].Y = b[i].Y - 2 * (b[i].Y + b[i].size - ry2);
					b[i].dY = -b[i].dY;
				};
				if (b[i].X <= rx1) {
					b[i].X = b[i].X + 2 * (-b[i].X + rx1);
					b[i].dX = -b[i].dX;
				};
				if (b[i].Y <= ry1) {
					b[i].Y = b[i].Y + 2 * (-b[i].Y + ry1);
					b[i].dY = -b[i].dY;
				};
				var sprite_x = POLAND_SPRITE.x0 + POLAND_SPRITE.w * (frame % POLAND_SPRITE.num);
				ctx.drawImage(
				poland, 
				sprite_x, POLAND_SPRITE.y0, 
				POLAND_SPRITE.w, POLAND_SPRITE.h,
				b[i].X, b[i].Y, 
				b[i].size, b[i].size);
			}
			
		}
		
		
		ctx.restore();
	}
	
	
	
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
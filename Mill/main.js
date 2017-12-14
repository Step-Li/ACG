function init() {
	console.info("initialized animation");
	var canvas = document.getElementById("game");
	var ctx = canvas.getContext('2d');
	ctx.translate(canvas.width / 2, canvas.height / 3);
	var count = 0;
	draw_frame();
	var LINE = 70;
	
	function draw_frame() {
		ctx.clearRect(-500, -500, 1000, 1000);
		ctx.rotate(-Math.PI / 180);
		count = (count + Math.PI / 180) % (2*Math.PI);
		ctx.save();	
		requestAnimationFrame(draw_frame);
		for(var i = 0; i < 12; i++) {
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(LINE, 0);
			ctx.stroke();
			ctx.translate(LINE, 0);
			ctx.rotate(-i*Math.PI/6 + count);
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(0, LINE);
			ctx.stroke();
			ctx.translate(0, LINE);
			ctx.rotate(-count);
			for(var j = 0; j < 8; j++) {
				ctx.beginPath();
				ctx.moveTo(-20, 0);
				ctx.lineTo(20, 0);
				ctx.stroke();
				ctx.rotate(Math.PI/4);
			}
			ctx.rotate(count);
			ctx.translate(0, -LINE);
			ctx.rotate(i*Math.PI/6 - count);
			ctx.translate(-LINE, 0);
			ctx.rotate(Math.PI/6);
		}		
		ctx.restore();
		
	}
}
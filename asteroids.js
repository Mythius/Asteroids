var width,height;
const canvas=obj('canvas'),ctx=canvas.getContext('2d');
const fps = 60;
function resize(){
	width = window.innerWidth;
	height = window.innerHeight;
	canvas.width = width;
	canvas.height = height;
	ctx.font = "50px Arial";
	ctx.fillStyle = 'white';
	ctx.textAlign = 'center';
	ctx.fillText("PRESS SPACE TO START",width/2,height/2)
}
resize();
window.onresize = resize;
var key = {ArrowUp:false,ArrowDown:false,ArrowLeft:false,ArrowRight:false," ":false,Escape:false};

let started = false;

document.on('keydown',e=>{
	if(e.key in key){
		key[e.key] = true;
		e.preventDefault();
	}
	if(e.key == ' ' && !started){
		started = true;
		setup();
		loop = setInterval(draw,1000/fps);
	}
});

document.on('keyup',e=>{
	if(e.key in key){
		key[e.key] = false;
	}
});

// Global Values 

var ship;
var BULLETS = [];
let reload = 0;
var ASTEROIDS = [];
const asteroid_count = 15;

// Setup (runs once);
function setup(){
	ship = new Ship();

	for(let i=0;i<asteroid_count;i++){
		let x = random(0,width);
		let y = random(0,height);
		let asteroid = new Asteroid(x,y,random(30,80));
		ASTEROIDS.push(asteroid)
	}
}

// Loop (runs continualy)
function draw(){
	ctx.clearRect(-1,-1,width+1,height+1);
	handleControls();


	ship.update();
	for(let b of BULLETS) b.update();

	for(let a of ASTEROIDS) a.update();

	for(let b of BULLETS){
		let pos = b.getData();
		let x = pos.x;
		let y = pos.y;
		for(let a of ASTEROIDS){
			let ap = a.getData();
			let ax = ap.x;
			let ay = ap.y;
			let dist = distance(x,y,ax,ay);
			if(dist < (ap.size - 2)){
				b.die();
				a.split();
				checkWin();
			}
		}
	}

	let sp = ship.getData().pos;

	for(let a of ASTEROIDS){
		let d = a.getData();
		let dist = distance(sp.x,sp.y,d.x,d.y);
		if(dist < (d.size + 12)){
			clearInterval(loop);
			alert('You Died');
		}
	}

	if(reload > 0) reload--;

}

function handleControls(){
	if(key.Escape) clearInterval(loop);

	let rs = 3, ms = .1;

	if(key.ArrowLeft){
		ship.turn(-rs);
	}
	if(key.ArrowRight){
		ship.turn(rs);
	}
	if(key.ArrowUp){
		ship.move(ms);
	}

	if(key[' ']){
		if(reload) return;
		reload = 15;
		let data = ship.getData();
		new Bullet(data.pos.x,data.pos.y,data.dir);
	}
}

function checkWin(){
	if(ASTEROIDS.length == 0){
		alert('YOU WIN');
	}
}

var loop; 
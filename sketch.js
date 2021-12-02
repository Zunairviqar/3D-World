// variable to hold a reference to our A-Frame world
let world, sky;

// array to hold some particles
let particles = [];
let trees  = [];
let boxes = [];
let cx, cy, cz, total;

// to handle multiple dynamic textures we can use a series of separate variables to hold
// a few off screen graphics buffers created using the 'createGraphics' function in p5
let buffer1;

// we will also need three variables to hold the dynamic textures that will be created using
let texture1;

let cat, dog, ball;

let playBall, c, drawing;

// sounds
let click;

function preload() {
	bgSound = loadSound("sounds/bg.mp3");
	click = loadSound("sounds/click.mp3");
}

function setup() {
	// no canvas needed
	noCanvas();
	// bgSound.play();
	// construct the A-Frame world
	// this function requires a reference to the ID of the 'a-scene' tag in our HTML document
	world = new World('VRScene');

	sky = new Sky({
		asset: 'sky'
	});
	world.add(sky);
	bgSound.setVolume(0.3);


	// set a background color for our world
	world.setBackground(192, 133, 201);

	// create a plane to serve as our "ground"
	let g = new Plane({
		x:0, y:0, z:0,
		width:1000, height:1000,
		red:255, green:212, blue:133,
		rotationX:-90});

	// add the plane to our world
	world.add(g);

	// add trees
	for (let i = 0; i < 100; i++) {
		trees.push(new Tree(random(-50, 50), random(-50, 50), random(1.5, 2.3)));
	}

	// add bricks
	for (let j = 0; j < 10; j++ ){
		total = random(1, 7)
		cx = random(-20, 20);
		cy = 0.15;
		cz = random(-20, 20);
		for (let i = 0; i < total; i++) {
			// first layer of boxes
			boxes.push(new Cube(cx, cy, cz));
			// second layer
			if (total >= 2 && i < total-1){
				boxes.push(new Cube(cx+0.3, cy+0.3, cz))
			}
			// third layer
			if (total >= 3 && i < total-2){
				boxes.push(new Cube(cx+0.6, cy+0.6, cz))
			}
			// fourth layer
			if (total >= 4 && i < total-3){
				boxes.push(new Cube(cx+0.9, cy+0.9, cz))
			}
			cx += 0.7;
		}
	}
	// c = new Cube(10,10,1);
	playBall = new Ball(6,0.2,-3);



	dog = new GLTF({
		asset: 'dog',
		x: 10,
		y: 1,
		z: -5
	});
	world.add(dog);

	cat = new GLTF({
		asset: 'cat',
		x: 15,
		y: 0,
		z: -5,
		scaleX:0.02,
		scaleY:0.02,
		scaleZ:0.02
	});
	world.add(cat);

	// ball = new GLTF({
	// 	asset: 'ball',
	// 	x: 20,
	// 	y: 1,
	// 	z: -5,
	// 	red: 50,
	// 	green: 50,
	// 	blue: 0,
	// 	scaleX:0.001,
	// 	scaleY:0.001,
	// 	scaleZ:0.001
	// });
	// world.add(ball);

	maze = new GLTF({
		asset: 'maze',
		x: 100,
		y: -5,
		z: -100,
		red: 50,
		green: 50,
		blue: 0,
		scaleX:1,
		scaleY:1,
		scaleZ:1,
		// clickFunction: function(m) {
		// 	world.slideToObject( m );
		// }
	});
	world.add(maze);

	prison = new GLTF({
		asset: 'prison',
		x: -30,
		y: 0.1,
		z: -35,
		// rotationX:0,
		rotationY:90,
		scaleX:0.1,
		scaleY:0.1,
		scaleZ:0.1,
		// clickFunction: function(p) {
		// 	world.slideToObject( p );
		// }
	});
	world.add(prison);

	// create our three off screen graphics buffers, making sure that each is set up with dimensions
	// that are a power of 2
	buffer1 = createGraphics(512, 512);

	// set up these graphics buffers as dynamic textures
	texture1 = world.createDynamicTextureFromCreateGraphics( buffer1 );

	// box primitive
	drawing = new Box({
		x:25, y:3, z:-25,
		width:4, height: 3, depth: 0.1,
		asset: texture1,
		red: 220, green: 225, blue: 220,
		dynamicTexture: true,
		dynamicTextureWidth: 512,
		dynamicTextureHeight: 512,
		clickFunction:  function(entity, intersectionInfo) {
			buffer1.fill(random(255), random(255), random(255));
		},
		overFunction: function(entity, intersectionInfo) {
			if (mouseIsPressed) {
				buffer1.ellipse( intersectionInfo.point2d.x, intersectionInfo.point2d.y, 12, 12);
			}
		}
	});
	world.add(drawing);

	var drawtext = new Text({
		text: 'Draw On Me!',
		red: 128, green: 0, blue: 0,
		side: 'double',
		x: 25, y: 5, z: -25,
		scaleX: 15, scaleY: 15, scaleZ: 15
	});
	world.add(drawtext);

	var mazetext = new Text({
		text: 'MAZE IN CONSTRUCTION!',
		red: 128, green: 128, blue: 0,
		side: 'double',
		x: 100, y: 10, z: -60,
		scaleX: 105, scaleY: 105, scaleZ: 105
	});
	world.add(mazetext);

	// 	drawing = new Box({
	// 	x:100, y:3, z:-5,
	// 	width:3, height:3, depth:3,
	// 	asset: texture1,
	// 	red: 220, green: 225, blue: 220,
	// 	dynamicTexture: true,
	// 	dynamicTextureWidth: 512,
	// 	dynamicTextureHeight: 512,
	// 	overFunction: function(entity, intersectionInfo) {
	// 		// intersectionInfo is an object that contains info about how the user is
	// 		// interacting with this entity.  it contains the following info:
	// 		// .distance : a float describing how far away the user is
	// 		// .point3d : an object with three properties (x, y & z) describing where the user is touching the entity
	// 		// .point2d : an object with two properites (x & y) describing where the user is touching the entity in 2D space (essentially where on the dynamic canvas the user is touching)
	// 		// .uv : an object with two properies (x & y) describing the raw textural offset (used to compute point2d)

	// 		// draw an ellipse at the 2D intersection point on the dynamic texture
	// 		buffer1.fill(random(255), random(255), random(255));
	// 		buffer1.ellipse( intersectionInfo.point2d.x, intersectionInfo.point2d.y, 20, 20);
	// 	}
	// });
	// world.add(drawing);
}

function draw() {

	// if (mouseIsPressed) {
	// 	world.moveUserForward(0.05);
	// }
	// for (let i = 0; i < 100; i++) {
		// if (mouseIsPressed){
			// trees[i].container.spinY(1);
		// }
	// }

	// always create a new particle
	var temp = new Particle(random(-20, 20), 15, random(-20,20));

	// add to array
	// for (var i = 0; i < 10; i++) {
	particles.push( temp );
	// }

	// draw all particles
	for (var i = 0; i < particles.length; i++) {
		var result = particles[i].move();
		if (result == "gone") {
			particles.splice(i, 1);
			i-=1;
		}
	}





	// // here we are drawing to our 2D canvas.  Note that if you did not use the canvas as a texture
	// // in one of your 3D elements you wouldn't be able to see it at all
	// fill(random(255));
	// rect(random(width), random(height), random(5,30), random(5,30));

	// texture1 - random black and white squares
	// let s1 = random(5,30);
	// buffer3.fill(random(255));
	// buffer3.rect(random(0, 256), random(0,256), s1, s1);
}

class Tree {
	constructor(x, z, h) {

		// create a "container" object
		this.container = new Container3D({
			x:x, y:h, z:z,
			clickFunction: function(theBox) {
				console.log("TOUCHED bOX")
				// theBox.setColor( random(255), random(255), random(255) );
				// world.slideToObject( theBox, 1000 );
				// click.play();
			}
			// leaveFunction: function(c) {
			// 	// make the cube normal size
			// 	this.leaves.setBlue(255);
			// 	// theStem.spinY(0)
			// }
		});
		// add the container to the world
		world.add(this.container);

		this.stem = new Cylinder({
			x: 0, y:-h/2, z:0,
			height: h,
			radius: 0.18,
			red: 150, green:98, blue:72,
			// enterFunction: function(theStem) {
			// 	// make the stem slighly bigger
			// 	theStem.setRadius(0.3);
			// 	// theStem.spinY(100)
			// },
			// leaveFunction: function(theStem) {
			// 	// make the cube normal size
			// 	theStem.setRadius(0.2);
			// 	// theStem.spinY(0)
			// }
		});
		this.leaves = new Cone({
			x: 0, y:0, z:0,
			height:random(1, 1.8),
			radiusBottom: 0.6, radiusTop: 0.01,
			red: random(20, 40), green:random(120, 140), blue:0,
			// enterFunction: function(theleaves) {
			// 	// make the stem slighly bigger
			// 	theleaves.setRadiusBottom(0.7);
			// 	// theStem.spinY(100)
			// },
			// leaveFunction: function(theleaves) {
			// 	// make the cube normal size
			// 	theleaves.setRadiusBottom(0.5);
			// 	// theStem.spinY(0)
			// }
		});

		this.container.addChild(this.stem);
		this.container.addChild(this.leaves);
	}
}

class Cube {
	constructor(x,y,z) {

		this.box = new Box({
			x:x, y:y, z:z,
			width:0.7, height: 0.3, depth: 0.3,
			asset: 'iron',
			red:255, green:217, blue:179,
			clickFunction: function(theBox) {
				// console.log("TOUCHED bOX")
				theBox.setColor( random(255), random(255), random(255) );
				world.slideToObject( theBox, 1000 );
				click.play();
			}
		});

		world.add(this.box);
	}
}

class Ball {
	constructor (x, y, z) {
	// box primitive
		this.ball = new Sphere({
			x:x, y:y, z:z,
			radius: 0.2,
			red:255, green:0, blue:0
		});

		world.add(this.ball);
	}
}
// class to describe a particle's behavior
class Particle {

	constructor(x,y,z) {

		// construct a new Box that lives at this position
		this.myBox = new Cone({
			x:x, y:y, z:z,
			red: 179, green: 224, blue: 255,
			height: 0.3,
			radiusBottom: 0.03, radiusTop: 0.001
		});

		// add the box to the world
		world.add(this.myBox);

		// keep track of an offset in Perlin noise space
		this.xOffset = random(1000);
		this.zOffset = random(2000, 3000);
	}

	// function to move our box
	move() {
		// compute how the particle should move
		// the particle should always move up by a small amount
		var yMovement = -0.15;

		// the particle should randomly move in the x & z directions
		var xMovement = map( noise(this.xOffset), 0, 1, -0.01, 0.01);
		var zMovement = map( noise(this.zOffset), 0, 1, -0.01, 0.01);

		// update our poistions in perlin noise space
		this.xOffset += 0.01;
		this.yOffset += 0.01;

		// set the position of our box (using the 'nudge' method)
		this.myBox.nudge(xMovement, yMovement, zMovement);

		// make the boxes shrink a little bit
		var boxScale = this.myBox.getScale();
		this.myBox.setScale( boxScale.x, boxScale.y, boxScale.z);

		// if we get too small we need to indicate that this box is now no longer viable
		if (boxScale.x <= 0) {
			// remove the box from the world
			world.remove(this.myBox);

			return "gone";
		}
		else {
			return "ok";
		}
	}
}

function keyPressed(){
	if(!bgSound.isPlaying())
	bgSound.loop();
}

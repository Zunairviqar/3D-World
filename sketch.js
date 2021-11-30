// variable to hold a reference to our A-Frame world
let world;

// tree container
// let container;

// array to hold some particles
let particles = [];
let trees  = [];
let boxes = [];
let cx, cy, cz, total;

// to handle multiple dynamic textures we can use a series of separate variables to hold
// a few off screen graphics buffers created using the 'createGraphics' function in p5
let buffer1, buffer2, buffer3;

// we will also need three variables to hold the dynamic textures that will be created using
// these three buffers
let texture1, texture2, texture3;

let cat, dog, ball;

function setup() {
	// no canvas needed
	noCanvas();

	// construct the A-Frame world
	// this function requires a reference to the ID of the 'a-scene' tag in our HTML document
	world = new World('VRScene');

	// set a background color for our world
	world.setBackground(192, 133, 201);

	// create a plane to serve as our "ground"
	var g = new Plane({x:0, y:0, z:0, width:100, height:100, red:255, green:212, blue:133, rotationX:-90});

	// add the plane to our world
	world.add(g);

	// add trees
	for (let i = 0; i < 100; i++) {
		trees.push(new Tree(random(-50, 50), random(-50, 50), random(1.5, 2.3)));
	}

	for (let j = 0; j < 10; j++ ){
		total = random(1, 7)
		cx = random(-20, 20);
		cy = 0.3;
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
		y: 1,
		z: -5,
		scaleX:0.01,
		scaleY:0.01,
		scaleZ:0.01
	});
	world.add(cat);

	ball = new GLTF({
		asset: 'ball',
		x: 20,
		y: 1,
		z: -5,
		red: 50,
		green: 50,
		blue: 0,
		scaleX:0.001,
		scaleY:0.001,
		scaleZ:0.001
	});
	world.add(ball);

	// create our three off screen graphics buffers, making sure that each is set up with dimensions
	// that are a power of 2
	// buffer1 = createGraphics(256, 256);
	// buffer2 = createGraphics(256, 256);
	buffer3 = createGraphics(256, 256);

	// set up these graphics buffers as dynamic textures
	// texture1 = world.createDynamicTextureFromCreateGraphics( buffer1 );
	// texture2 = world.createDynamicTextureFromCreateGraphics( buffer2 );
	texture3 = world.createDynamicTextureFromCreateGraphics( buffer3 );

		// box primitive
	var b = new Box({
		x:-10, y:1, z:0,
		width:1, height: 1.2, depth: 2,
		asset: 'iron',
		red:random(255), green:random(255), blue:random(255),


		clickFunction: function(theBox) {
			// runs 1 time whenever the cube is clicked
			theBox.setColor( random(255), random(255), random(255) );
			world.slideToObject( theBox, 2000 );
			// update this cube's color to something random!
			// world.moveUserForward(0.05);
		}					
	});
	
	// add the box to the container
	// container.addChild(b);

			// box primitive
	var b2 = new Box({
		x:-10, y:2.2, z:0,
		width:1, height: 1.2, depth: 2,
		// asset: 'iron',
		asset: texture3,
		dynamicTexture: true,
		dynamicTextureWidth: 512,
		dynamicTextureHeight: 512,
		red:random(255), green:random(255), blue:random(255),				
	});
	
	// add the box to the container
	// container.addChild(b2);

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
	var temp = new Particle(0, 0, -5);

	// add to array
	particles.push( temp );

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
	let s1 = random(5,30);
	buffer3.fill(random(255));
	buffer3.rect(random(0, 256), random(0,256), s1, s1);

	// let direction = int(random(4));
	// if (direction == 0) {
	// 	x -= 10;
	// }
	// else if (direction == 1) {
	// 	x += 10;
	// }
	// else if (direction == 2) {
	// 	y -= 10;
	// }
	// else {
	// 	y += 10;
	// }

	// if (x > 256) {
	// 	x = 0;
	// }
	// if (x < 0) {
	// 	x = 256;
	// }
	// if (y > 256) {
	// 	y = 0;
	// }
	// if (y < 0) {
	// 	y = 256;
	// }

}

class Tree {
	constructor(x, z, h) {

		this.stem = new Cylinder({
			x: 0, y:h/2, z:0,
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
			x: 0, y:h, z:0,
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

		// create a "container" object
		this.container = new Container3D({
			x:x, y:h, z:z,
			clickFunction: function(c) {
				console.log("TOUVHED")
				// make the stem slighly bigger
				// c.setScale(10, 10, 10);
				this.leaves.setBlue(255);
				// theStem.spinY(100)
			}
			// leaveFunction: function(c) {
			// 	// make the cube normal size
			// 	this.leaves.setBlue(255);
			// 	// theStem.spinY(0)
			// }
		});

		this.container.addChild(this.stem);
		this.container.addChild(this.leaves);

		// add the container to the world
		world.add(this.container);
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
				world.slideToObject( theBox, 1000 );
			}
		});

		world.add(this.box);
	}
}

// class to describe a particle's behavior
class Particle {

	constructor(x,y,z) {

		// construct a new Box that lives at this position
		this.myBox = new Sphere({
								x:x, y:y, z:z,
								red: random(255), green:random(255), blue:random(255),
								radius: 0.5
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
		var yMovement = 0.01;

		// the particle should randomly move in the x & z directions
		var xMovement = map( noise(this.xOffset), 0, 1, -0.05, 0.05);
		var zMovement = map( noise(this.zOffset), 0, 1, -0.05, 0.05);

		// update our poistions in perlin noise space
		this.xOffset += 0.01;
		this.yOffset += 0.01;

		// set the position of our box (using the 'nudge' method)
		this.myBox.nudge(xMovement, yMovement, zMovement);

		// make the boxes shrink a little bit
		var boxScale = this.myBox.getScale();
		this.myBox.setScale( boxScale.x-0.005, boxScale.y-0.005, boxScale.z-0.005);

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



var myScene;
var defaultbackgroundcolor;
const defaultlives = 3;
var lives = defaultlives;
var pause = true;

function makeSceneGraph () {
	lights = new Lights();
	myScene = new Scene();
	scene.add(myScene);
	defaultbackgroundcolor = scene.background;

	var l = document.getElementById('lives');
	l.innerHTML = ("Lives: " + lives);
}

 animate = function () {
 	if(!pause) {
 		 requestAnimationFrame(animate);
	 	myScene.tick();
	 	controls.update();
 	} else {
 		return;
 	}
 }



 class Scene extends THREE.Object3D {
	constructor () {
		super ();

		var date = new Date();
		this.startSeconds = 0;//date.getSeconds();
		this.emotions = [];
		this.totalfaces = 6;

		// randomize emotions
		for (var i = 0; i < this.totalfaces; i++) {
			var m = this.getRandomArbitrary(0, 5);
			if (m < 1) {
				this.emotions[i] = new Joy();
			} else if (m > 1 && m < 2) {
				this.emotions[i] = new Sadness();
			} else if (m > 2 && m < 3) {
				this.emotions[i] = new Surprise();
			} else {
				this.emotions[i] = new Anger();
			}
		}

		for (var i = 0; i < this.emotions.length; i++) {
			var m = this.getRandomArbitrary(-5, 5);
			this.emotions[i].position.set(5 * m, m, -70);
		}
		render();
	}

	getRandomArbitrary(min, max) {
	  return Math.random() * (max - min) + min;
	}
	spawnNewFace(wait) {
		for (var i = 0; i < this.emotions.length; i++) {
			if(!this.emotions[i].isActive() && !this.emotions[i].isDead() && !wait) {
				this.emotions[i].setActive();
				scene.add(this.emotions[i]);
				break;
			}
		}
	}


	checkFaces(emotion) {
		for (var i = 0; i < this.emotions.length; i++) {
			console.log(this.emotions[i].emotion);
			if(this.emotions[i].emotion == emotion) {
				if (this.emotions[i].isActive() && !(this.emotions[i].isDead())) {
					this.emotions[i].removeActive();
					this.emotions[i].setDead();
					this.emotions[i].position.x = 15000;
				} else {};
			}
		}
	}

	tick () {
		// move the faces forwards
		for (var i = 0; i < this.emotions.length; i++) {
			if(this.emotions[i].isActive()) {
				this.emotions[i].tick();
				// we want 55
				if (this.emotions[i].face.position.x >= 55) {
					// send the message 'losealife'
					var l = document.getElementById('lives');
					lives = lives - 1;
					console.log(lives);
					scene.background = new THREE.Color( 0xff0000 );
					l.innerHTML = ("Lives: " + lives);
					if (lives <= 0) {
						document.getElementById("msgs").innerHTML = "Game over! Please refresh the page!";
						detector.stop();
						pause = true;
					} else if (lives > 1 && this.checkDead()) {
						document.getElementById("msgs").innerHTML = "You win! Please refresh the page!";
					}
					// delete[i]
					this.emotions[i].removeActive();
					this.emotions[i].setDead();
					this.emotions[i].position.x = 15000;
					setTimeout(function(){scene.background = defaultbackgroundcolor;}, 2000);
				}
			}
		}	
		render();
	}

	checkDead() {
		var d = false;
		for (var i = 0; i < this.emotions.length; i++) {
			d = d & this.emotions[i].isDead();
		}
		return d;
	}
}


 class Face extends THREE.Object3D {
 	constructor () {
 		super();
 		this.active = false;
 		this.dead = false;
 		// shape
 		this.face = new THREE.Mesh (
			new THREE.SphereGeometry( 3, 32, 32 ),
			new THREE.MeshPhongMaterial({color: 'white'}));
		this.position.set(0, 0, 0);
		this.rotation.set(0, Math.PI*3/2, 0)
 		this.add(this.face);

 	}

 	setMesh(newMesh) {
 		this.face.material = newMesh;
 		render();
 	}

 	isActive() {
 		return this.active;
 		console.log(this.active);
 	}

 	setActive() {
 		this.active = true;
 		console.log(this.active);
 	}

 	removeActive() {
 		this.active = false;
 		console.log(this.active);
 		this.face.material.transparent = true ;
 		render();
 	}

 	isDead() {
 		return this.dead;
 	}

 	setDead() {
 		this.dead = true;
 	}

 	tick() {
 		if (this.active) {
			this.face.position.set(this.face.position.x + 1/25, this.face.position.y, this.face.position.z);
			render();
 		}

 	}
 }

 class Emotion extends Face {
 	constructor () {
 		super();
 	}
 }

 class Sadness extends Emotion {
 	constructor () {
 		super();

 		var texture = new THREE.TextureLoader().load( "faces/sad.png" );
		this.material = new THREE.MeshLambertMaterial({ map: texture });


		super.setMesh(this.material);
		this.emotion = "sadness";
 	}
 }

 class Joy extends Emotion {
 	constructor () {
 		super();

		var texture = new THREE.TextureLoader().load( "faces/excited.png" );
		this.material = new THREE.MeshLambertMaterial({ map: texture });

		super.setMesh(this.material);
		this.emotion = "joy";
 	}
 }

 class Surprise extends Emotion {
 	constructor () {
 		super();

 		var texture = new THREE.TextureLoader().load( "faces/surprised.png" );
		this.material = new THREE.MeshLambertMaterial({ map: texture });

		super.setMesh(this.material);
		this.emotion = "surprise";
 		
 	}
 }

 class Anger extends Emotion {
 	constructor () {
 		super();

 		var texture = new THREE.TextureLoader().load( "faces/angry.png" );
		this.material = new THREE.MeshLambertMaterial({ map: texture });

		super.setMesh(this.material);
		this.emotion = "anger";
 	}
 }


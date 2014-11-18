var ShadowChaser = ShadowChaser || {};

ShadowChaser.Play = new Kiwi.State('Play');


ShadowChaser.Play.create = function () {
	console.log( "Inside Play State" );
	this.platformManager = new PlatformManager( this );
	this.platformManager.createPlatforms();

	this.camera = this.game.cameras.defaultCamera;


	this.createEscape();

	this.runner = new Runner(this, 530, 150);
	// this.addChild( this.runner );

	
	this.inputManager = new InputManager( this, 0, 0 );
	this.cameraManager = new CameraManager( this );

	this.bloodBar = new BloodBar( this );

	



}



ShadowChaser.Play.update = function() {
	Kiwi.State.prototype.update.call(this);
	this.camera.transform.x -= 10 /** this.game.time.rate */;
	this.cameraManager.update();
	this.bloodBar.update();


	this.platformManager.update();
}


ShadowChaser.Play.startGame = function() {

	this.addChild( this.runner );
	this.escape.alpha = 0;
	this.bloodBar.start();
}


ShadowChaser.Play.createEscape = function() {
	this.tree = new Kiwi.GameObjects.StaticImage( this, this.textures.escapeBackground, 0 , 84 );
	this.addChild( this.tree );

	this.escape = new Kiwi.GameObjects.Sprite( this, this.textures.escape, 371 , 111 + 80 );
	this.escape.animation.add('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 16, 17, 18], 0.05, false )
	this.escape.animation.play('idle');
	this.addChild( this.escape );

	this.escape.animation.getAnimation('idle').onStop.add(this.startGame, this);
}
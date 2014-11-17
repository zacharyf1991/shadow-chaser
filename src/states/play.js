var ShadowChaser = ShadowChaser || {};

ShadowChaser.Play = new Kiwi.State('Play');


ShadowChaser.Play.create = function () {
	console.log( "Inside Play State" );
	this.platformManager = new PlatformManager( this );
	this.platformManager.createPlatforms();

	this.camera = this.game.cameras.defaultCamera;

	this.runner = new Runner(this, 400, 150);
	this.addChild( this.runner );

	
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




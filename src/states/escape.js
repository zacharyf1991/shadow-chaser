var ShadowChaser = ShadowChaser || {};

ShadowChaser.Escape = new Kiwi.State('Escape');

/**
* The IntroState is the state which would manage any main-menu functionality for your game.
* Generally this State would switch to other sub 'states' which would handle the individual features. 
*  
* Right now we are just switching straight to the PlayState.
*
*/


ShadowChaser.Escape.create = function () {

	this.image = new Kiwi.GameObjects.Sprite( this, this.textures.platform, 0, 40);
	this.image.scaleX = 1.3;
	this.image.scaleY = 1.3;
	this.addChild( this.image);


	this.background = new Kiwi.GameObjects.StaticImage( this, this.textures.escapeBackground, -200 , 80 );
	this.addChild( this.background );

	// this.playButton = new MenuButton( this, this.textures.breakFree, 620, 240 );
	// this.addChild( this.playButton );
	this.escape = new Kiwi.GameObjects.Sprite( this, this.textures.escape, 371 - 200, 111 + 80 );
	this.escape.animation.add('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 16, 17, 18], 0.05, false )
	this.escape.animation.play('idle');
	this.addChild( this.escape );

	this.escape.animation.getAnimation('idle').onStop.add(this.startGame, this);
}

ShadowChaser.Escape.update = function() {
	Kiwi.State.prototype.update.call(this);

}

ShadowChaser.Escape.startGame = function () {
	game.states.switchState("Play");

}
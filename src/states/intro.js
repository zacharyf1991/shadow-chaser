var ShadowChaser = ShadowChaser || {};

ShadowChaser.Intro = new Kiwi.State('Intro');

/**
* The IntroState is the state which would manage any main-menu functionality for your game.
* Generally this State would switch to other sub 'states' which would handle the individual features. 
*  
* Right now we are just switching straight to the PlayState.
*
*/


ShadowChaser.Intro.create = function () {

	this.background = new Kiwi.GameObjects.StaticImage( this, this.textures.menuBackground, 0 , -112 );
	this.addChild( this.background );

	// this.playButton = new MenuButton( this, this.textures.breakFree, 620, 240 );
	// this.addChild( this.playButton );
	this.playButton = new Kiwi.GameObjects.Sprite( this, this.textures.breakFree, 620, 240 );
	this.playButton.cellIndex = 1;
	this.addChild( this.playButton );

	this.playButton.input.onUp.add( this.playButtonHit, this );
	this.alphaMin = 0.4;
	this.alphaCount = this.alphaMin;
	this.alphaStep = 0.01;
}

ShadowChaser.Intro.update = function() {
	Kiwi.State.prototype.update.call(this);
	// game.states.switchState("Play");
	this.alphaCount += this.alphaStep;
	if( this.alphaCount >= 1 || this.alphaCount <= this.alphaMin ){
		this.alphaStep *= -1;
	}
	this.playButton.alpha = this.alphaCount;


}

ShadowChaser.Intro.playButtonHit = function () {
	// console.log( "Hit Play Button" );
	game.states.switchState("Escape");

}
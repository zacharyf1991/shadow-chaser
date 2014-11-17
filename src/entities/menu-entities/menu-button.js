var MenuButton = function (state, texture, x, y ) {

	Kiwi.GameObjects.Sprite.call(this, state, texture, x, y );
	this.state = state;

	this.input.onDown.add(this.down, this);
	this.input.onUp.add(this.up, this);
	this.input.onLeft.add(this.left, this);

}
Kiwi.extend( MenuButton, Kiwi.GameObjects.Sprite );

// ShadowChaser.MenuEntities.prototype.update = function () {

// }
MenuButton.prototype.up = function () {
	this.animation.switchTo( 0 );
	
}
MenuButton.prototype.down = function () {
	this.animation.switchTo( 1 );
	
}
MenuButton.prototype.left = function () {
	this.animation.switchTo( 0 );
	
}
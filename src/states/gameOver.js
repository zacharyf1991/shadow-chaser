var ShadowChaser = ShadowChaser || {};

ShadowChaser.GameOver = new Kiwi.State('GameOver');



ShadowChaser.GameOver.create = function (params) {
	this.params = params;
	
	// this.background = new Kiwi.GameObjects.Sprite(this, this.textures.introBackground, 0 , 0);
	// this.addChild(this.background);
}

ShadowChaser.GameOver.update = function() {
	Kiwi.State.prototype.update.call(this);

}


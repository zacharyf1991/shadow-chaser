CameraManager = function(state){
	this.state = state;

    this.camera = game.cameras.defaultCamera;

    this.cameraPos = 200;

    this.bloodOffset = 500;

    this.sunOffset = 50;

    this.sunlight = new Kiwi.GameObjects.Sprite( this.state, this.state.textures.sunlight, -200, 0);
    this.state.addChild(this.sunlight);


}

/**
* This method moves the game camera dynamically via the player, but restrained on game borders
* @method updateCamera
* @public
*/
CameraManager.prototype.update = function () {
    this.updatePosition(); 
    this.updateSunlight();
}





CameraManager.prototype.updatePosition = function() {

	var offset = this.state.bloodBar.blood / this.state.bloodBar.maxBlood;

    this.camera.transform.x = -( this.state.runner.x + this.cameraPos - (offset * this.bloodOffset ));
    //this.camera.transform.y = -(this.state.player.y + this.state.playerInitialY);
};

CameraManager.prototype.updateSunlight = function() {

	var offset = this.state.bloodBar.blood / this.state.bloodBar.maxBlood;

	this.sunlight.alpha = 1 - offset;

    this.camera.transform.x = -( this.state.runner.x + this.cameraPos - (offset * this.bloodOffset ));

    this.sunlight.x = -( this.camera.transform.x ) - this.sunOffset * offset;
    //this.camera.transform.y = -(this.state.player.y + this.state.playerInitialY);
};
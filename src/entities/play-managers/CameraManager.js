CameraManager = function(state){
	this.state = state;

    this.camera = game.cameras.defaultCamera;


}

/**
* This method moves the game camera dynamically via the player, but restrained on game borders
* @method updateCamera
* @public
*/
CameraManager.prototype.update = function () {
    this.updatePosition(); 
}





CameraManager.prototype.updatePosition = function() {
    this.camera.transform.x = -( this.state.runner.x - 100 );
    //this.camera.transform.y = -(this.state.player.y + this.state.playerInitialY);
};
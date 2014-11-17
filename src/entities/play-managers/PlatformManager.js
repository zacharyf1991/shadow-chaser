PlatformManager = function(state){
	this.state = state;
	this.scale = 1.3;

	this.platformWidth = 1012;//2048; // 2024; //2024;// * this.scale;

	// This number does not include 0, therefore the platform.length == this number
	this.platformsAmount = 3;
	this.platforms = new Kiwi.Group( this.state );
	this.state.addChild( this.platforms );
	this.platforms.scaleX = this.scale;
	this.platforms.scaleY = this.scale;

	this.camera = this.state.game.cameras.defaultCamera;


}



/**
* This method checks to see if a player is on a leftSlope.
*
* Please note, "leftSlope" is refering to a slope that when the player is standing on the tile, facing away from the tile, the player is facing left.
* Also note, this function checks for the outward edges of the sloping tile and calculates those points too for a more polished slope interaction
*
* @method checkLeftSlope
* @public
*/

PlatformManager.prototype.update = function(){
	this.checkPosition();



}

PlatformManager.prototype.createPlatforms = function(){
	var i = 0;
	for ( i; i < this.platformsAmount; i++ ) {
		var tempPlat = new Platform ( this.state, i + 1 );
		tempPlat.x = i * this.platformWidth;
		//this.state.addChild( tempPlat );
		this.platforms.addChild( tempPlat );
	}



}

PlatformManager.prototype.checkPosition = function(){
	for (var i = this.platforms.members.length - 1; i >= 0; i--) {

		//console.log ( "Camera Calc:", (this.camera.transform.x * -1))
		if( this.platforms.members[i].worldX < (this.camera.transform.x * -1) - this.platformWidth * this.scale) {
			this.resetPlatformPosition( this.platforms.members[i] );
		}
	};	

}

PlatformManager.prototype.resetPlatformPosition = function( platform ){
	var platX = 0,
		platTemp;
	for (var i = this.platforms.members.length - 1; i >= 0; i--) {
		if (this.platforms.members[i].x > platX ){
			platX = this.platforms.members[i].x;
			platTemp = this.platforms.members[i];
		}
			
	};	

	platform.x = platTemp.x + this.platformWidth;

}

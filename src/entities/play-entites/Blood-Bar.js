BloodBar = function(state){
	this.state = state;
	this.textOffsetX = 50;
	this.camera = this.state.game.cameras.defaultCamera;

	this.bloodText = new Kiwi.GameObjects.Textfield ( this.state, 'Blood: 100 % ', this.state.runner.x, 20, '#FF0000', 32 );
	this.state.addChild(this.bloodText);

	this.blood = 100;
	this.maxBlood = 100;
	this.bloodRate = 0.05;


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

BloodBar.prototype.update = function(){
	this.updateBlood();
	this.updatePosition();
	this.updateText();



}

BloodBar.prototype.updateBlood = function(){
	var minBlood = 25;
	if(this.blood > minBlood ){
		this.blood -= this.bloodRate;
		
	} else {
		
		// Game Over Condition Here
		this.blood = minBlood;

	}
}
BloodBar.prototype.updateText = function(){
	this.bloodText.text = "Blood: " + Math.round( this.blood ) + "%";
}


BloodBar.prototype.updatePosition = function(){

	this.bloodText.x = -( this.camera.transform.x ) + this.textOffsetX;
	// this.bloodText.x = this.state.runner.x + this.textOffsetX;
}

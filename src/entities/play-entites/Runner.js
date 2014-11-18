//PlayerManager / Player
var Runner = function (state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures.runner, x, y, false);
	this.state = state;
	
	this.animationSpeed = 0.05;

	this.animation.add('idle', [0], 0.1, true);
	// this.animation.add('run', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 0.025, true);
	this.animation.add('run', [ 22, 23, 24, 25, 26, 27, 28, 29, 30 ], this.animationSpeed, true);
	this.animation.add('jumpStart', [ 09, 10 ], this.animationSpeed, false);
	this.animation.add('jump', [ 11 ], this.animationSpeed, false);
	this.animation.add('fallStart', [ 12, 13 ], this.animationSpeed, false);
	this.animation.add('fall', [ 14 ], this.animationSpeed, false);

	this.animation.add('jumpStartSmoke', [ 66, 67 ], this.animationSpeed, false);
	this.animation.add('jumpSmoke', [ 68 ], this.animationSpeed, false);
	this.animation.add('fallStartSmoke', [ 69, 70 ], this.animationSpeed, false);
	this.animation.add('fallSmoke', [ 71 ], this.animationSpeed, false);

	this.animation.add('jumpStartFire', [ 72, 73 ], this.animationSpeed, false);
	this.animation.add('jumpFire', [ 74 ], this.animationSpeed, false);
	this.animation.add('fallStartFire', [ 75, 76 ], this.animationSpeed, false);
	this.animation.add('fallFire', [ 77 ], this.animationSpeed, false);

	this.animation.add('run', [ 22, 23, 24, 25, 26, 27, 28, 29, 30 ], this.animationSpeed, true);
	this.animation.add('runSmoke', [ 37, 38, 39, 40, 41, 42, 43, 44, 45 ], this.animationSpeed, true);
	this.animation.add('runFire', [ 46, 47, 48, 49, 50, 51, 52, 53, 54 ], this.animationSpeed, true);

	this.animation.add('death', [ 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65 ], this.animationSpeed, false);

	this.animation.play('run');   

	this.animation.getAnimation('jumpStart').onStop.add(this.loopJump, this);
	this.animation.getAnimation('fallStart').onStop.add(this.startFall, this);

	this.animation.getAnimation('jumpStartSmoke').onStop.add(this.loopJump, this);
	this.animation.getAnimation('fallStartSmoke').onStop.add(this.startFall, this);

	this.animation.getAnimation('jumpStartFire').onStop.add(this.loopJump, this);
	this.animation.getAnimation('fallStartFire').onStop.add(this.startFall, this);

	this.animation.getAnimation('death').onStop.add(this.exitState, this);



	// this.scaleX = 0.75;
	// this.scaleY = 0.75; 

	this.box.hitbox = new Kiwi.Geom.Rectangle( 58, 63, 66, 110 ); 
	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));

	// this.physics.allowCollisions = Kiwi.Components.ArcadePhysics.FLOOR;
	// this.physics.allowCollisions = Kiwi.Components.ArcadePhysics.ANY;
	// this.physics.allowCollisions = Kiwi.Components.ArcadePhysics.FLOOR;
	

	this.force = 3;
	this.maxRunVelo = 200;
	this.runVelo = 120;
	this.jumpHeight = 40;

	// Raw physics data
	// This is relative to TIME, not to FRAMES
	// It will be modulated by speed governance before being passed to physics
	this.velocityX = 0;
	this.velocityY = 0;


	///////////////////
	//KEYBOARD
	this.rightKeyDown = false;
	this.leftKeyDown = false;
	this.jumpKeyDown = false;
	this.upKeyDown = false;
	this.downKeyDown = false;

	this.jumpAnimationPlaying = false;



	this.previousLocation = new Kiwi.Geom.Vector2(x, y);




	/////////////////////////
	//BOOLEANS
	this.friction = 0.08;

	this.accellerationTime = 0;
	this.accellSpeed = 0.0025
	this.playersVelocity = 0;
	this.playersVelocityAfter = 0;
	this.speedDropPercentage = 1.5;
	this.yAccel = 100;
	this.jumpVelo = 131.72;
	this.physics.acceleration.y = this.yAccel;
	this.canJump = true;

	this.control = true;

	this.jumpKeyDownTimer = this.game.time.clock.createTimer('jumpKeyDownTimer', 0.25, 0, false);

	



}
Kiwi.extend(Runner, Kiwi.GameObjects.Sprite);





Runner.prototype.update = function(){
	Kiwi.GameObjects.Sprite.prototype.update.call(this);

  
	if( this.canJump && !this.jumpAnimationPlaying) {

		this.setRunAnimation();
		
	}

	 if(this.animation.currentAnimation.name == 'jump' || 
		this.animation.currentAnimation.name == 'jumpStart' ){
		this.updateJumpVelocity();

	 } else {
		// this.physics.acceleration.y = this.yAccel * this.state.game.time.rate;
	 }

	this.updateYAcceleration();
	this.updateXVelocity();
	this.updateAnimationSpeed();

	this.checkDeath();

	

	

	this.updateMovement();


	this.physics.update();
	this.checkCollisions();


	
	
}

Runner.prototype.setRunAnimation = function(){

	var animation = 'run'
	var percent = this.state.bloodBar.blood / this.state.bloodBar.maxBlood;

	if ( percent < 0.5 ){
		animation = 'runFire';
	} else if ( percent < 0.6 ) {
		animation = 'runSmoke';
	} else {
		animation = 'run'
	}

	if(this.animation.currentAnimation.name != animation ){
			this.animation.play( animation );
	}

}

Runner.prototype.checkDeath = function(){

	var percent = this.state.bloodBar.blood / this.state.bloodBar.maxBlood;
	
	// console.log ( 'Check Death', percent );

	if ( percent <= 0.4 ){
		this.die();
	} 

	if(this.y > 270){
		// this.y = - 50;
		this.die();
	} 

}


Runner.prototype.die = function(){
	
	// console.log( 'Die is active' );
	this.runVelo = 0;
	this.physics.velocity.y = 0;
	this.physics.acceleration.y = 0;
	this.removeControl();

	animation = 'death';
	if(this.animation.currentAnimation.name != animation ){
			this.animation.play( animation );
	}


}

Runner.prototype.removeControl = function(){
	this.control = false;

	this.upKeyDown = false;

}

Runner.prototype.checkCollisions = function(){

	//platformManager.platforms[for all].member[2]

	for (var i = this.state.platformManager.platforms.members.length - 1; i >= 0; i--) {

		// Check to see if platform is behind or just in front of character. 200 being an arbitrary number
		if ( this.state.platformManager.platforms.members[i].x < this.x + 100 ) {
			// console.log( 'Platforms Exists', this.state.platformManager.platforms.members[i] );
			
			// Check to see if tile is within range of character. Therefore iterate through group and find tiles
			// members[1] of members[i] is the group of tiles.
			var j = this.state.platformManager.platforms.members[i].members[1].members.length - 1;
			var array = this.state.platformManager.platforms.members[i].members[1].members;
			for ( j; j >= 0; j-- ){
				var tempTile = this.state.platformManager.platforms.members[i].members[1].members[j];
				if( tempTile.worldX > this.x - 50 && tempTile.worldX < this.x + 50 ){
					// console.log( 'Tile Exists', tempTile );

					// Check to see if runner is touching tile
					var collides = false;
					collides = this.overlapsWith1( tempTile );
					if ( collides ) {
						return true;
					}
					
				}
			}
			   
		}
	}
	this.canJump = false;
	return false;
	
} 

Runner.prototype.overlapsWith1 = function( obj ) {
	if( this.physics.overlaps( obj, true )) {
		// console.log( 'Collision Exists' );
		if( this.physics.velocity.y == 0 ){
				this.canJump = true;
				return true;
		}
	}
}


Runner.prototype.endState = function() {
	console.log("END");
	this.state.hudManager.endState();
	this.state.inputManager.endState();

	var params = { thing: {
		score: this.state.hudManager.score
		
	  }


	}

  game.states.switchState("GameOver", null, null, params);
};

Runner.prototype.slowPlayer = function() {
	this.accellerationTime = 1/(1- (this.playersVelocity / this.speedDropPercentage) ) - 1;

};

Runner.prototype.switchJumpAnimation = function () {
	var animation = 'jumpStart'
	var percent = this.state.bloodBar.blood / this.state.bloodBar.maxBlood;

	if ( percent < 0.5 ){
		animation = 'jumpStartFire';
	} else if ( percent < 0.6 ) {
		animation = 'jumpStartSmoke';
	} else {
		animation = 'jumpStart'
	}

	if(this.animation.currentAnimation.name != animation ){
			this.animation.play( animation );
	}
	

}

Runner.prototype.jump = function () {
	if(this.canJump){
			this.upKeyDown = true;
			this.physics.velocity.y = -(this.jumpVelo);// * this.state.game.time.rate;
			this.physics.acceleration.y = 0;
			this.jumpAnimationPlaying = true;

			this.switchJumpAnimation();

			




			this.jumpKeyDownTimer.clear();
			this.jumpKeyDownTimer.stop();
			this.jumpKeyDownTimer.delay = 0.25;
			this.jumpKeyDownTimer.repeatCount = 1;
			this.jumpKeyDownTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.stopJumpUp, this);
			this.jumpKeyDownTimer.start();
		}


}
Runner.prototype.stopJumpUp = function(){
	this.physics.acceleration.y = this.yAccel;
	if( !this.canJump){
		if(this.animation.currentAnimation.name != 'fallStart' && this.animation.currentAnimation.name != 'fall' ){
			this.animation.play( 'fallStart' );
		}


	var animation = 'fallStart'
	var percent = this.state.bloodBar.blood / this.state.bloodBar.maxBlood;

	if ( percent < 0.5 ){
		animation = 'fallStartSmoke';
	} else if ( percent < 0.6 ) {
		animation = 'fallStartFire';
	} else {
		animation = 'fallStart'
	}

	if(this.animation.currentAnimation.name != animation && this.animation.currentAnimation.name != 'fall' ){
			this.animation.play( animation );
	}
	this.jumpAnimationPlaying = false;
		
	}
	this.canJump = false;
}

Runner.prototype.startFall = function(){
	var animation = 'fall'
	var percent = this.state.bloodBar.blood / this.state.bloodBar.maxBlood;

	if ( percent < 0.5 ){
		animation = 'fallFire';
	} else if ( percent < 0.6 ) {
		animation = 'fallSmoke';
	} else {
		animation = 'fall'
	}

	if(this.animation.currentAnimation.name != animation ){
			this.animation.play( animation );
	}
	this.jumpAnimationPlaying = false;
}
Runner.prototype.loopJump = function(){
	var animation = 'jump'
	var percent = this.state.bloodBar.blood / this.state.bloodBar.maxBlood;

	if ( percent < 0.5 ){
		animation = 'jumpFire';
	} else if ( percent < 0.6 ) {
		animation = 'jumpSmoke';
	} else {
		animation = 'jump'
	}

	if(this.animation.currentAnimation.name != animation ){
			this.animation.play( animation );
	}
	this.jumpAnimationPlaying = false;
}

Runner.prototype.updateJumpVelocity = function(){
	this.physics.velocity.y = -(this.jumpVelo) * this.state.game.time.rate;
}

Runner.prototype.updateYAcceleration = function(){
	this.physics.acceleration.y = this.yAccel  * this.state.game.time.rate;
}

Runner.prototype.updateXVelocity = function(){
	var blood = this.state.bloodBar.blood;
	var veloMod =  blood / this.state.bloodBar.maxBlood;
	this.physics.velocity.x = this.runVelo * veloMod;
}

Runner.prototype.updateAnimationSpeed = function(){
	var blood = this.state.bloodBar.blood;
	var rateMod =  blood / this.state.bloodBar.maxBlood;
	this.animation.currentAnimation.speed = this.animationSpeed / rateMod;
}






Runner.prototype.updateMovement = function(direction){

	var friction = 0.08;


}


Runner.prototype.updateKeyDown = function(key) {
	if( !this.control ){
		return;
	}

	if(key == 'RIGHT'){
		this.rightKeyDown = true;
	}else if(key == 'LEFT'){
		this.leftKeyDown = true;
		this.friction = 0.8;
	} else if(key == 'UP' || key == 'JUMP'){
		this.jump();
		
	}else if(key == 'DOWN'){
		this.downKeyDown = true;
	}

	if(key == 'JUMP'){
		this.jumpKeyDown = true;
		// this.jump();
	}


};



Runner.prototype.updateKeyUp = function(key) {
	if( !this.control ){
		return;
	}
	// console.log( key, 'KEY HIT' );
	if(key == 'RIGHT'){
		this.rightKeyDown = false;
	}else if(key == 'LEFT'){
		this.leftKeyDown = false;
		this.friction = 0.08;
	} 
	if(key == 'UP'){
		this.upKeyDown = false;
		this.stopJumpUp();
	}else if(key == 'DOWN'){
		this.downKeyDown = false;
	}

	if(key == 'JUMP'){
		this.jumpKeyDown = false;
	}
};

Runner.prototype.hitByEnemy = function() {
	if(!this.invincible){
		this.invincible = true;
		this.health -= this.damageFromZombie;
		this.damage.play();

		this.takeDamageTimer.clear();
		this.takeDamageTimer.stop();
		this.takeDamageTimer.delay = 0.14;
		this.takeDamageTimer.repeatCount = 12;
		this.takeDamageTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.stopJump, this);
		this.takeDamageTimer.start();
		
	}
};

Runner.prototype.exitState = function() {
	game.states.switchState("Intro");

};
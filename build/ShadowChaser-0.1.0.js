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
//PlayerManager / Player
var Runner = function (state, x, y){
    Kiwi.GameObjects.Sprite.call(this, state, state.textures.runner, x, y, false);
    this.state = state;
    

    this.animation.add('idle', [0], 0.1, true);
    // this.animation.add('run', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 0.025, true);
    this.animation.add('run', [ 22, 23, 24, 25, 26, 27, 28, 29, 30 ], 0.05, true);
    this.animation.add('jumpStart', [ 09, 10 ], 0.05, false);
    this.animation.add('jump', [ 11 ], 0.05, false);
    this.animation.add('fallStart', [ 12, 13 ], 0.05, false);
    this.animation.add('fall', [ 14 ], 0.05, false);

    this.animation.play('run');   

    this.animation.getAnimation('jumpStart').onStop.add(this.loopJump, this);
    this.animation.getAnimation('fallStart').onStop.add(this.startFall, this);


    this.scaleX = 0.75;
    this.scaleY = 0.75; 

    this.box.hitbox = new Kiwi.Geom.Rectangle( 41, 63, 66, 110 ); 
    this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));

    this.physics.allowCollisions = Kiwi.Components.ArcadePhysics.FLOOR;
    

    this.force = 3;
    this.maxRunVelo = 200;
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

    this.jumpKeyDownTimer = this.game.time.clock.createTimer('jumpKeyDownTimer', 0.25, 0, false);

    



}
Kiwi.extend(Runner, Kiwi.GameObjects.Sprite);





Runner.prototype.update = function(){

  
    if( this.canJump && !this.jumpAnimationPlaying) {
        if(this.animation.currentAnimation.name != 'run' ){
            this.animation.play( 'run' );
        }
    }

     if(this.animation.currentAnimation.name == 'jump' || 
        this.animation.currentAnimation.name == 'jumpStart' ){
        this.updateJumpVelocity();

     } else {
        // this.physics.acceleration.y = this.yAccel * this.state.game.time.rate;
     }

    this.updateYAcceleration();

    this.playersVelocity = 1 - (1 / (this.accellerationTime + 1));

    this.accellerationTime += this.accellSpeed; //0.001;
    Kiwi.GameObjects.Sprite.prototype.update.call(this);

    this.playersVelocityAfter = this.playersVelocity * this.maxRunVelo;;
    this.physics.velocity.x = (this.playersVelocityAfter * game.time.rate);

    if(this.y > 700){
        this.y = -50;
        this.physics.velocity.y = 0;

        //this.endState();
    } 

    this.updateMovement();


    this.physics.update();
    this.checkCollisions();


    
    
}

Runner.prototype.checkCollisions = function(){

    //platformManager.platforms[for all].member[2]

    for (var i = this.state.platformManager.platforms.members.length - 1; i >= 0; i--) {
           if( this.physics.overlapsGroup( this.state.platformManager.platforms.members[i].members[1], true )) {

                if(this.physics.velocity.y == 0 ){
                        this.canJump = true;
                        return true;
                        
                    }
            }

    }
    this.canJump = false;
    return false;
    
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

Runner.prototype.jump = function () {
    if(this.canJump){
            this.upKeyDown = true;
            this.physics.velocity.y = -(this.jumpVelo);// * this.state.game.time.rate;
            this.physics.acceleration.y = 0;
            this.jumpAnimationPlaying = true;

            if(this.animation.currentAnimation.name != 'jumpStart' && this.animation.currentAnimation.name != 'jump' ){
                this.animation.play( 'jumpStart' );
            }




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
        
    }
    this.canJump = false;
}

Runner.prototype.startFall = function(){
    this.animation.play( 'fall' );
    this.jumpAnimationPlaying = false;
}
Runner.prototype.loopJump = function(){
    this.animation.play( 'jump' );
    this.jumpAnimationPlaying = false;
}

Runner.prototype.updateJumpVelocity = function(){
    this.physics.velocity.y = -(this.jumpVelo) * this.state.game.time.rate;
}

Runner.prototype.updateYAcceleration = function(){
    this.physics.acceleration.y = this.yAccel  * this.state.game.time.rate;
}








Runner.prototype.updateMovement = function(direction){

    var friction = 0.08;


}


Runner.prototype.updateKeyDown = function(key) {
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

var Platform = function( state, num ){
	Kiwi.Group.call(this, state);
	this.state = state;


	this.background = new Kiwi.GameObjects.StaticImage(this.state, this.state.textures[ 'platform0' + num ], 0, 0);
	// this.background = new Kiwi.GameObjects.Sprite( this.state, this.state.textures[ 'platform' ], 0, 0 );
	// this.background.cellIndex = num - 1;
	// this.background.scaleX = this.background.scaleX / 0.65 * 1.3;
	// this.background.scaleY = this.background.scaleY / 0.65 * 1.3;
	// this.background.x += 400;
	// this.background.y += 100;
	this.addChild(this.background);



	this.tiles = new Kiwi.Group (this.state);
	this.addChild( this.tiles );

	this.myJSONObject = this.state.data.platformJSON; //
	this.myJSONObject = JSON.parse( this.myJSONObject.data );

	// console.log(this);
	this.myTileArray = this.getTiles( num );
	

	this.generateTiles();

};
Kiwi.extend(Platform, Kiwi.Group);


Platform.prototype.getTiles = function( num ) {
	for (var i = this.myJSONObject.layers.length - 1; i >= 0; i--) {
		if ( this.myJSONObject.layers[i].name == 'bg0' + num ) {
			return this.myJSONObject.layers[i];
		}
	};
	console.error ( "Tiles were not found" );
	return false;
};


Platform.prototype.generateTiles = function () {

	// height and width are the h and w of the tilemap
	// tileHeight and tileWidth are == to the size of tiles 
	var height = 22,
		i = 0,
		tileLength = this.myTileArray.data.length,
		tileWidth = 44,
		tileHeight = 32, 
		width = 46;
	for ( i; i < tileLength; i++ ) {
		if( this.myTileArray.data[i] > 0 ) {
			// Stuff
			var tempTile, x, y;
			x = i % width;
			y = Math.floor( i / width );
			tempTile = new Tile( this.state, x * tileWidth, y * tileHeight );
			this.members[1].addChild( tempTile );


		}
	}
		

};

var Tile = function (state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures.tile, x, y);
	this.state = state;

	this.box.hitbox = new Kiwi.Geom.Rectangle( 0, 0, 44, 100 ); 

	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
	this.physics.immovable = true;
	//this.physics.acceleration.y = 15;
	//this.physics.velocity.y = 15;

	this.alpha = 1;




}
Kiwi.extend(Tile,Kiwi.GameObjects.Sprite);

	
   

Tile.prototype.update = function(){
	Kiwi.GameObjects.Sprite.prototype.update.call(this);

	this.physics.update();
	



}

   


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
var InputManager = function (state, x, y){
    this.state = state;



    
    this.keyboard = this.state.game.input.keyboard;
    this.mouse = this.state.game.input.mouse;

    

    ///////////////////
    //KEYBOARD
    this.rightKey = this.keyboard.addKey(Kiwi.Input.Keycodes.D);
    this.rightArrowKey = this.keyboard.addKey(Kiwi.Input.Keycodes.RIGHT);

    this.leftKey = this.keyboard.addKey(Kiwi.Input.Keycodes.A);
    this.leftArrowKey = this.keyboard.addKey(Kiwi.Input.Keycodes.LEFT);

    this.upKey = this.keyboard.addKey(Kiwi.Input.Keycodes.W);
    this.upArrowKey = this.keyboard.addKey(Kiwi.Input.Keycodes.UP);

    this.downKey = this.keyboard.addKey(Kiwi.Input.Keycodes.S);
    this.downArrowKey = this.keyboard.addKey(Kiwi.Input.Keycodes.DOWN);

    this.spawnKey = this.keyboard.addKey(Kiwi.Input.Keycodes.Q);
    this.restartKey = this.keyboard.addKey(Kiwi.Input.Keycodes.R);

    this.shootKey = this.keyboard.addKey(Kiwi.Input.Keycodes.J);
    this.shoot2Key = this.keyboard.addKey(Kiwi.Input.Keycodes.Z);

    this.jumpKey = this.keyboard.addKey(Kiwi.Input.Keycodes.K);
    this.jump2Key = this.keyboard.addKey(Kiwi.Input.Keycodes.X);

    this.gemKey = this.keyboard.addKey(Kiwi.Input.Keycodes.G);
    this.gameOverKey = this.keyboard.addKey(Kiwi.Input.Keycodes.F);

    this.captureKey = this.keyboard.addKey(Kiwi.Input.Keycodes.SPACEBAR);
    ////////////////////////
    //MOUSE
    this.state.game.input.onDown.add(this.mouseDown, this);
    this.state.game.input.onUp.add(this.mouseUp, this);

    this.keyboard.onKeyDownOnce.add(this.keyDownOnce, this);
    this.keyboard.onKeyUp.add(this.keyUp, this);








}

InputManager.prototype.mouseDown = function(x, y, timeDown, timeUp, duration, pointer) {
    //console.log(this.mouse.x, this.mouse.y);
    this.state.runner.updateKeyDown('UP');
    //this.mouse.reset();
    

};

InputManager.prototype.mouseUp = function(x, y, timeDown, timeUp, duration, pointer) {
    //console.log(this.mouse.x, this.mouse.y);
    this.state.runner.updateKeyUp('UP');

    // console.log("Click!");
    

};


InputManager.prototype.keyDownOnce = function(keyCode, key) {
    // body...
    //console.log(keyCode, key);

    if(keyCode == this.rightKey.keyCode || keyCode == this.rightArrowKey.keyCode){
        this.state.runner.updateKeyDown('RIGHT');
    } 

    if(keyCode == this.leftKey.keyCode || keyCode == this.leftArrowKey.keyCode){
        this.state.runner.updateKeyDown('LEFT');
    } 

    if(keyCode == this.upKey.keyCode || keyCode == this.upArrowKey.keyCode){
        this.state.runner.updateKeyDown('UP');
    } 
    if(keyCode == this.jumpKey.keyCode || keyCode == this.jump2Key.keyCode){
        this.state.runner.updateKeyDown('JUMP');
        this.keyUp(this.shootKey.keyCode, this.jumpKey);
    }

    if(keyCode == this.spawnKey.keyCode){
        this.state.enemyManager.addEnemies(1);
    }
    ////////////////////
    //Shooting
    if(keyCode == this.shootKey.keyCode || keyCode == this.shoot2Key.keyCode){
    }
    /////////////////////
    //Capture
    if(keyCode == this.captureKey.keyCode){
       
    }
    if(keyCode == this.gemKey.keyCode){
        var tempPoint = new Kiwi.Geom.Point(this.mouse.x, this.mouse.y);
        tempPoint = game.cameras.defaultCamera.transformPoint(tempPoint);
        this.state.itemManager.addItem('gem', tempPoint.x, tempPoint.y);
    }



};

InputManager.prototype.keyUp = function(keyCode, key) {
    // body...
    //console.log(keyCode, key);
    //Move
    if(keyCode == this.rightKey.keyCode || keyCode == this.rightArrowKey.keyCode){
        this.state.runner.updateKeyUp('RIGHT');
    } 

    if(keyCode == this.leftKey.keyCode || keyCode == this.leftArrowKey.keyCode){
        this.state.runner.updateKeyUp('LEFT');
    } 

    if(keyCode == this.upKey.keyCode || keyCode == this.upArrowKey.keyCode){
        this.state.runner.updateKeyUp('UP');
    } 
    //Jump
    if(keyCode == this.jumpKey.keyCode || keyCode == this.jump2Key.keyCode){
       this.state.runner.updateKeyUp('JUMP');
    }
    //Shoot
    if(keyCode == this.shootKey.keyCode || keyCode == this.shoot2Key.keyCode){
    }

    if(keyCode == this.restartKey.keyCode){
        this.state.levelManager.switchStates();
    }
    if(keyCode == this.gameOverKey.keyCode){
        // this.state.levelManager.gameOver();
    }
    

};

InputManager.prototype.switchStates = function(){
    this.keyboard.onKeyDownOnce.remove(this.keyDownOnce, this);
    this.keyboard.onKeyUp.remove(this.keyUp, this);
}

InputManager.prototype.getKeysDown = function(){
    var keys = {
        rightKey: this.rightKey.isDown || this.rightArrowKey.isDown,
        leftKey: this.leftKey.isDown || this.leftArrowKey.isDown,
        upKey: this.upKey.isDown || this.upArrowKey.isDown,
        downKey: this.downKey.isDown || this.downArrowKey.isDown
    }
    return keys;
}
PlatformManager = function(state){
	this.state = state;
	this.scale = 0.65;

	this.platformWidth = 2024; //2024;// * this.scale;

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
		tempPlat.x = i * 2024;
		//this.state.addChild( tempPlat );
		this.platforms.addChild( tempPlat );
	}



}

PlatformManager.prototype.checkPosition = function(){
	for (var i = this.platforms.members.length - 1; i >= 0; i--) {

		//console.log ( "Camera Calc:", (this.camera.transform.x * -1))
		if( this.platforms.members[i].worldX < (this.camera.transform.x * -1) - this.platformWidth ) {
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

//PlayerManager / Player
var PlayerManager = function (state){
    Kiwi.Group.call(this, state);
    this.state = state;
    
    
    this.velocityX = 0;
    this.velocityY = 0;


    ///////////////////
    //KEYBOARD
    this.rightKeyDown = false;
    this.leftKeyDown = false;
    this.jumpKeyDown = false;
    this.upKeyDown = false;
    this.downKeyDown = false;



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
    this.jumpVelo = 100;
    this.physics.acceleration.y = this.yAccel;
    this.canJump = true;

    this.jumpKeyDownTimer = this.game.time.clock.createTimer('jumpKeyDownTimer', 0.25, 0, false);

    



}
Kiwi.extend(PlayerManager, Kiwi.GameObjects.Sprite);





PlayerManager.prototype.update = function(){
    if(this.state.paused){
        this.animation.pause();

    } else{
        if(!this.animation._isPlaying){
            this.animation.resume();
        }




        this.playersVelocity = 1 - (1 / (this.accellerationTime + 1));

        //console.log(this.playersVelocity, this.playersVelocity * this.maxRunVelo);
        this.accellerationTime += this.accellSpeed; //0.001;

        //Control Accelleration time to control velocity. Changing the accellerationTime by 80% will reduce speed by 80%
        // this.accellerationTime = 1 / (1- this.velocity) - 1;
        // console.log(t);

        Kiwi.GameObjects.Sprite.prototype.update.call(this);
        /* if(this.x > 2200){
            this.x = -50;
        } else if(this.x < -50){
            this.x = 2200;
        }*/

        this.playersVelocityAfter = this.playersVelocity * this.maxRunVelo;;
        this.physics.velocity.x = (this.playersVelocityAfter * game.time.rate);

        if(this.y > 700){
            this.y = -50;
            this.physics.velocity.y = 0;

            this.endState()
        } 

        this.updateMovement();


        this.physics.update();

        ///////////////////
        //PLATFORM COLLISION DETECTION
        // for (var i = this.state.platformManager.platforms.members.length - 1; i >= 0; i--) {
        //     if(this.physics.isTouching(this.state.platformManager.platforms.members[i])){
        //         this.canJump = true;
        //         console.log("Here!!!")
        //         break;
        //     } else {
        //         this.canJump = false;
        //     }
        // }

        if(this.physics.overlapsGroup(this.state.platformManager.platforms, true)){
            if(this.physics.velocity.y == 0 ){
                this.canJump = true;
                
            }
        }else {
            this.canJump = false;
        }
    }

    
    
}

PlayerManager.prototype.endState = function() {
    console.log("END");
    this.state.hudManager.endState();
    this.state.inputManager.endState();

    var params = { thing: {
        score: this.state.hudManager.score
        
      }


    }

  game.states.switchState("GameOver", null, null, params);
};

PlayerManager.prototype.slowPlayer = function() {
    this.accellerationTime = 1/(1- (this.playersVelocity / this.speedDropPercentage) ) - 1;

};









PlayerManager.prototype.updateMovement = function(direction){

    var friction = 0.08;





    if(this.rightKeyDown){
        
    } 
    if(this.leftKeyDown){
        
        

    } 
    if(this.downKeyDown){
       

    } 
    if(this.upKeyDown){
        
        

    }


}


PlayerManager.prototype.updateKeyDown = function(key) {
    if(key == 'RIGHT'){
        this.rightKeyDown = true;
    }else if(key == 'LEFT'){
        this.leftKeyDown = true;
        this.friction = 0.8;
    } else if(key == 'UP'){
        if(this.canJump){
            this.upKeyDown = true;
            this.physics.velocity.y = -(this.jumpVelo);// * game.time.rate);
            this.physics.acceleration.y = 0;


            this.jumpKeyDownTimer.clear();
            this.jumpKeyDownTimer.stop();
            this.jumpKeyDownTimer.delay = 0.25;
            this.jumpKeyDownTimer.repeatCount = 1;
            this.jumpKeyDownTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.stopJumpUp, this);
            this.jumpKeyDownTimer.start();
        }



        
    }else if(key == 'DOWN'){
        this.downKeyDown = true;
    }

    if(key == 'JUMP'){
        this.jumpKeyDown = true;
        this.jump();
    }


};



PlayerManager.prototype.updateKeyUp = function(key) {
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

PlayerManager.prototype.hitByEnemy = function() {
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
PlayerManager.prototype.stopJumpUp = function(){
    this.physics.acceleration.y = this.yAccel;
    this.canJump = false;
}

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
	game.states.switchState("Play");

}
/**
* The Loading State is going to be used to load in all of the in-game assets that we need in game.
*
* Because in this blueprint there is only a single "hidden object" section we are going to load in all of 
* the asset's at this point.
*
* If you have multiple states however, I would recommend have loading the other graphics as they are required by their states, 
* Otherwise the loading times maybe a bit long and it is not the most optimal solution.
*
*/

/**
* Since we want to use the custom Kiwi.JS loader with the bobing kiwi/html5 logo and everything. We need to extend the KiwiLoadingScreen State.  
* The KiwiLoadingScreen State is an extentsion of a normal State but it has some custom code to handle the loading/bobbing/fading of all the items, so if you override a method (like the preload) for example just make sure you call the super method.
* 
* The parameters we are passing into this method are as ordered.
* 1 - name {String} Name of this state.
* 2 - stateToSwitch {String} Name of the state to switch to AFTER all the assets have loaded. Note: The state you want to switch to should already have been added to the game.
* 3 - dimensions {Object} A Object containing the width/height that the game is to be. For example {width: 1024, height: 768}
* 4 - subfolder {String} The folder that the loading graphics are located at. 
*/

var ShadowChaser = ShadowChaser || {};

ShadowChaser.Loading = new KiwiLoadingScreen('Loading', 'Intro', 'assets/img/loading/');

ShadowChaser.Loading.preload = function () {
	
	//Make sure to call the super at the top.
	//Otherwise the loading graphics will load last, and that defies the whole point in loading them. 
	KiwiLoadingScreen.prototype.preload.call(this);

	/**
	* Replace with your own in-assets to load.
	**/

	this.backgroundCharactersAssets();
	this.environmentAssets();
	this.menuAssets();
	this.platformAssets();
	this.runnerAssets();

};


ShadowChaser.Loading.backgroundCharactersAssets = function(){
	
	// this.addSpriteSheet('player', 'assets/img/characterSprites/player.png', 150, 120);

}

ShadowChaser.Loading.environmentAssets = function(){
	
	// this.addImage('background', 'assets/img/environment/background.jpg');

}

ShadowChaser.Loading.menuAssets = function(){

	// Main Menu Assets
	this.addImage( 'menuBackground', 'assets/img/menu/background.png' );
	this.addSpriteSheet( 'breakFree', 'assets/img/menu/break-free.png', 424, 96 );
	
	// this.addSpriteSheet('pauseButton', 'assets/img/scenes/pauseScreen/pause.png', 61, 46);

}
ShadowChaser.Loading.platformAssets = function(){
	this.addJSON( 'platformJSON', 'assets/tilemaps/platform-tiles/platforms.json' );
	this.addImage( 'platform01', 'assets/img/platforms/bg_01.jpg' );
	this.addImage( 'platform02', 'assets/img/platforms/bg_02.jpg' );
	this.addImage( 'platform03', 'assets/img/platforms/bg_03.jpg' );
	this.addImage( 'platform04', 'assets/img/platforms/bg_04.jpg' );
	this.addImage( 'platform05', 'assets/img/platforms/bg_05.jpg' );
	this.addImage( 'platform06', 'assets/img/platforms/bg_06.jpg' );
	this.addImage( 'platform07', 'assets/img/platforms/bg_07.jpg' );
	this.addImage( 'platform08', 'assets/img/platforms/bg_08.jpg' );
	// this.addSpriteSheet( 'platform', 'assets/img/platforms/bg-images.jpg', 1012, 320 );

	this.addImage( 'tile', 'assets/img/platforms/tile.png' );
	
	// this.addSpriteSheet('platformLarge', 'assets/img/platforms/long-platforms.png', 532, 96);
}

ShadowChaser.Loading.runnerAssets = function(){
	
	this.addSpriteSheet('runner', 'assets/img/runner/viktor-actions-sprite-sheet.png', 159, 189 );
}



var ShadowChaser = ShadowChaser || {};

ShadowChaser.Play = new Kiwi.State('Play');


ShadowChaser.Play.create = function () {
	console.log( "Inside Play State" );
	this.platformManager = new PlatformManager( this );
	this.platformManager.createPlatforms();

	this.camera = this.game.cameras.defaultCamera;

	this.runner = new Runner(this, 200, 150);
	this.addChild( this.runner );

	
	this.inputManager = new InputManager( this, 0, 0 );
	this.cameraManager = new CameraManager( this );



}



ShadowChaser.Play.update = function() {
	Kiwi.State.prototype.update.call(this);
	this.camera.transform.x -= 10 /** this.game.time.rate */;
	this.cameraManager.update();


	this.platformManager.update();
}





/**
* The core CocoonAdBlueprint game file.
* 
* This file is only used to initalise (start-up) the main Kiwi Game 
* and add all of the relevant states to that Game.
*
*/

//Initialise the Kiwi Game. 

var gameOptions = {
	renderer: Kiwi.RENDERER_CANVAS, 
	// width: 500,
	// height: 200,
	width: 1136,
	height: 416,
	deviceTarget: Kiwi.TARGET_COCOON,
	plugins: [], //,
	scaleType: Kiwi.Stage.SCALE_FIT
}

var game = new Kiwi.Game('content', 'ShadowChaser', null, gameOptions);
this.game.stage.color = "332f3d";


//Add all the States we are going to use.
game.states.addState(ShadowChaser.Loading);
game.states.addState(ShadowChaser.Intro);
game.states.addState(ShadowChaser.Play);
game.states.addState(ShadowChaser.GameOver);

game.states.switchState("Loading");
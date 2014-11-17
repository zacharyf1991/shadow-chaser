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

    this.animation.add('run', [ 22, 23, 24, 25, 26, 27, 28, 29, 30 ], this.animationSpeed, true);

    this.animation.play('run');   

    this.animation.getAnimation('jumpStart').onStop.add(this.loopJump, this);
    this.animation.getAnimation('fallStart').onStop.add(this.startFall, this);



    // this.scaleX = 0.75;
    // this.scaleY = 0.75; 

    this.box.hitbox = new Kiwi.Geom.Rectangle( 41, 63, 66, 110 ); 
    this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));

    this.physics.allowCollisions = Kiwi.Components.ArcadePhysics.FLOOR;
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

    this.jumpKeyDownTimer = this.game.time.clock.createTimer('jumpKeyDownTimer', 0.25, 0, false);

    



}
Kiwi.extend(Runner, Kiwi.GameObjects.Sprite);





Runner.prototype.update = function(){
    Kiwi.GameObjects.Sprite.prototype.update.call(this);

    if( this.state.bloodBar.blood < 40 ) {
        this.die();
    }

  
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
    this.updateXVelocity();
    this.updateAnimationSpeed();

    

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

Runner.prototype.die = function() {
    if(this.animation.currentAnimation.name != 'die' ){
        this.animation.play('die');
    }

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

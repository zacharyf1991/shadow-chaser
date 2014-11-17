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

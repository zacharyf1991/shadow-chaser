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

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
	scaleType: Kiwi.Stage.SCALE_FIT,
	plugins: []
}

var game = new Kiwi.Game('content', 'ShadowChaser', null, gameOptions);
this.game.stage.color = "332f3d";


//Add all the States we are going to use.
game.states.addState(ShadowChaser.Loading);
game.states.addState(ShadowChaser.Intro);
game.states.addState(ShadowChaser.Play);
game.states.addState(ShadowChaser.Escape);
game.states.addState(ShadowChaser.GameOver);

game.states.switchState("Loading");
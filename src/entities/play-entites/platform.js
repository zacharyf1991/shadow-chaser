var Platform = function( state, num ){
	Kiwi.Group.call(this, state);
	this.state = state;


	//this.background = new Kiwi.GameObjects.StaticImage(this.state, this.state.textures[ 'platform0' + num ], 0, 0);
	this.background = new Kiwi.GameObjects.Sprite( this.state, this.state.textures[ 'platform' ], 0, 0 );
	this.background.cellIndex = num - 1;
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
	

	// this.generateTiles();
	this.tilesGenerated = false;

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
	if(this.tilesGenerated){
		return;
	}

	// height and width are the h and w of the tilemap
	// tileHeight and tileWidth are == to the size of tiles 
	var height = 22,
		i = 0,
		tileLength = this.myTileArray.data.length,
		tileWidth = 22,
		tileHeight = 16, 
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

	this.tilesGenerated = true;
		

};

Platform.prototype.removeTiles = function () {
	if(!this.tilesGenerated){
		return;
	}
		
	for (var i = this.members[1].members.length - 1; i >= 0; i--) {
		this.members[1].members[i].exists = false;
	};
	this.tilesGenerated = false;
};
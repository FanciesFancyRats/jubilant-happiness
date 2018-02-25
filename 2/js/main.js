//Text isn't working properly, it's hiding the rest of the sprites. I'll try to figure this out later tonight
//this game will have only 1 state0
var GameState = {
  //load the game assets before the game starts
  preload: function() {
   this.game.load.image('background', 'assets/images/background.png');
   this.game.load.image('arrow', 'assets/images/arrow.png');
   //this.game.load.image('chicken', 'assets/images/chicken.png');
   // this.game.load.image('horse', 'assets/images/horse.png');
   // this.game.load.image('pig', 'assets/images/pig.png');
   // this.game.load.image('sheep', 'assets/images/sheep3.png');
   
	this.load.spritesheet('chicken', 'assets/chicken_spritesheet.png',131,200,3);
	this.load.spritesheet('horse', 'assets/horse_spritesheet.png',212,200,3);
	this.load.spritesheet('pig', 'assets/pig_spritesheet.png', 297, 200, 3);
	this.load.spritesheet('sheep', 'assets/sheep_spritesheet.png',244,200,3);
	
	this.load.audio('chickenSound', ['assets/audio/chicken.ogg', 'assets/audio/chicken.mp3']);
	this.load.audio('horseSound', ['assets/audio/horse.ogg', 'assets/audio/horse.mp3']);
	this.load.audio('pigSound', ['assets/audio/pig.ogg', 'assets/audio/pig.mp3']);
	this.load.audio('sheepSound', ['assets/audio/sheep.ogg', 'assets/audio/sheep.mp3']);


  },
  //executed after everything is loaded
  create: function() {
    
    //scaling options
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    
    //have the game centered horizontally
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    
    //create a sprite for the background
    this.background = this.game.add.sprite(0, 0, 'background')
    
    //group for animals
    var animalData = [
      {key: 'chicken', text: 'CHICKEN', audio: 'chickenSound'},
      {key: 'horse', text: 'HORSE', audio: 'horseSound'},
      {key: 'pig', text: 'PIG', audio: 'pigSound'},
      {key: 'sheep', text: 'SHEEP', audio: 'sheepSound'}
    ];
    
    this.animals = this.game.add.group();

    var self = this;
    var animal;

    animalData.forEach(function(element){
      //create each animal and put it in the group
      animal = self.animals.create(-1000, self.game.world.centerY, element.key, 0);

      //I'm saving everything that's not Phaser-related in a custom property
      animal.customParams = {text: element.text, sound: self.game.add.audio(element.audio)};

      //anchor point set to the center of the sprite
      animal.anchor.setTo(0.5);

      //Create animal animation
      animal.animations.add('animate', [0, 1, 2, 1, 0, 1], 3, false);

      //enable input so we can touch it
      animal.inputEnabled = true;
      animal.input.pixelPerfectClick = true;
      animal.events.onInputDown.add(self.animateAnimal, self);
    });

    //place current animal in the middle
    this.currentAnimal = this.animals.next();
    this.currentAnimal.position.set(this.game.world.centerX, this.game.world.centerY);
    
    //show Animal Text
    this.showText(this.currentAnimal);

    //left arrow
    this.leftArrow = this.game.add.sprite(60, this.game.world.centerY, 'arrow');
    this.leftArrow.anchor.setTo(0.5);
    this.leftArrow.scale.x = -1;
    this.leftArrow.customParams = {direction: -1};

    //left arrow user input
    this.leftArrow.inputEnabled = true;
    this.leftArrow.input.pixelPerfectClick = true;
    this.leftArrow.events.onInputDown.add(this.switchAnimal, this);

    //right arrow
    this.rightArrow = this.game.add.sprite(580, this.game.world.centerY, 'arrow');
    this.rightArrow.anchor.setTo(0.5);
    this.rightArrow.customParams = {direction: 1};

    //right arrow user input
    this.rightArrow.inputEnabled = true;
    this.rightArrow.input.pixelPerfectClick = true;
    this.rightArrow.events.onInputDown.add(this.switchAnimal, this);    

  },
  //this is executed multiple times per second
  update: function() {
  },
  //play animal animation
  animateAnimal: function(sprite, event) {
    console.log('animate..');
    sprite.play('animate');
    sprite.customParams.sound.play(); 
  },
  //switch animal
  switchAnimal: function(sprite, event) {
	console.log('move animal');
	
	if(this.isMovingx) {

		return false;		
	}
	
	this.isMovingx = true;

	//hide text
	this.animalText.visible = false;

	//1. get direction of arrow
	if(sprite.customParams.direction > 0) {
		newAnimal = this.animals.next();
		newAnimal.x = -newAnimal.width/2;
		endX = 640 + this.currentAnimal.width/2;
		
	}
	else {
		newAnimal = this.animals.previous();
		newAnimal.x = 640 + newAnimal.width/2;
		endX = -this.currentAnimal.width/2;

	}
	var newAnimalMovement = game.add.tween(newAnimal);
	newAnimalMovement.to({x: this.game.world.centerX}, 1000);
	newAnimalMovement.onComplete.add(function(){
		this.isMovingx = false;	
		this.showText(newAnimal);
	}, this);
	newAnimalMovement.start();
	
	var currentAnimalMovement = game.add.tween(this.currentAnimal);
	currentAnimalMovement.to({x: endX}, 1000);
	currentAnimalMovement.start();

//I commented these two out, need to set up a work enviroment so I can test this out. I'll take a look when I get home	
	//Move the current animal 
//	this.currentAnimal.x = endX;
	//move the next animal in the group to the center of the game screen
//	newAnimal.x = this.game.world.centerX;
	//change the variable over between the last and just moved animal
	this.currentAnimal = newAnimal;
  },
	showText: function(animal) {
	if(!this.animalText){
		this.animalText = this.game.add.text(this.game.width/2, this.game.height * 0.85, '');
	this.animalText.ancor.setTo(0.5);
	}

	this.animalText.setText(animal.customParams.text);
	this.animalText.visible = true;
	}
  

};

//initiate the Phaser framework
var game = new Phaser.Game(640, 360, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');

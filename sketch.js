// Base Defence 
// Kamaluddin Hashimy
// TBD
//
// Extra for Experts:
// need some time to think about it


class Character{
  constructor(name, size, speed, strenght, health, img, x, y, diraction){
    this.name = name;
    this.size = size;
    this.speed = speed;
    this.strenght = strenght;
    this.health = health;
    this.img = img;
    this.x = x;
    this.y = y;
    this.frame = 1;
    this.diraction = diraction;
  }

  showHealth(){
    
  }

  action(imgNum){
    image(this.img[imgNum], this.x, this.y, this.size, this.size, this.img[imgNum].height*floor(this.frame), 0, this.img[imgNum].height);
    if (this.frame*this.img[imgNum].height > this.img[imgNum].width-this.img[imgNum].height){
      this.frame = 1;
    }
    else{
      this.frame += this.speed-0.1;
    }
  }

  idle(){
    this.action(0);
  }

  blink(){
    this.action(1);
  }
  
  walk(){
    this.action(2);
    if (this.diraction === 'r'){
      this.x += this.speed;
    }
    else if (this.diraction === 'l'){
      this.x -= this.speed;
    }
  }
  
  slash(){
    this.action(3);
  }

  throw(){
    this.action(4);
  }

  die(){
    this.action(5);
  }

  alive(){

  }
}


class Maps {
  constructor(paths) {
    this.path = paths;
  }
}


class TheGame{
  constructor(mode, level){
    this.mode = mode;
    this.level = level;
    this.baseHealth = 1000;
    this.coins = 0;
    this.counter = millis();
  }

  displayCharactersToSelect(){
    for(let character in allCharacters){
      if (dist(allCharacters[character].x, allCharacters[character].y, mouseX, mouseY)<allCharacters[character].size/3){
        allCharacters[character].slash();
      }
      else{
        allCharacters[character].idle();
      }
    }
  }

  coinCounter(){
    if(millis()>this.counter+1000){
      this.coins++;
      this.counter = millis();
    }
    textSize(50);
    text(this.coins,25,50);
  }

  startNormalGame(){
    this.displayCharactersToSelect();
    this.coinCounter();
  }

  checkMode(){
    if (this.mode === 'normal'){
      this.startNormalGame();
    }
  }


}

let game;
let characterActionsToPreload = ['idle','idleblinking','walk','slash','throw','die'];
let imgHeight = 100;


let maps = { //defining all the maps
  greenland : '',
};

let allCharacters = { //difine all characters
  bolder1 : "",
  bolder2 : "",
  goblin : "",
};

let allCharactersImgs = {  //difine all characters images
  bolder1 : [],
  bolder2 : [],
  goblin : [],
};


function helpPreloadCharacters(fileName){
  let imgList = [];
  for(let file of characterActionsToPreload){
    imgList.push(loadImage('characters\\'+fileName+'\\'+file+'.png'));
  }
  return imgList;
}


function preload(){
  for (let characterImg in allCharactersImgs){
    allCharactersImgs[characterImg] = helpPreloadCharacters(characterImg);
  }
  for (let map in maps){
    maps[map] = loadImage('maps\\'+map+'.png');
  }
}


function runInSetup(){
  let space = 150;
  for(let character in allCharacters){
    allCharacters[character] = new Character(character, 100, 0.4, 50, 100, allCharactersImgs[character], space, 50, 'r');
    space+=100;
  }
}
  

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  runInSetup();
  game = new TheGame('normal', 10);
}


function draw() {
  image(maps.greenland, width/2, height/2, width, height);
  game.checkMode();
}


function mousePressed(){
}


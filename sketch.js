// Base Defence 
// Kamaluddin Hashimy
// TBD
//
// Extra for Experts:
// need some time to think about it


class Character{
  constructor(name, speed, strenght, health, img, x, y, diraction){
    this.name = name;
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
    image(this.img[imgNum], this.x, this.y, 100, 100, this.img[imgNum].height*floor(this.frame), 0, this.img[imgNum].height);
    if (this.frame*this.img[imgNum].height > this.img[imgNum].width){
      this.frame = 0;
    }
    else{
      this.frame+=0.2;
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

  checkMode(){
    if (this.mode === 'normal'){
      this.startNormalGame();
    }
  }

  startNormalGame(){
    if(this.counter%500 === 0){
      this.coins++;
    }
    textSize(10);
    text(this.coins,50,50);

  }

}

let game;
let characterActionsToPreload = ['idle','blink','walk','slash','throw','die'];
let imgHeight = 100;


let maps = { //defining all the maps
  greenland : '',
};
let allCharacters = { //difine all characters
  bolder : "",
};
let allCharactersImgs = {  //difine all characters images
  bolder : [],
};


function helpPreloadCharacters(fileName, fileNUmber){
  let imgList = [];
  for(let file of characterActionsToPreload){
    imgList.push(loadImage('characters\\'+fileName+'\\'+fileNUmber+'\\'+file+'.png'));
  }
  return imgList;
}


function preload(){
  for (let characterImg in allCharactersImgs){
    allCharactersImgs[characterImg] = helpPreloadCharacters(characterImg,'1');
  }
  for (let map in maps){
    maps[map] = loadImage('maps\\'+map+'.png');
  }
  topleft = loadImage('maps\\leftcharplace.png');
  topright = loadImage('maps\\rightcharplace.png');

}


function runInSetup(){
  for(let character in allCharacters){
    allCharacters[character] = new Character(character, 0.5, 50, 100, allCharactersImgs[character], width/2, height/2);
  }
}
  

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  runInSetup();
  game = new TheGame('normal', 10);
}


function eneamyBolder(){
  
}


function draw() {
  image(maps.greenland, width/2, height/2, width, height);
  if (dist(allCharacters.bolder.x, allCharacters.bolder.y, mouseX, mouseY)<25 ){
    allCharacters.bolder.slash();
  }
  else{
    allCharacters.bolder.idle();
  }
  
}


function mousePressed(){
}
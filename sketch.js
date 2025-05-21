// Base Defence 
// Kamaluddin Hashimy
// TBD
//
// Extra for Experts:
// need some time to think about it


class Character{
  constructor(price, size, speed, strenght, health, img, x, y, diraction){
    this.price = price;
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
    for(let character = 0; character < allCharacters.length; character++){
      if (dist(allCharacters[character].x, allCharacters[character].y, mouseX, mouseY)<allCharacters[character].size/3){
        allCharacters[character].blink();
      }
      else{
        allCharacters[character].idle();
      }
    }
  }

  gameAction(){
    for(let character = 0; character < actionCharacters.length; character++){
      actionCharacters[character].walk();

      // if (dist(actionCharacters[character].x, actionCharacters[character].y, mouseX, mouseY)<actionCharacters[character].size/3){
      // actionCharacters[character].blink();
      // }
      // else{
      //   actionCharacters[character].idle();
      // }
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
    this.gameAction();
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
let ogY = 'empty';//using empty becouse 0 was a needed value
let ogX = 'empty';//using empty becouse 0 was a needed value
let drag = 'empty';//using empty becouse 0 was a needed value


let maps = { //defining all the maps
  greenland : '',
};


let characterImagesToPreload = ['bolder1', 'bolder2', 'bolder3', 'goblin'];
let allCharacters = []; //store all characters
let actionCharacters = []; //store all characters
let allCharactersImgs = [];  //difine all characters images


function helpPreloadCharacters(fileName){
  let imgList = [];
  for(let file of characterActionsToPreload){
    imgList.push(loadImage('characters\\'+fileName+'\\'+file+'.png'));
  }
  return imgList;
}


function preload(){
  for (let characterImg of characterImagesToPreload){
    allCharactersImgs.push(helpPreloadCharacters(characterImg));
  }
  for (let map in maps){
    maps[map] = loadImage('maps\\'+map+'.png');
  }
}


function runInSetup(){
  let space = 150;
  for(let character in allCharactersImgs){
    allCharacters.push(new Character(0, 100, 0.35, 50, 100, allCharactersImgs[character], space, 50, 'r'));
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
  if (drag !== 'empty'){
    allCharacters[drag].x = mouseX;
    allCharacters[drag].y = mouseY;
  }
}


function mousePressed(){
  for(let character in allCharacters){
    if (dist(allCharacters[character].x, allCharacters[character].y, mouseX, mouseY)<allCharacters[character].size/3){
      drag = character;
      ogX = allCharacters[drag].x;
      ogY = allCharacters[drag].y;
    }
  }
}


function mouseReleased(){
  if (drag !== 'empty'){
    allCharacters[drag].x = ogX;
    allCharacters[drag].y = ogY;
    
    actionCharacters.push(new Character(0 ,150,2,50,100,allCharactersImgs[drag],mouseX,mouseY,'r'));
    
    ogX = 'empty';
    ogY = 'empty';
    drag = 'empty';
  }
}


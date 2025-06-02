// Base Defence 
// Kamaluddin Hashimy
// TBD
//
// Extra for Experts:
// need some time to think about it


class Character{
  constructor(price, size, speed, strenght, health, img, x, y, diraction, hitType){
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
    this.hitType = hitType;
    if (hitType === 'close'){
      this.hitZone = this.size/3;
    }
    else if (hitType === 'far'){
      this.hitZone = this.size;
    }
  }

  showHealth(){
    
  }

  action(imgNum){
    if (this.diraction === 'r'){
      image(this.img[imgNum], this.x, this.y, this.size, this.size, this.img[imgNum].height*floor(this.frame), 0, this.img[imgNum].height);
    }
    if (this.diraction === 'l'){
      push();
      scale(-1, 1);
      image(this.img[imgNum], -this.x, this.y, this.size, this.size, this.img[imgNum].height*floor(this.frame), 0, this.img[imgNum].height);
      pop();
    }
    if (this.frame*this.img[imgNum].height > this.img[imgNum].width-this.img[imgNum].height){
      this.frame = 1;
    }
    else{
      this.frame += this.speed-0.2;
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
  
  hit(){
    // this.action(3);
    if (this.hitType === 'close'){
      this.action(3);
    }
    else if (this.hitType === 'far'){
      this.action(4);
    }
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
  constructor(){
    this.mode = 'normal';
    this.level = 1;
    this.baseHealth = 1000;
    this.coins = 0;
    this.enemyCoins = 0;
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
    for(let character of actionCharacters){
      if (character.x > width-100 ){
        character.hit();
      }
      else{
        character.hit();
        
      }
    }

    for(let enemy of actionEnemies){
      if (enemy.x < 100){
        enemy.blink();
      }
      else{
        enemy.walk();
        // for(let character of actionCharacters){
        //   if (character.x < enemy.x + enemy.hitZone){
        //     character.hit();
        //   }
        //   else{
        //     character.walk();
            
        //   }
        // }
      }
    }
  }

  coinCounter(){
    if(millis()>this.counter+1000){
      this.coins++;
      this.enemyCoins++;
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

  mainMenu(){
    textAlign(CENTER);
    textSize(100);
    let wlc = text('Welcome to The Game', width/2, height/3);
    textSize(50);
    let normal = text('Normal Game', width/2, height/4*2);
    textSize(50);
    let cheat = text('Cheat Mode', width/2, height/5*3);
  }

  checkMods(){
    if (this.mode === 'menu'){
      this.mainMenu();
    }
    else if (this.mode === 'normal'){
      this.startNormalGame();
    }
    else if (this.mode === 'cheat'){
      this.startCheatGame();
    }
    else if (this.mode === 'controls'){
      this.controlPage();
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

let characterImagesToPreloadAndSpicifcs = [
  //      price, size, speed, strenght, health, hitZone
  ['bolder1', [25, 150, 0.4, 50, 500, 'close']],
  // ['bolder2', [25, 180, 0.35, 60, 500]],
  // ['bolder3'],
  ['goblin', [5, 100, 0.6, 15, 100, 'close']],
];
let allCharacters = []; //store all characters
let actionEnemies = []; //store all characters
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
  for (let characterImg of characterImagesToPreloadAndSpicifcs){
    allCharactersImgs.push(helpPreloadCharacters(characterImg[0]));
  }
  for (let map in maps){
    maps[map] = loadImage('maps\\'+map+'.png');
  }
}


function runInSetup(){
  let space = 150;
  for(let character in allCharactersImgs){
    allCharacters.push(new Character(0, 100, 0.35, 50, 100, allCharactersImgs[character], space, 50, 'r', 10));
    space+=100;
  }
}
  

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  runInSetup();
  game = new TheGame();
}


function draw() {
  image(maps.greenland, width/2, height/2, width, height);
  game.checkMods();
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
    
    actionCharacters.push(new Character(characterImagesToPreloadAndSpicifcs[drag][1][0] ,characterImagesToPreloadAndSpicifcs[drag][1][1], characterImagesToPreloadAndSpicifcs[drag][1][2], characterImagesToPreloadAndSpicifcs[drag][1][3], characterImagesToPreloadAndSpicifcs[drag][1][4],allCharactersImgs[drag],100,height/2,'r', characterImagesToPreloadAndSpicifcs[drag][1][5]));
    actionEnemies.push(new Character(characterImagesToPreloadAndSpicifcs[drag][1][0] ,characterImagesToPreloadAndSpicifcs[drag][1][1], characterImagesToPreloadAndSpicifcs[drag][1][2], characterImagesToPreloadAndSpicifcs[drag][1][3], characterImagesToPreloadAndSpicifcs[drag][1][4],allCharactersImgs[drag],width-100,height/2,'l', characterImagesToPreloadAndSpicifcs[drag][1][5]));
    
    ogX = 'empty';
    ogY = 'empty';
    drag = 'empty';
  }
}


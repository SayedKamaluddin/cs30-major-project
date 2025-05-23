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
  constructor(){
    this.mode = 'normal';
    this.level = 1;
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
      
      if (actionCharacters[character].x > width-200 || actionCharacters[character].x < 0){
        actionCharacters[character].blink();
      }
      else{
        actionCharacters[character].walk();
      }

      // if (dist(actionCharacters[character].x, actionCharacters[character].y, mouseX, mouseY)<actionCharacters[character].size/3){
      //   actionCharacters[character].blink();
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

  mainMenu(){
    textAlign(CENTER);
    textSize(100);
    let will = text('Welcome to The Game', width/2, height/3);
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

//                                       price, size, speed, strenght, health,
let characterImagesToPreloadAndSpicifcs = [
  ['bolder1', [25, 150, 0.3, 50, 500]],
  // ['bolder2'],
  // ['bolder3'],
  ['goblin', [5, 100, 0.6, 15, 100]]
];
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
    allCharacters.push(new Character(0, 100, 0.35, 50, 100, allCharactersImgs[character], space, 50, 'r'));
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

let another;

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
    
    actionCharacters.push(new Character(characterImagesToPreloadAndSpicifcs[drag][1][0] ,characterImagesToPreloadAndSpicifcs[drag][1][1], characterImagesToPreloadAndSpicifcs[drag][1][2], characterImagesToPreloadAndSpicifcs[drag][1][3], characterImagesToPreloadAndSpicifcs[drag][1][4],allCharactersImgs[drag],100,height/2,'r'));
    actionCharacters.push(new Character(characterImagesToPreloadAndSpicifcs[drag][1][0] ,characterImagesToPreloadAndSpicifcs[drag][1][1], characterImagesToPreloadAndSpicifcs[drag][1][2], characterImagesToPreloadAndSpicifcs[drag][1][3], characterImagesToPreloadAndSpicifcs[drag][1][4],allCharactersImgs[drag],width,height/2,'l'));

    
    ogX = 'empty';
    ogY = 'empty';
    drag = 'empty';
  }
}


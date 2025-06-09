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
    this.maxHealth = health;
    this.img = img;
    this.x = x;
    this.y = y;
    this.frame = 1;
    this.lastFrame;
    this.isDead = 0;
    this.diraction = diraction;
    this.hitType = hitType;
    if (hitType === 'close'){
      this.hitZone = this.size/2;
    }
    else if (hitType === 'far'){
      this.hitZone = this.size *2;
    }
  }

  showHealth(health, maxHealth, x, y, color) {
    stroke (0);
    strokeWeight(4);
    noFill();
    rect(x, y, 40, 5); 
    noStroke(); 
    fill(color); 
    rect(x, y, map(health, 0, maxHealth, 0, 40), 5); 
  }

  action(imgNum){
    imageMode(BOTTOM);
    if (this.health < 0){
      this.health = 0;
    }
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
      this.lastFrame = this.frame;
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
    if(!this.isDead){
      this.frame = 1;
    }
    this.isDead+=this.speed-0.2;
    this.action(5);
  }

}


class TheGame{
  constructor(){
    this.mode = 'menu';
    this.level = 1;
    this.baseHealth = 1000;
    this.coins = 100;
    this.enemyCoins = 0;
    this.counter = millis();
  }

  displayCharactersToSelect(){
    for(let character = 0; character < allCharacters.length; character++){
      if (dist(allCharacters[character].x, allCharacters[character].y, mouseX, mouseY)<allCharacters[character].size/3){
        printText(allCharacters[character].price, allCharacters[character].x, allCharacters[character].y+allCharacters[character].size/2+10, 20, true);
        allCharacters[character].blink();
      }
      else{
        printText(allCharacters[character].price, allCharacters[character].x, allCharacters[character].y+allCharacters[character].size/2+10, 20, false);
        allCharacters[character].idle();
      }
    }
  }

  gameAction(){
    for(let character of actionCharacters){
      character.showHealth(character.health, character.maxHealth, character.x-20, character.y-character.size/3, 'green');
      if (character.x > width-100 ){
        character.hit();
      }
      else if(character.health<=0){
        // character.frame = 1;
        character.die();
        if(character.isDead >= round(character.lastFrame)){
          actionCharacters.splice(actionCharacters.indexOf(character), 1);
        }
      }
      else{
        let tempHit = 'none';
        for(let enemy of actionEnemies){
          if (dist(character.x , character.y, enemy.x, enemy.y) < character.hitZone && !enemy.isDead){
            tempHit=enemy;
          }
        }
        if (tempHit !== 'none'){
          character.hit();
          if (character.frame === character.lastFrame){
            tempHit.health -= character.strenght;
          }
        }
        else{
          character.walk();
        }
      }
    }

    for(let enemy of actionEnemies){
      enemy.showHealth(enemy.health, enemy.maxHealth, enemy.x-20, enemy.y-enemy.size/3, 'red');
      if (enemy.x < 100){
        enemy.blink();
      }
      else if(enemy.health<=0){
        enemy.die();
        this.level++;
        if(enemy.isDead >= round(enemy.lastFrame)){
          actionEnemies.splice(actionEnemies.indexOf(enemy), 1);
        }
      }
      else{
        // enemy.walk();
        let tempHit = 'none';
        for(let character of actionCharacters){
          if (dist(character.x , character.y, enemy.x, enemy.y) < enemy.hitZone && !character.isDead){
            tempHit=character;
          }
        }
        if (tempHit !== 'none'){
          enemy.hit();
          if (enemy.frame === enemy.lastFrame){
            tempHit.health -= enemy.strenght;
          }
        }
        else{
          enemy.walk();
        }
      }
    }
  }

  controlPage(){
    
  }

  coinCounter(){
    if(millis()>this.counter+1000 && this.mode === 'Normal Game'){
      this.coins++;
      this.enemyCoins++;
      this.counter = millis();
    }
    printText(this.coins,50,50,50);
  }

  startNormalGame(){
    this.displayCharactersToSelect();
    this.coinCounter();
    this.gameAction();
  }

  startCheatGame(){
    this.displayCharactersToSelect();
    this.coins = 999;
    this.coinCounter();
    this.gameAction();
  }

  mainMenu(){
    let space = 80;
    let x = width/2;
    let y = height/3;
    printText('Welcome to The Game', width/2, height/3, 100);
    for(let text of ['','Normal Game', 'Cheat Mode','Controls']){
      y += space;
      if (mouseX > x - textWidth(text)/2 && mouseX < x + textWidth(text)/2 && mouseY > y - 40 && mouseY < y + 5){
        printText(text, x, y, 50, true);
        if (mouseIsPressed){
          if (text !== ''){
            this.mode = text;
            break;
          }
        }
      }
      else{
        printText(text, x, y, 50, false);
      }
    }
  }

  checkMods(){
    if (this.mode === 'menu'){
      this.mainMenu();
    }
    else if (this.mode === 'Normal Game'){
      this.startNormalGame();
    }
    else if (this.mode === 'Cheat Mode'){
      this.startCheatGame();
    }
    else if (this.mode === 'Controls'){
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
  terrace : '',
};


let characterImagesToPreloadAndSpicifcs = [
  //      price, size, speed, strenght, health, hitZone
  // ['bolder1', [25, 150, 0.4, 50, 500, 'close']],
  // ['bolder2', [28, 180, 0.35, 75, 500, 'close']],
  // ['goblin', [5, 100, 0.6, 15, 100, 'close']],
  // ['fallen_angels_1', [10, 100, 0.6, 10, 100, 'far']],
  // ['fallen_angels_2', [20, 200, 0.4, 20, 100, 'far']],
  // ['fallen_angels_3', [5, 100, 0.6, 15, 100, 'far']],
  // ['ogre', [20, 130, 0.45, 30, 300, 'close']],
  // ['Reaper_Man_1', [5, 100, 0.6, 15, 100, 'close']],
  // ['Reaper_Man_2', [5, 100, 0.6, 15, 100, 'close']],
  ['skeleton_crusader_1', [5, 100, 0.6, 15, 100, 'close']],
  ['skeleton_crusader_2', [5, 100, 0.8, 15, 100, 'close']],
  ['skeleton_crusader_3', [5, 100, 0.8, 15, 100, 'close']],
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


function printText(message, x, y, size, hover = false){
  let space = size/40;
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(size);
  fill('white');
  text(message, x-space, y-space);
  fill('cyan');
  text(message, x+space, y+space);
  if (hover){ //if the mouse is hovering over the text
    textSize(size+3);
    fill('brown');
  }
  else{
    fill('red');
  }
  text(message, x, y);
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
    allCharacters.push(new Character(characterImagesToPreloadAndSpicifcs[character][1][0], 100, 0.35, 50, 100, allCharactersImgs[character], space, 50, 'r', 10));
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
  image(maps.terrace, width/2, height/2, width, height);
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
    
    if (mouseX < width /2 && game.coins >= characterImagesToPreloadAndSpicifcs[drag][1][0]){
      game.coins -= characterImagesToPreloadAndSpicifcs[drag][1][0];
      actionCharacters.push(new Character(characterImagesToPreloadAndSpicifcs[drag][1][0] ,characterImagesToPreloadAndSpicifcs[drag][1][1], characterImagesToPreloadAndSpicifcs[drag][1][2], characterImagesToPreloadAndSpicifcs[drag][1][3], characterImagesToPreloadAndSpicifcs[drag][1][4],allCharactersImgs[drag],100,height/2+50,'r', characterImagesToPreloadAndSpicifcs[drag][1][5]));
    }
    if (mouseX > width /2) {
      actionEnemies.push(new Character(characterImagesToPreloadAndSpicifcs[drag][1][0] ,characterImagesToPreloadAndSpicifcs[drag][1][1], characterImagesToPreloadAndSpicifcs[drag][1][2], characterImagesToPreloadAndSpicifcs[drag][1][3], characterImagesToPreloadAndSpicifcs[drag][1][4],allCharactersImgs[drag],width-100,height/2+50,'l', characterImagesToPreloadAndSpicifcs[drag][1][5]));
    }
    
    ogX = 'empty';
    ogY = 'empty';
    drag = 'empty';
  }
}


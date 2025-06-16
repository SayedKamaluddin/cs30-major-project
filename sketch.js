// Base Defence 
// Kamaluddin Hashimy
// TBD
//
// Extra for Experts:
// need some time to think about it


// This is a simple base defence game where you can summon characters to defend your base from enemies
// The game has a menu, levels, and a cheat mode


//creates a character class that will be used to create characters
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
    this.shotX = this.x;
    if (hitType === 'close'){
      this.hitZone = this.size/2;
    }
    else if (hitType === 'far'){
      this.hitZone = this.size *2;
    }
  }

  showHealth(health, maxHealth, x, y, color) {
    y -= this.size/2;
    stroke (0);
    strokeWeight(4);
    noFill();
    rect(x, y, 40, 5); 
    noStroke(); 
    fill(color); 
    rect(x, y, map(health, 0, maxHealth, 0, 40), 5); 
  }

  shoot(){
    if (this.hitType === 'far'){
      if (this.diraction === 'l'){
        this.shotX -= 10;
        fill('red');
      }
      else if (this.diraction === 'r'){
        this.shotX += 10;
        fill(userColor);
      }
      if (this.shotX > this.x+this.hitZone){
        return;
      }
      circle(this.shotX, this.y, 10);
    }
  }

  action(imgNum){
    if (this.health < 0){
      this.health = 0;
    }
    if (this.diraction === 'r'){
      image(this.img[imgNum], this.x, this.y-this.size/2, this.size, this.size, this.img[imgNum].height*floor(this.frame), 0, this.img[imgNum].height);
    }
    if (this.diraction === 'l'){
      push();
      scale(-1, 1);
      image(this.img[imgNum], -this.x, this.y-this.size/2, this.size, this.size, this.img[imgNum].height*floor(this.frame), 0, this.img[imgNum].height);
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
      this.shotX = this.x;
      // this.shoot();
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

// TheGame class is the main class that will be used to run the game and all its functionalities like the menu, levels, cheat mode, and the game itself
class TheGame{
  constructor(){
    this.mode = 'menu';
    this.msgtimer = 0;
    this.level = 1;
    this.coins = 5;
    this.enemyCoins = 0;
    this.counter = millis();
    this.cheatmode = false;
    this.baseFullHealth = 1000*this.level;
    this.characterBaseHealth = 1000*this.level;
    this.enemyBaseHealth = 1000*this.level;
  }

  showMap(){
    if (game.mode === 'Normal Game' || game.mode === 'Cheat Mode'){
      image(maps[game.level][2], width/2, height/2, width, height);
      this.bases(maps[game.level][1]);
    }
    else{
      image(maps[0][2], width/2, height/2, width, height);
    }
  }
  // Function to draw the bases of the characters and enemies /*incomplete*/
  bases(floor){
    stroke (0);
    strokeWeight(4);
    fill(enemyColor);
    rect(0, 250, 100, 50);
    noStroke(); 
    fill(userColor);
    rect(0, 250, map(this.characterBaseHealth, 0, this.baseFullHealth, 0, 100), 50); 


    stroke (0);
    strokeWeight(4);
    fill(userColor);
    rect(width-100, 250, 100, 50);
    noStroke(); 
    fill(enemyColor);
    rect(width-map(this.enemyBaseHealth, 0, this.baseFullHealth, 0, 100), 250, map(this.enemyBaseHealth, 0, this.baseFullHealth, 0, 100), 50); 


    fill('black');
    textSize(20);
    text(this.characterBaseHealth, 50, 275);
    text(this.enemyBaseHealth, width-50, 275);
  }

  homeButton(){
    if (clickable('Home', 50, height-50, 23, 'red')){
      this.mode = 'menu';
      this.coins = 5;
      this.cheatmode = false;
      this.level = 1;
      actionCharacters = [];
      actionEnemies = [];
    }
  }
  // Function to summon bot enemies aproriate to the level /*incomplete*/
  botSummons(){
    if (random(1000)<game.level) {
      const rant = round(random(0,Math.min(this.level, allCharacters.length - 1)));
      const enm = characterImagesToPreloadAndSpicifcs[rant][1];
      actionEnemies.push(new Character(enm[0] ,enm[1], enm[2], enm[3], enm[4],allCharactersImgs[rant],width-100,height/2+maps[this.level][1],'l', enm[5]));
    }
  }

  displayCharactersToSelect(){
    for(let character = 0; character <= Math.min(this.level, allCharacters.length - 1); character++){
      if (dist(allCharacters[character].x, allCharacters[character].y-allCharacters[character].size/2, mouseX, mouseY)<allCharacters[character].size/3){
        printText(allCharacters[character].price, allCharacters[character].x, allCharacters[character].y+10, 20, true);
        allCharacters[character].blink();
      }
      else{
        printText(allCharacters[character].price, allCharacters[character].x, allCharacters[character].y+10, 20, false);
        allCharacters[character].idle();
      }
    }
  }

  gameAction(){
    for(let character of actionCharacters){
      character.showHealth(character.health, character.maxHealth, character.x-20, character.y-character.size/3, userColor);
      if(character.health<=0){
        // character.frame = 1;
        character.die();
        if(character.isDead >= round(character.lastFrame)){
          actionCharacters.splice(actionCharacters.indexOf(character), 1);
        }
      }
      else if (character.x > width-50){
        character.hit();
        if (character.frame === character.lastFrame){
          this.enemyBaseHealth -= character.strenght;
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
      enemy.showHealth(enemy.health, enemy.maxHealth, enemy.x-20, enemy.y-enemy.size/3, enemyColor);
      if(enemy.health<=0){
        enemy.die();
        if(enemy.isDead >= round(enemy.lastFrame)){
          actionEnemies.splice(actionEnemies.indexOf(enemy), 1);
        }
      }
      else if (enemy.x < 50){
        enemy.hit();
        if (enemy.frame === enemy.lastFrame){
          this.characterBaseHealth -= enemy.strenght;
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
    printText('Controls', width/2, height/4, 100, false, [255, 81, 41]);
    printText('The path to victory lies in ruin — destroy the enemy base before they reach yours.', width/2, height/4 + 100, 25, false, 'yellow');
    printText('To do so, summon Wielders — ancient beings of might and will.', width/2, height/4 + 150, 25, false, 'yellow');
    printText('Drag and drop a Wielder into the battlefield, and it shall obey your command.', width/2, height/4 + 200, 25, false, 'yellow');
    printText('Each Wielder bears a price, etched faintly in the corner beneath them.', width/2, height/4 + 250, 25, false, 'yellow');
    printText('You must possess enough coin to call them forth.', width/2, height/4 + 300, 25, false, 'yellow');
    printText('Coins will trickle in with time — a gift of patience, or a trap for the reckless.', width/2, height/4 + 350, 25, false, 'yellow');
    printText('But spend with care — each coin may shape what comes next.', width/2, height/4 + 400, 25, false, 'yellow');
    printText('Some Wielders strike from afar, others clash face to face — choose your forces with intent.', width/2, height/4 + 450, 25, false, 'yellow');
    printText('The shadows do not forgive poor judgment.', width/2, height/4 + 500, 25, false, 'yellow');
    printText('When the enemy approaches, they will strike at your base — a fortress of stone and resolve.', width/2, height/4 + 550, 25, false, 'yellow');
    printText('Guard it well, for if it falls, so too does your hope.', width/2, height/4 + 600, 25, false, 'yellow');
    this.homeButton();
  }

  levelsPage(){
    printText('Levels', width/2, height/4, 100, false, [255, 81, 41]);
    let space = 50;
    for (let i = 1; i<= allCharacters.length; i++){
      if (clickable(i, 200+space*i, height/4 + 100, 30, 'red')){
        this.level = i;
        this.mode = 'Normal Game';
      }
    }
    this.homeButton();
  }

  coinCounterAndOthers(){
    if(millis()>this.counter+1000 && this.mode === 'Normal Game'){
      this.coins++;
      this.enemyCoins++;
      this.counter = millis();
    }
    printText(this.coins,50,50,50);
    printText('Coins',50,80,20);
    printText(this.level,width-50,50,50);
    printText('Level',width-50,80,20);
  }

  startNormalGame(){
    this.displayCharactersToSelect();
    this.coinCounterAndOthers();
    this.gameAction();
    this.homeButton();
    this.botSummons();
  }

  startCheatGame(){
    this.level = allCharacters.length - 1;
    this.displayCharactersToSelect();
    this.coins = 999;
    this.coinCounterAndOthers();
    this.gameAction();
    this.homeButton();
  }

  mainMenu(){
    let space = 80;
    let x = width/2;
    let y = height/3;
    printText('Welcome to The Game', width/2, height/3, 100);
    for(let text of ['','Normal Game', 'Levels', 'Cheat Mode','Controls']){
      y += space;
      if (clickable(text, x, y, 50)){
        if (text !== ''){
          this.mode = text;
          break;
        }
      }
    }
  }

  lose(){
    if (this.msgtimer < 60*5){
      printText('You Lose', width/2, height/2, 100, false, enemyColor);
      this.msgtimer++;
    }
    else{
      this.msgtimer = 0;
      this.level = 1;
      this.coins = 5;
      actionCharacters = [];
      actionEnemies = [];
      this.characterBaseHealth = 1000;
      this.enemyBaseHealth = 1000;
      this.mode = 'menu';
    }
  }

  win(){
    if (this.msgtimer < 60*5){
      printText('You Win', width/2, height/2, 100, false, userColor);
      this.msgtimer++;
    }
    else{
      this.msgtimer = 0;
      this.level++;
      this.coins += 10;
      actionCharacters = [];
      actionEnemies = [];
      this.characterBaseHealth = 1000;
      this.enemyBaseHealth = 1000;
      this.mode = 'Normal Game';
    }
  }
  // Function to run the game and all its functionalities
  runTheGame(){
    this.showMap();
    if (this.characterBaseHealth <= 0){
      this.mode = 'lose';
    }
    else if (this.enemyBaseHealth <= 0){
      this.mode = 'win';
    }
    if (drag !== 'empty'){
      allCharacters[drag].x = mouseX;
      allCharacters[drag].y = mouseY;
    }
    if (this.mode === 'menu'){
      this.mainMenu();
    }
    else if (this.mode === 'Normal Game'){
      this.startNormalGame();
    }
    else if (this.mode === 'Levels'){
      this.levelsPage();
    }
    else if (this.mode === 'Cheat Mode'){
      this.cheatmode = true;
      this.startCheatGame();
    }
    else if (this.mode === 'Controls'){
      this.controlPage();
    }
    else if (this.mode === 'lose'){
      this.lose();
    }
    else if (this.mode === 'win'){
      this.win();
    }
  }


}

//define the global variables
let game;
let mymap;
let characterActionsToPreload = ['idle','idleblinking','walk','slash','throw','die'];
let imgHeight = 100;
let userColor = 'green';
let enemyColor = 'red';
let ogY = 'empty';//using empty becouse 0 was a needed value
let ogX = 'empty';//using empty becouse 0 was a needed value
let drag = 'empty';//using empty becouse 0 was a needed value
// for music
let sounds = ['bgsong', 'game-over', 'level-up-sound'];

//character specific variables
let maps = [ //defining all the maps and the floor height
  ['Wooded', 0],
  ['greenland', 150],
  ['bamboo', 150],
  ['castle', 150],
  ['forest', 150],
  ['ground', 200],
  ['night-war', 200],
  ['dora', 280],
  ['sky', 150],
  ['forest2d', 330],
  ['terrace', 150],
  ['approtis-dungeon', 200],
  ['cartoon', 350],
  ['darkerforest', 280],
  ['streetfighter', 300],
  ['vilage', 150],
];
let characterImagesToPreloadAndSpicifcs = [
//      price, size, speed, strenght, health, hitZone
  ['goblin', [4, 100, 0.6, 15, 100, 'close']],
  ['skeleton_crusader_1', [6, 100, 0.6, 15, 100, 'close']],
  ['Valkyrie_1', [6, 100, 0.8, 15, 100, 'close']],
  ['fallen_angels_1', [10, 100, 0.6, 4, 100, 'far']],
  ['Reaper_Man_2', [10, 80, 0.7, 1000, 1, 'close']],
  ['fallen_angels_3', [5, 100, 0.6, 15, 100, 'far']],
  ['Valkyrie_2', [5, 100, 0.8, 15, 100, 'close']],
  ['Valkyrie_3', [5, 100, 0.8, 15, 100, 'far']],
  ['Reaper_Man_1', [5, 100, 0.6, 15, 100, 'close']],
  ['ogre', [20, 130, 0.45, 30, 300, 'close']],
  ['bolder1', [25, 150, 0.4, 50, 500, 'close']],
  ['bolder2', [28, 180, 0.35, 75, 500, 'close']],
  ['bolder3', [35, 200, 0.27, 100, 800, 'close']],
  ['Zombie_Villager_1', [20, 100, 0.4, 5, 100, 'far']],
];
let allCharacters = []; //store all characters
let actionEnemies = []; //store all characters
let actionCharacters = []; //store all characters
let allCharactersImgs = [];  //difine all characters images

// Function to print text with a shadow effect and hover effect to make the work simple
function printText(message, x, y, size, hover = false, color = 'red'){
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
    if (color){
      fill(color);
    }
    else{
      fill('red');
    }
  }
  text(message, x, y);
}

// Function to create a clickable text that will return true if the mouse is on it and pressed
function clickable(text, x, y, size, color){
  if (mouseX > x - textWidth(text)/2 && mouseX < x + textWidth(text)/2 && mouseY > y - 40 && mouseY < y + 5){
    printText(text, x, y, size, true);
    if (mouseIsPressed){
      return true;
    }
  }
  else{
    printText(text, x, y, size, false, color);
  }
}

// Function to helo preload all the characters images
function helpPreloadCharacters(fileName){
  let imgList = [];
  for(let file of characterActionsToPreload){
    imgList.push(loadImage('characters\\'+fileName+'\\'+file+'.png'));
  }
  return imgList;
}

// Function to preload all the characters images and maps
function preload(){
  for (let characterImg of characterImagesToPreloadAndSpicifcs){
    allCharactersImgs.push(helpPreloadCharacters(characterImg[0]));
  }
  for (let map = 0; map < maps.length; map++){
    maps[map].push(loadImage('maps\\'+maps[map][0]+'.png'));
  }
}

// Function to run in setup to create all the characters and their positions
function runInSetup(){
  let space = 150;
  for(let character in allCharactersImgs){
    allCharacters.push(new Character(characterImagesToPreloadAndSpicifcs[character][1][0], 100, 0.35, 50, 100, allCharactersImgs[character], space, 100, 'r', 10));
    space+=100;
  }
}
  
// setup function to create the canvas and stuff
function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  runInSetup();
  game = new TheGame();
}

// draw function to run the game
function draw() {
  game.runTheGame();
}

//detect if the mouse is pressed and if it is on a character to drag it
function mousePressed(){
  for(let character in allCharacters){
    if (dist(allCharacters[character].x, allCharacters[character].y-allCharacters[character].size/2, mouseX, mouseY)<allCharacters[character].size/3){
      drag = character;
      ogX = allCharacters[drag].x;
      ogY = allCharacters[drag].y-allCharacters[character].size/2;
    }
  }
}

// detect if the mouse is released and if it is on a character to drop it
function mouseReleased(){
  if (drag !== 'empty'){
    allCharacters[drag].x = ogX;
    allCharacters[drag].y = ogY+allCharacters[drag].size/2;
    let char = characterImagesToPreloadAndSpicifcs[drag][1];
    if (game.cheatmode){
      if (mouseX < width /2 && game.coins >= char[0]){
        game.coins -= char[0];
        actionCharacters.push(new Character(char[0] ,char[1], char[2], char[3], char[4],allCharactersImgs[drag],100,height/2+maps[game.level][1],'r', char[5]));
      }
      if (mouseX > width /2) {
        actionEnemies.push(new Character(char[0] ,char[1], char[2], char[3], char[4],allCharactersImgs[drag],width-100,height/2+maps[game.level][1],'l', char[5]));
      }
    }
    else{
      if (mouseY>150 && game.coins >= char[0]){
        game.coins -= char[0];
        actionCharacters.push(new Character(char[0] ,char[1], char[2], char[3], char[4],allCharactersImgs[drag],100,height/2+maps[game.level][1],'r', char[5]));
      }
    }
    ogX = 'empty';
    ogY = 'empty';
    drag = 'empty';
  }
}


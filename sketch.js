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
    this.shotX = this.x;
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

  shoot(){
    if (this.hitType === 'far'){
      if (this.diraction === 'l'){
        this.shotX -= 10;
        fill('red');
      }
      else if (this.diraction === 'r'){
        this.shotX += 10;
        fill('green');
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


class TheGame{
  constructor(){
    this.mode = 'menu';
    this.baseHealth = 1000;
    this.level = 1;
    this.coins = 5;
    this.enemyCoins = 0;
    this.counter = millis();
  }

  homeButton(){
    if (mouseX > 50 - textWidth(text)/2 && mouseX < 50 + textWidth(text)/2 && mouseY > height-50 - 40 && mouseY < height-50 + 5){
      printText('Home', 50, height-50, 23, true);
      if (mouseIsPressed){
        this.mode = 'menu';
        this.coins = 5;
      }
    }
    else{
      printText('Home', 50, height-50, 20, false);
    }
  }

  botSummons(){
    if (random(1000)<game.level) {
      const rant = round(random(0,Math.min(this.level, allCharacters.length - 1)));
      const enm = characterImagesToPreloadAndSpicifcs[rant][1];
      actionEnemies.push(new Character(enm[0] ,enm[1], enm[2], enm[3], enm[4],allCharactersImgs[rant],width-100,height/2+50,'l', enm[5]));
    }
  }

  displayCharactersToSelect(){
    for(let character = 0; character <= Math.min(this.level, allCharacters.length - 1); character++){
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
      if(character.health<=0){
        // character.frame = 1;
        character.die();
        if(character.isDead >= round(character.lastFrame)){
          actionCharacters.splice(actionCharacters.indexOf(character), 1);
        }
      }
      else if (character.x < 0 || character.x > width){
        actionCharacters.splice(actionCharacters.indexOf(character), 1);
        this.level += 1;
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
      if(enemy.health<=0){
        enemy.die();
        if(enemy.isDead >= round(enemy.lastFrame)){
          actionEnemies.splice(actionEnemies.indexOf(enemy), 1);
        }
      }
      else if (enemy.x < 0 || enemy.x > width){
        actionEnemies.splice(actionEnemies.indexOf(enemy), 1);
        this.level -= 1;
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

  coinCounterAndOthers(){
    if(millis()>this.counter+1000 && this.mode === 'Normal Game'){
      this.coins++;
      this.enemyCoins++;
      this.counter = millis();
    }
    printText(this.coins,50,50,50);
    printText(this.level,width-50,50,50);
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
    this.botSummons();
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
    if (this.level <= 0 || this.level > allCharacters.length - 1){
      this.mode = 'menu';
      this.level = 1;
    }
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
      //  price, size, speed, strenght, health, hitZone
  
  ['goblin', [4, 100, 0.6, 15, 100, 'close']],
  ['skeleton_crusader_1', [6, 100, 0.6, 15, 100, 'close']],
  ['Valkyrie_1', [6, 100, 0.8, 15, 100, 'close']],
  ['fallen_angels_1', [10, 100, 0.6, 4, 100, 'far']],
  ['fallen_angels_3', [5, 100, 0.6, 15, 100, 'far']],
  // ['skeleton_crusader_3', [5, 100, 0.8, 15, 100, 'close']],
  ['Valkyrie_2', [5, 100, 0.8, 15, 100, 'close']],
  ['Valkyrie_3', [5, 100, 0.8, 15, 100, 'far']],
  ['Reaper_Man_1', [5, 100, 0.6, 15, 100, 'close']],
  ['ogre', [20, 130, 0.45, 30, 300, 'close']],
  ['bolder1', [25, 150, 0.4, 50, 500, 'close']],
  ['bolder2', [28, 180, 0.35, 75, 500, 'close']],
  ['bolder3', [35, 200, 0.27, 100, 800, 'close']],
  ['Zombie_Villager_1', [20, 100, 0.4, 5, 100, 'far']],
  ['Reaper_Man_2', [10, 80, 0.7, 1000, 1, 'close']],
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
    if (mouseY>150 && game.coins >= characterImagesToPreloadAndSpicifcs[drag][1][0]){
      game.coins -= characterImagesToPreloadAndSpicifcs[drag][1][0];
      actionCharacters.push(new Character(characterImagesToPreloadAndSpicifcs[drag][1][0] ,characterImagesToPreloadAndSpicifcs[drag][1][1], characterImagesToPreloadAndSpicifcs[drag][1][2], characterImagesToPreloadAndSpicifcs[drag][1][3], characterImagesToPreloadAndSpicifcs[drag][1][4],allCharactersImgs[drag],100,height/2+50,'r', characterImagesToPreloadAndSpicifcs[drag][1][5]));
    }
    ogX = 'empty';
    ogY = 'empty';
    drag = 'empty';
  }
}


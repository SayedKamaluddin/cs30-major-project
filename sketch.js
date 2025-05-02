// Base Defence 
// Kamaluddin Hashimy
// TBD
//
// Extra for Experts:
// need some time to think about it

class Character{
  constructor(name, speed, strenght, health, img, x, y){
    this.name = name;
    this.speed = speed;
    this.strenght = strenght;
    this.health = health;
    // this.idle = img[0];
    // this.blink = img[1];
    // this.walk = img[2];
    // this.slash = img[3];
    // this.throw = img[4];
    // this.die = img[5];
    this.img = img;
    this.x = x;
    this.y = y;
    this.frame = 1;
  }

  action(imgNum){
    image(this.img[imgNum], this.x, this.y, 100, 100, this.img[imgNum].height*floor(this.frame), 0, this.img[imgNum].height);
    if (this.frame*this.img[imgNum].height > this.img[imgNum].width){
      this.frame = 1;
    }
    else{
      this.frame+=0.2;
    }
  }

  idle(){
    let blink = random(100);
    print(blink < 2);
    if(blink < 2){
      this.action(1);
    }
    else{
      this.action(0);
    }
  }

  walk(){
    this.action(2);
    this.x += this.speed;
  }
  
  slash(){
    this.action(3);
  }

  throw(){
    this.action(3);
  }

  die(){
    this.action(4);
  }
}


let filesToPreload = ['idle','blink','walk','slash','die'];
let imgHeight = 100;

//difine all characters
let bolder, runingBolder;
let bolderImg = [];

function helpPreload(fileName, fileNUmber){
  let imgList = [];
  for(let file of filesToPreload){
    imgList.push(loadImage('characters\\'+fileName+'\\'+fileNUmber+'\\'+file+'.jpeg'));
  }
  return imgList;
}

function preload(){
  bolderImg = helpPreload('bolder','1');
  
}

function runInSetup(){
  bolder = new Character('Bolder', 0.5, 50, 100, bolderImg, width/2, height/2);
}
  
function setup() {
  createCanvas(windowWidth, windowHeight);
  runInSetup();
}

// let frame = 1;
function draw() {
  bolder.slash();

  
}

function mousePressed(){
  print(bolder.x);
  // bolder = new Character('Bolder', 2, 50, 100, bolderImg, width/2, height/2);

}
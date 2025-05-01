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

  idle(){
    // print(this.frame, this.img.height*floor(this.frame));
    image(this.img[0], 200, 100, 100, 100, this.img[0].height*floor(this.frame), 0, this.img[0].height);
    if (this.frame*this.img[0].height > this.img[0].width){
      this.frame = 1;
    }
    else{
      this.frame+=0.2;
    }
  }

  blink(){
    image(this.img[1], 200, 100, 100, 100, this.img[1].height*floor(this.frame), 0, this.img[1].height);
    if (this.frame*this.img[1].height > this.img[1].width){
      this.frame = 1;
    }
    else{
      this.frame+=0.2;
    }
    this.x += this.speed;
  }
}


let filesToPreload = ['idle','blink','walk','slash','die'];
let imgHeight = 100;

//difine all characters
let bolder;
let bolderImg = [];

// function helpPreload(folderName,fileNUmber){
//   bolderImg.push(loadImage('characters\\'+folderName+'\\'+fileNUmber+'\\idle.jpeg'));
//   bolderImg.push(loadImage('characters\\'+folderName+'\\'+fileNUmber+'\\blink.jpeg'));
//   bolderImg.push(loadImage('characters\\'+folderName+'\\'+fileNUmber+'\\walk.jpeg'));
//   bolderImg.push(loadImage('characters\\'+folderName+'\\'+fileNUmber+'\\slash.jpeg'));
//   bolderImg.push(loadImage('characters\\'+folderName+'\\'+fileNUmber+'\\throw.jpeg'));
//   bolderImg.push(loadImage('characters\\'+folderName+'\\'+fileNUmber+'\\die.jpeg'));
  
// }

function preload(){
  for(let file of filesToPreload){
    bolderImg.push(loadImage('characters\\bolder\\1\\'+file+'.jpeg'));
  }
  
}

function runInSetup(){
  bolder = new Character('Bolder', 2, 50, 100, bolderImg, width/2, height/2);
}
  
function setup() {
  createCanvas(windowWidth, windowHeight);
  runInSetup();
}

// let frame = 1;
function draw() {
  bolder.blink();

  
}

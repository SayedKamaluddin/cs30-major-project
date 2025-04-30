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
    this.img = img;
    this.x = x;
    this.y = y;
  }

  display(){
    image(this.img,this.x,this.y, 1000,100);
  }

  move(){
    this.x += this.speed;
  }
}


let filesToPreload = ['glm'];
let bolderImg, path;


let bolder;


function preload(){
  for(let names of filesToPreload){
    path = 'characters\\bolder\\blo1\\'+names+'_idle.jpeg';
    bolderImg = loadImage(path);
  } 
}

function runInSetup(){
  bolder = new Character('Bolder', 2, 50, 100, bolderImg, width/2, height/2);
}
  
function setup() {
  createCanvas(windowWidth, windowHeight);
  runInSetup();
}

function draw() {
  bolder.display();
}

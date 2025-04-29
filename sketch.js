// Base Defence 
// Kamaluddin Hashimy
// TBD
//
// Extra for Experts:
// need some time to think about it

class Characters{
  constructor(name, speed, strenght, health, file){
    this.name = name;
    this.speed = speed;
    this.strenght = strenght;
    this.health = health;
    this.file = file;
  }

  display(){

  }

  move(){

  }
}

function helpPreload(file){
  let character = [];
  for(let images of file){
    character += file+'/'+images;
  }
  return character;
}

// function preload(){
//   ali = helpPreload('characters\bolder\blo1\Walking');
// }


// define all the characters


function setup() {
  createCanvas(windowWidth, windowHeight);
  let file = 'characters\bolder\blo1\Walking';
  print(helpPreload(file));
}

function draw() {
  
}

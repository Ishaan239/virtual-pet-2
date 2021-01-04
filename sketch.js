//Create variables here
var dog, happyDog, db, foodS, dog1;
var foodObject;
var feed, addFood;
var lastFed;
var bedroom, garden, washroom;
var gameState;

function preload()
{
  //load images here
  dog = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");

  bedroom = loadImage("images/Bed Room.png");
  garden = loadImage("images/Garden.png");
  washroom = loadImage("images/Wash Room.png");
}

function setup() {
  createCanvas(1000, 500);
  dog1 = createSprite(800, 250, 10, 10);
  dog1.addImage(dog);
  db = firebase.database();
  dog1.scale = 0.15;
  db.ref("food").on("value", readStock);
  foodObject = new Food();
  feed = createButton("feed the dogs");
  feed.position(700, 90);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 90);
  addFood.mousePressed(addFoodStock);
  db.ref("gameState").on("value", function(data) {
    gameState = data.val();
  });
  db.ref("feedTime").on("value", function(data) {
    lastFed = data.val();
  });
}


function draw() {  
    background(46, 139, 87);
    foodObject.display();
    db.ref("feedTime").on("value", function(data){
      lastFed = data.val();
    })
    //if(keyWentDown(UP_ARROW)) {
      //writeStock(foodS);
    //}
    currentTime = new Date().getHours();
    fill(255, 255, 254);
    textSize(15);
    if(currentTime === (lastFed)) {
      update("playing");
      foodObject.garden();
    }
    if(currentTime === (lastFed+2)) {
      update("sleeping");
      foodObject.bedroom();    
    }
    else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)) {
      update("washroom");
      foodObject.washroom();
    }
    else{
      update("hungry");
      foodObject.display();
    }
    if(gameState!=="hungry") {
      feed.hide();
      addFood.hide();
      dog1.remove();
    }
    else{
      feed.show();
      addFood.show();
      dog1.addImage(dog);
    }
  drawSprites();
  //add styles here

}

//functions to read values from DB
  function readStock(data) {
    foodS = data.val();
    foodObject.updateFoodStock(foodS);
  }

//function to write values in DB
  // function writeStock(x) {
  //   if(x<=0) {
  //     x = 0;
  //   }else{
  //     x = x-1;
  //   }
  //   db.ref('/').update({
  //     food:x
  //   })
  // }
function feedDog() {
  dog1.addImage(happyDog);
  foodObject.updateFoodStock(foodObject.getFoodStock()-1);
  db.ref("/").update({
    food:foodObject.getFoodStock(),
    feedTime:new Date().getHours(),
    gameState:"hungry",
  })
}
function update(state) {
  db.ref("/").update({
    gameState:state,
  });
}
function addFoodStock() {
  foodS++;
  db.ref("/").update({
    food:foodS
  })
}


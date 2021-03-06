"use strict";
/*

By: Tristan Griffin
Course: COSC560 ADVANCED WEB PROGRAMMING
Date: 13/7/2020

  NB:Best flow for testing:
  Login to a customer account, place orders, then switch to the admin account to make changes to the orders (located in top left of screen).
  Please note that the orders will auto complete after a set amount of time, 'orderProcessingTime' controls the length of time for auto processing  

Background

	After hearing the success of food delivery start-ups, our client, Karen, decided to start her own company, DropBearEats (think Menulog, Deliveroo, Uber Eats, etc.) She has already told your manager the specification of the project. You, as the only software developer, are responsible for developing this single page web application. To keep our client happy, you have to meet all the listed requirements.
  The rationale for this high-fidelity prototype is that any entry into a saturated market would need to be specialised/niche.
  As an artist and creative coder this would be an engagement into the alternative for the Karen.

  There are two sample shops:
      Pizza shop 
      Cake shop
  Each store has the possibility of unique interactions, further reflecting the character of the store.    

  The intention would be that the final iteration would have custom models built for each shop, to represent their physical counterpart.
  Users could create a unique avatar.
  The town interface would also be explorable.

How to use:
  For testing purposes the admin and customer accounts can be switched in real time from the main map
  this button can be found at the top left hand of the screen.

  Customer:
    Click the left mouse OR Arrow keys to move avatar -- press UP to jump
    Click on a door to enter OR Jump when at shop door to enter door
  Administrator:
    The admin has a minimised level of interactivity and simplicity to reflect the importance of time management.
    Animations are disabled and menues are consolidated



Description:
	Functional Requirements

	The web application is a single page application (SPA).
  This prototype uses Bootstrap (v4.5.0)
  VanillaJS
  sound.js and animate.js are written in VanillaJS by Tristan Griffin

	The customer can:

	Order food.	
		Name of food.
		Cost.
		Description.
		Images 
		The food data must cover at least 2 different restaurants.
	View their cart.
		This shows the current items for order.
		The checkout page can be reached from here
	Checkout.
		Name, address, and contact phone number.
		The customer can select either credit card or cash as payment options.
			Don't worry, you won't have to implement a real payment system!
		See the "Ordering Flow" section below for a full overview of the order process.
	View their current order, including its status:
		Received.
		Processing.
		Delivered.
		Cancelled.
	View past orders (with status).
	Be able to see their order status, including updates, using either:
		Push notifications.
		A real-time "chatroom".

	An administrative page for the staff to:

		Edit a delivery order (e.g. change order status).
		Delete a delivery order.
		View the statistics.


  The prototype:

    - Written in HTML5
    - Must pass the validation test
    -  CSS framework:  Bootstrap (v4.5.*)
 
    Folder structure:
    assessment1_b
    ├── css/
    ├── img/
    ├── js/
    ├── index.html
    ├── another_page.html
    └── yet_another_page.html  

Sounds: 
  Enter store
    Filename: BellRing.mp3 
    Source: http://soundbible.com/2218-Service-Bell-Help.html 

  Order is completed
    Filename: OrderComplete.mp3  
    Source: http://soundbible.com/1599-Store-Door-Chime.html

  Confirm a payment
    Filename: confirmpay.mp3 
    Source: http://soundbible.com/333-Cash-Register-Cha-Ching.html

  Error on user input
    Filename: error.mp3 
    Source: http://soundbible.com/1806-Censored-Beep.html

Images are taken from own blocks collection
  

*/
/// define variables
// game setup
  // put things like canvas size etc here
  // other variables
let gamepaused = false;
let currentLevel = "login"; // "map" "store" "login"
let loopspeed = 30;
let gameMode = 1; // 0 = quick clicking of links. best for testing;   1 = avatar moves when clicking on links;
var maxLevelScore;
var currentLevelScore = 0;
var  totalGameScore = 0;
var  tutorial = true;
var  lines = [];
var bestscore = 1000;
var lifeadd=true;
var  gameoverCount = 0;
var  gameoverCountMax = 120;
var collisioncheck = false;

let userType = ""; // customer or admin
let currentShop;

// images
let mapBackgroundImg = 'img/background2.jpg';
let pizzaShopBackgroundImg = 'img/pizzashop.jpg';
let cakeShopBackgroundImg = 'img/cakeshop.jpg';


// npc variable
let npcIDtext = [];
let currentNpcID = 0;
// create variables for the two shops
let numberOfShops = 3;
let shopName = [];
  shopName[1] = "Pete's Pizza";
  shopName[2] = "Kate's Cakes";
let shopCart = new Array(numberOfShops);
  for (var i=0; i < numberOfShops; i++){  shopCart[i]=new Array(100); }
let shopCartCount = []; 
  shopCartCount[1] = 0; 
  shopCartCount[2] = 0;
let shopOrderState = new Array(numberOfShops);
  for (var i=0; i < numberOfShops; i++){  shopOrderState[i]=new Array(100); }
let shopOrderCount = [];
  shopOrderCount[1] = 0; 
  shopOrderCount[2] = 0;
let shopCartCostTotal = []; 
  shopCartCostTotal[1] = 30;
  shopCartCostTotal[2] = 30;
let orderProcessingTime = 1000;   // set time for auto complete of orders
// shop items
let shopItem = [];
  // pizza shop items
  shopItem[1] = { itemName: "Pizza", itemCost: 10, itemImagePath:"img/pizzashop/pizza.png", itemDescription:"made with love"  }; 
  shopItem[2] = { itemName: "Drink", itemCost: 3, itemImagePath:"img/pizzashop/drink.png", itemDescription:"the living waters that quench the soul"  }; 
  shopItem[3] = { itemName: "Chocolate", itemCost: 5, itemImagePath:"img/pizzashop/chocolate.jpg", itemDescription:"in the land of milk and honey, this is the food of the wise"  }; 
  // cake shop items 
  shopItem[4] = { itemName: "Cookie", itemCost: 10, itemImagePath:"img/cakeshop/cookie.jpg", itemDescription:"choc chip"  }; 
  shopItem[5] = { itemName: "Waffle", itemCost: 10, itemImagePath:"img/cakeshop/waffle.png", itemDescription:"honey waffle"  }; 
  shopItem[6] = { itemName: "Icecream", itemCost: 10, itemImagePath:"img/cakeshop/icecream.jpg", itemDescription:"strawberry icecream"  }; 
// store positions used in main map
let storePositionX = [];
  storePositionX[1] = 20; // pizza shop
  storePositionX[2] = 63; // cake shop
let selectedOrderUpdateStoreIndex = 0;
let selectedOrderUpdateOrderIndex = 0;


// user variables
//player
let currentUserFloor = 27; // where the ground is
let currentUserCoordY = currentUserFloor; 
let currentUserCoordX = 30; 
let nextUserCoordY = 10; 
let nextUserCoordX = 10; 
let currentUserWidth =10;
let currentUserHeight = 25;
let userState = null;
let userStatemove = null;
let userStatemoveA = null; // used for player animation
let userWidth = 10;
let userJumpmax = 50;
let userJumpCount = 0;
let userFallSpeed = 3;
let userJumpSpeed = 3;
let userSpeed = 1;
let userHealth = 100;
let userName = "";
let userAddress = "";
let userContactNumber = "";
let customerCardNumber = "";
let customerCardExpiryDate = "";
let customerCardCVC = "";
let cardtype = "Visa";
let customerPaymentMethod = "Cash";




/*****************************************************************
Game functions
*****************************************************************/

/*****************************************************************
* Function: loadLevel()

* Parameters: int level

* Returns: Void 

* Desc:  
******************************************************************/

function loadLevel(level){ }


/*****************************************************************
* Function: resetGame()

* Parameters: NA

* Returns: Void 

* Desc:  called from gameover()
******************************************************************/
function resetGame() { }


function gameOverCheck() {}

/*****************************************************************
* Function:gameover() 

* Parameters: NA

* Returns: Void 

* Desc:  called from updateGameoverScreen()
 
******************************************************************/
function gameOver() { }











/*****************************************************************
      Player functions
*****************************************************************/
/*****************************************************************
* Function: updatePlayer()

* Parameters: NA

* Returns: Void 

* Desc:  called from gameloop()
click to move OR arrow keys to move and enter to go into building

******************************************************************/
function updatePlayer() {
  if(keypress.left) { // user moving left
    currentUserCoordX -= userSpeed;
    if(currentUserCoordX < 0 ){ currentUserCoordX = 95;}//window.innerWidth - userWidth; }
  }
  if(keypress.right) { // user moving righ
    currentUserCoordX += userSpeed;
    if(currentUserCoordX > 100 - userWidth ){ currentUserCoordX = 0; }
  }

  // user jumping
  if(keypress.up && userJumpCount < 1) { // user jumping
    userJumpCount = 20;
  }
  if(userJumpCount > 10 ) { // player jumping
    userJumpCount--;
    currentUserCoordY +=userJumpSpeed;
  }
  if(userJumpCount <= 10 && userJumpCount > 0) { // player jumping
    userJumpCount--;
    currentUserCoordY -=userFallSpeed;
  }

  // if user pressed enter or jump
  if(keypress.up) {
    // collision check with store positions
    if(currentUserCoordX > storePositionX[1] && currentUserCoordX < storePositionX[1] + 10 ){
      drawShop(1);
    }

    if(currentUserCoordX > storePositionX[2] && currentUserCoordX < storePositionX[2] + 10){
      drawShop(2);
    }
  }

  drawPlayer();
}
/*****************************************************************
* Function: drawPlayer()

* Parameters: NA

* Returns: Void 

* Desc: called from updatePlayer()
updates #userAvatarObject position based on percentage
******************************************************************/
function drawPlayer(){
  if(currentLevel == "map"){
  document.getElementById("userAvatarObject").style.left = currentUserCoordX + "%";
  document.getElementById("userAvatarObject").style.bottom = currentUserCoordY + "%";
  }
}
/*****************************************************************
* Function: resetPlayer()

* Parameters: NA

* Returns: Void 

* Desc: called from drawMap()
-resets the players avatar position
-sets animation type
******************************************************************/
function resetPlayer() {
  // reset player position when loading map
  currentUserCoordY = currentUserFloor; 
  currentUserCoordX = 30; 
  userJumpCount = 0;
  userState = "idle";
  userStatemoveA = "idle";
}
/*****************************************************************
* Function: createPlayer()

* Parameters: NA

* Returns: content

* Desc: called from drawMap()
-generates the player avatar
******************************************************************/
function createPlayer(){
  // add sprite sheet to player, used for animation
  let content = '<img id="playerspritesheet" src="img/character.png" alt="" >';
  return content;
}
/*****************************************************************
* Function: movePlayer()

* Parameters: NA

* Returns: Void 

* Desc: called from gameloop()
-updates player animation type 
-updates player position
-checks for collision with destination point and calls drawShop()
******************************************************************/
function movePlayer(){
  // called when the user clicks on a store icon
  // sets userstate to autowalk
  // gives the autowalk coordinates
  console.log("moving player");
  // moving right
  if(currentUserCoordX < nextUserCoordX) {
    currentUserCoordX++; userStatemoveA = "runningRight";

  }

  // moving left
  if(currentUserCoordX > nextUserCoordX + 2) {
    currentUserCoordX--; userStatemoveA = "runningLeft";
  }
   if(currentUserCoordX > nextUserCoordX - 1 && currentUserCoordX < nextUserCoordX + 4 ) {
    console.log("player has reached the clicked location");
    userState = "idle";
    // enter the stop
    drawShop(userStatemove);
    return;
  } 
  drawPlayer();
}







/*****************************************************************

                               CAPTURE INPUT FROM USER   
use if(keypress.up){  checkcollisions("up");                                
*****************************************************************/
window.addEventListener("keydown", keyDown, false);
window.addEventListener("keyup", keyUp, false);
window.addEventListener("keydown", keyDown, false);
window.addEventListener("keyup", keyUp, false);

var keypress; 
keypress = { up:false, down:false, left:false, right:false }

function keyUp(e) {     move(e, false); }
function keyDown(e) {     move(e, true); }

function move(e, isKeyDown) {   

//if(e.keyCode >= 37 && e.keyCode <= 40) {     e.preventDefault();   }

  if(e.keyCode === 37) {     keypress.left = isKeyDown;   } 
  if(e.keyCode === 38) {     keypress.up = isKeyDown;   } 
  if(e.keyCode === 39) {    keypress.right = isKeyDown;   } 
  if(e.keyCode === 40) {     keypress.down = isKeyDown;   }
} 












/*****************************************************************

interface functions
******************************************************************/
/*****************************************************************
* Function: updateGameoverScreen()

* Parameters: NA

* Returns: Void 

* Desc: 
******************************************************************/

function updateGameoverScreen() {
  if(gamepaused) {
    console.log("GAME OVER");
    //playsound('data/gameover','wav','3000' , '1'); 
    gameover();
  }
}


/*****************************************************************
* Function: drawLoginScreen()

* Parameters: NA

* Returns: Void 

* Desc: called on page load, allows selection of administrator
or customer
******************************************************************/
function drawLoginScreen() {

  let content = '';
  // background image
  content += '<img src="'+ mapBackgroundImg + '" alt="Map" width="100%" height="100%">'
  // message
  content += '<h1 class="chooseCharacterText" >choose your character</h1>';
  // div for customer selection
  content += '<div id="" class="divCustomerSelection" onclick="selectUserType(2)"><span class="CustomerSelectionText" >Customer</span>';
  content += '<img class="CustomerSelectionIcon" src="img/Customer.png" alt="Customer icon" ></div>';
  // div for admin/cheif selection
  content += '<div id=""  class="divAdminSelection" onclick="selectUserType(1)"><span class="AdminSelectionText" >Administrator</span>';
  content += '<img class="AdminSelectionIcon" src="img/Admin.png" alt="Admin icon" ></div>';

  // window for getting customer details visibility=hidden on start
  content += '<div id="customerPersonalDetails" class="divCustomerDetails" >';
  content += 'Full name : <br><input id="customerName" type="text"/><br>';
  content += 'Address :<br> <input id="customerAddress" type="text"/><br>';
  content += 'Contact number:<br>  <input id="customerContactNumber" type="number"/><br>';
  content += '<button type="button" onclick="getUserDetails()" class="btn btn-success">ok</button>';
  content += '<p id="userDetailsErrorMessage" ></p></div>';
  // draw to screen 
  document.getElementById("gamestage").innerHTML = content;
}

/*****************************************************************
* Function: selectUserType(selection)

* Parameters: selection

* Returns: Void 

* Desc: 1 = customer  2 = admin
******************************************************************/
function selectUserType(selection){
  // set the users selection for the character
  // this is used in drawShop to change what the user sees once in the shop

  // admin is selected
  if(selection == 1){
      console.log(selection);
      userType = "admin";
      drawMap();
  }  
  // a customer is selected
  if(selection == 2){
      userType = "customer";
      console.log(selection);
      drawCharacterCreationPanel();
  }  
}
/*****************************************************************
* Function: drawCharacterCreationPanel()

* Parameters: NA

* Returns: Void 

* Desc: called from selectUserType(selection)
sets #customerPersonalDetails to visible
******************************************************************/
function drawCharacterCreationPanel() {
  document.getElementById('customerPersonalDetails').style.visibility = "visible";
}
/*****************************************************************
* Function: getUserDetails()

* Parameters: NA

* Returns: Void 

* Desc: called from inline button click set in login interface
-does validation
-calls drawMap
******************************************************************/
function getUserDetails() {
  userName = document.getElementById('customerName').value;
  userAddress = document.getElementById('customerAddress').value;
  userContactNumber = document.getElementById('customerContactNumber').value;
  let ErrorMessage = "";
  // validation check
  if(userName == "") { ErrorMessage += "Name required<br>";}
  if(userAddress == "") { ErrorMessage += "Address required<br>";}
  if(userContactNumber == "") { ErrorMessage += "Contact number required<br>";}
  document.getElementById('userDetailsErrorMessage').innerHTML = ErrorMessage;
  if(ErrorMessage != ""){
    playsound('Error','mp3','3001' , '1');
  }
  // if no errors then load map
  if(ErrorMessage == "") { 
    drawMap(); 
  }
}
/*****************************************************************
* Function: switchUserType(newtype)

* Parameters: newtype

* Returns: Void 

* Desc: for testing purposes this allows the quick change between user and admin 1 = customer  2 = admin
******************************************************************/
function switchUserType(newtype){
  
  if(newtype == 1) {
    userType = "admin";
    document.getElementById("userTypeQuickChange").style.visibility = "hidden";
    document.getElementById("userTypeQuickChange").innerHTML = "Switch to user";
    document.getElementById("userTypeQuickChange").onclick = function(){switchUserType(2)};
  }
  /*
  if(newtype == 2) {
    userType = "customer";    
    document.getElementById("userTypeQuickChange").innerHTML = "Switch to admin";
    document.getElementById("userTypeQuickChange").onclick = function(){switchUserType(1)};
  }
  */
  console.log("switching to user type = " + newtype + userType );
}
/*****************************************************************
* Function: drawMap()

* Parameters: NA

* Returns: Void 

* Desc: called from getUserDetails() or inline onclick Element
interaction from each store
Draws the interaction points and background for the main map
******************************************************************/
// map for menu selection
function drawMap() {
  let content = "";
  // draw background map image
  content += '<img src="'+ mapBackgroundImg + '" alt="Map" width="100%" height="100%">';
  

  if(userType == "customer"){ 
    // create the switch usertype button, which allows admin access for testing
    content += '<button id="userTypeQuickChange"  type="button" onclick="switchUserType(1)">Switch to admin</button>';
    // allows avatar movement
    resetPlayer();
    currentLevel = "map";
    content += "where would you like to eat at tonight ?";
    // draw where the customer is standing
    //content += '<div id="userAvatarObject" style="width:10%;height:10vh;bottom:10vh;position:absolute;left:10%" onclick=""><img src="img/Customer.png" alt="Customer icon" width="100%" height="100%"></div>';
    content += '<div id="userAvatarObject"  onclick="">' + createPlayer() + '</div>';
  
  }
  
  // draw  pizza shop link
  content += '<div id="" class="cursordoor textOutline" style="width:10%;height:30vh; position:absolute; bottom:30%;left:' + storePositionX[1]  + '%;" onclick="moveToShop(1)" >Pizza shop</div>';
  // draw cake shop link
  content += '<div id="" class="cursordoor textOutline" style="width:10%;height:30vh; position:absolute; bottom:30%;left:' + storePositionX[2]  + '%;" onclick="moveToShop(2)" >Cake shop</div>';
  // draw to screen
  document.getElementById("gamestage").innerHTML = content;
}
/*****************************************************************
* Function: moveToShop(index)

* Parameters: NA

* Returns: Void 

* Desc: called from inline onclick which is set in DrawMap
if gameMode is set to 1
-sets the destination for the avatar 
-sets userState to moving
if gameMode = 0 then load the shop without animation 
******************************************************************/
function moveToShop(index){
  userState = "idle";
  if(gameMode == 1){
    // start moving player to next position
    nextUserCoordX = storePositionX[index];
    // set the destination store
    userStatemove = index;
    userState = "moving";
  }
  if(gameMode == 0){
    drawShop(index);
  }
}
/*****************************************************************
* Function: drawShop(index)

* Parameters: index

* Returns: Void 

* Desc: called from:
     inline Element (onclick) interaction OR
     moveToShop(index) OR
     movePlayer()     
sets the innerHTML of #gamestage to the interface of the selected shop
based on shop index AND usertype
******************************************************************/
// draw the shop
function drawShop(index) {
  currentLevel = "store"; 
  currentShop = index;
  let message = " ";
  let content = "";
  if(userType == "customer"){    
    // customer view is from psudo 3d view
    message = "Welcome to the";
    if(index == 1) { // load the PIZZA SHOP

      // draw background
      content += '<img src="' + pizzaShopBackgroundImg + '" alt="Map" width="100%" height="100%">'


      // draw interaction points
        // exit button
        content += '<div id="" class="cursordoor iconPizzaShopExit"  onclick="drawMap()"></div>';
        // interact with store button
        content += '<div id="" class="cursornpctalk iconPizzaShopNpcChat"  onclick="npcInteract(1 , 1)"></div>';
        // check order progress button
       // content += '<div id="" style="width:10%;height:10vh;position:absolute;background-Color:green;left:50%;top:40vh;" onclick="">Order Progress</div>';
      // draw customer
      content += '<div id="" class="divPizzaCustomer"  onclick=""><img src="img/characterLeft.png" alt="user" width="100%" height="100%"></div>';
      message += "Pizza shop";
    }



    if(index == 2) { // load the CAKE SHOP
      // draw background
      content += '<img src="' + cakeShopBackgroundImg + '" alt="Map" width="100%" height="100%">';
      // draw customer 
      content += '<div id="" class="divCakeCustomer"  onclick=""><img src="img/characterRight.png" alt="user" width="100%" height="100%"></div>';
      // draw interaction points
        // exit button
        content += '<div id="" class="cursordoor iconCakeShopExit"  onclick="drawMap()"></div>';
        // interact with cheif button
        content += '<div id="" class="cursornpctalk iconCakeShopNpcChat"  onclick="npcInteract(2 , 1)"></div>';
        // check order progress button
        //content += '<div id="" style="width:10%;height:10vh;position:absolute;background-Color:green;left:50%;top:40vh;" onclick="">Order Progress</div>';
        

      message += "Cake shop";
    }
    // interaction window
    content += '<div id="npcMessageScreen" class="speech-bubble"  onclick="" >Message screen</div>';

    // draw to screen
    document.getElementById("gamestage").innerHTML = content;
    playsound('bell','mp3','3001' , '1');
  } // end of customer shop loading
  



  if(userType == "admin"){
    // admin dashboard is from the first person view
    message = "";
    if(index == 1) { // load the Pizza shop
        // draw background
        content += '<img src="img/pizzashop.jpg" alt="Map" width="100%" height="100%">';
        content += drawAdminScreen(index);
    }  

    if(index == 2) { // load the cake shop
      // draw background  
      content += '<img src="img/cakeshop.jpg" alt="Map" width="100%" height="100%">'; 
      content += drawAdminScreen(index);
      // show orders to screen and current progress 
    }
    // draw to screen
    document.getElementById("gamestage").innerHTML = message + content;
  } // end of admin shop loading  
}






/*****************************************************************
Admin functions for each shop
  An administrative page for the staff to:
    Edit a delivery order (e.g. change order status).
    Delete a delivery order.
    View the statistics.
*****************************************************************/
/*****************************************************************
* Function: drawAdminScreen(index)

* Parameters: index

* Returns: content

* Desc: generates the interface for the admin panel of each shop
calls adminDrawOrderList(index) for each orders content
******************************************************************/
function drawAdminScreen(index){
  let content = "";
  // show orders to screen and current progress
  content += '<div id="adminOrderScreen" >';
  // exit button
  content += '<button id="" class="cursordoor btn-danger buttonAdminScreenExit"  onclick="drawMap()">Exit</button>';
  // populate all orders
  content += adminDrawOrderList(index);
  content += '</div>';
  return content;
}

/*****************************************************************
* Function: adminDrawOrderList(index)

* Parameters: index

* Returns: content

* Desc: called from drawAdminScreen(index)
 generates the list of current and previous orders
******************************************************************/

function adminDrawOrderList(index) {
  console.log("getting order list");
  let content = '';
  content += '<table class="table table-dark"><thead> <tr><th colspan="5">Order list, click order details to make changes</th></tr></thead><tbody>';
  content += '<tr>';
  content += '    <th scope="col">Name</th>';
  content += '    <th scope="col">Address</th>';
  content += '    <th scope="col">Contact Number</th>';
  content += '    <th scope="col">Order progress</th>';
  content += '    <th scope="col">Amount paid</th>';
  content += '    <th scope="col">Time remaining</th>';
  content += '    <th scope="col">Ordered items</th>';
  content += '  </tr>';
  if(shopOrderCount[index] > 0) { //if an order has been made
    for(var i = 1; i < shopOrderCount[index] + 1; i++ ){
      //content += shopOrderState[index][shopOrderCount[index]].progress;
      //console.log(shopOrderState[index][i].progress);
      // populate the rows with the customer details
      
      content += '<tr  onclick="openAdminEditOrderStatus(' + index + ',' + i + ')" >';
      content += '    <th scope="row">' + shopOrderState[index][i].customername + '</th>';
      content += '    <td >' + shopOrderState[index][i].customerAddress + '</th>';
      content += '    <td >' + shopOrderState[index][i].customerContactNumber + '</th>';
      content += '    <td >' + shopOrderState[index][i].progress + '</th>';
      content += '    <td >' + shopOrderState[index][i].amountpaid + '</th>';
      content += '    <td >' + shopOrderState[index][i].processingTime + '</span></th>';
      content += '    <td >' + shopOrderState[index][i].orderitems.length + '</th>';
      content += '  </tr>';
      
    }
 

  } else {
    content += '<tr><td>no orders made</td></tr>';
  }
  // START draw edit order panel
  content += '<div id="adminEditOrderStatus" >';
    // drop down list
  content += 'Change the status of the order';  
  content += '<br> <select name="editOrderStatus" id="editOrderStatus" value="delivered">   <option value="processing">processing</option>    <option value="success">success</option><option value="delivered">delivered</option><option value="Deleted">delete</option></select>';  
    // confirm button  
  content += '<button onclick="adminOrderStatusUpdate()"> Update </button>';
    // cancel button
  content += '<button onclick="closeAdminEditOrderStatus()">Cancel</button>';  
  content += '</div>'; 
   // END draw edit order panel 

  content += '</tbody> </table>';
 

  //console.log(content);
  return content
}
/*****************************************************************
* Function: closeAdminEditOrderStatus()

* Parameters: NA

* Returns: Void 

* Desc: called from orderUpdate interface interaction (inline onclick function)
closes #adminEditOrderStatus Element
******************************************************************/
function closeAdminEditOrderStatus(){
  document.getElementById("adminEditOrderStatus").style.visibility = "hidden";
}

/*****************************************************************
* Function: openAdminEditOrderStatus(storeIndex, orderIndex)

* Parameters: NA

* Returns: Void 

* Desc: called from orderUpdate interface interaction (inline onclick function)
opens the #adminEditOrderStatus Element (set to visibile)
sets the current:
  selectedOrderUpdateStoreIndex = storeIndex;
  selectedOrderUpdateOrderIndex = orderIndex;
which is used in  adminOrderStatusUpdate() 
******************************************************************/
function openAdminEditOrderStatus(storeIndex, orderIndex){
  document.getElementById("adminEditOrderStatus").style.visibility = "visible";
  selectedOrderUpdateStoreIndex = storeIndex;
  selectedOrderUpdateOrderIndex = orderIndex;
}

/*****************************************************************
* Function: adminOrderStatusUpdate()

* Parameters: NA

* Returns: Void 

* Desc: called from orderUpdate interface interaction (inline onclick function)
updates the status of an order based on selected store and selected orders
index.
Then closes the editStatusUpdate Element
******************************************************************/
function adminOrderStatusUpdate() {
  // get selection
  let updateStatus = document.getElementById('editOrderStatus').value;
  shopOrderState[selectedOrderUpdateStoreIndex][selectedOrderUpdateOrderIndex].progress = updateStatus;
  // set selection and update the page
  drawShop(selectedOrderUpdateStoreIndex);
  closeAdminEditOrderStatus();
}








/*****************************************************************
Shop NPC functions 
  Order food.
      You will need to pre-populate some food data, containing:
        Name of food.
        Cost.
        Description.
        Images (at least 1).
        The food data must cover at least 2 different restaurants.
      View their cart.
        This shows the current items for order.
        The checkout page can be reached from here
      Checkout.
        Name, address, and contact phone number.
        The customer can select either credit card or cash as payment options.
      View previous orders and their status (processing, success, cancelled).
      Receive notifications OR view the order status in real-time through the "chatroom".

  View their current order, including its status:
      Received.
      Processing.
      Delivered.
      Cancelled.
  View past orders (with status).
  Be able to see their order status, including updates    
*****************************************************************/
/*****************************************************************
* Function: npcInteract(npcId, interactType)

* Parameters: npcId, interactType

* Returns: Void 

* Desc:called from NPC interaction (inline onclick function)
sets the contents for the speach bubble talk with shop
owners. 
******************************************************************/
function npcInteract(npcId, interactType) {
  //resetNPCchat();
  document.getElementById("npcMessageScreen").style.visibility = "visible";
  let npcMessageScreenContent = ''; 
  if(npcId == 1) {// Pizza shop npc

    if(interactType == 1){ // main chat window
      npcMessageScreenContent += '\"welcome to the Pizza shop, how can I help you\" <br><br>';
      // draw main menu
      npcMessageScreenContent += '<p onclick="npcInteract(' + npcId + ', 2)" class="cursorPointer">- I would like to make an order, what do you have?</p>';
      npcMessageScreenContent += '<p onclick="npcInteract(' + npcId + ' , 3)" class="cursorPointer">- Can I double check my ordered before I pay? </p>';
      npcMessageScreenContent += '<p onclick="npcInteract(' + npcId + ' , 4)" class="cursorPointer">- Id like to pay for my order now </p>';
      npcMessageScreenContent += '<p onclick="npcInteract(' + npcId + ', 8)" class="cursorPointer">- Id like to view my order history </p>';

      //IF AN ORDER IS IN PROGRESS BUT NOT COMPLETED
      if(shopOrderCount[npcId] > 0) { //if an order has been made, check its progress
        if(shopOrderState[npcId][shopOrderCount[npcId]].progress == "processing"){
        console.log("order processing");
        let processingTime = shopOrderState[npcId][shopOrderCount[npcId]].processingTime / loopspeed;
        npcMessageScreenContent = '<p>Your order will be ready in ' +   Math.round(processingTime) + ' seconds</p>';
        npcMessageScreenContent += '<button type="button" onclick="npcInteract(' + npcId + ' , 1)" class="cursorPointer"> How long now ? </button>'
        }
        if(shopOrderState[npcId][shopOrderCount[npcId]].progress == "success"){
        npcMessageScreenContent = '<p>Your is ready</p>';
        npcMessageScreenContent += '<button type="button" onclick="npcInteract(' + npcId + ' , 7)" class="cursorPointer"> Click to collect order </button>'
        }
      }  

    }
    if(interactType == 2){ // make order
     
      npcMessageScreenContent += '<div class="divMakeOrder" >';
      npcMessageScreenContent += '<div id="npcInteractStoreMenu" >Menu';
      npcMessageScreenContent += '<p onclick="npcInteractAddItem('+[npcId] + ',1)"class="cursorPointer">' + getItemTypeText(1) + '</p>';
      npcMessageScreenContent += '<p onclick="npcInteractAddItem('+[npcId] + ',2)"class="cursorPointer">' + getItemTypeText(2) + '</p>';
      npcMessageScreenContent += '<p onclick="npcInteractAddItem('+[npcId] + ',3)"class="cursorPointer">' + getItemTypeText(3) + '</p>';
      npcMessageScreenContent += '</div></div>';
      // draw cart
      npcMessageScreenContent += '<div id="npcInteractCart" >' + npcInteractDrawCartContents(1) +  '</div>';
      //npcMessageScreenContent += 'Select payment type <select name="paymentType" id="paymentType">   <option value="Cash">Cash</option>    <option value="Card">Card</option></select><br>';
      //npcMessageScreenContent += '<p onclick="" style="cursor:pointer"> Id like to pay for my order now </p>';
    }
    if(interactType == 3){ // check cart
      // check that there is anything in the cart
      // draw contents of cart
      npcMessageScreenContent += "here is what you have in your cart, would you like to make some changes OR proceed to pay ? ";
      // draw cart
      npcMessageScreenContent += '<div id="npcInteractCart" >' + npcInteractDrawCartContents(1) +  '</div>';
       
    }  
    if(interactType == 4  ){ // pay for order
      // draw form for inputing payment data
      npcMessageScreenContent += "<div>Enter details to proceed</div>";
      npcMessageScreenContent += 'Select payment type <select name="paymentType" id="paymentType" value="Card">   <option value="Cash">Cash</option>    <option value="Card">Card</option></select>';
      npcMessageScreenContent += '<div id="customerPaymentDetails" >';
      npcMessageScreenContent += 'Select card type <br><select name="card" id="cardtype" value="'+ cardtype + '">  <option value="Visa">Visa</option>  <option value="Master">Master</option>  <option value="AmericanExpress">American Express</option></select><br><br>';
      npcMessageScreenContent += 'Card number <br><input id="customerCardNumber" type="number" value="' + customerCardNumber + '"/><br><br>'; 
      npcMessageScreenContent += 'Expiry date<br> <input id="customerCardExpiryDate" type="number" value="' + customerCardExpiryDate + '"/>';
      npcMessageScreenContent += '<br><br>CVC <br><input id="customerCardCVC" type="number" value="' + customerCardCVC +  '"/><br><br>';
      npcMessageScreenContent += 'Save details for faster checkout with future orders <input id="fasterCheckout" type="checkbox" value="true" checked/><br><br></div>';
      
      npcMessageScreenContent += '<button type="button" class="btn-success" onclick="npcInteractPayForOrder(' + npcId + ')" class="cursorPointer"> Pay now </button>';
      npcMessageScreenContent += '<p id="ErrorMessage"></p>';
       // check that cart is not empty
      console.log(shopCartCount[npcId]);
      if(shopCartCount[npcId] == 0) { console.log("cart is empty"); npcInteract(npcId , 2); return}
    }
    if(interactType == 5){ // make changes to order
    
    }  

    if(interactType == 6){ // order completed message
      npcMessageScreenContent += "<div><br><br>Order has been completed, you can check the progress of your order by asking me. Feel free to go for a walk/jump outside to pass the time (use the arrow keys)</div>";
    }
    if(interactType == 7){ // clicking to collect order
      npcMessageScreenContent += "<p> Thankyou, please come again</p>";
      shopOrderState[npcId][shopOrderCount[npcId]].progress = "delivered";
    } 
    if(interactType == 8){// view order history
      npcMessageScreenContent += "<p> here is your order history</p>";
      npcMessageScreenContent += npcInteractDrawOrderList(npcId);
      // back button
    } 
  }




  if(npcId == 2) { // cake shop npc

    if(interactType == 1){ // main chat window
      npcMessageScreenContent += "\"welcome to the Cake shop, how can I help you \"<br><br>";
      // draw main menu
      npcMessageScreenContent += '<p onclick="npcInteract(' + npcId + ', 2)" class="cursorPointer">- I would like to make an order, what do you have?</p>';
      npcMessageScreenContent += '<p onclick="npcInteract(' + npcId + ' , 3)" class="cursorPointer">- Can I double check my ordered before I pay? </p>';
      npcMessageScreenContent += '<p onclick="npcInteract(' + npcId + ' , 4)" class="cursorPointer">- Id like to pay for my order now </p>';
      npcMessageScreenContent += '<p onclick="npcInteract(' + npcId + ', 8)" class="cursorPointer">- Id like to view my order history </p>';

      //IF AN ORDER IS IN PROGRESS BUT NOT COMPLETED
      if(shopOrderCount[npcId] > 0) { //if an order has been made, check its progress
        if(shopOrderState[npcId][shopOrderCount[npcId]].progress == "processing"){
        console.log("order processing");
        let processingTime = shopOrderState[npcId][shopOrderCount[npcId]].processingTime / loopspeed;
        npcMessageScreenContent = '<p>Your order will be ready in ' +   Math.round(processingTime) + ' seconds</p>';
        npcMessageScreenContent += '<button type="button" onclick="npcInteract(' + npcId + ' , 1)" class="cursorPointer"> How long now ? </button>'
        }
        if(shopOrderState[npcId][shopOrderCount[npcId]].progress == "success"){
        npcMessageScreenContent = '<p>Your is ready</p>';
        npcMessageScreenContent += '<button type="button" onclick="npcInteract(' + npcId + ' , 7)" class="cursorPointer"> Click to collect order </button>'
        }
      }  

    }
    if(interactType == 2){ // make order
     
      npcMessageScreenContent += '<div class="divMakeOrder" >';
      //npcMessageScreenContent += '<div>Select payment type <select name="paymentType" id="paymentType">   <option value="Cash">Cash</option>    <option value="Card">Card</option></select></div><br>';
      npcMessageScreenContent += '<div id="npcInteractStoreMenu" >Menu';
      npcMessageScreenContent += '<p onclick="npcInteractAddItem('+[npcId] + ',4)"class="cursorPointer">' + getItemTypeText(4) + '</p>';
      npcMessageScreenContent += '<p onclick="npcInteractAddItem('+[npcId] + ',5)"class="cursorPointer">' + getItemTypeText(5) + '</p>';
      npcMessageScreenContent += '<p onclick="npcInteractAddItem('+[npcId] + ',6)"class="cursorPointer">' + getItemTypeText(6) + '</p>';
      npcMessageScreenContent += '</div></div>';
      // draw cart
      npcMessageScreenContent += '<div id="npcInteractCart" >' + npcInteractDrawCartContents(npcId) +  '</div>';
      
      //npcMessageScreenContent += '<p onclick="" style="cursor:pointer"> Id like to pay for my order now </p>';
    }
    if(interactType == 3){ // check cart
      // check that there is anything in the cart
      // draw contents of cart
      npcMessageScreenContent += "here is what you have in your cart, would you like to make some changes OR proceed to pay ? ";
      // draw cart
      npcMessageScreenContent += '<div id="npcInteractCart" >' + npcInteractDrawCartContents(npcId) +  '</div>';
       
    }  
    if(interactType == 4  ){ // pay for order
      // draw form for inputing payment data
      npcMessageScreenContent += "<div>Enter details to proceed</div>";
      npcMessageScreenContent += 'Select payment type <select name="paymentType" id="paymentType" value="Card">   <option value="' + customerPaymentMethod + '">' + customerPaymentMethod + '</option>    <option value="Card">Card</option></select>';
      npcMessageScreenContent += '<div id="customerPaymentDetails" >';
      npcMessageScreenContent += 'Select card type <br><select name="card" id="cardtype" value="'+ cardtype + '">  <option value="Visa">Visa</option>  <option value="Master">Master</option>  <option value="AmericanExpress">American Express</option></select><br><br>';
      npcMessageScreenContent += 'Card number <br><input id="customerCardNumber" type="number" value="' + customerCardNumber + '"/><br><br>'; 
      npcMessageScreenContent += 'Expiry date<br> <input id="customerCardExpiryDate" type="number" value="' + customerCardExpiryDate + '"/>';
      npcMessageScreenContent += '<br><br>CVC <br><input id="customerCardCVC" type="number" value="' + customerCardCVC +  '"/><br><br>';
      npcMessageScreenContent += 'Save details for faster checkout with future orders <input id="fasterCheckout" type="checkbox" checked/><br><br></div>';
      
      npcMessageScreenContent += '<button type="button" class="btn-success" onclick="npcInteractPayForOrder(' + npcId + ')" class="cursorPointer"> Pay now </button>';
      npcMessageScreenContent += '<p id="ErrorMessage"></p>';
       // check that cart is not empty
      console.log(shopCartCount[npcId]);
      if(shopCartCount[npcId] == 0) { console.log("cart is empty"); npcInteract(npcId , 2); return}
    }
    if(interactType == 5){ // make changes to order
    
    }  

    if(interactType == 6){ // order completed message
      npcMessageScreenContent += "<div><br><br>Order has been completed, you can check the progress of your order by asking me. Feel free to go for a walk/jump outside to pass the time (use the arrow keys)</div>";
    }
    if(interactType == 7){ // clicking to collect order
      npcMessageScreenContent += "<p> Thankyou, please come again</p>";
      shopOrderState[npcId][shopOrderCount[npcId]].progress = "delivered";
    } 
    if(interactType == 8){// view order history
      npcMessageScreenContent += "<p> here is your order history</p>";
      npcMessageScreenContent += npcInteractDrawOrderList(npcId);
      // back button
    } 

  }

  // close chat window button

  npcMessageScreenContent += '<button id="buttonNpcInteractExit" class="btn btn-danger"  onclick="closeNpcInteract()">Close</button></div>'
  npcMessageScreenContent += '</div>';
  document.getElementById("npcMessageScreen").innerHTML = npcMessageScreenContent;
  document.getElementById("npcMessageScreen").scrollTop = 0; 
}

/*****************************************************************
* Function: 

* Parameters: NA

* Returns: Void 

* Desc: 
******************************************************************/
function npcInteractGetOrderHistory(npcId){

}

/*****************************************************************
* Function: closeNpcInteract()

* Parameters: NA

* Returns: Void 

* Desc: called from Cart interaction (inline onclick function)
sets npcMessageScreen to hidden
******************************************************************/
function closeNpcInteract() {
  document.getElementById("npcMessageScreen").style.visibility = "hidden";
}

/*****************************************************************
* Function: npcInteractAddItem(npcId, itemIndex)

* Parameters: npcId, itemIndex

* Returns: Void 

* Desc: called from Cart interaction (inline onclick function)
adds and item to the shops cart (shopCart[npcId][index] array)
then redraws the carts contents
******************************************************************/
function npcInteractAddItem(npcId, itemIndex){
  let content = "";
      shopCartCount[npcId]++;
      // add new item to cart array
      shopCart[npcId][shopCartCount[npcId]] = itemIndex; 
      //console.log(shopCartCount[npcId] + "adding item to order" + itemType +  " " + shopCart[npcId][shopCartCount[npcId]]);
      
      // redraw the shopping cart
       content += npcInteractDrawCartContents(npcId); 
      document.getElementById("npcInteractCart").innerHTML = content;
}

/*****************************************************************
* Function: npcInteractRemoveItem(npcId, itemIndex)

* Parameters: npcId, itemIndex

* Returns: Void 

* Desc: called from Cart interaction (inline onclick function)
removes an item from the shops cart (shopCart[npcId][index] array)
then redraws the carts contents
******************************************************************/
function npcInteractRemoveItem(npcId, itemIndex){
  
  let content = "";
    shopCartCount[npcId]--;
    for(var i = itemIndex; i < shopCartCount[npcId] + 1; i++){
      shopCart[npcId][i] = shopCart[npcId][i + 1];
      console.log("removing item");
    }

    content += npcInteractDrawCartContents(npcId);  
    document.getElementById("npcInteractCart").innerHTML = content;
}

/*****************************************************************
* Function: npcInteractDrawCartContents(npcId)

* Parameters: npcId

* Returns: content

* Desc: called from npcInteract(npcId, interactType)
generates and returns text for cart contents UI
******************************************************************/
function npcInteractDrawCartContents(npcId) {
  let content = "<br>Cart<br><br>";
    for( var i = 1; i < shopCartCount[npcId] + 1; i++ ){
      content += getItemTypeText(shopCart[npcId][i]) + "  <button class='btn btn-danger' onclick='npcInteractRemoveItem(" + npcId +  "," +  i + ")' cursor:pointer>remove item</button>"+"<br>";
    }    
    if(content != "" ){
      content += '<br><button class="btn-success" onclick="npcInteract(' + npcId + ',4)">Pay Now </button>';
    }
    return content;
}

/*****************************************************************
* Function: getItemTypeText(itemTypeId)

* Parameters: itemTypeId

* Returns: itemTypeData 

* Desc: called from npcInteractDrawCartContents(npcId)
returns text generated from the shopItem[itemTypeId] array
******************************************************************/
function getItemTypeText(itemTypeId) { // used for getting the image
  let itemTypeData = "";
  itemTypeData = '<span class="textOutline ItemTypeTextSize" >' + shopItem[itemTypeId].itemName + "</span><br>" + '<img src="' + shopItem[itemTypeId].itemImagePath + '" alt="" width="50%" height="50%"><br>';
  itemTypeData += '$' + shopItem[itemTypeId].itemCost + '<br>' + shopItem[itemTypeId].itemDescription;
  return itemTypeData;
}

/*****************************************************************
* Function: npcInteractPayForOrder(npcId)

* Parameters: npcId

* Returns: Void 

* Desc: validates payment details
-Must choose card type (Master Card, Visa Card, American Express)
-Must enter credit card number, expiry date, and CVC.
-Check that the card number is the correct length and format (i.e. 16 digits for Master Card and Visa Card; 15 digits for American Express).
-Check that the expiry date is valid (i.e. not expired).
-Check that the CVC is the correct length (i.e. 3 for MasterCard and Visa Card; 4 for American Express).
-As long as the number and expiry is valid, the payment should be considered successful.
- If cash is selected the payment is considered successful and calls npcInteractionProcessPayment(npcId)
******************************************************************/
function npcInteractPayForOrder(npcId){
  let ErrorMessage = "";
  // check payment type
    customerPaymentMethod = document.getElementById("paymentType").value;
  let paymentMethod = customerPaymentMethod;
  if(paymentMethod == "Card"){
    console.log("validating payment details");
    cardtype = document.getElementById('cardtype').value;
    customerCardNumber = document.getElementById('customerCardNumber').value; 
    customerCardExpiryDate = document.getElementById('customerCardExpiryDate').value;
    customerCardCVC = document.getElementById('customerCardCVC').value;

  
    // check that variables are not empty
    if(cardtype == ""){ErrorMessage += "Select card type <br>"; }
    if(customerCardNumber == ""){ErrorMessage += "Enter Card Number <br>"; }
    if(customerCardExpiryDate == ""){ErrorMessage += "Enter  Card Expiry Date in Monthyear ie july 2020 = '0720' <br>"; }
    if(customerCardCVC == ""){ErrorMessage += "Enter Card CVC <br>"; }

    // check validation
    // check number card lengh
    if(cardtype == "Visa" || cardtype == "Master"){
      if(customerCardNumber.length != 16){
        ErrorMessage += "card number incorrect: must be 16 characters <br>"; 
      }
      if(customerCardCVC.length != 3){ 
        ErrorMessage += "card CVC incorrect: must be 3 characters <br>";
      }
    }
    if(cardtype == "AmericanExpress"){ 
      if(customerCardNumber.length != 15){ 
        ErrorMessage += "card number incorrect: must be 15 characters <br>"; 
      }
      if(customerCardCVC.length != 4){ 
        ErrorMessage += "card CVC incorrect: must be 4 characters <br>";
      }
    }

    // check card expiry
    var customerCardExpiryDateYear = customerCardExpiryDate.substr(2,4);
    var customerCardExpiryDateMonth = customerCardExpiryDate.substr(0,2);
    if(customerCardExpiryDateYear < 20 || customerCardExpiryDateMonth < 7 || customerCardExpiryDateMonth > 12) {ErrorMessage += " Card Expired  <br>"; }
  }

  if(ErrorMessage != ""){
    playsound('Error','mp3','3001' , '1');
  }

    document.getElementById("ErrorMessage").innerHTML = "<span class='userInputErrorMessage'>" + ErrorMessage + "</span>";
  if(paymentMethod == ""){ ErrorMessage = "no payment method selected";}


  // check for saving checkout details
  let saveCheck = document.getElementById("fasterCheckout").checked;
  console.log("fasterCheckout = " +  saveCheck)
  if(saveCheck == "undefined"){saveCheck = false;}
  if(!saveCheck && paymentMethod == "Card"){
    cardtype = "";
    customerCardNumber = "";
    customerCardExpiryDate = "";
    customerCardCVC = "";
    customerPaymentMethod = "";
  }

  if(ErrorMessage == "" || paymentMethod == "Cash"){ // no errors
      // processing payment
    console.log("processing payment");
    npcInteractionProcessPayment(npcId);
  }


    
}

/*****************************************************************
* Function: npcInteractionProcessPayment(npcId)

* Parameters: npcId

* Returns: Void 

* Desc: called from npcInteractPayForOrder(npcId)
copies the order from the card to the stores order history
then calls confirmation npc interaction type
calls playsound() confirmpay.mp3 
******************************************************************/
function npcInteractionProcessPayment(npcId){
    console.log("processing order");
    // migrate data from order into shopOrderState[npcId][shopOrderCount[npcId]] array
    shopOrderCount[npcId]++;
    shopOrderState[npcId][shopOrderCount[npcId]] = {customername: userName, customerAddress: userAddress, customerContactNumber: userContactNumber,progress: "processing", amountpaid: shopCartCostTotal[npcId], processingTime: orderProcessingTime, orderitems: []};
    // move cart items into array
    for(var i = 0; i < shopCartCount[npcId]; i++){
      shopOrderState[npcId][shopOrderCount[npcId]].orderitems[i] = shopCart[npcId][i];
      console.log(shopOrderState[npcId][shopOrderCount[npcId]].orderitems[i]);
    }

    // remove the items from the cart
    shopCartCount[npcId] = 0;
    shopCartCostTotal[npcId] = 0; 

    playsound('confirmpay','mp3','3001' , '1');
    // load completed order message
    npcInteract(npcId , 6);
}

/*****************************************************************
* Function: npcInteractDrawOrderList(index)

* Parameters: index // npcId, store ID

* Returns: content 

* Desc: called when user account is set and the interaction type 
"check order history" is clicked,
this will populate the order list for A particular shop and the current
user
******************************************************************/
function npcInteractDrawOrderList(index){
    console.log("getting order list");
  let content = '';
  content += '<table class="table table-dark"><thead> <tr><th colspan="5">Order list, click order details to make changes</th></tr></thead><tbody>';
  content += '<tr>';
  content += '    <th scope="col">Name</th>';
  content += '    <th scope="col">Address</th>';
  content += '    <th scope="col">Contact Number</th>';
  content += '    <th scope="col">Order progress</th>';
  content += '    <th scope="col">Amount paid</th>';
  content += '    <th scope="col">Time remaining</th>';
  content += '    <th scope="col">Ordered items</th>';
  content += '  </tr>';
  if(shopOrderCount[index] > 0) { //if an order has been made
    for(var i = 1; i < shopOrderCount[index] + 1; i++ ){
      //content += shopOrderState[index][shopOrderCount[index]].progress;
      //console.log(shopOrderState[index][i].progress);
      // populate the rows with the customer details
      
      content += '<tr>';
      content += '    <th scope="row">' + shopOrderState[index][i].customername + '</th>';
      content += '    <td >' + shopOrderState[index][i].customerAddress + '</th>';
      content += '    <td >' + shopOrderState[index][i].customerContactNumber + '</th>';
      content += '    <td >' + shopOrderState[index][i].progress + '</th>';
      content += '    <td >' + shopOrderState[index][i].amountpaid + '</th>';
      content += '    <td >' + shopOrderState[index][i].processingTime + '</span></th>';
      content += '    <td >' + shopOrderState[index][i].orderitems.length + '</th>';
      content += '  </tr>';
      
    }
 

  } else {
    content += '<tr><td>no orders made</td></tr>';
  }
 

  content += '</tbody> </table>';
 

  //console.log(content);
  return content
}











/*****************************************************************

                               gameloop  
*****************************************************************/

/*****************************************************************
* Function: gameloop()

* Parameters: NA

* Returns: Void 

* Desc: called on program load
this functions loops which is set with var loopspeed
-checks for order progress and updates progress timer
-checks if the map is open and updates the players avatar
******************************************************************/
function gameloop()
{
  // allow for player movement
  if(!gamepaused && currentLevel == "map"){
    updatePlayer();
    animateobjects();
  } 
  if(userState == "moving"){
     movePlayer();
  }

  // check any order status and update
  let npcId = 1;
for(var i = 1; i < 3; i++){ // 
  npcId = i;
  if(shopOrderCount[npcId] > 0) { //if an order has been made, check its progress
    if(shopOrderState[npcId][shopOrderCount[npcId]].progress == "processing"){
      console.log("order processing");


      shopOrderState[npcId][shopOrderCount[npcId]].processingTime--;
      if(shopOrderState[npcId][shopOrderCount[npcId]].processingTime == 0){
        shopOrderState[npcId][shopOrderCount[npcId]].progress = "success";
        console.log("order ready for collection");
        playsound('orderComplete','mp3','3001' , '1');
        // push notification
      }
    }
  }  
}
setTimeout(gameloop, loopspeed);
}

resetGame();
gameloop();
drawLoginScreen();




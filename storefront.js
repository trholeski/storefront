const mySql = require('mysql');
const inquirer = require('inquirer');
require ('console.table');

var connection = mySql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Vipertime.1',
    database: 'bamazon'
});

connection.connect(function(err) {
    if (err){
        throw err;
    }
    loadStore();
});

function loadStore() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);

        custPrompt(res);
    })
}

function custPrompt(inventory){
    inquirer.prompt(
        {
            type:'input',
            message: 'what is the ID of the item that you would like to buy?',
            name: 'choice'
        }
    ).then(function(response) {
        console.log(response.choice)
        var choiceId = parseInt(response.choice);
        var item = checkInventory(choiceId, inventory);

        if (item) {
            promptQuantity(item);
        }else{
            console.log("You didn't select a valid product id.  Try again.")
            loadStore();
        }
    });
}

function promptQuantity (item){
    inquirer.prompt(
        {
            type:'input',
            message: 'How many would you like?',
            name: 'quantity'
        }
    ).then(function(response) {

        var quantity = parseInt(response.quantity);
    
        // If there isn't enough of the chosen product and quantity, let the user know and re-run loadProducts
        if (quantity > item.stock_quantity) {
            inquirer.prompt(
                {
                    type:'input',
                    message: `You selected a quantity greater than what we have in stock. Would you like to purchse the last ${item.stock_quantity} that we have in stock?`,
                    name: 'choice'
                }
            ).then(function(response2) {
                console.log(`response to buyout questions is ${response2.choice}`);
                if (response2.choice === "yes") {
                    quantity = item.stock_quantity;
                    makePurchase(item, quantity);
                }else{
                    console.log('please start again')
                    loadStore();
                }
            });
        }else {
            // Otherwise run makePurchase, give it the product information and desired quantity to purchase
            makePurchase(item, quantity);
        }
    });
}
function makePurchase(item, quantity) {
    console.log("quantity: " + quantity);
    console.log("item.id: " + item.id);
    connection.query(
       // UPDATE trucks SET quantity = quantity-1 WHERE size = '$size'
      "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?",
      [quantity, item.id],
      function(err, res) {
        // Let the user know the purchase was successful, re-run loadProducts
        console.log("\nSuccessfully purchased " + quantity + " " + item.product_name + "'s!");
      }
    );
    loadStore();
  }
  // Check to see if the product the user chose exists in the inventory
function checkInventory(choiceId, inventory) {
    for (var i = 0; i < inventory.length; i++) {
      if (inventory[i].id === choiceId) {
        // If a matching product is found, return the product
        return inventory[i];
      }
    }
    // Otherwise return null
    return null;
  }
  








//         if (responses.quantity > stock){
//             inquirer.prompt([
//                 { 
//                     type: 'list',
//                     message: 'We do not have enough units to fufill your order.  Would you like to purchase rest of the units in stock',
//                     choices: ['Yes', 'No'],
//                     name: 'buy'
//                 }
//             ]).then(function(responses) {
//                 console.log(responses)
//             if (responses.buy === 'Yes'){
//                 // var newItemAvail = new ItemAvail (responses.type, responses.name, responses.cost);
//                 console.log('congrats on the purchase, check yo mailbox.')
//             }else{
//                 console.log('please accept our eternal apologies. Also, if you want, get back in the store and buuy stuff daawwwwwg.')
//             }
//                 postData();
//             });
//         }else{
//             console.log('entering else');
//             readData();
//             //read database for all products in "type" identified by user and accept an offer.  If it is less than an existing offer decline and respond, otherwise, accept.
//             inquirer.prompt([
//                 { 
//                     type: 'input',
//                     message: 'What is the id of the item you want to bid on?',
//                     name: 'item_id'
//                 },
//                 { 
//                     type: 'input',
//                     message: 'what are you willing to pay',
//                     name: 'bid'
//                 }
//             ]).then(function(responses) {
//                 console.log(responses)
//             // if (responses.name = 'Post'){
//                 // var newItemAvail = new ItemAvail (responses.type, responses.name, responses.cost);
//                 // type = responses.type;
//                 // name = responses.name;
//                 // cost = responses.cost;
//                 userBid = responses.bid;
//             // };
//                 completePurchase();
//             });
//         }
//     });
// };

// function postData(){
//     connection.connect(function(err){
//         if (err){
//         throw err;
//         }
//     console.log(`The thread id to this connection is ${connection.threadId}`)

//         connection.query(
//             'INSERT INTO items SET ?',
//                 {
//                     name: name,
//                     type: type,
//                     cost: cost
//                 },
//             function(err, response){
//                 if (err){
//                     throw err;
//                 }
//                 console.log(response);
//             }
//         )
//  //below is the end of the call back function
//     });
// };

// function readData(){
//     connection.connect(function(err){
//         if (err){
//             throw err;
//         }
//         console.log(`The thread id to this connection is ${connection.threadId}`)
//         connection.query('SELECT * FROM items', function(err, response) {
//             if (err){
//                 throw err;
//             }
//             console.log (response);
//         })
//     });
// }
// function completePurchase(){
//     console.log("Thank you for your purchase! Your account has been debited $ " + userBid + "and your next born child, grandchild, god-child, or pet for the trouble")
// }
// //prompt user
// inquire();

// // callData();
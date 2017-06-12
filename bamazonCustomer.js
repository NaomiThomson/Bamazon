var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
});

function start() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    for (i=0; i<results.length; i++) {
      console.log(results[i].item_id + '|' + results[i].product_name + '|' + results[i].department_name + '|' + results[i].price);
    }
    askId();
  });
};

function askId() {
  inquirer.prompt([{
    name: "itemId",
    type: "input",
    message: "Please enter the ID of the item you'd like to purchase"
  }, {
    name: "numberUnits",
    type: "input",
    message: "how many units would you like to purchase?",
    validate: function(value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
    }
  }]).then(function(answer) {
    checkInventory(answer.itemId, answer.numberUnits);
  });
};

function checkInventory(itemId, quantity) {
  connection.query({
    sql: 'SELECT * FROM products WHERE `item_id` = ?',
    values: [itemId]
  }, function(error, results, fields) {
    if (results[0].stock_quantity >= quantity) {
      var newQuantity = results[0].stock_quantity - quantity;
      updateInventory(itemId, newQuantity);
    } else {
      console.log("Sorry, there was wasn't enough stock in our inventory.");
      continueShoping();
    }
  });
};

function updateInventory(itemId, quantity) {
  connection.query("UPDATE products SET ? WHERE ?", [{
    stock_quantity: quantity
  }, {
    item_id: itemId
  }], function(error) {
    if (error) throw err;
    console.log("Item successfully purchased!");
    continueShoping();
  });
};

function continueShoping() {
  inquirer.prompt({
    name: "continueShoping",
    type: "confirm",
    message: "Would you like to continue shopping?"
  }).then((answer) => {
    if(answer.continueShoping) {
      start();
    } else {
      connection.end();
    }
  })
}

start();

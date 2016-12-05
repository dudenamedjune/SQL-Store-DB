var inquirer = require("inquirer");
var Table = require("cli-table");
var mysql 	 = require("mysql");

function range(start, stop, step){
  var a=[start], b=start;
  while(b<stop){b+=step;a.push(b)}
  return a;
};

function stockUpdate(a, b){
	return a - b;
}

function total(a, b){
	return Math.round10(a * b, -2);
}

function createtable(table){
	


	console.log(table.toString());
		
	
	
}

// Closure
(function() {
  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }
})();


// connect to server
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bamazon'
});
 
 //connect 
connection.connect();
 
 //query table products
connection.query('SELECT * FROM products', function(err, sqlresponse) {
  	if (err) throw err;

  	//create new CLI-TABLE for view in cli
 	var table = new Table ({
 		head: ["ID", "Product", "Price"],
 		colWidths: [5, 70, 13]

 	});
  //push data to cli table from sql object response
	for( i in sqlresponse){
		table.push(
	
	    	[sqlresponse[i].primary_id, sqlresponse[i].product_name, "$" + sqlresponse[i].price]
		);
	}
	
	//run function to display the table
	createtable(table);

	//run prompt function 
	customer(sqlresponse);
	
	
	

});


function customer(sqlresponse){
	
		
	inquirer.prompt([

	{
		type: "input",
		message: "Select the item you would like to buy (enter id)?",
		name: "choice",
	},

	{
		type: "input",
		message: "How many units would you like to purchase?",
		name: "amount"

	}
	



]).then(function(answers){
	// console.log(table.toString());
	//console.log(sqlresponse[answers.choice - 1].stock_quanity);
	//console.log(answers.amount);

	//actual id used in sql
	var userItemID 	= answers.choice;

	//access response with id - 1 because the index starts at 0
	var inStock 	= sqlresponse[userItemID - 1].stock_quanity;

	//amount user wants to buy
	var userneed 	= answers.amount;

	//access response to get price 
	var itemprice 	= sqlresponse[userItemID - 1].price;

	//input arguments for the stockupdate and function returns update 
	var newstock	= parseInt(stockUpdate(inStock, userneed));



	if(inStock >= userneed){

		
		
		connection.query("UPDATE products " + "SET stock_quanity = " + newstock + " WHERE primary_id =" + userItemID, function (err, results){
			if (err) throw err;

			console.log("Your total will be: " + total(itemprice, userneed));
		

		});
		connection.end();

	}



  });
 

}




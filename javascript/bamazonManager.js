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

function start(sqlresponse){
	inquirer.prompt([

		{
			name: "view",
			type: "list",
			message: "Home:",
			choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
		}



		]).then(function(manager){

			var choice = manager.view;
			if(choice === "View Products for Sale"){
				createtable(fulltable(sqlresponse));
				connection.end();


			}else if(choice === "View Low Inventory" ){
				createtable(lowStock(sqlresponse));
				connection.end();

			}else if(choice === "Add to Inventory"){
				createtable(fulltable(sqlresponse));
				addStock(sqlresponse);

			}else if(choice === "Add New Product"){
				addNew();

			}

		});
}



var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bamazon'
});
 
 //connect 
connection.connect();

function getData(){
	connection.query('SELECT * FROM products', function(err, sqlresponse) {
	  	if (err) throw err;
	  	start(sqlresponse);

	});
}

 
function fulltable(sqlresponse){

	  	//create new CLI-TABLE for view in cli
	 	var table = new Table ({
	 		head: ["ID", "Product", "Department", "Price", "Stock"],
	 		colWidths: [5, 70, 16, 13, 10 ]

	 	});
	 
	  //push data to cli table from sql object response
		var temparray = [];

		for(i in sqlresponse){
			temparray = [];
			table.push(temparray);		
			for(j in sqlresponse[i]){
				if(j === "price"){
					temparray.push("$" + Math.round10(sqlresponse[i][j], -2));
				}else{
					temparray.push(sqlresponse[i][j]);
				}			
				
			}
		}
		
		
		
		//run function to display the table
		return table;
}


function lowStock(sqlresponse){
	var table = new Table ({
	 head: ["ID", "Product", "Department", "Price", "Stock"],
	 colWidths: [5, 70, 16, 13, 10 ]

	 	});
	 
	  //push data to cli table from sql object response
		var temparray = [];

		for(i in sqlresponse){		
			for(j in sqlresponse[i]){
				if(j === "stock_quanity" && sqlresponse[i][j] < 5 ){
					for(j in sqlresponse[i]){
						if(j === "price"){
							temparray.push("$" + Math.round10(sqlresponse[i][j], -2));
						}else{
							temparray.push(sqlresponse[i][j]);
						}			
					}
					table.push(temparray);
					temparray = [];
				}	
				
			}
		}

		return table;


}

function addStock(sqlresponse){

	inquirer.prompt([
	{
		type: "input",
		name: "item",
		message: "Which item would you like to replenish (enter ID)?"

	},
	{
		type: "input",
		name: "add",
		message: "Number of units?"

	}

	]).then(function(stock){
		var newquan = parseInt(stock.add) + parseInt(sqlresponse[stock.item - 1]["stock_quanity"])
		connection.query("UPDATE products SET stock_quanity = " + newquan + " WHERE primary_id =" + stock.item, function (err, results){
			if (err) throw err;

		});
		connection.end();


	});
}

function addNew(){

	inquirer.prompt([

	{
		type: "input",
		name: "product",
		message: "Please enter product name:"

	},
	{
		type: "input",
		name: "department",
		message: "Please enter department name:"

	},
	{
		type: "input",
		name: "price",
		message: "Please enter price:"

	},
	{
		type: "input",
		name: "stock",
		message: "Please enter quantity:"

	}
		]).then(function(data){
	connection.query("INSERT INTO products (product_name, department_name, price, stock_quanity)" +
		' VALUES  ("' + data.product + '", "' + data.department + '",' + data.price + ', ' + data.stock + ')',  function(err, results) {
	  	if (err) throw err;


	  	

	});
	connection.end();
});

}

getData();





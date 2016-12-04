var inquirer = require("inquirer");
var Table = require("cli-table");
var mysql 	 = require("mysql");

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bamazon'
});
 
connection.connect();
 
connection.query('SELECT * FROM products', function(err, response) {
  	if (err) throw err;
 	var table = new Table ({
 		head: ["ID", "Product", "Price"],
 		colWidths: [5, 70, 13]

 	});
	for( i in response){
		table.push(
	
	    	[response[i].primary_id, response[i].product_name, "$" + response[i].price]
		);
	}


	console.log(table.toString());
	customer(table);

	connection.end();

});


function customer(){
	inquirer.prompt([

	{
		type: "list",
		message: "Select the item you would like to buy?",
		name: "choice",
		choices: table
	}



]).then(function(choice){
	// console.log(table.toString());
  	console.log(choice);
 });
 

}


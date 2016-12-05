CREATE DATABASE bamazon;

USE bamazon;
CREATE TABLE products(
primary_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100),
department_name VARCHAR(100),
price DEC(18 , 4), 
stock_quanity INT
);

INSERT INTO products(product_name, department_name, price, stock_quanity)
VALUES ("Rebecca Creek 1.75L", "Liquor", 42.07, 12), ("Balcones Single Malt Whiskey Classic 750ml", "Liquor", 87.47, 7),
("My Father Le Bjou 1922 (Torpedo)", "Tobacco", 14.23, 58), ("Ashton VSG Sorcerer (Churchill)" , "Tobacco", 15.75, 47),
("Raspberry pi 3", "Electronics", 39.95, 18), ("Arduino Uno R3", "Electronics", 24.95, 11), 
("Surface Studio (2TB / Intel Core i7 - 32GB RAM / 4GB GPU)", "Electronics", 4199.00, 3), ("WIFI Pineapple TETRA", "Electronics", 199.99, 3),
("Plumbus", "Home goods", 85.50, 10), ("Mega Seed", "pharmaceutical", 120.00, 233);


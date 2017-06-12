CREATE DATABASE IF NOT EXISTS bamazon_db;

USE bamazon_db;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  item_id VARCHAR(100) NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (item_id)
);

CREATE TABLE users ( id serial PRIMARY KEY, email VARCHAR ( 255 ) UNIQUE NOT NULL, password VARCHAR ( 255 ) NOT NULL );
INSERT INTO users (email, password) VALUES ('admin@gmail.com', 'oi');

CREATE TABLE products (id serial PRIMARY KEY, description VARCHAR ( 255 ) UNIQUE NOT NULL, price NUMERIC NOT NULL );
INSERT INTO products (description) VALUES ('Poltrona de massagem', 1873.89);
INSERT INTO products (description) VALUES ('Guarda-roupa solteiro', 13.89);

CREATE TABLE clients (id serial PRIMARY KEY, name VARCHAR ( 255 ) NOT NULL, cpf VARCHAR ( 255 ), birthdate DATE);
INSERT INTO clients (name, cpf, birthdate) VALUES ('Rogerinho da Van', '580.705.920-44', '10/09/1998');

CREATE TABLE sales (id serial PRIMARY KEY, product_id INTEGER NOT NULL REFERENCES products(id), client_id INTEGER NOT NULL REFERENCES clients(id));
INSERT INTO sales (product_id, client_id) VALUES (1, 1);
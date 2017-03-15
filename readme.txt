MVC based REST Api Ecommerce Website.

GitHub Link : https://github.com/sengartech/ecomm-restapi.git

This assignment is created and tested in the following environment:

OS : Ubuntu 16.04 LTS (64-bit).

Google Chrome Extension : Postman 4.10.3.

Editor : Atom 1.14.4 (64-bit).


Implementation:

  App has Admin and User end implemented.

  Admin-end works at (port:9000) : http://localhost:9000/

  User-end works at (port:3000) : http://localhost:3000/


  first create admin : http://localhost:9000/admin/create
  then login and create products,edit delete view.

  now access user end and perform various tasks.

  note: I have not made cart schema because I am storing all sessions in mongo-store(database) using 'connect-mongo' module.
        Thus, helps in maintaining guest's as well as logged in user's cart sessions.


How to run:

for admin:
  Step 1: Install all dependencies by : npm install
  Step 2: Open Postman and type (use POST method) : http://localhost:9000/admin/create
  Step 3: provide : username , firstName , lastName, email , password.
  Step 4: admin is created . Now Login. http://localhost:9000/admin/api/v1/login
  Step 5: create some product to show at user end.

for user:
  Step 1: Install all dependencies by : npm install
  Step 2: site works at. http://localhost:3000/
  Step 3: you are good to go now. Create account,shop, add to cart, checkout, orders,settings.


Thats all about it. Thanks :)

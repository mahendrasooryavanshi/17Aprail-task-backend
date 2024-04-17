postmen collection link : https://api.postman.com/collections/22418878-a6d24f96-0b24-4550-bba4-9b613f802a32?access_key=PMAT-01HVPNDPT8H929R3AVBT2GY1KE

npm install     // for installing node_modules
npm start        //for running project 

i have created basic signup and login user after that there is token middleware it must be pass token for all other routers.

GET /api/users: Retrieve all users from the database.

POST /api/users:  register a user into the app. The request body should contain name, email, and age fields.

GET /api/users/:id: Retrieve a specific user by their ID.

PUT /api/users/:id: Update a specific user's information (name, email, age) by their ID.

DELETE /api/users/:id: Delete a user from the database by their ID.

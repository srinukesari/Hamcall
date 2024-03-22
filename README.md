Hamcall is a backend service which provides below to the users:

/register -> user needs to register with username,phonenumber and password
/login -> user needs to login with valid phonenumber and password

/report-spam -> loggedin user can report spam by provides spamnumber in body and jwt token(you can get the token at the time of login) in headers
/search -> loggedin user can search for user by any of the phonenumber or name
/sync-contacts -> logged-in user can sync his contacts with global database

for security puprose we are using jwt token authorization

starting file -> index.js

you can run the hamcall local by going to root of the repo -> node index.js

used bcryptjs for password hashing for security reasons.

used postgresql db which supports orm, we used sequelize orm in this project.

to connect to your local postgresql uncomment the code which is in cmd/init.js and give your local postgres creds.

no need to create db tables before hand, on server startup it will check the db and creates the db table and have a sync-up.

for writing test case and mocking db calls I used jest and sinon

Thanks for reading.
Happy Coding...





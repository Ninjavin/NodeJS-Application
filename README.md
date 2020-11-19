# NodeJS Application with Express and Mongoose with following APIs

+ POST /v1/auth/signup

	+ Takes in `name`, `email`, `password`.
	+ Creates the User in MongoDB
	+ Returns a JWT for future authorization

+ POST /v1/auth/login

	+ Takes in `email`, `password`
	+ Checks if the email id is in the database.
	+ If email id is found, compares the password.
	+ Also, returns the JWT for future authorization

+ GET /v1/users/profile

	+ Returns user profile (`name`,`email`,`hashedpassword`)
	+ Protected Route


+ PATCH /v1/users/profile

	+ Changes the user profile
	+ Takes in `name`
	+ Updates user name in database
	+ Protected Route


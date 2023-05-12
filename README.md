#Board Game Database Backend

This project is the backend for a board game database. It provides an API to manage board game reviews, categories, and comments. The project is built using Node.js v19.7.0, PostgreSQL 14.7, and the Express.js framework. A hosted link can be found here: https://games-aibr.onrender.com

##In order to run this project on your own machine:

###Cloning the repository, installing dependencies, and creating .env files.

1. Clone the project repository from GitHub using git clone https://github.com/DrawnInward/nc-games

2. Ensure you are in the project directory and make sure you have Node.js installed on your machine.

3. Install the project dependencies using npm install.

4. Create two .env files in the project root directory: .env.test and .env.development. Open each .env file and add the following lines to the test and development files respectivey.
   PGDATABASE=nc_games_test
   PGDATABASE=nc_games

Make sure to add the .env files to your .gitignore file to prevent them from being committed to the repository.

###Seeding the database locally.

1. Make sure you have PostgreSQL installed and running on your local machine.

2. Run the following command to set up the necessary database tables:

npm run setup-dbs

3. Seed the local database with sample data by running the following command:

npm run seed

###Running tests.

1. Make sure the local database is running.

2. Run the npm test script to execute the project tests in Jest.

Please note that you may need to adjust the file paths or command names based on your project's specific configuration. Additionally, ensure that your local database is properly configured and accessible before running the setup and seed commands.

Feel free to modify and customize these instructions as needed to fit your project's specific requirements.

##Endpoints

The following endpoints are available in the API:
GET /api

    Description: Serves up a JSON representation of all the available endpoints of the API.

GET /api/categories

    Description: Serves an array of all categories.
    Queries: None
    Example Response:

GET /api/reviews

    Description: Serves an array of all reviews.
    Queries: category, sort_by, order
    Example Response:

Sure! Here's a sample README file for your project:
Board Game Database Backend

This project is the backend for a board game database. It provides an API to manage board game reviews, categories, and comments. The project is built using Node.js v19.7.0, PostgreSQL 14.7, and the Express.js framework.
Endpoints

The following endpoints are available in the API:
GET /api

    Description: Serves up a JSON representation of all the available endpoints of the API, this includes example responses of each endpoint.

GET /api/categories

    Description: Serves an array of all categories.
    Queries: None

GET /api/reviews

    Description: Serves an array of all reviews.
    Queries: category, sort_by, order

GET /api/reviews/:review_id

    Description: Serves a specific review object relevant to the inputted review ID.
    Queries: None

PATCH /api/reviews/:review_id

    Description: Increments or decrements the vote count on the inputted review.
    Queries: None
    Example request format:

{
"inc_votes": 10
}

POST /api/reviews/:review_id/comments

    Description: Posts a comment for the inputted review ID.
    Queries: None
    Example request format:

{
"username": "mallionaire",
"body": "Ah what a wonderful game! So simple I could play it with both of my hands full, as they were all night, with wine."
}

DELETE /api/comments/:comment_id

Description: Deletes a comment by the comment ID from the database.

Queries: None

Example Request:

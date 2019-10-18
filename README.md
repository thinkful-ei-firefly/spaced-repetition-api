# Learn Japanese Spaced Repetition API

## Live Link

The API is deployed to Heroku [here](https://spaced-repetition-japanese.herokuapp.com).

The client is deployed to zeit
[here](https://spaced-repetition-japanese.benjaminjrosen.now.sh) and the repo
can be found [here](https://github.com/thinkful-ei-firefly/spaced-repetition-ben-keith).

## Usage

This app allows users to:

   1. Register a new account
   2. Log in to their account
   3. View their words with counts for correct and incorrect guesses
   4. View their total correct guesses
   5. Practice words by inputing guesses and receiving feedback
   6. Practice words in a continually changing order according to how well they
      do on each word
      
To test out the app right away, log in using the demo credentials:

> Username: demo
> Password: pass

## Endpoints

1. `GET /api/language/`

This returns all the words and their associated data that match the id of the
logged in user. This is used in the dashboard view when a user first logs in.

2. `GET /api/language/head`

This returns the word that is currently in first place for testing the user as
well as information about it and the next word. This is used in the client's
`/learn` route and displays when the user clicks to begin practicing.

3. `POST /api/language/guess`

This captures the user's inputed guess and checks it against the correct answer
stored in the database. The server then updates the word's data appropriately
according to whether the user's guess was correct or incorrect and also pushes
the word back in the order of words (one space back for incorrect answer and
further for correct) using a linked list and then updates the database so that
the new ordering persists. 

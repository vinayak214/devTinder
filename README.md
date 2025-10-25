# devTinder

> Tinder for developers – a simple Node.js/Express server demo.

## Setup

1. **Install dependencies:**

   - Install Express
   - Install nodemon globally
   - Install mongoose (in-order to talk to DB)
   - Install bcrypt for hashing.
   - Install validator for. validating
   - Install cookie-parser for reading the cookies
   - Install json webtoken for authentication

2. ## **Services:**

   **ConnectionRequestRouter**

   - POST /request/send/interested/:userID
   - POST /request/send/ignored/:userID
   - POST /request/send/accepted/:requestID
   - POST /request/send/rejected/:requestID

   - Feed Api
     -/feed?page=1&limit=10 => 1 - 10. // Mongo db has skip(0) and limit(10) ==> it gives first 10 users

3. **Run the server:**
   - For production:
     ```bash
     npm start
     ```
   - For development (auto-reload with nodemon):
     ```bash
     npm run dev
     ```

## GIT

- git init
- git add . // To add all changes in staging
- git commit -m "Created a express Server"
- git remote add origin https://github.com/vinayak214/devTinder.git
- git branch -M main
- git push -u origin main

## Features

- Express server with a sample route `/hello`.
- Nodemon for fast code refresh during development.

## Example Endpoint

Visit [http://localhost:3000/hello](http://localhost:3000/hello) to see:

```
Hello from server again!!!
```

## Note

- req.params is when we pass values as :value
- req.query is when we use ?page=5

## Author

Vinayak Sureshkumar

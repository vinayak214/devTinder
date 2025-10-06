// Create server using express. npm i express
// const app = express(); // creating a new application(like new webserver)!!
// create nodemon for fastrefresh the code!!
// configured the package.json with the script updated!!
const express = require("express");

const app = express(); // creating a new application(like new webserver)!!

app.use("/hello", (req, res) => {
  res.send("Hello from server again!!!");
});
app.listen(3000, () => {
  console.log("server is success!!");
});

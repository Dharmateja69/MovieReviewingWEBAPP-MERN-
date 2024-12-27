const Express = require("express");
//12-12-24
const Morgan = require("morgan");
require("dotenv").config()
//13-12-24
require('express-async-errors');

const Userroute = require("./Routes/User");
const { errorHandler } = require("./Middelwares/error");
const cors = require("cors");
const { handleNotFOund } = require("./utils/helper");
 require("./Db");
const app = Express();
app.use(cors())
app.use(Express.json()); //used to convert the chunks to json fromat wch are comming from font end to backend
app.use(Morgan("dev"));
app.use("/api/user", Userroute); //where /api/user is an argument type used as prefix for /api/user/create (Routes>user.js);
app.use('/*',handleNotFOund)
//13-12-24
app.use(errorHandler)


app.get("/", (req, res) => {
  res.send("<h1>this is the main home page !!</h1>");
});

app.listen(8000, () => {
  console.log("the port is running on 8000!!");
});

// app.get("/about",(req,res)=>{
//     res.send("<h1>this is the main about page !!</h1>");
// });

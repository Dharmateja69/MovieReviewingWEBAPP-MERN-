const Express = require("express");
const Userroute = require("./Routes/User");
 require("./Db");
const app = Express();
app.use(Express.json()); //used to convert the chunks to json fromat wch are comming from font end to backend
app.use("/api/user", Userroute); //where /api/user is an argument type used as prefix for /api/user/create (Routes>user.js);
app.get("/", (req, res) => {
  res.send("<h1>this is the main home page !!</h1>");
});

app.listen(8000, () => {
  console.log("the port is running on 8000!!");
});

// app.get("/about",(req,res)=>{
//     res.send("<h1>this is the main about page !!</h1>");
// });

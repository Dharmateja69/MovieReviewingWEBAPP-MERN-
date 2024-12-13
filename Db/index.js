const mongoose = require("mongoose");
//12-12-24
mongoose.connect(process.env.MONGO_URI) //this is a method of mongodb which accepts the uri string . to connect with the local databse.(data base name is movie_review_app);
    .then(() => {
        console.log("The connectio done!!");//imediately after connection it will be called and vice versa for catch .
    }).catch((ex) => {
        console.log("Failed to connect !!", ex);
    })

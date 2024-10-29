const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/movie_review_app") //this is a method of mongodb which accepts the uri string . to connect with the local databse.(data base name is movie_review_app);
    .then(() => {
        console.log("The connectio done!!");//imediately after connection it will be called and vice versa for catch .
    }).catch((ex) => {
        console.log("Failed to connect !!", ex);
    })

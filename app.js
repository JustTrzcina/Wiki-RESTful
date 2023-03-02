const express =  require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/wikiDB"
const conn = mongoose.createConnection(mongoURI);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.listen(3000,function(){
    console.log("Server running on port 3000");
})
const express =  require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/wikiDB"
const conn = mongoose.createConnection(mongoURI);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const articleSchema = mongoose.Schema({
    title:String,
    content:String
})

const Article = mongoose.model("Article",articleSchema);

app.get("/articles",function(req,res){
    async function getAllArticles(){
        await mongoose.connect(mongoURI);
        const result = await Article.find();
        await mongoose.connection.close();
        return result
    }
    getAllArticles().then((result)=>{
        res.send(result);
    }).catch((err)=>{
        res.send(err);
    });
})

app.post("/articles",function(req,res){
    const article = new Article({
        title:req.body.title,
        content:req.body.content
    })
    async function postArticle(){
        await mongoose.connect(mongoURI);
        await article.save();
        await mongoose.connection.close();
    }
    postArticle().then(()=>{
        res.send("Article sucessfully added");
    }).catch((err)=>{
        res.send(err);
    });
});


app.listen(3000,function(){
    console.log("Server running on port 3000");
})
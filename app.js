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


app.route("/articles")
    .get(function(req,res){
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
    .post(function(req,res){
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

    })
    .delete(function(req,res){
        async function deleteArticles(){
            await mongoose.connect(mongoURI);
            await Article.deleteMany()
            await mongoose.connection.close();
        }
        deleteArticles().then(()=>{
            res.send("Articles deleted");
        }).catch((err)=>{
            res.send(err);
        });
    });


app.route("/articles/:articleTitle")
    .get(function(req,res){
        const requestedTitle = req.params.articleTitle
        async function getOneArticle(){
            await mongoose.connect(mongoURI);
            const result = await Article.findOne({title:requestedTitle});
            await mongoose.connection.close();
            return result
        }
        getOneArticle().then((result)=>{
            res.send(result);
        }).catch((err)=>{
            res.send(err);
        });
    })
    .put(function(req,res){
        const requestedTitle = req.params.articleTitle
        const newTitle = req.body.newTitle;
        const newContent = req.body.newContent;
        async function updateArticle(){
            await mongoose.connect(mongoURI);
            const article = await Article.findOne({title:requestedTitle});
            await article.overwrite({title:newTitle, content:newContent});
            await article.save();
            await mongoose.connection.close();
        }
        updateArticle().then(()=>{
            res.send("Update succesfull");
        }).catch((err)=>{
            res.send(err);
        });
    })
    .patch(function(req,res){
        const requestedTitle = req.params.articleTitle
        async function patchArticle(){
            await mongoose.connect(mongoURI);
            await Article.updateMany(
                {title: requestedTitle},
                {$set: req.body}
            )
            await mongoose.connection.close();
        }
        patchArticle().then(()=>{
            res.send("Patch succesfull");
        }).catch((err)=>{
            res.send(err);
        });
    })
    .delete(function(req,res){
        const requestedTitle = req.params.articleTitle;
        async function deleteOneArticle(){
            await mongoose.connect(mongoURI);
            await Article.deleteOne({title:requestedTitle})
            await mongoose.connection.close();
        }
        deleteOneArticle().then(()=>{
            res.send("Article deleted");
        }).catch((err)=>{
            res.send(err);
        });

    })

app.listen(3000,function(){
    console.log("Server running on port 3000");
})
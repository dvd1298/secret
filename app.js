//jshint esversion:6
require('dotenv').config();
//dotenv have to be in the top
const express=require("express");
//const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
//:npm i mongoose-encryption
const encrypt=require("mongoose-encryption");

const app=express();



app.set('view engine','ejs');
//To get rid of the deprecation warning in VScode:
//maybe its going to work?
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//app.use(bodyParser,urlencoded({extended:true}));
//if comment out body-parser?

//connect to mongoose
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});
//+mongoose encryption
const userSchema=new mongoose.Schema({
    email: String,
    password: String
});
//doc:mongoose-encryption 
//key- - - not share


//+.env +process.env.SECRET
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});
//the plugins have to before mongoose model
//+encryptedFields with ['']in plugins.

const User=new mongoose.model("User",userSchema);


app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register"); 
});

app.post("/register",function(req,res){
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    });
}); 

app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;

    User.findOne({email:username},function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password===password){
                    res.render("secrets");
                }
            }
        }
    })
});







//
app.listen(3000,function(){
    console.log("Server started on port 3000.");
});


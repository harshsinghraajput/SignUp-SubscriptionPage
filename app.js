const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");//app.post function m use aega
//and jo bhi details user dalega sara user ka datas ismey store hoga
const https= require ("https");

const request = require("request");
const { METHODS } = require("https");
const app = express();

//because of these we r able to use the css styles in our signup page
const staticPath = path.join(__dirname+"/public");
app.use(express.static(staticPath));
app.use(bodyParser.urlencoded({extended : true}));
app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});  

app.post('/' , function (req , res) {
    const firstName = req.body.fname; 
    const lastName = req.body.lname;
    const email = req.body.email;
   
    const data = { 
    members:[
       {
         email_address: email,
         status:"subscribed",
         merge_fields:{
            FNAME: firstName,
            LNAME: lastName
         }
       }        
    ]
   };
   //below is used to convert javascript to json file
   const jsonData = JSON.stringify(data);
   
   const url= "https://us13.api.mailchimp.com/3.0/lists/a303fe9a98";
   const options={
    method:"POST",
    auth:"hsr1:d7b79af90a7750e6e8db90674defddfa-us13"//username(kchbhi):pass api key
   }
   const request = https.request(url , options , function (response) {
    if (response.statusCode === 200) {
        res.sendFile(__dirname+"/success.html");
    }
    else{
        res.sendFile(__dirname+"/failure.html");
    }
    response.on("data" , function (data) {
        console.log(JSON.parse(data));
    });
   });
   request.write(jsonData);
   request.end();
});

//APIKEY
// d7b79af90a7750e6e8db90674defddfa-us13
//aud id :  a303fe9a98

//directly aise run pr css and dusra cheez like logo yeh sb nhi arha h
// but bootstrap ka sara cheez arha h becz website hosted h bootstrap ka but hmhara style.css and and logo 
//posted nhi h 
// app.get("/" , function(req,res) {
//     res.sendFile(__dirname +"/signup.html");
// }); 

app.post("/failure" , function (req,res) {
    res.redirect("/");
});

//Procfile is used like nodemon app.js say file automatic run hota h waise he 
app.listen(process.env.PORT || 3000,function () {//dual run hoga locally and huruko m bhi
    console.log("server started at port 3000!");
});
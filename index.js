const bodyparser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
var express = require('express');
var isUrl = require('is-url');
var sh = require("shorthash");
var app = express();

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
app.use('/public', express.static(process.cwd() + '/public'));


var db;

var mlab_username = ''; //your mlab username
var mlab_password = ''; //your mlab password
var appUrl = ''; //your app url with a trailing backslash.. example: https://nanos.herokuapp.com/
// mlab_url would be given to you upon registration in mlab.com
var mlab_url = 'mongodb://'+mlab_username+':'+mlab_password+'@xxxxxx.mlab.com:27506/your-db-name';


MongoClient.connect(mlab_url, (err, database) => {    
    if(err)  return console.log("error while CONNECTING!! " + err);
    console.log("connected to database!");
    
    db = database;
    
    app.get("/", (req, res) => {        
        var cursor = db.collection('nanos').find();
        cursor.toArray( (err, results) => {
            if(err) return console.log("error while getting DATA!! " + err);            
        });
        res.sendFile(process.cwd() + '/views/index.html');
    });
    
    app.get('/new/*', (req, res) => {
        var address = (req.originalUrl).slice(5);
        var save_data, sha, proxy;
        if(isUrl(address)){            
            // make a unique id
            sha = sh.unique(address);            
            proxy = appUrl + sha;            
            save_data = {                
                real_url: address,
                proxy_url: proxy
            };                                                
        } else {
            console.log("err");
            res.json({error: "Error. check the url you are passing."});
        }                
        db.collection('nanos').save(save_data, (err, result) => {
            if(err) return console.log("error while uploading DATA!! " + err);
            console.log("saved to database successfully!");            
            //res.redirect("/");
            res.json({
                real_url: address,
                short_url: proxy
            });
        });                     
        
    });

    app.get('/*', (req, res) => {    
        console.log(req.originalUrl); 
        var url = "https://nanos.herokuapp.com" + req.originalUrl;
        db.collection("nanos").findOne({proxy_url: url}, function(err, result) {
            if (err || !result) {                
                res.json({
                    error: "This record doesn't exist."
                });
            } else {
                console.log(result);                            
                res.redirect(result.real_url);  
            }                      
        });
                
    // Respond not found to all the wrong routes
    app.use(function(req, res, next){
        res.status(404);
        res.sendFile(process.cwd() + '/views/404.html');
    });
  
    // Error Middleware
    app.use(function(err, req, res, next) {
        if(err) {
        res.status(err.status || 500)
            .type('txt')
            .send(err.message || 'SERVER ERROR');
        }  
    });

   
    app.listen(process.env.PORT || 3000, function () {
        console.log('Node.js listening ...');
    });

  });


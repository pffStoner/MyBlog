const express = require('express');
const path = require('path');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');

//connection to mongodb with mongoose
mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//check connection
db.once('open', () => {
    console.log('connected to MongoDb');
});

//check for db error
db.on('error', (err) => {
    console.log(err);
});

const app = express();

//Models
let Article = require('./models/article');

//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','pug');

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//set static path
app.use(express.static(path.join(__dirname, 'public')));

//home route
app.get('/', (req, res) => {
    Article.find({}, (err, articles) => {
        if (err) {
            console.log(err);
        }else{
            res.render('index', {
                title: 'Articles',
                articles: articles
            });
        }
       
    });
});


//get single article
app.get('/article/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('article', {
            article:article
        })
    });
});


//add route
app.get('/articles/add', (req, res) => {
    res.render('add_article');
});

//Add submit post route
app.post('/articles/add', (req, res) => {
   let article = new Article();
   article.title = req.body.title;
   article.author = req.body.author;
   article.body = req.body.body;

   article.save((err) =>{
    if (err) {
        console.log(err);
    }else{
        res.redirect('/');
    }
   });
});

//load edit form
app.get('/article/edit/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('edit_article', {
            article:article
        })
    });
});

//update submit POST route
app.post('/articles/edit/:id', (req, res) => {
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id:req.params.id}
 
    Article.update(query,article,(err) =>{
     if (err) {
         console.log(err);
     }else{
         res.redirect('/');
     }
    });
 });
 
 //delete article
 app.delete('/article/:id', (req, res) => {
    let query = {_id: req.params.id};

    Article.remove(query, (err) => {
        if (err) {
            console.log(err);
        }
        res.send('Success');
    });
 });

//start server
app.listen('3000', () => {
    console.log('listen to 3000...');
});
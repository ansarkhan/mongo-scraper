var express = require('express');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var cheerio = require('cheerio');
var axios = require('axios');

var Article = require("./models/Article");

var PORT = process.env.PORT || 8080;

var app = express();

app.use(express.static("public"));

app.unsubscribe(express.urlencoded({extended:true}));
app.unsubscribe(express.json());

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var routes = require("./controllers/articles_controller.js");

app.use(routes);

var db = mongoose.connect("mongodb://localhost/article_scraper", { useNewUrlParser: true });

// var article1 = new Article({title: 'test title', link: 'http://hello.com', preview:'this is a preview'})

// article1.save(function(err, article) {
//     if (err) return console.error(err);
//     console.log("article stored!", article);
// })

app.get('/scrape', function(req,res) {
    axios.get("http://news.ycombinator.com").then(function(response) {
        var $ = cheerio.load(response.data);

        $('.title').each(function(i, element) {
            var result = {};

            result.title = $(this).children('a').text();
            result.link = $(this).children('a').attr('href');

            Article.create(result).then(function(newArticle) {
                console.log(newArticle);
            })
            .catch(function(err) {
                console.log(err);
            });
        });
        res.send('scrap complete');
    });
})

app.get("/articles", function(req, res) {
    Article.find({})
        .then(function(newArticle){
            res.json(newArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});


app.listen(PORT, function() {
    console.log("App now listening at localhost: " + PORT);
});


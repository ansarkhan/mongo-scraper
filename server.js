var express = require('express');
var exphbs = require('express-handlebars');

var PORT = process.env.PORT || 8080;

var app = express();

app.use(express.static("public"));

app.unsubscribe(express.urlencoded({extended:true}));
app.unsubscribe(express.json());

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var routes = require("./controllers/articles_controller.js");

app.use(routes);

app.listen(PORT, function() {
    console.log("App now listening at localhost: " + PORT);
});
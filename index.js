const express = require('express');
const app = express();

//setting view engine
const bodyParser = require('body-parser');

const urlencodedParser= bodyParser.urlencoded({extended:false});


app.set("view engine", "ejs");
const port = 3000;

//serve the styles
app.use('/styles',express.static('./styles'));
app.get('/styles');

//List to store lod details
const logCollection = [];

//Handling the default request
app.get('/', (req, res) => {
    res.render('index')});
   
// When form is submitted
    app.post('/submitted', urlencodedParser,(req, res) => { 
       console.log(req.body);
       logCollection.push(req.body);
         res.render('submitted',{logArray:logCollection});
    });
   
app.listen(port, () => console.log(`Log-app listening on port ${port}!`));
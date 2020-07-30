const express = require('express');
const deleteCollection = require('./delete');
const app = express();

app.set("view engine", "ejs");

var admin = require("firebase-admin");

var serviceAccount = require("./log-book-3c53d-firebase-adminsdk-xgf9x-18c96233bd.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://log-book-3c53d.firebaseio.com"
});

const db = admin.firestore();

const tempDb = [];
//function to add  data to fire store
 async function addToDb(LogDetails,res){
  try {
    //  db.collection('LogBook').doc(LogDetails.id).set(LogDetails);
    const docRef = db.collection('LogBook').doc(LogDetails.id);
    await docRef.set(LogDetails);
    
  } catch (error) {
    // console.log(`Db not connected : ${error}`);
    // tempDb.push(LogDetails);
    // console.log(LogDetils);
    res.send(`Cant add to database .Connect the internet\n
    error : ${error}`)
    
  }
 
}


  

//setting view engine
const bodyParser = require('body-parser');

const urlencodedParser= bodyParser.urlencoded({extended:false});



const port = 3000;

app.use('/public/images',express.static('./images'))
//serve the styles
app.use('/styles',express.static('./styles'));
app.get('/styles');

//List to store lod details
let logCollection = [];

//retrieve the data
async function retrieveData(res){
  //const docList=  (await db.collection('LogBook').get()).docs.entries()
  try {
    const docList = (await db.collection('LogBook').get()).docs;
    console.log(docList);
    logCollection=[];
    docList.forEach((doc)=>{
      console.log(doc.data());
  logCollection.push(doc.data());
    })
  } catch (error) {
    res.send(`Connect Internet
    Can't retrieve data fromo the database\n
    error:${error}`)
  } 

}



//Handling the default request
app.get('/', (req, res) => {
  res.render('index')
  });
    

    const collectionPath = db.collection('LogBook').path
   // function called to clear the dataBase
     function clearDb (){  
      logCollection=[];

const clearLogBook =  deleteCollection(db, collectionPath, 5)

}
app.get('/delete',(req,res)=>{
 try {
  clearDb();
  res.render('submitted',{logArray:logCollection});
 } catch (error) {
   res.send(`Can't delete connect the internet\n
   error : ${error}`)
   
 }
 
  
  
})

     app.get('/submitted',(req,res)=>{
       res.render('submitted',{logArray:logCollection});
     });
   // When form is submitted
     app.post('/submitted', urlencodedParser,async (req, res) => { 
       
      // logCollection.push(req.body);
      
         addToDb(req.body,res);
         await retrieveData(res);
         res.render('submitted',{logArray:logCollection});
    });
    
app.listen(port, () => console.log(`Log-app listening on port ${port}!`));
module.exports={db:db,collectionPath:collectionPath}
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.02jxk.mongodb.net/creativeAgency?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('events'))
app.use(fileUpload());
const port = 5000





const client = new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true});
client.connect(err => {

    console.log("database connected");

    const CourseCollection = client.db("creativeAgency").collection("course");
  const customerCollection = client.db("creativeAgency").collection("customer");
  const reviewCollection = client.db("creativeAgency").collection("review");
  const adminCollection = client.db("creativeAgency").collection("admin");


app.post('/customerOrder', (req, res) => {
    const course = req.body;
    

    customerCollection.insertOne(course)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
});

app.post('/addadmin', (req, res) => {
    const admin = req.body.name
    

    adminCollection.insertOne({admin})
        .then(result => {
            res.send(result.insertedCount > 0)
        })
});

app.post('/feedback',(req,res)=>{
const feedbackdata= req.body;

reviewCollection.insertOne(feedbackdata)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
})

app.post('/addevent',(req,res)=>{
    const file=req.files.file
    const name=req.body.serviceTitle
    const desc=req.body.description
    
    const encImg=file.data.toString('base64')
      const image={
        contentType:file.mimetype,
        size:file.size,
        img:Buffer(encImg,'base64')
      }
      CourseCollection.insertOne({img:image, desc, name})
    .then(result=>{
      res.send(result.insertedCount > 0)
    })
  })

app.get('/frontcourse', (req, res) => {
    CourseCollection.find({}).limit(6)
        .toArray((err, documents) => {
            res.send(documents);
        })
})

app.get('/serviceList', (req, res) => {
    const email = req.query.email;
    customerCollection.find({email: email})
        .toArray((err, documents) => {
            res.send(documents);
        })
})

app.get('/serviceListForAdmin', (req, res) => {
    customerCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
})

app.get('/reviewlist', (req, res) => {
    reviewCollection.find({}).limit(6)
        .toArray((err, documents) => {
            res.send(documents);
        })
})


app.get('/getadmin', (req, res) => {
    const email = req.query.email
    adminCollection.find({admin : email})
        .toArray((err, documents) => {
            res.send(documents);
        })
})

app.delete('/delete', (req, res) => {
    customerCollection.deleteOne({ _id: ObjectId(req.query.id) })
      .then(result => {
        res.send(result.deletedCount > 0)
      })
  })

  
  
});





app.get('/', (req, res) => {
  res.send('Hello World!')
})

//process.env.PORT ||
app.listen( port)
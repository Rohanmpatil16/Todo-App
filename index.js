import express from 'express';
import path from 'path';    
import mongodb from 'mongodb';

const app = express();
const publicPath=path.resolve('public');
app.use(express.static(publicPath));

const dbName="mern-todo";
const collectionName="todo";
const url="mongodb://127.0.0.1:27017";
const client=new mongodb.MongoClient(url);

app.use(express.urlencoded({extended:true}));

const connection=async()=>{
    const connect=await client.connect();
    return await connect.db(dbName)
}


app.set('view engine','ejs');

app.get('/',async (req,res)=>{
    const db=await connection();
    const collection=db.collection(collectionName);
    const result=await collection.find().toArray();
    res.render('list',{result});
})

app.get('/add',(req,res)=>{
    res.render('add');
})

app.get('/update',(req,res)=>{
    res.render('update');
})

app.post('/add',async(req,res)=>{
    const db=await connection();
    const collection=db.collection(collectionName);
    const result=collection.insertOne(req.body)
    if(result){
    res.redirect("/");
    }
    else{
        res.redirect("/add");
    }
})

app.post('/update',(req,res)=>{
    res.redirect("/");
})
app.listen(3003,()=>{
    console.log("server is running on port 3003");
})
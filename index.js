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
    const result=await collection.insertOne(req.body)
    if(result){
    res.redirect("/");
    }
    else{
        res.redirect("/add");
    }
})

app.get('/delete/:id', async (req, res) => {
    const db = await connection();
    const collection = db.collection(collectionName);

    const result = await collection.deleteOne({
        _id: new mongodb.ObjectId(req.params.id)
    });

    if (result.deletedCount === 1) {
        res.redirect("/");
    } else {
        res.send("Delete failed");
    }
});

app.get('/update/:id', async (req, res) => {
    const db = await connection();
    const collection = db.collection(collectionName);

    const result = await collection.findOne({
        _id: new mongodb.ObjectId(req.params.id)
    });

    if (result) {
        res.render('update', { result });
    } else {
        res.send("Task not found");
    }
});
    app.post('/update/:id', async (req, res) => {
    const db = await connection();
    const collection = db.collection(collectionName);

    const filter = { _id: new mongodb.ObjectId(req.params.id) };

    const updateDoc = {
        $set: {
            title: req.body.title,
            desc: req.body.desc
        }
    };

    const result = await collection.updateOne(filter, updateDoc);

    if (result.modifiedCount === 1) {
        res.redirect("/");
    } else {
        res.send("Update failed");
    }
});
    

app.post("/multi-delete", async (req, res) => {
    const db = await connection();
    const collection = db.collection(collectionName);

    let selected = req.body.selected;

    // convert to array if only one checkbox selected
    if (!Array.isArray(selected)) {
        selected = [selected];
    }

    const ids = selected.map(id => new mongodb.ObjectId(id));

    const result = await collection.deleteMany({
        _id: { $in: ids }
    });

    res.redirect("/");
});
app.listen(3003,()=>{
    console.log("server is running on port 3003");
})
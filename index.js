const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();



const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m8joqcm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// let verifyJWT=(req,res,next)=>{

//  const authHeader=req.headers.authorization;
//  console.log(authHeader)
//  if(!authHeader){
//     return res.status(401).send('Unauthorized access');
//  }
//  const  token=authHeader.split(' ')[1];
 
//  jwt.verify(token, process.env.ACCESS_TOKEN, function(err,decoded){
//     if(err){
//         return res.status(403).send({message: 'Forbidden Aceess'})
//     }
//     req.decoded=decoded;
//     next();
//  })
// }

async function run() {
    try {
        
        const usersCollection = client.db('the-lecturer-server').collection('users');
     
        const blogsCollection = client.db('the-lecturer-server').collection('all-blogs');
     

    //     const verifyAdmin= async(req,res,next)=>{
    //         console.log('inside verifiedAdmin:',req.decoded.email)
    //         const decodedEmail = req.decoded.email;
    // const query ={email: decodedEmail}
    // const user=await usersCollection.findOne(query)
    // if(user?.role !== 'admin'){
    //     return res.status(403).send({message: 'Forbidden Access'})
    // }
    //         next();
    //     }

        // Use Aggregate to query multiple collection and then merge data
       

       

        /***
         * API Naming Convention 
         * app.get('/bookings')
         * app.get('/bookings/:id')
         * app.post('/bookings')
         * app.patch('/bookings/:id')
         * app.delete('/bookings/:id')
        */


app.get('/users', async(req,res)=>{
    const query ={};
    const users=await usersCollection.find(query).toArray();
    res.send(users)
})
app.get('/allblogs', async(req,res)=>{
    const query ={};
    const users=await blogsCollection.find(query).toArray();
    res.send(users)
})

app.get('/users/admin/:email', async(req,res)=>{
    const email=req.params.email;
    const query= {email}
    const user =await usersCollection.findOne(query)
    res.send({isAdmin: user?.role === 'admin' })
})

 app.post('/users',async(req,res)=>{
    const user=req.body;
    const result= await usersCollection.insertOne(user)
    res.send(result)
 })
 app.post('/allblogs',async(req,res)=>{
    const user=req.body;
    const result= await blogsCollection.insertOne(user)
    res.send(result)
 })
//  app.put('/users/admin/:id', verifyJWT,verifyAdmin, async(req,res)=>{
   
//     const id=req.params.id;
//     const filter ={_id: ObjectId(id)}
//     const options={upsert: true}
//     const updateDoc={
//         $set: {
//             role: 'admin'
//         }
//     }
//     const result=await usersCollection.updateOne(filter,updateDoc,options)
//     res.send(result)
//  })

//temporary to update price field on appointment options
// app.get('/addPrice',async(req,res)=>{
//     const filter={}
//     const options={upsert:true}
//     const updateDoc={
//         $set: {
//             price: 99
//         }
//     }
//     const result= await appointmentOptionCollection.updateMany(filter,updateDoc,options);
//     res.send(result);
// })

 
 app.delete('/doctors/:id',verifyJWT,verifyAdmin,async(req,res)=>{
    const id=req.params.id;
    const filter={_id:ObjectId(id)}
    const result= await doctorsCollection.deleteOne(filter)
    res.send(result)
 })



    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', async (req, res) => {
    res.send('The Lecturer server is running');
})

app.listen(port, () => console.log(`The Lecturer running on ${port}`))
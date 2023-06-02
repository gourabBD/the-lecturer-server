const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt= require('jsonwebtoken')
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
//jwt token end
async function run() {
    try {
        
        const usersCollection = client.db('the-lecturer-server').collection('users');
     
        const blogsCollection = client.db('the-lecturer-server').collection('all-blogs');
        const testsCollection = client.db('the-lecturer-server').collection('allTests');
     

    //     const verifyAdmin= async(req,res,next)=>{
    //         console.log('inside verifiedAdmin:',req.decoded.email)
    //         const decodedEmail = req.decoded.email;
    // const query ={email: decodedEmail}
    // const user=await usersCollection.findOne(query)
    // if(user?.role !== 'admin551717'){
    //     return res.status(403).send({message: 'Forbidden Access'})
    // }
    //         next();
    //     }

        // app.get('/jwt',async(req,res)=>{
        //     const email=req.query.email;
        //     const query ={email: email};
        //     const user=await usersCollection.findOne(query);
        //     if(user){
        //          const token=jwt.sign({email},process.env.ACCESS_TOKEN,{expiresIn:'3h'}) 
        //          return res.send({accessToken: token})
        //     }
        //     res.status(403).send({accessToken: ''})
            
        // })

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
app.get('/allBlogs', async(req,res)=>{
 
    const query ={};
    const Blogs=await blogsCollection.find(query).sort({_id:-1}).toArray();
    res.send(Blogs)
})
app.get(`/allBlogs/:id`,async(req,res)=>{
  const id=req.params.id;
 const query={_id:new ObjectId(id)}
  const result = await blogsCollection.findOne(query);
  res.send(result)
 })


//  app.get(`/editblog/:id`,async(req,res)=>{
//     const id=req.params.id;
//    const query={_id:new ObjectId(id)}
//     const result = await blogsCollection.findOne(query);
//     res.send(result)
//    })

 //update patch
 app.patch('/allBlogs/:id',async(req,res)=>{
    const id= req.params.id;
    const blogs = req.body.blogs
    const query={_id :new ObjectId(id)}
    const options = { upsert: true };
    const updateDoc={
      $set:{
        blogs: blogs
  }
    
    }
    const result =await blogsCollection.updateOne(query,updateDoc,options)
    res.send(result)
   })

// app.get('/users/admin/:email', async(req,res)=>{
//     const email=req.params.email;
//     const query= {email}
//     const user =await usersCollection.findOne(query)
//     res.send({isAdmin: user?.role === 'admin' })
// })
app.get(`/users/:id`,async(req,res)=>{
  const id=req.params.id;
 const query={_id:new ObjectId(id)}
  const result = await usersCollection.findOne(query);
  res.send(result)
 })

 app.patch('/users/:id',async(req,res)=>{
  const id= req.params.id;
  const role = req.body.role
  const query={_id :new ObjectId(id)}
  const updateDoc={
    $set:{
      role

    }
  
  }
  const result =await usersCollection.updateOne(query,updateDoc)
  res.send(result)
 })

 app.post('/users',async(req,res)=>{
    const user=req.body;
    const result= await usersCollection.insertOne(user)
    res.send(result)
 })
app.delete('/users/:id',async(req,res)=>{
  const id=req.params.id;
  
  const query={_id:new ObjectId(id)}
  const result=await usersCollection.deleteOne(query)
  res.send(result)
 })

 app.post('/allBlogs',async(req,res)=>{
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

 
 app.delete('/allBlogs/:id',async(req,res)=>{
    const id=req.params.id;
    const filter={_id:new ObjectId(id)}
    const result= await blogsCollection.deleteOne(filter)
    res.send(result)
 })
 

 //tests
 app.get('/createTests', async(req,res)=>{
 
    const query ={};
    const Blogs=await testsCollection.find(query).sort({_id:-1}).toArray();
    res.send(Blogs)
})
 app.post('/createTests',async(req,res)=>{
    const testQuestions=req.body;
    const result= await testsCollection.insertOne(testQuestions)
    res.send(result)
 })
 

app.get(`/createTests/:id`,async(req,res)=>{
  const id=req.params.id;
 const query={_id:new ObjectId(id)}
  const result = await testsCollection.findOne(query);
  res.send(result)
 })

 app.patch('/createTests/:id',async(req,res)=>{
    const id= req.params.id;
    const blogs = req.body.blogs
    const query={_id :new ObjectId(id)}
    const options = { upsert: true };
    const updateDoc={
      $set:{
        blogs: blogs
  }
    
    }
    const result =await testsCollection.updateOne(query,updateDoc,options)
    res.send(result)
   })

   app.delete('/createTests/:id',async(req,res)=>{
    const id=req.params.id;
    const filter={_id:new ObjectId(id)}
    const result= await testsCollection.deleteOne(filter)
    res.send(result)
 })
 //tests



    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', async (req, res) => {
    res.send('The Lecturer server is running');
})

app.listen(port, () => console.log(`The Lecturer running on ${port}`))
const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const User=require('./models/user')
const Sample=require('./models/sample')

const app=express()
const URL='mongodb://localhost:27017/Dokoto'
app.use(express.json())
app.use(cors())

const registerSchema=mongoose.Schema({
  user:{
    type:String,
    required:true
  },
  status:{
    type:String,
    required:true
  }
})

mongoose.connect(URL)
    .then(()=>{
        app.get('/',(req,res)=>{
            res.send('Mongo Connected')
        })
        app.get('/message', async (req,res)=>{
            const userData=await Sample.find()
            res.send(userData) 
        })
        
        app.post('/message',async (req,res)=>{
            const newUserData=new Sample(req.body)
            await newUserData.save()
            res.json(newUserData)
        })  

        app.post("/register", async (req, res) => {
              try {
                const user = new User(req.body);
        
                //validation logic
                const userName = req.body.userName;
                const email = req.body.email;
        
                const userNameSearch = await User.findOne({ userName }); //returns whole object
                const emailSearch = await User.findOne({ email }); 
        
                if(userNameSearch && emailSearch){
                  res.send("3");
                }
                else if (userNameSearch) {
                    res.send("4");
                }
                else if(emailSearch){
                  res.send("5");
                }
                else{
                  await user.save();
                  mongoose.model(req.body.userName,registerSchema)
                  res.send("Data submitted successfully!");
                }
              } catch (error) {
                console.error(error);
                res.status(500).send("An error occurred while saving data.");
              }
            });
            
        app.post("/login", async (req, res) => {
              try {
                // const user = new User(req.body);
        
                //validation logic
                const userName = req.body.userName;
                const password = req.body.password;
        
                const userNameSearch = await User.findOne({ userName:userName }); 
                const passwordMatch = (userNameSearch) ? userNameSearch.password : '';
        
                if(!userNameSearch){
                  res.send("1");
                }
                else if (password != passwordMatch) {
                  res.send("2");
                }
                else if (password === passwordMatch) {
                  res.send("Logged in successfully!");
                }
              } catch (error) {
                console.error(error);
                res.status(500).send("An error occurred while saving data.");
              }
            });


        // app.post('/insertuser',async(req,res)=>{
        //   try{
        //     const newdata=new mongoose.model('hilubabz',registerSchema)(req.body)
        //     await newdata.save()
        //   }
        //   catch(e){
        //     console.log(e)
        //   }
        // })

        app.listen(5000,()=>{console.log('Server Connected')})
    })
    .catch(err=>console.log(err))


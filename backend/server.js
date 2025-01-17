const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/user");
const Message = require("./models/message");
const bodyParser = require("body-parser");
const bcrypt=require('bcrypt')
const crypto=require('crypto')
const dotenv = require('dotenv');
dotenv.config();
const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); 

const friendAcceptedList = require("./models/friendAcceptedList");
const friendPendingList = require("./models/friendPendingList");

const app = express();
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
const URL = "mongodb://localhost:27017/Dokoto";
app.use(express.json());
app.use(cors());

mongoose
  .connect(URL)
  .then(() => {
    app.get("/", (req, res) => {
      res.send("Mongo Connected");
    });

    app.post("/findMessage", async (req, res) => {
      const id = req.body._id; 
    
      try {
        const messages = await Message.find({
          $or: [{ senderId: id }, { receiverId: id }],
        });
    
        const decryptedMessages = messages.map((msg) => {
          const messageObj = { ...msg._doc }; 
    
          if (msg.msgType === 'text') {
            try {
              const [ivHex, encryptedMessage] = msg.message.split(':'); 
              const iv = Buffer.from(ivHex, 'hex');
              const decipher = crypto.createDecipheriv(algorithm, key, iv);
    
              let decryptedMessage = decipher.update(encryptedMessage, 'hex', 'utf8');
              decryptedMessage += decipher.final('utf8');
    
              messageObj.message = decryptedMessage; 
            } catch (error) {
              console.error(`Error decrypting message with ID ${msg._id}:`, error);
              messageObj.message = "Error decrypting message"; 
            }
          }
    
          return messageObj; 
        });
    
        
        res.json(decryptedMessages);
      } catch (error) {
        console.error("Error finding messages:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.post("/message", async (req, res) => {
      try {
        const { senderId, receiverId, status, msgType, message } = req.body;
        const iv = crypto.randomBytes(16); 
        
        if (!senderId || !receiverId || !msgType) {
          return res.status(400).json({ error: "Missing required fields" });
        }
    
        if (msgType === 'photo') {
          const newUserData = new Message(req.body);
          await newUserData.save();
          return res.json(newUserData);
        } else {
          
    
          const cipher = crypto.createCipheriv(algorithm, key, iv);
          let encryptedMessage = cipher.update(message, 'utf8', 'hex');
          encryptedMessage += cipher.final('hex');
    
          
          const encryptedData = `${iv.toString('hex')}:${encryptedMessage}`;
    
          
          const newUserData = new Message({
            senderId,
            receiverId,
            message: encryptedData, 
            status,
            msgType,
          });
    
          await newUserData.save();
          try {
            const [ivHex, encryptedMessage] = newUserData.message.split(':'); 
            const iv = Buffer.from(ivHex, 'hex');
            const decipher = crypto.createDecipheriv(algorithm, key, iv);
  
            let decryptedMessage = decipher.update(encryptedMessage, 'hex', 'utf8');
            decryptedMessage += decipher.final('utf8');
  
            newUserData.message = decryptedMessage; 
          } catch (error) {
            console.error(`Error decrypting message with ID ${msg._id}:`, error);
            newUserData.message = "Error decrypting message"; 
          }
          return res.json(newUserData);
        }
      } catch (error) {
        console.error("Error handling message:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.post("/register", async (req, res) => {
      try {
        const saltRounds=10
        
        // const user = new User(req.body);

        //validation logic
        const fullName=req.body.fullName
        const userName = req.body.userName;
        const gender=req.body.gender
        const dob=req.body.dob
        const email = req.body.email;
        const password=await bcrypt.hash(req.body.password,saltRounds)
        const profilePicture=req.body.profilePicture
        const user=new User({
          fullName:fullName,
          userName:userName,
          gender:gender,
          dob:dob,
          email:email,
          password:password,
          profilePicture:profilePicture          
        })


        const userNameSearch = await User.findOne({ userName }); //returns whole object
        const emailSearch = await User.findOne({ email });

        if (userNameSearch && emailSearch) {
          res.send("3");
        } else if (userNameSearch) {
          res.send("4");
        } else if (emailSearch) {
          res.send("5");
        } else {
          await user.save();
          res.send("6");
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

        const userNameSearch = await User.findOne({ userName: userName });
        // const passwordMatch = userNameSearch ? userNameSearch.password : "";
        const passwordMatch=userNameSearch ?(await bcrypt.compare(password,userNameSearch.password)):false

        if (!userNameSearch) {
          res.send("1");
        } else if (!passwordMatch) {
          res.send("2");
        } else if (passwordMatch) {
          res.send("7");
        }
      } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while saving data.");
      }
    });

    app.post("/retrieveOne", async (req, res) => {
      const userId = req.body.friendId;//euta user ko whole data tanne
      const userData = await User.findById(userId);
      res.send(userData);
    });

    app.get("/friends", async (req, res) => {
      let userId = req.body._id;
      let user = await User.findById(userId);
      res.send(user.friends);//friendlist pathaune euta user ko
    });

    app.post("/find", async (req, res) => {//login pachi userdata tanne
      const userName = req.body.userName;
      const userData = await User.findOne({ userName: userName });
      res.send(userData);
    });


    // user profile display
    app.get("/profile/:slug", async (req, res) => {
      try {
        const userName = req.params.slug;

        const user = await User.findOne({ userName: userName });
        if (user) {
          res.send(user);
        } else { 
          res.status(404).send("User not found");
        }
      } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while retrieving data.");
      }
    });


    //check
    app.post("/addPendingFriend", async (req, res) => {
      try {
        const userName = req.body.userName;
        const friendName = req.body.friendName;

        const user = await User.findOneAndUpdate(
          { userName: userName },
          { $push: { friendPendingList: friendName } }, 
          { new: true, useFindAndModify: false }
        );

        if (user) {
          res.send("Friend added successfully!");
        } else {
          res.status(404).send("User not found");
        }
      } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while saving data.");
      }
    });

    //testing -> modify
    app.post("/addFriend", async (req, res) => {//testing purpose
      const { userId, friendId } = req.body;

      if (!userId || !friendId) {
        return res
          .status(400)
          .send("Both userName and friendName are required");
      }

      try {
        await User.updateOne(
          { _id: userId },
          {
            $addToSet: { friends: { friendId: friendId, status: "friend" } },
          }
        );

        res.send("Success");
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.post('/changePassword',async (req,res)=>{
      const id=req.body._id
      const password=req.body.password
      const saltRounds=10
      const newPassword=await bcrypt.hash(password,saltRounds)
      try {
        await User.updateOne(
          { _id: id },
          {
            $set: { password: newPassword },
          }
        );

        res.send("Success");
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    })

    app.listen(5000, () => {
      console.log("Server Connected");
    });
  })
  .catch((err) => console.log(err));

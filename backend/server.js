const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/user");
const Message = require("./models/message");
const bodyParser = require("body-parser");

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
      const id = req.body._id;//jo login cha tesle pako ra pathako msg matra tanne
      try {
        const msg = await Message.find({
          $or: [{ senderId: id }, { receiverId: id }],
        });
        res.send(msg);
      } catch (error) {
        console.log(error);
      }
    });

    app.post("/message", async (req, res) => {
      const newUserData = new Message(req.body);
      await newUserData.save();
      res.json(newUserData);
    });

    app.post("/register", async (req, res) => {
      try {
        const user = new User(req.body);

        //validation logic
        const userName = req.body.userName;
        const email = req.body.email;

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
        const passwordMatch = userNameSearch ? userNameSearch.password : "";

        if (!userNameSearch) {
          res.send("1");
        } else if (password != passwordMatch) {
          res.send("2");
        } else if (password === passwordMatch) {
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

    app.listen(5000, () => {
      console.log("Server Connected");
    });
  })
  .catch((err) => console.log(err));

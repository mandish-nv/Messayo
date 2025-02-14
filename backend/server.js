const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/user");
const Message = require("./models/message");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();
const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");

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

          if (msg.msgType === "text") {
            try {
              const [ivHex, encryptedMessage] = msg.message.split(":");
              const iv = Buffer.from(ivHex, "hex");
              const decipher = crypto.createDecipheriv(algorithm, key, iv);

              let decryptedMessage = decipher.update(
                encryptedMessage,
                "hex",
                "utf8"
              );
              decryptedMessage += decipher.final("utf8");

              messageObj.message = decryptedMessage;
            } catch (error) {
              console.error(
                `Error decrypting message with ID ${msg._id}:`,
                error
              );
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

        if (msgType === "photo") {
          const newUserData = new Message(req.body);
          await newUserData.save();
          return res.json(newUserData);
        } else {
          const cipher = crypto.createCipheriv(algorithm, key, iv);
          let encryptedMessage = cipher.update(message, "utf8", "hex");
          encryptedMessage += cipher.final("hex");

          const encryptedData = `${iv.toString("hex")}:${encryptedMessage}`;

          const newUserData = new Message({
            senderId,
            receiverId,
            message: encryptedData,
            status,
            msgType,
          });

          await newUserData.save();
          try {
            const [ivHex, encryptedMessage] = newUserData.message.split(":");
            const iv = Buffer.from(ivHex, "hex");
            const decipher = crypto.createDecipheriv(algorithm, key, iv);

            let decryptedMessage = decipher.update(
              encryptedMessage,
              "hex",
              "utf8"
            );
            decryptedMessage += decipher.final("utf8");

            newUserData.message = decryptedMessage;
          } catch (error) {
            console.error(
              `Error decrypting message with ID ${msg._id}:`,
              error
            );
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
        const saltRounds = 10;

        // const user = new User(req.body);

        //validation logic
        const fullName = req.body.fullName;
        const userName = req.body.userName;
        const gender = req.body.gender;
        const dob = req.body.dob;
        const email = req.body.email;
        const password = await bcrypt.hash(req.body.password, saltRounds);
        const profilePicture = req.body.profilePicture;
        const user = new User({
          fullName: fullName,
          userName: userName,
          gender: gender,
          dob: dob,
          email: email,
          password: password,
          profilePicture: profilePicture,
        });

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
        const passwordMatch = userNameSearch
          ? await bcrypt.compare(password, userNameSearch.password)
          : false;

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

    app.get("/searchUsers", async (req, res) => {
      try {
        const query = req.query.query;
        const selfId = req.query.selfId;
    
        if (!query || !selfId) {
          return res.status(400).json({ message: "Search query and selfId are required" });
        }
    
        // Fetch the logged-in user to get the friends list
        const currentUser = await User.findById(selfId).select("friends");
    
        if (!currentUser) {
          return res.status(404).json({ message: "User not found" });
        }
    
        // Search users based on fullName and ensure the user is in the friends list
        const users = await User.find({
          fullName: { $regex: query, $options: "i" }, // Case-insensitive search
          _id: { $in: currentUser.friends }, // Only users in the friends list
        }).select("_id userName fullName profilePicture");
    
        res.status(200).json(users);
      } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ message: "Server error", error });
      }
    });
    

    app.post("/acceptFriendRequest", async (req, res) => {
      try {
        const { selfId, friendId } = req.body;

        if (!selfId || !friendId) {
          return res
            .status(400)
            .json({ message: "Both selfId and friendId are required" });
        }

        if (selfId === friendId) {
          return res
            .status(400)
            .json({
              message: "You cannot accept a friend request from yourself",
            });
        }

        // Fetch both users
        const recipient = await User.findById(selfId); // The one accepting the request
        const sender = await User.findById(friendId); // The one who sent the request

        if (!recipient || !sender) {
          return res.status(404).json({ message: "User not found" });
        }

        // Check if they are already friends
        if (recipient.friends.includes(friendId)) {
          return res.status(400).json({ message: "You are already friends" });
        }

        // Ensure the friend request exists
        if (!recipient.receivedRequests.includes(friendId)) {
          return res
            .status(400)
            .json({ message: "No pending friend request found" });
        }

        // Remove friend request from recipient's receivedRequests
        await User.findByIdAndUpdate(selfId, {
          $pull: { receivedRequests: friendId },
          $push: { friends: friendId },
        });

        // Remove friend request from sender's pendingRequests
        await User.findByIdAndUpdate(friendId, {
          $pull: { pendingRequests: selfId },
          $push: { friends: selfId },
        });

        res
          .status(200)
          .json({ message: "Friend request accepted successfully" });
      } catch (error) {
        console.error("Error accepting friend request:", error);
        res
          .status(500)
          .json({ message: "Error accepting friend request", error });
      }
    });

    app.post("/rejectFriendRequest", async (req, res) => {
      try {
        const { selfId, friendId } = req.body;

        if (!selfId || !friendId) {
          return res
            .status(400)
            .json({ message: "Both selfId and friendId are required" });
        }

        if (selfId === friendId) {
          return res
            .status(400)
            .json({
              message: "You cannot reject a friend request from yourself",
            });
        }

        // Fetch both users
        const recipient = await User.findById(selfId); // The one rejecting the request
        const sender = await User.findById(friendId); // The one who sent the request

        if (!recipient || !sender) {
          return res.status(404).json({ message: "User not found" });
        }

        // Ensure the friend request exists before rejecting
        if (!recipient.receivedRequests.includes(friendId)) {
          return res
            .status(400)
            .json({ message: "No pending friend request found" });
        }

        // Remove friend request from recipient's receivedRequests
        await User.findByIdAndUpdate(selfId, {
          $pull: { receivedRequests: friendId },
        });

        // Remove friend request from sender's pendingRequests
        await User.findByIdAndUpdate(friendId, {
          $pull: { pendingRequests: selfId },
        });

        res
          .status(200)
          .json({ message: "Friend request rejected successfully" });
      } catch (error) {
        console.error("Error rejecting friend request:", error);
        res
          .status(500)
          .json({ message: "Error rejecting friend request", error });
      }
    });

    app.post("/getPendingRequests", async (req, res) => {
      try {
        const { selfId } = req.body; // Get selfId from request body
        const currentUser = await User.findById(selfId);
        const users = await User.find({
          _id: { $in: currentUser.receivedRequests },
        });
        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({ message: "Error retrieving users", error });
      }
    });

    app.post("/addFriendUsers", async (req, res) => {
      try {
        const { selfId } = req.body; // Get selfId from request body
        const currentUser = await User.findById(selfId);
        const users = await User.find({
          _id: {
            $nin: [
              selfId,
              ...currentUser.friends,
              ...currentUser.pendingRequests,
              ...currentUser.receivedRequests,
            ],
          }, // Exclude self and friends
        });
        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({ message: "Error retrieving users", error });
      }
    });

    app.get("/friends", async (req, res) => {
      let userId = req.body._id;
      let user = await User.findById(userId);
      res.send(user.friends); //friendlist pathaune euta user ko
    });

    app.post("/find", async (req, res) => {
      //login pachi userdata tanne
      const userName = req.body.userName;
      const userData = await User.findOne({ userName: userName });
      res.send(userData);
    });

    // user profile display
    app.get("/profile/:id", async (req, res) => {
      try {
        const userId = req.params.id; // Use `id` instead of `slug`

        // Validate MongoDB ObjectId (to prevent errors)
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ message: "Invalid user ID format" });
        }

        const user = await User.findById(userId); // Use `findById` for efficiency

        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({ message: "User not found" });
        }
      } catch (error) {
        console.error("Error retrieving user profile:", error);
        res
          .status(500)
          .json({ message: "An error occurred while retrieving data." });
      }
    });

    app.post("/retrieveFriendsInfo", async (req, res) => {
      try {
        const { friendsList } = req.body;

        if (!friendsList || !Array.isArray(friendsList)) {
          return res
            .status(400)
            .json({ message: "Invalid friends list format" });
        }

        const friendsInfo = await User.find({ _id: { $in: friendsList } });

        res.status(200).json(friendsInfo);
      } catch (error) {
        console.error("Error retrieving friends info:", error);
        res
          .status(500)
          .json({ message: "Error retrieving friends info", error });
      }
    });

    app.post("/sendFriendRequest", async (req, res) => {
      try {
        const { selfId, friendId } = req.body;

        if (!selfId || !friendId) {
          return res
            .status(400)
            .json({ message: "Both selfId and friendId are required" });
        }

        if (selfId === friendId) {
          return res
            .status(400)
            .json({ message: "You cannot send a friend request to yourself" });
        }

        // Fetch both users
        const sender = await User.findById(selfId);
        const recipient = await User.findById(friendId);

        if (!sender || !recipient) {
          return res.status(404).json({ message: "User not found" });
        }

        // Check if already friends or request exists
        if (
          sender.friends.includes(friendId) ||
          sender.pendingRequests.includes(friendId)
        ) {
          return res.status(400).json({
            message: "Friend request already sent or you are already friends",
          });
        }

        // Add to sender's pending requests
        sender.pendingRequests.push(friendId);
        await sender.save();

        // Add to recipient's received requests (optional)
        recipient.receivedRequests.push(selfId);
        await recipient.save();

        res.status(200).json({ message: "Friend request sent successfully" });
      } catch (error) {
        res
          .status(500)
          .json({ message: "Error sending friend request", error });
      }
    });

    app.post("/removeFriend", async (req, res) => {
      try {
        const { selfId, friendId } = req.body;

        if (!selfId || !friendId) {
          return res
            .status(400)
            .json({ message: "Both selfId and friendId are required" });
        }

        // Fetch both users
        const sender = await User.findById(selfId);
        const recipient = await User.findById(friendId);

        if (!sender || !recipient) {
          return res.status(404).json({ message: "User not found" });
        }

        //remove friends
        sender.friends = sender.friends.filter(
          (reqId) => reqId.toString() !== friendId
        );

        recipient.friends = recipient.friends.filter(
          (reqId) => reqId.toString() !== selfId
        );

        // Save changes
        await sender.save();
        await recipient.save();

        res.status(200).json({ message: "Friend removed successfully" });
      } catch (error) {
        res
          .status(500)
          .json({ message: "Error sending friend request", error });
      }
    });

    app.post("/changePassword", async (req, res) => {
      const id = req.body._id;
      const password = req.body.password;
      const saltRounds = 10;
      const newPassword = await bcrypt.hash(password, saltRounds);
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
    });

    app.listen(5000, () => {
      console.log("Server Connected");
    });
  })
  .catch((err) => console.log(err));

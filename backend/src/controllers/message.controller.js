import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSideBar = async (req, res) => {
    try {
        const loggedInUserID = req.user._id;
        console.log(loggedInUserID);
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserID } }).select("-passWord")
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("Message Controller Error!");
        res.status(500).json({
            message: "Internal Error"
        })
    }
}

//have to check this endpoint!
export const getMessages = async (req, res) => {
    try {
        const { id: userToChat } = req.params
        const senderId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: userToChat }
                , {
                    senderId: userToChat, receiverId: senderId
                }
            ]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log('Message Controller Error');
        res.status(500).json({
            message: "Internal Server Error!"
        })
    }
}
//have to check this endpoint!
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body
        const { id: receiverId } = req.params
        const senderId = req.user._id
        let imageURL;
        if (image) {
            const uploadResponse = await cloudinary.uploader(image)
            imageURL = uploadResponse(secure_url)
        }
        const newMessage = new Message({
            senderId, receiverId, text, image: imageURL
        })
        await newMessage.save()
        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error Mesage Controller!");
        res.status(500).json({
            message: "Internal Error!"
        })
    }
}
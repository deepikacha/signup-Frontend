const Message = require('../models/messages');
const User = require('../models/user');

const { Op } = require('sequelize');

exports.getMessages = async (req, res) => {
  const since = req.query.since || 0;
  try {
    const messages = await Message.findAll({
      where: {
        timestamp: {
          [Op.gt]: since
        }
      },
      order: [['timestamp', 'ASC']],
      limit: 10 // Limit the result to latest 10 messages
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};





exports.message = async (req, res) => {
  const { message, username } = req.body; 
  const userId = req.user.id;

  if (!message || !username) {
    return res.status(400).json({ message: "Message and username cannot be empty" });
  }

  try {
    const userInDb = await User.findOne({ where: { id: userId } });
    if (userInDb) {
      const newMessage = await Message.create({ userId, username, message });
      res.status(201).json({ message: "Message stored successfully", newMessage });
    } else {
      console.error('User not found in the database');
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

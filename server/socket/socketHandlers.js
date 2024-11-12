const User = require('../db/userModel');
const Message = require('../db/messageModel');

const socketHandlers = (io) => {
  io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle user joining a chat room
    socket.on('joinRoom', async ({ username }) => {
      const user = await User.findOne({ username });
      if (user) {
        user.status = 'online';
        user.socketId = socket.id;
        await user.save();

        // Join a room with user's ID (or any unique room identifier)
        socket.join(user._id.toString());
        socket.emit('joinConfirmation', { message: `Welcome ${username}` });
      } else {
        socket.emit('error', { message: 'User not found' });
      }
    });

    // Handle sending messages
    socket.on('sendMessage', async (messageData) => {
      const { senderId, receiverId, message } = messageData;

      // Save message in the database
      const newMessage = await Message.create({
        senderId,
        receiverId,
        message,
        timestamp: new Date(),
        status: 'sent'
      });

      // Emit to the specific room or individual user
      io.to(receiverId).emit('receiveMessage', newMessage);
    });

    // Handle disconnect event
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.id}`);
      const user = await User.findOne({ socketId: socket.id });
      if (user) {
        user.status = 'offline';
        user.socketId = null;
        await user.save();
      }
    });
  });
};

module.exports = socketHandlers;

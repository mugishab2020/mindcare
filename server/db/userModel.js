const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: false,
    },
    status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline',
  },
  socketId: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model('User', userSchema);

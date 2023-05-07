const mongoose = require("mongoose");
const ThreadSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },

    time: {
        type: String,
        required: true
    },

    user: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model("Thread", ThreadSchema);
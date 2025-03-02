const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Poster = new Schema({
    image: {
        type: [String],
        required: true
    }
})

module.exports = mongoose.model('Poster', Poster);
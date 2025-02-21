const mongoose = require('mongoose')

const Product = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Product', Product)
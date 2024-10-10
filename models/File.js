const mongoose = require('mongoose');
const { Schema } = mongoose;

const fileSchema = new Schema({
    name: String,
    type: String,
    size: Number,
})

const File = mongoose.model('File', fileSchema);

module.exports = File;
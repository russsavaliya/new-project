const mongoose = require('mongoose');
const Tag = new mongoose.Schema({
  tag_name: {
    type: String,
    required:true,
    unique:true,
    trim:true
  }
});
module.exports = mongoose.model('Tag', Tag);
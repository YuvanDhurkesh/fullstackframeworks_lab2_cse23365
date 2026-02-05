const mongoose = require('mongoose');

const HelperSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true }, // Path or URL to image
  tools: [{ type: String, required: true }], // Array of 3 tools
  description: { type: String, required: true }, // 1-sentence social story
  video: { type: String, required: false }, // YouTube video link
});

module.exports = mongoose.model('Helper', HelperSchema);
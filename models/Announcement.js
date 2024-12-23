const mongoose =require( 'mongoose');

const announcementSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Announcement content is required'],
    trim: true
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports= Announcement;


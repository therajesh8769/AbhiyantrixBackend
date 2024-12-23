const mongoose =require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true
  },
  date: { 
    type: String, 
    //required: [true, 'Date is required'],
    trim: true
  },
  time: { 
    type: String, 
    //required: [true, 'Time is required'],
    trim: true
  },
  status: { 
    type: String, 
    required: [true, 'Status is required'],
    enum: {
      values: ['scheduled', 'delayed', 'cancelled'],
      message: '{VALUE} is not a valid status'
    }
  },
  description: { 
    type: String, 
    required: [true, 'Description is required'],
    trim: true
  },
  iconType: { 
    type: String, 
    required: [true, 'Icon type is required'],
    enum: {
      values: ['Laptop', 'Bot', 'Rocket', 'Plane'],
      message: '{VALUE} is not a valid icon type'
    }
  },
  imageName: { 
    type: String, 
    required: false,
    trim: true
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;


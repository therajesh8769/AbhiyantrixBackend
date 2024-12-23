const { Schema } = require("mongoose");

// Sub-schema for member details
const memberSchema = new Schema({
    name: { type: String, required: true,},
    department: { type: String, required: true },
    year: { type: Number, required: true },
});

// Main schema
const userSchema = new Schema({
    TeamName: {
        type: String,
        required: true,
    },
    members: {
        type: [memberSchema], // Array of member objects
        validate: {
            validator: (v) => v.length >= 1 && v.length <= 4, // Validate team size (1-4 members)
            message: "Team must have between 1 and 4 members.",
        },
    },
    college: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique:true ,
    },
    mobile: {
        type: Number,
        required: true,
        unique:true ,
    },
});

module.exports = { userSchema };

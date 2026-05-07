const mongoose = require("mongoose");
const { type } = require("os");


const RoleSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      required: true,
      trim: true,
    },
    requiredExperience: {
      type: String,
      required: true,
    },
    clientId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    }],
    location: {
      type: String,
      required: true,
    },
    startDate:{
      type:Date,
    },
     endDate:{
      type:Date,
    },
     status:{
      type:String,
    },
    techStack: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", RoleSchema);
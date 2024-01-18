import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, validate: {
    validator: function (value) {
      // Custom password validation function
      return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])(?=.*[a-zA-Z]).{8,}$/.test(value);
    },
    message: (props) =>
      `${props.value} is not a valid password. It must have at least 8 characters, including 1 uppercase letter, 1 lowercase letter, and 1 special character.`,
  },},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true},
  role :{
    type: String,
    enum: ["staff", "admin"],
    default: "staff",
    required: true,
},
},
{ timestamps: true },);

const StaffModel = mongoose.model('Staff', staffSchema);

export default StaffModel;
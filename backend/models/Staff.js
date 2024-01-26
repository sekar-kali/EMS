import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    validate: {
      validator: function (value) {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])(?=.*[a-zA-Z]).{8,}$/.test(value);
      },
      message: (props) =>
        `${props.value} is not a valid password. It must have at least 8 characters, including 1 uppercase letter, 1 lowercase letter, and 1 special character.`,
    },
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  serviceName: { type: String, default: "IT", required: true },
  address: { type: String},
  role: {
    type: String,
    enum: ["staff", "admin"],
    default: "staff",
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mission',
  },
  leaveRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LeaveRequest',
  }],
}, { timestamps: true });

const StaffModel = mongoose.model('Staff', staffSchema);

export default StaffModel;

import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const StaffModel = mongoose.model('Staff', staffSchema);

export default StaffModel;
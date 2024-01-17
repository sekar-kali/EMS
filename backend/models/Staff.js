import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true}
});

const StaffModel = mongoose.model('Staff', staffSchema);

export default StaffModel;
import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema({
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  description: { type: String, required: true },
  documentUrl: { type: String },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
},{ timestamps: true });

const LeaveRequestModel = mongoose.model('LeaveRequest', leaveRequestSchema);

export default LeaveRequestModel;

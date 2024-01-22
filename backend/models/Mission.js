import mongoose from "mongoose";

const missionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
},{ timestamps: true });

const MissionModel = mongoose.model('Mission', missionSchema);

export default MissionModel;
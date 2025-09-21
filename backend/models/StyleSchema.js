// models/Style.js
import mongoose from 'mongoose';

const StepSchema = new mongoose.Schema({
  label: { type: String, required: true },   // e.g. "Step 1"
  enabled: { type: Boolean, default: false } // checkbox state
}, { _id: false });

const StyleSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  steps: { type: [StepSchema], default: [] }, // array of StepSchema
  createdAt: { type: Date, default: Date.now }
});

export const Style = mongoose.model('Style', StyleSchema);

import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  clubName: {
    type: String,
    required: true,
  },
  clubCode: {
    type: String,
    required: true,
  },
  eventDate: {
    type: String,
    required: true,
  },
  eventVenue: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  objectives: {
    type: String,
    required: true,
  },
  targetAudience: {
    type: String,
    required: true,
  },
  expectedParticipants: {
    type: Number,
    required: true,
  },
  financialDetails: {
    type: Object,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending_faculty', 'pending_dean_swo', 'pending_dean_sw', 'completed', 'rejected'],
    default: 'pending_faculty',
  },
  feedback: {
    type: String,
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  pdfVersions: {
    base: { type: String }, // Path to base PDF
    facultySigned: { type: String }, // Path after faculty signed
    deanSWOSigned: { type: String }, // Path after Dean SWO signed
    final: { type: String }, // Path to final signed PDF
  },
  signatures: {
    student: { type: String }, // Path to student signature image
    faculty: { type: String }, // Path to faculty signature image
    deanSWO: { type: String }, // Path to Dean SWO signature image
    deanSW: { type: String }, // Path to Dean SW signature image
  },
  signedAt: {
    faculty: { type: Date },
    deanSWO: { type: Date },
    deanSW: { type: Date },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Document || mongoose.model('Document', DocumentSchema);
import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  documentNumber: {
    type: String,
    required: true,
  },
  documentDate: {
    type: Date,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
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
  eventCategory: {
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
    type: String,
    required: true,
  },
  judges: {
    type: String,
    required: false,
  },
  
  // Student Head info
  studentHead: {
    name: { type: String, required: true },
    rollNo: { type: String, required: true },
    branch: { type: String, required: true },
    mobile: { type: String, required: true },
  },
  
  // Student Secretary info
  studentSecretary: {
    name: { type: String },
    rollNo: { type: String },
    branch: { type: String },
    mobile: { type: String },
  },
  
  // Faculty info
  facultyCoChairman1: {
    name: { type: String },
    designation: { type: String },
    department: { type: String },
    mobile: { type: String },
  },
  
  facultyCoChairman2: {
    name: { type: String },
    designation: { type: String },
    department: { type: String },
    mobile: { type: String },
  },
  
  facultyChairman: {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    department: { type: String, required: true },
    mobile: { type: String, required: true },
  },
  
  // Financial details
  financialProposal: [{
    item: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 }
  }],
  
  // Document metadata
  status: {
    type: String,
    enum: [
      'pending_student_signature',
      'pending_faculty',
      'pending_dean_swo',
      'pending_dean_sw',
      'completed',
      'rejected'
    ],
    default: 'pending_student_signature',
  },
  feedback: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  pdfVersions: {
    base: { type: String }, // Path to base PDF
    studentSigned: { type: String }, // Path after student signed
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
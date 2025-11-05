import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: [true, "Student name is required"],
        trim: true,
    },
    studentEmail: {
        type: String,
        required: [true, "Student email is required"],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    tag: {
        type: String,
        required: [true, "Complaint tag is required"],
        enum: {
            values: ["Hostel", "Campus", "Academics", "Miscellaneous"],
            message: "{VALUE} is not a valid tag",
        },
    },
    subject: {
        type: String,
        required: [true, "Complaint subject is required"],
        trim: true,
        minlength: [5, "Subject must be at least 5 characters long"],
        maxlength: [100, "Subject must not exceed 100 characters"],
    },
    description: {
        type: String,
        required: [true, "Complaint description is required"],
        minlength: [10, "Description must be at least 10 characters long"],
    },
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "In Progress", "Resolved", "Rejected"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Complaint ||
    mongoose.model("Complaint", ComplaintSchema);

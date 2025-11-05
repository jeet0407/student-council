import mongoose from "mongoose";

const ClubSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        logo: {
            type: String,
            required: true,
        },
        chairperson: {
            type: String,
            required: true,
        },
        coChairperson: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        allottedBudget: {
            type: Number,
            required: true,
            default: 0,
        },
        sponsorshipBudget: {
            type: Number,
            required: true,
            default: 0,
        },
        currentBudget: {
            type: Number,
            required: true,
            default: 0,
        },
        budgetHistory: [
            {
                date: {
                    type: String,
                    required: true,
                },
                description: {
                    type: String,
                    required: true,
                },
                amount: {
                    type: Number,
                    required: true,
                },
                balance: {
                    type: Number,
                    required: true,
                },
            },
        ],
        upcomingEvents: [
            {
                name: {
                    type: String,
                    required: true,
                },
                date: {
                    type: String,
                    required: true,
                },
            },
        ],
        pastEvents: [
            {
                name: {
                    type: String,
                    required: true,
                },
                date: {
                    type: String,
                    required: true,
                },
            },
        ],
        coreCommittee: [
            {
                name: {
                    type: String,
                    required: true,
                },
                role: {
                    type: String,
                    required: true,
                },
                email: {
                    type: String,
                    required: true,
                },
                avatar: {
                    type: String,
                    default: "",
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Club || mongoose.model("Club", ClubSchema);

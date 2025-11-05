import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Complaint from "@/models/Complaint";

// POST handler - Create a new complaint
export async function POST(request) {
    try {
        await dbConnect();

        const body = await request.json();
        const { studentName, studentEmail, tag, subject, description } = body;

        // Validate required fields
        if (!studentName || !studentEmail || !tag || !subject || !description) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Validate subject length
        if (subject.trim().length < 5) {
            return NextResponse.json(
                {
                    error: "Subject must be at least 5 characters long",
                },
                { status: 400 }
            );
        }

        if (subject.trim().length > 100) {
            return NextResponse.json(
                {
                    error: "Subject must not exceed 100 characters",
                },
                { status: 400 }
            );
        }

        // Validate description length
        if (description.trim().length < 10) {
            return NextResponse.json(
                {
                    error: "Description must be at least 10 characters long",
                },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(studentEmail)) {
            return NextResponse.json(
                { error: "Please provide a valid email address" },
                { status: 400 }
            );
        }

        // Validate tag
        const validTags = ["Hostel", "Campus", "Academics", "Miscellaneous"];
        if (!validTags.includes(tag)) {
            return NextResponse.json(
                { error: "Invalid complaint tag" },
                { status: 400 }
            );
        }

        // Create new complaint
        const complaint = await Complaint.create({
            studentName: studentName.trim(),
            studentEmail: studentEmail.trim().toLowerCase(),
            tag,
            subject: subject.trim(),
            description: description.trim(),
        });

        return NextResponse.json(
            {
                message: "Complaint submitted successfully",
                complaint,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating complaint:", error);
        
        // Handle Mongoose validation errors
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(
                (err) => err.message
            );
            return NextResponse.json(
                { error: messages.join(", ") },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to submit complaint. Please try again." },
            { status: 500 }
        );
    }
}

// GET handler - Fetch all complaints
export async function GET(request) {
    try {
        await dbConnect();

        // Fetch all complaints sorted by createdAt (latest first)
        const complaints = await Complaint.find({}).sort({ createdAt: -1 });

        return NextResponse.json(
            {
                complaints,
                count: complaints.length,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching complaints:", error);
        return NextResponse.json(
            { error: "Failed to fetch complaints" },
            { status: 500 }
        );
    }
}

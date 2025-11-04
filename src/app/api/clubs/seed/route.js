import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Club from "@/models/Club";

// POST handler - Seed database with initial club data
export async function POST(request) {
    try {
        await dbConnect();

        // Sample club data
        const clubData = {
            name: "CEV NIT Surat",
            logo: "/clubs/cev.png",
            chairperson: "Purv Kabaria",
            coChairperson: "Vanishka",
            email: "cev@nitsurat.ac.in",
            allottedBudget: 60000,
            sponsorshipBudget: 0,
            currentBudget: 50000,
            budgetHistory: [
                {
                    date: "2024-01-15",
                    description: "Initial Allocation",
                    amount: 60000,
                    balance: 60000,
                },
                {
                    date: "2024-02-20",
                    description: "StrategiX",
                    amount: -10000,
                    balance: 50000,
                },
            ],
            upcomingEvents: [
                { name: "Paradox", date: "2025-11-9" },
                { name: "FinFiesta", date: "2026-2-11" },
                { name: "Data Science Bootcamp", date: "2025-10-5" },
            ],
            pastEvents: [{ name: "StrategiX", date: "2025-07-30" }],
            coreCommittee: [
                {
                    name: "Purv Kabaria",
                    role: "Chairperson",
                    email: "purv.dev@gmail.com",
                    avatar: "/avatars/avatar1.png",
                },
                {
                    name: "Vanishka",
                    role: "Co-Chairperson",
                    email: "vanishka@gmail.com",
                    avatar: "/avatars/avatar2.png",
                },
                {
                    name: "Vasu Sadariya",
                    role: "Tresurer",
                    email: "sadariyavasu5@gmail.com",
                    avatar: "/avatars/avatar3.png",
                },
                {
                    name: "Avishkar Jha",
                    role: "Secretary",
                    email: "avishkar.jha@gmail.com",
                    avatar: "/avatars/avatar4.png",
                },
            ],
        };

        // Delete existing clubs (optional - for fresh seeding)
        await Club.deleteMany({});

        // Create the club
        const club = await Club.create(clubData);

        return NextResponse.json(
            {
                message: "Database seeded successfully",
                club,
                clubId: club._id,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error seeding database:", error);
        return NextResponse.json(
            { error: "Failed to seed database", details: error.message },
            { status: 500 }
        );
    }
}

// GET handler - Get all clubs
export async function GET(request) {
    try {
        await dbConnect();

        const clubs = await Club.find({});

        return NextResponse.json(
            { clubs, count: clubs.length },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching clubs:", error);
        return NextResponse.json(
            { error: "Failed to fetch clubs" },
            { status: 500 }
        );
    }
}

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Club from "@/models/Club";

// GET handler - Fetch club by ID
export async function GET(request, { params }) {
    try {
        await dbConnect();

        const { id } = await params;

        const club = await Club.findById(id);

        if (!club) {
            return NextResponse.json(
                { error: "Club not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(club, { status: 200 });
    } catch (error) {
        console.error("Error fetching club:", error);
        return NextResponse.json(
            { error: "Failed to fetch club data" },
            { status: 500 }
        );
    }
}

// PATCH handler - Update sponsorship and current budget (dean-sw only)
export async function PATCH(request, { params }) {
    try {
        await dbConnect();

        const { id } = await params;
        const role = request.headers.get("x-role");

        // Check authorization
        if (role !== "dean-sw") {
            return NextResponse.json(
                { error: "Unauthorized. Only dean-sw can update budgets." },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { sponsorshipBudget, currentBudget, coreCommittee } = body;

        // Validate input
        if (
            sponsorshipBudget === undefined &&
            currentBudget === undefined &&
            coreCommittee === undefined
        ) {
            return NextResponse.json(
                { error: "No data provided to update" },
                { status: 400 }
            );
        }

        // Get the current club data first
        const club = await Club.findById(id);

        if (!club) {
            return NextResponse.json(
                { error: "Club not found" },
                { status: 404 }
            );
        }

        // Prepare update data and budget history entries
        const updateData = {};
        const newBudgetEntries = [];
        const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

        // Handle Sponsorship Budget update
        if (sponsorshipBudget !== undefined && sponsorshipBudget !== club.sponsorshipBudget) {
            const difference = sponsorshipBudget - club.sponsorshipBudget;
            updateData.sponsorshipBudget = sponsorshipBudget;
            
            // Add to budget history
            newBudgetEntries.push({
                date: currentDate,
                description: difference > 0 
                    ? "Sponsorship Budget Added" 
                    : "Sponsorship Budget Adjusted",
                amount: difference,
                balance: club.currentBudget + difference
            });
            
            // Update current budget with the difference
            updateData.currentBudget = club.currentBudget + difference;
        }

        // Handle Current Budget update (direct adjustment)
        if (currentBudget !== undefined && currentBudget !== club.currentBudget) {
            const difference = currentBudget - club.currentBudget;
            const finalCurrentBudget = currentBudget;
            
            // If sponsorship was also updated, use the new balance from that
            if (newBudgetEntries.length > 0) {
                newBudgetEntries[0].balance = finalCurrentBudget;
                updateData.currentBudget = finalCurrentBudget;
            } else {
                // Only current budget was updated
                updateData.currentBudget = finalCurrentBudget;
                newBudgetEntries.push({
                    date: currentDate,
                    description: difference > 0 
                        ? "Budget Adjustment (Addition)" 
                        : "Budget Adjustment (Deduction)",
                    amount: difference,
                    balance: finalCurrentBudget
                });
            }
        }

        // Handle Core Committee update
        if (coreCommittee !== undefined) {
            updateData.coreCommittee = coreCommittee;
        }

        // Add new entries to budget history
        if (newBudgetEntries.length > 0) {
            updateData.$push = {
                budgetHistory: { $each: newBudgetEntries }
            };
        }

        // Update the club
        const updatedClub = await Club.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        return NextResponse.json(
            { message: "Club updated successfully", club: updatedClub },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating club:", error);
        return NextResponse.json(
            { error: "Failed to update club data" },
            { status: 500 }
        );
    }
}

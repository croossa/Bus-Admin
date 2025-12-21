import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    // Get "status" from URL (e.g., /api/bookings?status=CONFIRMED)
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");

    let query = {};
    
    // If a status is provided and it's not "ALL", add it to query
    if (statusFilter && statusFilter !== "ALL") {
        // Use regex for flexible matching (e.g. "Cancel" matches "Cancel - Payment Left")
        query = { status: { $regex: statusFilter, $options: "i" } };
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: bookings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
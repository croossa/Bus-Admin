import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function GET() {
  try {
    await connectDB();
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    // 1. Total Revenue (Only Confirmed Bookings)
    const revenueResult = await Booking.aggregate([
      { $match: { status: "CONFIRMED" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // 2. Weekly Bookings Count
    const weeklyBookings = await Booking.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // 3. Total Cancelled Tickets (Including pending refunds & fully refunded)
    const cancelledCount = await Booking.countDocuments({
      status: { $regex: /cancel|refund/i }
    });

    // 4. Chart Data (Last 7 Days Revenue)
    const chartData = await Booking.aggregate([
      { 
        $match: { 
          createdAt: { $gte: sevenDaysAgo },
          status: "CONFIRMED" // Only chart actual earnings
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } } // Sort by date ascending
    ]);

    // Format chart data for Recharts (fill missing days with 0 is complex, simple version here)
    const formattedChart = chartData.map(item => ({
        date: item._id,
        revenue: item.revenue
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue,
        weeklyBookings,
        cancelledCount,
        chartData: formattedChart
      }
    });

  } catch (error: any) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 });
  }
}   
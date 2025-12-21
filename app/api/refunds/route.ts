import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Razorpay from "razorpay";

export async function GET() {
  console.log("🔵 [API_DEBUG] GET /api/refunds: Started");
  try {
    console.log("🔵 [API_DEBUG] Connecting to DB...");
    await connectDB();
    console.log("🟢 [API_DEBUG] DB Connected.");
    
    console.log("🔵 [API_DEBUG] Querying MongoDB for 'Cancel - Payment Left'...");
    const bookings = await Booking.find({ status: "Cancel - Payment Left" }).sort({ createdAt: -1 });
    
    console.log(`🟢 [API_DEBUG] Found ${bookings.length} pending refunds.`);

    return NextResponse.json({ success: true, data: bookings });
  } catch (error: any) {
    console.error("🔴 [API_DEBUG] GET Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch data", details: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  console.log("🔵 [API_DEBUG] POST /api/refunds: Started");
  try {
    // 1. Check DB Connection
    console.log("🔵 [API_DEBUG] Connecting to DB...");
    await connectDB();
    console.log("🟢 [API_DEBUG] DB Connected.");

    // 2. Parse Body
    let body;
    try {
        body = await req.json();
        console.log("🔵 [API_DEBUG] Request Body Received:", body);
    } catch (e) {
        console.error("🔴 [API_DEBUG] Failed to parse JSON body");
        return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
    }

    const { bookingId, paymentId, amount } = body;

    // 3. Validate Inputs
    if (!bookingId || !paymentId || !amount) {
        console.error("🔴 [API_DEBUG] Missing fields:", { bookingId, paymentId, amount });
        return NextResponse.json({ success: false, error: "Missing required fields (bookingId, paymentId, or amount)" }, { status: 400 });
    }

    // 4. Validate Env Vars
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
        console.error("🔴 [API_DEBUG] Razorpay Keys Missing in .env.local");
        return NextResponse.json({ success: false, error: "Razorpay keys missing on server" }, { status: 500 });
    }

    // 5. Init Razorpay
    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // Razorpay expects amount in paise
    const refundAmount = Math.round(Number(amount) * 100);
    console.log(`🔵 [API_DEBUG] Initiating Refund: ID=${paymentId}, Amount (Paise)=${refundAmount}`);

    // A. Call Razorpay
    let refund;
    try {
        refund = await instance.payments.refund(paymentId, {
            amount: refundAmount,
            speed: "normal",
            notes: {
                reason: "Admin processed refund for cancelled ticket"
            }
        });
        console.log("🟢 [API_DEBUG] Razorpay Refund Success:", refund.id);
    } catch (razorpayError: any) {
        console.error("🔴 [API_DEBUG] Razorpay API Failed:", razorpayError);
        return NextResponse.json({ 
            success: false, 
            error: "Razorpay declined refund", 
            details: razorpayError.description || razorpayError.message 
        }, { status: 400 });
    }

    // B. Update MongoDB Status to "REFUNDED"
    console.log(`🔵 [API_DEBUG] Updating MongoDB status for ID: ${bookingId}...`);
    const updateResult = await Booking.findByIdAndUpdate(bookingId, {
        status: "REFUNDED"
    });

    if (!updateResult) {
        console.warn("🟠 [API_DEBUG] MongoDB update returned null (ID might be wrong), but refund succeeded.");
    } else {
        console.log("🟢 [API_DEBUG] MongoDB Updated Successfully.");
    }

    return NextResponse.json({ success: true, data: refund });

  } catch (error: any) {
    console.error("🔴 [API_DEBUG] Critical Server Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
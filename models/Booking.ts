import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  bookingRefNo: string;
  transportPNR: string;
  razorpayPaymentId: string;
  amount: number;
  status: string;
  createdAt: Date;
}

const BookingSchema: Schema = new Schema(
  {
    bookingRefNo: { type: String, required: true, unique: true },
    transportPNR: { type: String, required: true },
    razorpayPaymentId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: "CONFIRMED" },
  },
  { timestamps: true }
);

const Booking = mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
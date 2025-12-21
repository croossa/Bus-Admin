"use client";

import { useEffect, useState } from "react";
import { 
  Loader2, RefreshCcw, AlertCircle, CheckCircle, IndianRupee 
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function RefundManager() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // --- ALERT DIALOG STATE ---
  const [dialogConfig, setDialogConfig] = useState({
    isOpen: false,
    title: "",
    description: "",
    type: "confirm" as "confirm" | "success" | "error", // To style the dialog differently
    onConfirm: () => {}, // The action to run when "Continue" is clicked
  });

  const closeDialog = () => {
    setDialogConfig((prev) => ({ ...prev, isOpen: false }));
  };

  // --- 1. Fetch Data ---
  const fetchRefunds = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/refunds");
      const json = await res.json();
      if (json.success) {
        setBookings(json.data);
      } else {
        console.error("Failed to fetch:", json.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  // --- 2. Step A: Trigger Confirmation Dialog ---
  const initiateRefund = (booking: any) => {
    if (!booking.razorpayPaymentId) {
        setDialogConfig({
            isOpen: true,
            title: "Missing Payment ID",
            description: "This booking cannot be refunded because no Payment ID is attached.",
            type: "error",
            onConfirm: closeDialog
        });
        return;
    }

    // Open Confirmation Dialog
    setDialogConfig({
        isOpen: true,
        title: "Confirm Refund",
        description: `Are you sure you want to refund ₹${booking.amount} to Booking Ref: ${booking.bookingRefNo}? This action cannot be undone.`,
        type: "confirm",
        onConfirm: () => executeRefund(booking) // Pass the actual execution logic here
    });
  };

  // --- 3. Step B: Execute API Call ---
  const executeRefund = async (booking: any) => {
    setProcessingId(booking._id);
    closeDialog(); // Close the confirm modal

    try {
        const res = await fetch("/api/refunds", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                bookingId: booking._id,
                paymentId: booking.razorpayPaymentId,
                amount: booking.amount
            })
        });

        const result = await res.json();

        if (result.success) {
            // Show Success Dialog
            setDialogConfig({
                isOpen: true,
                title: "Refund Successful",
                description: `₹${booking.amount} has been processed successfully via Razorpay.`,
                type: "success",
                onConfirm: () => {
                    closeDialog();
                    fetchRefunds(); // Refresh data only after they click OK
                }
            });
        } else {
            // Show Error Dialog
            setDialogConfig({
                isOpen: true,
                title: "Refund Failed",
                description: result.error || "An unknown error occurred with the payment gateway.",
                type: "error",
                onConfirm: closeDialog
            });
        }
    } catch (e: any) {
        setDialogConfig({
            isOpen: true,
            title: "System Error",
            description: e.message || "Failed to connect to server.",
            type: "error",
            onConfirm: closeDialog
        });
    } finally {
        setProcessingId(null);
    }
  };

  // --- Helper: Status Badge Color ---
  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("refunded")) {
        return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold border border-green-200 flex items-center gap-1 w-fit"><CheckCircle size={12}/> Refunded</span>;
    }
    if (s.includes("cancel - payment left")) {
        return <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-bold border border-orange-200 flex items-center gap-1 w-fit"><AlertCircle size={12}/> Action Required</span>;
    }
    if (s.includes("cancel")) {
        return <span className="bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs font-bold border border-red-100 w-fit">Cancelled</span>;
    }
    return <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-bold border border-gray-200 w-fit">{status}</span>;
  };

  return (
    <div className="space-y-6">
        
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Refund Manager</h1>
            <p className="text-slate-500">Process refunds for cancelled tickets.</p>
        </div>
        <Button onClick={fetchRefunds} variant="outline" className="gap-2 bg-white border-slate-200 hover:bg-slate-50 text-slate-900">
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} /> Refresh List
        </Button>
      </div>

      {/* TABLE CARD */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle className="text-lg">Cancellation Requests</CardTitle>
                    <CardDescription>
                        Items marked <span className="text-orange-600 font-bold">Action Required</span> need a refund.
                    </CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-0">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                        <TableHead className="w-[100px]">Date</TableHead>
                        <TableHead>Booking Ref</TableHead>
                        <TableHead>Payment ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right pr-6">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading && bookings.length === 0 ? (
                         <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                <div className="flex justify-center items-center gap-2 text-slate-400">
                                    <Loader2 className="animate-spin" /> Loading data...
                                </div>
                            </TableCell>
                         </TableRow>
                    ) : bookings.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-32 text-center text-slate-400">
                                No cancelled bookings found requiring attention.
                            </TableCell>
                        </TableRow>
                    ) : (
                        bookings.map((booking) => (
                            <TableRow key={booking._id} className="group transition-colors hover:bg-slate-50/50">
                                <TableCell className="text-slate-500 text-xs font-medium">
                                    {new Date(booking.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="font-bold text-slate-900">
                                    {booking.bookingRefNo}
                                    <div className="text-xs font-normal text-slate-400">{booking.transportPNR}</div>
                                </TableCell>
                                <TableCell className="font-mono text-xs text-slate-500">
                                    {booking.razorpayPaymentId || "N/A"}
                                </TableCell>
                                <TableCell className="font-bold text-slate-900">
                                    ₹{booking.amount}
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(booking.status)}
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    {booking.status === "Cancel - Payment Left" ? (
                                        <Button 
                                            onClick={() => initiateRefund(booking)}
                                            disabled={processingId === booking._id}
                                            className="bg-black text-white hover:bg-slate-800 h-8 px-3 text-xs"
                                        >
                                            {processingId === booking._id ? (
                                                <Loader2 className="animate-spin w-3 h-3 mr-1" />
                                            ) : (
                                                <IndianRupee size={12} className="mr-1" />
                                            )}
                                            {processingId === booking._id ? "Processing..." : "Refund Now"}
                                        </Button>
                                    ) : (
                                        <span className="text-xs text-slate-400 font-medium italic">
                                            {booking.status === "REFUNDED" ? "Completed" : "No Action"}
                                        </span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>

      {/* --- SHADCN ALERT DIALOG --- */}
      <AlertDialog open={dialogConfig.isOpen} onOpenChange={closeDialog}>
        <AlertDialogContent className="bg-white rounded-xl">
            <AlertDialogHeader>
                <AlertDialogTitle className={`flex items-center gap-2 ${
                    dialogConfig.type === 'error' ? 'text-red-600' : 
                    dialogConfig.type === 'success' ? 'text-green-600' : 'text-slate-900'
                }`}>
                    {dialogConfig.type === 'error' && <AlertCircle size={20} />}
                    {dialogConfig.type === 'success' && <CheckCircle size={20} />}
                    {dialogConfig.title}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-slate-600">
                    {dialogConfig.description}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                {/* Only show Cancel button if it's a confirmation action */}
                {dialogConfig.type === 'confirm' && (
                    <AlertDialogCancel onClick={closeDialog} className="border-0 hover:bg-slate-100">
                        Cancel
                    </AlertDialogCancel>
                )}
                
                {/* The Main Action Button */}
                <AlertDialogAction 
                    onClick={(e) => {
                        e.preventDefault(); // Prevent auto-closing if async logic is needed
                        dialogConfig.onConfirm();
                    }}
                    className={`${
                        dialogConfig.type === 'error' ? 'bg-red-600 hover:bg-red-700' : 
                        dialogConfig.type === 'success' ? 'bg-green-600 hover:bg-green-700' : 
                        'bg-black hover:bg-slate-800'
                    } text-white`}
                >
                    {dialogConfig.type === 'confirm' ? 'Continue' : 'Okay'}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
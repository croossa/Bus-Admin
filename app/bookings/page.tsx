"use client";

import { useEffect, useState } from "react";
import { 
  Loader2, RefreshCcw, Filter, CheckCircle, XCircle, AlertCircle, Clock 
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AllBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("ALL");

  // Fetch Data with Filter
  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Pass filter to API
      const res = await fetch(`/api/bookings?status=${filter}`);
      const json = await res.json();
      if (json.success) {
        setBookings(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch when filter changes
  useEffect(() => {
    fetchBookings();
  }, [filter]);

  // Helper: Status Badge
  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("refunded")) return <span className="text-purple-600 bg-purple-50 px-2 py-1 rounded-full text-xs font-bold border border-purple-100 flex items-center w-fit gap-1"><CheckCircle size={12}/> Refunded</span>;
    if (s.includes("confirm")) return <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold border border-green-100 flex items-center w-fit gap-1"><CheckCircle size={12}/> Confirmed</span>;
    if (s.includes("cancel")) return <span className="text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-bold border border-red-100 flex items-center w-fit gap-1"><XCircle size={12}/> Cancelled</span>;
    return <span className="text-gray-600 bg-gray-50 px-2 py-1 rounded-full text-xs font-bold border border-gray-200 flex items-center w-fit gap-1"><Clock size={12}/> {status}</span>;
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER & FILTER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">All Bookings</h1>
            <p className="text-slate-500">View and manage all customer reservations.</p>
        </div>
        
        <div className="flex items-center gap-3">
            {/* STATUS FILTER DROPDOWN */}
            <div className="w-[180px]">
                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="bg-white">
                        <div className="flex items-center gap-2 text-slate-600">
                            <Filter size={16} />
                            <SelectValue placeholder="Filter Status" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Statuses</SelectItem>
                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                        <SelectItem value="CANCEL">Cancelled (All)</SelectItem>
                        <SelectItem value="REFUNDED">Refunded</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button onClick={fetchBookings} variant="outline" className="bg-white border-slate-200 hover:bg-slate-50">
                <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
            </Button>
        </div>
      </div>

      {/* DATA TABLE */}
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-0">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                        <TableHead>Date</TableHead>
                        <TableHead>Booking Ref</TableHead>
                        <TableHead>PNR</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                         <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-slate-400">
                                <Loader2 className="animate-spin inline mr-2" /> Loading...
                            </TableCell>
                         </TableRow>
                    ) : bookings.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-32 text-center text-slate-400">
                                No bookings found for this filter.
                            </TableCell>
                        </TableRow>
                    ) : (
                        bookings.map((booking) => (
                            <TableRow key={booking._id} className="hover:bg-slate-50/50">
                                <TableCell className="text-slate-500 text-xs font-medium">
                                    {new Date(booking.createdAt).toLocaleDateString()}
                                    <div className="text-[10px] opacity-70">{new Date(booking.createdAt).toLocaleTimeString()}</div>
                                </TableCell>
                                <TableCell className="font-bold text-slate-900">
                                    {booking.bookingRefNo}
                                </TableCell>
                                <TableCell className="font-mono text-xs text-slate-500">
                                    {booking.transportPNR}
                                </TableCell>
                                <TableCell className="font-bold text-slate-900">
                                    ₹{booking.amount}
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(booking.status)}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
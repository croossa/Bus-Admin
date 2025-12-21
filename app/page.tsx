"use client";

import { useEffect, useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  IndianRupee, 
  Ticket, 
  Ban, 
  TrendingUp, 
  Loader2,
  BarChart3 // <--- Imported the Icon version here
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardHome() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/analytics");
        const json = await res.json();
        if (json.success) {
          setStats(json.data);
        }
      } catch (e) {
        console.error("Failed to load stats", e);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-gray-400" /></div>;
  }

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Overview of your business performance</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Revenue */}
        <Card className="border-l-4 border-l-black shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wide">
              Total Revenue
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
               ₹{stats?.totalRevenue?.toLocaleString('en-IN') || 0}
            </div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp size={12} /> Lifetime earnings
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Weekly Bookings */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wide">
              Weekly Bookings
            </CardTitle>
            <Ticket className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats?.weeklyBookings || 0}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Last 7 Days
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Cancellations */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wide">
              Total Cancelled
            </CardTitle>
            <Ban className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats?.cancelledCount || 0}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Need attention? Check Refunds page.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CHART SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1 shadow-sm">
            <CardHeader>
                <CardTitle>Revenue Overview (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                {stats?.chartData && stats.chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis 
                                dataKey="date" 
                                tick={{fontSize: 12}} 
                                tickLine={false} 
                                axisLine={false}
                            />
                            <YAxis 
                                tick={{fontSize: 12}} 
                                tickLine={false} 
                                axisLine={false}
                                tickFormatter={(value) => `₹${value}`}
                            />
                            <Tooltip 
                                cursor={{fill: '#f4f4f5'}}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Bar 
                                dataKey="revenue" 
                                fill="#0f172a" 
                                radius={[4, 4, 0, 0]} 
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        {/* Using BarChart3 here to fix the error */}
                        <BarChart3 size={40} className="mb-2 opacity-20" />
                        <p>No booking data for this week</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
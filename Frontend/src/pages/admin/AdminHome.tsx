import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Stethoscope, Activity, AlertTriangle, TrendingUp } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useAuth } from "@/hooks/useAuth";

const AdminHome = () => {
  const { fetchWithAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchWithAuth("/api/admin/dashboard");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchWithAuth]);

  const stats = data ? [
    { label: "Total Doctors", value: data.stats.totalDoctors, icon: Stethoscope, color: "bg-primary/10 text-primary" },
    { label: "Total Patients", value: data.stats.totalPatients, icon: Users, color: "bg-secondary/30 text-secondary-foreground" },
    { label: "Interaction Checks", value: data.stats.totalChecks, icon: Activity, color: "bg-safe/10 text-safe" },
    { label: "High Risk Today", value: data.stats.highRiskToday, icon: AlertTriangle, color: "bg-avoid/10 text-avoid" },
  ] : [
    { label: "Total Doctors", value: "-", icon: Stethoscope, color: "bg-primary/10 text-primary" },
    { label: "Total Patients", value: "-", icon: Users, color: "bg-secondary/30 text-secondary-foreground" },
    { label: "Interaction Checks", value: "-", icon: Activity, color: "bg-safe/10 text-safe" },
    { label: "High Risk Today", value: "-", icon: AlertTriangle, color: "bg-avoid/10 text-avoid" },
  ];

  const pieData = data?.pieData || [];
  const lineData = data?.lineData || [];
  const recentActivity = data?.recentActivity || [];

  return (
    <DashboardLayout role="admin">
      <PageTransition>
        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="botanical-bg rounded-2xl p-8 border border-border">
          <h1 className="text-3xl font-heading font-bold">System Overview 🔒</h1>
          <p className="text-muted-foreground mt-1">Monitor platform health and activity</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="bg-card rounded-xl p-6 shadow-card border border-border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-3xl font-heading font-bold">{s.value}</p>
                    <TrendingUp size={14} className="text-safe" />
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon size={22} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl shadow-card border border-border p-6">
            <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
              <Activity size={18} className="text-primary" /> Daily Interaction Checks (30 days)
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(80, 15%, 85%)" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="checks" stroke="hsl(120, 75%, 23%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl shadow-card border border-border p-6">
            <h2 className="font-heading font-semibold text-lg mb-4">Result Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-card border border-border p-6">
          <h2 className="font-heading font-semibold text-lg mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <p className="text-sm">{a.text}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  </DashboardLayout>
  );
};

export default AdminHome;

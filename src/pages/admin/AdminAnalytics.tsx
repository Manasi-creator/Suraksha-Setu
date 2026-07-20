import { motion } from "framer-motion";
import { BarChart2, Activity, ShieldCheck, AlertTriangle, TrendingUp } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { analyticsLineData, analyticsPieData, topCombinations, doctorUsage, highRiskWeekly } from "@/data/mockData";

const stats = [
  { label: "Total Checks", value: "287", icon: Activity, color: "bg-primary/10 text-primary" },
  { label: "Safe Results", value: "167", icon: ShieldCheck, color: "bg-safe/10 text-safe" },
  { label: "Caution Results", value: "83", icon: TrendingUp, color: "bg-secondary/20 text-secondary-foreground" },
  { label: "Avoid Results", value: "37", icon: AlertTriangle, color: "bg-avoid/10 text-avoid" },
];

const AdminAnalytics = () => (
  <DashboardLayout role="admin">
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <BackButton to="/admin/home" />
          <h1 className="text-2xl font-heading font-bold flex items-center gap-2"><BarChart2 size={24} className="text-primary" /> Analytics</h1>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-card rounded-xl p-5 shadow-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-heading font-bold mt-1">{s.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}><s.icon size={18} /></div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl shadow-card border border-border p-6">
            <h2 className="font-heading font-semibold mb-4">Interaction Checks (30 days)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analyticsLineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(80, 15%, 85%)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="checks" stroke="hsl(120, 75%, 23%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl shadow-card border border-border p-6">
            <h2 className="font-heading font-semibold mb-4">Result Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={analyticsPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                  {analyticsPieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl shadow-card border border-border p-6">
            <h2 className="font-heading font-semibold mb-4">Top Drug-Herb Combinations</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topCombinations} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(80, 15%, 85%)" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="combo" width={140} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(120, 75%, 23%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl shadow-card border border-border p-6">
            <h2 className="font-heading font-semibold mb-4">Doctor-wise Usage</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={doctorUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(80, 15%, 85%)" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="checks" fill="hsl(45, 95%, 56%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl shadow-card border border-border p-6 lg:col-span-2">
            <h2 className="font-heading font-semibold mb-4">High-Risk Flags This Month</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={highRiskWeekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(80, 15%, 85%)" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="flags" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </PageTransition>
  </DashboardLayout>
);

export default AdminAnalytics;

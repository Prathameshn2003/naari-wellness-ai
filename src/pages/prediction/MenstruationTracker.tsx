import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, Calendar as CalendarIcon, Activity, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const MenstruationTracker = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const cycleData = [
    { day: "Day 1", mood: 3, energy: 2, flow: 4 },
    { day: "Day 3", mood: 4, energy: 3, flow: 5 },
    { day: "Day 5", mood: 5, energy: 4, flow: 3 },
    { day: "Day 7", mood: 6, energy: 5, flow: 1 },
    { day: "Day 10", mood: 7, energy: 7, flow: 0 },
    { day: "Day 14", mood: 8, energy: 8, flow: 0 },
    { day: "Day 21", mood: 6, energy: 6, flow: 0 },
    { day: "Day 28", mood: 4, energy: 4, flow: 0 },
  ];

  const symptomDistribution = [
    { name: "Cramps", value: 35, color: "#ec4899" },
    { name: "Mood Swings", value: 25, color: "#c084fc" },
    { name: "Fatigue", value: 20, color: "#a855f7" },
    { name: "Headaches", value: 12, color: "#14b8a6" },
    { name: "Other", value: 8, color: "#94a3b8" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="glass-card p-8 animate-fade-in">
          <div className="text-center space-y-4 mb-8">
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <CalendarIcon className="h-8 w-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold gradient-text">Menstrual Cycle Tracker</h1>
                <p className="text-muted-foreground">Track your cycle and symptoms</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Your Cycle Calendar</h2>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-lg border pointer-events-auto"
                />
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                  <span className="text-sm font-medium">Next Period</span>
                  <span className="text-sm font-bold text-primary">in 5 days</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                  <span className="text-sm font-medium">Cycle Length</span>
                  <span className="text-sm font-bold text-secondary">28 days</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                  <span className="text-sm font-medium">Fertile Window</span>
                  <span className="text-sm font-bold text-accent">Days 12-16</span>
                </div>
              </div>
            </Card>

            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Cycle Insights</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={cycleData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#64748b' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="mood" stroke="#ec4899" strokeWidth={2} dot={{ fill: '#ec4899' }} />
                    <Line type="monotone" dataKey="energy" stroke="#c084fc" strokeWidth={2} dot={{ fill: '#c084fc' }} />
                    <Line type="monotone" dataKey="flow" stroke="#14b8a6" strokeWidth={2} dot={{ fill: '#14b8a6' }} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span>Mood</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                    <span>Energy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-accent"></div>
                    <span>Flow</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Symptom Distribution</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={symptomDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {symptomDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                  {symptomDistribution.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                      <span>{item.name} ({item.value}%)</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <Card className="p-6 text-center hover-lift cursor-pointer group">
              <Activity className="h-10 w-10 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-1">Log Symptoms</h3>
              <p className="text-sm text-muted-foreground">Track daily symptoms</p>
            </Card>

            <Card className="p-6 text-center hover-lift cursor-pointer group">
              <TrendingUp className="h-10 w-10 mx-auto mb-3 text-secondary group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-1">View Trends</h3>
              <p className="text-sm text-muted-foreground">Analyze patterns</p>
            </Card>

            <Card className="p-6 text-center hover-lift cursor-pointer group">
              <CalendarIcon className="h-10 w-10 mx-auto mb-3 text-accent group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-1">Set Reminders</h3>
              <p className="text-sm text-muted-foreground">Never miss tracking</p>
            </Card>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default MenstruationTracker;

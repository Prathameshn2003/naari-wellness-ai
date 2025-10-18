import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Heart,
  Stethoscope,
  BookOpen,
  MessageCircle,
  TrendingUp,
  Calendar,
  Award,
  Sparkles,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const predictionCards = [
    {
      title: "PCOS Prediction",
      description: "AI-powered risk assessment for PCOS",
      icon: Activity,
      color: "from-pink-500 to-rose-500",
      route: "/prediction/pcos",
    },
    {
      title: "Menstruation Tracker",
      description: "Track your menstrual cycle and symptoms",
      icon: Calendar,
      color: "from-purple-500 to-pink-500",
      route: "/prediction/menstruation",
    },
    {
      title: "Menopause Prediction",
      description: "Understand menopause transition stages",
      icon: TrendingUp,
      color: "from-violet-500 to-purple-500",
      route: "/prediction/menopause",
    },
  ];

  const resourceCards = [
    {
      title: "Find Gynecologists",
      description: "Locate nearby healthcare providers",
      icon: Stethoscope,
      route: "/gynecologists",
    },
    {
      title: "Health Resources",
      description: "Articles, videos, and health tips",
      icon: BookOpen,
      route: "/resources",
    },
    {
      title: "Government Schemes",
      description: "Access welfare and health programs",
      icon: Award,
      route: "/schemes",
    },
    {
      title: "AI Health Assistant",
      description: "Chat with our AI health advisor",
      icon: MessageCircle,
      route: "/chat",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-2 animate-fade-in">
          <h2 className="text-4xl font-bold gradient-text">Welcome to Your Health Dashboard</h2>
          <p className="text-lg text-muted-foreground">Your personalized health insights and resources</p>
        </div>

        {/* Health Predictions Section */}
        <section className="space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-semibold">Health Predictions</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {predictionCards.map((card, index) => (
              <Card
                key={index}
                className="glass-card p-6 hover-lift cursor-pointer group"
                onClick={() => navigate(card.route)}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-2">{card.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">{card.description}</p>
                <Button className="w-full gradient-primary">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Start Assessment
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Resources Section */}
        <section className="space-y-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-accent" />
            <h3 className="text-2xl font-semibold">Health Resources & Support</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {resourceCards.map((card, index) => (
              <Card
                key={index}
                className="glass-card p-6 hover-lift cursor-pointer group"
                onClick={() => navigate(card.route)}
              >
                <card.icon className="h-10 w-10 text-primary mb-4 group-hover:text-secondary transition-colors" />
                <h4 className="text-lg font-semibold mb-2">{card.title}</h4>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Next Period</p>
                <p className="text-2xl font-bold">5 days</p>
              </div>
              <Calendar className="h-10 w-10 text-primary" />
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Health Score</p>
                <p className="text-2xl font-bold text-success">85/100</p>
              </div>
              <Activity className="h-10 w-10 text-success" />
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Assessments</p>
                <p className="text-2xl font-bold">3 Complete</p>
              </div>
              <Award className="h-10 w-10 text-secondary" />
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

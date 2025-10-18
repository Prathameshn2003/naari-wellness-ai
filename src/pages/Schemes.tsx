import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Award, Users, Heart } from "lucide-react";

const Schemes = () => {
  const navigate = useNavigate();

  const schemes = [
    {
      name: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
      description: "Cash incentive for pregnant and lactating women for improved health and nutrition.",
      eligibility: "Pregnant women & lactating mothers",
      benefits: "₹5,000 in 3 installments",
      icon: Heart,
      color: "from-pink-500 to-rose-500",
    },
    {
      name: "Janani Suraksha Yojana (JSY)",
      description: "Safe motherhood intervention under National Health Mission to reduce maternal and neonatal mortality.",
      eligibility: "Pregnant women below poverty line",
      benefits: "Cash assistance for institutional delivery",
      icon: Users,
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "National Programme for Prevention and Control of Cancer",
      description: "Free screening and treatment for reproductive cancers including cervical cancer.",
      eligibility: "Women above 30 years",
      benefits: "Free screening & subsidized treatment",
      icon: Award,
      color: "from-violet-500 to-purple-500",
    },
    {
      name: "Scheme for Adolescent Girls (SAG)",
      description: "Nutrition, health education, and counseling for girls aged 11-14 years.",
      eligibility: "Adolescent girls (11-14 years)",
      benefits: "Nutrition supplements & health education",
      icon: Heart,
      color: "from-rose-500 to-pink-500",
    },
  ];

  const stateSchemes = [
    {
      state: "Maharashtra",
      scheme: "Mazi Kanya Bhagyashree Scheme",
      description: "Financial assistance for families with girl children",
    },
    {
      state: "Karnataka",
      scheme: "Bhagyalakshmi Scheme",
      description: "Post-delivery assistance and girl child education support",
    },
    {
      state: "Tamil Nadu",
      scheme: "Dr. Muthulakshmi Reddy Maternity Benefit Scheme",
      description: "Nutritional support for pregnant and lactating women",
    },
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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">Government Health Schemes</h1>
            <p className="text-muted-foreground">Explore welfare programs designed for women's health</p>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Award className="h-6 w-6 text-primary" />
              National Schemes
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {schemes.map((scheme, index) => (
                <Card key={index} className="p-6 hover-lift cursor-pointer group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${scheme.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <scheme.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {scheme.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{scheme.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Eligibility</Badge>
                      <span className="text-sm text-muted-foreground">{scheme.eligibility}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs bg-success/10 text-success border-success">Benefits</Badge>
                      <span className="text-sm font-medium">{scheme.benefits}</span>
                    </div>
                  </div>
                  <Button className="w-full gradient-primary group-hover:shadow-glow transition-all">
                    Learn More
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Users className="h-6 w-6 text-secondary" />
              State-Specific Schemes
            </h2>
            <div className="space-y-4">
              {stateSchemes.map((item, index) => (
                <Card key={index} className="p-6 hover-lift cursor-pointer group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Badge className="mb-2">{item.state}</Badge>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {item.scheme}
                      </h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Button variant="outline" size="sm" className="flex-shrink-0">
                      Details
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <Card className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary">
            <div className="flex items-start gap-4">
              <Award className="h-10 w-10 text-primary flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Need Help Finding the Right Scheme?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our AI assistant can help you identify schemes you're eligible for based on your profile.
                </p>
                <Button onClick={() => navigate("/chat")} className="gradient-primary">
                  Get Personalized Recommendations
                </Button>
              </div>
            </div>
          </Card>
        </Card>
      </main>
    </div>
  );
};

export default Schemes;

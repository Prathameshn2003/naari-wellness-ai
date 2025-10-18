import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, MapPin, Phone, Star, Clock } from "lucide-react";

const Gynecologists = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const doctors = [
    {
      name: "Dr. Priya Sharma",
      specialization: "Obstetrics & Gynecology",
      experience: "15 years",
      rating: 4.9,
      reviews: 234,
      location: "Mumbai, Maharashtra",
      distance: "2.3 km",
      availability: "Available Today",
      fees: "₹800",
      image: "👩‍⚕️",
    },
    {
      name: "Dr. Anjali Verma",
      specialization: "Reproductive Medicine",
      experience: "12 years",
      rating: 4.8,
      reviews: 189,
      location: "Delhi, NCR",
      distance: "3.1 km",
      availability: "Available Tomorrow",
      fees: "₹900",
      image: "👩‍⚕️",
    },
    {
      name: "Dr. Meera Reddy",
      specialization: "PCOS Specialist",
      experience: "10 years",
      rating: 4.7,
      reviews: 156,
      location: "Bangalore, Karnataka",
      distance: "4.5 km",
      availability: "Available Today",
      fees: "₹750",
      image: "👩‍⚕️",
    },
    {
      name: "Dr. Kavita Patel",
      specialization: "Menopause & Women's Health",
      experience: "18 years",
      rating: 4.9,
      reviews: 298,
      location: "Pune, Maharashtra",
      distance: "1.8 km",
      availability: "Available Today",
      fees: "₹1000",
      image: "👩‍⚕️",
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold gradient-text mb-2">Find Gynecologists Near You</h1>
            <p className="text-muted-foreground">Book appointments with trusted healthcare professionals</p>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, location, or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/50"
            />
          </div>

          <div className="grid gap-6">
            {doctors.map((doctor, index) => (
              <Card key={index} className="p-6 hover-lift cursor-pointer group">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-5xl">
                      {doctor.image}
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-2xl font-semibold mb-1 group-hover:text-primary transition-colors">
                        {doctor.name}
                      </h3>
                      <p className="text-muted-foreground">{doctor.specialization}</p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">{doctor.rating}</span>
                        <span className="text-muted-foreground">({doctor.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{doctor.experience} experience</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{doctor.location} • {doctor.distance}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className="bg-success text-white">{doctor.availability}</Badge>
                      <Badge variant="outline">Consultation: {doctor.fees}</Badge>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:items-end">
                    <Button className="gradient-primary w-full md:w-auto">
                      Book Appointment
                    </Button>
                    <Button variant="outline" className="w-full md:w-auto">
                      <Phone className="mr-2 h-4 w-4" />
                      Contact
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Can't find the right doctor? We can help you connect with specialists.
            </p>
            <Button onClick={() => navigate("/chat")} variant="outline">
              Get AI Recommendations
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Gynecologists;

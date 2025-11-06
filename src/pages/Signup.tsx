import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import logo from "@/assets/naaricare-logo.png";
import { UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { apiService } from "@/services/api.service";

const signupSchema = z.object({
  name: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100),
  email: z.string().trim().email({ message: "Invalid email address" }).max(255),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(100),
  dateOfBirth: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid date" }),
});

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    location: "",
    acceptTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.dateOfBirth) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!formData.acceptTerms) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    // Validate inputs with zod
    const validation = signupSchema.safeParse({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      dateOfBirth: formData.dateOfBirth,
    });

    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiService.auth.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        location: formData.location || undefined,
      });

      if (response.token) {
        // Store JWT token
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("userId", response.userId);
        localStorage.setItem("userEmail", response.email);
        localStorage.setItem("userName", response.name);

        toast.success("Account created successfully!");
        navigate("/dashboard");
      } else {
        toast.error("Signup failed. Please try again.");
      }
    } catch (error: any) {
      const errorMessage = error.message || "Signup failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <Card className="glass-card w-full max-w-md p-8 relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="NaariCare" className="w-20 h-20" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Join NaariCare</h1>
          <p className="text-muted-foreground">Create your account to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="bg-white/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              className="bg-white/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="bg-white/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm *</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="bg-white/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="bg-white/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              name="location"
              placeholder="City, State"
              value={formData.location}
              onChange={handleChange}
              className="bg-white/50"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="acceptTerms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
            />
            <Label htmlFor="acceptTerms" className="text-sm cursor-pointer">
              I accept the terms and privacy policy
            </Label>
          </div>

          <Button 
            type="submit" 
            className="w-full gradient-primary hover:shadow-glow transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Create Account
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-primary font-semibold hover:underline"
            >
              Sign in
            </button>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default Signup;

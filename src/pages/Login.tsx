import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import logo from "@/assets/naaricare-logo.png";
import { Heart, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { apiService } from "@/services/api.service";

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }).max(255),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(100),
});

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiService.auth.login(email, password);
      
      if (response.token) {
        // Store JWT token
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("userId", response.userId);
        localStorage.setItem("userEmail", response.email);
        if (response.name) {
          localStorage.setItem("userName", response.name);
        }

        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <Card className="glass-card w-full max-w-md p-8 relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="NaariCare" className="w-20 h-20" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your NaariCare account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/50"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full gradient-primary hover:shadow-glow transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Sign In
              </>
            )}
          </Button>

          <div className="text-center space-y-2">
            <a href="#" className="text-sm text-primary hover:underline block">
              Forgot password?
            </a>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-primary font-semibold hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Heart className="h-4 w-4 text-primary fill-primary" />
            <span>Your health, our priority</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;

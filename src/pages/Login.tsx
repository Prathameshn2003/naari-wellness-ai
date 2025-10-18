import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import logo from "@/assets/naaricare-logo.png";
import { Heart, Sparkles } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Mock login - in production, connect to backend
    toast.success(isAdmin ? "Admin login successful!" : "Welcome back!");
    
    // Store auth state (mock)
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userRole", isAdmin ? "admin" : "user");
    
    navigate("/dashboard");
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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="admin"
              checked={isAdmin}
              onCheckedChange={(checked) => setIsAdmin(checked as boolean)}
            />
            <Label htmlFor="admin" className="text-sm cursor-pointer">
              Login as Admin
            </Label>
          </div>

          <Button type="submit" className="w-full gradient-primary hover:shadow-glow transition-all">
            <Sparkles className="mr-2 h-4 w-4" />
            Sign In
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

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sprout, 
  User, 
  GraduationCap, 
  Beaker, 
  Droplet, 
  Cloud, 
  Leaf, 
  Users, 
  Bug,
  TrendingUp,
  Shield,
  DollarSign,
  Headphones,
  CheckCircle2
} from "lucide-react";
const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sprout,
      title: "AI-Powered Advice",
      description: "Get personalized farming recommendations based on your crop, soil and climate conditions"
    },
    {
      icon: Leaf,
      title: "Complete Crop Cycle",
      description: "Step-by-step guidance on crop planning from soil prep to harvesting"
    },
    {
      icon: Droplet,
      title: "Water Optimization",
      description: "Make smart irrigation plans to save water resources and grow sustainably"
    },
    {
      icon: Bug,
      title: "Disease Prevention",
      description: "Early detection and prevention of crop diseases and pest infestations"
    },
    {
      icon: Cloud,
      title: "Easy to Use",
      description: "Simple interface designed for farmers with multilingual support"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Connect with agricultural experts and get professional guidance"
    }
  ];

  const benefits = [
    { text: "Increase crop yield by up to 30%" },
    { text: "Reduce fertilizer costs by 25%" },
    { text: "Free soil health advisor" },
    { text: "Get real-time weather alerts" },
    { text: "Access government schemes easily" },
    { text: "24/7 AI assistant support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(142,45%,88%)] via-[hsl(142,35%,92%)] to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <Sprout className="w-12 h-12 text-primary" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-[hsl(142,60%,30%)] mb-4">
            Krishi Sakhi
          </h1>
          
          <h2 className="text-xl md:text-2xl font-medium text-[hsl(142,40%,35%)] mb-3">
            Your Digital Farming Friend
          </h2>
          
          <p className="text-base text-[hsl(142,20%,45%)] max-w-xl mx-auto mb-8">
            Personalized crop guidance from soil to harvest
          </p>

          {/* Login Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
            <Button 
              onClick={() => navigate("/login")}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-5 h-auto text-base font-medium rounded-lg"
            >
              Login as Farmer
            </Button>
            <Button 
              onClick={() => navigate("/login")}
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary/5 px-8 py-5 h-auto text-base font-medium rounded-lg"
            >
              Sign Up as Farmer
            </Button>
          </div>

          {/* Expert Link */}
          <button 
            onClick={() => navigate("/login")}
            className="text-sm text-primary hover:underline font-medium"
          >
            Login as Officer/Expert
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h3 className="text-3xl font-bold text-center mb-12 text-[hsl(142,60%,30%)]">
            Why Choose Krishi Sakhi?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-white hover:shadow-md transition-all duration-300 border border-gray-200"
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="bg-primary/10 rounded-full p-4">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold mb-2 text-foreground">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-[hsl(25,50%,88%)] py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h3 className="text-2xl font-bold text-center mb-8 text-[hsl(142,60%,30%)]">
            Benefits You'll Get
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="flex items-start gap-2 text-sm"
              >
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[hsl(142,60%,25%)] py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xl font-semibold text-white mb-6">
            Ready to transform your farming?
          </p>
          <Button 
            onClick={() => navigate("/login")}
            className="bg-white hover:bg-gray-100 text-[hsl(142,60%,25%)] px-10 py-5 h-auto text-base font-medium rounded-lg"
          >
            Get Started Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;

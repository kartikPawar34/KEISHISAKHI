import { ArrowLeft, TrendingUp, TrendingDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useMandiRates } from "@/hooks/useFarmerData";

const MandiRates = () => {
  const navigate = useNavigate();
  const { rates, loading } = useMandiRates();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading mandi rates...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/farmer-dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Mandi Rates</h1>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Today's Market Prices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Latest rates from major agricultural markets across India
            </p>
          </CardContent>
        </Card>

        {rates.map((rate, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{rate.crop_name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {rate.market_name}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Updated: {new Date(rate.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    ₹{rate.price_per_quintal.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">per quintal</p>
                  <Badge variant="outline" className="mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {rates.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No mandi rates available at the moment.</p>
            </CardContent>
          </Card>
        )}

        <Card className="bg-blue-50">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">📊 Market Tips</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Compare prices across different mandis before selling</li>
              <li>• Consider transportation costs in your profit calculation</li>
              <li>• Check quality requirements of each market</li>
              <li>• Monitor trends for better timing of sales</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MandiRates;
import { ArrowLeft, ExternalLink, IndianRupee, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useGovernmentSchemes } from "@/hooks/useFarmerData";

const GovernmentSchemes = () => {
  const navigate = useNavigate();
  const { schemes, loading } = useGovernmentSchemes();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading government schemes...</div>
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
          <h1 className="text-xl font-bold">Government Schemes</h1>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <Card className="bg-gradient-to-r from-orange-50 to-red-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-600" />
              Farmer Welfare Schemes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Government initiatives to support farmers across India
            </p>
          </CardContent>
        </Card>

        {schemes.map((scheme, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{scheme.scheme_name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {scheme.scheme_name_hindi}
                  </p>
                </div>
                {scheme.subsidy_amount && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <IndianRupee className="h-3 w-3" />
                    {scheme.subsidy_amount.toLocaleString()}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Description</h4>
                <p className="text-sm text-muted-foreground">
                  {scheme.description}
                </p>
                {scheme.description_hindi && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {scheme.description_hindi}
                  </p>
                )}
              </div>

              {scheme.eligibility && (
                <div>
                  <h4 className="font-medium mb-1">Eligibility</h4>
                  <p className="text-sm text-muted-foreground">
                    {scheme.eligibility}
                  </p>
                </div>
              )}

              {scheme.application_link && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => window.open(scheme.application_link, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Apply Online
                </Button>
              )}
            </CardContent>
          </Card>
        ))}

        {schemes.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No government schemes available at the moment.</p>
            </CardContent>
          </Card>
        )}

        <Card className="bg-green-50">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">💡 Application Tips</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Keep all necessary documents ready before applying</li>
              <li>• Check eligibility criteria carefully</li>
              <li>• Apply within the specified deadlines</li>
              <li>• Contact local agriculture officers for assistance</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GovernmentSchemes;
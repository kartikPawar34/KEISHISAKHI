import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Plus, 
  Sprout, 
  Droplets, 
  Scissors, 
  Sun,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CropActivity {
  id: string;
  crop: string;
  activity: string;
  date: string;
  status: "pending" | "completed" | "overdue";
  type: "sowing" | "irrigation" | "fertilizer" | "harvesting" | "other";
  description: string;
}

const Calendar = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("hindi");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const activities: CropActivity[] = [
    {
      id: "1",
      crop: language === "hindi" ? "गेहूं" : "Wheat",
      activity: language === "hindi" ? "बुआई" : "Sowing",
      date: "2024-11-15",
      status: "pending",
      type: "sowing",
      description: language === "hindi" ? "गेहूं की बुआई का समय" : "Time for wheat sowing"
    },
    {
      id: "2",
      crop: language === "hindi" ? "सरसों" : "Mustard",
      activity: language === "hindi" ? "सिंचाई" : "Irrigation",
      date: "2024-11-20",
      status: "pending",
      type: "irrigation",
      description: language === "hindi" ? "पहली सिंचाई करें" : "First irrigation needed"
    },
    {
      id: "3",
      crop: language === "hindi" ? "धान" : "Rice",
      activity: language === "hindi" ? "कटाई" : "Harvesting",
      date: "2024-11-10",
      status: "completed",
      type: "harvesting",
      description: language === "hindi" ? "धान की कटाई पूरी" : "Rice harvesting completed"
    },
    {
      id: "4",
      crop: language === "hindi" ? "गेहूं" : "Wheat",
      activity: language === "hindi" ? "उर्वरक" : "Fertilizer",
      date: "2024-12-01",
      status: "pending",
      type: "fertilizer",
      description: language === "hindi" ? "यूरिया डालें" : "Apply urea fertilizer"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "sowing": return <Sprout className="h-4 w-4" />;
      case "irrigation": return <Droplets className="h-4 w-4" />;
      case "harvesting": return <Scissors className="h-4 w-4" />;
      case "fertilizer": return <Sun className="h-4 w-4" />;
      default: return <CalendarIcon className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-primary text-primary-foreground";
      case "pending": return "bg-accent text-accent-foreground";
      case "overdue": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getUpcomingActivities = () => {
    return activities
      .filter(activity => activity.status === "pending")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  };

  const getTodayActivities = () => {
    const today = new Date().toISOString().split('T')[0];
    return activities.filter(activity => activity.date === today);
  };

  const handleActivityComplete = (id: string) => {
    toast({
      title: language === "hindi" ? "गतिविधि पूरी" : "Activity Completed",
      description: language === "hindi" ? "गतिविधि को पूरा मार्क किया गया" : "Activity marked as completed"
    });
  };

  const monthNames = {
    hindi: ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
    english: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 flex items-center gap-3 sticky top-0 z-50">
        <Button variant="ghost" size="icon" onClick={() => navigate("/farmer-dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          {language === "hindi" ? "कृषि कैलेंडर" : "Farm Calendar"}
        </h1>
      </header>

      <div className="p-4 space-y-6">
        {/* Month Navigation */}
        <Card className="feature-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <h2 className="text-lg font-semibold">
                {monthNames[language as keyof typeof monthNames][currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Today's Activities */}
        {getTodayActivities().length > 0 && (
          <Card className="feature-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <AlertCircle className="h-5 w-5" />
                {language === "hindi" ? "आज की गतिविधियां" : "Today's Activities"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getTodayActivities().map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-primary">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <p className="font-medium">{activity.crop} - {activity.activity}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleActivityComplete(activity.id)}>
                    {language === "hindi" ? "पूरा" : "Complete"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Upcoming Activities */}
        <Card className="feature-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              {language === "hindi" ? "आगामी गतिविधियां" : "Upcoming Activities"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {getUpcomingActivities().map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-muted-foreground">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{activity.crop} - {activity.activity}</p>
                      <Badge className={getStatusColor(activity.status)}>
                        {activity.status === "pending" 
                          ? (language === "hindi" ? "लंबित" : "Pending")
                          : (language === "hindi" ? "पूरा" : "Completed")
                        }
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.date).toLocaleDateString('hi-IN')}
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleActivityComplete(activity.id)}
                >
                  {language === "hindi" ? "पूरा" : "Complete"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Crop Cycle Guide */}
        <Card className="feature-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-primary" />
              {language === "hindi" ? "फसल चक्र गाइड" : "Crop Cycle Guide"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {[
                {
                  crop: language === "hindi" ? "गेहूं" : "Wheat",
                  season: language === "hindi" ? "रबी (नवंबर-अप्रैल)" : "Rabi (Nov-Apr)",
                  sowing: language === "hindi" ? "नवंबर" : "November",
                  harvesting: language === "hindi" ? "अप्रैल" : "April"
                },
                {
                  crop: language === "hindi" ? "धान" : "Rice",
                  season: language === "hindi" ? "खरीफ (जून-नवंबर)" : "Kharif (Jun-Nov)",
                  sowing: language === "hindi" ? "जून" : "June",
                  harvesting: language === "hindi" ? "नवंबर" : "November"
                },
                {
                  crop: language === "hindi" ? "सरसों" : "Mustard",
                  season: language === "hindi" ? "रबी (अक्टूबर-मार्च)" : "Rabi (Oct-Mar)",
                  sowing: language === "hindi" ? "अक्टूबर" : "October",
                  harvesting: language === "hindi" ? "मार्च" : "March"
                }
              ].map((crop, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{crop.crop}</h4>
                      <p className="text-sm text-muted-foreground">{crop.season}</p>
                    </div>
                    <Badge variant="outline">{crop.sowing} - {crop.harvesting}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add Activity Button */}
        <Button className="w-full" size="lg" onClick={() => {
          toast({
            title: language === "hindi" ? "नई गतिविधि" : "New Activity",
            description: language === "hindi" ? "गतिविधि जोड़ने की सुविधा जल्द उपलब्ध" : "Add activity feature coming soon"
          });
        }}>
          <Plus className="h-4 w-4 mr-2" />
          {language === "hindi" ? "नई गतिविधि जोड़ें" : "Add New Activity"}
        </Button>
      </div>
    </div>
  );
};

export default Calendar;
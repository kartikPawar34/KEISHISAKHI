import { useState } from "react";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  GraduationCap, 
  MessageSquare, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Award,
  Bell,
  Settings,
  Plus,
  Eye,
  ThumbsUp,
  MessageCircle,
  Share,
  Calendar,
  User
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ExpertDashboard = () => {
  const [language, setLanguage] = useState("hindi");
  const [newPost, setNewPost] = useState("");

  const stats = [
    {
      label: language === "hindi" ? "कुल सवाल" : "Questions Answered",
      value: "142",
      icon: MessageSquare,
      color: "text-primary"
    },
    {
      label: language === "hindi" ? "किसान मदद" : "Farmers Helped",
      value: "89",
      icon: Users,
      color: "text-sky"
    },
    {
      label: language === "hindi" ? "लेख प्रकाशित" : "Articles Published",
      value: "23",
      icon: BookOpen,
      color: "text-earth"
    },
    {
      label: language === "hindi" ? "रेटिंग" : "Rating",
      value: "4.8",
      icon: Award,
      color: "text-accent"
    }
  ];

  const recentQuestions = [
    {
      id: 1,
      farmer: "राजेश कुमार",
      question: language === "hindi" ? "गेहूं की फसल में पीले पत्ते क्यों हो रहे हैं?" : "Why are wheat leaves turning yellow?",
      time: "2 घंटे पहले",
      status: "नया",
      location: "पंजाब"
    },
    {
      id: 2,
      farmer: "सुरेश पटेल",
      question: language === "hindi" ? "टमाटर की फसल में कीड़े लग गए हैं" : "Pest problem in tomato crop",
      time: "4 घंटे पहले",
      status: "उत्तर दिया",
      location: "गुजरात"
    },
    {
      id: 3,
      farmer: "महेश सिंह",
      question: language === "hindi" ? "मिट्टी की जांच कैसे करें?" : "How to test soil?",
      time: "6 घंटे पहले",
      status: "नया",
      location: "उत्तर प्रदेश"
    }
  ];

  const expertPosts = [
    {
      id: 1,
      title: language === "hindi" ? "गेहूं की बुआई का सही समय" : "Right time for wheat sowing",
      content: language === "hindi" ? "इस साल गेहूं की बुआई 15 नवंबर के बाद करें..." : "This year, sow wheat after November 15...",
      date: "2 दिन पहले",
      likes: 45,
      comments: 12,
      views: 234
    },
    {
      id: 2,
      title: language === "hindi" ? "जैविक खाद का उपयोग" : "Using organic fertilizers",
      content: language === "hindi" ? "जैविक खाद मिट्टी की उर्वरता बढ़ाता है..." : "Organic fertilizers improve soil fertility...",
      date: "5 दिन पहले",
      likes: 67,
      comments: 18,
      views: 456
    }
  ];

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      toast({
        title: language === "hindi" ? "पोस्ट प्रकाशित" : "Post Published",
        description: language === "hindi" ? "आपका लेख सफलतापूर्वक प्रकाशित हुआ" : "Your article has been successfully published"
      });
      setNewPost("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>
                <GraduationCap className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-lg">
                {language === "hindi" ? "डॉ. अमित शर्मा" : "Dr. Amit Sharma"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {language === "hindi" ? "कृषि विशेषज्ञ • 15 वर्ष अनुभव" : "Agricultural Expert • 15 years experience"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="p-4 grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="feature-card animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardContent className="p-4 text-center">
              <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create New Post */}
      <div className="p-4">
        <Card className="feature-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {language === "hindi" ? "नया लेख लिखें" : "Write New Article"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              placeholder={language === "hindi" ? "लेख का शीर्षक..." : "Article title..."}
            />
            <Textarea 
              placeholder={language === "hindi" ? "यहाँ अपना लेख लिखें..." : "Write your article here..."}
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-[100px]"
            />
            <Button onClick={handlePostSubmit} className="w-full">
              {language === "hindi" ? "प्रकाशित करें" : "Publish"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Questions */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          {language === "hindi" ? "नए सवाल" : "Recent Questions"}
        </h3>
        
        <div className="space-y-3">
          {recentQuestions.map((question) => (
            <Card key={question.id} className="feature-card">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{question.farmer}</p>
                      <p className="text-xs text-muted-foreground">{question.location}</p>
                    </div>
                  </div>
                  <Badge variant={question.status === "नया" ? "destructive" : "secondary"}>
                    {question.status}
                  </Badge>
                </div>
                
                <p className="text-sm mb-3">{question.question}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{question.time}</span>
                  <Button size="sm" variant={question.status === "नया" ? "default" : "outline"}>
                    {question.status === "नया" 
                      ? (language === "hindi" ? "उत्तर दें" : "Answer")
                      : (language === "hindi" ? "देखें" : "View")
                    }
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* My Articles */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          {language === "hindi" ? "मेरे लेख" : "My Articles"}
        </h3>
        
        <div className="space-y-4">
          {expertPosts.map((post) => (
            <Card key={post.id} className="feature-card">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">{post.title}</h4>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {post.content}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>{post.date}</span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {post.comments}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    {language === "hindi" ? "देखें" : "View"}
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Space for content */}
      <div className="h-8"></div>
    </div>
  );
};

export default ExpertDashboard;
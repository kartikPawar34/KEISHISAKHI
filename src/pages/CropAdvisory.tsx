import React, { useState } from 'react';
import { ArrowLeft, Sprout, Calendar, Droplets, Bug, Video, BookOpen, ChevronRight, Play, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguageHook } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { ChatAssistantBar } from '@/components/ChatAssistantBar';
import { HowToUseModal } from '@/components/HowToUseModal';

interface CropStage {
  name: string;
  nameHindi: string;
  duration: string;
  durationHindi: string;
  progress: number;
  completed: boolean;
  tips: string[];
  tipsHindi: string[];
}

interface CropSuggestion {
  id: string;
  name: string;
  nameHindi: string;
  season: string;
  seasonHindi: string;
  image: string;
  description: string;
  descriptionHindi: string;
  yield: string;
  yieldHindi: string;
  duration: string;
  durationHindi: string;
  profitability: 'high' | 'medium' | 'low';
  stages: CropStage[];
}

const CropAdvisory = () => {
  const { language } = useLanguageHook();
  const navigate = useNavigate();
  const [selectedCrop, setSelectedCrop] = useState<CropSuggestion | null>(null);
  const [activeStage, setActiveStage] = useState(0);

  const cropSuggestions: CropSuggestion[] = [
    {
      id: 'wheat',
      name: 'Wheat',
      nameHindi: 'गेहूं',
      season: 'Winter',
      seasonHindi: 'सर्दी',
      image: '🌾',
      description: 'High yield winter crop suitable for your soil type',
      descriptionHindi: 'आपकी मिट्टी के लिए उपयुक्त उच्च उत्पादन वाली सर्दी की फसल',
      yield: '40-50 quintals/acre',
      yieldHindi: '40-50 क्विंटल/एकड़',
      duration: '120-150 days',
      durationHindi: '120-150 दिन',
      profitability: 'high',
      stages: [
        {
          name: 'Land Preparation',
          nameHindi: 'भूमि तैयारी',
          duration: '7-10 days',
          durationHindi: '7-10 दिन',
          progress: 100,
          completed: true,
          tips: ['Deep plowing required', 'Add organic manure', 'Level the field properly'],
          tipsHindi: ['गहरी जुताई आवश्यक', 'जैविक खाद डालें', 'खेत को समतल करें']
        },
        {
          name: 'Sowing',
          nameHindi: 'बुआई',
          duration: '15-30 Nov',
          durationHindi: '15-30 नवंबर',
          progress: 100,
          completed: true,
          tips: ['Use quality seeds', 'Maintain proper spacing', 'Irrigate after sowing'],
          tipsHindi: ['गुणवत्ता बीज का उपयोग', 'उचित दूरी बनाए रखें', 'बुआई के बाद सिंचाई करें']
        },
        {
          name: 'Germination & Growth',
          nameHindi: 'अंकुरण और वृद्धि',
          duration: '20-40 days',
          durationHindi: '20-40 दिन',
          progress: 75,
          completed: false,
          tips: ['Monitor for pests', 'Apply first dose of fertilizer', 'Maintain moisture'],
          tipsHindi: ['कीटों की निगरानी करें', 'खाद की पहली मात्रा दें', 'नमी बनाए रखें']
        },
        {
          name: 'Tillering',
          nameHindi: 'कल्ले निकलना',
          duration: '40-70 days',
          durationHindi: '40-70 दिन',
          progress: 0,
          completed: false,
          tips: ['Second irrigation needed', 'Apply nitrogen fertilizer', 'Weed control'],
          tipsHindi: ['दूसरी सिंचाई की जरूरत', 'नाइट्रोजन खाद दें', 'खरपतवार नियंत्रण']
        },
        {
          name: 'Grain Formation',
          nameHindi: 'दाना भरना',
          duration: '70-100 days',
          durationHindi: '70-100 दिन',
          progress: 0,
          completed: false,
          tips: ['Critical irrigation period', 'Monitor for diseases', 'Apply final fertilizer dose'],
          tipsHindi: ['महत्वपूर्ण सिंचाई अवधि', 'बीमारियों की जांच', 'अंतिम खाद की मात्रा']
        },
        {
          name: 'Harvest',
          nameHindi: 'कटाई',
          duration: '100-120 days',
          durationHindi: '100-120 दिन',
          progress: 0,
          completed: false,
          tips: ['Harvest at right maturity', 'Dry properly', 'Store safely'],
          tipsHindi: ['सही समय पर कटाई', 'अच्छी तरह सुखाएं', 'सुरक्षित भंडारण']
        }
      ]
    },
    {
      id: 'mustard',
      name: 'Mustard',
      nameHindi: 'सरसों',
      season: 'Winter',
      seasonHindi: 'सर्दी',
      image: '🌻',
      description: 'Oil seed crop with good market demand',
      descriptionHindi: 'अच्छी बाजार मांग वाली तेल बीज फसल',
      yield: '15-20 quintals/acre',
      yieldHindi: '15-20 क्विंटल/एकड़',
      duration: '90-120 days',
      durationHindi: '90-120 दिन',
      profitability: 'medium',
      stages: [
        {
          name: 'Land Preparation',
          nameHindi: 'भूमि तैयारी',
          duration: '5-7 days',
          durationHindi: '5-7 दिन',
          progress: 100,
          completed: true,
          tips: ['Light plowing sufficient', 'Add compost', 'Prepare fine tilth'],
          tipsHindi: ['हल्की जुताई पर्याप्त', 'कंपोस्ट डालें', 'बारीक मिट्टी तैयार करें']
        },
        {
          name: 'Sowing',
          nameHindi: 'बुआई',
          duration: '10-25 Oct',
          durationHindi: '10-25 अक्टूबर',
          progress: 100,
          completed: true,
          tips: ['Use treated seeds', 'Line sowing preferred', 'Light irrigation after sowing'],
          tipsHindi: ['उपचारित बीज उपयोग करें', 'लाइन में बुआई बेहतर', 'बुआई के बाद हल्की सिंचाई']
        },
        {
          name: 'Vegetative Growth',
          nameHindi: 'वानस्पतिक वृद्धि',
          duration: '15-45 days',
          durationHindi: '15-45 दिन',
          progress: 60,
          completed: false,
          tips: ['First weeding at 20 days', 'Apply urea', 'Monitor for aphids'],
          tipsHindi: ['20 दिन में पहली निराई', 'यूरिया डालें', 'माहू की जांच करें']
        },
        {
          name: 'Flowering',
          nameHindi: 'फूल आना',
          duration: '45-75 days',
          durationHindi: '45-75 दिन',
          progress: 0,
          completed: false,
          tips: ['Critical irrigation needed', 'Pest management important', 'Foliar spray beneficial'],
          tipsHindi: ['महत्वपूर्ण सिंचाई जरूरी', 'कीट प्रबंधन महत्वपूर्ण', 'पत्ती छिड़काव लाभकारी']
        },
        {
          name: 'Pod Formation',
          nameHindi: 'फली बनना',
          duration: '75-100 days',
          durationHindi: '75-100 दिन',
          progress: 0,
          completed: false,
          tips: ['Maintain soil moisture', 'Watch for pod borer', 'Apply micronutrients'],
          tipsHindi: ['मिट्टी में नमी बनाए रखें', 'फली बेधक की निगरानी', 'सूक्ष्म तत्व दें']
        },
        {
          name: 'Harvest',
          nameHindi: 'कटाई',
          duration: '100-120 days',
          durationHindi: '100-120 दिन',
          progress: 0,
          completed: false,
          tips: ['Harvest when pods turn brown', 'Dry in shade', 'Clean seeds properly'],
          tipsHindi: ['फली भूरी होने पर कटाई', 'छाया में सुखाएं', 'बीज साफ करें']
        }
      ]
    },
    {
      id: 'chickpea',
      name: 'Chickpea',
      nameHindi: 'चना',
      season: 'Winter',
      seasonHindi: 'सर्दी',
      image: '🫘',
      description: 'Protein-rich legume crop with nitrogen fixation',
      descriptionHindi: 'नाइट्रोजन स्थिरीकरण के साथ प्रोटीन युक्त दलहन फसल',
      yield: '12-18 quintals/acre',
      yieldHindi: '12-18 क्विंटल/एकड़',
      duration: '100-130 days',
      durationHindi: '100-130 दिन',
      profitability: 'high',
      stages: [
        {
          name: 'Land Preparation',
          nameHindi: 'भूमि तैयारी',
          duration: '7-10 days',
          durationHindi: '7-10 दिन',
          progress: 100,
          completed: true,
          tips: ['Deep plowing in summer', 'Add phosphorus-rich fertilizer', 'Prepare well-drained field'],
          tipsHindi: ['गर्मी में गहरी जुताई', 'फास्फोरस युक्त खाद डालें', 'अच्छी जल निकासी वाला खेत']
        },
        {
          name: 'Sowing',
          nameHindi: 'बुआई',
          duration: '15 Oct - 15 Nov',
          durationHindi: '15 अक्टूबर - 15 नवंबर',
          progress: 100,
          completed: true,
          tips: ['Treat seeds with Rhizobium', 'Maintain 30cm row spacing', 'Pre-sowing irrigation'],
          tipsHindi: ['राइजोबियम से बीज उपचार', '30 सेमी कतार की दूरी', 'बुआई पूर्व सिंचाई']
        },
        {
          name: 'Germination',
          nameHindi: 'अंकुरण',
          duration: '7-15 days',
          durationHindi: '7-15 दिन',
          progress: 80,
          completed: false,
          tips: ['Ensure uniform germination', 'Light irrigation if needed', 'Watch for cutworm'],
          tipsHindi: ['एकसमान अंकुरण सुनिश्चित करें', 'जरूरत पर हल्की सिंचाई', 'कटुआ की जांच']
        },
        {
          name: 'Vegetative Growth',
          nameHindi: 'वानस्पतिक वृद्धि',
          duration: '30-60 days',
          durationHindi: '30-60 दिन',
          progress: 0,
          completed: false,
          tips: ['First irrigation at 30 days', 'Weeding at 25-30 days', 'No nitrogen fertilizer needed'],
          tipsHindi: ['30 दिन में पहली सिंचाई', '25-30 दिन में निराई', 'नाइट्रोजन खाद की जरूरत नहीं']
        },
        {
          name: 'Flowering & Pod Setting',
          nameHindi: 'फूल आना और फली लगना',
          duration: '60-90 days',
          durationHindi: '60-90 दिन',
          progress: 0,
          completed: false,
          tips: ['Critical water requirement', 'Monitor for pod borer', 'Apply boron if deficient'],
          tipsHindi: ['महत्वपूर्ण पानी की आवश्यकता', 'फली बेधक की निगरानी', 'बोरोन की कमी में दें']
        },
        {
          name: 'Harvest',
          nameHindi: 'कटाई',
          duration: '100-130 days',
          durationHindi: '100-130 दिन',
          progress: 0,
          completed: false,
          tips: ['Harvest when pods rattle', 'Early morning harvesting', 'Dry to 12% moisture'],
          tipsHindi: ['फली खड़खड़ाने पर कटाई', 'सुबह जल्दी कटाई', '12% नमी तक सुखाएं']
        }
      ]
    }
  ];

  const getProfitabilityColor = (profitability: string) => {
    switch (profitability) {
      case 'high': return 'bg-success text-success-foreground';
      case 'medium': return 'bg-accent text-accent-foreground';
      case 'low': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getProfitabilityText = (profitability: string) => {
    switch (profitability) {
      case 'high': return language === 'hindi' ? 'उच्च' : 'High';
      case 'medium': return language === 'hindi' ? 'मध्यम' : 'Medium';
      case 'low': return language === 'hindi' ? 'कम' : 'Low';
      default: return '';
    }
  };

  const translations = {
    title: { hindi: 'फसल सलाह', english: 'Crop Advisory' },
    suggestedCrops: { hindi: 'सुझाई गई फसलें', english: 'Suggested Crops' },
    currentSeason: { hindi: 'वर्तमान मौसम', english: 'Current Season' },
    profitability: { hindi: 'लाभप्रदता', english: 'Profitability' },
    expectedYield: { hindi: 'अपेक्षित उत्पादन', english: 'Expected Yield' },
    duration: { hindi: 'अवधि', english: 'Duration' },
    viewDetails: { hindi: 'विवरण देखें', english: 'View Details' },
    cropCycle: { hindi: 'फसल चक्र', english: 'Crop Cycle' },
    detailedGuide: { hindi: 'विस्तृत गाइड', english: 'Detailed Guide' },
    tips: { hindi: 'सुझाव', english: 'Tips' },
    watchVideo: { hindi: 'वीडियो देखें', english: 'Watch Video' },
    currentStage: { hindi: 'वर्तमान चरण', english: 'Current Stage' },
    completed: { hindi: 'पूर्ण', english: 'Completed' },
    inProgress: { hindi: 'प्रगति में', english: 'In Progress' },
    upcoming: { hindi: 'आगामी', english: 'Upcoming' }
  };

  const t_local = (key: keyof typeof translations) => translations[key][language];

  return (
    <div className="min-h-screen bg-hero-pattern pb-32">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in-up">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/farmer-dashboard')}
            className="hover:bg-primary/10 hover:scale-110 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gradient-primary flex items-center gap-3">
              <Sprout className="w-8 h-8 md:w-10 md:h-10 text-primary animate-bounce-gentle" />
              {t_local('title')}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              {language === 'hindi' ? 'आपके क्षेत्र और मिट्टी के लिए सबसे उपयुक्त फसलें' : 'Most suitable crops for your region and soil'}
            </p>
          </div>
          <HowToUseModal
            title="Crop Advisory"
            titleHindi="फसल सलाह"
            instructions={[
              "Select Season & Soil Type → Get crop suggestions based on your region",
              "Check Crop Cycle Stages → Track sowing to harvest timeline",
              "Open Detailed Guide → Watch videos & follow step-by-step instructions",
              "Get Updates → Receive alerts in your chosen language",
              "Download PDF → Save crop plan for offline use"
            ]}
            instructionsHindi={[
              "मौसम और मिट्टी का प्रकार चुनें → अपने क्षेत्र के आधार पर फसल सुझाव प्राप्त करें",
              "फसल चक्र चरणों की जांच करें → बुआई से कटाई तक की समय-सीमा ट्रैक करें",
              "विस्तृत गाइड खोलें → वीडियो देखें और चरण-दर-चरण निर्देशों का पालन करें",
              "अपडेट प्राप्त करें → अपनी पसंदीदा भाषा में अलर्ट प्राप्त करें",
              "PDF डाउनलोड करें → ऑफलाइन उपयोग के लिए फसल योजना सहेजें"
            ]}
            language={language}
          />
        </div>

        {/* Current Season Info */}
        <Card className="feature-card mb-8 animate-fade-in-up animate-stagger-1 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="flex items-center justify-between p-6 md:p-8">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-4 rounded-2xl">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg md:text-xl">{t_local('currentSeason')}: {language === 'hindi' ? 'सर्दी (रबी)' : 'Winter (Rabi)'}</h3>
                <p className="text-muted-foreground text-sm md:text-base mt-1">
                  {language === 'hindi' ? 'अक्टूबर - मार्च' : 'October - March'}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm px-4 py-2 bg-secondary/80">
              <MapPin className="w-4 h-4 mr-1" />
              {language === 'hindi' ? 'दिल्ली' : 'Delhi'}
            </Badge>
          </CardContent>
        </Card>

        {/* Suggested Crops */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">{t_local('suggestedCrops')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cropSuggestions.map((crop) => (
              <Card key={crop.id} className="feature-card group hover:shadow-lg transition-all">
                <CardHeader className="text-center">
                  <div className="text-6xl mb-4">{crop.image}</div>
                  <CardTitle className="text-xl">
                    {language === 'hindi' ? crop.nameHindi : crop.name}
                  </CardTitle>
                  <Badge variant="secondary">
                    {language === 'hindi' ? crop.seasonHindi : crop.season}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-center">
                    {language === 'hindi' ? crop.descriptionHindi : crop.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{t_local('profitability')}:</span>
                      <Badge className={getProfitabilityColor(crop.profitability)}>
                        {getProfitabilityText(crop.profitability)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{t_local('expectedYield')}:</span>
                      <span className="text-sm">{language === 'hindi' ? crop.yieldHindi : crop.yield}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{t_local('duration')}:</span>
                      <span className="text-sm">{language === 'hindi' ? crop.durationHindi : crop.duration}</span>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="earth" 
                        className="w-full"
                        onClick={() => setSelectedCrop(crop)}
                      >
                        {t_local('viewDetails')}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-3 text-2xl">
                          <span className="text-3xl">{crop.image}</span>
                          {language === 'hindi' ? crop.nameHindi : crop.name}
                        </DialogTitle>
                      </DialogHeader>
                      
                      <Tabs defaultValue="cycle" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="cycle">{t_local('cropCycle')}</TabsTrigger>
                          <TabsTrigger value="guide">{t_local('detailedGuide')}</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="cycle" className="space-y-6">
                          {/* Progress Overview */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold">{t_local('currentStage')}</h3>
                            <div className="relative">
                              <Progress value={33} className="h-3" />
                              <div className="absolute top-0 left-1/3 transform -translate-x-1/2 -translate-y-1 w-4 h-4 bg-primary rounded-full border-2 border-white"></div>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>{language === 'hindi' ? 'बुआई' : 'Sowing'}</span>
                              <span>{language === 'hindi' ? 'वृद्धि' : 'Growth'}</span>
                              <span>{language === 'hindi' ? 'कटाई' : 'Harvest'}</span>
                            </div>
                          </div>

                          {/* Crop Stages */}
                          <div className="space-y-4">
                            {crop.stages.map((stage, index) => (
                              <Card 
                                key={index} 
                                className={`cursor-pointer transition-all ${
                                  stage.completed ? 'bg-success/5 border-success/20' :
                                  stage.progress > 0 ? 'bg-primary/5 border-primary/20' :
                                  'bg-muted/5 border-border'
                                }`}
                                onClick={() => setActiveStage(index)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        stage.completed ? 'bg-success text-success-foreground' :
                                        stage.progress > 0 ? 'bg-primary text-primary-foreground' :
                                        'bg-muted text-muted-foreground'
                                      }`}>
                                        {index + 1}
                                      </div>
                                      <div>
                                        <h4 className="font-semibold">
                                          {language === 'hindi' ? stage.nameHindi : stage.name}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                          {language === 'hindi' ? stage.durationHindi : stage.duration}
                                        </p>
                                      </div>
                                    </div>
                                    <Badge variant={
                                      stage.completed ? 'default' :
                                      stage.progress > 0 ? 'secondary' :
                                      'outline'
                                    }>
                                      {stage.completed ? t_local('completed') :
                                       stage.progress > 0 ? t_local('inProgress') :
                                       t_local('upcoming')}
                                    </Badge>
                                  </div>
                                  
                                  {stage.progress > 0 && !stage.completed && (
                                    <Progress value={stage.progress} className="mb-3" />
                                  )}
                                  
                                  {activeStage === index && (
                                    <div className="mt-4 space-y-3 border-t pt-4">
                                      <h5 className="font-medium">{t_local('tips')}:</h5>
                                      <ul className="space-y-1">
                                        {(language === 'hindi' ? stage.tipsHindi : stage.tips).map((tip, tipIndex) => (
                                          <li key={tipIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                                            <span className="text-primary mt-1">•</span>
                                            {tip}
                                          </li>
                                        ))}
                                      </ul>
                                      <Button variant="outline" size="sm">
                                        <Video className="w-4 h-4 mr-2" />
                                        {t_local('watchVideo')}
                                      </Button>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="guide" className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <Sprout className="w-5 h-5 text-primary" />
                                  {language === 'hindi' ? 'बुआई गाइड' : 'Sowing Guide'}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {language === 'hindi' ? 'बुआई का समय: 15 अक्टूबर - 15 नवंबर' : 'Sowing Time: 15 Oct - 15 Nov'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Droplets className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {language === 'hindi' ? 'बीज दर: 80-100 किग्रा/हेक्टेयर' : 'Seed Rate: 80-100 kg/hectare'}
                                  </span>
                                </div>
                                <Button variant="outline" size="sm" className="w-full">
                                  <Play className="w-4 h-4 mr-2" />
                                  {language === 'hindi' ? 'वीडियो ट्यूटोरियल देखें' : 'Watch Video Tutorial'}
                                </Button>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <Bug className="w-5 h-5 text-destructive" />
                                  {language === 'hindi' ? 'कीट नियंत्रण' : 'Pest Control'}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className="space-y-2">
                                  <Badge variant="destructive" className="text-xs">
                                    {language === 'hindi' ? 'मुख्य कीट: फली बेधक' : 'Major Pest: Pod Borer'}
                                  </Badge>
                                  <p className="text-sm text-muted-foreground">
                                    {language === 'hindi' 
                                      ? 'फूल आने के समय साप्ताहिक निरीक्षण करें'
                                      : 'Weekly monitoring during flowering stage'
                                    }
                                  </p>
                                </div>
                                <Button variant="outline" size="sm" className="w-full">
                                  <BookOpen className="w-4 h-4 mr-2" />
                                  {language === 'hindi' ? 'विस्तृत गाइड पढ़ें' : 'Read Detailed Guide'}
                                </Button>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Seasonal Calendar */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-accent" />
                                {language === 'hindi' ? 'मासिक कैलेंडर' : 'Monthly Calendar'}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                {['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map((month, index) => (
                                  <div key={month} className="text-center p-3 rounded-lg bg-muted/50">
                                    <div className="font-medium">{month}</div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {index === 0 ? (language === 'hindi' ? 'बुआई' : 'Sowing') :
                                       index === 1 ? (language === 'hindi' ? 'अंकुरण' : 'Germination') :
                                       index === 2 ? (language === 'hindi' ? 'वृद्धि' : 'Growth') :
                                       index === 3 ? (language === 'hindi' ? 'फूल' : 'Flowering') :
                                       index === 4 ? (language === 'hindi' ? 'फली' : 'Pod Fill') :
                                       (language === 'hindi' ? 'कटाई' : 'Harvest')}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Chat Assistant Bar */}
      <ChatAssistantBar 
        onSendMessage={(message) => console.log('Chat message:', message)}
        onImageUpload={(file) => console.log('Image uploaded:', file.name)}
        onVoiceInput={() => console.log('Voice input activated')}
      />
      
      {/* Bottom padding to prevent content overlap with chat bar */}
      <div className="h-24"></div>
    </div>
  );
};

export default CropAdvisory;
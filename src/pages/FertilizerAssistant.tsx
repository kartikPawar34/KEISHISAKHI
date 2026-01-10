import React, { useState } from 'react';
import { ArrowLeft, Leaf, Scale, Beaker, Download, Share2, Volume2, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useLanguageHook } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { ChatAssistantBar } from '@/components/ChatAssistantBar';
import { HowToUseModal } from '@/components/HowToUseModal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  crop: z.string().min(1, 'Please select a crop'),
  landSize: z.string().min(1, 'Please enter land size'),
  landUnit: z.string().min(1, 'Please select unit'),
  soilType: z.string().min(1, 'Please select soil type'),
  soilPh: z.string().optional(),
  previousCrop: z.string().optional(),
  irrigationType: z.string().min(1, 'Please select irrigation type'),
});

interface FertilizerRecommendation {
  name: string;
  nameHindi: string;
  type: 'organic' | 'chemical' | 'bio';
  quantity: string;
  quantityHindi: string;
  timing: string[];
  timingHindi: string[];
  price: string;
  priceHindi: string;
  benefits: string[];
  benefitsHindi: string[];
  safetyTips: string[];
  safetyTipsHindi: string[];
}

const FertilizerAssistant = () => {
  const { language } = useLanguageHook();
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crop: '',
      landSize: '',
      landUnit: 'acre',
      soilType: '',
      soilPh: '',
      previousCrop: '',
      irrigationType: '',
    },
  });

  const crops = [
    { value: 'wheat', label: 'Wheat', labelHindi: 'गेहूं', image: '🌾' },
    { value: 'rice', label: 'Rice', labelHindi: 'चावल', image: '🌾' },
    { value: 'mustard', label: 'Mustard', labelHindi: 'सरसों', image: '🌻' },
    { value: 'chickpea', label: 'Chickpea', labelHindi: 'चना', image: '🫘' },
    { value: 'sugarcane', label: 'Sugarcane', labelHindi: 'गन्ना', image: '🎋' },
    { value: 'cotton', label: 'Cotton', labelHindi: 'कपास', image: '🌿' },
  ];

  const soilTypes = [
    { value: 'alluvial', label: 'Alluvial', labelHindi: 'जलोढ़' },
    { value: 'clay', label: 'Clay', labelHindi: 'चिकनी' },
    { value: 'sandy', label: 'Sandy', labelHindi: 'रेतीली' },
    { value: 'loamy', label: 'Loamy', labelHindi: 'दोमट' },
    { value: 'red', label: 'Red Soil', labelHindi: 'लाल मिट्टी' },
    { value: 'black', label: 'Black Soil', labelHindi: 'काली मिट्टी' },
  ];

  const irrigationTypes = [
    { value: 'flood', label: 'Flood Irrigation', labelHindi: 'बाढ़ सिंचाई' },
    { value: 'sprinkler', label: 'Sprinkler', labelHindi: 'स्प्रिंकलर' },
    { value: 'drip', label: 'Drip Irrigation', labelHindi: 'ड्रिप सिंचाई' },
    { value: 'canal', label: 'Canal', labelHindi: 'नहर' },
    { value: 'tubewell', label: 'Tubewell', labelHindi: 'नलकूप' },
  ];

  const fertilizerRecommendations: FertilizerRecommendation[] = [
    {
      name: 'NPK 12:32:16',
      nameHindi: 'एनपीके 12:32:16',
      type: 'chemical',
      quantity: '125 kg/acre',
      quantityHindi: '125 किग्रा/एकड़',
      timing: ['At sowing', '30 days after sowing', '60 days after sowing'],
      timingHindi: ['बुआई के समय', 'बुआई के 30 दिन बाद', 'बुआई के 60 दिन बाद'],
      price: '₹2,800-3,200',
      priceHindi: '₹2,800-3,200',
      benefits: ['Balanced nutrition', 'Improved root development', 'Better flowering'],
      benefitsHindi: ['संतुलित पोषण', 'जड़ विकास में सुधार', 'बेहतर फूल आना'],
      safetyTips: ['Use protective gear', 'Store in dry place', 'Keep away from children'],
      safetyTipsHindi: ['सुरक्षा गियर का उपयोग करें', 'सूखी जगह पर रखें', 'बच्चों से दूर रखें']
    },
    {
      name: 'Vermicompost',
      nameHindi: 'वर्मी कंपोस्ट',
      type: 'organic',
      quantity: '2-3 tons/acre',
      quantityHindi: '2-3 टन/एकड़',
      timing: ['15 days before sowing', 'During land preparation'],
      timingHindi: ['बुआई से 15 दिन पहले', 'भूमि तैयारी के दौरान'],
      price: '₹4,000-5,000',
      priceHindi: '₹4,000-5,000',
      benefits: ['Improves soil health', 'Long-lasting effect', 'Environment friendly'],
      benefitsHindi: ['मिट्टी की सेहत सुधारता है', 'लंबे समय तक प्रभाव', 'पर्यावरण अनुकूल'],
      safetyTips: ['Check for proper decomposition', 'Mix well with soil', 'Use gloves while handling'],
      safetyTipsHindi: ['उचित सड़न की जांच करें', 'मिट्टी में अच्छी तरह मिलाएं', 'हाथ में दस्ताने पहनें']
    },
    {
      name: 'Rhizobium Bio-Fertilizer',
      nameHindi: 'राइजोबियम जैव उर्वरक',
      type: 'bio',
      quantity: '250 grams/acre',
      quantityHindi: '250 ग्राम/एकड़',
      timing: ['Seed treatment before sowing'],
      timingHindi: ['बुआई से पहले बीज उपचार'],
      price: '₹150-200',
      priceHindi: '₹150-200',
      benefits: ['Nitrogen fixation', 'Reduces fertilizer cost', 'Improves soil biology'],
      benefitsHindi: ['नाइट्रोजन स्थिरीकरण', 'उर्वरक लागत घटाता है', 'मिट्टी जीव विज्ञान सुधारता है'],
      safetyTips: ['Store in cool place', 'Use before expiry', 'Do not mix with chemicals'],
      safetyTipsHindi: ['ठंडी जगह पर रखें', 'एक्सपायरी से पहले उपयोग', 'रसायनों के साथ न मिलाएं']
    }
  ];

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsGenerating(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsGenerating(false);
      setShowResults(true);
    }, 3000);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'organic': return 'bg-success text-success-foreground';
      case 'chemical': return 'bg-destructive text-destructive-foreground';
      case 'bio': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'organic': return language === 'hindi' ? 'जैविक' : 'Organic';
      case 'chemical': return language === 'hindi' ? 'रासायनिक' : 'Chemical';
      case 'bio': return language === 'hindi' ? 'जैव' : 'Bio';
      default: return '';
    }
  };

  const handleAudioPlay = () => {
    setAudioPlaying(true);
    // Simulate audio playback
    setTimeout(() => setAudioPlaying(false), 5000);
  };

  const translations = {
    title: { hindi: 'उर्वरक सहायक', english: 'Fertilizer Assistant' },
    cropSelection: { hindi: 'फसल चुनें', english: 'Select Crop' },
    landSize: { hindi: 'भूमि का आकार', english: 'Land Size' },
    soilCondition: { hindi: 'मिट्टी की स्थिति', english: 'Soil Condition' },
    getRecommendation: { hindi: 'सिफारिश प्राप्त करें', english: 'Get Recommendation' },
    recommendations: { hindi: 'सिफारिशें', english: 'Recommendations' },
    quantity: { hindi: 'मात्रा', english: 'Quantity' },
    timing: { hindi: 'समय', english: 'Timing' },
    price: { hindi: 'कीमत', english: 'Price' },
    benefits: { hindi: 'लाभ', english: 'Benefits' },
    safetyGuidelines: { hindi: 'सुरक्षा दिशानिर्देश', english: 'Safety Guidelines' },
    downloadPdf: { hindi: 'PDF डाउनलोड करें', english: 'Download PDF' },
    share: { hindi: 'साझा करें', english: 'Share' },
    listenAudio: { hindi: 'ऑडियो सुनें', english: 'Listen Audio' },
    soilType: { hindi: 'मिट्टी का प्रकार', english: 'Soil Type' },
    irrigationType: { hindi: 'सिंचाई का प्रकार', english: 'Irrigation Type' },
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
              <Leaf className="w-8 h-8 md:w-10 md:h-10 text-success animate-bounce-gentle" />
              {t_local('title')}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              {language === 'hindi' 
                ? 'आपकी फसल के लिए सटीक उर्वरक सिफारिश प्राप्त करें'
                : 'Get precise fertilizer recommendations for your crop'
              }
            </p>
          </div>
          <HowToUseModal
            title="Fertilizer Assistant"
            titleHindi="उर्वरक सहायक"
            instructions={[
              "Select Crop & Land Size → Choose your crop and enter field size",
              "Enter Soil Condition → Provide soil type and pH level",
              "Get Fertilizer Type & Quantity → AI calculates exact fertilizer needs",
              "View Safe Usage Instructions → Follow safety guidelines",
              "Download PDF → Save recommendations for future reference"
            ]}
            instructionsHindi={[
              "फसल और भूमि का आकार चुनें → अपनी फसल चुनें और खेत का आकार दर्ज करें",
              "मिट्टी की स्थिति दर्ज करें → मिट्टी का प्रकार और pH स्तर प्रदान करें",
              "उर्वरक प्रकार और मात्रा प्राप्त करें → AI सटीक उर्वरक आवश्यकता की गणना करता है",
              "सुरक्षित उपयोग निर्देश देखें → सुरक्षा दिशानिर्देशों का पालन करें",
              "PDF डाउनलोड करें → भविष्य के संदर्भ के लिए सिफारिशें सहेजें"
            ]}
            language={language}
          />
        </div>

        {!showResults ? (
          <div className="max-w-4xl mx-auto">
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-6 h-6 text-primary" />
                  {language === 'hindi' ? 'फसल और भूमि की जानकारी दर्ज करें' : 'Enter Crop and Land Information'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Crop Selection */}
                      <FormField
                        control={form.control}
                        name="crop"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t_local('cropSelection')}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={language === 'hindi' ? 'फसल चुनें' : 'Select crop'} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {crops.map((crop) => (
                                  <SelectItem key={crop.value} value={crop.value}>
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg">{crop.image}</span>
                                      {language === 'hindi' ? crop.labelHindi : crop.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Land Size */}
                      <div className="flex gap-2">
                        <FormField
                          control={form.control}
                          name="landSize"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>{t_local('landSize')}</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="5"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="landUnit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>&nbsp;</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="w-24">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="acre">Acre</SelectItem>
                                  <SelectItem value="hectare">Hectare</SelectItem>
                                  <SelectItem value="bigha">Bigha</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Soil Type */}
                      <FormField
                        control={form.control}
                        name="soilType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t_local('soilType')}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={language === 'hindi' ? 'मिट्टी का प्रकार चुनें' : 'Select soil type'} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {soilTypes.map((soil) => (
                                  <SelectItem key={soil.value} value={soil.value}>
                                    {language === 'hindi' ? soil.labelHindi : soil.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Soil pH */}
                      <FormField
                        control={form.control}
                        name="soilPh"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {language === 'hindi' ? 'मिट्टी का pH (वैकल्पिक)' : 'Soil pH (Optional)'}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="6.5"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Previous Crop */}
                      <FormField
                        control={form.control}
                        name="previousCrop"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {language === 'hindi' ? 'पिछली फसल (वैकल्पिक)' : 'Previous Crop (Optional)'}
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={language === 'hindi' ? 'पिछली फसल चुनें' : 'Select previous crop'} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {crops.map((crop) => (
                                  <SelectItem key={crop.value} value={crop.value}>
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg">{crop.image}</span>
                                      {language === 'hindi' ? crop.labelHindi : crop.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Irrigation Type */}
                      <FormField
                        control={form.control}
                        name="irrigationType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t_local('irrigationType')}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={language === 'hindi' ? 'सिंचाई का प्रकार चुनें' : 'Select irrigation type'} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {irrigationTypes.map((irrigation) => (
                                  <SelectItem key={irrigation.value} value={irrigation.value}>
                                    {language === 'hindi' ? irrigation.labelHindi : irrigation.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {isGenerating && (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center gap-3 mb-4">
                          <Beaker className="w-6 h-6 text-primary animate-pulse" />
                          <span className="text-lg font-medium">
                            {language === 'hindi' ? 'AI द्वारा सिफारिश तैयार की जा रही है...' : 'AI is preparing recommendations...'}
                          </span>
                        </div>
                        <Progress value={75} className="w-full max-w-md mx-auto" />
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      variant="earth" 
                      size="lg" 
                      className="w-full"
                      disabled={isGenerating}
                    >
                      <Scale className="w-5 h-5 mr-2" />
                      {t_local('getRecommendation')}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header Actions */}
            <div className="flex justify-center gap-4">
              <Button variant="secondary">
                <Download className="w-4 h-4 mr-2" />
                {t_local('downloadPdf')}
              </Button>
              <Button variant="secondary">
                <Share2 className="w-4 h-4 mr-2" />
                {t_local('share')}
              </Button>
              <Button 
                variant="sky" 
                onClick={handleAudioPlay}
                disabled={audioPlaying}
              >
                <Volume2 className="w-4 h-4 mr-2" />
                {audioPlaying ? 
                  (language === 'hindi' ? 'चलाई जा रही है...' : 'Playing...') :
                  t_local('listenAudio')
                }
              </Button>
            </div>

            {/* Recommendations */}
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">{t_local('recommendations')}</h2>
              
              <div className="grid lg:grid-cols-3 gap-6">
                {fertilizerRecommendations.map((fertilizer, index) => (
                  <Card key={index} className="feature-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {language === 'hindi' ? fertilizer.nameHindi : fertilizer.name}
                        </CardTitle>
                        <Badge className={getTypeColor(fertilizer.type)}>
                          {getTypeText(fertilizer.type)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Quantity & Price */}
                      <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div>
                          <Label className="text-sm font-medium">{t_local('quantity')}</Label>
                          <p className="font-bold text-primary">
                            {language === 'hindi' ? fertilizer.quantityHindi : fertilizer.quantity}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">{t_local('price')}</Label>
                          <p className="font-bold text-accent">
                            {language === 'hindi' ? fertilizer.priceHindi : fertilizer.price}
                          </p>
                        </div>
                      </div>

                      {/* Timing */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">{t_local('timing')}</Label>
                        <div className="space-y-1">
                          {(language === 'hindi' ? fertilizer.timingHindi : fertilizer.timing).map((time, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-success" />
                              {time}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Benefits */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">{t_local('benefits')}</Label>
                        <div className="space-y-1">
                          {(language === 'hindi' ? fertilizer.benefitsHindi : fertilizer.benefits).map((benefit, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="text-primary">•</span>
                              {benefit}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Safety Guidelines */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            {t_local('safetyGuidelines')}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5 text-destructive" />
                              {t_local('safetyGuidelines')}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Alert>
                              <Info className="h-4 w-4" />
                              <AlertDescription>
                                {language === 'hindi' 
                                  ? 'उर्वरक का उपयोग करते समय सुरक्षा सावधानियों का पालन करें।'
                                  : 'Follow safety precautions while using fertilizers.'
                                }
                              </AlertDescription>
                            </Alert>
                            <ul className="space-y-2">
                              {(language === 'hindi' ? fertilizer.safetyTipsHindi : fertilizer.safetyTips).map((tip, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                  <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Weekly Schedule */}
              <Card className="feature-card mt-8">
                <CardHeader>
                  <CardTitle className="text-center">
                    {language === 'hindi' ? 'साप्ताहिक उर्वरक कार्यक्रम' : 'Weekly Fertilizer Schedule'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { week: 'Week 1', activity: language === 'hindi' ? 'मिट्टी तैयारी' : 'Soil Preparation' },
                      { week: 'Week 2', activity: language === 'hindi' ? 'बेसल उर्वरक' : 'Basal Fertilizer' },
                      { week: 'Week 6', activity: language === 'hindi' ? 'पहली टॉप ड्रेसिंग' : 'First Top Dressing' },
                      { week: 'Week 10', activity: language === 'hindi' ? 'दूसरी टॉप ड्रेसिंग' : 'Second Top Dressing' },
                    ].map((schedule, index) => (
                      <div key={index} className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="font-bold text-primary">{schedule.week}</div>
                        <div className="text-sm text-muted-foreground mt-1">{schedule.activity}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
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

export default FertilizerAssistant;
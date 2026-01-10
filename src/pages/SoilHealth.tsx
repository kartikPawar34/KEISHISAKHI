import React, { useState } from 'react';
import { ArrowLeft, Upload, FileText, Download, Eye, BarChart3, Droplets, Beaker, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguageHook, Language } from '@/hooks/useLanguage';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useNavigate } from 'react-router-dom';
import { ChatAssistantBar } from '@/components/ChatAssistantBar';
import { HowToUseModal } from '@/components/HowToUseModal';

const SoilHealth = () => {
  const { language, t }: { language: Language; t: (key: string) => string } = useLanguageHook();
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [manualData, setManualData] = useState({
    ph: '',
    moisture: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    organicMatter: '',
  });
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');

  const soilHealthData = {
    ph: { value: 6.8, status: 'good', range: '6.0-7.5' },
    moisture: { value: 45, status: 'moderate', range: '40-60%' },
    nitrogen: { value: 28, status: 'low', range: '30-50 kg/ha' },
    phosphorus: { value: 18, status: 'good', range: '15-25 kg/ha' },
    potassium: { value: 35, status: 'good', range: '25-40 kg/ha' },
    organicMatter: { value: 2.1, status: 'moderate', range: '2.5-4.0%' }
  };

  const moistureTrendData = [
    { month: 'Jan', moisture: 32 },
    { month: 'Feb', moisture: 35 },
    { month: 'Mar', moisture: 42 },
    { month: 'Apr', moisture: 45 },
    { month: 'May', moisture: 38 },
    { month: 'Jun', moisture: 28 }
  ];

  const fertilityData = [
    { name: 'Excellent', value: 25, color: 'hsl(var(--success))' },
    { name: 'Good', value: 40, color: 'hsl(var(--primary))' },
    { name: 'Moderate', value: 25, color: 'hsl(var(--accent))' },
    { name: 'Poor', value: 10, color: 'hsl(var(--destructive))' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Simulate AI analysis
      setTimeout(() => setShowResults(true), 2000);
    }
  };

  const handleManualSubmit = () => {
    setShowResults(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-5 h-5 text-success" />;
      case 'moderate': return <AlertCircle className="w-5 h-5 text-accent" />;
      case 'low': return <XCircle className="w-5 h-5 text-destructive" />;
      default: return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-success text-success-foreground';
      case 'moderate': return 'bg-accent text-accent-foreground';
      case 'low': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const translations = {
    title: { hindi: 'मिट्टी स्वास्थ्य', english: 'Soil Health' },
    uploadReport: { hindi: 'मिट्टी रिपोर्ट अपलोड करें', english: 'Upload Soil Report' },
    enterManually: { hindi: 'मैन्युअल रूप से दर्ज करें', english: 'Enter Manually' },
    soilHealthCard: { hindi: 'मिट्टी स्वास्थ्य कार्ड', english: 'Soil Health Card' },
    fertilityStatus: { hindi: 'उर्वरता स्थिति', english: 'Fertility Status' },
    moisturePercent: { hindi: 'नमी प्रतिशत', english: 'Moisture %' },
    nutrientLevels: { hindi: 'पोषक तत्व स्तर', english: 'Nutrient Levels' },
    advisory: { hindi: 'सलाह', english: 'Advisory' },
    downloadPdf: { hindi: 'PDF डाउनलोड करें', english: 'Download PDF' },
    phLevel: { hindi: 'pH स्तर', english: 'pH Level' },
    nitrogen: { hindi: 'नाइट्रोजन', english: 'Nitrogen' },
    phosphorus: { hindi: 'फास्फोरस', english: 'Phosphorus' },
    potassium: { hindi: 'पोटेशियम', english: 'Potassium' },
    organicMatter: { hindi: 'जैविक पदार्थ', english: 'Organic Matter' },
    moistureTrend: { hindi: 'नमी की प्रवृत्ति', english: 'Moisture Trend' },
    analysis: { hindi: 'विश्लेषण', english: 'Analysis' },
    recommendations: { hindi: 'सिफारिशें', english: 'Recommendations' }
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
              <Beaker className="w-8 h-8 md:w-10 md:h-10 text-earth animate-bounce-gentle" />
              {t_local('title')}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              {language === 'hindi' ? 'अपनी मिट्टी का विश्लेषण करें और सुधार के तरीके जानें' : 'Analyze your soil and learn improvement methods'}
            </p>
          </div>
          <HowToUseModal
            title="Soil Health"
            titleHindi="मिट्टी स्वास्थ्य"
            instructions={[
              "Upload Soil Report → Upload PDF/JPG report",
              "Enter Data Manually → Fill fertility, moisture, nutrients",
              "Get Soil Health Card → AI generates results in farmer's language",
              "Advisory Button → Suggested crops + fertilizers",
              "Save as PDF → Share or keep record"
            ]}
            instructionsHindi={[
              "मिट्टी रिपोर्ट अपलोड करें → PDF/JPG रिपोर्ट अपलोड करें",
              "डेटा मैन्युअल रूप से दर्ज करें → उर्वरता, नमी, पोषक तत्व भरें",
              "मिट्टी स्वास्थ्य कार्ड प्राप्त करें → AI किसान की भाषा में परिणाम बनाता है",
              "सलाह बटन → सुझाई गई फसलें + उर्वरक",
              "PDF के रूप में सहेजें → साझा करें या रिकॉर्ड रखें"
            ]}
            language={language}
          />
        </div>

        {!showResults ? (
          <div className="max-w-4xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-card/50">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  {t_local('uploadReport')}
                </TabsTrigger>
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {t_local('enterManually')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-6 animate-fade-in-up">
                <Card className="feature-card group hover:shadow-[var(--shadow-magical)]">
                  <CardContent className="p-8 text-center">
                    <div className="border-2 border-dashed border-primary/30 rounded-2xl p-12 transition-all duration-300 hover:border-primary/60 hover:bg-primary/5 group-hover:scale-[1.02]">
                      <div className="bg-earth/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-bounce-gentle">
                        <Upload className="w-12 h-12 text-earth" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-foreground">
                        {language === 'hindi' ? 'मिट्टी रिपोर्ट अपलोड करें' : 'Upload Soil Report'}
                      </h3>
                      <p className="text-muted-foreground mb-6 text-sm">
                        {language === 'hindi' ? 'PDF या Image फाइल (अधिकतम 10MB)' : 'PDF or Image file (Max 10MB)'}
                      </p>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="soil-report"
                      />
                      <Label htmlFor="soil-report">
                        <Button variant="earth" size="lg" className="cursor-pointer text-base px-8 py-6">
                          <Upload className="w-5 h-5 mr-2" />
                          {language === 'hindi' ? 'फाइल चुनें' : 'Choose File'}
                        </Button>
                      </Label>
                      {uploadedFile && (
                        <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                          <p className="text-sm font-medium">{uploadedFile.name}</p>
                          <div className="mt-2">
                            <div className="text-sm text-muted-foreground mb-1">
                              {language === 'hindi' ? 'AI विश्लेषण चल रहा है...' : 'AI Analysis in progress...'}
                            </div>
                            <Progress value={75} className="w-full" />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="manual" className="space-y-6">
                <Card className="feature-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Beaker className="w-5 h-5 text-earth" />
                      {language === 'hindi' ? 'मिट्टी परीक्षण डेटा दर्ज करें' : 'Enter Soil Test Data'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="ph">{t_local('phLevel')}</Label>
                        <Input
                          id="ph"
                          type="number"
                          step="0.1"
                          placeholder="6.5"
                          value={manualData.ph}
                          onChange={(e) => setManualData({...manualData, ph: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="moisture">{language === 'hindi' ? 'नमी (%)' : 'Moisture (%)'}</Label>
                        <Input
                          id="moisture"
                          type="number"
                          placeholder="45"
                          value={manualData.moisture}
                          onChange={(e) => setManualData({...manualData, moisture: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nitrogen">{t_local('nitrogen')} (kg/ha)</Label>
                        <Input
                          id="nitrogen"
                          type="number"
                          placeholder="28"
                          value={manualData.nitrogen}
                          onChange={(e) => setManualData({...manualData, nitrogen: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phosphorus">{t_local('phosphorus')} (kg/ha)</Label>
                        <Input
                          id="phosphorus"
                          type="number"
                          placeholder="18"
                          value={manualData.phosphorus}
                          onChange={(e) => setManualData({...manualData, phosphorus: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="potassium">{t_local('potassium')} (kg/ha)</Label>
                        <Input
                          id="potassium"
                          type="number"
                          placeholder="35"
                          value={manualData.potassium}
                          onChange={(e) => setManualData({...manualData, potassium: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="organic">{t_local('organicMatter')} (%)</Label>
                        <Input
                          id="organic"
                          type="number"
                          step="0.1"
                          placeholder="2.1"
                          value={manualData.organicMatter}
                          onChange={(e) => setManualData({...manualData, organicMatter: e.target.value})}
                        />
                      </div>
                    </div>
                    <Button 
                      variant="earth" 
                      size="lg" 
                      onClick={handleManualSubmit}
                      className="w-full"
                    >
                      <BarChart3 className="w-5 h-5 mr-2" />
                      {language === 'hindi' ? 'विश्लेषण करें' : 'Analyze Soil'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Soil Health Card */}
            <Card className="feature-card max-w-6xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl flex items-center justify-center gap-3">
                  <CheckCircle className="w-8 h-8 text-success" />
                  {t_local('soilHealthCard')}
                </CardTitle>
                <div className="flex justify-center gap-4 mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="secondary">
                        <Eye className="w-4 h-4 mr-2" />
                        {t_local('advisory')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{language === 'hindi' ? 'मिट्टी सुधार सलाह' : 'Soil Improvement Advisory'}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            {language === 'hindi' 
                              ? 'आपकी मिट्टी में नाइट्रोजन की कमी है। जैविक खाद का उपयोग करें।'
                              : 'Your soil has nitrogen deficiency. Use organic fertilizers.'
                            }
                          </AlertDescription>
                        </Alert>
                        <div className="space-y-2">
                          <h4 className="font-semibold">{language === 'hindi' ? 'सुझाई गई फसलें:' : 'Suggested Crops:'}</h4>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="secondary">गेहूं / Wheat</Badge>
                            <Badge variant="secondary">चना / Chickpea</Badge>
                            <Badge variant="secondary">सरसों / Mustard</Badge>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="earth">
                    <Download className="w-4 h-4 mr-2" />
                    {t_local('downloadPdf')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Key Metrics */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 rounded-xl bg-success/10 border border-success/20">
                    <CheckCircle className="w-12 h-12 text-success mx-auto mb-2" />
                    <h3 className="font-semibold text-lg">{t_local('fertilityStatus')}</h3>
                    <p className="text-2xl font-bold text-success mt-2">
                      {language === 'hindi' ? 'अच्छा' : 'Good'}
                    </p>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-primary/10 border border-primary/20">
                    <Droplets className="w-12 h-12 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold text-lg">{t_local('moisturePercent')}</h3>
                    <p className="text-2xl font-bold text-primary mt-2">45%</p>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-accent/10 border border-accent/20">
                    <TrendingUp className="w-12 h-12 text-accent mx-auto mb-2" />
                    <h3 className="font-semibold text-lg">{t_local('nutrientLevels')}</h3>
                    <p className="text-2xl font-bold text-accent mt-2">
                      {language === 'hindi' ? 'मध्यम' : 'Moderate'}
                    </p>
                  </div>
                </div>

                {/* Detailed Analysis */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">{t_local('analysis')}</h3>
                    <div className="space-y-3">
                      {Object.entries(soilHealthData).map(([key, data]) => (
                        <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-card border">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(data.status)}
                            <div>
                              <p className="font-medium">
                                {key === 'ph' ? t_local('phLevel') :
                                 key === 'moisture' ? language === 'hindi' ? 'नमी' : 'Moisture' :
                                 key === 'nitrogen' ? t_local('nitrogen') :
                                 key === 'phosphorus' ? t_local('phosphorus') :
                                 key === 'potassium' ? t_local('potassium') :
                                 t_local('organicMatter')}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {language === 'hindi' ? 'आदर्श:' : 'Ideal:'} {data.range}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{data.value}{key === 'ph' ? '' : key === 'moisture' || key === 'organicMatter' ? '%' : ' kg/ha'}</p>
                            <Badge className={getStatusColor(data.status)} variant="secondary">
                              {data.status === 'good' ? (language === 'hindi' ? 'अच्छा' : 'Good') :
                               data.status === 'moderate' ? (language === 'hindi' ? 'मध्यम' : 'Moderate') :
                               (language === 'hindi' ? 'कम' : 'Low')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Moisture Trend Chart */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">{t_local('moistureTrend')}</h3>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={moistureTrendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                            <YAxis stroke="hsl(var(--muted-foreground))" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line 
                              type="monotone" 
                              dataKey="moisture" 
                              stroke="hsl(var(--primary))" 
                              strokeWidth={3}
                              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Fertility Distribution */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">
                        {language === 'hindi' ? 'उर्वरता वितरण' : 'Fertility Distribution'}
                      </h3>
                      <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={fertilityData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {fertilityData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <ChartTooltip content={<ChartTooltipContent />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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

export default SoilHealth;
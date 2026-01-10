import React from 'react';
import { Info, Upload, Edit, FileText, Download, CheckCircle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';

interface HowToUseModalProps {
  title: string;
  titleHindi: string;
  instructions: string[];
  instructionsHindi: string[];
  language: 'english' | 'hindi';
}

// Icon mapping for common instruction types
const getStepIcon = (index: number, instruction: string) => {
  const lowerInstruction = instruction.toLowerCase();
  
  if (lowerInstruction.includes('upload') || lowerInstruction.includes('अपलोड')) {
    return <Upload className="w-6 h-6 text-earth" />;
  }
  if (lowerInstruction.includes('enter') || lowerInstruction.includes('manual') || lowerInstruction.includes('दर्ज')) {
    return <Edit className="w-6 h-6 text-primary" />;
  }
  if (lowerInstruction.includes('card') || lowerInstruction.includes('get') || lowerInstruction.includes('कार्ड')) {
    return <FileText className="w-6 h-6 text-success" />;
  }
  if (lowerInstruction.includes('advisory') || lowerInstruction.includes('click') || lowerInstruction.includes('सलाह')) {
    return <Lightbulb className="w-6 h-6 text-accent" />;
  }
  if (lowerInstruction.includes('download') || lowerInstruction.includes('pdf') || lowerInstruction.includes('डाउनलोड')) {
    return <Download className="w-6 h-6 text-sky" />;
  }
  if (lowerInstruction.includes('select') || lowerInstruction.includes('check') || lowerInstruction.includes('चुनें')) {
    return <CheckCircle className="w-6 h-6 text-primary" />;
  }
  
  // Default icon based on index
  return <span className="text-2xl">{['🧪', '✍️', '🌱', '💡', '⬇️', '📱'][index] || '📌'}</span>;
};

export const HowToUseModal: React.FC<HowToUseModalProps> = ({
  title,
  titleHindi,
  instructions,
  instructionsHindi,
  language
}) => {
  const currentTitle = language === 'hindi' ? titleHindi : title;
  const currentInstructions = language === 'hindi' ? instructionsHindi : instructions;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10 text-primary hover:scale-110 transition-all duration-300"
          title={language === 'hindi' ? 'उपयोग कैसे करें' : 'How to Use'}
        >
          <Info className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="bg-primary/10 p-2 rounded-xl">
              <Info className="w-7 h-7 text-primary" />
            </div>
            <div>
              <div className="text-gradient-primary">
                {language === 'hindi' ? 'उपयोग गाइड' : 'How to Use'}
              </div>
              <div className="text-base font-normal text-muted-foreground mt-1">
                {currentTitle}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          {currentInstructions.map((instruction, index) => {
            // Split instruction by arrow or dash to get title and description
            const parts = instruction.split(/→|–|—|-/).map(p => p.trim());
            const hasMultipleParts = parts.length > 1;
            const stepTitle = hasMultipleParts ? parts[0] : instruction;
            const stepDescription = hasMultipleParts ? parts.slice(1).join(' ') : '';

            return (
              <Card 
                key={index} 
                className="feature-card group hover:shadow-[var(--shadow-card)] transition-all duration-300 border-l-4 border-l-primary/40 hover:border-l-primary"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {getStepIcon(index, instruction)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-base text-foreground leading-tight">
                          {stepTitle}
                        </h4>
                        <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                      </div>
                      {stepDescription && (
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                          {stepDescription}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tip Card */}
        <Card className="mt-6 bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-foreground">
                {language === 'hindi' 
                  ? '💡 सुझाव: किसी भी समय चैट असिस्टेंट से मदद मांग सकते हैं!'
                  : '💡 Tip: You can ask the Chat Assistant for help anytime!'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

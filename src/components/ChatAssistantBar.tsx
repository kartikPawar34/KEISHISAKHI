import React, { useState } from 'react';
import { Camera, Mic, Send, Upload } from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface ChatAssistantBarProps {
  onSendMessage?: (message: string) => void;
  onImageUpload?: (file: File) => void;
  onVoiceInput?: () => void;
}

export const ChatAssistantBar: React.FC<ChatAssistantBarProps> = ({
  onSendMessage,
  onImageUpload,
  onVoiceInput
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSendMessage = () => {
    if (message.trim() && onSendMessage) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageUpload) {
      onImageUpload(file);
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    if (onVoiceInput) {
      onVoiceInput();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-background via-background/98 to-background/95 backdrop-blur-lg border-t border-primary/20 shadow-[0_-4px_24px_hsl(var(--primary)/0.1)]">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card/90 backdrop-blur-md border-2 border-primary/15 shadow-[var(--shadow-card)] rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gradient-to-r from-primary/5 via-transparent to-accent/5">
              {/* Camera/Upload Button */}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="chat-image-upload"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 md:h-12 md:w-12 rounded-xl hover:bg-primary/10 text-primary hover:scale-110 transition-all duration-300 border border-primary/20 hover:border-primary/40"
                  onClick={() => document.getElementById('chat-image-upload')?.click()}
                >
                  <Camera className="w-5 h-5" />
                </Button>
              </div>

              {/* Mic Button */}
              <Button
                variant="ghost"
                size="icon"
                className={`h-11 w-11 md:h-12 md:w-12 rounded-xl transition-all duration-300 border ${
                  isRecording 
                    ? 'text-destructive bg-destructive/10 border-destructive/30 animate-pulse' 
                    : 'text-accent hover:bg-accent/10 border-accent/20 hover:border-accent/40 hover:scale-110'
                }`}
                onClick={handleVoiceInput}
              >
                <Mic className="w-5 h-5" />
              </Button>

              {/* Text Input */}
              <div className="flex-1">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="🌾 Ask Krishi Sakhi..."
                  className="h-11 md:h-12 text-base border-primary/10 bg-background/60 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/30 rounded-xl placeholder:text-muted-foreground/60 transition-all"
                />
              </div>

              {/* Send Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 md:h-12 md:w-12 rounded-xl bg-[var(--gradient-primary)] text-primary-foreground hover:shadow-[var(--shadow-glow)] hover:scale-110 transition-all duration-300 disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none border-none"
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
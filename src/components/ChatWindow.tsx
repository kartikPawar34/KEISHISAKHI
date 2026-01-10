import React, { useState, useRef, useEffect } from 'react';
import { Camera, Mic, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLanguageHook } from '@/hooks/useLanguage';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatWindowProps {
  onSendMessage?: (message: string) => void;
  onImageUpload?: (file: File) => void;
  onVoiceInput?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  onSendMessage,
  onImageUpload,
  onVoiceInput
}) => {
  const { language } = useLanguageHook();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: language === 'hindi' 
        ? 'नमस्ते! मैं कृषि सखी हूं। मैं आपकी खेती में कैसे मदद कर सकती हूं? 🌾'
        : 'Hello! I am Krishi Sakhi. How can I help you with farming today? 🌾',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date()
      };
      setMessages([...messages, userMessage]);
      
      if (onSendMessage) {
        onSendMessage(message);
      }
      
      setMessage('');
      
      // Simulate AI typing
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: language === 'hindi'
            ? 'मैं आपकी मदद करने के लिए यहां हूं। कृपया अपना सवाल विस्तार से पूछें। 🌱'
            : "I'm here to help you. Please ask your question in detail. 🌱",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }, 2000);
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageUpload) {
      onImageUpload(file);
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: language === 'hindi' ? '📷 फोटो भेजी' : '📷 Photo uploaded',
        timestamp: new Date()
      };
      setMessages([...messages, userMessage]);
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    if (onVoiceInput) {
      onVoiceInput();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-gradient-to-b from-muted/30 to-background rounded-2xl border border-primary/10 shadow-[var(--shadow-card)] overflow-hidden">
      {/* Chat Header */}
      <div className="bg-[var(--gradient-primary)] text-primary-foreground p-4 flex items-center gap-3 shadow-md">
        <div className="bg-white/20 rounded-full p-2">
          <Bot className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg">
            {language === 'hindi' ? 'कृषि सखी - AI सहायक' : 'Krishi Sakhi - AI Assistant'}
          </h3>
          <p className="text-xs text-primary-foreground/80">
            {language === 'hindi' ? 'हमेशा उपलब्ध' : 'Always available'}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-pattern-dots">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 animate-fade-in-up ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <Avatar className={`w-8 h-8 flex-shrink-0 ${msg.role === 'user' ? 'bg-success' : 'bg-primary'}`}>
              <AvatarFallback className="text-white">
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </AvatarFallback>
            </Avatar>

            {/* Message Bubble */}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-success text-success-foreground rounded-br-sm'
                  : 'bg-card border border-border text-foreground rounded-bl-sm'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <p className={`text-xs mt-1 ${
                msg.role === 'user' ? 'text-success-foreground/70' : 'text-muted-foreground'
              }`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-end gap-2 animate-fade-in-up">
            <Avatar className="w-8 h-8 bg-primary">
              <AvatarFallback className="text-white">
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {/* Camera/Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleImageUpload}
            className="h-10 w-10 rounded-full hover:bg-primary/10 text-primary hover:scale-110 transition-all"
            title={language === 'hindi' ? 'फोटो अपलोड करें' : 'Upload Photo'}
          >
            <Camera className="w-5 h-5" />
          </Button>

          {/* Microphone Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleVoiceInput}
            className={`h-10 w-10 rounded-full transition-all hover:scale-110 ${
              isRecording 
                ? 'bg-destructive/10 text-destructive animate-pulse' 
                : 'hover:bg-accent/10 text-accent'
            }`}
            title={language === 'hindi' ? 'आवाज रिकॉर्ड करें' : 'Voice Input'}
          >
            <Mic className="w-5 h-5" />
          </Button>

          {/* Text Input */}
          <Input
            type="text"
            placeholder={language === 'hindi' ? '🌾 कृषि सखी से पूछें...' : '🌾 Ask Krishi Sakhi...'}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 h-10 rounded-full border-primary/20 focus-visible:ring-primary/30 bg-background/60 px-4"
          />

          {/* Send Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="h-10 w-10 rounded-full bg-[var(--gradient-primary)] text-primary-foreground hover:shadow-[var(--shadow-glow)] hover:scale-110 transition-all disabled:opacity-40 disabled:hover:scale-100"
            title={language === 'hindi' ? 'भेजें' : 'Send'}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

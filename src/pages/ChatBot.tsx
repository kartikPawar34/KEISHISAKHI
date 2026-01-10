import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  User, 
  Send, 
  Mic, 
  MicOff, 
  Camera, 
  ArrowLeft, 
  Languages,
  Volume2,
  VolumeX,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  type?: "text" | "image";
  imageUrl?: string;
}

const ChatBot = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("hindi");
  const getWelcomeMessage = () => {
    return language === "hindi" 
      ? "नमस्ते! मैं कृषि सखी का AI सहायक हूं। आप मुझसे खेती, फसल, मिट्टी, मौसम, और सरकारी योजनाओं के बारे में कुछ भी पूछ सकते हैं। 🌾"
      : "Hello! I'm Krishi Sakhi's AI assistant. You can ask me anything about farming, crops, soil, weather, and government schemes. 🌾";
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: getWelcomeMessage(),
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Create a placeholder for the bot's streaming response
    const botMessageId = (Date.now() + 1).toString();
    let assistantContent = "";

    setMessages(prev => [...prev, {
      id: botMessageId,
      text: "",
      sender: "bot",
      timestamp: new Date()
    }]);

    try {
      const response = await fetch(
        `https://dxdsimyktdxiogjuvids.supabase.co/functions/v1/farming-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4ZHNpbXlrdGR4aW9nanV2aWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4OTIzMjcsImV4cCI6MjA3NDQ2ODMyN30.LT3fnuyRVH2EMVOsySQayzAIVN-etKQ1XxQFaHKjxwE`,
          },
          body: JSON.stringify({
            messages: messages
              .filter(m => m.sender === "user" || m.sender === "bot")
              .map(m => ({ 
                role: m.sender === "user" ? "user" : "assistant", 
                content: m.text 
              }))
              .concat([{ role: "user", content: inputMessage }]),
            language
          })
        }
      );

      if (!response.ok || !response.body) {
        throw new Error('Failed to start stream');
      }

      // Read the stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split('\n');
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim() || line.startsWith(':')) continue;
          if (!line.startsWith('data: ')) continue;
          
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            
            if (content) {
              assistantContent += content;
              setMessages(prev => prev.map(m => 
                m.id === botMessageId 
                  ? { ...m, text: assistantContent }
                  : m
              ));
            }
          } catch (e) {
            console.error('JSON parse error:', e);
          }
        }
      }

      // Play the complete response as speech if enabled
      if (isSpeaking && assistantContent) {
        await playTextAsSpeech(assistantContent);
      }

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: language === "hindi" ? "त्रुटि" : "Error",
        description: language === "hindi" 
          ? "कुछ गलत हुआ। कृपया पुनः प्रयास करें।"
          : "Something went wrong. Please try again.",
        variant: "destructive"
      });
      
      // Remove the empty bot message on error
      setMessages(prev => prev.filter(m => m.id !== botMessageId));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceToggle = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Convert to base64
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Audio = reader.result?.toString().split(',')[1];
            
            if (base64Audio) {
              try {
                // Transcribe audio
                const response = await fetch(
                  'https://dxdsimyktdxiogjuvids.supabase.co/functions/v1/speech-to-text',
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4ZHNpbXlrdGR4aW9nanV2aWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4OTIzMjcsImV4cCI6MjA3NDQ2ODMyN30.LT3fnuyRVH2EMVOsySQayzAIVN-etKQ1XxQFaHKjxwE`,
                    },
                    body: JSON.stringify({ audio: base64Audio })
                  }
                );

                const data = await response.json();
                
                if (data.text) {
                  setInputMessage(data.text);
                  toast({
                    title: language === "hindi" ? "आवाज पहचानी गई" : "Voice Recognized",
                    description: data.text
                  });
                }
              } catch (error) {
                console.error('Transcription error:', error);
                toast({
                  title: language === "hindi" ? "त्रुटि" : "Error",
                  description: language === "hindi" 
                    ? "आवाज को टेक्स्ट में बदलने में समस्या"
                    : "Failed to convert voice to text",
                  variant: "destructive"
                });
              }
            }
          };

          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        toast({
          title: language === "hindi" ? "आवाज रिकॉर्डिंग" : "Voice Recording",
          description: language === "hindi" ? "बोलना शुरू करें..." : "Start speaking..."
        });
      } catch (error) {
        console.error('Microphone access error:', error);
        toast({
          title: language === "hindi" ? "त्रुटि" : "Error",
          description: language === "hindi" 
            ? "माइक्रोफोन एक्सेस नहीं मिला"
            : "Microphone access denied",
          variant: "destructive"
        });
      }
    } else {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      toast({
        title: language === "hindi" ? "रिकॉर्डिंग बंद" : "Recording Stopped",
        description: language === "hindi" ? "संदेश तैयार हो रहा है..." : "Processing message..."
      });
    }
  };

  const handleImageUpload = () => {
    toast({
      title: language === "hindi" ? "फोटो अपलोड" : "Photo Upload",
      description: language === "hindi" ? "कैमरा खुल रहा है..." : "Opening camera..."
    });
  };

  const handleLanguageToggle = () => {
    const newLang = language === "hindi" ? "english" : "hindi";
    setLanguage(newLang);
    toast({
      title: newLang === "hindi" ? "हिंदी" : "English",
      description: newLang === "hindi" 
        ? "भाषा हिंदी में बदल गई" 
        : "Language switched to English"
    });
  };

  const handleSpeakToggle = () => {
    setIsSpeaking(!isSpeaking);
    toast({
      title: isSpeaking 
        ? (language === "hindi" ? "आवाज बंद" : "Voice Off")
        : (language === "hindi" ? "आवाज चालू" : "Voice On"),
      description: isSpeaking 
        ? (language === "hindi" ? "टेक्स्ट मोड में बदल गया" : "Switched to text mode")
        : (language === "hindi" ? "संदेश सुनाए जाएंगे" : "Messages will be spoken")
    });
  };

  const playTextAsSpeech = async (text: string) => {
    if (!isSpeaking) return;

    try {
      const response = await fetch(
        'https://dxdsimyktdxiogjuvids.supabase.co/functions/v1/text-to-speech',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4ZHNpbXlrdGR4aW9nanV2aWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4OTIzMjcsImV4cCI6MjA3NDQ2ODMyN30.LT3fnuyRVH2EMVOsySQayzAIVN-etKQ1XxQFaHKjxwE`,
          },
          body: JSON.stringify({ text, voice: 'alloy' })
        }
      );

      const data = await response.json();
      
      if (data.audioContent) {
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
          { type: 'audio/mp3' }
        );
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      }
    } catch (error) {
      console.error('Text-to-speech error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/farmer-dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">
              {language === "hindi" ? "कृषि सखी AI" : "Krishi Sakhi AI"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {language === "hindi" ? "ऑनलाइन • तुरंत उत्तर" : "Online • Instant replies"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleSpeakToggle}>
            {isSpeaking ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLanguageToggle}>
            <Languages className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Language Info */}
      <div className="p-3 bg-muted/50 text-center">
        <Badge variant="secondary" className="text-xs">
          {language === "hindi" 
            ? "हिंदी • आवाज और टेक्स्ट दोनों समर्थित" 
            : "English • Voice and text both supported"
          }
        </Badge>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
          >
            <div className={`flex gap-3 max-w-[85%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className={message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}>
                  {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              
              <Card className={`${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-card"} shadow-sm`}>
                <CardContent className="p-3">
                  {message.type === "image" && message.imageUrl && (
                    <img 
                      src={message.imageUrl} 
                      alt="Uploaded" 
                      className="w-full h-32 object-cover rounded-md mb-2"
                    />
                  )}
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 ${message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {message.timestamp.toLocaleTimeString('hi-IN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {[
            language === "hindi" ? "आज का मौसम" : "Today's weather",
            language === "hindi" ? "फसल सुझाव" : "Crop suggestions", 
            language === "hindi" ? "मिट्टी जांच" : "Soil testing",
            language === "hindi" ? "सरकारी योजना" : "Govt schemes"
          ].map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="whitespace-nowrap"
              onClick={() => setInputMessage(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex items-center gap-2 bg-muted rounded-lg p-2">
          <Button variant="ghost" size="icon" onClick={handleImageUpload}>
            <Camera className="h-5 w-5" />
          </Button>
          
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={language === "hindi" ? "यहाँ लिखें या बोलें..." : "Type or speak here..."}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleVoiceToggle}
            className={isRecording ? "text-destructive animate-pulse" : ""}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          
          <Button 
            size="icon" 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
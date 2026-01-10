import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language = 'hindi' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // System prompt tailored for farming in Hindi/English
    const systemPrompt = language === 'hindi' 
      ? `आप कृषि सखी के AI सहायक हैं। आप भारतीय किसानों को खेती, फसल, मिट्टी, मौसम, उर्वरक, कीट नियंत्रण, और सरकारी योजनाओं के बारे में मदद करते हैं। 

आपकी जिम्मेदारियाँ:
- सरल और स्पष्ट हिंदी में उत्तर दें
- व्यावहारिक और कार्यान्वयन योग्य सुझाव दें
- स्थानीय भारतीय परिस्थितियों को ध्यान में रखें
- सरकारी योजनाओं की जानकारी प्रदान करें
- मौसम के अनुसार फसल सुझाव दें
- जैविक खेती को बढ़ावा दें
- किसानों की भाषा में बात करें

संक्षिप्त और मददगार रहें। इमोजी का उपयोग करें जैसे 🌾 🌱 ☀️ 🌧️ 💧`
      : `You are Krishi Sakhi's AI assistant. You help Indian farmers with farming, crops, soil, weather, fertilizers, pest control, and government schemes.

Your responsibilities:
- Provide answers in clear English
- Give practical and actionable suggestions
- Consider local Indian conditions
- Provide information about government schemes
- Suggest crops according to seasons
- Promote organic farming
- Speak in farmer-friendly language

Be brief and helpful. Use emojis like 🌾 🌱 ☀️ 🌧️ 💧`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI gateway error');
    }

    // Return the stream directly
    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error('Chat error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

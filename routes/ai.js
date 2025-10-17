import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

// Initialize OpenAI (optional - will work without API key)
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

router.post('/generate', async (req, res) => {
  try {
    const { prompt, type } = req.body;

    if (!openai) {
      // Mock AI response when no API key is provided
      const mockResponses = {
        script: `Here's a script idea based on your prompt "${prompt}":\n\nSCENE 1 - INT. COFFEE SHOP - DAY\nCharacters discuss ${prompt}. The scene builds tension through dialogue and reveals character motivations.`,
        storyboard: `Storyboard for "${prompt}":\n1. Establishing shot setting the scene\n2. Character introduction\n3. Conflict development\n4. Resolution frame`,
        research: `Research insights for "${prompt}":\n- Key trends and patterns\n- Audience preferences\n- Market opportunities\n- Potential challenges`
      };

      return res.json({
        success: true,
        data: mockResponses[type] || `AI generated content for: ${prompt}`,
        message: 'Mock AI response (add OPENAI_API_KEY for real AI)'
      });
    }

    // Real AI generation
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a creative assistant for pre-production content creation." },
        { role: "user", content: prompt }
      ],
      max_tokens: 500
    });

    res.json({
      success: true,
      data: completion.choices[0].message.content,
      message: 'AI generated successfully'
    });

  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating AI content',
      error: error.message
    });
  }
});

export default router;
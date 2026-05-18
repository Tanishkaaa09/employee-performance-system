const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
    baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
});

exports.getRecommendation = async (req, res) => {
    try {
        const { employee } = req.body;
        if (!employee) return res.status(400).json({ error: 'Employee data is required' });

        const prompt = `Analyze the following employee data and provide a short, professional recommendation covering Promotion Recommendation, Employee Ranking Context, Training Suggestions, and General Feedback.
        
Employee Data:
- Name: ${employee.name}
- Department: ${employee.department}
- Skills: ${employee.skills.join(', ')}
- Performance Score: ${employee.performanceScore}/100
- Years of Experience: ${employee.experience}

Format the output cleanly.`;

        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openrouter_or_openai_api_key_here') {
             return res.json({
                recommendation: `[MOCK AI RESPONSE - ADD API KEY TO .ENV]
Based on the performance score of ${employee.performanceScore}, here is the evaluation:
- Promotion Recommendation: ${employee.performanceScore > 85 ? 'Highly Recommended' : 'Not Recommended at this time.'}
- Training Suggestions: Focus on improving core skills.
- General Feedback: Keep up the good work.`
             });
        }

        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
        });

        res.json({ recommendation: completion.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

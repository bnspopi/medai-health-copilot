import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function analyzeSymptomsWithAI(symptoms: string): Promise<any> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a medical AI assistant. Analyze symptoms and provide a differential diagnosis.
          Return JSON with this structure:
          {
            "differential_diagnosis": [
              {"condition": "...", "confidence": 90, "severity": "moderate", "icd_code": "..."}
            ],
            "red_flags": ["..."],
            "next_steps": ["..."],
            "general_advice": "..."
          }`,
        },
        {
          role: 'user',
          content: `Please analyze these symptoms and provide a differential diagnosis: ${symptoms}`,
        },
      ],
      temperature: 0.7,
    })

    const content = response.choices[0]?.message?.content || '{}'
    try {
      return JSON.parse(content)
    } catch {
      return {
        differential_diagnosis: [
          {
            condition: 'Unable to parse response',
            confidence: 0,
            severity: 'unknown',
          },
        ],
        red_flags: [],
        next_steps: [],
        general_advice: content,
      }
    }
  } catch (error) {
    console.error('Error analyzing symptoms:', error)
    throw error
  }
}

export async function analyzeImageWithVision(imageBase64: string): Promise<any> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision',
      messages: [
        {
          role: 'system',
          content: `You are a dermatology AI assistant. Analyze skin images and provide assessment.
          Return JSON with this structure:
          {
            "findings": "...",
            "possible_conditions": [
              {"condition": "...", "confidence": 90, "severity": "..."}
            ],
            "abcde_assessment": {
              "asymmetry": "...",
              "border": "...",
              "color": "...",
              "diameter": "...",
              "evolution": "..."
            },
            "recommendations": ["..."],
            "urgency": "routine|urgent|emergency"
          }`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Please analyze this skin image and provide a dermatological assessment.',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1024,
    })

    const content = response.choices[0]?.message?.content || '{}'
    try {
      return JSON.parse(content)
    } catch {
      return {
        findings: content,
        possible_conditions: [],
        abcde_assessment: {},
        recommendations: [],
        urgency: 'routine',
      }
    }
  } catch (error) {
    console.error('Error analyzing image:', error)
    throw error
  }
}

export async function generateHealthTrends(diagnoses: any[]): Promise<any> {
  try {
    const diagnosesText = diagnoses
      .map(
        (d) => `Date: ${d.created_at}, Symptoms: ${d.symptoms}, Diagnosis: ${JSON.stringify(d.diagnosis_data)}`
      )
      .join('\n')

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Analyze health diagnosis history and provide trends.
          Return JSON with this structure:
          {
            "most_diagnosed_conditions": ["..."],
            "monthly_volume": {"January": 2, "February": 1, ...},
            "diagnostic_accuracy_trend": [90, 92, 88, ...],
            "seasonal_patterns": "...",
            "recommendations": ["..."]
          }`,
        },
        {
          role: 'user',
          content: `Please analyze these diagnoses and provide health trends: ${diagnosesText}`,
        },
      ],
    })

    const content = response.choices[0]?.message?.content || '{}'
    try {
      return JSON.parse(content)
    } catch {
      return {
        most_diagnosed_conditions: [],
        monthly_volume: {},
        diagnostic_accuracy_trend: [],
        seasonal_patterns: '',
        recommendations: [],
      }
    }
  } catch (error) {
    console.error('Error generating health trends:', error)
    throw error
  }
}

const BASE = 'https://api.openai.com/v1';
const apiKey = () => import.meta.env.VITE_OPENAI_API_KEY;

const NAVIGATE_PROMPT =
  'You are assisting a blind person navigating with their phone camera. ' +
  'Describe what is directly ahead in 1-2 short sentences. ' +
  'Focus on: obstacles, steps, curbs, doors, signs, people, hazards. ' +
  'If the path appears clear, say only "Path clear." Be direct and actionable.';

const ASK_PROMPT =
  'You are a visual assistant for a blind person. ' +
  'Answer their question about what you see in the image clearly and specifically. ' +
  'Keep your answer to 2-4 sentences.';

export async function describeScene(base64Jpeg) {
  const res = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey()}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 80,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: NAVIGATE_PROMPT },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Jpeg}`,
                detail: 'low',
              },
            },
          ],
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Vision API error ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

export async function answerQuestion(base64Jpeg, question) {
  const res = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey()}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: `${ASK_PROMPT}\n\nQuestion: ${question}` },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Jpeg}`,
                detail: 'high',
              },
            },
          ],
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Vision API error ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

export async function textToSpeech(text) {
  const res = await fetch(`${BASE}/audio/speech`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey()}`,
    },
    body: JSON.stringify({ model: 'tts-1', voice: 'nova', input: text }),
  });
  if (!res.ok) throw new Error(`TTS API error ${res.status}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

export async function transcribeAudio(audioBlob) {
  const form = new FormData();
  form.append('file', audioBlob, 'recording.webm');
  form.append('model', 'whisper-1');
  const res = await fetch(`${BASE}/audio/transcriptions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey()}` },
    body: form,
  });
  if (!res.ok) throw new Error(`Whisper API error ${res.status}`);
  const data = await res.json();
  return data.text?.trim() || null;
}

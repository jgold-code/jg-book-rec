import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface BookRecommendation {
  title: string;
  author: string;
  reason?: string;
}

export async function getBookRecommendations(
  userPreferences: string
): Promise<BookRecommendation[]> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a knowledgeable book recommender. When given user preferences, recommend 5-6 books that match their interests. Format your response as a JSON array with objects containing "title", "author", and "reason" fields. Only respond with the JSON array, no additional text.',
          },
          {
            role: 'user',
            content: `Based on these preferences, recommend books: ${userPreferences}`,
          },
        ],
        temperature: 0.8,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const content = response.data.choices[0].message.content;
    
    // Parse the JSON response
    try {
      const recommendations = JSON.parse(content);
      return Array.isArray(recommendations) ? recommendations : [];
    } catch (parseError) {
      // If JSON parsing fails, try to extract book info from text
      console.error('Failed to parse JSON, attempting text extraction', parseError);
      return extractBooksFromText(content);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `OpenAI API error: ${error.response?.data?.error?.message || error.message}`
      );
    }
    throw error;
  }
}

// Fallback function to extract books from text response
function extractBooksFromText(text: string): BookRecommendation[] {
  const books: BookRecommendation[] = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    // Try to match patterns like "Title by Author" or "Title - Author"
    const match = line.match(/["']?([^"']+)["']?\s+(?:by|-)\s+([^,\n]+)/i);
    if (match) {
      books.push({
        title: match[1].trim(),
        author: match[2].trim(),
      });
    }
  }
  
  return books;
}


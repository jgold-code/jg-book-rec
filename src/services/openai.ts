import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface BookRecommendation {
  id: string;
  title: string;
  authors: string[];
  description: string;
  imageUrl: string;
  averageRating?: number;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  reason: string;
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
              'You are a knowledgeable book recommender. When given user preferences, recommend 5-6 books that match their interests. For each book, provide detailed information. Format your response as a JSON array with objects containing these fields: "title" (string), "authors" (array of strings), "description" (2-3 sentence summary), "reason" (why you recommend it for their preferences), "publishedDate" (year as string), "pageCount" (approximate number), "categories" (array with 1-2 genre strings), "averageRating" (number 0-5). Only respond with the JSON array, no additional text.',
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
      if (Array.isArray(recommendations)) {
        // Add ID and placeholder image for each book
        return recommendations.map((book, index) => ({
          id: `book-${index}-${Date.now()}`,
          title: book.title || 'Unknown Title',
          authors: Array.isArray(book.authors) ? book.authors : [book.authors || book.author || 'Unknown Author'],
          description: book.description || 'A great book worth reading.',
          imageUrl: generateBookCoverUrl(book.title),
          averageRating: book.averageRating || undefined,
          publishedDate: book.publishedDate || undefined,
          pageCount: book.pageCount || undefined,
          categories: Array.isArray(book.categories) ? book.categories : book.categories ? [book.categories] : undefined,
          reason: book.reason || 'Matches your preferences',
        }));
      }
      return [];
    } catch (parseError) {
      console.error('Failed to parse JSON response', parseError);
      throw new Error('Failed to parse AI response. Please try again.');
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

// Generate a placeholder book cover with the title
function generateBookCoverUrl(title: string): string {
  const encodedTitle = encodeURIComponent(title.substring(0, 50));
  return `https://via.placeholder.com/200x300/4F46E5/FFFFFF?text=${encodedTitle}`;
}


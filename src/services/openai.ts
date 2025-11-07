import axios from 'axios';
import { fetchMultipleBookCovers } from './bookCovers';

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
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are a knowledgeable book recommender. When given user preferences, recommend 10 diverse books that match their interests. For each book, provide detailed information. Format your response as a JSON array with objects containing these fields: "title" (string), "authors" (array of strings), "description" (2-3 sentence summary), "reason" (why you recommend it for their preferences), "publishedDate" (year as string), "pageCount" (approximate number), "categories" (array with 1-2 genre strings), "averageRating" (number 0-5). Only respond with the JSON array, no additional text.',
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
      // GPT-4 sometimes wraps JSON in markdown code blocks, so we need to extract it
      let jsonContent = content.trim();
      
      // Remove markdown code block formatting if present
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      // Try to parse the JSON
      const recommendations = JSON.parse(jsonContent);
      
      if (Array.isArray(recommendations) && recommendations.length > 0) {
        // Prepare books data
        const booksData = recommendations.map((book, index) => ({
          id: `book-${index}-${Date.now()}`,
          title: book.title || 'Unknown Title',
          authors: Array.isArray(book.authors) ? book.authors : [book.authors || book.author || 'Unknown Author'],
          description: book.description || 'A great book worth reading.',
          imageUrl: '', // Will be fetched
          averageRating: book.averageRating || undefined,
          publishedDate: book.publishedDate || undefined,
          pageCount: book.pageCount || undefined,
          categories: Array.isArray(book.categories) ? book.categories : book.categories ? [book.categories] : undefined,
          reason: book.reason || 'Matches your preferences',
        }));

        // Fetch real book covers
        const coverUrls = await fetchMultipleBookCovers(
          booksData.map(book => ({
            title: book.title,
            author: book.authors[0] || 'Unknown'
          }))
        );

        // Assign cover URLs to books
        return booksData.map((book, index) => ({
          ...book,
          imageUrl: coverUrls[index] || generateBookCoverUrl(book.title)
        }));
      }
      
      console.error('No valid recommendations in response');
      throw new Error('No recommendations found in response.');
    } catch (parseError) {
      console.error('Failed to parse JSON response', parseError);
      console.error('Raw content:', content);
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


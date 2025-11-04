import axios from 'axios';

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';

interface BookCoverResult {
  imageUrl: string;
}

export async function fetchBookCover(
  title: string,
  author: string
): Promise<string> {
  try {
    // Search for the book using title and author
    const query = `intitle:${title} inauthor:${author}`;
    const url = `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(query)}&maxResults=1`;

    const response = await axios.get(url);

    if (response.data.items && response.data.items.length > 0) {
      const book = response.data.items[0];
      const volumeInfo = book.volumeInfo;
      
      // Try to get the highest quality image available
      const imageUrl = 
        volumeInfo.imageLinks?.large ||
        volumeInfo.imageLinks?.medium ||
        volumeInfo.imageLinks?.thumbnail ||
        volumeInfo.imageLinks?.smallThumbnail;
      
      if (imageUrl) {
        // Replace http with https for security
        return imageUrl.replace('http:', 'https:');
      }
    }

    // If no cover found, try searching with just the title
    const titleQuery = `intitle:${title}`;
    const titleUrl = `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(titleQuery)}&maxResults=1`;
    
    const titleResponse = await axios.get(titleUrl);
    
    if (titleResponse.data.items && titleResponse.data.items.length > 0) {
      const book = titleResponse.data.items[0];
      const volumeInfo = book.volumeInfo;
      
      const imageUrl = 
        volumeInfo.imageLinks?.large ||
        volumeInfo.imageLinks?.medium ||
        volumeInfo.imageLinks?.thumbnail ||
        volumeInfo.imageLinks?.smallThumbnail;
      
      if (imageUrl) {
        return imageUrl.replace('http:', 'https:');
      }
    }
  } catch (error) {
    console.error('Error fetching book cover:', error);
  }

  // Return placeholder if no cover found
  const encodedTitle = encodeURIComponent(title.substring(0, 30));
  return `https://via.placeholder.com/200x300/4F46E5/FFFFFF?text=${encodedTitle}`;
}

export async function fetchMultipleBookCovers(
  books: Array<{ title: string; author: string }>
): Promise<string[]> {
  // Fetch covers sequentially with a small delay to avoid rate limiting
  const covers: string[] = [];
  
  for (const book of books) {
    const cover = await fetchBookCover(book.title, book.author);
    covers.push(cover);
    // Small delay to be nice to the API
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  return covers;
}


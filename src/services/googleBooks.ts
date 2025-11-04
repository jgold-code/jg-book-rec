import axios from 'axios';

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';

export interface BookDetails {
  id: string;
  title: string;
  authors: string[];
  description: string;
  imageUrl: string;
  averageRating?: number;
  ratingsCount?: number;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  previewLink?: string;
}

export async function searchBook(
  title: string,
  author: string
): Promise<BookDetails | null> {
  const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
  
  // Clean up title and author - remove special characters that might break search
  const cleanTitle = title.replace(/[^\w\s]/g, '').trim();
  const cleanAuthor = author.replace(/[^\w\s]/g, '').trim();
  
  try {
    // Strategy 1: Search with title and author combined
    const combinedQuery = `${cleanTitle} ${cleanAuthor}`;
    const url1 = apiKey 
      ? `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(combinedQuery)}&key=${apiKey}&maxResults=3`
      : `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(combinedQuery)}&maxResults=3`;

    console.log('Searching for:', combinedQuery);
    const response1 = await axios.get(url1);

    if (response1.data.items && response1.data.items.length > 0) {
      const book = response1.data.items[0];
      console.log('Found book:', book.volumeInfo.title);
      return formatBookDetails(book);
    }

    // Strategy 2: Try with intitle syntax
    const query2 = `intitle:${cleanTitle}`;
    const url2 = apiKey
      ? `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(query2)}&key=${apiKey}&maxResults=3`
      : `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(query2)}&maxResults=3`;
    
    console.log('Trying title only:', query2);
    const response2 = await axios.get(url2);
    
    if (response2.data.items && response2.data.items.length > 0) {
      const book = response2.data.items[0];
      console.log('Found book:', book.volumeInfo.title);
      return formatBookDetails(book);
    }

    // Strategy 3: Try just the first few words of the title
    const shortTitle = cleanTitle.split(' ').slice(0, 3).join(' ');
    const query3 = `${shortTitle}`;
    const url3 = apiKey
      ? `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(query3)}&key=${apiKey}&maxResults=3`
      : `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(query3)}&maxResults=3`;
    
    console.log('Trying short title:', query3);
    const response3 = await axios.get(url3);
    
    if (response3.data.items && response3.data.items.length > 0) {
      const book = response3.data.items[0];
      console.log('Found book:', book.volumeInfo.title);
      return formatBookDetails(book);
    }

    console.warn('No results found for:', title, 'by', author);
    return null;
  } catch (error) {
    console.error('Error fetching book from Google Books:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response:', error.response?.data);
    }
    return null;
  }
}

function formatBookDetails(book: any): BookDetails {
  const volumeInfo = book.volumeInfo;
  
  return {
    id: book.id,
    title: volumeInfo.title || 'Unknown Title',
    authors: volumeInfo.authors || ['Unknown Author'],
    description: volumeInfo.description || 'No description available.',
    imageUrl:
      volumeInfo.imageLinks?.thumbnail ||
      volumeInfo.imageLinks?.smallThumbnail ||
      'https://via.placeholder.com/128x192?text=No+Cover',
    averageRating: volumeInfo.averageRating,
    ratingsCount: volumeInfo.ratingsCount,
    publishedDate: volumeInfo.publishedDate,
    pageCount: volumeInfo.pageCount,
    categories: volumeInfo.categories,
    previewLink: volumeInfo.previewLink,
  };
}

export async function searchMultipleBooks(
  bookList: { title: string; author: string }[]
): Promise<BookDetails[]> {
  const promises = bookList.map((book) => searchBook(book.title, book.author));
  const results = await Promise.all(promises);
  return results.filter((book): book is BookDetails => book !== null);
}


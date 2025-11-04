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
  
  try {
    // Search for the book using title and author
    const query = `intitle:${title}+inauthor:${author}`;
    const url = apiKey 
      ? `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=1`
      : `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(query)}&maxResults=1`;

    const response = await axios.get(url);

    if (response.data.items && response.data.items.length > 0) {
      const book = response.data.items[0];
      return formatBookDetails(book);
    }

    // If no results with both title and author, try just title
    const titleOnlyQuery = `intitle:${title}`;
    const titleOnlyUrl = apiKey
      ? `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(titleOnlyQuery)}&key=${apiKey}&maxResults=1`
      : `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(titleOnlyQuery)}&maxResults=1`;
    
    const titleResponse = await axios.get(titleOnlyUrl);
    
    if (titleResponse.data.items && titleResponse.data.items.length > 0) {
      const book = titleResponse.data.items[0];
      return formatBookDetails(book);
    }

    return null;
  } catch (error) {
    console.error('Error fetching book from Google Books:', error);
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


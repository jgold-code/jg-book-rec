# 📚 Book Recommender

An AI-powered book recommendation web app that helps you discover your next favorite book based on your reading preferences.

## Features

- **AI-Powered Recommendations**: Uses OpenAI's GPT to understand your preferences and suggest relevant books
- **Complete Book Details**: AI provides comprehensive information including descriptions, ratings, genres, and personalized reasons for each recommendation
- **Beautiful UI**: Modern, responsive design built with React and Tailwind CSS
- **Example Prompts**: Quick-start examples to help you get started

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **API**: OpenAI API (GPT-3.5-turbo)
- **HTTP Client**: Axios

## Prerequisites

- Node.js 18+ and npm
- OpenAI API key

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

#### Getting Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-`)

### 3. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Usage

1. **Enter Your Preferences**: Describe what kind of books you're looking for in the text area. Be specific about:
   - Genres you enjoy
   - Themes or topics you're interested in
   - Mood or atmosphere you prefer
   - Favorite authors or books
   - What you want to get from the book

2. **Get Recommendations**: Click the "Get Recommendations" button

3. **Explore Results**: Browse through the AI-generated recommendations with:
   - Book details and author information
   - Ratings and estimated page counts
   - Personalized descriptions
   - Why each book was recommended for you

## Example Prompts

- "I love fantasy with strong female leads and complex magic systems"
- "Looking for thought-provoking science fiction about AI and consciousness"
- "Historical fiction set in World War II with compelling characters"
- "Mystery thrillers with unexpected plot twists"
- "Non-fiction books about psychology and human behavior"

## Project Structure

```
book-recommender/
├── src/
│   ├── components/
│   │   ├── App.tsx              # Main app component
│   │   ├── BookCard.tsx         # Individual book display
│   │   ├── BookRecommendations.tsx  # Grid of books
│   │   ├── LoadingSpinner.tsx   # Loading state
│   │   └── PreferenceForm.tsx   # User input form
│   ├── services/
│   │   └── openai.ts            # OpenAI API integration
│   ├── main.tsx                 # App entry point
│   ├── index.css                # Global styles
│   └── vite-env.d.ts           # TypeScript definitions
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Security Note

⚠️ **Important**: This is a frontend-only application, which means API keys are exposed in the browser bundle. For production use, consider:

1. **Backend Proxy**: Create a simple backend server to proxy API requests
2. **Serverless Functions**: Use Netlify Functions, Vercel Serverless Functions, or AWS Lambda
3. **Environment Restrictions**: Configure API key restrictions in your provider dashboards

## API Rate Limits

- **OpenAI**: Depends on your plan (usually sufficient for personal use)

## Troubleshooting

### API Key Issues

If you see "OpenAI API key is not configured":
- Make sure your `.env` file exists in the root directory
- Verify the key name is `VITE_OPENAI_API_KEY` (must start with `VITE_`)
- Restart the development server after adding the `.env` file

### No Recommendations Found

- Try being more specific with your preferences
- Check your internet connection
- Verify your OpenAI API key has available credits
- Check the browser console for detailed error messages

## License

Copyright Anysphere Inc.

## Acknowledgments

- Powered by OpenAI's GPT-3.5-turbo
- Built with React, TypeScript, and Tailwind CSS


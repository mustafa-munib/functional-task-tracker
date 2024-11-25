import React, { useState, useEffect } from 'react';
import { Quote as QuoteIcon, RefreshCw } from 'lucide-react';

interface QuoteData {
  content: string;
  author: string;
}

export default function Quote() {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchQuote = async () => {
    try {
      setIsLoading(true);
      setError(false);
      const res = await fetch('https://api.quotable.io/random?tags=inspirational');
      if (!res.ok) throw new Error('Failed to fetch quote');
      const data = await res.json();
      setQuote(data);
    } catch (err) {
      setError(true);
      setQuote(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center">
          <RefreshCw size={24} className="animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !quote) {
    return (
			<div className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg p-6'>
				<div className='flex gap-4 items-center'>
					<QuoteIcon size={24} className='flex-shrink-0' />
					<p className='text-lg'>
						Wisdom loading... <p>Developed by Mustafa Hussaini</p>
					</p>
					<button
						onClick={fetchQuote}
						className='ml-auto p-2 hover:bg-white/10 rounded-full transition-colors'
					>
						<RefreshCw size={20} />
					</button>
				</div>
			</div>
		);
  }

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg p-6">
      <div className="flex gap-4">
        <QuoteIcon size={24} className="flex-shrink-0" />
        <div className="flex-1">
          <p className="text-lg font-medium mb-2">{quote.content}</p>
          <p className="text-sm opacity-90">— {quote.author}</p>
        </div>
        <button
          onClick={fetchQuote}
          className="flex-shrink-0 p-2 hover:bg-white/10 rounded-full transition-colors"
          title="Get new quote"
        >
          <RefreshCw size={20} />
        </button>
      </div>
    </div>
  );
}
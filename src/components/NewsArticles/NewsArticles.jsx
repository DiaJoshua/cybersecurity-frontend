import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './NewsArticles.css';

const NewsArticles = () => {
  const [articles, setArticles] = useState([]);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/fetch-cybercrime-news');
        setArticles(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch news. Please try again later.');
        setLoading(false);
      }
    };
    fetchNews();
  }, []);


  const handleBatchChange = (direction) => {
    setCurrentBatch((prev) => {
      const totalBatches = Math.ceil(articles.length / 4);
      if (direction === 'next') return (prev + 1) % totalBatches;
      if (direction === 'prev') return (prev - 1 + totalBatches) % totalBatches;
      return prev;
    });
  };

  const startIndex = currentBatch * 4;
  const displayedArticles = articles.slice(startIndex, startIndex + 4);

  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="news-articles">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <>
          <h1 className="news-articles-title">News Articles</h1>
          <div className="news-articles-container">
            {displayedArticles.map((article, index) => (
              <a
                key={index}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="news-articles-card"
              >
                {article.image ? (
                  <div className="news-articles-image">
                    <img src={article.image} alt={article.title} />
                  </div>
                ) : (
                  <div className="news-articles-image">
                    <img src="default-image.jpg" alt="Default Image" />
                  </div>
                )}
  
                <div className="news-articles-header">
                  <h3>{article.title}</h3>
                </div>
                <div className="news-articles-body">
                  <p>{article.description ? truncateDescription(article.description) : 'No description available'}</p>
                </div>
                <div className="news-articles-footer">
                  <p className="published-date">
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleString()
                      : 'Unknown Date'}
                  </p>
                </div>
              </a>
            ))}
          </div>
          <div className="news-articles-controls">
            <button onClick={() => handleBatchChange('prev')}>&lt; Previous</button>
            <button onClick={() => handleBatchChange('next')}>Next &gt;</button>
          </div>
        </>
      )}
    </div>
  );  
};

export default NewsArticles;

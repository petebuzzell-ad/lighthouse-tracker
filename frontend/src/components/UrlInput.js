import React, { useState } from 'react';

function UrlInput({ onSubmit }) {
  const [urls, setUrls] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlList = urls.split('\n').map(url => url.trim()).filter(url => url);
    onSubmit(urlList);
    setUrls('');
  };

  return (
    <form onSubmit={handleSubmit} className="url-input-form">
      <textarea
        value={urls}
        onChange={(e) => setUrls(e.target.value)}
        placeholder="Enter URLs (one per line)"
        rows="5"
      />
      <button type="submit">Add URLs</button>
    </form>
  );
}

export default UrlInput;

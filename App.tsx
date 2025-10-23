import React, { useState, useCallback } from 'react';
import type { CapturedPhoto } from './types';
import CameraView from './components/CameraView';
import PhotoList from './components/PhotoList';
import Header from './components/Header';

const App: React.FC = () => {
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);

  const handleCapturePhoto = useCallback((dataUrl: string) => {
    const newPhoto: CapturedPhoto = {
      id: new Date().toISOString(),
      dataUrl,
      description: '',
    };
    setPhotos((prevPhotos) => [newPhoto, ...prevPhotos]);
  }, []);

  const handleUpdateDescription = useCallback((id: string, description: string) => {
    setPhotos((prevPhotos) =>
      prevPhotos.map((photo) =>
        photo.id === id ? { ...photo, description } : photo
      )
    );
  }, []);

  const handleDeletePhoto = useCallback((id: string) => {
    setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.id !== id));
  }, []);

  const handleComposeEmail = useCallback(() => {
    if (photos.length === 0) return;

    const subject = "Photos from Photo Mailer App";
    let body = `
      <html>
        <head>
          <style>
            body { font-family: sans-serif; line-height: 1.6; color: #333; }
            h1, h2 { color: #0056b3; }
            div { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
            img { max-width: 100%; height: auto; border-radius: 8px; border: 1px solid #ddd; }
            p { margin: 10px 0; }
          </style>
        </head>
        <body>
          <h1>Captured Photos</h1>
          <p>Here are the photos captured from the app:</p>
    `;

    photos.slice().reverse().forEach((photo, index) => {
      // Sanitize description to prevent HTML injection
      const sanitizedDescription = photo.description
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

      body += `
        <div>
          <h2>Photo ${index + 1}</h2>
          <p><strong>Description:</strong><br/>${sanitizedDescription || 'No description provided.'}</p>
          <img src="${photo.dataUrl}" alt="Captured photo ${index + 1}" />
        </div>
      `;
    });
    
    body += '</body></html>';

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (mailtoLink.length > 8000) { // Modern browsers support longer URLs, 8k is a safer limit than 2k
        alert("The generated email content is too long for your email client due to the number or size of photos. Please try composing an email with fewer photos.");
        return;
    }

    window.location.href = mailtoLink;
  }, [photos]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 p-4">
            <div className="md:sticky md:top-24 h-fit">
                <CameraView onCapture={handleCapturePhoto} />
            </div>
            <div className="md:col-start-2">
                <PhotoList
                    photos={photos}
                    onUpdateDescription={handleUpdateDescription}
                    onDelete={handleDeletePhoto}
                    onComposeEmail={handleComposeEmail}
                />
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;

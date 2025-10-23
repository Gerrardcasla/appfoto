import React from 'react';
import type { CapturedPhoto } from '../types';
import PhotoItem from './PhotoItem';
import MailIcon from './icons/MailIcon';

interface PhotoListProps {
  photos: CapturedPhoto[];
  onUpdateDescription: (id: string, description: string) => void;
  onDelete: (id: string) => void;
  onComposeEmail: () => void;
}

const PhotoList: React.FC<PhotoListProps> = ({ photos, onUpdateDescription, onDelete, onComposeEmail }) => {
  if (photos.length === 0) {
    return (
      <div className="text-center py-10 px-4 text-gray-500">
        <p className="text-lg">No photos captured yet.</p>
        <p>Use the camera above to start taking pictures.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="space-y-4">
        {photos.map((photo) => (
          <PhotoItem
            key={photo.id}
            photo={photo}
            onUpdateDescription={onUpdateDescription}
            onDelete={onDelete}
          />
        ))}
      </div>
      <button
        onClick={onComposeEmail}
        className="flex w-full items-center justify-center gap-2 px-4 py-3 mt-6 bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 transition-all"
        aria-label={`Compose email with ${photos.length} photos`}
      >
        <MailIcon className="h-6 w-6" />
        <span className="text-lg">Compose Email ({photos.length})</span>
      </button>
    </div>
  );
};

export default PhotoList;

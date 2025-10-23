
import React from 'react';
import type { CapturedPhoto } from '../types';
import TrashIcon from './icons/TrashIcon';

interface PhotoItemProps {
  photo: CapturedPhoto;
  onUpdateDescription: (id: string, description: string) => void;
  onDelete: (id:string) => void;
}

const PhotoItem: React.FC<PhotoItemProps> = ({ photo, onUpdateDescription, onDelete }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col sm:flex-row gap-4">
      <img src={photo.dataUrl} alt="Captured" className="w-full sm:w-32 sm:h-32 object-cover rounded-md flex-shrink-0" />
      <div className="flex-grow flex flex-col gap-2">
        <textarea
          value={photo.description}
          onChange={(e) => onUpdateDescription(photo.id, e.target.value)}
          placeholder="Add a description..."
          className="w-full flex-grow bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
          rows={3}
        />
        <button
          onClick={() => onDelete(photo.id)}
          className="self-end mt-2 sm:mt-0 flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
          aria-label="Delete photo"
        >
          <TrashIcon className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default PhotoItem;

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AvatarURLInputProps {
  currentPhotoURL?: string;
  onPhotoURLChange: (photoURL: string) => void;
}

/**
 * Avatar URL Input Component
 * Allows users to input a URL for their profile picture
 * FREE - No Firebase Storage required!
 */
export const AvatarURLInput: React.FC<AvatarURLInputProps> = ({
  currentPhotoURL,
  onPhotoURLChange,
}) => {
  const { t } = useTranslation();
  const [photoURL, setPhotoURL] = useState(currentPhotoURL || '');
  const [showPreview, setShowPreview] = useState(!!currentPhotoURL);

  const handleURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPhotoURL(url);
    setShowPreview(false); // Hide preview until user clicks "Update"
  };

  const handleUpdatePhoto = () => {
    if (photoURL.trim()) {
      // Validate URL format
      try {
        new URL(photoURL);
        onPhotoURLChange(photoURL);
        setShowPreview(true);
      } catch (error) {
        alert(t('profile.invalidURL'));
      }
    } else {
      onPhotoURLChange('');
      setShowPreview(false);
    }
  };

  const handleRemovePhoto = () => {
    const confirmRemove = window.confirm(t('profile.confirmRemoveAvatar'));
    if (!confirmRemove) return;

    setPhotoURL('');
    setShowPreview(false);
    onPhotoURLChange('');
  };

  return (
    <div className="flex items-start space-x-4">
      {/* Avatar Preview */}
      <div className="relative flex-shrink-0">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          {showPreview && photoURL ? (
            <img
              src={photoURL}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={() => {
                setShowPreview(false);
                alert(t('profile.imageLoadError'));
              }}
            />
          ) : (
            <svg
              className="w-12 h-12 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>

      {/* URL Input Controls */}
      <div className="flex-1 space-y-3">
        <div>
          <label htmlFor="photoURL" className="block text-sm font-medium text-gray-700 mb-1">
            {t('profile.photoURL')}
          </label>
          <input
            id="photoURL"
            type="url"
            value={photoURL}
            onChange={handleURLChange}
            placeholder="https://example.com/your-photo.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>

        <div className="flex space-x-2">
          <button
            type="button"
            onClick={handleUpdatePhoto}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {t('profile.updatePhoto')}
          </button>

          {showPreview && photoURL && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-300 hover:border-red-400 rounded-md"
            >
              {t('profile.removePhoto')}
            </button>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-xs text-blue-800 mb-2">
            <strong>💡 {t('profile.freeHostingTip')}:</strong>
          </p>
          <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
            <li><a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">Imgur.com</a> - Free image hosting</li>
            <li><a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">ImgBB.com</a> - Direct image links</li>
            <li>Google Drive - Set sharing to "Anyone with the link"</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/config/firebase';
import { useTranslation } from 'react-i18next';

interface AvatarUploaderProps {
  userId: string;
  currentPhotoURL?: string;
  onUploadSuccess: (photoURL: string) => void;
  onUploadError?: (error: Error) => void;
}

/**
 * Avatar Uploader Component
 * Handles profile picture upload to Firebase Storage with live preview
 */
export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  userId,
  currentPhotoURL,
  onUploadSuccess,
  onUploadError,
}) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentPhotoURL || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert(t('profile.avatarInvalidType'));
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      alert(t('profile.avatarTooLarge'));
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);

    try {
      // Determine file extension
      const ext = file.name.split('.').pop() || 'jpg';

      // Create storage reference
      const storageRef = ref(storage, `users/${userId}/profile.${ext}`);

      // Upload file
      await uploadBytes(storageRef, file);

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Call success callback
      onUploadSuccess(downloadURL);
    } catch (error) {
      console.error('Avatar upload error:', error);

      // Reset preview on error
      setPreview(currentPhotoURL || null);

      if (onUploadError && error instanceof Error) {
        onUploadError(error);
      } else {
        alert(t('profile.avatarUploadError'));
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!currentPhotoURL) return;

    const confirmRemove = window.confirm(t('profile.confirmRemoveAvatar'));
    if (!confirmRemove) return;

    setUploading(true);

    try {
      // Extract path from URL and delete
      const storageRef = ref(storage, `users/${userId}/profile.jpg`);
      await deleteObject(storageRef).catch(() => {
        // Ignore error if file doesn't exist
      });

      // Reset preview
      setPreview(null);
      onUploadSuccess('');
    } catch (error) {
      console.error('Avatar removal error:', error);
      alert(t('profile.avatarRemoveError'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Avatar Preview */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          {preview ? (
            <img src={preview} alt="Profile" className="w-full h-full object-cover" />
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
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Upload Controls */}
      <div className="flex flex-col space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 border border-primary-300 hover:border-primary-400 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? t('common.loading') : t('profile.uploadAvatar')}
        </button>

        {preview && (
          <button
            type="button"
            onClick={handleRemovePhoto}
            disabled={uploading}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-300 hover:border-red-400 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('profile.removeAvatar')}
          </button>
        )}

        <p className="text-xs text-gray-500">
          {t('profile.avatarRequirements')}
        </p>
      </div>
    </div>
  );
};

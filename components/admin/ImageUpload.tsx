'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ images, onImagesChange, maxImages = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState<boolean[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      toast.error('Only JPEG, PNG, and WebP images are allowed');
      return;
    }

    // Validate file sizes (max 5MB per file)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      toast.error('Each image must be less than 5MB');
      return;
    }

    // Upload files
    for (const file of files) {
      await uploadImage(file);
    }

    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async (file: File) => {
    const uploadIndex = uploading.length;
    setUploading(prev => [...prev, true]);
    setUploadProgress(prev => [...prev, 0]);

    try {
      // Create unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = file.name.split('.').pop();
      const filename = `products/${timestamp}_${randomString}.${extension}`;

      // Create storage reference
      const storageRef = ref(storage, filename);

      // Upload file with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(prev => {
            const newProgress = [...prev];
            newProgress[uploadIndex] = progress;
            return newProgress;
          });
        },
        (error) => {
          console.error('Upload error:', error);
          toast.error(`Failed to upload ${file.name}`);
          setUploading(prev => prev.filter((_, i) => i !== uploadIndex));
          setUploadProgress(prev => prev.filter((_, i) => i !== uploadIndex));
        },
        async () => {
          // Upload complete, get download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onImagesChange([...images, downloadURL]);

          // Remove uploading state
          setUploading(prev => prev.filter((_, i) => i !== uploadIndex));
          setUploadProgress(prev => prev.filter((_, i) => i !== uploadIndex));

          toast.success(`${file.name} uploaded successfully`);
        }
      );
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      setUploading(prev => prev.filter((_, i) => i !== uploadIndex));
      setUploadProgress(prev => prev.filter((_, i) => i !== uploadIndex));
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageUrl = images[index];

    try {
      // Extract filename from URL and delete from storage
      if (imageUrl.includes('firebase')) {
        const urlParts = imageUrl.split('/');
        const filePathEncoded = urlParts[urlParts.length - 1].split('?')[0];
        const filePath = decodeURIComponent(filePathEncoded);
        const storageRef = ref(storage, filePath);

        try {
          await deleteObject(storageRef);
        } catch (error) {
          // Ignore if file doesn't exist
          console.log('File may not exist in storage:', error);
        }
      }

      // Remove from images array
      onImagesChange(images.filter((_, i) => i !== index));
      toast.success('Image removed');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={images.length >= maxImages || uploading.length > 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload size={20} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-600">
            {uploading.length > 0 ? 'Uploading...' : `Upload Images (${images.length}/${maxImages})`}
          </span>
        </button>

        <p className="text-xs text-gray-500 mt-2">
          JPEG, PNG, or WebP. Max 5MB per image. Maximum {maxImages} images.
        </p>
      </div>

      {/* Uploading Progress */}
      {uploading.length > 0 && (
        <div className="space-y-2">
          {uploadProgress.map((progress, index) => (
            <div key={index} className="bg-gray-100 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Uploading...</span>
                <span className="text-sm font-medium text-gray-900">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-black h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={image}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
              />

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X size={16} />
              </button>

              {/* Primary Badge */}
              {index === 0 && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black text-white text-xs font-medium rounded">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && uploading.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <ImageIcon size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No images uploaded yet</p>
          <p className="text-xs text-gray-400 mt-1">Click the button above to upload images</p>
        </div>
      )}
    </div>
  );
}

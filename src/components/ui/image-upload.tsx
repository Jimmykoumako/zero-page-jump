
import React from 'react';
import FileUpload from './file-upload';

interface ImageUploadProps {
  bucketName: string;
  onUploadComplete: (url: string, fileName: string) => void;
  onUploadError?: (error: string) => void;
  label: string;
  currentImageUrl?: string;
  className?: string;
  maxFileSizeMB?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  bucketName,
  onUploadComplete,
  onUploadError,
  label,
  currentImageUrl,
  className,
  maxFileSizeMB = 5
}) => {
  return (
    <div className={className}>
      {currentImageUrl && (
        <div className="mb-4">
          <img
            src={currentImageUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border"
          />
        </div>
      )}
      
      <FileUpload
        bucketName={bucketName}
        acceptedFileTypes="image/*"
        maxFileSizeMB={maxFileSizeMB}
        onUploadComplete={onUploadComplete}
        onUploadError={onUploadError}
        label={label}
        currentFileUrl={currentImageUrl}
      />
    </div>
  );
};

export default ImageUpload;

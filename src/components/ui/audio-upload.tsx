
import React from 'react';
import FileUpload from './file-upload';

interface AudioUploadProps {
  bucketName: string;
  onUploadComplete: (url: string, fileName: string) => void;
  onUploadError?: (error: string) => void;
  label: string;
  currentAudioUrl?: string;
  className?: string;
  maxFileSizeMB?: number;
}

const AudioUpload: React.FC<AudioUploadProps> = ({
  bucketName,
  onUploadComplete,
  onUploadError,
  label,
  currentAudioUrl,
  className,
  maxFileSizeMB = 50
}) => {
  return (
    <div className={className}>
      {currentAudioUrl && (
        <div className="mb-4">
          <audio controls className="w-full">
            <source src={currentAudioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
      
      <FileUpload
        bucketName={bucketName}
        acceptedFileTypes="audio/*"
        maxFileSizeMB={maxFileSizeMB}
        onUploadComplete={onUploadComplete}
        onUploadError={onUploadError}
        label={label}
        currentFileUrl={currentAudioUrl}
      />
    </div>
  );
};

export default AudioUpload;

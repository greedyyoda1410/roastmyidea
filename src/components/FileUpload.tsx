'use client';

import React, { useState } from 'react';

interface FileUploadProps {
  onFilesChange: (files: {
    pitchDeck: File | null;
    demoImages: File[];
  }) => void;
}

export default function FileUpload({ onFilesChange }: FileUploadProps) {
  const [pitchDeck, setPitchDeck] = useState<File | null>(null);
  const [demoImages, setDemoImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handlePitchDeckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => [...prev, 'Pitch deck must be PDF or PPT format']);
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => [...prev, 'Pitch deck must be under 10MB']);
      return;
    }

    setPitchDeck(file);
    setErrors([]);
    onFilesChange({ pitchDeck: file, demoImages });
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate number of files
    if (files.length > 5) {
      setErrors(prev => [...prev, 'Maximum 5 images allowed']);
      return;
    }

    // Validate file types and sizes
    const validFiles: File[] = [];
    const newErrors: string[] = [];

    files.forEach((file, index) => {
      // Validate type
      if (!file.type.startsWith('image/')) {
        newErrors.push(`File ${index + 1}: Must be an image (JPG, PNG)`);
        return;
      }

      // Validate size (5MB per image)
      if (file.size > 5 * 1024 * 1024) {
        newErrors.push(`File ${index + 1}: Must be under 5MB`);
        return;
      }

      validFiles.push(file);
    });

    setErrors(newErrors);
    setDemoImages(validFiles);
    onFilesChange({ pitchDeck, demoImages: validFiles });
  };

  const removePitchDeck = () => {
    setPitchDeck(null);
    onFilesChange({ pitchDeck: null, demoImages });
  };

  const removeImage = (index: number) => {
    const newImages = demoImages.filter((_, i) => i !== index);
    setDemoImages(newImages);
    onFilesChange({ pitchDeck, demoImages: newImages });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          Optional Attachments
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Upload files to give judges more context about your idea
        </p>
      </div>

      {/* Pitch Deck Upload */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">
          Pitch Deck (PDF or PPT)
        </label>
        <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-6 hover:border-accent/50 transition-all duration-200">
          {!pitchDeck ? (
            <label className="cursor-pointer block text-center">
              <input
                type="file"
                accept=".pdf,.ppt,.pptx"
                onChange={handlePitchDeckChange}
                className="hidden"
              />
              <div className="text-muted-foreground">
                <div className="text-2xl mb-2">📄</div>
                <p className="text-sm">Click to upload pitch deck</p>
                <p className="text-xs mt-1">PDF or PPT, max 10MB</p>
              </div>
            </label>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">📄</div>
                <div>
                  <p className="text-sm text-foreground font-medium">{pitchDeck.name}</p>
                  <p className="text-xs text-muted-foreground">{(pitchDeck.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                onClick={removePitchDeck}
                className="text-danger hover:text-danger/80 transition-colors"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Demo Images Upload */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">
          Demo Images (Up to 5)
        </label>
        <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-6 hover:border-accent/50 transition-all duration-200">
          <label className="cursor-pointer block text-center">
            <input
              type="file"
              accept="image/*"
              multiple
              max={5}
              onChange={handleImagesChange}
              className="hidden"
            />
            <div className="text-muted-foreground">
              <div className="text-2xl mb-2">🖼️</div>
              <p className="text-sm">Click to upload images</p>
              <p className="text-xs mt-1">JPG or PNG, max 5MB each, up to 5 images</p>
            </div>
          </label>

          {/* Display uploaded images */}
          {demoImages.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {demoImages.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square bg-background rounded-lg overflow-hidden border border-muted-foreground/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Demo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-danger/90 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {image.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-danger/10 border border-danger/30 rounded-xl p-4">
          <p className="text-sm font-medium text-danger mb-2">Upload Errors:</p>
          <ul className="text-xs text-danger/80 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* File Summary */}
      {(pitchDeck || demoImages.length > 0) && (
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
          <p className="text-xs font-mono text-accent">
            {pitchDeck ? '1 pitch deck' : ''} 
            {pitchDeck && demoImages.length > 0 ? ' + ' : ''}
            {demoImages.length > 0 ? `${demoImages.length} image${demoImages.length > 1 ? 's' : ''}` : ''}
            {' '}attached
          </p>
        </div>
      )}
    </div>
  );
}

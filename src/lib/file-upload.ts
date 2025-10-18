import { supabase } from './supabase';

export async function uploadFile(file: File, bucket: string, path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error uploading file:', error);
    throw new Error(`Failed to upload ${file.name}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
}

export async function uploadRoastFiles(
  files: { pitchDeck: File | null; demoImages: File[] },
  roastId: string
): Promise<{ pitchDeckUrl: string | null; imageUrls: string[] }> {
  const results = {
    pitchDeckUrl: null as string | null,
    imageUrls: [] as string[]
  };

  try {
    // Upload pitch deck
    if (files.pitchDeck) {
      const path = `roasts/${roastId}/pitch-deck-${Date.now()}-${files.pitchDeck.name}`;
      results.pitchDeckUrl = await uploadFile(files.pitchDeck, 'roast-files', path);
    }

    // Upload demo images
    if (files.demoImages.length > 0) {
      const uploadPromises = files.demoImages.map((image, index) => {
        const path = `roasts/${roastId}/demo-${index}-${Date.now()}-${image.name}`;
        return uploadFile(image, 'roast-files', path);
      });

      results.imageUrls = await Promise.all(uploadPromises);
    }

    return results;
  } catch (error) {
    console.error('Error uploading roast files:', error);
    throw error;
  }
}

export async function extractPDFText(): Promise<string> {
  try {
    // PDF extraction happens server-side in the API route
    // This function is kept for future client-side processing if needed
    return '';
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    return '';
  }
}

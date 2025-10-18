import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Note: PDF text extraction can be added later
// For now, we just store the file URLs

export async function POST(request: NextRequest) {
  try {
    // Create admin client at runtime, not at module load time
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const formData = await request.formData();
    const roastId = formData.get('roastId') as string;
    const pitchDeck = formData.get('pitchDeck') as File | null;
    const images = formData.getAll('images') as File[];

    if (!roastId) {
      return NextResponse.json(
        { error: 'Roast ID is required' },
        { status: 400 }
      );
    }

    const results: {
      pitchDeckUrl: string | null;
      pitchDeckText: string | null;
      imageUrls: string[];
    } = {
      pitchDeckUrl: null,
      pitchDeckText: null,
      imageUrls: []
    };

    // Upload and process pitch deck
    if (pitchDeck) {
      const path = `roasts/${roastId}/pitch-deck-${Date.now()}.pdf`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('roast-files')
        .upload(path, pitchDeck, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading pitch deck:', uploadError);
      } else {
        // Get public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('roast-files')
          .getPublicUrl(uploadData.path);

        results.pitchDeckUrl = publicUrl;
        
        // TODO: Extract text from PDF for judge context
        // For now, just storing the file URL
        results.pitchDeckText = 'PDF content extraction coming soon';
      }
    }

    // Upload images
    if (images.length > 0) {
      for (let i = 0; i < Math.min(images.length, 5); i++) {
        const image = images[i];
        const path = `roasts/${roastId}/image-${i}-${Date.now()}.${image.name.split('.').pop()}`;

        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('roast-files')
          .upload(path, image, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error(`Error uploading image ${i}:`, uploadError);
        } else {
          const { data: { publicUrl } } = supabaseAdmin.storage
            .from('roast-files')
            .getPublicUrl(uploadData.path);

          results.imageUrls.push(publicUrl);
        }
      }
    }

    return NextResponse.json({
      success: true,
      files: results
    });

  } catch (error) {
    console.error('Error in /api/upload:', error);
    return NextResponse.json(
      { error: 'GENERIC', message: 'File upload failed' },
      { status: 500 }
    );
  }
}

// Cloudinary configuration for React Native
const CLOUD_NAME = 'dwednnm0l';
// Using unsigned upload preset (safer - no API secret needed)
const UPLOAD_PRESET = 'hygiene_heroes_unsigned'; // You need to create this in Cloudinary dashboard

export type SelectedImage = {
  uri: string;
  name: string;
  type: string;
  uploadedUrl?: string;
  uploading?: boolean;
  publicId?: string;
};

// Helper function to upload single image to Cloudinary
export const uploadImageToCloudinary = async (imageUri: string, publicId?: string): Promise<{
  success: boolean;
  url?: string;
  publicId?: string;
  error?: any;
}> => {
  try {
    const formData = new FormData();
    
    // Add the image file
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: `photo_${Date.now()}.jpg`,
    } as any);
    
    // Add upload parameters
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'hygiene-heroes/avatars');
    
    if (publicId) {
      formData.append('public_id', publicId);
    }
    
    // Add transformation parameters for avatar optimization
    formData.append('transformation', 'w_300,h_300,c_fill,g_face,q_auto,f_auto');
    
    // Upload to Cloudinary
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    
    if (result.secure_url) {
      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id
      };
    } else {
      throw new Error(result.error?.message || 'Upload failed');
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error
    };
  }
};

// Helper function to upload multiple images
export const uploadMultipleImages = async (images: SelectedImage[]): Promise<SelectedImage[]> => {
  const uploadPromises = images.map(async (image, index) => {
    if (image.uploadedUrl) {
      return image; // Already uploaded
    }
    
    try {
      const result = await uploadImageToCloudinary(image.uri);
      if (result.success && result.url) {
        return {
          ...image,
          uploadedUrl: result.url,
          publicId: result.publicId,
          uploading: false
        };
      } else {
        return {
          ...image,
          uploading: false
        };
      }
    } catch (error) {
      console.error(`Upload failed for image ${index}:`, error);
      return {
        ...image,
        uploading: false
      };
    }
  });
  
  return Promise.all(uploadPromises);
};

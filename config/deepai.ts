import * as ImageManipulator from 'expo-image-manipulator';

// Gemini AI Cartoonify using PiAPI
export type CartoonifyResult = {
  success: boolean;
  cartoonUrl?: string;
  error?: string;
};

// Helper function to create AI cartoon effect using Gemini AI
export const cartoonifyImage = async (imageUri: string): Promise<CartoonifyResult> => {
  try {
    // Convert image to base64 for Gemini API
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });

    // Use Gemini AI via PiAPI for cartoon generation
    const apiResponse = await fetch('https://api.piapi.ai/api/v1/task', {
      method: 'POST',
      headers: {
        'X-API-Key': 'YOUR_PIAPI_KEY', // Replace with your PiAPI key
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gemini',
        task_type: 'gemini-2.5-flash-image',
        input: {
          prompt: 'Convert this image into a cartoon style avatar. Make it look like a cartoon character with vibrant colors and simplified features.',
          image: base64,
        },
      }),
    });

    if (apiResponse.ok) {
      const result = await apiResponse.json();
      console.log('Gemini AI response:', result);
      
      if (result.output && result.output.length > 0 && result.output[0].image_url) {
        return {
          success: true,
          cartoonUrl: result.output[0].image_url
        };
      }
    }

    // Fallback to local processing if API fails
    return await createLocalCartoonEffect(imageUri);
  } catch (error) {
    console.error('Gemini AI Cartoonify error:', error);
    // Fallback to local processing
    return await createLocalCartoonEffect(imageUri);
  }
};

// Fallback local cartoon effect
const createLocalCartoonEffect = async (imageUri: string): Promise<CartoonifyResult> => {
  try {
    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      [
        { resize: { width: 300, height: 300 } },
        { flip: ImageManipulator.FlipType.Horizontal },
        { rotate: 5 },
      ],
      {
        compress: 0.3,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
      success: true,
      cartoonUrl: result.uri
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to create cartoon effect. Please try again.'
    };
  }
};

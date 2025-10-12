# 🤖 AI Cartoon Avatar Setup Guide

## Gemini AI Integration with PiAPI

### Step 1: Get Free PiAPI Key

1. **Go to [PiAPI.ai](https://piapi.ai/)**
2. **Sign up for free account**
3. **Get your API key** from dashboard
4. **Copy your API key**

### Step 2: Update API Key

1. **Open `config/deepai.ts`**
2. **Replace `YOUR_PIAPI_KEY`** with your actual API key
3. **Save the file**

### Step 3: Test AI Cartoon Generation

1. **Upload a photo** in the app
2. **Click "🤖 AI Cartoon Avatar"**
3. **Wait for AI processing** (5-10 seconds)
4. **See your AI-generated cartoon**

## Features

- ✅ **Free Trial**: 20 free credits
- ✅ **Real AI Processing**: Gemini 2.5 Flash
- ✅ **Professional Quality**: High-quality cartoon avatars
- ✅ **Fallback Protection**: Local processing if AI fails
- ✅ **Multiple Images**: Support for up to 4 images

## API Pricing

- **Free Trial**: 20 credits (20 images)
- **After Trial**: $0.03 per image
- **No Hidden Costs**: Transparent pricing

## Technical Details

- **Model**: Gemini 2.5 Flash
- **Task Type**: gemini-2.5-flash-image
- **Input**: Base64 encoded image
- **Output**: Cartoon avatar URL
- **Processing Time**: 5-10 seconds

## Error Handling

- **API Failure**: Falls back to local processing
- **Network Issues**: Shows user-friendly error messages
- **Invalid Images**: Handles gracefully with fallback

## Support

- **PiAPI Support**: [PiAPI.ai Support](https://piapi.ai/support)
- **Documentation**: [PiAPI Docs](https://piapi.ai/docs)
- **API Status**: [PiAPI Status](https://status.piapi.ai/)

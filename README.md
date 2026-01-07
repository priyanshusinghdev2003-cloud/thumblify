# Gemini Thumbnail Generator

This application leverages the power of Google's Gemini model to automatically generate high-quality thumbnails. Built using the MERN stack (MongoDB, Express, React, Node.js), it provides a seamless workflow for AI-driven image creation and management.

## Features

- **AI Generation**: Uses Gemini API to create custom thumbnails based on user prompts.
- **MERN Stack**: Robust full-stack architecture for performance and scalability.
- **Image Hosting**: Integrated with Cloudinary for efficient image storage and delivery.
- **Authentication**: Secure session-based user management.

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB database (Local or Atlas)
- Gemini API Key from Google AI Studio
- Cloudinary account for media storage

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/priyanshusinghdev2003-cloud/thumblify.git
   ```

2. Install dependencies for both backend and frontend:
   ```bash
   npm install
   cd frontend && npm install
   cd server && npm install
   ```

### Environment Setup

Create a `.env` file in the root directory and populate it with your credentials:

```env
PORT=5000
MONGODB_URI="your_mongodb_connection_string"
SESSION_SECRET="your_secret_key"
GEMINI_API_KEY="your_gemini_api_key"
CLOUDINARY_URL="your_cloudinary_url"
```

### Running the App

To start the development server:

```bash
npm run dev
```

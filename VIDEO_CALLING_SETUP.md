# Video Calling Integration - InterVue.io

## Overview

The InterVue.io job portal now includes integrated video calling functionality that allows companies to schedule interviews with candidates using either Google Meet or the built-in video calling system.

## Features

### 1. Dual Interview Options
- **Google Meet**: Traditional external video calling platform
- **Video Call**: Built-in video calling system using ZegoUIKit

### 2. Automatic Room Generation
- When selecting "Video Call", a unique room ID is automatically generated
- Room links are shared with candidates via email
- Direct navigation to video call rooms

### 3. Email Notifications
- Candidates receive detailed interview emails with meeting links
- Different email templates for Google Meet vs Video Call
- Preparation tips included in emails

## File Structure

```
Frontend/src/components/video/
├── HomePage.jsx          # Video calling homepage
├── HomePage.css          # Styling for homepage
├── Room.jsx              # Video call room component
└── Room.css              # Styling for video room

Frontend/src/
└── Config.js             # ZegoUIKit configuration
```

## Setup Instructions

### 1. Install Dependencies

Navigate to the Frontend directory and install the required dependencies:

```bash
cd Frontend
npm install
```

The following dependency has been added to `package.json`:
- `@zegocloud/zego-uikit-prebuilt`: "^2.15.0"

### 2. Configuration

The video calling system uses ZegoUIKit with the following configuration in `Frontend/src/Config.js`:

```javascript
export const APP_ID = 1129018263;
export const SECRET = "d250daaef67feec25c1c7e706e64a7ec";
```

### 3. Routes

The following routes have been added to the application:

- `/video` - Video calling homepage
- `/room/:roomId` - Video call room

## Usage

### For Companies

1. **Navigate to Job Details**: Go to a specific job posting
2. **View Candidates**: See the list of candidates who applied
3. **Schedule Interview**: Click the "Schedule" button on any candidate card
4. **Choose Interview Type**:
   - **Google Meet**: Enter a Google Meet link
   - **Video Call**: Automatically generates a video call room
5. **Confirm**: The system will send email notifications to the candidate

### For Candidates

1. **Receive Email**: Get notified about scheduled interviews
2. **Join Meeting**: Click the meeting link in the email
3. **Video Call**: If using the built-in system, join the video call room

## Technical Implementation

### Frontend Changes

#### CandidateCard Component
- Added interview type selection (Google Meet vs Video Call)
- Enhanced modal with radio button options
- Automatic room ID generation for video calls
- Direct navigation to video call rooms

#### Video Components
- **HomePage**: Landing page for video calling
- **Room**: Video call room using ZegoUIKit
- Responsive design with proper styling

### Backend Changes

#### CandidateController
- Updated `scheduleInterview` function to handle interview types
- Enhanced interview schedule data structure
- Modified email notifications

#### Email Templates
- Updated `interviewScheduled` template to support both interview types
- Different platform information based on interview type
- Additional preparation tips for video calls

## Email Templates

### Google Meet Interview
- Platform: Google Meet
- Standard preparation tips

### Video Call Interview
- Platform: InterVue Video Call
- Additional tip about stable internet connection
- Direct link to video call room

## Security Considerations

1. **Room IDs**: Generated using random strings and timestamps
2. **Session Management**: Uses existing authentication system
3. **Email Verification**: Candidates receive secure meeting links

## Troubleshooting

### Common Issues

1. **Video Call Not Loading**
   - Check internet connection
   - Ensure camera/microphone permissions are granted
   - Verify ZegoUIKit configuration

2. **Email Not Received**
   - Check spam folder
   - Verify email configuration in backend
   - Ensure candidate email is correct

3. **Room Access Issues**
   - Verify room ID format
   - Check if room is still active
   - Ensure proper URL structure

### Development

To run the application in development mode:

```bash
# Backend
cd Backend
npm run dev

# Frontend
cd Frontend
npm run dev
```

## Future Enhancements

1. **Recording**: Add interview recording functionality
2. **Screen Sharing**: Enhanced screen sharing capabilities
3. **Chat**: Built-in chat during video calls
4. **Analytics**: Interview performance tracking
5. **Mobile App**: Native mobile application support

## Support

For technical support or questions about the video calling integration, please refer to the main project documentation or contact the development team. 
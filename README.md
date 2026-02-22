# CodeHub

**Simple team file sharing + real-time chat – no Git needed**

CodeHub is a lightweight platform for teams to **share any project files** (code, images, logs, builds, PDFs, zips, screenshots — even broken or experimental ones) without the overhead of Git version control.

### Main Features
- User registration & secure login
- Upload files (any type, any size — subject to server limits)
- Create new empty files directly in the browser (quick notes, temp code snippets, markdown)
- View, download, and delete shared files
- Real-time team chat (group messaging for quick discussions around files)
- File list with metadata (name, size, uploader, upload date)
- Simple dashboard for the whole team

Perfect when you need to throw files around fast ("check this crash log", "here's the latest build", "look at this error screenshot") without commits, branches, or pull requests.

## Tech Stack
- **Frontend**: React.js (with hooks/context for state + real-time features)
- **Backend**: Node.js + Express
- **Database**: MongoDB (Atlas recommended)
- **Real-time chat**: Socket.io (or similar WebSocket library)
- **File storage**: Server disk / Render's ephemeral storage (or integrate Cloudinary/S3 later)
- **Authentication**: JWT
- **Deployment**: Render (backend), Vercel/Netlify/Render (frontend)

## Why CodeHub?
- No Git LFS hassle for large/binary files
- Instant sharing of WIP, temporary, or error-filled files
- Built-in chat → discuss files without switching apps
- One dashboard for files + team communication
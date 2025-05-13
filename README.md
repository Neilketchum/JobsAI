# Jobs.ai

Jobs.ai is an AI-driven resume builder and job analysis platform that helps users create professional resumes and gain insights into job descriptions.

## Prerequisites

- Node.js v18 or higher
- npm v9+ (or yarn v1+)
- Docker (optional)
- Firebase CLI (optional, for deployment)

## Project Structure

- **backend/** – Express API for AI analysis and resume endpoints
- **src/** – React frontend (Create React App)
- **public/** – Static assets

## Environment Variables

1. Copy sample env files:

   ```bash
   cp .env.development .env
   cp backend/.env.example backend/.env
   ```

2. In root `.env`, set:

   ```bash
   REACT_APP_API_URL=http://localhost:5000
   # other front-end keys
   ```

3. In `backend/.env`, set:

   ```bash
   DB_CONNECTION=<your_db_url>
   JWT_SECRET=<your_jwt_secret>
   ```

## Installation

```bash
git clone https://github.com/<your-username>/jobs.ai.git
cd jobs.ai

# install backend
cd backend && npm install

# install frontend
echo "Installing frontend..." && cd .. && npm install
```

## Running Locally

### Backend (port 5000)

```bash
cd backend
npm run dev
```

### Frontend (port 3000)

```bash
npm start
```

Open http://localhost:3000 in your browser.

## Docker (Optional)

Build and run:

```bash
# from project root
docker build -t jobs-ai .
docker run -p 3000:3000 -p 5000:5000 jobs-ai
```

## Production Build & Deployment

1. Build frontend:

   ```bash
   npm run build
   ```

2. Deploy backend to your host (Heroku, AWS, etc.).
3. Serve `build/` folder via static file server or Firebase Hosting:

   ```bash
   npx firebase deploy
   ```

## Testing

```bash
npm test
```

## License

MIT. See [LICENSE](LICENSE).

## Contact

Questions? Contact [your-email@example.com].

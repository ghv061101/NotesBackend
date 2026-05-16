# Notes App Backend

Minimal Express + MongoDB Atlas backend for a notes app.

Setup

1. Copy `.env.sample` to `.env` and set `MONGODB_URI`.
2. Install dependencies:

```bash
npm install
```

3. Run in development:

```bash
npm run dev
```

Server runs on port **8080** (or `PORT` env var). Base URL: `http://localhost:8080`

API endpoints (base `/api/notes`):
- `GET /` - health
- `GET /api/notes` - list notes
- `GET /api/notes/:id` - get note
- `POST /api/notes` - create note { title, content }
- `PUT /api/notes/:id` - update note
- `DELETE /api/notes/:id` - delete note

Auth endpoints (base `/api/auth`):
- `POST /api/auth/register` - register { email, password } -> returns `token`
- `POST /api/auth/login` - login { email, password } -> returns `token`

Notes are scoped to the authenticated user. Send `Authorization: Bearer <token>` header.
"# NotesBackend" 

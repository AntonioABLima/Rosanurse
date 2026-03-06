# Project

Web application with backend (FastAPI) and frontend (React).

## Estrutura

```
/backend  # API FastAPI
/frontend # App React
```

## Configuração inicial

1. **Backend**
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   - By default the application uses SQLite (`./app.db` file).
   - To connect to Postgres (or any other SQLAlchemy-supported database), set
     the environment variable `DATABASE_URL` to the full connection string,
     e.g. `postgresql://user:pass@localhost/dbname` before starting the server.

2. **Frontend**
   ```bash
   cd frontend
   # utilizar create-react-app, Vite ou Next.js
   npm install
   npm start
   ```

## Git

* Adicionar `.gitignore` para Python e Node.
* Faça commits frequentes enquanto desenvolve.

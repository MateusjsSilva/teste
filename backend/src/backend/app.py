from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers.auth import auth
from backend.routers.task import tasks

app = FastAPI(
    title="Task Manager API",
    description="API para gerenciamento de tarefas",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

app.include_router(auth)
app.include_router(tasks)

origins = [
    'http://localhost:3000',
]

# Adicionar o middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # Permite o envio de credenciais
    allow_methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allow_headers=['*'],  # Permite todos os cabeçalhos
)

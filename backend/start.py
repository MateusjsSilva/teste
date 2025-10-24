#!/usr/bin/env python3
"""
Script de entrada que inicializa o banco de dados com Alembic e executa o servidor.
"""

import os
import sys
import time
import subprocess
from pathlib import Path
from sqlalchemy import text

# Adiciona o diretório src ao PYTHONPATH
sys.path.insert(0, str(Path(__file__).parent / "src"))

def wait_for_database():
    """Aguarda o banco de dados estar disponível."""
    print("🔄 Aguardando banco de dados estar disponível...")
    
    max_attempts = 60
    attempt = 0
    
    while attempt < max_attempts:
        try:
            from backend.models.database import engine
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            print("✅ Banco de dados disponível!")
            return True
        except Exception as e:
            attempt += 1
            print(f"⏳ Tentativa {attempt}/{max_attempts} - Erro: {str(e)[:100]}...")
            time.sleep(2)
    
    print("❌ Timeout aguardando banco de dados!")
    return False

def run_migrations():
    """Executa as migrações do Alembic."""
    try:
        print("🚀 Executando migrações do Alembic...")
        
        # Define PYTHONPATH para o Alembic
        os.environ['PYTHONPATH'] = '/app/src'
        
        # Executa alembic upgrade head
        result = subprocess.run(
            ["alembic", "upgrade", "head"],
            capture_output=True,
            text=True,
            cwd="/app",
            env={**os.environ, 'PYTHONPATH': '/app/src'}
        )
        
        if result.returncode == 0:
            print("✅ Migrações executadas com sucesso!")
            print(f"Output: {result.stdout}")
            return True
        else:
            print(f"❌ Erro ao executar migrações: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ Erro ao executar migrações: {e}")
        return False

def create_initial_migration():
    """Verifica se existe migração inicial."""
    try:
        print("🔍 Verificando se existe migração inicial...")
        
        # Define PYTHONPATH para o Alembic
        os.environ['PYTHONPATH'] = '/app/src'
        
        # Verifica se já existe alguma migração
        result = subprocess.run(
            ["alembic", "current"],
            capture_output=True,
            text=True,
            cwd="/app",
            env={**os.environ, 'PYTHONPATH': '/app/src'}
        )
        
        print(f"Status atual do Alembic: {result.stdout}")
        
        if "head" not in result.stdout:
            print("📝 Migração inicial já existe!")
            return True
        else:
            print("✅ Migrações já aplicadas!")
            return True
            
    except Exception as e:
        print(f"❌ Erro ao verificar migrações: {e}")
        return False

def start_server():
    """Inicia o servidor FastAPI."""
    print("🚀 Iniciando servidor FastAPI...")
    
    # Executa o uvicorn
    cmd = [
        "python", "-m", "uvicorn", 
        "backend.app:app", 
        "--host", "0.0.0.0", 
        "--port", "8000", 
        "--reload"
    ]
    
    subprocess.run(cmd)

if __name__ == "__main__":
    print("🎯 Iniciando aplicação com Alembic...")
    
    # Aguarda banco estar disponível
    if not wait_for_database():
        sys.exit(1)
    
    # Cria migração inicial se necessário
    if not create_initial_migration():
        sys.exit(1)
    
    # Executa migrações
    if not run_migrations():
        sys.exit(1)
    
    # Inicia servidor
    start_server()
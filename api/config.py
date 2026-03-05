from flask import Flask, request, jsonify, render_template, Blueprint
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
import sqlite3

# Caminho do banco local SQLite
CAMINHO_DB_LOCAL = "vendas.db"

# Instância global do SQLAlchemy (usada no app principal e nos blueprints)
db = SQLAlchemy()

def inicializar_banco_sqlite():
    conn = sqlite3.connect(CAMINHO_DB_LOCAL)
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS vendas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero_comanda INTEGER,
            meio_pagamento TEXT,
            valor_total REAL,
            data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            id_garcom INTEGER,
            pdv TEXT
        )
    """)

    # Migração: adiciona coluna pdv se não existir
    try:
        cur.execute("ALTER TABLE vendas ADD COLUMN pdv TEXT")
    except sqlite3.OperationalError:
        pass  # Coluna já existe

    cur.execute("""
        CREATE TABLE IF NOT EXISTS FECHAMENTO_CAIXA (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            total_caixa REAL,
            total_contado REAL,
            total_abertura REAL,
            data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            operador TEXT,
            observacao TEXT
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS USUARIOS (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            senha TEXT NOT NULL,
            adm BOOLEAN DEFAULT FALSE
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS IMPRESSORAS(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip TEXT NOT NULL,
            nome_impressora TEXT NOT NULL,
            porta INTEGER NOT NULL
        )
        """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS itens_venda (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_venda INTEGER,
            nome_produto TEXT,
            quantidade INTEGER,
            valor_unitario REAL,
            FOREIGN KEY (id_venda) REFERENCES vendas (id)
        )
    """)

    conn.commit()
    conn.close()


inicializar_banco_sqlite()
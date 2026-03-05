from flask import Blueprint, request, jsonify
import sqlite3
import datetime
from config import CAMINHO_DB_LOCAL

analises_bp = Blueprint('analises_bp', __name__)

def get_db_connection():
    conn = sqlite3.connect(CAMINHO_DB_LOCAL)
    conn.row_factory = sqlite3.Row
    return conn

@analises_bp.route('/relatorio/fluxo_horario', methods=['GET'])
def fluxo_horario():
    """Retorna a contagem de vendas agrupada por hora do dia."""
    inicio = request.args.get('inicio') # DD-MM-YYYY
    fim = request.args.get('fim')       # DD-MM-YYYY

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Filtro de data otimizado usando DATE() do SQLite
        params = []
        where_clause = ""
        if inicio and fim:
            # Converter DD-MM-YYYY (front) para YYYY-MM-DD (sqlite)
            d_ini = datetime.datetime.strptime(inicio, '%d-%m-%Y').strftime('%Y-%m-%d')
            d_fim = datetime.datetime.strptime(fim, '%d-%m-%Y').strftime('%Y-%m-%d')
            where_clause = "WHERE DATE(data_hora) BETWEEN ? AND ?"
            params = [d_ini, d_fim]

        cur.execute(f"""
            SELECT STRFTIME('%H', data_hora) as hora, COUNT(*) as vendas
            FROM vendas
            {where_clause}
            GROUP BY hora
            ORDER BY hora
        """, params)
        
        rows = cur.fetchall()
        
        # Garantir que todas as 24 horas existam (preencher lacunas)
        fluxo_map = {row['hora']: row['vendas'] for row in rows}
        resultado = []
        for h in range(24):
            h_str = str(h).zfill(2)
            resultado.append({
                "hora": h_str,
                "vendas": fluxo_map.get(h_str, 0)
            })
        
        return jsonify(resultado), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()

@analises_bp.route('/relatorio/ticket_medio', methods=['GET'])
def ticket_medio():
    """Retorna o ticket médio (valor total / número de vendas) do período."""
    inicio = request.args.get('inicio')
    fim = request.args.get('fim')

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        params = []
        where_clause = ""
        if inicio and fim:
            d_ini = datetime.datetime.strptime(inicio, '%d-%m-%Y').strftime('%Y-%m-%d')
            d_fim = datetime.datetime.strptime(fim, '%d-%m-%Y').strftime('%Y-%m-%d')
            where_clause = "WHERE DATE(data_hora) BETWEEN ? AND ?"
            params = [d_ini, d_fim]

        cur.execute(f"""
            SELECT 
                COUNT(*) as total_vendas,
                SUM(valor_total) as total_faturado,
                AVG(valor_total) as ticket_medio
            FROM vendas
            {where_clause}
        """, params)
        
        row = cur.fetchone()
        
        return jsonify({
            "ticket_medio": round(row['ticket_medio'] or 0, 2),
            "total_faturado": round(row['total_faturado'] or 0, 2),
            "total_vendas": row['total_vendas'] or 0
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()

@analises_bp.route('/relatorio/top_produtos', methods=['GET'])
def top_produtos():
    """Retorna os 5 produtos mais vendidos no período (quantidade total)."""
    inicio = request.args.get('inicio')
    fim = request.args.get('fim')

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        params = []
        where_clause = ""
        if inicio and fim:
            d_ini = datetime.datetime.strptime(inicio, '%d-%m-%Y').strftime('%Y-%m-%d')
            d_fim = datetime.datetime.strptime(fim, '%d-%m-%Y').strftime('%Y-%m-%d')
            where_clause = "WHERE DATE(v.data_hora) BETWEEN ? AND ?"
            params = [d_ini, d_fim]

        cur.execute(f"""
            SELECT 
                iv.nome_produto,
                SUM(iv.quantidade) as total_qtd
            FROM itens_venda iv
            JOIN vendas v ON iv.id_venda = v.id
            {where_clause}
            GROUP BY iv.nome_produto
            ORDER BY total_qtd DESC
            LIMIT 5
        """, params)
        
        rows = cur.fetchall()
        
        resultado = []
        for row in rows:
            resultado.append({
                "produto": row['nome_produto'],
                "quantidade": row['total_qtd']
            })
        
        return jsonify(resultado), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()

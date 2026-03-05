from flask import request, jsonify, Blueprint
from config import CAMINHO_DB_LOCAL
import sqlite3
from escpos.printer import Network

printers_bp = Blueprint('printers_bp', __name__)

@printers_bp.route('/cadastrar_impressora', methods=['POST'])
def cadastrar_impressora():
    try:
        data = request.get_json()
        nome = data.get("name")
        ip = data.get("ip")
        porta = int(data.get("port", 9100))
        
        conn = sqlite3.connect(CAMINHO_DB_LOCAL)
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO IMPRESSORAS (nome_impressora, ip, porta)
            VALUES (?, ?, ?)
        """, (nome, ip, porta))
        conn.commit()
        conn.close()
        return jsonify({"message": "Impressora cadastrada com sucesso"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@printers_bp.route('/listar_impressoras', methods=['GET'])
def listar_impressoras():
    try:
        conn = sqlite3.connect(CAMINHO_DB_LOCAL)
        cur = conn.cursor()
        cur.execute("SELECT id, nome_impressora, ip, porta FROM IMPRESSORAS ORDER BY nome_impressora ASC")
        result = cur.fetchall()
        conn.close()

        impressoras = [{
            "id": row[0],
            "name": row[1],
            "ip": row[2],
            "port": str(row[3])
        } for row in result]

        return jsonify(impressoras), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@printers_bp.route('/atualizar_impressora/<int:id>', methods=['PUT'])
def atualizar_impressora(id):
    try:
        data = request.get_json()
        nome = data.get("name")
        ip = data.get("ip")
        porta = int(data.get("port", 9100))
        
        conn = sqlite3.connect(CAMINHO_DB_LOCAL)
        cur = conn.cursor()
        cur.execute("""
            UPDATE IMPRESSORAS
            SET nome_impressora = ?, ip = ?, porta = ?
            WHERE id = ?
        """, (nome, ip, porta, id))
        conn.commit()
        conn.close()
        return jsonify({"message": "Impressora atualizada com sucesso"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@printers_bp.route('/deletar_impressora/<int:id>', methods=['DELETE'])
def deletar_impressora(id):
    try:
        conn = sqlite3.connect(CAMINHO_DB_LOCAL)
        cur = conn.cursor()
        cur.execute("DELETE FROM IMPRESSORAS WHERE id = ?", (id,))
        conn.commit()
        conn.close()
        return jsonify({"message": "Impressora deletada com sucesso"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@printers_bp.route('/testar_impressora', methods=['POST'])
def testar_impressora():
    try:
        data = request.get_json()
        ip = data.get("ip")
        porta = int(data.get("port", 9100))
        
        if not ip:
            return jsonify({"error": "IP da impressora é obrigatório"}), 400
            
        try:
            p = Network(ip, port=porta)
            p.set(align='center')
            p.text("\n\n")
            p.text("TESTE DE IMPRESSAO\n")
            p.text("PASTELARIA CANASTRA\n")
            p.text("--------------------------------\n")
            p.text("Impressora: OK\n")
            p.text(f"IP: {ip}\n")
            p.text(f"Porta: {porta}\n")
            p.text("--------------------------------\n")
            p.text("\n\n\n")
            p.cut()
            p.close()
            return jsonify({"message": "Teste enviado com sucesso"}), 200
        except Exception as e:
            return jsonify({"error": f"Falha ao conectar na impressora: {str(e)}"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

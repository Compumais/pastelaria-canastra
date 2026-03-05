from flask import Flask, request, jsonify, render_template,Blueprint
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from waitress import serve
import sqlite3
import os
import datetime
from escpos.printer import Network, File, Win32Raw
from config import  CAMINHO_DB_LOCAL, db

finalizar_venda_bp = Blueprint('finalizar_venda_bp', __name__)

@finalizar_venda_bp.route('/finalizar_venda', methods=['POST'])
def finalizar_venda():
    now = datetime.datetime.now()
    horario_fechamento = now.strftime('%Y-%m-%d %H:%M:%S')  # Formato ISO para compatibilidade com SQLite

    try:
        data = request.get_json()
        
        meio_pagamento = data.get("meio_pagamento")
        valor_total = data.get("valor_total")
        id_garcom = data.get("id_garcom")
        numeromesa = data.get("numeromesa")
        pdv = data.get("pdv") # Recebido do front-end (localStorage)
        produtos = data.get("produtos")
        produtos_filtrados = list(map(lambda p: {
            "nomeproduto": p.get("nomeproduto"),
            "quantidade": p.get("quantidade"),
            "valortotal_item": p.get("valortotal_item")
        }, produtos))


       
        
        # Inserir a venda no SQLite com horário atual
        conn = sqlite3.connect(CAMINHO_DB_LOCAL)
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO vendas (numero_comanda, meio_pagamento, valor_total, id_garcom, data_hora, pdv)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (numeromesa, meio_pagamento, valor_total, id_garcom, horario_fechamento, pdv))
        
        venda_id = cur.lastrowid # Pega o ID da venda recém inserida

        # Inserir cada item da venda na tabela itens_venda
        for prod in produtos:
            nome_p = prod.get("nomeproduto")
            qtd_p = prod.get("quantidade")
            # Calcula valor unitário aproximado se não vier (total_item / qtd)
            v_total_item = float(prod.get("valortotal_item") or 0)
            v_unitario = v_total_item / float(qtd_p) if float(qtd_p) > 0 else 0

            cur.execute("""
                INSERT INTO itens_venda (id_venda, nome_produto, quantidade, valor_unitario)
                VALUES (?, ?, ?, ?)
            """, (venda_id, nome_p, qtd_p, v_unitario))

        conn.commit()
        conn.close()

        # Atualizar status da mesa
        query = text("""
            UPDATE contamesa 
            SET status = 99, horafechamento = CURRENT_TIMESTAMP,ECFCUPOM ='FINALIZADO PELO APP '
            WHERE numeromesa = :numeromesa 
        """)
        db.session.execute(query, {'numeromesa': numeromesa})
        db.session.commit()

        imprimir_venda(meio_pagamento, valor_total, numeromesa,horario_fechamento, produtos_filtrados)


        return jsonify({
            "message": f"Venda registrada e mesa {numeromesa} fechada com sucesso.",
            "data_hora": horario_fechamento  # opcional: pode retornar ao front
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500





def imprimir_venda(meio_pagamento, valor_total, numeromesa, horario_fechamento, produtos_filtrados):
    """Envia os dados de fechamento para a impressora térmica usando ESC/POS"""
    try:
        impressora_ip = "192.168.2.107" # IP da impressora
        

        p = Network(impressora_ip)
        p.set(align='center')
        p.text('\x1B\x21\x08')  # fonte um pouco maior
        p.text("=== PASTELARIA CANASTRA ===\n\n")

        p.set(align='left')
        p.text(f"Data: {horario_fechamento}\n")
        p.text(f"\n******************************************\n")
        p.text(f"\n Comanda {numeromesa}\n")
        p.text(f"\n******************************************\n")
        p.text(f"\nItem(s) consumido(s):\n")

        # Cabeçalho da tabela
        p.text(f"\n{'Produto':<20}{'Qtd':>5}{'Total':>10}\n")
        p.text("-" * 35 + "\n")

        # Loop pelos produtos e formatar cada linha
        for prod in produtos_filtrados:
            nome = prod["nomeproduto"][:20]  # truncate se for muito grande
            qtd = prod["quantidade"]
            total = prod["valortotal_item"]
            p.text(f"{nome:<20}{qtd:>5}{float(total):>10.2f}\n")

        p.text(f"\n" + "*" * 40 + "\n")
        p.text(f"\n Total: R$ {float(valor_total):.2f}\n")
        p.text(f"\n Meio de Pagamento: {meio_pagamento}\n")
        p.text(f"\n******************************************\n")
        p.set(align='center')
        p.text("obrigado pela preferência!\n\n")
        p.text("Volte sempre!\n\n")
        p.text("CNPJ:21.557.798/0001-47\n")
        p.text("Documento sem valor fiscal\n")

        p.cut()
        print(f"Imprimindo fechamento na impressora {impressora_ip}...")
    except Exception as e:
        print(f"Erro ao imprimir: {e}")





























###ROTA PARA FINALIZAR COMANDA####
# @finalizar_venda_bp.route('/finalizar_venda', methods=['POST'])
# def finalizar_venda():
#     now = datetime.datetime.now()
#     try:
#         data = data.get('%D-%m-%Y %H:%M:%S')
#         numero_comanda = data.get("numeromesa")
#         meio_pagamento = data.get("meio_pagamento")
#         valor_total = data.get("valor_total")
#         id_garcom = data.get("id_garcom")
#         numeromesa = data.get("numeromesa") 

#         if not all([numero_comanda, meio_pagamento, valor_total, numeromesa]):
#             return jsonify({"error": "Todos os campos são obrigatórios"}), 400

#         # Inserir a venda no SQLite
#         conn = sqlite3.connect(CAMINHO_DB_LOCAL)
#         cur = conn.cursor()
#         cur.execute("""
#             INSERT INTO vendas (numero_comanda, meio_pagamento, valor_total, id_garcom)
#             VALUES (?, ?, ?, ?)
#         """, (numero_comanda, meio_pagamento, valor_total, id_garcom))
#         conn.commit()
#         conn.close()

#         # Atualizar o status da mesa no banco via SQLAlchemy
#         query = text("""
#             UPDATE contamesa 
#             SET status = 4, horafechamento = NOW()
#             WHERE numeromesa = :numeromesa
#         """)
#         db.session.execute(query, {'numeromesa': numeromesa})
#         db.session.commit()

#         return jsonify({"message": f"Venda registrada e mesa {numeromesa} fechada com sucesso."}), 201

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
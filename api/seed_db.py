import sqlite3
import random
import datetime

CAMINHO_DB_LOCAL = "vendas.db"

def seed_banco():
    try:
        conn = sqlite3.connect(CAMINHO_DB_LOCAL)
        cur = conn.cursor()

        print("Populando banco de dados com dados de teste...")

        # 1. Usuários (Garçons)
        usuarios = [
            ("Rodrigo Admin", "123", 1),
            ("João Garçom", "123", 0),
            ("Maria Atendente", "123", 0),
            ("Carlos Suporte", "123", 0)
        ]
        cur.executemany("INSERT INTO USUARIOS (nome, senha, adm) VALUES (?, ?, ?)", usuarios)
        print(f" - {len(usuarios)} usuários criados.")

        # 2. Vendas e Itens
        meios_pagamento = ["Dinheiro", "Cartão de Crédito", "Cartão de Débito", "Pix"]
        pdvs = ["PDV_MOVEL_01", "PDV_MOVEL_02", "CAIXA_PRINCIPAL"]
        produtos_lista = [
            ("Pastel de Carne", 12.00),
            ("Pastel de Queijo", 10.00),
            ("Pastel de Frango", 11.00),
            ("Caldinho de Cana", 8.00),
            ("Refrigerante Lata", 6.00),
            ("Suco Natural", 9.00),
            ("Porção de Batata", 25.00),
            ("Cerveja 600ml", 15.00)
        ]

        # Gerar 50 vendas nos últimos 3 dias
        for i in range(50):
            # Data aleatória nos últimos 3 dias
            dias_atras = random.randint(0, 3)
            horas_atras = random.randint(0, 23)
            minutos_atras = random.randint(0, 59)
            data_venda = datetime.datetime.now() - datetime.timedelta(days=dias_atras, hours=horas_atras, minutes=minutos_atras)
            data_venda_str = data_venda.strftime('%d/%m/%y %H:%M:%S')

            meio = random.choice(meios_pagamento)
            pdv = random.choice(pdvs)
            id_garcom = random.randint(1, 4)
            mesa = random.randint(1, 30)
            
            # Itens aleatórios para esta venda
            num_itens = random.randint(1, 5)
            itens_venda_atual = []
            valor_total_venda = 0
            
            for _ in range(num_itens):
                prod_nome, prod_preco = random.choice(produtos_lista)
                qtd = random.randint(1, 4)
                v_total_item = prod_preco * qtd
                valor_total_venda += v_total_item
                itens_venda_atual.append((prod_nome, qtd, prod_preco))

            # Insere Venda
            cur.execute("""
                INSERT INTO vendas (numero_comanda, meio_pagamento, valor_total, id_garcom, data_hora, pdv)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (mesa, meio, valor_total_venda, id_garcom, data_venda_str, pdv))
            
            venda_id = cur.lastrowid

            # Insere Itens
            for item in itens_venda_atual:
                cur.execute("""
                    INSERT INTO itens_venda (id_venda, nome_produto, quantidade, valor_unitario)
                    VALUES (?, ?, ?, ?)
                """, (venda_id, item[0], item[1], item[2]))

        print(" - 50 vendas e seus itens foram gerados com sucesso.")

        # 3. Fechamentos de Caixa
        for i in range(3):
            data_fechamento = datetime.datetime.now() - datetime.timedelta(days=i)
            cur.execute("""
                INSERT INTO FECHAMENTO_CAIXA (total_caixa, total_contado, total_abertura, data_hora, operador, observacao)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (random.uniform(500, 2000), random.uniform(500, 2000), 100.00, data_fechamento.strftime('%d/%m/%y %H:%M:%S'), "Rodrigo", "Fechamento automático de teste"))
        
        print(" - 3 registros de fechamento de caixa criados.")

        conn.commit()
        print("\nBanco de dados populado com sucesso!")

    except Exception as e:
        print(f"Erro ao popular banco: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    seed_banco()

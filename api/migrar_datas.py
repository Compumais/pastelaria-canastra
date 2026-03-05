import sqlite3
import datetime
import os

CAMINHO_DB_LOCAL = "vendas.db"

def converter_data(data_br):
    try:
        # Tenta converter de DD/MM/YY HH:MM:SS para YYYY-MM-DD HH:MM:SS
        dt = datetime.datetime.strptime(data_br, '%d/%m/%y %H:%M:%S')
        return dt.strftime('%Y-%m-%d %H:%M:%S')
    except Exception as e:
        # Se já estiver no formato correto ou der erro, retorna como está
        return data_br

def migrar():
    if not os.path.exists(CAMINHO_DB_LOCAL):
        print(f"Arquivo {CAMINHO_DB_LOCAL} não encontrado.")
        return

    conn = sqlite3.connect(CAMINHO_DB_LOCAL)
    cur = conn.cursor()

    cur.execute("SELECT id, data_hora FROM vendas")
    vendas = cur.fetchall()

    print(f"Iniciando migração de {len(vendas)} registros...")
    
    count = 0
    for id_venda, data_hora in vendas:
        nova_data = converter_data(data_hora)
        if nova_data != data_hora:
            cur.execute("UPDATE vendas SET data_hora = ? WHERE id = ?", (nova_data, id_venda))
            count += 1

    conn.commit()
    conn.close()
    print(f"Migração concluída! {count} registros atualizados.")

if __name__ == "__main__":
    migrar()

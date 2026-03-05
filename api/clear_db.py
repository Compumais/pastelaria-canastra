import sqlite3
import os

CAMINHO_DB_LOCAL = "vendas.db"

def limpar_banco():
    if not os.path.exists(CAMINHO_DB_LOCAL):
        print(f"Banco de dados {CAMINHO_DB_LOCAL} não encontrado.")
        return

    try:
        conn = sqlite3.connect(CAMINHO_DB_LOCAL)
        cur = conn.cursor()

        # Tabelas para limpar
        tabelas = [
            "itens_venda",
            "vendas",
            "FECHAMENTO_CAIXA",
            "USUARIOS",
            "IMPRESSORAS"
        ]

        print("Limpando dados...")
        for tabela in tabelas:
            try:
                cur.execute(f"DELETE FROM {tabela}")
                print(f" - Tabela {tabela} limpa.")
            except sqlite3.OperationalError as e:
                print(f" - Erro ao limpar {tabela}: {e} (Tabela pode não existir)")

        conn.commit()
        print("\nTodos os dados foram removidos com sucesso!")
        
    except Exception as e:
        print(f"Erro geral: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    confirmacao = input("TEM CERTEZA que deseja apagar TODOS os dados do banco? (s/N): ")
    if confirmacao.lower() == 's':
        limpar_banco()
    else:
        print("Operação cancelada.")

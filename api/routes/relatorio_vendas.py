from flask import Blueprint, request, jsonify, Response
import sqlite3
import datetime
import io
import csv
from config import CAMINHO_DB_LOCAL

relatorio_vendas_bp = Blueprint('relatorio_vendas_bp', __name__)

@relatorio_vendas_bp.route('/relatorio/vendas', methods=['GET'])
def gear_relatorio_vendas():
    data_inicio = request.args.get('inicio') # Ex: 01-03-2024
    data_fim = request.args.get('fim')       # Ex: 31-03-2024
    formato = request.args.get('formato', 'txt').lower()

    if not data_inicio or not data_fim:
        return jsonify({"error": "Parâmetros 'inicio' e 'fim' são obrigatórios (formato DD-MM-YYYY)"}), 400

    try:
        conn = sqlite3.connect(CAMINHO_DB_LOCAL)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()

        cur.execute("SELECT * FROM vendas")
        vendas = cur.fetchall()

        vendas_filtradas = []
        for v in vendas:
            data_venda_str = v['data_hora'].split(' ')[0] # YYYY-MM-DD
            try:
                dt_venda = datetime.datetime.strptime(data_venda_str, '%Y-%m-%d')
                dt_ini = datetime.datetime.strptime(data_inicio, '%d-%m-%Y')
                dt_fim = datetime.datetime.strptime(data_fim, '%d-%m-%Y')
                
                if dt_ini <= dt_venda <= dt_fim:
                    vendas_filtradas.append(v)
            except:
                continue

        total_vendas = len(vendas_filtradas)
        valor_total_periodo = sum(v['valor_total'] for v in vendas_filtradas)

        if formato == 'csv':
            output = io.StringIO()
            writer = csv.writer(output, delimiter=';')
            writer.writerow(['Data/Hora', 'Comanda', 'Garçom', 'PDV', 'Valor Total'])
            for v in vendas_filtradas:
                writer.writerow([v['data_hora'], v['numero_comanda'], v['id_garcom'], v['pdv'] or 'N/A', f"{v['valor_total']:.2f}"])
            
            return Response(
                output.getvalue(),
                mimetype="text/csv",
                headers={"Content-disposition": f"attachment; filename=relatorio_vendas_{data_inicio}_{data_fim}.csv"}
            )

        elif formato == 'html':
            html = [
                "<html><head><meta charset='utf-8'><style>",
                "body { font-family: sans-serif; margin: 20px; }",
                "table { width: 100%; border-collapse: collapse; margin-top: 20px; }",
                "th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }",
                "th { background-color: #f2 f2 f2; }",
                "h1, h3 { color: #333; }",
                "</style></head><body>",
                "<h1>RELATÓRIO DE VENDAS POR PERÍODO</h1>",
                f"<h3>Período: {data_inicio} até {data_fim}</h3>",
                f"<p>Total de Vendas: {total_vendas}</p>",
                f"<p>Valor Total: R$ {valor_total_periodo:.2f}</p>",
                "<table><thead><tr><th>Data/Hora</th><th>Comanda</th><th>Garçom</th><th>PDV</th><th>Valor Total</th></tr></thead><tbody>"
            ]
            for v in vendas_filtradas:
                html.append(f"<tr><td>{v['data_hora']}</td><td>{v['numero_comanda']}</td><td>{v['id_garcom']}</td><td>{v['pdv'] or 'N/A'}</td><td>R$ {v['valor_total']:.2f}</td></tr>")
            
            html.append("</tbody></table>")
            html.append(f"<p><small>Gerado em: {datetime.datetime.now().strftime('%d/%m/%Y %H:%M:%S')}</small></p>")
            html.append("</body></html>")
            
            return Response(
                "\n".join(html),
                mimetype="text/html",
                headers={"Content-disposition": f"attachment; filename=relatorio_vendas_{data_inicio}_{data_fim}.html"}
            )

        else: # TXT
            conteudo = []
            conteudo.append("="*40)
            conteudo.append("      RELATÓRIO DE VENDAS POR PERÍODO")
            conteudo.append("="*40)
            conteudo.append(f"Período: {data_inicio} até {data_fim}")
            conteudo.append(f"Total de Vendas: {total_vendas}")
            conteudo.append(f"Valor Total: R$ {valor_total_periodo:.2f}")
            conteudo.append("-" * 45)
            conteudo.append(f"{'Data/Hora':<20} {'Comanda':<8} {'Garçom':<10} {'PDV':<10}")
            conteudo.append("-" * 45)

            for v in vendas_filtradas:
                pdv_nome = v['pdv'] if v['pdv'] else "N/A"
                conteudo.append(f"{v['data_hora']:<20} {v['numero_comanda']:<8} {v['id_garcom']:<10} {pdv_nome:<10}")
                conteudo.append(f"VALOR TOTAL COMANDA: R$ {v['valor_total']:>8.2f}")
                
                cur.execute("SELECT * FROM itens_venda WHERE id_venda = ?", (v['id'],))
                itens = cur.fetchall()
                for item in itens:
                    conteudo.append(f"  > {item['nome_produto'][:20]:<20} x{item['quantidade']:<3} R$ {item['valor_unitario']:>8.2f}")
                conteudo.append("-" * 45)

            conteudo.append("\nGerado em: " + datetime.datetime.now().strftime('%d/%m/%Y %H:%M:%S'))
            relatorio_txt = "\n".join(conteudo)

            return Response(
                relatorio_txt,
                mimetype="text/plain",
                headers={"Content-disposition": f"attachment; filename=relatorio_vendas_{data_inicio}_{data_fim}.txt"}
            )

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@relatorio_vendas_bp.route('/relatorio/mensal', methods=['GET'])
def gear_relatorio_mensal():
    mes = request.args.get('mes') # MM
    ano = request.args.get('ano') # YYYY
    formato = request.args.get('formato', 'txt').lower()

    if not mes or not ano:
        return jsonify({"error": "Parâmetros 'mes' e 'ano' são obrigatórios"}), 400

    try:
        conn = sqlite3.connect(CAMINHO_DB_LOCAL)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()

        cur.execute("SELECT * FROM vendas")
        vendas_todas = cur.fetchall()

        vendas_do_mes = []
        mapa_itens_global = {} # {nome: {qtd: X, total: Y}}
        total_mensal = 0

        for v in vendas_todas:
            data_venda_str = v['data_hora'].split(' ')[0]
            try:
                dt_venda = datetime.datetime.strptime(data_venda_str, '%Y-%m-%d')
                if dt_venda.month == int(mes) and dt_venda.year == int(ano):
                    vendas_do_mes.append(v)
                    total_mensal += v['valor_total']
            except:
                continue

        for v in vendas_do_mes:
            cur.execute("SELECT * FROM itens_venda WHERE id_venda = ?", (v['id'],))
            itens = cur.fetchall()
            for item in itens:
                nome = item['nome_produto']
                qtd = item['quantidade']
                unitario = item['valor_unitario']
                total_item = qtd * unitario
                
                if nome not in mapa_itens_global:
                    mapa_itens_global[nome] = {'quantidade': 0, 'valor_total': 0}
                mapa_itens_global[nome]['quantidade'] += qtd
                mapa_itens_global[nome]['valor_total'] += total_item
        
        itens_ordenados = sorted(mapa_itens_global.items(), key=lambda x: x[1]['valor_total'], reverse=True)

        if formato == 'csv':
            output = io.StringIO()
            writer = csv.writer(output, delimiter=';')
            writer.writerow(['Produto', 'Quantidade', 'Total Vendido (R$)'])
            for nome, dados in itens_ordenados:
                writer.writerow([nome, dados['quantidade'], f"{dados['valor_total']:.2f}"])
            
            return Response(
                output.getvalue(),
                mimetype="text/csv",
                headers={"Content-disposition": f"attachment; filename=relatorio_mensal_{mes}_{ano}.csv"}
            )

        elif formato == 'html':
            html = [
                "<html><head><meta charset='utf-8'><style>",
                "body { font-family: sans-serif; margin: 20px; }",
                "table { width: 100%; border-collapse: collapse; margin-top: 20px; }",
                "th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }",
                "th { background-color: #f2 f2 f2; }",
                "h1, h3 { color: #333; }",
                "</style></head><body>",
                f"<h1>RESUMO DE VENDAS MENSAL - {mes}/{ano}</h1>",
                f"<p>Faturamento Total: R$ {total_mensal:.2f}</p>",
                f"<p>Total de Comandas: {len(vendas_do_mes)}</p>",
                "<table><thead><tr><th>Produto</th><th>Quantidade</th><th>Total Vendido</th></tr></thead><tbody>"
            ]
            for nome, dados in itens_ordenados:
                html.append(f"<tr><td>{nome}</td><td>{dados['quantidade']}</td><td>R$ {dados['valor_total']:.2f}</td></tr>")
            
            html.append("</tbody></table>")
            html.append(f"<p><small>Gerado em: {datetime.datetime.now().strftime('%d/%m/%Y %H:%M:%S')}</small></p>")
            html.append("</body></html>")
            
            return Response(
                "\n".join(html),
                mimetype="text/html",
                headers={"Content-disposition": f"attachment; filename=relatorio_mensal_{mes}_{ano}.html"}
            )
        
        else: # TXT
            conteudo = []
            conteudo.append("="*55)
            conteudo.append(f"      RESUMO DE VENDAS MENSAL - {mes}/{ano}")
            conteudo.append("="*55)
            conteudo.append(f"Faturamento Total no Mês: R$ {total_mensal:.2f}")
            conteudo.append(f"Total de Comandas Finalizadas: {len(vendas_do_mes)}")
            conteudo.append("-" * 55)
            conteudo.append("\n" + "="*55)
            conteudo.append("      RESUMO TOTAL DE ITENS VENDIDOS NO MÊS")
            conteudo.append("="*55)
            conteudo.append(f"{'Produto':<30} {'Qtd':<6} {'Total Vendido':<12}")
            conteudo.append("-" * 55)
            
            for nome, dados in itens_ordenados:
                conteudo.append(f"{nome[:30]:<30} {dados['quantidade']:<6} R$ {dados['valor_total']:>10.2f}")

            conteudo.append("\n" + "="*55)
            conteudo.append("Gerado em: " + datetime.datetime.now().strftime('%d/%m/%Y %H:%M:%S'))

            relatorio_txt = "\n".join(conteudo)
            return Response(
                relatorio_txt,
                mimetype="text/plain",
                headers={"Content-disposition": f"attachment; filename=relatorio_mensal_{mes}_{ano}.txt"}
            )

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()


from flask import Flask, render_template, jsonify, request, redirect, url_for
from flask_cors import CORS
import sys
from PIL import Image
from pystray import Icon, MenuItem as item
from pystray import Menu as menu
import threading
from sqlalchemy import text
from waitress import serve
import os

from config import db  # <-- pega a instância de db aqui

# Blueprints
from routes.finalizar_venda import finalizar_venda_bp
from routes.total_dia import total_dia_bp
from routes.listar_vendas_fechadas import listar_vendas_fechadas_bp
from routes.listar_totais import listar_totais_bp
from routes.comandas import comandas_bp
from routes.listar_comandas import listar_comandas_bp
from routes.desempenho_garcom import desempenho_garcom_bp
from routes.fechamento import fechamento_bp
from routes.usuarios import usuarios_bp
from routes.login import login_bp
from routes.relatorio_vendas import relatorio_vendas_bp
from routes.printers import printers_bp
from routes.analises import analises_bp

# Inicializa o app Flask
app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return jsonify({"message": "Servidor Flask em execução!"})

# Configuração do banco PostgreSQL
DB_NAME = "unico"
DB_USER = "postgres"
DB_PASSWORD = "postgres"
DB_HOST = "localhost"
DB_PORT = "5432"
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializa o SQLAlchemy com a app
db.init_app(app)

# Testar conexão com PostgreSQL
def testar_conexao():
    try:
        with app.app_context():
            db.session.execute(text("SELECT 1"))
            db.session.commit()
        return True
    except Exception as e:
        print(f"Erro ao conectar no PostgreSQL: {e}")
        return False

if not testar_conexao():
    exit(1)

# Registro das blueprints
app.register_blueprint(comandas_bp)
app.register_blueprint(finalizar_venda_bp)
app.register_blueprint(listar_comandas_bp)
app.register_blueprint(listar_totais_bp)
app.register_blueprint(listar_vendas_fechadas_bp)
app.register_blueprint(total_dia_bp)
app.register_blueprint(desempenho_garcom_bp)
app.register_blueprint(fechamento_bp)
app.register_blueprint(usuarios_bp)
app.register_blueprint(login_bp)
app.register_blueprint(relatorio_vendas_bp)
app.register_blueprint(printers_bp)
app.register_blueprint(analises_bp)

SERVIDOR_HOST = "0.0.0.0"
SERVIDOR_PORTA = 3333


def load_icon():
    if getattr(sys, "frozen", False) and hasattr(sys, "_MEIPASS"):
        base_path = sys._MEIPASS  # PyInstaller extrai os arquivos aqui
    else:
        base_path = os.path.dirname(os.path.abspath(__file__))
    icon_path = os.path.join(base_path, "icon.ico")
    if os.path.isfile(icon_path):
        return Image.open(icon_path)
    # Fallback: ícone em branco se o arquivo não existir
    return Image.new("RGB", (64, 64), color="gray")


def on_exit(icon, _):
    icon.stop()
    os._exit(0)


def run_flask():
    serve(app, host=SERVIDOR_HOST, port=SERVIDOR_PORTA, threads=4)


def abrir_navegador(icon, _):
    import webbrowser
    webbrowser.open(f"http://127.0.0.1:{SERVIDOR_PORTA}")


def run_tray():
    menu_tray = menu(
        item("Abrir no navegador", abrir_navegador),
        item("Sair", on_exit),
    )
    icon = Icon("ServidorFlask", load_icon(), title="Servidor de Vendas", menu=menu_tray)
    icon.run()


if __name__ == "__main__":
    flask_thread = threading.Thread(target=run_flask, daemon=True)
    flask_thread.start()
    run_tray()
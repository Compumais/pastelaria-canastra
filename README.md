# Happy Nation Canastra

Sistema de controle de comandas para estabelecimentos, com API em Python (Flask) e interface desktop em Next.js + Tauri. Permite gerenciar comandas abertas, pedidos, fechamento de caixa, usuários e impressão via impressoras térmicas.

---

## Estrutura do projeto

```
happy-nation-canastra/
├── api/                    # Backend Flask (Python)
│   ├── app.py              # Aplicação principal (servidor + bandeja do sistema)
│   ├── app.spec            # Configuração PyInstaller para empacotar o app
│   ├── config.py           # Configuração do banco (SQLite + PostgreSQL)
│   ├── routes/             # Blueprints (comandas, vendas, usuários, etc.)
│   ├── templates/
│   └── requirements.txt
├── web/                    # Frontend Next.js + Tauri (desktop)
│   ├── src/
│   ├── src-tauri/          # Configuração Tauri (Rust)
│   └── package.json
└── README.md
```

---

## Tecnologias utilizadas

### API (backend)

| Tecnologia | Uso |
|------------|-----|
| **Python 3.10** | Linguagem |
| **Flask** | Framework web e API REST |
| **Flask-CORS** | CORS para o frontend |
| **Flask-SQLAlchemy** | ORM |
| **SQLite** | Banco local (vendas, usuários, fechamentos) |
| **PostgreSQL** | Banco principal (configurável em `app.py`) |
| **Waitress** | Servidor WSGI em produção |
| **python-escpos** | Impressão em impressoras térmicas (rede/Windows) |
| **PyInstaller** | Empacotamento do app em executável (.exe) |
| **pystray** | Ícone na bandeja do sistema (Windows) |
| **Pillow (PIL)** | Ícone da bandeja |

### Web (frontend desktop)

| Tecnologia | Uso |
|------------|-----|
| **Next.js 15** | Framework React (App Router) |
| **TypeScript** | Tipagem |
| **Tailwind CSS** | Estilos |
| **React Query (@tanstack)** | Cache e requisições à API |
| **Axios** | Cliente HTTP |
| **Tauri 2** | Empacotamento desktop (Rust + WebView) |

---

## Pré-requisitos

- **API:** Python 3.10+, PostgreSQL (opcional; o app usa SQLite para dados locais)
- **Web:** Node.js 18+, npm ou pnpm
- **Tauri:** [Rust](https://www.rust-lang.org/tools/install), [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) (Windows) ou dependências equivalentes no seu SO

---

## Instalação e execução local

### 1. API (backend)

```bash
cd api
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Linux/macOS
pip install -r requirements.txt
```

Ajuste em `app.py` (se necessário) as variáveis de conexão PostgreSQL:

- `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`

O SQLite (`vendas.db`) é criado automaticamente na primeira execução.

Rodar em modo desenvolvimento (sem bandeja, com console):

- Comente o bloco que chama `run_tray()` e use apenas `app.run()` em `app.py`, **ou**
- Mantenha o código atual: o app sobe na porta **3333** e o ícone aparece na **bandeja do sistema**. Use o menu do ícone para “Abrir no navegador” ou “Sair”.

Para subir o servidor (com bandeja):

```bash
python app.py
```

O servidor fica em **http://127.0.0.1:3333** e o ícone na bandeja.

### 2. Web (frontend)

```bash
cd web
npm install
npm run dev
```

Acesse **http://localhost:3000**. A aplicação web consome a API em **http://127.0.0.1:3333** (certifique-se de que a API está rodando).

---

## Empacotar a API (Python) com PyInstaller

O `app.py` pode ser empacotado em um único executável (.exe) que roda em segundo plano na bandeja do sistema.

### Passo a passo

1. **Instalar o PyInstaller**

   ```bash
   cd api
   pip install pyinstaller
   ```

2. **Garantir que o app não está rodando**

   - Feche o executável anterior (se existir) e encerre qualquer `app.exe` ou processo Python do projeto (incluindo pelo ícone na bandeja: botão direito → Sair), para evitar “Acesso negado” ao sobrescrever `dist\app.exe`.

3. **Gerar o executável usando o arquivo spec**

   ```bash
   pyinstaller app.spec
   ```

   O `app.spec` já está configurado para:

   - Incluir `templates`, `routes` e `icon.ico`
   - Incluir `capabilities.json` (e demais `.json`) do pacote **escpos**
   - Incluir os módulos necessários (Flask, escpos, pystray, Waitress, etc.)
   - Gerar um único `.exe` sem console (`--noconsole`), com ícone

4. **Resultado**

   - Executável: `api\dist\app.exe`
   - Ao rodar, não abre janela; o app fica apenas na **bandeja do sistema**. Clique com o botão direito no ícone para “Abrir no navegador” (http://127.0.0.1:3333) ou “Sair”.

5. **Arquivos extras na mesma pasta do .exe (recomendado)**

   - Coloque na mesma pasta do `app.exe`:
     - `icon.ico` (se quiser garantir o ícone)
     - `vendas.db` (se o banco SQLite estiver sendo usado fora do pacote)

   O `vendas.db` pode ser criado automaticamente pelo app na primeira execução, dependendo de onde o executável é iniciado (diretório de trabalho).

### Comando alternativo (sem usar o .spec)

Se não quiser usar o `app.spec`, você pode chamar o PyInstaller diretamente. **Atenção:** o `capabilities.json` do escpos e o `icon.ico` precisam ser incluídos manualmente; o uso do `app.spec` é recomendado.

```bash
pyinstaller --onefile --noconsole --icon=icon.ico ^
  --add-data "templates;templates" --add-data "routes;routes" ^
  --hidden-import=flask --hidden-import=flask_sqlalchemy --hidden-import=flask_cors ^
  --hidden-import=routes --hidden-import=escpos --hidden-import=escpos.printer ^
  --hidden-import=escpos.capabilities --hidden-import=pystray --hidden-import=PIL.Image ^
  --hidden-import=waitress ^
  app.py
```

No Windows, o separador de pastas no `--add-data` é `;`. Em Linux/macOS use `:`.

---

## Build e uso do frontend com Tauri

O frontend Next.js é empacotado como aplicativo desktop com Tauri (janela nativa usando WebView).

### Passo a passo

1. **Instalar dependências do Tauri**

   - **Windows:** instalar [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) com workload “Desenvolvimento para desktop com C++”.
   - Instalar [Rust](https://www.rust-lang.org/tools/install): `rustup default stable`.

2. **Na pasta do frontend**

   ```bash
   cd web
   npm install
   ```

3. **Build do Next.js**

   ```bash
   npm run build
   ```

   Garanta que o build termina sem erros.

4. **Gerar o instalador/executável com Tauri**

   ```bash
   npm run tauri build
   ```

   Ou, para apenas gerar o bundle (incluindo instalador):

   ```bash
   npm run tauri bundle
   ```

5. **Onde encontrar o resultado**

   - Executável e instalador ficam em:  
     `web\src-tauri\target\release\`
   - Instalador (ex.: NSIS no Windows): dentro de `web\src-tauri\target\release\bundle\` (msi, exe de instalação, etc., conforme configurado no Tauri).

6. **Desenvolvimento com janela Tauri (sem instalar)**

   ```bash
   npm run tauri dev
   ```

   Abre a janela desktop com o app Next em modo desenvolvimento.

### Observação

O app Tauri (frontend) **consome a API** que roda em **http://127.0.0.1:3333**. Para uso completo:

1. Tenha a API rodando (por exemplo executando `api\dist\app.exe` ou `python api\app.py`).
2. Depois abra o app Tauri ou acesse o frontend no navegador apontando para essa API.

---

## Resumo dos comandos

| Ação | Onde | Comando |
|------|------|---------|
| Rodar API (com bandeja) | `api/` | `python app.py` |
| Empacotar API em .exe | `api/` | `pyinstaller app.spec` |
| Rodar frontend (dev) | `web/` | `npm run dev` |
| Build frontend | `web/` | `npm run build` |
| Build desktop Tauri | `web/` | `npm run tauri build` ou `npm run tauri bundle` |
| Desenvolvimento Tauri | `web/` | `npm run tauri dev` |

---

## API (referência rápida)

A API expõe endpoints REST na porta **3333**. Exemplos:

- **Autenticação:** `POST /login`
- **Usuários:** `POST /cadastrar_usuario`, `GET /listar-usarios`, etc.
- **Comandas:** `GET /listarcomandas`, `GET /comanda/:orderId`, `POST /finalizar_venda`
- **Fechamento:** `POST /fechamento`, `GET /listar_fechamentos`
- **Dashboard:** `GET /total_dia`, `GET /desempenho_garcom`, etc.

Para a lista completa de endpoints, consulte o README em `web/README.md`.

---

## Licença e contribuição

Projeto de uso interno. Para contribuir: fork, branch de feature, commits e abertura de Pull Request.

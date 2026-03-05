# -*- mode: python ; coding: utf-8 -*-

import os

# Incluir capabilities.json do escpos (obrigatório quando o app é empacotado)
escpos_datas = []
try:
    import escpos
    escpos_dir = os.path.dirname(escpos.__file__)
    cap_json = os.path.join(escpos_dir, 'capabilities.json')
    if os.path.isfile(cap_json):
        escpos_datas.append((cap_json, 'escpos'))
    # Incluir todos os .json do pacote escpos (perfis de impressora, etc.)
    for f in os.listdir(escpos_dir):
        if f.endswith('.json'):
            escpos_datas.append((os.path.join(escpos_dir, f), 'escpos'))
except Exception:
    pass

# icon.ico na raiz do bundle para o ícone da bandeja do sistema
datas_base = [('templates', 'templates'), ('routes', 'routes'), ('icon.ico', '.')]
datas = datas_base + escpos_datas

a = Analysis(
    ['app.py'],
    pathex=[],
    binaries=[],
    datas=datas,
    hiddenimports=['flask', 'flask_sqlalchemy', 'flask_cors', 'routes', 'escpos', 'escpos.printer', 'escpos.capabilities', 'pystray', 'PIL', 'PIL.Image', 'waitress'],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='app',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=['icon.ico'],
)

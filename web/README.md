# Bem-vindo ao Comandas Canastra

aplicação desktop construída com Next.JS + Tauri. Este projeto é um controle de comandas para visualizar comandas abertar, detalhes do pedido e fechamento de caixa.

---

## 🚀 Tecnologias

- Next.JS (App Routes)
- Typescript
- Tailwindcss
- Axios
- React Query (@tanstack)
- Tauri

---

## 📦 Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/edurodrigues0/app-comandas-canastra.git
cd app-comandas-canastra
npm install
```

Rodando localmente:

```bash
npm run dev
```

---

## 📱 Build para Produção

Utilize primeiramente o next build para verificar:

Na pasta ./src
```bash
npm run build
```

Build concluida sem erro utilize vá ate pasta ./src-tauri e rode:

```bash
npm run tauri bundle
```

O arquivo de instalação estará dentro da pasta ./src-tauri/target/release/bundle

---

## 📁 Estrutura do Projeto

```
├── public/
├── src/                # Pasta src
│   ├── api/            # Funções para chamadas HTTP
│   ├── app/            # Pasta APP do Next.JS(App Routes)
│   │   ├── comandas
│   │   ├── dashboard
│   │   ├── fechamentos
│   │   ├── funcionarios
│   │   ├── login
│   ├── components/
│   │   ├── ui          # Pasta de componentes do shadcnui
│   ├── context/
│   ├── lib/
│   ├── providers/
│   ├── storage/        # Pasta de configurações para Local Storage
├── src-tauri/          # Pasta src do Tauri
├── app/                # Screens e layout principal
```

---

## 🌐 API

A comunicação é feita com uma API rodando localmente:

```

### Endpoints:

#### AUTENTICAÇÂO
| Método | Endpoint                        | Descrição                                  |
|--------|---------------------------------|--------------------------------------------|
| POST   | `/login`                        | Efetua a autenticação na aplicação         |

---

#### CRUD USUÁRIO

| Método | Endpoint                        | Descrição                                  |
|--------|---------------------------------|--------------------------------------------|
| POST   | `/cadastrar_usuario`            | Cadastra usuário dentro da aplicação       |
| GET    | `/listar-usarios`               | Lista todos os usuários cadastrados        |
| GET    | `/buscar_usuario/:userId`       | Busca usuário pelo ID                      |
| PUT    | `/atualizar_usuario/:ID`        | Edita o usuário pelo ID                    |
| DELETE | `/deletar_usuario/:ID`          | Deleta o usuário pelo ID                   |

---

#### IMPRESSORA

| Método | Endpoint                        | Descrição                                  |
|--------|---------------------------------|--------------------------------------------|
| GET    | `/SELECT_IMPRESSORA`            | Lista todas impressoras na rede            |

---

#### DASHBOARD

| Método | Endpoint                        | Descrição                                  |
|--------|---------------------------------|--------------------------------------------|
| GET    | `/desempenho_garcom`            | Retorna o total faturado por garçom        |
| GET    | `/vendas180dias`                | Retorna o total faturado nos 180 dias      |
| GET    | `/vendasmesatual`               | Retorna o total faturado por dia no mês    |
| GET    | `/total_dia`                    | Retorna o total de vendas no dia           |


#### PEDIDOS E FECHAMENTOS

| Método | Endpoint                        | Descrição                                  |
|--------|---------------------------------|--------------------------------------------|
| POST   | `/finalizar_venda`              | Finaliza a venda selecionada               |
| POST   | `/fechamento`                   | Fechamento de caixa                        |
| GET    | `/comanda/:orderId`             | Retorna detalhes do pedido pelo ID         |
| GET    | `/listarcomandas`               | Retorna listagem das comandas abertas      |
| GET    | `/finalizadas`                  | Retorna listagem das comandas fechadas     |
| GET    | `/listar_fechamentos`           | Retorna listagem de fechamento de caixa    |

## 🧪 Testes

Este projeto **ainda não possui testes automatizados**, mas pode ser integrado com:

- [Vitest](https://vitest.dev/)

---

## 💡 Scripts Úteis

```bash
npm run dev           # Inicia o dev server
npm run build         # Executa build do projeto
npm run tauri         # Executa comandos basicos do Tauri
```

---

## 👥 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch com sua feature: `git checkout -b feature/nome-feature`
3. Commit suas mudanças: `git commit -m "feat: Adiciona nova feature"`
4. Push para a branch: `git push origin feature/nome-feature`
5. Abra um Pull Request 🎉

---

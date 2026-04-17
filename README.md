# 🍕 Automação de Cardápio iFood

Este projeto utiliza **Playwright** para automatizar o cadastro de itens no portal iFood Empresas a partir de uma planilha Excel.

## 🚀 Como funciona
A automação utiliza o protocolo **CDP (Chrome DevTools Protocol)** para se conectar a uma instância do Chrome já aberta e autenticada. Isso garante segurança, pois não armazena senhas.

## 🛠️ Tecnologias
- Node.js
- Playwright
- XLSX (Leitura de dados)

## 📋 Pré-requisitos
1. Ter o Node.js instalado.
2. Abrir o Chrome via terminal com o comando:
   `"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222`
3. Realizar o login no iFood e navegar até a tela de cadastro manual.

## 📖 Instruções
1. Clone o repositório.
2. Execute `npm install` para instalar as dependências.
3. Prepare a planilha `Produtos.xlsx`.
4. Execute `node cadastro-ifood.js`.

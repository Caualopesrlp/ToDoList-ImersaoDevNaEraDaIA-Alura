# AGENTS.md — Diretrizes para o Agente de IA

## 👤 Persona e Papel do Agente

Você é um **Desenvolvedor Frontend Sênior** especialista em JavaScript moderno e **Clean Code**.
Sua postura é objetiva, pragmática e focada na experiência do usuário (UX). Você escreve código modular, legível, bem comentado e pronto para manutenção.

---

## 🎯 1. Goal (Objetivo)

Desenvolver uma aplicação web de **To-Do List (Lista de Tarefas)** moderna, responsiva, ágil e intuitiva, permitindo o gerenciamento completo do ciclo de vida das tarefas (CRUD) com persistência local.

---

## 🧠 2. Context (Contexto Técnico)

- **Tipo de Aplicação:** Single Page Application (SPA) modular em Web/Frontend.
- **Público-Alvo:** Usuários organizando tarefas pessoais diárias.
- **Tecnologias Recomendadas:**
  - HTML5 Semântico
  - CSS3 (Variáveis CSS, Flexbox/Grid para responsividade)
  - JavaScript Vanilla ES6+ (Módulos JS ou funções puras e organizadas)
  - Persistência com `localStorage`
- **Estrutura de Pastas Esperada:**

  ```text
  /
  ├── index.html        # Estrutura HTML semântica
  ├── css/
  │   └── styles.css    # Estilos globais e componentes
  ├── js/
  │   ├── app.js        # Ponto de entrada e eventos
  │   ├── storage.js    # Gerenciamento de localStorage
  │   └── render.js     # Manipulação de DOM e interface
  └── AGENTS.md         # Diretrizes do agente
  ```

---

## ⚠️ 3. Constraints (Restrições e Regras de Desenvolvimento)

### Regras de Negócio e UX

- Não permitir o cadastro de tarefas vazias ou apenas com espaços em branco.
- Sanitizar/escapar entradas de texto para evitar vulnerabilidades XSS na renderização do DOM.
- Fornecer feedback visual instantâneo ao adicionar, concluir ou remover tarefas.
- O layout deve ser totalmente adaptável para dispositivos móveis e desktop (Mobile-First).

### Boas Práticas de Código

- Separação clara de responsabilidades: lógica de dados/storage separada do gerenciamento do DOM.
- Utilizar nomes semânticos para funções, variáveis e classes CSS.

### Comportamento do Agente

- Faça alterações incrementais. Nunca reescreva arquivos do zero sem justificativa.
- Não remova comentários do código nem altere a estrutura sem necessidade.
- Ao finalizar cada tarefa, apresente um resumo curto das modificações e sugira os próximos passos.

---

## 📦 4. Deliverables (Entregáveis e Critérios de Aceite)

- [x] **Criar Tarefa:** Input de texto com validação e atalho na tecla `Enter`.
- [x] **Listagem Dinâmica:** Exibição imediata das tarefas na tela.
- [x] **Status (Concluir/Desmarcar):** Marcar tarefa como concluída (com alteração visual, ex: texto tachado e opacidade).
- [x] **Excluir Tarefa:** Botão para remover tarefa individual da lista.
- [x] **Persistência de Dados:** Salvar automaticamente criações, edições e deleções no `localStorage`.
- [x] **Filtros de Visualização:** Abas ou botões para filtrar entre "Todas", "Pendentes" e "Concluídas".
- [x] **Contador de Tarefas:** Exibir a quantidade de tarefas pendentes restantes.
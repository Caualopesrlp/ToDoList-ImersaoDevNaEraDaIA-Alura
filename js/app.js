/**
 * @file app.js
 * @description Ponto de entrada da aplicação. Inicializa eventos, estado e orquestra
 * os módulos storage e render.
 */

import {
  getTasks,
  addTask,
  toggleTask,
  updateTaskText,
  deleteTask,
  clearCompletedTasks,
  getStoredTheme,
  setStoredTheme
} from './storage.js';

import {
  renderTaskList,
  updateStats,
  updateFilterUI,
  animateRemoval,
  startInlineEditing,
  applyTheme
} from './render.js';

// Estado da Aplicação
let activeFilter = 'all';

// Elementos do DOM
const elements = {
  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  taskForm: document.getElementById('task-form'),
  taskInput: document.getElementById('task-input'),
  taskList: document.getElementById('task-list'),
  filterButtons: document.querySelectorAll('.filter-btn'),
  pendingCount: document.getElementById('pending-count'),
  clearCompletedBtn: document.getElementById('clear-completed-btn')
};

/**
 * Atualiza visualmente a lista e estatísticas de acordo com o estado atual.
 */
function refreshUI() {
  const tasks = getTasks();
  renderTaskList(elements.taskList, tasks, activeFilter);
  updateStats(elements.pendingCount, elements.clearCompletedBtn, tasks);
}

/**
 * Inicializa a detecção e controle do tema (Claro / Escuro).
 */
function initTheme() {
  const storedTheme = getStoredTheme();
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');

  applyTheme(initialTheme, elements.themeToggleBtn);

  // Alternador manual
  elements.themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setStoredTheme(newTheme);
    applyTheme(newTheme, elements.themeToggleBtn);
  });

  // Acompanhamento de alterações no sistema operacional se não houver preferência explícita
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!getStoredTheme()) {
      applyTheme(e.matches ? 'dark' : 'light', elements.themeToggleBtn);
    }
  });
}

/**
 * Configura os ouvintes de eventos da aplicação.
 */
function setupEventListeners() {
  // 1. Formulário de inclusão de tarefa
  elements.taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const rawValue = elements.taskInput.value.trim();

    if (!rawValue) {
      elements.taskInput.focus();
      elements.taskInput.classList.add('input-shake');
      setTimeout(() => elements.taskInput.classList.remove('input-shake'), 400);
      return;
    }

    const newTask = addTask(rawValue);
    if (newTask) {
      elements.taskInput.value = '';
      refreshUI();
      elements.taskInput.focus();
    }
  });

  // 2. Delegação de eventos na lista de tarefas (Check, Editar, Excluir)
  elements.taskList.addEventListener('click', (e) => {
    const target = e.target;
    const taskItem = target.closest('.task-item');
    if (!taskItem) return;

    const taskId = taskItem.dataset.id;

    // Toggle Concluir/Pendente via checkbox
    if (target.closest('.task-checkbox-container')) {
      toggleTask(taskId);
      refreshUI();
      return;
    }

    // Excluir Tarefa
    const deleteBtn = target.closest('.btn-delete');
    if (deleteBtn) {
      animateRemoval(taskItem, () => {
        deleteTask(taskId);
        refreshUI();
      });
      return;
    }

    // Editar Tarefa via botão de lápis
    const editBtn = target.closest('.btn-edit');
    if (editBtn) {
      startInlineEditing(taskItem, (newText) => {
        updateTaskText(taskId, newText);
        refreshUI();
      });
    }
  });

  // 3. Edição inline com duplo clique no texto da tarefa
  elements.taskList.addEventListener('dblclick', (e) => {
    const textSpan = e.target.closest('.task-text');
    if (!textSpan) return;

    const taskItem = textSpan.closest('.task-item');
    if (!taskItem) return;

    const taskId = taskItem.dataset.id;
    startInlineEditing(taskItem, (newText) => {
      updateTaskText(taskId, newText);
      refreshUI();
    });
  });

  // 4. Filtros de visualização (Todas, Pendentes, Concluídas)
  elements.filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      updateFilterUI(elements.filterButtons, activeFilter);
      refreshUI();
    });
  });

  // 5. Limpar concluídas
  elements.clearCompletedBtn.addEventListener('click', () => {
    clearCompletedTasks();
    refreshUI();
  });
}

/**
 * Ponto de partida do aplicativo
 */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setupEventListeners();
  refreshUI();
});

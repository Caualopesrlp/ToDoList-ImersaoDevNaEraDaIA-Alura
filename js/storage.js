/**
 * @file storage.js
 * @description Módulo responsável pela persistência, sanitização e gerenciamento
 * dos dados de tarefas e preferências no LocalStorage.
 */

const STORAGE_KEYS = {
  TASKS: 'todo_app_tasks_v1',
  THEME: 'todo_app_theme_v1'
};

/**
 * Sanitiza texto para prevenir injeção de HTML/XSS na renderização.
 * @param {string} text
 * @returns {string} Texto sanitizado
 */
export function sanitizeText(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Gera um identificador único para uma tarefa.
 * @returns {string}
 */
export function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Obtém todas as tarefas salvas no LocalStorage.
 * @returns {Array<{id: string, text: string, completed: boolean, createdAt: number}>}
 */
export function getTasks() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!rawData) return [];
    const parsed = JSON.parse(rawData);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Erro ao ler tarefas do localStorage:', error);
    return [];
  }
}

/**
 * Salva a lista de tarefas no LocalStorage.
 * @param {Array<Object>} tasks
 * @returns {boolean} true se salvo com sucesso
 */
export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error('Erro ao salvar tarefas no localStorage:', error);
    return false;
  }
}

/**
 * Cria e adiciona uma nova tarefa.
 * @param {string} rawText - Texto da tarefa fornecido pelo usuário
 * @returns {Object|null} A nova tarefa criada ou null se texto inválido
 */
export function addTask(rawText) {
  const trimmedText = rawText ? rawText.trim() : '';
  if (!trimmedText) return null;

  const newTask = {
    id: generateId(),
    text: sanitizeText(trimmedText),
    completed: false,
    createdAt: Date.now()
  };

  const tasks = getTasks();
  tasks.unshift(newTask); // Insere no topo da lista
  saveTasks(tasks);

  return newTask;
}

/**
 * Alterna o status de concluído de uma tarefa pelo ID.
 * @param {string} id
 * @returns {Array<Object>} Lista atualizada de tarefas
 */
export function toggleTask(id) {
  const tasks = getTasks().map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });

  saveTasks(tasks);
  return tasks;
}

/**
 * Atualiza o texto de uma tarefa existente.
 * @param {string} id
 * @param {string} newRawText
 * @returns {Object|null} Tarefa atualizada ou null se inválido
 */
export function updateTaskText(id, newRawText) {
  const trimmed = newRawText ? newRawText.trim() : '';
  if (!trimmed) return null;

  const sanitized = sanitizeText(trimmed);
  let updatedTask = null;

  const tasks = getTasks().map(task => {
    if (task.id === id) {
      updatedTask = { ...task, text: sanitized };
      return updatedTask;
    }
    return task;
  });

  if (updatedTask) {
    saveTasks(tasks);
  }

  return updatedTask;
}

/**
 * Remove uma tarefa pelo ID.
 * @param {string} id
 * @returns {Array<Object>} Lista atualizada de tarefas
 */
export function deleteTask(id) {
  const tasks = getTasks().filter(task => task.id !== id);
  saveTasks(tasks);
  return tasks;
}

/**
 * Remove todas as tarefas concluídas.
 * @returns {Array<Object>} Lista atualizada contendo apenas as tarefas pendentes
 */
export function clearCompletedTasks() {
  const tasks = getTasks().filter(task => !task.completed);
  saveTasks(tasks);
  return tasks;
}

/**
 * Obtém a preferência de tema salva ('dark' | 'light' | null).
 * @returns {string|null}
 */
export function getStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEYS.THEME);
  } catch (error) {
    return null;
  }
}

/**
 * Salva a preferência de tema do usuário.
 * @param {'dark'|'light'} theme
 */
export function setStoredTheme(theme) {
  try {
    if (theme) {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } else {
      localStorage.removeItem(STORAGE_KEYS.THEME);
    }
  } catch (error) {
    console.error('Erro ao salvar tema no localStorage:', error);
  }
}

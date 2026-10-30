/**
 * @file render.js
 * @description Módulo responsável pela manipulação do DOM, renderização de templates,
 * animações e estados visuais da interface de usuário.
 */

// Conjunto de ícones SVG otimizados para interface limpa e acessível
const ICONS = {
  check: `
    <svg class="icon icon-check" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="4 11 8 15 16 6"></polyline>
    </svg>`,
  edit: `
    <svg class="icon icon-edit" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"></path>
      <path d="M15.5 2.5a2.121 2.121 0 0 1 3 3L10 14l-4 1 1-4 8.5-8.5z"></path>
    </svg>`,
  trash: `
    <svg class="icon icon-trash" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 17 6"></polyline>
      <path d="M6 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="8" y1="11" x2="8" y2="15"></line>
      <line x1="12" y1="11" x2="12" y2="15"></line>
      <path d="M15 6v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
    </svg>`,
  sun: `
    <svg class="icon icon-theme" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>`,
  moon: `
    <svg class="icon icon-theme" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>`,
  emptyAll: `
    <svg class="empty-icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="14" y="10" width="36" height="46" rx="4"></rect>
      <line x1="22" y1="22" x2="42" y2="22"></line>
      <line x1="22" y1="32" x2="42" y2="32"></line>
      <line x1="22" y1="42" x2="34" y2="42"></line>
      <circle cx="32" cy="10" r="3" fill="currentColor"></circle>
    </svg>`,
  emptyPending: `
    <svg class="empty-icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="32" cy="32" r="22"></circle>
      <path d="M22 32l7 7 14-14"></path>
    </svg>`,
  emptyCompleted: `
    <svg class="empty-icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="32" cy="32" r="22"></circle>
      <line x1="32" y1="20" x2="32" y2="34"></line>
      <circle cx="32" cy="42" r="1.5" fill="currentColor"></circle>
    </svg>`
};

/**
 * Cria o elemento DOM individual para uma tarefa.
 * @param {Object} task
 * @returns {HTMLLIElement}
 */
export function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = `task-item ${task.completed ? 'task-item--completed' : ''}`;
  li.dataset.id = task.id;

  li.innerHTML = `
    <label class="task-checkbox-container" title="${task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}">
      <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} aria-label="Status da tarefa" />
      <span class="custom-checkbox">
        ${ICONS.check}
      </span>
    </label>
    <div class="task-content">
      <span class="task-text" title="Duplo clique para editar">${task.text}</span>
    </div>
    <div class="task-actions">
      <button type="button" class="btn-icon btn-edit" aria-label="Editar tarefa '${task.text}'" title="Editar tarefa">
        ${ICONS.edit}
      </button>
      <button type="button" class="btn-icon btn-delete" aria-label="Excluir tarefa '${task.text}'" title="Excluir tarefa">
        ${ICONS.trash}
      </button>
    </div>
  `;

  return li;
}

/**
 * Renderiza o estado vazio quando a lista filtrada não possui itens.
 * @param {string} filter - 'all' | 'pending' | 'completed'
 * @returns {HTMLDivElement}
 */
function createEmptyStateElement(filter) {
  const wrapper = document.createElement('div');
  wrapper.className = 'empty-state';

  let icon = ICONS.emptyAll;
  let title = 'Nenhuma tarefa encontrada';
  let subtitle = 'Adicione uma nova tarefa acima para começar seu dia!';

  if (filter === 'pending') {
    icon = ICONS.emptyPending;
    title = 'Tudo em dia!';
    subtitle = 'Você não possui nenhuma tarefa pendente no momento.';
  } else if (filter === 'completed') {
    icon = ICONS.emptyCompleted;
    title = 'Nenhuma tarefa concluída';
    subtitle = 'As tarefas que você concluir aparecerão aqui.';
  }

  wrapper.innerHTML = `
    ${icon}
    <p class="empty-title">${title}</p>
    <p class="empty-subtitle">${subtitle}</p>
  `;

  return wrapper;
}

/**
 * Renderiza toda a lista de tarefas aplicando o filtro ativo.
 * @param {HTMLUListElement} listElement
 * @param {Array<Object>} tasks
 * @param {string} activeFilter - 'all' | 'pending' | 'completed'
 */
export function renderTaskList(listElement, tasks, activeFilter = 'all') {
  listElement.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'pending') return !task.completed;
    if (activeFilter === 'completed') return task.completed;
    return true; // 'all'
  });

  if (filteredTasks.length === 0) {
    const emptyState = createEmptyStateElement(activeFilter);
    listElement.appendChild(emptyState);
    return;
  }

  const fragment = document.createDocumentFragment();
  filteredTasks.forEach(task => {
    const taskEl = createTaskElement(task);
    fragment.appendChild(taskEl);
  });

  listElement.appendChild(fragment);
}

/**
 * Atualiza o contador de tarefas pendentes e botão de limpar concluídas.
 * @param {HTMLElement} countElement
 * @param {HTMLButtonElement} clearBtnElement
 * @param {Array<Object>} tasks
 */
export function updateStats(countElement, clearBtnElement, tasks) {
  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  if (countElement) {
    if (pendingCount === 0 && tasks.length > 0) {
      countElement.textContent = '🎉 Todas as tarefas concluídas!';
    } else if (pendingCount === 1) {
      countElement.textContent = '1 tarefa pendente';
    } else {
      countElement.textContent = `${pendingCount} tarefas pendentes`;
    }
  }

  if (clearBtnElement) {
    clearBtnElement.style.display = completedCount > 0 ? 'inline-flex' : 'none';
  }
}

/**
 * Atualiza o estilo visual dos botões de filtro.
 * @param {NodeListOf<HTMLButtonElement>} filterButtons
 * @param {string} activeFilter
 */
export function updateFilterUI(filterButtons, activeFilter) {
  filterButtons.forEach(btn => {
    const filterValue = btn.dataset.filter;
    const isActive = filterValue === activeFilter;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

/**
 * Aplica classe de animação e executa callback ao final da remoção.
 * @param {HTMLElement} element
 * @param {Function} onComplete
 */
export function animateRemoval(element, onComplete) {
  element.classList.add('task-item--removing');
  element.addEventListener('animationend', () => {
    if (typeof onComplete === 'function') {
      onComplete();
    }
  }, { once: true });
}

/**
 * Ativa o modo de edição inline em um item de tarefa.
 * @param {HTMLElement} taskItemEl
 * @param {Function} onSave - Callback chamado com o novo texto
 */
export function startInlineEditing(taskItemEl, onSave) {
  if (!taskItemEl || taskItemEl.classList.contains('task-item--editing')) return;

  const contentContainer = taskItemEl.querySelector('.task-content');
  const textEl = taskItemEl.querySelector('.task-text');
  if (!contentContainer || !textEl) return;

  const originalText = textEl.textContent;
  taskItemEl.classList.add('task-item--editing');

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'task-edit-input';
  input.value = originalText;
  input.setAttribute('aria-label', 'Editar título da tarefa');

  contentContainer.innerHTML = '';
  contentContainer.appendChild(input);
  input.focus();
  input.select();

  let isHandled = false;

  const finishEdit = (saveChanges) => {
    if (isHandled) return;
    isHandled = true;

    taskItemEl.classList.remove('task-item--editing');
    const newText = input.value.trim();

    if (saveChanges && newText && newText !== originalText) {
      onSave(newText);
    } else {
      contentContainer.innerHTML = `<span class="task-text" title="Duplo clique para editar">${originalText}</span>`;
    }
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      finishEdit(true);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      finishEdit(false);
    }
  });

  input.addEventListener('blur', () => {
    finishEdit(true);
  });
}

/**
 * Aplica o tema na interface e atualiza o ícone do botão alternador.
 * @param {string} theme - 'dark' | 'light'
 * @param {HTMLButtonElement} toggleBtn
 */
export function applyTheme(theme, toggleBtn) {
  document.documentElement.setAttribute('data-theme', theme);

  if (toggleBtn) {
    toggleBtn.innerHTML = theme === 'dark' ? ICONS.sun : ICONS.moon;
    const label = theme === 'dark' ? 'Alternar para tema claro' : 'Alternar para tema escuro';
    toggleBtn.setAttribute('aria-label', label);
    toggleBtn.setAttribute('title', label);
  }
}

import { createTodo, getTodos, removeTodo, toggleTodo } from "./api/todoApi.js";

const state = {
  todos: [],
  loading: true,
  submitting: false,
  error: "",
};

const elements = {
  form: document.querySelector("#todo-form"),
  input: document.querySelector("#todo-input"),
  addButton: document.querySelector("#add-button"),
  error: document.querySelector("#error-message"),
  loading: document.querySelector("#loading-box"),
  empty: document.querySelector("#empty-message"),
  list: document.querySelector("#todo-list"),
  completedCount: document.querySelector("#completed-count"),
  totalCount: document.querySelector("#total-count"),
};

function setError(message = "") {
  state.error = message;

  if (message) {
    elements.error.textContent = message;
    elements.error.classList.remove("hidden");
  } else {
    elements.error.textContent = "";
    elements.error.classList.add("hidden");
  }
}

function setDisabled(disabled) {
  state.submitting = disabled;
  elements.input.disabled = disabled;
  elements.addButton.disabled = disabled;

  const buttons = elements.list.querySelectorAll("button");
  buttons.forEach((button) => {
    button.disabled = disabled;
  });
}

function updateStatus() {
  const completedCount = state.todos.filter((todo) => todo.completed).length;
  elements.completedCount.textContent = String(completedCount);
  elements.totalCount.textContent = String(state.todos.length);
}

function createTodoItem(todo) {
  const item = document.createElement("li");
  item.className = "todo-item";

  const toggleButton = document.createElement("button");
  toggleButton.className = todo.completed ? "check-button checked" : "check-button";
  toggleButton.type = "button";
  toggleButton.setAttribute("aria-label", todo.completed ? "완료 취소" : "완료 처리");
  toggleButton.textContent = todo.completed ? "✓" : "";
  toggleButton.addEventListener("click", async () => {
    try {
      setDisabled(true);
      setError("");
      const updatedTodo = await toggleTodo(todo);
      state.todos = state.todos.map((item) =>
        item.id === updatedTodo.id ? updatedTodo : item
      );
      render();
    } catch (error) {
      setError(error.message || "항목 상태를 변경하지 못했습니다.");
    } finally {
      setDisabled(false);
    }
  });

  const text = document.createElement("span");
  text.className = todo.completed ? "todo-text completed" : "todo-text";
  text.textContent = todo.text;

  const deleteButton = document.createElement("button");
  deleteButton.className = "danger-button";
  deleteButton.type = "button";
  deleteButton.textContent = "delete";
  deleteButton.addEventListener("click", async () => {
    try {
      setDisabled(true);
      setError("");
      await removeTodo(todo.id);
      state.todos = state.todos.filter((item) => item.id !== todo.id);
      render();
    } catch (error) {
      setError(error.message || "항목을 삭제하지 못했습니다.");
    } finally {
      setDisabled(false);
    }
  });

  item.append(toggleButton, text, deleteButton);
  return item;
}

function render() {
  updateStatus();

  if (state.loading) {
    elements.loading.classList.remove("hidden");
    elements.empty.classList.add("hidden");
    elements.list.classList.add("hidden");
    return;
  }

  elements.loading.classList.add("hidden");
  elements.list.innerHTML = "";

  if (state.todos.length === 0) {
    elements.empty.classList.remove("hidden");
    elements.list.classList.add("hidden");
    return;
  }

  elements.empty.classList.add("hidden");
  elements.list.classList.remove("hidden");

  state.todos.forEach((todo) => {
    elements.list.appendChild(createTodoItem(todo));
  });

  if (state.submitting) {
    setDisabled(true);
  }
}

async function loadTodos() {
  try {
    state.loading = true;
    setError("");
    render();

    const todos = await getTodos();
    state.todos = todos;
  } catch (error) {
    setError(error.message || "목록을 불러오지 못했습니다.");
  } finally {
    state.loading = false;
    render();
  }
}

elements.form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const text = elements.input.value.trim();
  if (!text) return;

  try {
    setDisabled(true);
    setError("");
    const newTodo = await createTodo(text);
    state.todos = [...state.todos, newTodo];
    elements.input.value = "";
    render();
  } catch (error) {
    setError(error.message || "항목을 추가하지 못했습니다.");
  } finally {
    setDisabled(false);
  }
});

loadTodos();

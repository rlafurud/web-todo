const BASE_URL = "https://69b93706e69653ffe6a6ef7d.mockapi.io/todos";

function mapTodo(item) {
  return {
    id: String(item.id),
    text: item.title ?? item.content ?? item.text ?? "",
    completed: Boolean(item.completed ?? item.isDone ?? false),
    createdAt: item.createdAt ?? null,
  };
}

async function request(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`요청 실패: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function getTodos() {
  const data = await request(BASE_URL);
  return Array.isArray(data) ? data.map(mapTodo) : [];
}

export async function createTodo(text) {
  const body = {
    title: text,
    completed: false,
  };

  const data = await request(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return mapTodo(data);
}

export async function toggleTodo(todo) {
  const data = await request(`${BASE_URL}/${todo.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: todo.text,
      completed: !todo.completed,
    }),
  });

  return mapTodo(data);
}

export async function removeTodo(id) {
  await request(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  return id;
}

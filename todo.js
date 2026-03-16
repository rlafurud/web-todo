// 1. 데이터 관리 (State)
let todos = [];

// 2. DOM 요소 선택
const $form = document.querySelector('#todo-form');
const $input = document.querySelector('#todo-input');
const $list = document.querySelector('#todo-list');

// 3. 단일 책임 원칙에 따른 함수 분리

// 기능: 새로운 Todo 객체 생성
const createTodo = (text) => ({
    id: Date.now(),
    text,
    completed: false
});

// 기능: 데이터 변경 (Add, Toggle, Delete)
const addTodo = (text) => {
    todos = [...todos, createTodo(text)];
    render();
};

const toggleTodo = (id) => {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    render();
};

const deleteTodo = (id) => {
    todos = todos.filter(todo => todo.id !== id);
    render();
};

// 기능: 화면 렌더링 (DOM API 활용)
const render = () => {
    $list.innerHTML = ''; // 리스트 초기화
    
    todos.forEach(todo => {
        const $li = document.createElement('li');
        $li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        $li.dataset.id = todo.id; // 데이터 ID 저장

        $li.innerHTML = `
            <span class="todo-text">${todo.text}</span>
            <button class="delete-btn">삭제</button>
        `;
        $list.appendChild($li);
    });
};

// 4. 이벤트 등록 (가장 효과적인 '이벤트 위임' 방식 선택)

// 폼 제출 이벤트
$form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = $input.value.trim();
    if (text) {
        addTodo(text);
        $input.value = '';
        $input.focus();
    }
});

// 리스트 클릭 이벤트 (이벤트 위임)
$list.addEventListener('click', (e) => {
    const id = Number(e.target.closest('.todo-item').dataset.id);
    
    // 삭제 버튼 클릭 시
    if (e.target.classList.contains('delete-btn')) {
        deleteTodo(id);
    } 
    // 그 외 영역 클릭 시 (토글)
    else {
        toggleTodo(id);
    }
});
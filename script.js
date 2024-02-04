window.addEventListener('load', () => {
	todos = JSON.parse(localStorage.getItem('todos')) || [];
	const nameInput = document.querySelector('#name');
	const newTodoForm = document.querySelector('#new-todo-form');

	const username = localStorage.getItem('username') || '';

	nameInput.value = username;

	nameInput.addEventListener('change', (e) => {
		localStorage.setItem('username', e.target.value);
	})

	newTodoForm.addEventListener('submit', e => {
		e.preventDefault();

		const todo = {
			content: e.target.elements.content.value,
			category: e.target.elements.category.value,
			done: false,
			createdAt: new Date().getTime(),
            dueDate: e.target.elements.dueDate.value
		}

		todos.push(todo);

		localStorage.setItem('todos', JSON.stringify(todos));
        e.target.reset()
        DisplayTodos();

    });
		DisplayTodos()
	
});
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}
function DisplayTodos () {
	const todoList = document.querySelector('#todo-list');
	todoList.innerHTML = "";

	todos.forEach(todo => {
		const todoItem = document.createElement('div');
		todoItem.classList.add('todo-item');

        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = todo.done;

        const span = document.createElement('span');
        span.classList.add('bubble');
        span.classList.add(todo.category === 'personal' ? 'personal' : 'business');

        const content = document.createElement('div');
        content.classList.add('todo-content');

        content.innerHTML = `<input type="text" value="${todo.content}" readonly>
                             <div class="due-date">Due: ${formatDate(todo.dueDate)}</div>`;

        const actions = document.createElement('div');
        actions.classList.add('actions');

        const edit = document.createElement('button');
        edit.classList.add('edit');
        edit.textContent = 'Edit';

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete');
        deleteButton.textContent = 'Delete';

        label.appendChild(input);
        label.appendChild(span);
        actions.appendChild(edit);
        actions.appendChild(deleteButton);
        todoItem.appendChild(label);
        todoItem.appendChild(content);
        todoItem.appendChild(actions);

        const isOverdue = new Date(todo.dueDate) < new Date() && !todo.done;
        if (isOverdue) {
            todoItem.classList.add('overdue');
        }

        todoList.appendChild(todoItem);

        input.addEventListener('change', (e) => {
            todo.done = e.target.checked;
            if(todo.done) {
                todoItem.classList.add('done');
    } else {
        todoItem.classList.remove('done');
            }
            localStorage.setItem('todos', JSON.stringify(todos));
            DisplayTodos();
        });

        edit.addEventListener('click', () => {
            const input = content.querySelector('input');
            input.removeAttribute('readonly');
            input.focus();
            input.addEventListener('blur', (e) => {
                input.setAttribute('readonly', true);
                todo.content = e.target.value;
                localStorage.setItem('todos', JSON.stringify(todos));
                DisplayTodos();
            });
        });

        deleteButton.addEventListener('click', () => {
            todos = todos.filter(t => t !== todo);
            localStorage.setItem('todos', JSON.stringify(todos));
            DisplayTodos();
        });
    });
}

$('#formcarrinho').submit(function(event) {
    event.preventDefault();
 
    const { id, todo, state } = this.elements;
    
    if(todo && !id.value) { 
        const todoSaved = save(todo.value);
        render(todoSaved.id, todoSaved.text, todoSaved.state);
    } else {
        update(id.value, todo.value, state.checked);
        loadItems();
    }

    event.target.reset();
})

function getAllTodos() {
    let todos = [];
    const todosStr = localStorage.getItem('carrinho');
    if(todosStr) todos = JSON.parse(todosStr);
    return todos;
}

function getById(id) {
    const list = getAllTodos();
    const todo = list.find((item) => item.id == id);
    if(todo) return todo;
}

function save(text, state = false) {
    const todo = {
        id: 1,
        text, state
    };

    const list = getAllTodos();
    if(list.length) todo.id = list[list.length - 1].id + 1;

    list.push(todo);
    localStorage.setItem('carrinho', JSON.stringify(list));
    return todo;
}

function deleteItem(id) {
    let list = getAllTodos();
    list = list.filter(todo => todo.id != id);
    localStorage.setItem('carrinho', JSON.stringify(list));
}

function update(id, text, state) {
    const list = getAllTodos();
    const index = list.findIndex((todo) => todo.id == id);

    if(index != -1) {
        list[index] = {id, text, state};
    }

    localStorage.setItem('carrinho', JSON.stringify(list));
} 

function btnDeleteAction(event) {
    deleteItem(event.target.value);
    loadItems();
}

function todoChecked(event) {
    event.target.checked;
}

// RENDER FUNCTIONS

function render(id, text, state = false) {
    $('.itens-carrinho').append(`
    <br>
        <label class="itens-carrinho-item" data-id="${id}">
            ${text}
             ———— <button value="${id}" class="btn btn-sm btn-danger">Excluir</button>
        </label>
        <br>
        <br>
        <label for="quant">Quantidade:</label>
        <input type="number" id="quant" name="quantidade" min="1" max="9">
        <br>
        <br>
        —————————————————————————————————————————————————————————————————————————————————————————————————————————
    `);
}

function loadItems() {
    $('.itens-carrinho').empty();

    getAllTodos().forEach((todo) => {
        render(todo.id, todo.text, todo.state);

        $('.btn.btn-danger').click(btnDeleteAction);
    });
} 

function buscar(){
    var texto = document.getElementById('texto').vaule;
    var lista = document.getElementById('historico').vaule;
    var adicionar = true

    var opt = document.createElement('option').vaule;

    for(i=0; i < lista.options.length;i++){

    }
}

window.onload = loadItems;
function Selectors() {
    const expenseContainer = document.querySelector(".expense-container");
    let budgetText = document.querySelector("#budget");
    const categorySelect = document.querySelector("#byPrice");
    const addExpBtn = document.querySelector("#addExpBtn")
}
const expenseArr = JSON.parse(localStorage.getItem("expense")) || [];

function createTask(expense) {
    const card = document.createElement("div");
    card.className = `card ${expense.isDone ? "done" : "unDone" }`
    card.dataset.id = expense.id;

    card.innerHTML = `
    <div class="left-content flex">
                    <h4>${expense.name}</h4>
                    <input class="expense-name-input" hidden />
                    <p>${expense.category}</p>
                    <input class="expense-category-input" hidden />
                </div>
                <div class="right-text-area flex">
                    <p>- ${expense.amount}</p>
                    <p>${expense.date}</p>
                </div>
                <div>
                <button data-action="toggle">${expense.isDone ? "Undo" : "Done"}</button>
                <button data-action="edit">Edit</button>
                <button data-action="save" hidden>Save</button>
                <button data-action="cancel" hidden>Cancel</button>
                <button data-action="delete">Delete</button>
                </div>
                `

    return card;
}

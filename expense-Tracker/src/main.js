const expenseContainer = document.querySelector(".expense-container");
let budgetText = document.querySelector("#budget");
const categorySelect = document.querySelector("#byPrice");
const addExpBtn = document.querySelector("#addExpBtn")
const expenseNameInput = document.querySelector("#expName");
const expenseAmountInput = document.querySelector("#expAmount");
const expenseCategoryInput = document.querySelector("#expcategory");
const expenseDateInput = document.querySelector("#expDate");
const inputBox = document.querySelector(".input-box");
const overlay = document.getElementById('overlay');


const expenseArr = JSON.parse(localStorage.getItem("expenses")) || [];
const isEditing = null;

function createExpenseNode(expense) {
    const card = document.createElement("div");
    card.className = `card ${expense.isDone ? "done" : "unDone"}`
    card.dataset.id = expense.id;

    card.innerHTML = `
    <div class="left-content flex">
                    <h4 class="expense-name" >${expense.name}</h4>
                    <p class="expense-catg" >${expense.category}</p>
                </div>
                <div class="right-text-area flex">
                    <p class="expense-amount" >- $${expense.amount}</p>
                    <p class="expense-date" >${expense.date}</p>
                </div>
                <div class="btnArea flex" >
                <button data-action="toggle">${expense.isDone ? "Undo" : "Done"}</button>
                <button data-action="edit">Edit</button>
                <button data-action="delete">Delete</button>
                </div>
                `

    return card;
}
function initialRender() {
    const fragment = document.createDocumentFragment();

    expenseArr.forEach(exp => {
        fragment.appendChild(createExpenseNode(exp));
    });

    expenseContainer.appendChild(fragment)
}
function saveToStorage() {
    localStorage.setItem("expenses", JSON.stringify(expenseArr));
}
function addExpense() {
    const expName = expenseNameInput.value;
    const expCatg = expenseCategoryInput.value;
    const expAmount = expenseAmountInput.value;
    const expDate = expenseDateInput.value;

    if (!expAmount || !expName || !expCatg || !expDate) return;

    const expense = {
        name: expName,
        date: expDate,
        category: expCatg,
        amount: expAmount,
        isDone: false,
        id: Date.now()
    }

    expenseArr.push(expense);
    saveToStorage();

    expenseContainer.appendChild(createExpenseNode(expense));

    expenseAmountInput.value = "";
    expenseNameInput.value = "";
    expenseDateInput.value = "";
    expenseCategoryInput.selectIndex = 0;

}
function openMessageBox(expCard, expCardId) {
    
    overlay.classList.add('open');

    enterEditingMode(expCard, expCardId);
}
function enterEditingMode(expCard, expCardId) {
    if (isEditing !== null) return;

    const expName = expCard.querySelector(".expense-name")
    const nameInp = document.querySelector(".expense-name-input");
    const expCatg = expCard.querySelector(".expense-catg");
    const catgInput = document.querySelector(".expense-category-input");
    const expAmount = expCard.querySelector(".expense-amount");
    const amountInput = document.querySelector(".amount-input");
    const expDate = expCard.querySelector(".expense-date");
    const dateInput = document.querySelector(".date-input");

    nameInp.value = expName.textContent;
    catgInput.value = expCatg.textContent;
    amountInput.value = expAmount.textContent;
    dateInput.value = expDate.textContent;
    

}
function closeEditingMode() {
    overlay.classList.remove("open")
}

expenseContainer.addEventListener("click", (e) => {
    const action = e.target.dataset.action;
    if (!action) return;

    const expCard = e.target.closest(".card");
    if (!expCard) return;

    const expCardId = expCard.dataset.id;

    if (action === "edit") openMessageBox(expCard, expCardId)
})

inputBox.addEventListener("click", (e) => {
    const action = e.target.dataset.action;
    if(!action) return;

    if(action === "save") return;
    if(action === "cancel") closeEditingMode();
});

addExpBtn.addEventListener("click", addExpense);
initialRender();


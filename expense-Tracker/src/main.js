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
const errorEl = document.querySelector("#errorEl");

const nameRegex = /^[A-Za-z][A-Za-z\s]{1,29}$/;
const amountRegex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;

const expenseArr = JSON.parse(localStorage.getItem("expenses")) || [];
let isEditing = null;

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
    const expName = expenseNameInput.value.trim();
    const expCatg = expenseCategoryInput.value.trim();
    const expAmount = Number(expenseAmountInput.value.trim());
    const expDate = expenseDateInput.value;

    if (!expCatg || !expDate) return;

    if(!inputValidation(expName, expAmount)) return false;

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
function inputValidation(expName, expAmount) {
    console.log(typeof(expAmount))
    console.log(expAmount)
    if(!nameRegex.test(expName) ){
        errorEl.textContent =
        "Enter a valide Input (under 30 chars)"
        return false;
    }
    if(!amountRegex.test(expAmount) || expAmount <= 0 || Number.isNaN(expAmount)){
        errorEl.textContent =
        "Invalid amount (max 2 decimals)";
        return false
    }
    return true;
}
function manageAction(expCard, expCardId) {
    enterEditingMode(expCard, expCardId);

    inputBox.addEventListener("click", (e) => {
        const action = e.target.dataset.action;
        if (!action) return;

        if (action === "save") saveExp(expCard, expCardId);
        if (action === "cancel") closeEditingMode();
    });
}
function enterEditingMode(expCard, expCardId) {

    overlay.classList.add('open');

    if (isEditing !== null) return;

    isEditing = expCardId;

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

function saveExp(expCard, expCardId) {
    const expName = expCard.querySelector(".expense-name")
    const nameInp = document.querySelector(".expense-name-input");
    const expCatg = expCard.querySelector(".expense-catg");
    const catgInput = document.querySelector(".expense-category-input");
    const expAmount = expCard.querySelector(".expense-amount");
    const amountInput = document.querySelector(".amount-input");
    const expDate = expCard.querySelector(".expense-date");
    const dateInput = document.querySelector(".date-input");

    expName.textContent = nameInp.value
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

    if (action === "edit") manageAction(expCard, expCardId)
})

addExpBtn.addEventListener("click", addExpense);
initialRender();


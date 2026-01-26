const expenseContainer = document.querySelector(".expense-container");
let budgetText = document.querySelector("#budget");
const categorySelect = document.querySelector("#byPrice");
const addExpBtn = document.querySelector("#addExpBtn")
const expenseNameInput = document.querySelector("#expName");
const expenseAmountInput = document.querySelector("#expAmount");
const expenseCategoryInput = document.querySelector("#expcategory");
const expenseDateInput = document.querySelector("#expDate");


const expenseArr = JSON.parse(localStorage.getItem("expenses")) || [];

function createExpenseNode(expense) {
    const card = document.createElement("div");
    card.className = `card ${expense.isDone ? "done" : "unDone"}`
    card.dataset.id = expense.id;

    card.innerHTML = `
    <div class="left-content flex">
                    <h4>${expense.name}</h4>
                    <input class="expense-name-input" hidden />
                    <p>${expense.category}</p>
                    <input class="expense-category-input" hidden />
                </div>
                <div class="right-text-area flex">
                    <p>- $${expense.amount}</p>
                    <p>${expense.date}</p>
                </div>
                <div class="btnArea flex" >
                <button data-action="toggle">${expense.isDone ? "Undo" : "Done"}</button>
                <button data-action="edit">Edit</button>
                <button data-action="save" hidden>Save</button>
                <button data-action="cancel" hidden>Cancel</button>
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

    if(!expAmount || !expName || !expCatg || !expDate) return;

    const expense = {
        name : expName,
        date : expDate,
        category : expCatg,
        amount : expAmount,
        isDone : false,
        id : Date.now()
    }

    expenseArr.push(expense);
    saveToStorage();

    expenseContainer.appendChild(createExpenseNode(expense));

    expenseAmountInput.value = "";
    expenseNameInput.value = "";
    expenseDateInput.value ="";
    expenseCategoryInput.selectIndex = 0;

}
addExpBtn.addEventListener("click",addExpense);
initialRender();
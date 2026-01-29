// -------- DOM -------- //
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
const searchBar = document.querySelector("#seachBar");
const dateFilter = document.querySelector("#dateFilter");
const categoryFilter = document.querySelector("#byCatg");
const priceFilter = document.querySelector("#price-range");

// -------- Regex -------- //
const nameRegex = /^[A-Za-z][A-Za-z\s]{1,29}$/;
const amountRegex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;

let expenseArr = JSON.parse(localStorage.getItem("expenses")) || [];
let isEditing = null;

// -------- Create Node -------- //
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
                   <p> -$<span class="expense-amount" >${expense.amount}</span></p>
                    <p class="expense-date" >${expense.date}</p>
                </div>
                <div class="btnArea flex" >
                <button data-action="edit">Edit</button>
                <button data-action="delete">Delete</button>
                </div>
                `

    return card;
}
// -------- Initial render -------- //
function initialRender(expArr = expenseArr) {
    if(!expArr) return;

    expenseContainer.innerHTML = "";
    const fragment = document.createDocumentFragment();

    expArr.forEach(exp => {
        fragment.appendChild(createExpenseNode(exp));
    });

    expenseContainer.appendChild(fragment)
}
// -------- save to localStorage -------- //
function saveToStorage() {
    localStorage.setItem("expenses", JSON.stringify(expenseArr));
}
// -------- add Expense -------- //
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
// -------- check Input -------- //
function inputValidation(expName, expAmount) {
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
// -------- Enter Editing mode --------- //
function enterEditingMode(expCard, expCardId) {

    if (isEditing !== null) return;

    overlay.classList.add('open');
    isEditing = expCardId;

    const expName = expCard.querySelector(".expense-name");
    const expCatg = expCard.querySelector(".expense-catg");
    const expAmount = expCard.querySelector(".expense-amount");
    const expDate = expCard.querySelector(".expense-date");

    document.querySelector(".expense-name-input").value = expName.textContent;
    document.querySelector(".expense-category-input").value = expCatg.textContent;
    document.querySelector(".amount-input").value = expAmount.textContent;
    document.querySelector(".date-input").value = expDate.textContent;

}
// -------- Save expense -------- //
function saveExp(expCardId) {

    const nameInp = document.querySelector(".expense-name-input").value.trim();
    const catgInput = document.querySelector(".expense-category-input").value.trim();
    const amountInput = Number(document.querySelector(".amount-input").value.trim());
    const dateInput = document.querySelector(".date-input").value;

    if(!catgInput || !dateInput || !nameInp || !amountInput) return;

    if(!inputValidation(nameInp, amountInput)) return;
    
    const expCard = expenseArr.find((exp)=>{
        return exp.id === expCardId;
    });

    if(!expCard) return;
    
    expCard.name = nameInp;
    expCard.category = catgInput;
    expCard.amount = amountInput;
    expCard.date = dateInput;

    saveToStorage()
    closeEditingMode();
    initialRender();
}
// -------- Close editing mode -------- //
function closeEditingMode() {
    isEditing = null;
    overlay.classList.remove("open");
}
// -------- Delete expense -------- //
function deleteExp(expCard, expCardId) {
    expenseArr = expenseArr.filter((exp)=>{
         return exp.id !== expCardId;
    });

    saveToStorage();
    expCard.remove()
}
// -------- Apply filter -------- //
function applyFilter() {
    let result = [...expenseArr];

    const expCatg = expenseCategoryInput.value.trim().toLowerCase();
    const priceInput = priceFilter.value;
    const priceVal = parseFloat(priceInput);
    const dateVal = dateFilter.value;
    const searchVal = searchBar.value.trim().toLowerCase();

    if (expCatg !== "all") {
        result = result.filter(
            exp => exp.category.toLowerCase() === expCatg
        )
    }

    if (priceInput !== "" && !Number.isNaN(priceVal)) {
        result = result.filter(exp => exp.amount <= priceVal);
    }

    if (dateVal !== "") {
        result = result.filter(exp => exp.date === dateVal);
    }

    if (searchVal !== "") {
        result = result.filter(exp =>
            exp.name.toLowerCase().includes(searchVal)
        );
    }

    return result;
}
// --------- apply and render -------- //
function applyAndRender(){
    initialRender(applyFilter());
}

// -------- Event Handlers -------- //
expenseContainer.addEventListener("click", (e) => {
    const action = e.target.dataset.action;
    if (!action) return;

    const expCard = e.target.closest(".card");
    if (!expCard) return;

    const expCardId = Number(expCard.dataset.id);

    if (action === "edit") enterEditingMode(expCard, expCardId);
    if(action === "delete") deleteExp( expCard, expCardId);
})
inputBox.addEventListener("click", (e) => {
    const action = e.target.dataset.action;
    if (!action) return;

    if (action === "save" && isEditing !== null) {
        saveExp(isEditing);
    }

    if (action === "cancel") {
        closeEditingMode();
    }
});

addExpBtn.addEventListener("click", addExpense);
searchBar.addEventListener("input",applyAndRender);
dateFilter.addEventListener("change",applyAndRender);
categoryFilter.addEventListener("change",applyAndRender);
priceFilter.addEventListener("change",applyAndRender);

// -------- Initial rendering -------- //
initialRender();

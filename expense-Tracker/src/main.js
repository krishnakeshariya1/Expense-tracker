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
function initialRender() {
    expenseContainer.innerHTML = "";
    const fragment = document.createDocumentFragment();

    expenseArr.forEach(exp => {
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
// -------- Manage Action -------- //
function manageAction(expCard, expCardId) {
    enterEditingMode(expCard, expCardId);

    inputBox.addEventListener("click", (e) => {
        const action = e.target.dataset.action;
        if (!action) return;

        if (action === "save") saveExp(expCard, expCardId);
        if (action === "cancel") closeEditingMode();
    });
}
// -------- Enter Editing mode --------- //
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
// -------- Save expense -------- //
function saveExp(expCard, expCardId) {

    const nameInp = document.querySelector(".expense-name-input").value.trim();
    const catgInput = document.querySelector(".expense-category-input").value.trim();
    const amountInput = Number(document.querySelector(".amount-input").value.trim());
    const dateInput = document.querySelector(".date-input").value;

    if(!catgInput || !dateInput || !nameInp || !amountInput) return;

    if(!inputValidation(nameInp, amountInput)) return;

    console.log(expCardId, typeof(expCardId))
    const expense = expenseArr.find((expense)=>{
        return expense.id === expCardId
    });

    if(!expense) return;
    
    expense.name = nameInp;
    expense.category = catgInput;
    expense.amount = amountInput;
    expense.date = dateInput;

    saveToStorage()
    closeEditingMode();
    initialRender();
}
// -------- Close editing mode -------- //
function closeEditingMode() {
    overlay.classList.remove("open")
}
// -------- Delete expense -------- //
function deleteExp(expCard, expCardId) {
    expenseArr = expenseArr.filter((exp)=>{
         return exp.id !== expCardId;
    });

    saveToStorage();
    expCard.remove()
}
function applyFilter() {
    let result = [ ...expenseArr];

    const catgVal = categoryFilter.value.toLowerCase();
    const priceVal = parseFloat(priceFilter.value);
    const dateVal = dateFilter.value;
    const searchVal = searchBar.value.trim().toLowerCase()
    
    if(catgVal !== "all"){
        result = result.filter((exp)=>{
           return exp.category === catgVal;
        })
    }
    if(priceVal !== 0){
        result = result.filter((exp)=>{
            return exp.amount < priceVal;
        })
    }
    console.log(dateVal)
    
}
function applyAndRender(){
    initialRender(applyFilter);
}

// -------- Event Handlers -------- //
expenseContainer.addEventListener("click", (e) => {
    const action = e.target.dataset.action;
    if (!action) return;

    const expCard = e.target.closest(".card");
    if (!expCard) return;

    const expCardId = Number(expCard.dataset.id);

    if (action === "edit") manageAction(expCard, expCardId);
    if(action === "delete") deleteExp( expCard, expCardId);
})

addExpBtn.addEventListener("click", addExpense);
searchBar.addEventListener("input",applyFilter );
dateFilter.addEventListener("change",applyFilter);
categoryFilter.addEventListener("change",applyFilter);
priceFilter.addEventListener("change",applyFilter);

// -------- Initial rendering -------- //
initialRender();


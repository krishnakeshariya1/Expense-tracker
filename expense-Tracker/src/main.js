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

// -------- constant -------- //
const TOTAL_BUDGET = 500;

// -------- STATE -------- //
const state = {
    expenseArr: JSON.parse(localStorage.getItem("expenses")) || [],
    isEditing: null,
    filters: {
        category: "all",
        price: 100,
        date: "",
        search: "",
    }
};

// -------- get Total spent -------- //
function getTotalSpent() {
    return state.expenseArr.reduce((sum, exp) => sum + exp.amount, 0);
}
// -------- Get Remaining Budget -------- //
function getRemainingBudget() {
    return TOTAL_BUDGET - getTotalSpent()
}
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
    budgetText.textContent = getRemainingBudget();

    expenseContainer.innerHTML = "";
    const fragment = document.createDocumentFragment();

    applyFilter().forEach(exp => {
        fragment.appendChild(createExpenseNode(exp));
    });

    expenseContainer.appendChild(fragment);
}
// -------- save to localStorage -------- //
function saveToStorage() {
    localStorage.setItem("expenses", JSON.stringify(state.expenseArr));
}
// -------- add Expense -------- //
function addExpense() {
    const expName = expenseNameInput.value.trim();
    const expCatg = expenseCategoryInput.value.trim();
    const expAmount = Number(expenseAmountInput.value.trim());
    const expDate = expenseDateInput.value;

    if (!expCatg || !expDate) return;

    if (!inputValidation(expName, expAmount)) return false;

    if (expAmount > getRemainingBudget()) return false;

    state.expenseArr.push({
        name: expName,
        date: expDate,
        category: expCatg,
        amount: expAmount,
        id: Date.now()
    });

    saveToStorage();
    initialRender();

    expenseAmountInput.value = "";
    expenseNameInput.value = "";
    expenseDateInput.value = "";
    expenseCategoryInput.selectedIndex = 0;
}
// -------- check Input -------- //
function inputValidation(expName, expAmount) {
    if (!nameRegex.test(expName)) {
        errorEl.textContent =
            "Enter a valide Input (under 30 chars)"
        return false;
    }
    if (!amountRegex.test(expAmount) || expAmount <= 0 || Number.isNaN(expAmount)) {
        errorEl.textContent =
            "Invalid amount (max 2 decimals)";
        return false
    }
    errorEl.textContent = "";
    return true;
}
// -------- Enter Editing mode --------- //
function enterEditingMode(expCardId) {
    const exp = state.expenseArr.find(exp => exp.id === expCardId);

    if (!exp) return;

    state.isEditing = expCardId;
    overlay.classList.add('open');

    document.querySelector(".expense-name-input").value = exp.name;
    document.querySelector(".expense-category-input").value = exp.category;
    document.querySelector(".amount-input").value = exp.amount;
    document.querySelector(".date-input").value = exp.date;
}
// -------- Save expense -------- //
function saveExp() {
    const exp = state.expenseArr.find(exp => exp.id === state.isEditing);
    if (!exp) return
    const name = document.querySelector(".expense-name-input").value.trim();
    const catg = document.querySelector(".expense-category-input").value.trim();
    const amount = Number(document.querySelector(".amount-input").value.trim());
    const date = document.querySelector(".date-input").value;

    if (!inputValidation(name, amount)) return;

    exp.name = name;
    exp.category = catg;
    exp.amount = amount;
    exp.date = date;

    saveToStorage()
    closeEditingMode();
    initialRender()
}
// -------- Close editing mode -------- //
function closeEditingMode() {
    state.isEditing = null;
    overlay.classList.remove("open");
}
// -------- Delete expense -------- //
function deleteExp(expCardId) {
    state.expenseArr = state.expenseArr.filter(exp => exp.id !== expCardId);
    saveToStorage();
    initialRender()
}
// -------- Apply filter -------- //
function applyFilter() {
    return state.expenseArr.filter(exp => {
        if (state.filters.category !== "all" && state.filters.category !== exp.category) return false;
        if (exp.amount > state.filters.price) return false;
        if (state.filters.date && exp.date !== state.filters.date) return false;
        if (state.filters.search && !exp.name.toLowerCase().includes(state.filters.search)) return false;
        return true;
    });
}
// -------- Event Handlers -------- //
expenseContainer.addEventListener("click", (e) => {
    const action = e.target.dataset.action;
    if (!action) return;

    const expCard = e.target.closest(".card");
    if (!expCard) return;

    const expCardId = Number(expCard.dataset.id);

    if (action === "edit") enterEditingMode(expCardId);
    if (action === "delete") deleteExp(expCardId);
})

inputBox.addEventListener("click", (e) => {
    const action = e.target.dataset.action;
    if (!action) return;

    if (action === "save" && state.isEditing !== null) {
        saveExp();
    }

    if (action === "cancel") {
        closeEditingMode();
    }
});

addExpBtn.addEventListener("click", addExpense);
searchBar.addEventListener("input", e => {
    state.filters.search = e.target.value.toLowerCase();
    initialRender()
});

dateFilter.addEventListener("change", e => {
    state.filters.date = e.target.value;
    initialRender();
});
categoryFilter.addEventListener("change", e => {
    state.filters.category = e.target.value;
    initialRender()
});
priceFilter.addEventListener("change", e => {
    state.filters.price = Number(e.target.value);
    initialRender()
});

// -------- Initial rendering -------- //
initialRender();

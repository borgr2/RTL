let expenses = [];
let headCount = { starting: 0, casualties: 0 };
let orders = [];
let editOrderIndex = null;

function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
  if (tabId === 'view') renderTables();
}

// Expense
const expensesForm = document.getElementById('expensesForm');
expensesForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const product = document.getElementById('productName').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const price = parseFloat(document.getElementById('price').value);
  expenses.push({ product, amount, price });
  expensesForm.reset();
  renderTables();
});

function deleteExpense(index) {
  expenses.splice(index, 1);
  renderTables();
}

function editExpense(index) {
  const e = expenses[index];
  document.getElementById('productName').value = e.product;
  document.getElementById('amount').value = e.amount;
  document.getElementById('price').value = e.price;
  expenses.splice(index, 1);
  showTab('expenses');
}

// Head Count
const headCountForm = document.getElementById('headCountForm');
headCountForm.addEventListener('submit', function(e) {
  e.preventDefault();
  headCount.starting = parseInt(document.getElementById('starting').value);
  headCount.casualties = parseInt(document.getElementById('casualties').value);
  renderTables();
});

function editHeadCount() {
  document.getElementById('starting').value = headCount.starting;
  document.getElementById('casualties').value = headCount.casualties;
  showTab('expenses');
}

// Orders
const ordersForm = document.getElementById('ordersForm');
ordersForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('customerName').value;
  const location = document.getElementById('location').value;
  const amount = parseInt(document.getElementById('orderAmount').value);
  const pricePerHead = parseFloat(document.getElementById('pricePerHead').value);
  const payment = parseFloat(document.getElementById('payment').value);
  if (editOrderIndex !== null) {
    orders[editOrderIndex] = { name, location, amount, pricePerHead, payment };
    editOrderIndex = null;
    document.getElementById('editOrder').style.display = 'none';
  } else {
    orders.push({ name, location, amount, pricePerHead, payment });
  }
  ordersForm.reset();
  renderTables();
});

function editOrder(index) {
  const order = orders[index];
  document.getElementById('customerName').value = order.name;
  document.getElementById('location').value = order.location;
  document.getElementById('orderAmount').value = order.amount;
  document.getElementById('pricePerHead').value = order.pricePerHead;
  document.getElementById('payment').value = order.payment;
  editOrderIndex = index;
  document.getElementById('editOrder').style.display = 'block';
  showTab('orders');
}

function cancelEditOrder() {
  editOrderIndex = null;
  document.getElementById('editOrder').style.display = 'none';
  ordersForm.reset();
}

function deleteOrder(index) {
  orders.splice(index, 1);
  renderTables();
}

function renderTables() {
  // Expenses Table
  const expensesBody = document.querySelector('#expensesTable tbody');
  const expensesFoot = document.querySelector('#expensesTable tfoot');
  expensesBody.innerHTML = '';
  let total = 0;
  expenses.forEach((exp, i) => {
    const t = exp.amount * exp.price;
    total += t;
    expensesBody.innerHTML += `
      <tr>
        <td>${exp.product}</td>
        <td>${exp.amount}</td>
        <td>${exp.price}</td>
        <td>${t.toFixed(2)}</td>
        <td><button onclick="editExpense(${i})">Edit</button><button onclick="deleteExpense(${i})">Delete</button></td>
      </tr>
    `;
  });
  expensesFoot.innerHTML = `<tr><td colspan="3"><strong>Total:</strong></td><td colspan="2">${total.toFixed(2)}</td></tr>`;

  // Head Count and Orders Summary
  const totalOrders = orders.reduce((sum, o) => sum + o.amount, 0);
  const remaining = headCount.starting - headCount.casualties - totalOrders;
  document.getElementById('viewStarting').textContent = headCount.starting;
  document.getElementById('viewCasualties').textContent = headCount.casualties;
  document.getElementById('viewOrders').textContent = totalOrders;
  document.getElementById('viewRemaining').textContent = remaining;

  // Orders Table
  const ordersBody = document.querySelector('#ordersTable tbody');
  ordersBody.innerHTML = '';
  orders.forEach((order, i) => {
    const total = order.amount * order.pricePerHead;
    const balance = total - order.payment;
    const status = balance <= 0 ? 'Fully Paid' : balance.toFixed(2);
    ordersBody.innerHTML += `
      <tr>
        <td>${order.name}</td>
        <td>${order.location}</td>
        <td>${order.amount}</td>
        <td>${order.pricePerHead}</td>
        <td>${order.payment}</td>
        <td>${status}</td>
        <td><button onclick="editOrder(${i})">Edit</button><button onclick="deleteOrder(${i})">Delete</button></td>
      </tr>
    `;
  });
}

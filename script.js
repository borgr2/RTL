function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
  updateTables();
}

let expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
let headCount = JSON.parse(localStorage.getItem('headCount') || '{}');
let orders = JSON.parse(localStorage.getItem('orders') || '[]');

function addExpense() {
  const product = document.getElementById('expenseProduct').value;
  const amount = parseFloat(document.getElementById('expenseAmount').value);
  const price = parseFloat(document.getElementById('expensePrice').value);
  expenses.push({ product, amount, price });
  localStorage.setItem('expenses', JSON.stringify(expenses));
  updateTables();
}

function saveHeadCount() {
  headCount.start = parseInt(document.getElementById('startCount').value);
  headCount.casualties = parseInt(document.getElementById('casualties').value);
  localStorage.setItem('headCount', JSON.stringify(headCount));
  updateTables();
}

function addCustomerOrder() {
  const name = document.getElementById('custName').value;
  const location = document.getElementById('custLocation').value;
  const orderAmount = parseInt(document.getElementById('orderAmount').value);
  const pricePerHead = parseFloat(document.getElementById('pricePerHead').value);
  const payment = parseFloat(document.getElementById('payment').value);
  orders.push({ name, location, orderAmount, pricePerHead, payment });
  localStorage.setItem('orders', JSON.stringify(orders));
  updateTables();
}

function updateTables() {
  const expensesTable = document.getElementById('expensesTable');
  expensesTable.innerHTML = '<tr><th>Product</th><th>Amount</th><th>Price</th></tr>';
  let total = 0;
  expenses.forEach(e => {
    total += e.price;
    expensesTable.innerHTML += `<tr><td>${e.product}</td><td>${e.amount}</td><td>${e.price}</td></tr>`;
  });
  document.getElementById('totalExpense').innerText = `Total: ${total}`;

  const remaining = headCount.start - headCount.casualties - orders.reduce((sum, o) => sum + o.orderAmount, 0);
  document.getElementById('headCountSummary').innerText =
    `Starting: ${headCount.start || 0}, Casualties: ${headCount.casualties || 0}, Remaining: ${remaining}`;

  const ordersTable = document.getElementById('ordersTable');
  ordersTable.innerHTML = '<tr><th>Name</th><th>Location</th><th>Order</th><th>Price</th><th>Payment</th><th>Status</th></tr>';
  orders.forEach(o => {
    const total = o.orderAmount * o.pricePerHead;
    const status = o.payment >= total ? "Fully Paid" : `Balance: ${total - o.payment}`;
    ordersTable.innerHTML += `<tr><td>${o.name}</td><td>${o.location}</td><td>${o.orderAmount}</td><td>${o.pricePerHead}</td><td>${o.payment}</td><td>${status}</td></tr>`;
  });
}

showTab('inventoryTab');


function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
  updateTables();
}

let expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
let headCount = JSON.parse(localStorage.getItem('headCount') || '{}');
let orders = JSON.parse(localStorage.getItem('orders') || '[]');

// Bind form submissions
window.onload = () => {
  document.getElementById('expensesForm').addEventListener('submit', function (e) {
    e.preventDefault();
    addExpense();
    this.reset();
  });
  document.getElementById('ordersForm').addEventListener('submit', function (e) {
    e.preventDefault();
    addCustomerOrder();
    this.reset();
  });
  showTab('expenses');
};

function addExpense() {
  const product = document.getElementById('productName').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const price = parseFloat(document.getElementById('price').value);
  const start = parseInt(document.getElementById('starting').value);
  const casualties = parseInt(document.getElementById('casualties').value);

  expenses.push({ product, amount, price, start, casualties });
  headCount = { start, casualties };

  localStorage.setItem('expenses', JSON.stringify(expenses));
  localStorage.setItem('headCount', JSON.stringify(headCount));

  updateTables();
}

function addCustomerOrder() {
  const name = document.getElementById('customerName').value;
  const location = document.getElementById('location').value;
  const orderAmount = parseInt(document.getElementById('orderAmount').value);
  const pricePerHead = parseFloat(document.getElementById('pricePerHead').value);
  const payment = parseFloat(document.getElementById('payment').value);
  orders.push({ name, location, orderAmount, pricePerHead, payment });
  localStorage.setItem('orders', JSON.stringify(orders));
  updateTables();
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  updateTables();
}

function editExpense(index) {
  const e = expenses[index];
  document.getElementById('productName').value = e.product;
  document.getElementById('amount').value = e.amount;
  document.getElementById('price').value = e.price;
  document.getElementById('starting').value = e.start;
  document.getElementById('casualties').value = e.casualties;
  deleteExpense(index);
  showTab('expenses');
}

function updateTables() {
  const tbody = document.querySelector('#expensesTable tbody');
  tbody.innerHTML = '';
  let total = 0;

  expenses.forEach((e, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${e.product}</td>
      <td>${e.amount}</td>
      <td>${e.price}</td>
      <td>${(e.amount * e.price).toFixed(2)}</td>
      <td>
        <button onclick="editExpense(${index})">Edit</button>
        <button onclick="deleteExpense(${index})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
    total += e.amount * e.price;
  });

  const tfoot = document.querySelector('#expensesTable tfoot');
  tfoot.innerHTML = `<tr><td colspan="5"><strong>Total: ${total.toFixed(2)}</strong></td></tr>`;
}

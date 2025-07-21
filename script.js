
function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
  updateTables();
}

let expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
let headCount = JSON.parse(localStorage.getItem('headCount') || '{}');
let orders = JSON.parse(localStorage.getItem('orders') || '[]');

window.onload = () => {
  document.getElementById('expensesForm').addEventListener('submit', function (e) {
    e.preventDefault();
    addExpense();
    this.reset();
  });

  document.getElementById('headCountForm').addEventListener('submit', function (e) {
    e.preventDefault();
    saveHeadCount();
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
  expenses.push({ product, amount, price });
  localStorage.setItem('expenses', JSON.stringify(expenses));
  updateTables();
}

function saveHeadCount() {
  headCount.start = parseInt(document.getElementById('starting').value);
  headCount.casualties = parseInt(document.getElementById('casualties').value);
  localStorage.setItem('headCount', JSON.stringify(headCount));
  updateTables();
}

function addCustomerOrder() {
  const name = document.getElementById('customerName').value;
  const location = document.getElementById('location').value;
  const orderAmount = parseInt(document.getElementById('orderAmount').value);
  const pricePerHead = parseFloat(document.getElementById('pricePerHead').value);
  const payment = parseFloat(document.getElementById('payment').value);
  orders.push({ name, location, orderAmount, pricePerHead, payment }); updateTables();
  localStorage.setItem('orders', JSON.stringify(orders));
  updateTables();
}

// Expenses
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
  deleteExpense(index);
  showTab('expenses');
}

// Orders
function deleteOrder(index) {
  orders.splice(index, 1);
  localStorage.setItem('orders', JSON.stringify(orders));
  updateTables();
}

function editOrder(index) {
  const o = orders[index];
  document.getElementById('customerName').value = o.name;
  document.getElementById('location').value = o.location;
  document.getElementById('orderAmount').value = o.orderAmount;
  document.getElementById('pricePerHead').value = o.pricePerHead;
  document.getElementById('payment').value = o.payment;
  deleteOrder(index);
  showTab('orders');
}

function updateTables() {
  // Expenses table
  const expenseBody = document.querySelector('#expensesTable tbody');
  expenseBody.innerHTML = '';
  let total = 0;
  expenses.forEach((e, index) => {
    total += e.amount * e.price;
    expenseBody.innerHTML += `
      <tr>
        <td>${e.product}</td>
        <td>${e.amount}</td>
        <td>${e.price}</td>
        <td>${(e.amount * e.price).toFixed(2)}</td>
        <td>
          <button onclick="editExpense(${index})">Edit</button>
          <button onclick="deleteExpense(${index})">Delete</button>
        </td>
      </tr>`;
  });
  document.querySelector('#expensesTable tfoot').innerHTML = `<tr><td colspan="5"><strong>Total: ${total.toFixed(2)}</strong></td></tr>`;

  // Headcount table
  const headTable = document.querySelector('#headCountTable tbody');
  headTable.innerHTML = '';
  if (headCount.start !== undefined && headCount.casualties !== undefined) {
    headTable.innerHTML = `
      <tr>
        <td>${headCount.start}</td>
        <td>${headCount.casualties}</td>
      </tr>`;
  }

  // Orders table
  const orderBody = document.querySelector('#ordersTable tbody');
  orderBody.innerHTML = '';
  orders.forEach((o, index) => {
    orderBody.innerHTML += `
      <tr>
        <td>${o.name}</td>
        <td>${o.location}</td>
        <td>${o.orderAmount}</td>
        <td>${o.pricePerHead}</td>
        <td>${o.payment}</td>
        <td>
          <button onclick="editOrder(${index})">Edit</button>
          <button onclick="deleteOrder(${index})">Delete</button>
        </td>
      </tr>`;
  });
}

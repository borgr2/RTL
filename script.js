let expenses = [];
let headCount = { starting: 0, casualties: 0 };
let orders = [];
let editingOrderIndex = -1;

function showTab(id) {
  document.querySelectorAll('.tab').forEach(tab => tab.style.display = 'none');
  document.getElementById(id).style.display = 'block';
  if (id === 'view') updateTables();
}

document.getElementById('expensesForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const product = document.getElementById('productName').value;
  const amount = +document.getElementById('amount').value;
  const price = +document.getElementById('price').value;
  expenses.push({ product, amount, price });
  this.reset();
  updateTables();
});

document.getElementById('headCountForm').addEventListener('submit', function(e) {
  e.preventDefault();
  headCount.starting = +document.getElementById('starting').value;
  headCount.casualties = +document.getElementById('casualties').value;
  this.reset();
  updateTables();
});

document.getElementById('ordersForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('customerName').value;
  const location = document.getElementById('location').value;
  const amount = +document.getElementById('orderAmount').value;
  const pricePerHead = +document.getElementById('pricePerHead').value;
  const payment = +document.getElementById('payment').value;
  const order = { name, location, amount, pricePerHead, payment };

  if (editingOrderIndex > -1) {
    orders[editingOrderIndex] = order;
    editingOrderIndex = -1;
    document.getElementById('editOrder').style.display = 'none';
  } else {
    orders.push(order);
  }

  this.reset();
  updateTables();
});

function updateTables() {
  // Expenses Table
  const expTbody = document.querySelector('#expensesTable tbody');
  expTbody.innerHTML = '';
  let totalExpenses = 0;
  expenses.forEach((e, i) => {
    const row = expTbody.insertRow();
    row.innerHTML = `
      <td>${e.product}</td>
      <td>${e.amount}</td>
      <td>${e.price}</td>
      <td>${(e.amount * e.price).toFixed(2)}</td>
      <td>
        <button onclick="editExpense(${i})">Edit</button>
        <button onclick="deleteExpense(${i})">Delete</button>
      </td>
    `;
    totalExpenses += e.amount * e.price;
  });

  let tfoot = document.querySelector('#expensesTable tfoot');
  tfoot.innerHTML = `<tr><td colspan="5"><strong>Total: ${totalExpenses.toFixed(2)}</strong></td></tr>`;

  // Head Count Summary
  const totalOrders = orders.reduce((sum, o) => sum + o.amount, 0);
  const remaining = headCount.starting - headCount.casualties - totalOrders;

  document.getElementById('viewStarting').textContent = headCount.starting;
  document.getElementById('viewCasualties').textContent = headCount.casualties;
  document.getElementById('viewOrders').textContent = totalOrders;
  document.getElementById('viewRemaining').textContent = remaining;

  // Orders Table
  const orderTbody = document.querySelector('#ordersTable tbody');
  orderTbody.innerHTML = '';
  orders.forEach((o, i) => {
    const balance = (o.amount * o.pricePerHead) - o.payment;
    const status = balance <= 0 ? "Fully Paid" : balance.toFixed(2);
    const row = orderTbody.insertRow();
    row.innerHTML = `
      <td>${o.name}</td>
      <td>${o.location}</td>
      <td>${o.amount}</td>
      <td>${o.pricePerHead}</td>
      <td>${o.payment}</td>
      <td>${status}</td>
      <td>
        <button onclick="editOrder(${i})">Edit</button>
        <button onclick="deleteOrder(${i})">Delete</button>
      </td>
    `;
  });
}

function editExpense(i) {
  const e = expenses[i];
  document.getElementById('productName').value = e.product;
  document.getElementById('amount').value = e.amount;
  document.getElementById('price').value = e.price;
  expenses.splice(i, 1);
  showTab('expenses');
}

function deleteExpense(i) {
  expenses.splice(i, 1);
  updateTables();
}

function editHeadCount() {
  document.getElementById('starting').value = headCount.starting;
  document.getElementById('casualties').value = headCount.casualties;
  showTab('expenses');
}

function editOrder(i) {
  const o = orders[i];
  document.getElementById('customerName').value = o.name;
  document.getElementById('location').value = o.location;
  document.getElementById('orderAmount').value = o.amount;
  document.getElementById('pricePerHead').value = o.pricePerHead;
  document.getElementById('payment').value = o.payment;
  editingOrderIndex = i;
  document.getElementById('editOrder').style.display = 'block';
  showTab('orders');
}

function cancelEditOrder() {
  editingOrderIndex = -1;
  document.getElementById('editOrder').style.display = 'none';
  document.getElementById('ordersForm').reset();
}

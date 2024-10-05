// URL API của server Node.js
const API_URL = "http://localhost:3000";

// Gọi API để lấy danh sách tài khoản tín dụng cùng số nợ
document.getElementById('fetchCreditDebt').addEventListener('click', async () => {
  const response = await fetch(`${API_URL}/accounts/credit-debt`);
  const data = await response.json();
  
  const creditDebtList = document.getElementById('creditDebtList');
  creditDebtList.innerHTML = ''; // Xóa danh sách cũ
  
  data.forEach(account => {
    const li = document.createElement('li');
    li.textContent = `Khách hàng: ${account.customer_name}, Số nợ: ${account.debt}`;
    creditDebtList.appendChild(li);
  });
});

// Gọi API để lấy danh sách 10 khách hàng có số tiền gửi nhiều nhất
document.getElementById('fetchTopCustomers').addEventListener('click', async () => {
  const response = await fetch(`${API_URL}/customers/top-depositors`);
  const data = await response.json();

  const topCustomersList = document.getElementById('topCustomersList');
  topCustomersList.innerHTML = ''; // Xóa danh sách cũ

  data.forEach(customer => {
    const li = document.createElement('li');
    li.textContent = `Khách hàng: ${customer.customer_name}, Tổng số tiền gửi: ${customer.total_balance}`;
    topCustomersList.appendChild(li);
  });
});

// Gọi API để thực hiện thanh toán tài khoản tín dụng
document.getElementById('paymentForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const debitAccountId = document.getElementById('debitAccountId').value;
  const creditAccountId = document.getElementById('creditAccountId').value;
  const amount = document.getElementById('amount').value;

  const response = await fetch(`${API_URL}/accounts/pay-credit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      debit_account_id: parseInt(debitAccountId),
      credit_account_id: parseInt(creditAccountId),
      amount: parseInt(amount)
    })
  });

  const result = await response.json();
  const paymentResult = document.getElementById('paymentResult');

  if (response.ok) {
    paymentResult.textContent = result.message;
    paymentResult.style.color = "green";
  } else {
    paymentResult.textContent = result.message;
    paymentResult.style.color = "red";
  }
});

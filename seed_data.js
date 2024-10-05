// Sử dụng CSDL bank_management
// use bank_management;

// Tạo collection Employee
db.createCollection("Employee");
db.createCollection("Customer");
db.createCollection("Account");
db.createCollection("Transaction");
db.createCollection("CreditPayment");

// Chèn dữ liệu mẫu vào Employee
db.Employee.insertMany([
    { employee_id: 1, id_number: "111222333", name: "Nguyen Van A", dob: "1985-01-01", address: "Ha Noi", job_level: 3, seniority: 10, position: "Business" },
    { employee_id: 2, id_number: "222333444", name: "Tran Thi B", dob: "1990-02-15", address: "Da Nang", job_level: 2, seniority: 5, position: "Business" },
    { employee_id: 3, id_number: "333444555", name: "Pham Van C", dob: "1995-07-10", address: "HCM", job_level: 1, seniority: 3, position: "Teller" },
    { employee_id: 4, id_number: "444555666", name: "Le Thi D", dob: "1988-03-21", address: "Hai Phong", job_level: 4, seniority: 12, position: "Business" },
    { employee_id: 5, id_number: "555666777", name: "Bui Van E", dob: "1982-09-12", address: "Hue", job_level: 5, seniority: 15, position: "Manager" },
    { employee_id: 6, id_number: "666777888", name: "Tran Van F", dob: "1994-11-10", address: "Vinh", job_level: 1, seniority: 2, position: "Teller" },
    { employee_id: 7, id_number: "777888999", name: "Nguyen Thi G", dob: "1980-12-24", address: "Bac Ninh", job_level: 4, seniority: 10, position: "Business" },
    { employee_id: 8, id_number: "888999111", name: "Do Van H", dob: "1993-06-18", address: "Can Tho", job_level: 3, seniority: 4, position: "Business" },
    { employee_id: 9, id_number: "999111222", name: "Ngo Thi I", dob: "1987-01-05", address: "Da Nang", job_level: 2, seniority: 8, position: "Business" },
    { employee_id: 10, id_number: "111333555", name: "Nguyen Van J", dob: "1992-04-17", address: "Ha Noi", job_level: 3, seniority: 7, position: "Business" }
  ]);
  

// Chèn dữ liệu mẫu vào Customer
db.Customer.insertMany([
    { customer_id: 1, id_number: "111111111", name: "Nguyen Thanh Son", dob: "1990-01-01", address: "Ha Noi" },
    { customer_id: 2, id_number: "222222222", name: "Le Thi Kim Hoa", dob: "1985-05-12", address: "Da Nang" },
    { customer_id: 3, id_number: "333333333", name: "Tran Van Thanh", dob: "1992-11-11", address: "HCM" },
    { customer_id: 4, id_number: "444444444", name: "Pham Thi Lan", dob: "1995-04-04", address: "Hue" },
    { customer_id: 5, id_number: "555555555", name: "Vu Quoc Huy", dob: "1988-08-08", address: "Hai Phong" },
    { customer_id: 6, id_number: "666666666", name: "Tran Van Cuong", dob: "1991-03-03", address: "Ha Noi" },
    { customer_id: 7, id_number: "777777777", name: "Ngo Van Phu", dob: "1989-09-09", address: "Hai Duong" },
    { customer_id: 8, id_number: "888888888", name: "Le Thi Bich", dob: "1990-02-02", address: "Can Tho" },
    { customer_id: 9, id_number: "999999999", name: "Nguyen Quang Minh", dob: "1994-12-12", address: "Ha Noi" },
    { customer_id: 10, id_number: "101010101", name: "Nguyen Van Tai", dob: "1993-05-05", address: "Bac Ninh" }
  ]);
  

// Chèn dữ liệu mẫu vào Account
db.Account.insertMany([
    { 
        account_id: 1, 
        account_type: "Credit", 
        balance: 2000000, 
        customer_id: 1, 
        created_by: 1, 
        credit_limit: 10000000,
        created_at: new Date("2024-02-10")
    },
    { 
        account_id: 2, 
        account_type: "Debit", 
        balance: 10000000, 
        customer_id: 1, 
        created_by: 2, 
        interest_rate: 0.03, 
        min_balance: 500000,
        created_at: new Date("2024-02-15")
    },
    { 
        account_id: 3, 
        account_type: "Credit", 
        balance: 500000, 
        customer_id: 2, 
        created_by: 3, 
        credit_limit: 8000000,
        created_at: new Date("2024-03-01")
    },
    { 
        account_id: 4, 
        account_type: "Debit", 
        balance: 7000000, 
        customer_id: 2, 
        created_by: 4, 
        interest_rate: 0.04, 
        min_balance: 1000000,
        created_at: new Date("2024-02-25")
    },
    { 
        account_id: 5, 
        account_type: "Credit", 
        balance: 3000000, 
        customer_id: 3, 
        created_by: 5, 
        credit_limit: 15000000,
        created_at: new Date("2024-02-05")
    },
    { 
        account_id: 6, 
        account_type: "Debit", 
        balance: 9000000, 
        customer_id: 3, 
        created_by: 6, 
        interest_rate: 0.02, 
        min_balance: 2000000,
        created_at: new Date("2024-01-30")
    },
    { 
        account_id: 7, 
        account_type: "Credit", 
        balance: 1000000, 
        customer_id: 4, 
        created_by: 7, 
        credit_limit: 5000000,
        created_at: new Date("2024-03-03")
    },
    { 
        account_id: 8, 
        account_type: "Debit", 
        balance: 6000000, 
        customer_id: 4, 
        created_by: 8, 
        interest_rate: 0.01, 
        min_balance: 500000,
        created_at: new Date("2024-03-10")
    },
    { 
        account_id: 9, 
        account_type: "Credit", 
        balance: 2000000, 
        customer_id: 5, 
        created_by: 9, 
        credit_limit: 10000000,
        created_at: new Date("2024-02-12")
    },
    { 
        account_id: 10, 
        account_type: "Debit", 
        balance: 4000000, 
        customer_id: 5, 
        created_by: 10, 
        interest_rate: 0.03, 
        min_balance: 500000,
        created_at: new Date("2024-02-20")
    }
]);

  
// Chèn dữ liệu mẫu vào Transaction
db.Transaction.insertMany([
    { transaction_id: 1, account_id: 1, amount: 1000000, transaction_date: Date("2024-01-10"), transaction_type: "Deposit", processed_by: 1 },
    { transaction_id: 2, account_id: 3, amount: 500000, transaction_date:  Date("2024-02-15"), transaction_type: "Payment", processed_by: 3 },
    { transaction_id: 3, account_id: 5, amount: 1000000, transaction_date: Date("2024-03-05"), transaction_type: "Withdraw", processed_by: 5 },
    { transaction_id: 4, account_id: 7, amount: 2000000, transaction_date: Date("2024-04-12"), transaction_type: "Deposit", processed_by: 7 },
    { transaction_id: 5, account_id: 9, amount: 500000, transaction_date: Date("2024-05-10"), transaction_type: "Payment", processed_by: 9 },
    { transaction_id: 6, account_id: 2, amount: 3000000, transaction_date: Date("2024-01-20"), transaction_type: "Withdraw", processed_by: 2 },
    { transaction_id: 7, account_id: 4, amount: 4000000, transaction_date: Date("2024-02-10"), transaction_type: "Deposit", processed_by: 4 },
    { transaction_id: 8, account_id: 6, amount: 1500000, transaction_date: Date("2024-03-15"), transaction_type: "Withdraw", processed_by: 6 },
    { transaction_id: 9, account_id: 8, amount: 2000000, transaction_date: Date("2024-04-05"), transaction_type: "Deposit", processed_by: 8 },
    { transaction_id: 10, account_id: 10, amount: 1000000, transaction_date: Date("2024-05-20"), transaction_type: "Withdraw", processed_by: 10 }
  ]);
  

// Chèn dữ liệu mẫu vào CreditPayment
db.CreditPayment.insertMany([
    { payment_id: 1, credit_account_id: 1, debit_account_id: 2, payment_amount: 500000, payment_date: Date("2024-01-15") },
    { payment_id: 2, credit_account_id: 3, debit_account_id: 4, payment_amount: 300000, payment_date: Date("2024-02-05") },
    { payment_id: 3, credit_account_id: 5, debit_account_id: 6, payment_amount: 200000, payment_date: Date("2024-03-12") },
    { payment_id: 4, credit_account_id: 7, debit_account_id: 8, payment_amount: 1000000, payment_date: Date("2024-04-10") },
    { payment_id: 5, credit_account_id: 9, debit_account_id: 10, payment_amount: 600000, payment_date: Date("2024-05-08") },
    { payment_id: 6, credit_account_id: 1, debit_account_id: 2, payment_amount: 700000, payment_date: Date("2024-02-10") },
    { payment_id: 7, credit_account_id: 3, debit_account_id: 4, payment_amount: 1000000, payment_date: Date("2024-03-20") },
    { payment_id: 8, credit_account_id: 5, debit_account_id: 6, payment_amount: 800000, payment_date: Date("2024-04-15") },
    { payment_id: 9, credit_account_id: 7, debit_account_id: 8, payment_amount: 500000, payment_date: Date("2024-05-05") },
    { payment_id: 10, credit_account_id: 9, debit_account_id: 10, payment_amount: 300000, payment_date: Date("2024-05-18") }
  ]);
  

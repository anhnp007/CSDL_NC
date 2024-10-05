const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

let db;

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db('bank_management');
    console.log("Kết nối thành công tới MongoDB!");

    app.listen(port, () => {
      console.log(`Server đang chạy tại http://localhost:${port}`);
    });
  } catch (err) {
    console.error(err);
  }
}

connectToDatabase();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Chào mừng đến với hệ thống quản lý ngân hàng!');
});

// Lấy danh sách tất cả nhân viên
app.get('/employees', async (req, res) => {
  try {
    const employees = await db.collection('Employee').find({}).toArray();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err });
  }
});

// Thêm nhân viên mới
app.post('/employees', async (req, res) => {
  try {
    const newEmployee = req.body;
    const result = await db.collection('Employee').insertOne(newEmployee);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi thêm nhân viên', error: err });
  }
});

// Lấy danh sách tất cả khách hàng
app.get('/customers', async (req, res) => {
  try {
    const customers = await db.collection('Customer').find({}).toArray();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err });
  }
});

// Thêm khách hàng mới
app.post('/customers', async (req, res) => {
  try {
    const newCustomer = req.body;
    const result = await db.collection('Customer').insertOne(newCustomer);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi thêm khách hàng', error: err });
  }
});

// Lấy danh sách tất cả tài khoản
app.get('/accounts', async (req, res) => {
  try {
    const accounts = await db.collection('Account').find({}).toArray();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err });
  }
});

// Thêm tài khoản mới
app.post('/accounts', async (req, res) => {
  try {
    const newAccount = req.body;
    const result = await db.collection('Account').insertOne(newAccount);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi thêm tài khoản', error: err });
  }
});


// Liệt kê các tài khoản tín dụng và số nợ tồn đọng
app.get('/accounts/credit/debt', async (req, res) => {
  try {
    const creditDebtData = await db.collection('Account').aggregate([
      { $match: { account_type: "Credit" } },
      { $project: { account_id: 1, balance: 1, credit_limit: 1, debt: { $subtract: ["$credit_limit", "$balance"] } } },
      { $sort: { debt: -1 } }
    ]).toArray();

    res.json(creditDebtData);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err });
  }
});

// Liệt kê 10 khách hàng có số tiền gửi nhiều nhất
app.get('/customers/top-depositors', async (req, res) => {
  try {
    const topCustomers = await db.collection('Account').aggregate([
      { $match: { account_type: "Debit" } },
      { $group: { _id: "$customer_id", total_balance: { $sum: "$balance" } } },
      { $lookup: {
          from: "Customer",
          localField: "_id",
          foreignField: "customer_id",
          as: "customer_info"
      }},
      { $unwind: "$customer_info" },
      { $sort: { total_balance: -1 } },
      { $limit: 10 }
    ]).toArray();

    res.json(topCustomers);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err });
  }
});


// Tính lương nhân viên kinh doanh dựa trên số tài khoản đã tạo trong tháng
app.get('/employees/salary/:month/:year', async (req, res) => {
    const { month, year } = req.params;
    const startDate = new Date(year, month - 1, 1);  // Ngày đầu tiên của tháng
    const endDate = new Date(year, month, 0);        // Ngày cuối cùng của tháng
  
    try {
      const salaryData = await db.collection('Account').aggregate([
        {
          $match: {
            created_at: { $gte: startDate, $lt: endDate }  // Lọc theo thời gian tạo tài khoản
          }
        },
        {
          $group: {
            _id: "$created_by",  // Gom nhóm theo nhân viên tạo tài khoản
            credit_bonus: { $sum: { $cond: [{ $eq: ["$account_type", "Credit"] }, 500000, 0] } },  // Cộng 500k cho mỗi tài khoản tín dụng
            debit_bonus: { $sum: { $cond: [{ $eq: ["$account_type", "Debit"] }, { $multiply: ["$balance", 0.02] }, 0] } }  // Cộng 2% cho số tiền gửi đầu tiên
          }
        },
        {
          $lookup: {
            from: "Employee",               // Nối với bảng Employee để lấy thông tin nhân viên
            localField: "_id",               // Liên kết bằng employee_id
            foreignField: "employee_id",     // Khóa liên kết trong bảng Employee
            as: "employee_info"
          }
        },
        { $unwind: "$employee_info" },  // Giải nén mảng employee_info để lấy chi tiết nhân viên
        {
          $project: {
            name: "$employee_info.name",     // Lấy tên nhân viên
            total_salary: { $add: ["$credit_bonus", "$debit_bonus"] }  // Tổng lương
          }
        }
      ]).toArray();
  
      res.json(salaryData);
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err });
    }
  });

// Liet ke cac giao dich tien gui cua khach hang
app.get('/customers/credit-transactions', async (req, res) => {
const { startDate, endDate } = req.query;
const start = new Date(startDate);
const end = new Date(endDate);

try {
    const creditTransactions = await db.collection('Transaction').aggregate([
    {
        $lookup: {
        from: 'Account',  // Kết nối với bảng Account
        localField: 'account_id',  // Liên kết qua account_id
        foreignField: 'account_id',  // account_id trong bảng Account
        as: 'account_info'
        }
    },
    { $unwind: "$account_info" },  // Giải nén mảng account_info
    { $match: { "account_info.account_type": "Credit" } },  // Lọc chỉ các tài khoản tín dụng
    { 
        $match: {
        transaction_date: { $gte: start, $lte: end }  // Lọc các giao dịch trong khoảng thời gian
        }
    },
    {
        $lookup: {
        from: 'Customer',  // Kết nối với bảng Customer
        localField: 'account_info.customer_id',  // Liên kết qua customer_id
        foreignField: 'customer_id',  // customer_id trong bảng Customer
        as: 'customer_info'
        }
    },
    { $unwind: "$customer_info" },  // Giải nén mảng customer_info
    {
        $group: {
        _id: { customer_name: "$customer_info.name", account_id: "$account_id" },  // Gom nhóm theo tên khách hàng và tài khoản
        total_amount: { $sum: "$amount" }  // Tính tổng số tiền giao dịch cho mỗi tài khoản
        }
    },
    {
        $project: {
        _id: 0,
        customer_name: "$_id.customer_name",  // Hiển thị tên khách hàng
        account_id: "$_id.account_id",  // Hiển thị mã tài khoản
        total_amount: 1  // Hiển thị tổng số tiền giao dịch
        }
    }
    ]).toArray();

    res.json(creditTransactions);
} catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err });
}
});

//Liet ke thong tin cac tai khoan tin dung va so no ton dong
app.get('/accounts/credit-debt', async (req, res) => {
    try {
      const creditAccounts = await db.collection('Account').aggregate([
        {
          $match: { account_type: "Credit" }  // Lọc các tài khoản tín dụng
        },
        {
          $project: {
            account_id: 1,                 // Lấy mã tài khoản
            customer_id: 1,                // Lấy mã khách hàng
            balance: 1,                    // Lấy số dư hiện tại
            credit_limit: 1,               // Lấy hạn mức tín dụng
            debt: { $subtract: ["$credit_limit", "$balance"] }  // Tính số nợ: credit_limit - balance
          }
        },
        {
          $lookup: {
            from: "Customer",              // Nối với bảng Customer để lấy thông tin khách hàng
            localField: "customer_id",
            foreignField: "customer_id",
            as: "customer_info"
          }
        },
        { $unwind: "$customer_info" },      // Giải nén mảng customer_info
        {
          $project: {
            account_id: 1,
            "customer_name": "$customer_info.name",   // Hiển thị tên khách hàng
            "balance": 1,
            "credit_limit": 1,
            "debt": 1                                 // Hiển thị số nợ
          }
        },
        { $sort: { debt: -1 } }               // Sắp xếp theo số nợ giảm dần
      ]).toArray();
  
      res.json(creditAccounts);
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err });
    }
  });

// Liet ke 10 khach hang co so tien gui nhieu nhat

app.get('/customers/top-depositors', async (req, res) => {
try {
    const topCustomers = await db.collection('Account').aggregate([
    { 
        $match: { account_type: "Debit" }  // Chỉ chọn các tài khoản gửi tiền (Debit)
    },
    { 
        $group: { 
        _id: "$customer_id",            // Gom nhóm theo mã khách hàng (customer_id)
        total_balance: { $sum: "$balance" }  // Tính tổng số dư (balance) của mỗi khách hàng
        } 
    },
    { 
        $lookup: {
        from: "Customer",               // Kết nối với bảng Customer để lấy thông tin khách hàng
        localField: "_id",              // Liên kết bằng customer_id
        foreignField: "customer_id",    // customer_id trong bảng Customer
        as: "customer_info"
        }
    },
    { $unwind: "$customer_info" },      // Giải nén mảng customer_info
    { 
        $project: {
        _id: 0,                         // Loại bỏ _id
        customer_name: "$customer_info.name",  // Hiển thị tên khách hàng
        total_balance: 1                // Hiển thị tổng số dư của khách hàng
        } 
    },
    { $sort: { total_balance: -1 } },    // Sắp xếp theo tổng số tiền giảm dần
    { $limit: 10 }                      // Lấy 10 khách hàng có số tiền nhiều nhất
    ]).toArray();

    res.json(topCustomers);
} catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err });
}
});


// Thuc hien giao dich thanh toan

app.post('/accounts/pay-credit', async (req, res) => {
    const { debit_account_id, credit_account_id, amount } = req.body; 
    try {
      // Lấy thông tin tài khoản gửi tiền (Debit) và tài khoản tín dụng (Credit)
      const debitAccount = await db.collection('Account').findOne({ account_id: debit_account_id, account_type: "Debit" });
      const creditAccount = await db.collection('Account').findOne({ account_id: credit_account_id, account_type: "Credit" });
  
      if (!debitAccount || !creditAccount) {
        return res.status(404).json({ message: 'Tài khoản không tồn tại hoặc sai loại tài khoản' });
      }
  
      // Kiểm tra số dư sau khi thanh toán
      const remainingBalance = debitAccount.balance - amount;
  
      // Kiểm tra điều kiện số dư tài khoản gửi tiền (Debit)
      if (remainingBalance < debitAccount.min_balance) {
        return res.status(400).json({ message: 'Số dư không đủ để thực hiện thanh toán sau khi trừ đi số dư tối thiểu' });
      }
  
      // Thực hiện cập nhật tài khoản gửi tiền (trừ tiền)
      await db.collection('Account').updateOne(
        { account_id: debit_account_id },
        { $inc: { balance: -amount } }
      );
  
      // Thực hiện cập nhật tài khoản tín dụng (tăng số dư thanh toán)
      await db.collection('Account').updateOne(
        { account_id: credit_account_id },
        { $inc: { balance: amount } }
      );
  
      // Thêm thông tin thanh toán vào bảng CreditPayment
      await db.collection('CreditPayment').insertOne({
        debit_account_id,
        credit_account_id,
        payment_amount: amount,
        payment_date: new Date()
      });
  
      res.json({ message: 'Thanh toán thành công' });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err });
    }
  });


// app.use(express.static('public'));

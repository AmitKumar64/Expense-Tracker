import { sql } from "../config/db.js";

export async function getTransactionsByUserID(req, res) {
  try {
    const { userId } = req.params;

    const transactions = await sql`
        SELECT * FROM transactions WHERE user_id = ${userId}
        ORDER BY created_at DESC
        `;

    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ message: "No transactions found for this user" });
    }
    res.status(200).json(transactions);
  } catch (error) {
    console.log("Error adding transaction:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
}

export async function addTransaction(req, res) {
  try {
    const { user_id, title, amount, category } = req.body;

    if (!user_id || !title || !amount === undefined || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const tansaction =
      await sql`INSERT INTO transactions (user_id, title, amount, category)
    VALUES (${user_id}, ${title}, ${amount}, ${category})
    RETURNING *
    `;

    console.log("Transaction added:", tansaction);
    res.status(201).json(tansaction[0]);
  } catch (error) {
    console.log("Error adding transaction:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
}

export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid transaction id" });
    }

    const result = await sql`DELETE FROM transactions WHERE id = ${id}
    RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.log("Error adding transaction:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
}

export async function getTransactionSummaryByUserID(req, res) {
  try {
    const { userId } = req.params;

    const balance = await sql`
    SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${userId}
    `;

    const income = await sql`
    SELECT COALESCE(SUM(amount), 0) as income  FROM transactions WHERE user_id = ${userId} and amount > 0
    `;

    const expenses = await sql`
    SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions WHERE user_id = ${userId} and amount < 0
    `;

    res.status(200).json({
      balance: balance[0].balance,
      income: income[0].income,
      expenses: expenses[0].expenses,
    });
  } catch (error) {
    console.log("Error getting thw summary.", error);
    res.status(500).json({ message: "Internal Server error" });
  }
}

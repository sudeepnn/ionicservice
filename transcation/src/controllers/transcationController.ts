// In controller/cont.ts
import { Request, Response } from 'express';
import Transaction from '../models/transcation';

export const getdata= async (req: Request, res: Response) => {
    try {
     
      const transactions = await Transaction.find();
     
      res.json(transactions);
      return
    } catch (err) {
      
      console.error('Error fetching transactions:', err);
      res.status(500).json({ message: 'Server error' });
      return
    }
  }

  export const getdatabyid= async (req: Request, res: Response) => {
    try {
      const { userid } = req.params;
      const transactions = await Transaction.find({userid:userid});
     
      res.json(transactions);
      return
    } catch (err) {
      
      console.error('Error fetching transactions:', err);
      res.status(500).json({ message: 'Server error' });
      return
    }
  }

  export const updatedata = async (req: Request, res: Response): Promise<void> => {
    try {
      const { date, itemname, amount, userid } = req.body;
  
      if (!date || !itemname || amount === undefined) {
        res.status(400).json({ error: 'Date, itemname, and amount are required' });
        return;
      }
  
      let transaction = await Transaction.findOne({ userid, date });
  
      if (!transaction) {
        // If the transaction doesn't exist, create a new one
        transaction = new Transaction({
          date,
          amount,
          userid,
          items: [{ itemname, amount }]
        });
      } else {
        // Check if the item already exists in the transaction
        const itemIndex = transaction.items.findIndex(item => item.itemname === itemname);
  
        if (itemIndex >= 0) {
          // Item exists, update its amount and recalculate total amount
          const previousAmount = transaction.items[itemIndex].amount;
          transaction.items[itemIndex].amount = amount;  // Update item amount
          transaction.amount += amount - previousAmount;  // Recalculate total amount
        } else {
          // Item doesn't exist, add it to the items array and update total amount
          transaction.items.push({ itemname, amount });
          transaction.amount += amount;
        }
      }
  
      // Save the updated transaction
      await transaction.save();
  
      res.status(200).json(transaction);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };


// const updateTransaction = async (date: Date, amount: number, userid: string) => {
//   return Transaction.findOneAndUpdate(
//     { date: date,userid: userid  },
//     { $set: { amount: amount } },
//     { new: true }
//   );
// };
export const getTransactionByDate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userid, date } = req.params;
    const formattedDate = new Date(date);  // Convert the date string to a Date object

    // Find the transaction for the user and the specific date
    const transaction = await Transaction.findOne({
      userid,
      date: { $gte: formattedDate.setHours(0, 0, 0, 0), $lt: formattedDate.setHours(23, 59, 59, 999) }
    });

    if (!transaction) {
       res.status(404).json({ error: 'Transaction not found' });
       return
    }

    // Return the transaction along with the items
     res.status(200).json(transaction);
     return
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
export const adddata = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, itemname, amount, userid } = req.body;

    if (!date || !itemname || amount === undefined) {
      res.status(400).json({ error: 'Date, itemname, and amount are required' });
      return;
    }

    // Check if a transaction exists for the same user and date
    let transaction = await Transaction.findOne({ userid, date });

    if (!transaction) {
      // Create new transaction if none exists
      transaction = new Transaction({
        date,
        amount,
        userid,
        items: [{ itemname, amount }]
      });
    } else {
      // Update existing transaction
      transaction.items.push({ itemname, amount });  // Add new item to the items array
      transaction.amount += amount;  // Update total amount
    }

    // Save the transaction
    await transaction.save();

    res.status(201).json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


export const expendicture=async (req:Request, res:Response) => {
  try {

    const { userid } = req.params;  // Get the userId from request params (or from req.body if you send it in the body)
    if (!userid) {
       res.status(400).json({ message: 'User ID is required' });
    }
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear + 1, 0, 1);

    // Aggregate monthly expenditure
    const result = await Transaction.aggregate([
      {
        $match: {
          userid:userid,
          date: { $gte: startOfYear, $lt: endOfYear },
        },
      },
      {
        $group: {
          _id: { $month: "$date" }, // Group by month
          totalExpenditure: { $sum: "$amount" }, // Sum the amounts
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month
      },
    ]);

    // Format the result to match months 1-12
    const expenditures = Array(12).fill(0); // Initialize an array with 12 zeroes
    result.forEach(item => {
      expenditures[item._id - 1] = item.totalExpenditure; // Map each month to the corresponding expenditure
    });

    res.json({ monthlyExpenditures: expenditures });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
} 

export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, itemname, userid } = req.params;

    const transaction = await Transaction.findOne({ userid, date });

    if (!transaction) {
       res.status(404).json({ error: 'Transaction not found' });
       return
    }

    const itemIndex = transaction.items.findIndex(item => item.itemname === itemname);

    if (itemIndex === -1) {
       res.status(404).json({ error: 'Item not found' });
       return
    }

    const removedAmount = transaction.items[itemIndex].amount;
    transaction.items.splice(itemIndex, 1); // Remove item from array
    transaction.amount -= removedAmount; // Recalculate total amount
    await transaction.save();

     res.status(200).json(transaction);
     return
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

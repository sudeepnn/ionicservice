import { Router } from "express";
import { adddata, deleteItem, expendicture, getdata, getdatabyid, getTransactionByDate, updatedata } from "../controllers/transcationController";
// import { deleteUser, forgotPassword, getAllUsers, getEmployeeDashboard, getEmployees, getTotalCounts, getUserById, loginUser, registerUser, resetPassword, updateEmployeeDetails, updateProfileImage, updateUser } from "../controllers/userController";



const router = Router();

// router.post("/users/register", registerUser);
// router.post("/users/login", loginUser)
// router.get("/users", getAllUsers);
// router.get("/users/:user_id", getUserById);
// router.get('/usersemp/', getEmployees);
// router.get('/usersemp/counts', getTotalCounts);
// router.put("/users/:id", updateUser);
router.post("/transcation",adddata)
router.put("/transcation/update",updatedata)
router.get("/transcation",getdata)
router.get("/transcation/user/:userid",getdatabyid)
router.get("/expenses/monthly/:userid",expendicture)
router.get('/transaction/:userid/:date', getTransactionByDate);
router.delete('/transaction/delete-item/:userid/:date/:itemname', deleteItem);


export default router;

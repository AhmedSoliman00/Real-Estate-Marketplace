import express from 'express'
import { verifyToken } from '../utils/verifyUser.js'
import {
  updateUser,
  test,
  deleteUser,
  getUserListings,
  deleteUserListing,
  getUserById 
} from '../controllerss/user.controller.js'

const router = express.Router()

router.get('/test', test)
router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/listings/:id', verifyToken, getUserListings)
router.delete("/listings/delete/:id",verifyToken ,deleteUserListing );
router.get("/:id",verifyToken,getUserById);


export default router

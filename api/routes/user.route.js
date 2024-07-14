import express from 'express'
import { verifyToken } from '../utils/verifyUser.js'
import {
  updateUser,
  test,
  deleteUser,
  getUserListings,
} from '../controllerss/user.controller.js'

const router = express.Router()

router.get('/test', test)
router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/listings/:id', verifyToken, getUserListings)

export default router

import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js'
import { errorHandler } from '../utils/error.js'
import Listing from '../models/listing.model.js'
import mongoose from 'mongoose'

export const test = (req, res) => {
  res.json({
    message: 'Hello from controller',
  })
}

export const updateUser = async (req, res, next) => {
  // compared the decoded user id from the token with the user id from the request paramters
  // to determine if the authenticated user is attempting to update their own information or someone else's.
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'you can only update your own profile'))

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }
    const existedUserName = await User.findOne({ username: req.body.username })
    if (existedUserName)
      return next(errorHandler(400, 'Username already existed'))
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    )

    const { password, ...rest } = updatedUser._doc
    return res.status(200).json(rest)
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'you can only delete your own profile'))
  try {
    await User.findByIdAndDelete(req.params.id)
    res.clearCookie('access_token')
    res.status(200).json('User has been deleted')
  } catch (error) {
    next(error)
  }
}

export const getUserListings = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'you can only view your own listings'))
  try {
    const listings = await Listing.find({ userRef: req.params.id })
    res.status(200).json(listings)
  } catch (error) {
    next(error)
  }
}

export const deleteUserListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
    if (!listing) return next(errorHandler(404, 'Listing not found'))
    if (req.user.id !== listing.userRef)
      return next(
        errorHandler(401, 'You are not authorized to delete this listing')
      )

    await Listing.findByIdAndDelete(req.params.id)
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Listing deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

export const getUserById = async (req, res, next) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(errorHandler(400, 'Invalid User ID'))
  }

  try {
    const user = await User.findById(id)
    if (!user) return next(errorHandler(404, 'User not found'))
    const { password: pass, ...rest } = user._doc
    res.status(200).json(rest)
  } catch (error) {
    next(error)
  }
}

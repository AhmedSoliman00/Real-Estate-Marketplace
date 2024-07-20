import Listing from '../models/listing.model.js'
import { errorHandler } from '../utils/error.js'
export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body)
    console.log(listing)
    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Listing created successfully',
      data: listing,
    })
  } catch (error) {
    next(error)
  }
}

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id)
    if (!listing) {
      return next(errorHandler(404, 'Listing not found'))
    }
    if (req.user.id !== listing.userRef) {
      return next(
        errorHandler(401, 'You are not authorized to update this listing')
      )
    }
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return the updated document
    )
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Listing updated successfully',
      data: updatedListing,
    })
  } catch {
    next(error)
  }
}

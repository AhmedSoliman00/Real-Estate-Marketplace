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

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
    if (!listing) {
      return next(errorHandler(404, 'Listing not found'))
    }
    return res.status(200).json(listing)
  } catch (error) {
    next(error)
  }
}

export const searchListing = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5

    const startIndex = parseInt(req.query.startIndex) || 0

    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = {$in: [false,true]}
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = {$in: [false,true]}
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = {$in: [false,true]}
    }

    let type = req.query.type;
    if (type === undefined || type === "false") {
      type = {$in: ["sale","rent"]}
    }

    const searchTerm = req.query.searchTerm || ''
    const sort = req.query.sort || 'createdAt'
    const order = req.query.order || 'desc'

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' }, // i means case insensitive
      offer,
      furnished,
      parking,
      type,
    }).sort({ [sort]: order }).limit(limit).skip(startIndex)

    return res.status(200).json(listings)

  } catch (error) {
    next(error)
  }
}
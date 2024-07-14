import Listing from "../models/listing.model.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    console.log(listing)
    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Listing created successfully",
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

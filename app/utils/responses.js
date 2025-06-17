"use strict";

exports.success = (res, data, message = "Success", code = 200) => {
  return res.status(code).json({
    status: true,
    data: data,
    message: message, 
  });
};

exports.paginated = (res, data, message = "Success", code = 200) => {
  // Renamed 'docs' to 'data' for consistency in the response.
  const responseData = {
    data: data.docs,
    pagination: {
      currentPage: parseInt(data.page),
      limit: parseInt(data.limit),
      nextPage: data.nextPage || null,
      prevPage: data.prevPage || null,
      totalPages: data.totalPages,
      totalDocs: data.totalDocs,
    },
    message: message,
    status: true,
  };
  return res.status(code).json(responseData);
};

exports.error = (res, error = "Oops. An Error Occurred", code = 500) => {
  console.error("Error Response:", error);
  return res.status(code).json({
    status: false, // Indicate error/failure
    error: typeof error === 'string' ? error : error.message || "An unknown error occurred", 
    message: typeof error === 'string' ? error : error.message || "An unknown error occurred",
  });
};

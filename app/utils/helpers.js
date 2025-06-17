"use strict";
const Joi = require("joi");
const dayjs = require("dayjs");

exports.validate = (schema, payload) => {
  
  const { error } = schema.validate(payload, {
    allowUnknown: true,
    abortEarly: false,
  });

  if (error) {
    return error.details[0].message.replace(/['"]/g, "");
  }

  return null;
};

exports.resolveRequestQueryToMongoDBQuery = (requestQuery) => {
  const response = {
    page: 1,
    limit: 50,
    filter: {},
    sort: { createdAt: -1 }
  };

  for (const key in requestQuery) {
    if (!requestQuery.hasOwnProperty(key)) {
      continue;
    }

    if (key === "page") {
      response.page = parseInt(requestQuery[key]);
      continue;
    }
    if (key === "limit") {
      response.limit = parseInt(requestQuery[key]);
      continue;
    }

    if (key === "sort") {
      const [sortKey, sortValue] = requestQuery[key].split(",");
      response.sort = { [sortKey]: parseInt(sortValue) || sortValue || -1 };
      continue;
    }

    if (key === "dateFrom") {
      response.filter.createdAt = {
        ...(response.filter.createdAt || {}),
        $gte: dayjs(requestQuery[key], "DD-MM-YYYY").startOf("day").toDate()
      };
      continue;
    }
    if (key === "dateTo") {
      response.filter.createdAt = {
        ...(response.filter.createdAt || {}),
        $lte: dayjs(requestQuery[key], "DD-MM-YYYY").endOf("day").toDate()
      };
      continue;
    }

    if (key.endsWith("From") && key !== "dateFrom") {
      const fieldName = key.replace(/From/i, "");
      const field = response.filter[fieldName] || {};
      field["$gte"] = dayjs(requestQuery[key], "YYYY-MM-DD").startOf("day").toDate();
      response.filter[fieldName] = field;
      continue;
    }

    if (key.endsWith("To") && key !== "dateTo") {
      const fieldName = key.replace(/To/i, "");
      const field = response.filter[fieldName] || {};
      field["$lte"] = dayjs(requestQuery[key], "YYYY-MM-DD").endOf("day").toDate();
      response.filter[fieldName] = field;
      continue;
    }

    if (key === "q") {
      response.filter.$text = {
        $search: requestQuery[key],
        $caseSensitive: false
      };
      continue;
    }

    if (requestQuery[key]) {
        if (typeof requestQuery[key] === 'string') {
            response.filter[key] = { $regex: new RegExp(requestQuery[key], 'i') };
        } else {
            response.filter[key] = requestQuery[key];
        }
    }
  }

  return response;
};

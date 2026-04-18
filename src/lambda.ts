const serverless = require("serverless-http")
import app from "./app";

const handler = serverless(app)
module.exports.handler = handler
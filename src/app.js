const express = require("express");
const app = express();
const dotenv = require("dotenv");
const logger = require("morgan");
const validationRoutes = require("./routes/validate");
dotenv.config();
const port = process.env.PORT || 5000;
const errorHandler = require("./middleware/error");
if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}

app.use(express.json());
app.use(validationRoutes);

app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is listening in ${process.env.NODE_ENV} on port ${port}`);
});

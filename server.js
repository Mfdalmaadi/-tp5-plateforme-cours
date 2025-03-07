const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3008;

mongoose
  .connect(`${process.env.URL_MONGOOSE}/${process.env.DBNAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

const courseRoute = require("./course");
app.use("/course", courseRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = 5004;

// routes
const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
const levelRoute = require("./routes/level.route");
const roomRoute = require("./routes/room.route");
const invoiceRoute = require("./routes/invoice.route");

// Connect database mongodb
main()
  .then(() => console.log("database connected."))
  .catch((err) => console.log(err));
async function main() {
  await mongoose.set("strictQuery", true);
  await mongoose.connect("mongodb://127.0.0.1:27017/branch_applications");
}

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// use routes
app.use("/auth", authRoute);
app.use("/room", roomRoute);
app.use("/user", userRoute);
app.use("/level", levelRoute);
app.use("/invoice", invoiceRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

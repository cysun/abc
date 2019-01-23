const mongoose = require("mongoose");
const Act = require("../models/Act");
const mail = require("../send_mail");
require("dotenv").load();

async function run() {
  mongoose.connect(
    process.env.DBURL,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      replicaSet: "rs"
    }
  );

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  await Act.updateMany(
    {
      expiration_date: { $exists: true },
      expiration_date: { $gte: start },
      expiration_date: { $lt: end }
    },
    {
      state: "NOT_AVAILABLE"
    }
  );

  await mongoose.disconnect();
}

run();

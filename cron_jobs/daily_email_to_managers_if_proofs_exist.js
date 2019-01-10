const mongoose = require("mongoose");
const User = require("../models/User");
const mail = require("../send_mail");

async function run() {
  mongoose.connect(
    "mongodb://DESKTOP-P2ELC2L:27017,DESKTOP-P2ELC2L:27018,DESKTOP-P2ELC2L:27019/ABC",
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      replicaSet: "rs"
    }
  );

  //Count the number of users who have acts that are under review
  const user_count = await User.find({
    "acts.state": "UNDER_REVIEW"
  }).countDocuments();

  //If count is more than zero
  //Don't bug the admin?
  if (user_count > 0) {
    //Get all manager emails
    const manager_emails = await User.find(
      {
        "roles.name": "Manager"
      },
      { _id: false, email: true }
    );
    //Send email to all managers
    if (manager_emails.length > 0) {
      const promises = [];
      manager_emails.forEach(element => {
        promises.push(mail.notifyManagersOfProof(element.email, user_count));
      });
      await Promise.all(promises);
    }
  }

  await mongoose.disconnect();
}

run();

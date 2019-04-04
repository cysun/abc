const Act = require("../models/Act");
const mail = require("../send_mail");
require("dotenv").load();

async function run() {
  
  const today = new Date();
  const a_week_in_the_future = new Date();
  a_week_in_the_future.setDate(today.getDate() + 7);
  const start = new Date(a_week_in_the_future);
  start.setHours(0, 0, 0, 0);

  const end = new Date(a_week_in_the_future);
  end.setHours(23, 59, 59, 999);

  //If act will expire in a week's time,
  const acts = await Act.find(
    {
      expiration_date: { $exists: true },
      expiration_date: { $gte: start },
      expiration_date: { $lt: end }
    },
    { act_provider: true, name: true }
  );

  //Remind the act poster of the expiration
  if (acts.length > 0) {
    const promises = [];
    //Send emails to users
    for (let i = 0; i < acts.length; i++) {
      promises.push(
        mail.sendExpirationNotice(
          acts[i].act_provider.email,
          acts[i].name,
          acts[i]._id
        )
      );
    }
    await Promise.all(promises);
  }
}
module.exports = {
  run
}
const jwt_decode = require("jwt-decode");

export default async function(context) {
  //If this path is the admin path
  if (context.route.path.indexOf("/admin") !== -1) {
    const token = context.app.$cookies.get("token");

    //If token is empty or invalid, redirect to acts
    if (!token) {
      context.redirect("/acts");
      return;
    }
    try {
      const user = jwt_decode(token);
      let found = false;
      for (let i = 0; i < user.roles.length; i++) {
        if (user.roles[i].name == "Administrator") {
          found = true;
          break;
        }
      }
      //If this is not an admin, redirect to acts
      if (!found) {
        context.redirect("/acts");
        return;
      }
    } catch (ex) {
      context.redirect("/acts");
      return;
    }
  }
}

<template>
  <div>
    <my-header :logged_in="logged_in" :page="page"/>
    <my-banner :title="title"/>
    <section class="contact py-5">
      <div class="container">
        <div class="row contact_full w3-agile-grid">
          <div class="col-md-12 contact-us w3-agile-grid">
            <div class="styled-input">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="New Password"
                v-model="password"
                required
              >
            </div>
            <div class="click mt-3">
              <input type="submit" @click="login" id="login_button" value="RESET PASSWORD">
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import axios from "~/plugins/axios";
import MyBanner from "~/components/Banner.vue";
import MyHeader from "~/components/Header.vue";
let vue_context, izitoast;

export default {
  components: {
    MyBanner,
    MyHeader
  },
  created: function() {
    vue_context = this;
  },
  async mounted() {
    izitoast = require("izitoast");
  },
  async asyncData(context) {
    if (context.app.$cookies.get("token")) {
      context.redirect("/");
    }
    //If reset password token is invalid, redirect to main page
    let data;
    await axios
      .get(`/api/password_reset_token/${context.params.id}`)
      .then(function(res) {
        data = res.data;
        if (!data.user_count) {
          context.redirect("/");
          return;
        }
      })
      .catch(function(err) {
        context.redirect("/");
        return;
      });
    // console.log(data)
    // return { data };
  },
  head() {
    return {
      title: "Asset Building Clinic : Reset Password",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Enter your new password"
        }
      ]
    };
  },
  data() {
    return {
      title: "Reset Password",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      image: null,
      logged_in: false,
      page: "reset_password"
    };
  },
  methods: {
    fileChanged(event) {
      this.image = event.target.files[0];
    },
    login() {
      
      //Check if there an empty input field
      //If so, give error and return
      if (!this.password) {
        izitoast.error({
          title: "Error",
          message: "Password must be present",
          position: "topRight"
        });
        return;
      }

      //Else
      const params = new URLSearchParams();
      params.append("password", this.password);
      params.append("reset_password", this.$route.params.id);
      axios
        .post("/api/reset_password", params)
        .then(function(res) {
          //If works, give message
          izitoast.success({
            title: "Success",
            message: "Password has been successfully changed",
            position: "topRight"
          });
          //Redirect user to login screen
          vue_context.$nuxt.$router.replace("/login");
        })
        .catch(function(err) {
          //If fails, give error message
          if (err.response) {
            izitoast.error({
              title: "Error",
              message: err.response.data.message,
              position: "topRight"
            });
          }
        });
    }
  }
};
</script>

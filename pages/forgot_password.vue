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
                type="email"
                id="email"
                name="email"
                :placeholder="$t('email')"
                v-model="email"
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
  },
  head() {
    return {
      title: "Asset Building Clinic : Forgot Password",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Enter your email to get password reset instructions"
        }
      ]
    };
  },
  data() {
    return {
      title: "Forgot Password",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      image: null,
      logged_in: false,
      page: "forgot_password"
    };
  },
  methods: {
    fileChanged(event) {
      this.image = event.target.files[0];
    },
    login() {
      //Check if there an empty input field

      //If so, display error
      if (!this.email)
        izitoast.error({
          title: "Error",
          message: "Email must be present",
          position: "topRight"
        });
      else {
        //If all fields are present
        this.$nuxt.$loading.start();

        //Send email to server
        // application/x-www-form-urlencoded format
        const params = new URLSearchParams();

        params.append("email", this.email);

        axios
          .post("/api/forgot_password", params)
          .then(function(res) {
            vue_context.$nuxt.$loading.finish();
            //If works, give message
            izitoast.success({
              title: "Success",
              message:
                "Password reset instructions have been sent to the email if an account exists with us.",
              position: "topRight"
            });
            //Clear form
            vue_context.email = "";
          })
          .catch(function(err) {
            vue_context.$nuxt.$loading.finish();
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
  }
};
</script>

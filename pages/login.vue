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
            <div class="styled-input">
              <input
                type="password"
                id="password"
                name="password"
                :placeholder="$t('password')"
                v-model="password"
                required
                @keyup.enter="login"
              >
            </div>
            <div class="click mt-3">
              <input type="submit" @click="login" id="login_button" :value="$t('LOGIN')">
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
  data() {
    return {
      title: "Log in",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      image: null,
      logged_in: false,
      page: "login"
    };
  },
  methods: {
    fileChanged(event) {
      this.image = event.target.files[0];
    },
    login() {
      //Check if there an empty input field
      //If so, display error
      if (!this.email || !this.password)
        izitoast.error({
          title: "Error",
          message: "All fields must be present",
          position: "topRight"
        });
      else {
        //If all fields are present
        this.$nuxt.$loading.start();

        // application/x-www-form-urlencoded format
        const params = new URLSearchParams();

        params.append("email", this.email);
        params.append("password", this.password);

        axios
          .post("/api/login", params)
          .then(function(res) {
            vue_context.$nuxt.$loading.finish();
            //Save cookies
            vue_context.$cookies.set("token", res.data.token, {
              path: "/",
              maxAge: 3600000
            });
            vue_context.$cookies.set("refresh_token", res.data.refresh_token, {
              path: "/",
              maxAge: 31536000000
            });
            //Redirect to acts page
            vue_context.$router.replace("/acts");
          })
          .catch(function(err) {
            vue_context.$nuxt.$loading.finish();
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

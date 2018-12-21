<template>
  <div>
    <my-header :logged_in="logged_in" :page="page"/>
    <my-banner :title="title"/>
    <section class="contact py-5">
      <div class="container">
        <div v-if="error" class="alert alert-danger">
          <strong>Error:</strong>
          {{error}}
        </div>
        <div class="row contact_full w3-agile-grid">
          <div class="col-md-12 contact-us w3-agile-grid">
            <div class="styled-input">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                v-model="email"
                required
              >
            </div>
            <div class="styled-input">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                v-model="password"
                required
              >
            </div>
            <div class="click mt-3">
              <input type="submit" @click="login" id="login_button" value="LOGIN">
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
// import base64Img from 'base64-img';
function getCookie(cookiename, cookies) {
  // Get name followed by anything except a semicolon
  var cookiestring = RegExp("" + cookiename + "[^;]+").exec(cookies);
  // Return everything after the equal sign, or an empty string if the cookie name not found
  return decodeURIComponent(
    !!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : ""
  );
}

let vue_context;

export default {
  components: {
    MyBanner,
    MyHeader
  },
  created: function() {
    vue_context = this;
  },
  async mounted() {
    // this.$nextTick(() => {
    //   this.$nuxt.$loading.start();
    //   setTimeout(() => this.$nuxt.$loading.finish(), 1500);
    // });
    // for (let i = 0; i < 1000; i++)
    //   await axios.get("/api/users/users").then(function(res) {
    //     vue_context.title = res.title;
    //     console.log(res);
    //   });
  },
  async asyncData(context) {
    // if (process.server) {
    //Logged in users can't access this page
    // console.log(context.app)
    // if (context.app.$cookies.get("token")) context.redirect("/");
    // }
    // if (process.client) {
    // console.log(context.app.$cookies.getAll())
    if (context.app.$cookies.get("token")) {
      context.redirect("/");
    }
    // }
  },
  data() {
    return {
      title: "Log in",
      error: "",
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
        this.error = "All fields must be present";
      else {
        //If all fields are present
        //Convert image to base64 if exists
        // if (this.image)
        // {
        //   const base64_image = base64Img.base64Sync
        // }
        //Send json to server
        // const json = {
        //   first_name: this.first_name,
        //   last_name: this.last_name,
        //   email: this.email,
        //   password: this.password
        // };

        this.$nuxt.$loading.start();

        // application/x-www-form-urlencoded format
        const params = new URLSearchParams();

        params.append("email", this.email);
        params.append("password", this.password);

        axios
          .post("/api/users/login", params)
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
            if (err.response) vue_context.error = err.response.data.message;
          });

        //Else
      }
    }
  }
  // mounted() {
  //   this.msg = "Works";
  // }
  // created: function() {
  //   this.msg = "Works"
  // }
};
</script>
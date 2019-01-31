<template>
  <div>
    <my-header :logged_in="logged_in" :page="page"/>
    <my-banner :title="title"/>
    <section class="about py-5">
      <div class="container py-md-3">
        <h3 class="heading mb-md-5 mb-4" id="congratulations">{{$t('congratulations')}}</h3>
        <div class="row about-grids agile-info">
          <div class="col-lg-6 mb-lg-0 w3-agile-grid mb-5">
            <p>{{$t('verify_your_account')}}</p>
            <p>{{$t('click_on_the_link_to_verify')}}</p>
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
  // async asyncData({ query, req }) {
  async asyncData(context) {
    //If user is logged in, redirect to main page
    // context.redirect("/");
    //getCook("connect.sid", req.headers.cookie);
    // console.log(context.req.headers.cookie);
    //Check if user is logged in
    //If so, redirect to main page
    // if (process.server) {
    //   if (getCookie("token", context.req.headers.cookie)) {
    //     context.redirect("/");
    //   }
    // }
  },
  head () {
    return {
      title: "Asset Building Clinic : Verify your account",
      meta: [
        { hid: 'description', name: 'description', content: 'Verify your account' }
      ]
    }
  },
  data() {
    return {
      title: "Verify your account",
      error: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      image: null,
      logged_in: false,
      page: "verify_account"
    };
  },
  methods: {
    fileChanged(event) {
      this.image = event.target.files[0];
    },
    register() {
      //Check if there an empty input field
      //If so, display error
      if (!this.first_name || !this.last_name || !this.email || !this.password)
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

        const formData = new FormData();
        if (this.image) formData.append("file", this.image, this.image.name);

        formData.append("first_name", this.first_name);
        formData.append("last_name", this.last_name);
        formData.append("email", this.email);
        formData.append("password", this.password);

        axios
          .post("/api/users/register", formData)
          .then(function(res) {
            //Redirect to verification page
            vue_context.$nuxt.$loading.finish();
            vue_context.$router.push({
              path: "/verify_account"
            });
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

<style scoped>
/*.title {
  margin: 30px 0;
}
.users {
  list-style: none;
  margin: 0;
  padding: 0;
}
.user {
  margin: 10px 0;
}*/
</style>

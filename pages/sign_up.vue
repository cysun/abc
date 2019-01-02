<template>
  <div>
    <my-header :logged_in="logged_in" :page="page"/>
    <my-banner :title="title"/>
    <section class="contact py-5">
      <div class="container">
        <div class="row contact_full w3-agile-grid">
          <div class="col-md-12 contact-us w3-agile-grid">
            <div class="row">
              <div class="col-md-6 styled-input">
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  v-model="first_name"
                  placeholder="First name"
                  required
                >
              </div>
              <div class="col-md-6 styled-input">
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  v-model="last_name"
                  placeholder="Last name"
                  required
                >
              </div>
            </div>
            <div class="styled-input">
              <input
                type="email"
                id="email"
                name="email"
                v-model="email"
                placeholder="Email"
                required
              >
            </div>
            <div class="styled-input">
              <input
                type="password"
                id="password"
                name="password"
                v-model="password"
                placeholder="Password"
                required
                @keyup.enter="register"
              >
            </div>
            <div class="styled-input white">
              <div>
                <label for="profile_picture">Profile picture</label>
              </div>
              <input @change="fileChanged" type="file" name="file" id="profile_picture">
            </div>
            <div class="click mt-3">
              <input
                id="create_account_button"
                @click="register"
                type="submit"
                value="CREATE AN ACCOUNT"
              >
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

let vue_context, iziToast;
export default {
  components: {
    MyBanner,
    MyHeader
  },
  created: function() {
    vue_context = this;
  },
  async mounted() {
    iziToast = require("iziToast");
  },
  async asyncData(context) {
    if (context.app.$cookies.get("token")) {
      context.redirect("/");
    }
  },
  data() {
    return {
      title: "Sign up",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      image: null,
      logged_in: false,
      page: "sign_up"
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
      iziToast.error({
            title: "Error",
            message: "All fields must be present",
            position: "topRight"
          });
      else {
        //If all fields are present
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
            if (err.response) 
            {
              iziToast.error({
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
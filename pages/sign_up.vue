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
                  :placeholder="$t('first_name')"
                  required
                >
              </div>
              <div class="col-md-6 styled-input">
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  v-model="last_name"
                  :placeholder="$t('last_name')"
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
                :placeholder="$t('email')"
                required
              >
            </div>
            <div class="styled-input">
              <input
                type="password"
                id="password"
                name="password"
                v-model="password"
                :placeholder="$t('password')"
                required
                @keyup.enter="register"
              >
            </div>
            <div class="styled-input white">
              <div>
                <label for="profile_picture">{{$t('profile_picture')}}</label>
              </div>
              <input @change="fileChanged" type="file" name="file" id="profile_picture">
            </div>
            <div class="click mt-3">
              <input
                id="create_account_button"
                @click="register"
                type="submit"
                :value="$t('CREATE_AN_ACCOUNT')"
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
      context.redirect("/acts");
    }
  },
  head () {
    return {
      title: "Asset Building Clinic : Sign Up",
      meta: [
        { hid: 'description', name: 'description', content: 'Sign up to access financially rewarding acts' }
      ]
    }
  },
  data() {
    return {
      title: "sign_up",
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
      izitoast.error({
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
          .post("/api/register", formData)
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

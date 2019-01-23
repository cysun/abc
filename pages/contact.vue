<template>
  <div>
    <my-header :logged_in="logged_in" :page="page" :roles="data.roles"/>
    <my-banner :title="title"/>
    <section class="contact py-5">
      <div class="container">
        <h2 class="heading mb-lg-5 mb-4">{{$t('contact_us')}}</h2>
        <div class="row contact-grids w3-agile-grid">
          <div class="row col-md-4 col-sm-6 contact-grid1 w3-agile-grid">
            <div class="col-3 text-center">
              <i class="fas fa-envelope-open"></i>
            </div>
            <div class="col-9 p-0">
              <h4>{{$t('email')}}</h4>
              <p>
                <a href="mailto:abc.project.finance1@gmail.com">abc.project.finance1@gmail.com</a>
              </p>
            </div>
          </div>
          <!-- <div class="row col-md-4 col-sm-6 mt-sm-0 mt-4 contact-grid1 w3-agile-grid">
            <div class="col-3 text-center">
              <i class="fas fa-phone"></i>
            </div>
            <div class="col-9 p-0">
              <h4>{{$t('call_us')}}</h4>
              <p>+11 887 8976 2334</p>
            </div>
          </div>
          <div class="row col-md-4 col-sm-6 mt-md-0 mt-4 contact-grid1 w3-agile-grid">
            <div class="col-3 text-center">
              <i class="fas fa-laptop"></i>
            </div>
            <div class="col-9 p-0">
              <h4>{{$t('fax')}}</h4>
              <p>
                <a href="mailto:example@career.com">example@career.com</a>
              </p>
            </div>
          </div>-->
        </div>
        <div class="row contact_full w3-agile-grid">
          <div class="col-md-12 contact-us w3-agile-grid">
            <form @submit.prevent="contactUs">
              <div class="row">
                <div class="col-md-6 styled-input">
                  <input
                    type="text"
                    v-model="data.user.name"
                    name="Name"
                    :placeholder="$t('name')"
                    required
                  >
                </div>
                <div class="col-md-6 styled-input">
                  <input
                    type="email"
                    name="Email"
                    v-model="data.user.email"
                    :placeholder="$t('email')"
                    required
                  >
                </div>
              </div>
              <div class="styled-input">
                <input
                  type="text"
                  name="phone"
                  v-model="data.user.tel"
                  :placeholder="$t('phone_number')"
                >
              </div>
              <div class="styled-input">
                <textarea
                  name="Message"
                  v-model="data.user.message"
                  :placeholder="$t('message')"
                  required
                ></textarea>
              </div>
              <div class="click mt-3">
                <input type="submit" :value="$t('send')">
              </div>
            </form>
          </div>
          <!-- <div class="col-md-5 map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1398183.40180821!2d7.103180750702041!3d46.80771447968857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c64ef6f596d61%3A0x5c56b5110fcb7b15!2sSwitzerland!5e0!3m2!1sen!2sin!4v1529102870533"
            ></iframe>
          </div> -->
        </div>
      </div>
    </section>
    <!-- //team -->
  </div>
</template>

<script>
import MyBanner from "~/components/Banner.vue";
import MyHeader from "~/components/Header.vue";
import axios from "~/plugins/axios";
let vue_context, izitoast;
export default {
  components: {
    MyBanner,
    MyHeader
  },
  async mounted() {
    izitoast = require("izitoast");
  },
  async asyncData(context) {
    const token = context.app.$cookies.get("token");
    const refresh_token = context.app.$cookies.get("refresh_token");
    //Make request to server
    let data, logged_in;
    data = {
      user: {
        name: "",
        email: "",
        tel: "",
        message: ""
      },
      roles: {}
    };
    logged_in = false;
    await axios
      .get(`/api/users/details`, {
        headers: { Cookie: `token=${token}; refresh_token=${refresh_token};` }
      })
      .then(function(res) {
        data = res.data;
        data.user.name = data.user.first_name + " " + data.user.last_name;
        logged_in = true;
      })
      .catch(function(err) {
        data.roles = {};
      });

    return { data, logged_in };
  },
  created: function() {
    vue_context = this;
  },
  methods: {
    async contactUs() {
      //Send data to email processor
      axios.post("/api/contact", this.data.user).then(function(res) {
        vue_context.data.user.name = "";
        vue_context.data.user.email = "";
        vue_context.data.user.tel = "";
        vue_context.data.user.message = "";
        izitoast
          .success({
            title: "Success",
            message: "Your message has been successfully received",
            position: "topRight"
          })
          .catch(function(err) {
            izitoast.error({
              title: "Error",
              message: "Sorry, there was an error processing your request",
              position: "topRight"
            });
          });
      });
      //Give response message
    }
  },
  data() {
    return {
      title: "contact_us",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      image: null,
      page: "contact"
    };
  }
};
</script>
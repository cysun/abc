<template>
  <footer>
    <div class="container-fluid p-5">
      <div class="row footer-gap">
        <div class="col-lg-5 mb-lg-0 mb-4">
          <h3 class="text-capitalize mb-3">{{$t('about_company')}}</h3>
          <p>{{$t('about_us_text_1')}}</p>
          <div class="row mt-4">
            <div class="col-md-6">
              <h3 class="text-capitalize mb-3">{{$t('connect_with_us')}}</h3>
              <a href="#" class="facebook mr-2">
                <span class="fab mr-1 fa-facebook-f"></span> Facebook
              </a>
            </div>
            <div class="col-md-6 mt-md-0 mt-5">
              <h3 class="text-capitalize mb-3">{{$t('head_quarters')}}</h3>
              <address class="mb-0">
                <p class="mb-2">
                  <i class="fas fa-map-marker"></i> ABC Asset Building Clinic,
                  <br>Cal State LA, 5151 University
                  <br>Dr. ST 814, Los Angeles,
                  California 90032
                </p>
                <p>
                  <i class="fas mr-1 fa-clock"></i> {{$t('time')}}: By appointment
                </p>
                <p>
                  <i class="fas mr-1 fa-envelope-open"></i>
                  <a :href="`mailto:${email_address}`">{{email_address}}</a>
                </p>
              </address>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mt-lg-0 mt-sm-0 p-md-0">
          <h3 class="text-capitalize mb-3">{{$t('services')}}</h3>
          <ul>
            <li>
              <i class="fas mr-1 fa-chevron-circle-right"></i> {{$t('affordable_housing')}}.
            </li>
            <li>
              <i class="fas mr-1 fa-chevron-circle-right"></i> {{$t('utility_assistance')}}.
            </li>
            <li>
              <i class="fas mr-1 fa-chevron-circle-right"></i> {{$t('savings_and_credit')}}.
            </li>
          </ul>
          <h3 class="text-capitalize mt-4 mb-3">{{$t('newsletter')}}</h3>
          <p class="mb-3">{{$t('subscribe_text')}}</p>
          <form @submit.prevent="addSubscriber">
            <input
              type="email"
              v-model="subscriber"
              name="Email"
              :placeholder="$t('enter_your_email_address')"
              required
            >
            <button class="btn1">
              <i class="far fa-paper-plane"></i>
            </button>
            <div class="clearfix"></div>
          </form>
        </div>
        <div class="col-lg-4 col-md-6 mt-lg-0 mt-md-0 mt-4 p-md-0">
          <h3 class="text-capitalize mb-3">{{$t('latest_acts')}}</h3>
          <div class="blog-grids row mb-3" v-for="(act, index) in acts">
            <div class="col-md-4 col-sm-3 col-4 pr-sm-3 pr-0 blog-grid-left">
              <nuxt-link :to="'/acts/' + act._id">
                <img :src="`/images/f${index + 1}.jpg`" class="img-fluid" alt>
              </nuxt-link>
            </div>
            <div class="col-md-8 col-sm-9 col-8 blog-grid-right">
              <h5>
                <nuxt-link :to="'/acts/' + act._id">{{act.name}}</nuxt-link>
              </h5>
              <div class="sub-meta">
                <span>
                  <i class="far fa-clock"></i>
                  {{act.creation_date}}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright pb-sm-5 pb-4 text-center">
      <p>
        © 2019 ABC. {{$t('all_rights_reserved')}} | Design by
        <a
          href="http://www.W3Layouts.com"
          target="_blank"
        >W3Layouts</a>
      </p>
    </div>
  </footer>
</template>

<script>
import axios from "~/plugins/axios";
import moment from "moment";
let vue_context;
let izitoast;
export default {
  created: function() {
    vue_context = this;
    axios
      .get(`/api/latest_acts`)
      .then(function(res) {
        vue_context.acts = res.data;
        vue_context.acts.forEach(element => {
          element.description = element.description.substring(0, 60) + "...";
          element.creation_date = moment(element.creation_date).format(
            "MMMM Do YYYY"
          );
        });
      })
      .catch(function(err) {});
  },
  async mounted() {
    izitoast = require("izitoast");
  },
  data() {
    return {
      acts: [],
      subscriber: "",
      email_address: process.env.email_address
    };
  },
  methods: {
    addSubscriber() {
      //Make sure an email address was entered
      //If not, error and return
      if (!this.subscriber) {
        izitoast.error({
          title: "Error",
          message: "An email address must be entered",
          position: "topRight"
        });
        return;
      }
      //Else
      else {
        const params = new URLSearchParams();
        params.append("email", this.subscriber);
        //Add this email to the list of subscribers
        axios
          .post(`/api/add_subscriber`, params)
          .then(function(res) {
            //If everything works perfectly well
            //Clear form
            vue_context.subscriber = "";
            //Give success message
            izitoast.success({
              title: "Success",
              message: res.data.message,
              position: "topRight"
            });
          })
          .catch(function(err) {
            //If error
            //Display error
            izitoast.error({
              title: "Error",
              message: err.response.data.message,
              position: "topRight"
            });
          });
      }
    }
  }
};
</script>

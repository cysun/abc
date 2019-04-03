<template>
  <div>
    <my-header :logged_in="logged_in" :page="page" :roles="roles"/>
    <my-banner :title="title"/>
    <section class="banner-bottom-w3ls-agileinfo py-5">
      <!--/blog-->
      <div class="container py-md-3">
        <div class="row inner-sec-wthree-agileits">
          <div class="col-lg-12 blog-sp">
            <div id="calendar"></div>
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
import jwt_decode from "jwt-decode";
import moment from "moment";
const globals = require("../globals");

let vue_context;
let $;
let my_calendar;
let first_time = true;

export default {
  components: {
    MyBanner,
    MyHeader
  },
  created: function() {
    vue_context = this;
  },
  async mounted() {
    $ = require("jquery");
    require("fullcalendar");
    $(function() {
      // page is now ready, initialize the calendar...

      my_calendar = $("#calendar").fullCalendar({
        themeSystem: "bootstrap4",
        eventClick: function(event) {
          vue_context.$router.push(event.url);
          return false;
        },

        eventMouseover: function(calEvent, jsEvent, view) {
          $(this).css("background-color", "blue");
          $(this).css("cursor", "pointer");
        },

        eventMouseout: function(calEvent, jsEvent, view) {
          $(this).css("background-color", "rgb(58, 135, 173)");
        },

        eventSources: [
          {
            url: "/api/acts/calendar"
          }
        ],
        lazyFetching: true,
        allDaySlot: false,
        slotEventOverlap: true,
        agendaEventMinHeight: true,
        nowIndicator: true,
        navLinks: true,
        navLinkDayClick: "agenda",
        buttonText: {
          title: "Title",
          today: "Today",
          month: "Month",
          agenda: "Agenda",
          list: "List"
        },
        header: {
          left: "title",
          center: "",
          right: "today, prev,next, month,agenda,list"
        }
      });
    });
  },
  head () {
    return {
      title: "Asset Building Clinic : View rewards",
      meta: [
        { hid: 'description', name: 'description', content: 'Search for specific rewards' }
      ]
    }
  },
  head() {
    return {
      title: "Asset Building Clinic : View events on a calendar",
      meta: [
        { hid: 'description', name: 'description', content: 'Look for events taking place on specific days on the calendar' }
      ],
      script: [
        { src: "js/moment.min.js" }
      ],
      link: [
        {
          href:
            "https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.9.0/fullcalendar.min.css",
          rel: "stylesheet"
        }
      ]
    };
  },
  async asyncData(context) {
    const roles = {};
    if (context.app.$cookies.get("token")) {
      //Process JWT
      const payload = jwt_decode(context.app.$cookies.get("token"));
      //Get roles
      if (payload.roles.length > 0) {
        payload.roles.forEach(element => {
          //Attach roles in array into distinct properties
          switch (element.name) {
            case "Act Poster":
              roles.act_poster = true;
              break;
            case "Reward Provider":
              roles.reward_provider = true;
              break;
            case "Manager":
              roles.manager = true;
              break;
            case "Administrator":
              roles.reward_provider = true;
              roles.administrator = true;
              roles.act_poster = true;
              roles.manager = true;
              break;
          }
        });
        return { roles };
      }
    } else {
      context.redirect("/logout");
      return;
    }
  },
  data() {
    return {
      title: "Calendar",
      error: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      image: null,
      logged_in: true,
      page: "calendar",
      roles: {}
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
      }
    }
  }
};
</script>
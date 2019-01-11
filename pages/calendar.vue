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
        // put your options and callbacks here

        // dayClick: function() {
        //   alert("a day has been clicked!");
        // }

        // showNonCurrentDates: false,
        themeSystem: "bootstrap4",
        eventClick: function(event) {
          // alert("Event: " + calEvent.title);
          // alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
          // alert('View: ' + view.name);

          // alert(moment(my_calendar.fullCalendar("getView").start).format());
          // alert(my_calendar.fullCalendar("getView").end);

          vue_context.$router.push(event.url);
          return false;
        },

        eventMouseover: function(calEvent, jsEvent, view) {
          // alert('Event: ' + calEvent.title);
          // alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
          // alert('View: ' + view.name);
          // change the border color just for fun
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

        // viewRender: function(view, element) {
        //   // alert(view.start);
        //   vue_context.events.push({
        //     title: "Second Event",
        //     start: "2018-12-24T12:30:00",
        //     end: "2018-12-24T13:00:00",
        //     allDay: false,
        //     url: `acts/2`
        //   });
        //   // my_calendar.events = vue_context.events;
        //   if (!first_time) {
        //     my_calendar.fullCalendar('refetchEvents');
        //     // my_calendar.fullCalendar('refetchEventSources', vue_context.events)
        //     // my_calendar.fullCalendar("rerenderEvents");
        //     // my_calendar.fullCalendar("renderEvent", {
        //     //   title: "Second Event",
        //     //   start: "2018-12-24T12:30:00",
        //     //   end: "2018-12-24T13:00:00",
        //     //   allDay: false,
        //     //   url: `acts/2`
        //     // });
        //   }
        //   first_time = false;
        // },

        // events: vue_context.events,
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
  head() {
    return {
      script: [
        { src: "js/moment.min.js" }
        // {
        //   src:
        //     "https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.9.0/fullcalendar.min.js"
        // }
      ],
      // css: [
      //   '~/assets/css/fullcalendar.css'
      // ]
      link: [
        {
          href:
            "https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.9.0/fullcalendar.min.css",
          rel: "stylesheet"
        }
      ]
    };
  },
  // async asyncData({ query, req }) {
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
      // events: [
      //   {
      //     title: "First Event",
      //     start: "2018-12-23T12:30:00",
      //     end: "2018-12-23T13:00:00",
      //     allDay: false,
      //     url: `acts/1`
      //   }
      // ]
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

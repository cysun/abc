<template>
  <div>
    <my-header :logged_in="logged_in" :page="page" :roles="roles"/>
    <my-banner :title="title"/>
    <about-sidebar/>
    <how-we-work/>
    <!-- //about -->
    <!-- team -->
    <section class="team py-5">
      <div class="container py-md-3">
        <h3 class="heading mb-lg-5 mb-4">{{$t('our_professionals')}}</h3>
        <div class="row team-grids">
          <div class="col-md-3 col-sm-6 mb-md-0 mb-4 team-grid w3-agile-grid">
            <div class="team-members">
              <div class="team-avatar">
                <img src="images/t1.jpg" class="img-fluid" alt="image">
              </div>
              <div class="team-desc agile-info">
                <h4>John Doe</h4>
                <span>Director</span>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 mb-md-0 mb-4 team-grid w3-agile-grid">
            <div class="team-members">
              <div class="team-avatar">
                <img src="images/t2.jpg" class="img-fluid" alt="image">
              </div>
              <div class="team-desc agile-info">
                <h4>Melisa Doe</h4>
                <span>Director</span>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 mb-sm-0 mb-4 team-grid w3-agile-grid">
            <div class="team-members">
              <div class="team-avatar">
                <img src="images/t3.jpg" class="img-fluid" alt="image">
              </div>
              <div class="team-desc agile-info">
                <h4>Alex Atkinson</h4>
                <span>Director</span>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 team-grid w3-agile-grid">
            <div class="team-members">
              <div class="team-avatar">
                <img src="images/t4.jpg" class="img-fluid" alt="image">
              </div>
              <div class="team-desc agile-info">
                <h4>Thompson</h4>
                <span>Director</span>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 mt-4 team-grid w3-agile-grid">
            <div class="team-members">
              <div class="team-avatar">
                <img src="images/t5.jpg" class="img-fluid" alt="image">
              </div>
              <div class="team-desc agile-info">
                <h4>John Doe</h4>
                <span>Director</span>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 mt-4 team-grid w3-agile-grid">
            <div class="team-members">
              <div class="team-avatar">
                <img src="images/t6.jpg" class="img-fluid" alt="image">
              </div>
              <div class="team-desc agile-info">
                <h4>Melisa Doe</h4>
                <span>Director</span>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 mt-4 team-grid w3-agile-grid">
            <div class="team-members">
              <div class="team-avatar">
                <img src="images/t7.jpg" class="img-fluid" alt="image">
              </div>
              <div class="team-desc agile-info">
                <h4>Alex Atkinson</h4>
                <span>Director</span>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 mt-4 team-grid w3-agile-grid">
            <div class="team-members">
              <div class="team-avatar">
                <img src="images/t8.jpg" class="img-fluid" alt="image">
              </div>
              <div class="team-desc agile-info">
                <h4>Thompson</h4>
                <span>Director</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- //team -->
  </div>
</template>

<script>
import MyBanner from "~/components/Banner.vue";
import MyHeader from "~/components/Header.vue";
import AboutSidebar from "~/components/About_sidebar.vue";
import jwt_decode from "jwt-decode";
import HowWeWork from "~/components/How_we_work.vue";
let vue_context;
export default {
  components: {
    MyBanner,
    MyHeader,
    HowWeWork,
    AboutSidebar
  },
  // async asyncData(context) {
  //   if (context.app.$cookies.get("token")) {
  //     const logged_in = true;
  //     return logged_in;
  //   }
  // },
  created: function() {
    vue_context = this;

    if (this.$cookies.get("token")) {
      this.logged_in = true;
      //Process JWT
      const payload = jwt_decode(this.$cookies.get("token"));
      //Get roles
      if (payload.roles.length > 0) {
        const roles = {};
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
        this.roles = roles;
      }
    }
  },
  head () {
    return {
      title: "Asset Building Clinic : About Us",
      meta: [
        { hid: 'description', name: 'description', content: 'Get information concerning our motives and plans' }
      ]
    }
  },
  data() {
    return {
      title: "about_us",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      roles: {},
      image: null,
      logged_in: false,
      page: "about"
    };
  }
};
</script>
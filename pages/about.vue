<template>
  <div>
    <my-header :logged_in="logged_in" :page="page" :roles="roles"/>
    <my-banner :title="title"/>
    <section class="about py-5">
      <div class="container py-md-3 agile-info">
        <h2 class="heading mb-md-5 mb-4">{{$t('about_us')}}</h2>
        <div class="row about-grids agile-info">
          <div class="col-lg-6 w3-agile-grid mb-lg-0 mb-5">
            <p>{{$t('about_us_text_3')}}</p>
            <!-- <p class="mt-2 mb-3">
              Cras blandit nibh ut pretium elementum. Duis bibendum convallis nun ca dictum. Quisquen ac ipsum porta, ultrices metus sit amet,
              curs in nisl. Duis aliquet varius sem sit amet. convallis nun ca dictum amet. Quisquen ac ipsum porta, ultrices metus sit amet,
              curs in nisl. Duis aliquet varius sem sit amet.
            </p>
            <a href="about.html">Read More</a> -->
          </div>
          <div class="col-lg-3 w3-agile-grid col-md-4 pr-md-0">
            <h3 class="margin">15+ years experience</h3>
            <h3 class="black">Valuable Services</h3>
          </div>
          <div class="col-lg-3 w3-agile-grid col-md-4 mt-md-0 mt-4">
            <h3 class="margin green">Experienced Professionals</h3>
            <h3 class="grey">Management Solutions</h3>
          </div>
        </div>
      </div>
    </section>
    <!-- //about -->
    <!-- team -->
    <section class="team py-5">
      <div class="container py-md-3">
        <h3 class="heading mb-lg-5 mb-4">Our Professionals</h3>
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
import jwt_decode from "jwt-decode";
let vue_context;
export default {
  components: {
    MyBanner,
    MyHeader
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
  data() {
    return {
      title: "About Us",
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
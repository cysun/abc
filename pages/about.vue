<template>
  <div>
    <my-header :logged_in="logged_in" :page="page" :roles="roles"/>
    <my-banner :title="title"/>
    <about-sidebar/>
    <section class="team py-5" style="margin-top: -80px">
      <div class="container py-md-3">
        <h3 class="heading mb-lg-5 mb-4">{{$t('our_core_members')}}</h3>
        <p>{{$t('abc_founding_member')}}</p>
        <br>
        <div class="row team-grids">
          <div
            class="col-md-3 col-sm-6 mb-md-0 mb-4 team-grid w3-agile-grid"
          >
            <div class="team-members">
              <div class="team-avatar">
                <img src="~/assets/images/founder_formatted.jpg" class="img-fluid" alt="image">
              </div>
              <div class="team-desc agile-info">
                <h4>{{$t('joanna_doran')}}</h4>
                <span>{{$t('founding_member')}}</span>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 mb-md-0 mb-4 team-grid w3-agile-grid">
            <div class="team-members">
              <div class="team-avatar">
                <img src="~/assets/images/cysun.jpg" class="img-fluid" alt="image">
              </div>
              <div class="team-desc agile-info">
                <h4>{{$t('chengyu_sun')}}</h4>
                <span>{{$t('technical_consultant')}}</span>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 mb-sm-0 mb-4 team-grid w3-agile-grid">
            <div class="team-members">
              <div class="team-avatar">
                <img src="~/assets/images/resercher_formatted.jpg" class="img-fluid" alt="image">
              </div>
              <div class="team-desc agile-info">
                <h4>{{$t('agnes_kar')}}</h4>
                <span>{{$t('program_development')}}</span>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 team-grid w3-agile-grid">
            <div class="team-members">
              <div class="team-avatar">
                <img src="~/assets/images/jv.jpg" class="img-fluid" alt="image">
              </div>
              <div class="team-desc agile-info">
                <h4>{{$t('jennifer_vega')}}</h4>
                <span>{{$t('web_master')}}</span>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 mt-4 team-grid w3-agile-grid">
            <div class="team-members">
              <div class="team-avatar">
                <img
                  src="~/assets/images/website_developer_formatted.jpg"
                  class="img-fluid"
                  alt="image"
                >
              </div>
              <div class="team-desc agile-info">
                <h4>{{$t('victor')}}</h4>
                <span>{{$t('web_developer')}}</span>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 mt-4 team-grid w3-agile-grid">
            <div class="team-members">
              <div class="team-avatar">
                <img src="~/assets/images/hm.jpg" class="img-fluid" alt="image">
              </div>
              <div class="team-desc agile-info">
                <h4>{{$t('hermila')}}</h4>
                <span>{{$t('clinical')}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="about py-5" style="margin-top: -80px">
      <div class="container py-md-3">
        <h3 class="heading mb-md-5 mb-4">{{$t('acknowledgements')}}</h3>
        <div class="row about-grids agile-info">
          <div class="col-lg-12 mb-lg-0 w3-agile-grid mb-5">
            <p>{{$t('abc_is_grateful')}}</p>
            <br>            
            <ul>
              <li>
                <a
                  style="all: unset; cursor: pointer; color: blue"
                  target="_blank"
                  href="http://www.barrioaction.org/index.php?lang=en"
                >{{$t('barrio')}}</a>
              </li>
              <li>
                <a
                  style="all: unset; cursor: pointer; color: blue"
                  target="_blank"
                  href="http://www.elacc.org/"
                >{{$t('east_los')}}</a>
              </li>
              <li>
                <a
                  style="all: unset; cursor: pointer; color: blue"
                  target="_blank"
                  href="http://elcentrodeayuda.org/"
                >{{$t('el_centro')}}</a>
              </li>
              <li>
                <a
                  style="all: unset; cursor: pointer; color: blue"
                  target="_blank"
                  href="https://www.kyccla.org/"
                >{{$t('korea')}}</a>
              </li>
              <li>
                <a
                  style="all: unset; cursor: pointer; color: blue"
                  target="_blank"
                  href="http://www.laccnp.org/"
                >{{$t('la_ccnp')}}</a>
              </li>
              <li>
                <a
                  style="all: unset; cursor: pointer; color: blue"
                  target="_blank"
                  href="https://www.liftcommunities.org/los-angeles/"
                >{{$t('lift_communities')}}</a>
              </li>
              <li>
                <a
                  style="all: unset; cursor: pointer; color: blue"
                  target="_blank"
                  href="http://www.maof.org/"
                >{{$t('mexican_american')}}</a>
              </li>
              <li>
                <a
                  style="all: unset; cursor: pointer; color: blue"
                  target="_blank"
                  href="http://www.neweconomicsforwomen.org/"
                >{{$t('new_economies')}}</a>
              </li>
              <li>
                <a
                  style="all: unset; cursor: pointer; color: blue"
                  target="_blank"
                  href="http://pacela.org/"
                >{{$t('pacific_asian')}}</a>
              </li>
              <li>
                <a
                  style="all: unset; cursor: pointer; color: blue"
                  target="_blank"
                  href="http://www.ypiusa.org/"
                >{{$t('youth_policy')}}</a>
              </li>
            </ul>
            <br>
            <p>{{$t('we_contacted')}}</p>
            <br>
            <br>
            <h4 class="text-left" style="font-size: 50px">Additional Partners</h4>
            <br>
            <br>
            <p>
              <b>{{$t('alliance_for')}}</b>{{$t('the_los_angeles')}}
              <a
                style="all: unset; cursor: pointer; color: blue"
                target="_blank"
                href="https://www.assetbuildingclinic.org/jd-choose-your-next-act"
              >{{$t('la_saves')}}</a>.
            </p>
            <br>
            <p>
              <a
                style="all: unset; cursor: pointer; color: blue"
                target="_blank"
                href="http://www.calstatela.edu/engagement"
              ><b>{{$t('cal_state_la_center')}}</b></a>{{$t('the_centers_high')}}
            </p>
            <br>
            <p>
              <a
                style="all: unset; cursor: pointer; color: blue"
                target="_blank"
                href="https://www.calstatela-fcu.org/"
              ><b>{{$t('cal_state_la')}}</b></a>

              {{$t('the_credit_union')}}
            </p>
            <br>
            <p>
              <b>{{$t('center_for_social_development')}}</b>{{$t('we_also_used')}}<a
                style="all: unset; cursor: pointer; color: blue"
                target="_blank"
                href="https://csd.wustl.edu/OurWork/FinIncl/FinCap-AccessAbilities/Pages/FCAB.aspx"
              >{{$t('financial_capacity')}}</a>{{$t('traning_for_social')}}
            </p>
            <br>
            <p>
              <b>{{$t('consumer_financial')}}</b>{{$t('abc_is_proud')}}<a
                style="all: unset; cursor: pointer; color: blue"
                target="_blank"
                href="https://www.consumerfinance.gov/about-us/blog/sixty-one-organizations-join-2018-your-money-your-goals-cohort/"
              >{{$t('2018')}}</a>{{$t('we_used_cfbp')}}
            </p>
            <br>
            <p>
              <b>{{$t('los_angeles')}}</b>{{$t('we_partnered')}}<a
                style="all: unset; cursor: pointer; color: blue"
                target="_blank"
                href="https://www.lapl.org/newamericans"
              >{{$t('new_americans')}}</a>{{$t('in_four')}}
            </p>
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
  head() {
    return {
      title: "Asset Building Clinic : About Us",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Get information concerning our motives and plans"
        }
      ]
    };
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
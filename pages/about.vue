<template>
  <div>
    <my-header :logged_in="logged_in" :page="page" :roles="roles"/>
    <my-banner :title="title"/>
    <about-sidebar/>
    <section class="team py-5" style="margin-top: -80px">
      <div class="container py-md-3">
        <h3 class="heading mb-lg-5 mb-4">Our core members</h3>
        <p>ABC’s founding member is Joanna [P: ; she/her/hers] K. Doran, PhD, MSW, and assistant professor in the School of Social Work in California State University in Los Angeles. Dr. Doran currently manages ABC and welcomes anyone to join us in expanding ABC’s operations.</p>
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
                <h4>Joanna Doran PhD MSW</h4>
                <span>Founding Member</span>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 mb-md-0 mb-4 team-grid w3-agile-grid">
            <div class="team-members">
              <div class="team-avatar">
                <img src="~/assets/images/cysun.jpg" class="img-fluid" alt="image">
              </div>
              <div class="team-desc agile-info">
                <h4>Chengyu Sun PhD</h4>
                <span>Technical Consultant</span>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 mb-sm-0 mb-4 team-grid w3-agile-grid">
            <div class="team-members">
              <div class="team-avatar">
                <img src="~/assets/images/resercher_formatted.jpg" class="img-fluid" alt="image">
              </div>
              <div class="team-desc agile-info">
                <h4>Agnes Karczewska MS</h4>
                <span>Program Development</span>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 team-grid w3-agile-grid">
            <div class="team-members">
              <div class="team-avatar">
                <img src="~/assets/images/jv.jpg" class="img-fluid" alt="image">
              </div>
              <div class="team-desc agile-info">
                <h4>Jennifer Vega</h4>
                <span>Web Master</span>
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
                <h4>Victor Ahuwanya</h4>
                <span>Web Developer</span>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 mt-4 team-grid w3-agile-grid">
            <div class="team-members">
              <div class="team-avatar">
                <img src="~/assets/images/hm.jpg" class="img-fluid" alt="image">
              </div>
              <div class="team-desc agile-info">
                <h4>Hermila Melero MSW LCSW</h4>
                <span>Clinical Consultant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="about py-5" style="margin-top: -80px">
      <div class="container py-md-3">
        <h3 class="heading mb-md-5 mb-4">Acknowledgements</h3>
        <div class="row about-grids agile-info">
          <div class="col-lg-12 mb-lg-0 w3-agile-grid mb-5">
            <p>ABC is deeply grateful for the support we received from institutions.</p>
            <br>            
            <ul>
              <li>
                <a
                  style="all: unset; cursor: pointer; color: blue"
                  target="_blank"
                  href="http://www.barrioaction.org/index.php?lang=en"
                >Barrio Action Youth & Family Center</a>
              </li>
              <li>
                <a
                  style="all: unset; cursor: pointer; color: blue"
                  target="_blank"
                  href="http://www.elacc.org/"
                >East Los Angeles Community Corporation (ELACC)</a>
              </li>
              <li>
                <a
                  style="all: unset; cursor: pointer; color: blue"
                  target="_blank"
                  href="http://elcentrodeayuda.org/"
                >El Centro de Ayuda (ECDA)</a>
              </li>
              <li>
                <a
                  style="all: unset; cursor: pointer; color: blue"
                  target="_blank"
                  href="https://www.kyccla.org/"
                >Koreatown Youth Community Center (KYCC)</a>
              </li>
              <li>
                <a
                  style="all: unset; cursor: pointer; color: blue"
                  target="_blank"
                  href="http://www.laccnp.org/"
                >LA-CCNP Central City Neighborhood Partners</a>
              </li>
              <li>
                <a
                  style="all: unset; cursor: pointer; color: blue"
                  target="_blank"
                  href="https://www.liftcommunities.org/los-angeles/"
                >LIFT Communities</a>
              </li>
              <li>
                <a
                  style="all: unset; cursor: pointer; color: blue"
                  target="_blank"
                  href="http://www.maof.org/"
                >Mexican American Opportunity Foundation (MAOF)</a>
              </li>
              <li>
                <a
                  style="all: unset; cursor: pointer; color: blue"
                  target="_blank"
                  href="http://www.neweconomicsforwomen.org/"
                >New Economics for Women (NEW)</a>
              </li>
              <li>
                <a
                  style="all: unset; cursor: pointer; color: blue"
                  target="_blank"
                  href="http://pacela.org/"
                >Pacific Asian Consortium in Employment (PACE)</a>
              </li>
              <li>
                <a
                  style="all: unset; cursor: pointer; color: blue"
                  target="_blank"
                  href="http://www.ypiusa.org/"
                >Youth Policy Institute (YPI)</a>
              </li>
            </ul>
            <br>
            <p>We contacted these organizations for partnership because of the programs and services they offer to the community. They responded generously, providing our students with free financial counseling and coaching, savings programs, and supervision during our navigation at VITA sites. We recommend others try their excellent programs.</p>
            <br>
            <br>
            <h4 class="text-left" style="font-size: 50px">Additional Partners</h4>
            <br>
            <br>
            <p>
              <b>Alliance for Economic Inclusion (AEI)</b>. The Los Angeles AEI is an FDIC initiative focused primarily in the City of Los Angeles, California, and is comprised of a broad-base of participating organizations representing financial institutions, community nonprofit organizations, and government agencies. ABC promotes saving pledges through
              <a
                style="all: unset; cursor: pointer; color: blue"
                target="_blank"
                href="https://www.assetbuildingclinic.org/jd-choose-your-next-act"
              >LA Saves</a>.
            </p>
            <br>
            <p>
              <a
                style="all: unset; cursor: pointer; color: blue"
                target="_blank"
                href="http://www.calstatela.edu/engagement"
              ><b>Cal State LA Center for Engagement, Service, and the Public Good</b></a>. The Center’s High Impact Community Engagement Mentorship Project provides stipends to many of the students performing the navigation, and seed funding for the project.
            </p>
            <br>
            <p>
              <a
                style="all: unset; cursor: pointer; color: blue"
                target="_blank"
                href="https://www.calstatela-fcu.org/"
              ><b>Cal State LA Federal Credit Union</b></a>

              . The credit union has supported ABC's Annual Celebrations from the beginning.
              Thank you!
            </p>
            <br>
            <p>
              <b>Center for Social Development (CSD)</b>. We also used the <a
                style="all: unset; cursor: pointer; color: blue"
                target="_blank"
                href="https://csd.wustl.edu/OurWork/FinIncl/FinCap-AccessAbilities/Pages/FCAB.aspx"
              >Financial Capability and Asset Building (FCAB)</a> training for social workers in the Financial Empowerment class. Cal State LA is the first Hispanic-Serving University to partner with CSD FCAB project.
            </p>
            <br>
            <p>
              <b>Consumer Financial Protection Bureau (CFBP)</b>. ABC is proud to have been selected as one of the 61 organizations nation-wide in the <a
                style="all: unset; cursor: pointer; color: blue"
                target="_blank"
                href="https://www.consumerfinance.gov/about-us/blog/sixty-one-organizations-join-2018-your-money-your-goals-cohort/"
              >2018 Training Cohort</a>. We used CFBP’s Your Money, Your Goals Toolkit for Social Service workers to train students in the Financial Empowerment elective.  The CFBP also sent us free materials to promote savings at tax time, and additional training for volunteers. The CFBP provides all these products and services free to the community.
            </p>
            <br>
            <p>
              <b>Los Angeles Public Library (LAPD)</b>. We partnered with LAPD to provide financially empowering services for their <a
                style="all: unset; cursor: pointer; color: blue"
                target="_blank"
                href="https://www.lapl.org/newamericans"
              >New Americans Initiative</a> in four libraries and on Financial Literacy and Financial Planning Days.
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
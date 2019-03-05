<template>
  <div>
    <my-header :logged_in="logged_in" :page="page" :roles="roles"/>
    <my-banner :title="title"/>
    <about-sidebar/>
    <!-- <how-we-work/> -->
    <!-- //about -->
    <!-- team -->
    <section class="about py-5">
      <div class="container py-md-3">
        <h3 class="heading mb-md-5 mb-4">OUR THEORY OF CHANGE</h3>
        <div class="row about-grids agile-info">
          <div class="col-lg-12 mb-lg-0 w3-agile-grid mb-5">
            <p>
              We seek to enhance the
              <a
                style="all: unset; cursor: pointer; color: blue"
                target="_blank"
                href="https://www.consumerfinance.gov/data-research/research-reports/financial-well-being-america/"
              >financial well-being</a> of anyone who wishes to join us, seeking to help others in the process. We do this by promoting the power to act (
              <a
                style="all: unset; cursor: pointer; color: blue"
                target="_blank"
                href="http://www.oxfordscholarship.com/view/10.1093/acprof:oso/9780199755950.001.0001/acprof-9780199755950-chapter-1"
              >financial capability</a>) -- providing opportunities to act (financial inclusion) and providing easy access to the knowledge needed to make an informed decision (financial literacy).
            </p>
            <br>
            <p>Our helping is not an act of charity, but of efficiency:</p>
            <br>
            <ul>
              <li>
                We are
                <a
                  style="all: unset; cursor: pointer; color: blue"
                  target="_blank"
                  href="https://www.ted.com/talks/shawn_achor_the_happy_secret_to_better_work?language=en&utm_campaign=tedspread&utm_medium=referral&utm_source=tedcomshare"
                >most productive when we are happy</a>, and
                <a
                  style="all: unset; cursor: pointer; color: blue"
                  target="_blank"
                  href="https://www.ted.com/talks/michael_norton_how_to_buy_happiness?awesm=on.ted.com_neE&utm_campaign=tedspread&utm_medium=referral&utm_source=tedcomshare"
                >we are much happier when giving than getting</a>. Many of our members appreciate the enhanced feelings of happiness they feel when helping their community members.
              </li>
              <li>The best way to learn something is to teach it, or to otherwise practice it, with others. This is called service learning or active learning, where we learn by acting in the world. We are grateful to members of our communities for allowing us to practice with them, and refer them to experts as needed. They are our most powerful teachers.</li>
              <li>Employers know about this deepening of practice knowledge, and many of our members appreciate the professional experience that comes when they perform services for others.</li>
            </ul>
            <br>
            <p>At the community level, we seek to enhance relationships and safety. Just like we benefit from having a doctor in the house or a neighbor who knows CPR, our communities can benefit when a critical mass of its members are themselves financially empowered, or at least know how to get in touch with experts when needed.</p>
            <br>
            <p>
              At the same time, we keep our eyes out for opportunities to promote
              <a
                style="all: unset; cursor: pointer; color: blue"
                target="_blank"
                href="https://prosperitynow.org/resources/road-zero-wealth"
              >social justice</a>.
            </p>
          </div>
        </div>
      </div>
    </section>

    <div id="myModal" class="modal fade" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header">
            <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
            <h4 class="modal-title">Dr Joanna K. Doran</h4>
          </div>
          <div class="modal-body">
            <p>ABC’s founding member is Joanna [P: ; she/her/hers] K. Doran, PhD, MSW, assistant professor in the School of Social Work in California State University in Los Angeles. She welcomes anyone to join her.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <section class="team py-5">
      <div class="container py-md-3">
        <h3 class="heading mb-lg-5 mb-4">Our core team</h3>
        <div class="row team-grids">
          <div
            style="cursor: pointer"
            data-toggle="modal"
            data-target="#myModal"
            class="col-md-3 col-sm-6 mb-md-0 mb-4 team-grid w3-agile-grid"
          >
            <div class="team-members">
              <div class="team-avatar">
                <img src="~/assets/images/founder_formatted.jpg" class="img-fluid" alt="image">
              </div>
              <div class="team-desc agile-info">
                <h4>Joanna Doran</h4>
                <span>Founding member</span>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 mb-md-0 mb-4 team-grid w3-agile-grid">
            <div class="team-members">
              <div class="team-avatar">
                <img src="images/t2.jpg" class="img-fluid" alt="image">
              </div>
              <div class="team-desc agile-info">
                <h4>Chengyu Sun</h4>
                <span>Technical consultant</span>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 mb-sm-0 mb-4 team-grid w3-agile-grid">
            <div class="team-members">
              <div class="team-avatar">
                <img src="~/assets/images/resercher_formatted.jpg" class="img-fluid" alt="image">
              </div>
              <div class="team-desc agile-info">
                <h4>Agnes Karczewska</h4>
                <span>Content Development Consultant</span>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 team-grid w3-agile-grid">
            <div class="team-members">
              <div class="team-avatar">
                <img src="images/t4.jpg" class="img-fluid" alt="image">
              </div>
              <div class="team-desc agile-info">
                <h4>Jennifer Vega</h4>
                <span>Administrator</span>
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
          <!-- <div class="col-md-3 col-sm-6 mt-4 team-grid w3-agile-grid">
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
          </div>-->
        </div>
      </div>
    </section>

    <section class="about py-5">
      <div class="container py-md-3">
        <!-- <h3 class="heading mb-md-5 mb-4">OUR THEORY OF CHANGE</h3> -->
        <div class="row about-grids agile-info">
          <div class="col-lg-12 mb-lg-0 w3-agile-grid mb-5">
            <p>ABC is deeply grateful for the support we received from institutions.</p>
            <br>
            <p>We contacted these organizations for partnership because of the programs and services they offer to the community. They responded generously, providing our students with free financial counseling and coaching, savings programs, and supervision during our navigation at VITA sites. We recommend others try their excellent programs.</p>
            <br>
            <ul>
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
            <h4 class="text-center">Additional Partners</h4>
            <br>
            <!-- <p>At the community level, we seek to enhance relationships and safety. Just like we benefit from having a doctor in the house or a neighbor who knows CPR, our communities can benefit when a critical mass of its members are themselves financially empowered, or at least know how to get in touch with experts when needed.</p> -->
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
              <b>Cal State LA Center for Engagement, Service, and the Public Good</b>. The Center’s High Impact Community Engagement Mentorship Project provides stipends to many of the students performing the navigation, and seed funding for the project.
            </p>
            <br>
            <p>
              <b>Cal State LA Federal Credit Union</b>

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
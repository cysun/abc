<template>
  <div>
    <my-header/>
    <section class="banner" id="home">
      <div class="callbacks_container">
        <ul class="rslides" id="slider">
          <li>
            <div class="slider-info bg1 w3-agile-grid">
              <div class="bs-slider-overlay">
                <div class="banner-text container agile-info">
                  <h5 class="tag text-center mb-3 text-uppercase">{{$t('financial_well_being')}}</h5>
                  <h1
                    class="movetxt text-center agile-title text-uppercase"
                  >{{$t('enhancing_the_financial')}}</h1>
                  <h2
                    class="movetxt text-center mb-3 agile-title text-uppercase"
                  >{{$t('capability_of_individuals')}}</h2>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <about-sidebar/>
    <section class="about py-5">
      <div class="container py-md-3">
        <h3 class="heading mb-md-5 mb-4">How we Work</h3>
        <div class="row about-grids agile-info">
          <div class="col-lg-12 mb-lg-0 w3-agile-grid mb-5">
            <p>As fellow travelers on the road to financial empowerment, we intimately understand how dealing with finances can prompt severe anxiety… or tremendous boredom. We can also relate to the joy of finally understanding something important about our personal finances and the financial world within which we operate. Not just joy, but also a desire to share this knowledge with others</p>
            <p class="mt-2 mb-3">With the majority of Americans unable to come up with $400 in the event of an emergency and communities of color on the road to a median of zero wealth if we do nothing, there is a strong undercurrent of economic stress that threatens our democracy. How are people supposed to set aside money to get ahead? We believe larger systemic changes can help, such as directing the federal budget for asset building to invest in the majority of Americans, rather than its highest earners. We also believe that there is plenty for us to do while we wait for the larger changes.</p>
            <ul>
              <li>We can take free financial courses or attend public talks</li>
              <li>We can learn about, and take part in, local programs that help people save money and improve their credit</li>
              <li>We can help someone check their credit report or let them know where to get their taxes filed</li>
              <li>We can invite someone to join us, and encourage them to come up with other ways to build financial empowerment</li>
            </ul><br>
            <p>ABC pays people to perform financially empowering acts. We give points for every financially empowered act you document completing, whether for yourself or others. Both giving and receiving are equally important -- you can’t share what you never learned. Paying ourselves is also important. Even the smallest rewards can shape habits. Since you don’t have to spend your points until you want to, you can be sure that whatever reward you choose will be one you love.</p>
          </div>
        </div>
      </div>
    </section>
    <section class="work">
      <div class="work-layer py-5">
        <div class="container py-md-3">
          <!-- <h3 class="heading mb-lg-5 mb-4">{{$t('how_we_work')}}</h3> -->
          <div class="row join agile-info">
            <div class="col-md-3 col-sm-6 steps-reach w3-agile-grid">
              <span class="fab fa-algolia"></span>
              <h4>{{$t('step_1')}}</h4>
              <p>{{$t('step_1_text')}}</p>
              <div class="style-border">
                <img src="images/sty1.png" alt>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 mt-sm-0 mt-5 steps-reach w3-agile-grid">
              <span class="fab fa-asymmetrik"></span>
              <h4>{{$t('step_2')}}</h4>
              <p>{{$t('step_2_text')}}</p>
              <div class="style-border second-border">
                <img src="images/sty2.png" alt>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 mt-md-0 mt-5 pt-md-0 pt-sm-5 steps-reach w3-agile-grid">
              <span class="fas fa-bug" aria-hidden="true"></span>
              <h4>{{$t('step_3')}}</h4>
              <p>{{$t('step_3_text')}}</p>
              <div class="style-border">
                <img src="images/sty1.png" alt>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 mt-md-0 mt-5 pt-md-0 pt-sm-5 steps-reach w3-agile-grid">
              <span class="fas fa-check-square" aria-hidden="true"></span>
              <h4>{{$t('step_4')}}</h4>
              <p>{{$t('step_4_text')}}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="about py-5">
      <div class="container py-md-3">
        <h3 class="heading mb-md-5 mb-4">Who donates these rewards?</h3>
        <div class="row about-grids agile-info">
          <div class="col-lg-12 mb-lg-0 w3-agile-grid mb-5">
            <p>Our members! We believe everyone has knowledge and skills (human capital) or resources with which they can “hook us up" (social capital). Do you know how to cook something others find complicated? Do you have the patience to teach kids the multiplication table? Perhaps you have access to a vacation home? Someone could find any of these to be wonderfully motivating rewards. ABC members receive points for listing a reward, and more points every time they actually provide it to others.</p>
          </div>
        </div>
      </div>
    </section>
    <section class="work">
      <div class="work-layer py-5">
        <div class="container py-md-3">
          <!-- <h3 class="heading mb-lg-5 mb-4">{{$t('how_we_work')}}</h3> -->
          <div class="row join agile-info">
            <div class="col-md-3 col-sm-6 steps-reach w3-agile-grid">
              <span class="fab fa-algolia"></span>
              <h4>{{$t('step_1')}}</h4>
              <p>Get an urge to give rewards</p>
              <div class="style-border">
                <img src="images/sty1.png" alt>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 mt-sm-0 mt-5 steps-reach w3-agile-grid">
              <span class="fab fa-asymmetrik"></span>
              <h4>{{$t('step_2')}}</h4>
              <p>Brainstorm what you can give and how many points you think it should cost</p>
              <div class="style-border second-border">
                <img src="images/sty2.png" alt>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 mt-md-0 mt-5 pt-md-0 pt-sm-5 steps-reach w3-agile-grid">
              <span class="fas fa-bug" aria-hidden="true"></span>
              <h4>{{$t('step_3')}}</h4>
              <p>Contact ABC with your reward every time you have something or ask to be placed on the donator list</p>
              <div class="style-border">
                <img src="images/sty1.png" alt>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 mt-md-0 mt-5 pt-md-0 pt-sm-5 steps-reach w3-agile-grid">
              <span class="fas fa-check-square" aria-hidden="true"></span>
              <h4>{{$t('step_4')}}</h4>
              <p>Receive points for listing the act, and again whenever you or the recipient report exchanging points for rewards</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="services py-5">
      <div class="container agile-info py-md-3">
        <h3 class="heading mb-lg-5 mb-4">{{$t('how_we_can_help_you')}}</h3>
        <div class="row service_grids">
          <div class="col-lg-4 w3-agile-grid">
            <div class="grid">
              <h4 class="mb-3">{{$t('learn_about_programs')}}</h4>
              <p>{{$t('learn_about_programs_text')}}</p>
            </div>
            <div class="grid mt-4">
              <h4 class="mb-3">{{$t('engage_in_financial')}}</h4>
              <p>{{$t('engage_in_financial_text')}}</p>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 my-lg-0 my-5">
            <img src="images/service.jpg" alt class="img-fluid">
          </div>
          <div class="col-lg-4 w3-agile-grid">
            <div class="grid">
              <h4 class="mb-3">{{$t('gain_rewards')}}</h4>
              <p>{{$t('gain_rewards_text')}}</p>
            </div>
            <div class="grid mt-4">
              <h4 class="mb-3">{{$t('help_us')}}</h4>
              <p>{{$t('help_us_text')}}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="service-bottom">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12 p-0 services-bottom">
            <div class="layer agile-info">
              <h3 class="heading mb-lg-5 mb-4">{{$t('company_stats')}}</h3>
              <div class="row">
                <div class="col-sm-6 col-6 agileits_w3layouts_about_counter_left w3-agile-grid">
                  <div class="countericon">
                    <span class="fab fa-algolia" aria-hidden="true"></span>
                  </div>
                  <div class="counterinfo agile-info">
                    <p class="counter">{{hours}}</p>
                    <h3>{{$t('no_of_hours')}}</h3>
                  </div>
                  <div class="clearfix"></div>
                </div>
                <div class="col-sm-6 col-6 agileits_w3layouts_about_counter_left w3-agile-grid">
                  <div class="countericon">
                    <span class="fab fa-asymmetrik" aria-hidden="true"></span>
                  </div>
                  <div class="counterinfo agile-info">
                    <p class="counter">{{data.lives}}</p>
                    <h3>{{$t('no_of_lives')}}</h3>
                  </div>
                  <div class="clearfix"></div>
                </div>
                <div
                  class="col-sm-6 col-6 mt-5 agileits_w3layouts_about_counter_left w3-agile-grid"
                >
                  <div class="countericon">
                    <span class="fas fa-bug" aria-hidden="true"></span>
                  </div>
                  <div class="counterinfo agile-info">
                    <p class="counter">{{data.acts}}</p>
                    <h3>{{$t('no_of_acts')}}</h3>
                  </div>
                  <div class="clearfix"></div>
                </div>
                <div
                  class="col-sm-6 col-6 mt-5 agileits_w3layouts_about_counter_left w3-agile-grid"
                >
                  <div class="countericon">
                    <span class="fas fa-check-square" aria-hidden="true"></span>
                  </div>
                  <div class="counterinfo agile-info">
                    <p class="counter">{{data.rewards}}</p>
                    <h3>{{$t('no_of_rewards')}}</h3>
                  </div>
                  <div class="clearfix"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="quotes py-5 text-center">
      <div class="container py-md-3">
        <div class="quotes-info agile-info-quotes">
          <h3 class="mb-3">{{$t('join_us_today_header')}}</h3>
          <p>{{$t('join_us_today')}}</p>
          <nuxt-link
            class="bt mt-4 mr-2 text-capitalize"
            to="/sign_up"
            role="button"
          >{{$t('sign_up')}}</nuxt-link>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import axios from "~/plugins/axios";
import MyHeader from "~/components/Header.vue";
import AboutSidebar from "~/components/About_sidebar.vue";
export default {
  components: {
    MyHeader,
    AboutSidebar
  },
  async asyncData(context) {
    let data = {};
    if (context.app.$cookies.get("token")) context.redirect("/acts");
    await axios
      .get(`/api/details`)
      .then(function(res) {
        data = res.data;
      })
      .catch(function(err) {
        data.lives = 0;
        data.acts = 0;
        data.rewards = 0;
      });
      console.log(data);
    return { data };
  },
  data() {
    return {
      hours: 0
    };
  },
  async mounted() {
    const start_date = new Date("2019-01-01").getTime();
    const today = new Date().getTime();

    const difference = today - start_date;
    this.hours = Math.round(difference / (60 * 60 * 1000));
  }
};
</script>
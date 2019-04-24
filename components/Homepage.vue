<template>
<div>
  <section class="banner" id="home">
      <div class="callbacks_container">
        <ul class="rslides" id="slider">
          <li>
            <div class="slider-info bg1 w3-agile-grid">
              <div class="bs-slider-overlay">
                <div class="banner-text container agile-info">
                  <h5 class="tag text-center mb-3 text-uppercase">{{$t('enhancing_asset_building')}}</h5>
                  <h1
                    class="movetxt text-center agile-title text-uppercase"
                  >{{$t('promoting_financial_wellbeing')}}</h1>
                  <h2
                    class="movetxt text-center mb-3 agile-title text-uppercase"
                  >{{$t('in_our_communities')}}</h2>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <section class="about py-5" style="margin-bottom: -100px">
      <div class="container py-md-3">
        <div class="row about-grids agile-info">
          <div class="col-lg-6 mb-lg-0 w3-agile-grid mb-5">
            <p>{{$t('homepage_text_1')}}</p>
          </div>
          <div class="col-lg-3 col-md-4 w3-agile-grid pr-md-0">
            <img src="~/assets/images/a.png">
            <p class="text-right">{{$t('image_by_banksy')}}</p>
          </div>
        </div>
      </div>
    </section>
    <section class="about py-5" style="margin-bottom: -100px">
      <div class="container py-md-3">
        <h3 class="heading mb-md-5 mb-4 text-center">{{$t('where_does_the_money_go')}}</h3>
        <h3 class="heading mb-md-5 mb-4 text-center">{{$t('how_are_we_supposed_to_get_ahead')}}</h3>
        <div class="row about-grids agile-info">
          <div class="col-lg-6 mb-lg-0 w3-agile-grid mb-5">
            <p>{{$t('as_we_seek_to_do')}}</p>
            <p
              class="mt-2 mb-3"
            >{{$t('we_would_not_blame')}}</p>
          </div>
          <div class="col-lg-3 col-md-4 w3-agile-grid pr-md-0">
            <img src="~/assets/images/b.png">
            <p class="text-right">{{$t('image_by_banksy')}}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="about py-5">
      <div class="container py-md-3">
        <div class="row about-grids agile-info">
          <div class="col-lg-12 mb-lg-0 w3-agile-grid mb-5">
            <p><b>{{$t('this_is_why_we_make')}}</b></p>
            <br>
            <ul>
              <li>
                {{$t('a_financially_empowering')}}
                <a
                  style="all: unset; cursor: pointer; color: blue"
                  href="https://files.consumerfinance.gov/f/201501_cfpb_digest_financial-well-being.pdf"
                  target="_blank"
                >{{$t('financial_security')}}</a>
              </li>
              <li>{{$t('we_provide')}}</li>
            </ul>
            <br>
            <p><b>{{$t('we_also')}}</b></p>
          </div>
        </div>
      </div>
    </section>
    <section class="work">
      <div class="work-layer py-5">
        <div class="container py-md-3">
          <div class="row join agile-info">
            <div class="col-md-3 col-sm-6 steps-reach w3-agile-grid">
              <span class="fab fa-algolia"></span>
              <h4>{{$t('step_1')}}</h4>
              <p>{{$t('get_an_urge')}}</p>
              <div class="style-border">
                <img src="images/sty1.png" alt>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 mt-sm-0 mt-5 steps-reach w3-agile-grid">
              <span class="fab fa-asymmetrik"></span>
              <h4>{{$t('step_2')}}</h4>
              <p>{{$t('look_through')}}</p>
              <div class="style-border second-border">
                <img src="images/sty2.png" alt>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 mt-md-0 mt-5 pt-md-0 pt-sm-5 steps-reach w3-agile-grid">
              <span class="fas fa-bug" aria-hidden="true"></span>
              <h4>{{$t('step_3')}}</h4>
              <p>{{$t('tell_us_about')}}</p>
              <div class="style-border">
                <img src="images/sty1.png" alt>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 mt-md-0 mt-5 pt-md-0 pt-sm-5 steps-reach w3-agile-grid">
              <span class="fas fa-check-square" aria-hidden="true"></span>
              <h4>{{$t('step_4')}}</h4>
              <p>{{$t('whenever_you_like_or_need')}}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- <how-we-work/> -->
    <section class="about py-5">
      <div class="container py-md-3">
        <h3 class="heading mb-md-5 mb-4 text-center">{{$t('where_do_we_get')}}</h3>
        <div class="row about-grids agile-info">
          <div class="col-lg-12 mb-lg-0 w3-agile-grid mb-5">
            <p>{{$t('our_members')}}</p>
            <br>
            <p>
              {{$t('what_could_you_offer')}}
              <a
                style="all: unset; cursor: pointer; color: blue"
                target="_blank"
                href="https://youtu.be/9AvWs2X-bEA"
              >{{$t('sparks_joy')}}</a>{{$t('but_others')}}
            </p>
          </div>
        </div>
      </div>
    </section>
    <section class="work">
      <div class="work-layer py-5">
        <div class="container py-md-3">
          <div class="row join agile-info">
            <div class="col-md-3 col-sm-6 steps-reach w3-agile-grid">
              <span class="fab fa-algolia"></span>
              <h4>{{$t('step_1')}}</h4>
              <p>{{$t('get_an_urge_to_give')}}</p>
              <div class="style-border">
                <img src="images/sty1.png" alt>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 mt-sm-0 mt-5 steps-reach w3-agile-grid">
              <span class="fab fa-asymmetrik"></span>
              <h4>{{$t('step_2')}}</h4>
              <p>{{$t('follow_instructions')}}</p>
              <div class="style-border second-border">
                <img src="images/sty2.png" alt>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 mt-md-0 mt-5 pt-md-0 pt-sm-5 steps-reach w3-agile-grid">
              <span class="fas fa-bug" aria-hidden="true"></span>
              <h4>{{$t('step_3')}}</h4>
              <p>{{$t('receive_points')}}</p>
              <div class="style-border">
                <img src="images/sty1.png" alt>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 mt-md-0 mt-5 pt-md-0 pt-sm-5 steps-reach w3-agile-grid">
              <span class="fas fa-check-square" aria-hidden="true"></span>
              <h4>{{$t('step_4')}}</h4>
              <p>{{$t('whenever_you_like')}}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="quotes py-5 text-center">
      <div class="container py-md-3">
        <div class="quotes-info agile-info-quotes">
          <h3 class="mb-3">{{$t('join_us')}}</h3>
          <p>{{$t('become_a_member_of_abc')}}</p>
          <br>
          <p>{{$t('we_do_not_judge')}}</p>
          <nuxt-link
            class="bt mt-4 mr-2 text-capitalize"
            to="/sign_up"
            role="button"
          >{{$t('sign_up')}}</nuxt-link>
          <div class="text-left">
            <hr>
            <p>[1]
              <a
                style="all: unset; cursor: pointer; color: blue"
                target="_blank"
                href="https://www.federalreserve.gov/publications/files/2017-report-economic-well-being-us-households-201805.pdf"
              >https://www.federalreserve.gov/publications/files/2017-report-economic-well-being-us-households-201805.pdf</a>
            </p>
            <p>[2]
              <a
                style="all: unset; cursor: pointer; color: blue"
                target="_blank"
                href="https://ips-dc.org/report-the-road-to-zero-wealth/"
              >https://ips-dc.org/report-the-road-to-zero-wealth/</a>
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="service-bottom">
      <div class="container-fluid">
        <div class="row">
          <div
            class="col-lg-12 p-0 services-bottom"
            style="background: url(../images/banner1.jpg) no-repeat 0px 0px;
    background-size: cover;"
          >
            <div class="layer agile-info">
              <h3 class="heading mb-lg-5 mb-4">{{$t('out_stats')}}</h3>
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
                    <p class="counter">{{lives}}</p>
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
                    <p class="counter">{{acts}}</p>
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
                    <p class="counter">{{rewards}}</p>
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
    </div>
</template>

<script>
import axios from "~/plugins/axios";
import MyHeader from "~/components/Header.vue";
import Homepage from "~/components/Homepage.vue";
import AboutSidebar from "~/components/About_sidebar.vue";
import HowWeWork from "~/components/How_we_work.vue";
export default {
  components: {
    MyHeader,
    AboutSidebar,
    HowWeWork,
    Homepage
  },
  created: async function() {
    const context = this;
    let data = {};
    await axios
      .get(`/api/details`)
      .then(function(res) {
        data = res.data;
        context.lives = data.lives;
        context.acts = data.acts;
        context.rewards = data.rewards;
      })
      .catch(function(err) {
        this.lives = 0;
        this.acts = 0;
        this.rewards = 0;
      });
    console.log(data);
    return { data };
  },
  data() {
    return {
      hours: 0,
      lives: 0,
      acts: 0,
      rewards: 0
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
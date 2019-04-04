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
            <p>With the nearly half of Americans (46%) unable to come up with $400 in the event of an emergency[1] and communities of color on the road to a median of zero wealth if we maintain status quo [2], it is imperative we do something. But what?</p>
          </div>
          <div class="col-lg-3 col-md-4 w3-agile-grid pr-md-0">
            <img src="~/assets/images/a.png">
            <p class="text-right">Image by Banksy</p>
          </div>
        </div>
      </div>
    </section>
    <section class="about py-5" style="margin-bottom: -100px">
      <div class="container py-md-3">
        <h3 class="heading mb-md-5 mb-4 text-center">Where does the money go?</h3>
        <h3 class="heading mb-md-5 mb-4 text-center">How are we supposed to get ahead?</h3>
        <div class="row about-grids agile-info">
          <div class="col-lg-6 mb-lg-0 w3-agile-grid mb-5">
            <p>As we seek to do more with less, the increasing complexity of our financial world can be daunting, if not overwhelming. What is a prepaid debit card, and does it matter it is not issued by a bank? Does overdraft protection really protect you from overdrafts? Is a car title loan a good option in a financial pinch? Are CDs a good investment?</p>
            <p
              class="mt-2 mb-3"
            >We would not blame you if just thinking about your finances causes you anxiety, irritation… or tremendous boredom.</p>
          </div>
          <div class="col-lg-3 col-md-4 w3-agile-grid pr-md-0">
            <img src="~/assets/images/b.png">
            <p class="text-right">Image by Banksy</p>
          </div>
        </div>
      </div>
    </section>

    <section class="about py-5">
      <div class="container py-md-3">
        <div class="row about-grids agile-info">
          <div class="col-lg-12 mb-lg-0 w3-agile-grid mb-5">
            <p><b>This is why we make it easy for anyone to complete financially empowering acts, whether for themselves or by helping another person.</b></p>
            <br>
            <ul>
              <li>
                A financially empowering act is something that could help you or others have
                <a
                  style="all: unset; cursor: pointer; color: blue"
                  href="https://files.consumerfinance.gov/f/201501_cfpb_digest_financial-well-being.pdf"
                  target="_blank"
                >financial security and financial freedom of choice, in the present and in the future</a>
              </li>
              <li>We provide you with clear instructions for checking credit reports, enhancing financial education, and exploring safe financial products designed to reduce debt, grow savings, and buy assets. Most people do not know such services exist, and this is why we make it easy for you to access them.</li>
            </ul>
            <br>
            <p><b>We also found a way to reward each other for financially empowering ourselves and our communities. Each act is worth points, which can be redeemed for rewards.</b></p>
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
              <p>Get an urge to act</p>
              <div class="style-border">
                <img src="images/sty1.png" alt>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 mt-sm-0 mt-5 steps-reach w3-agile-grid">
              <span class="fab fa-asymmetrik"></span>
              <h4>{{$t('step_2')}}</h4>
              <p>Look through our menu to choose and complete an act that is most useful to you right now</p>
              <div class="style-border second-border">
                <img src="images/sty2.png" alt>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 mt-md-0 mt-5 pt-md-0 pt-sm-5 steps-reach w3-agile-grid">
              <span class="fas fa-bug" aria-hidden="true"></span>
              <h4>{{$t('step_3')}}</h4>
              <p>Tell us about your act to receive points</p>
              <div class="style-border">
                <img src="images/sty1.png" alt>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 mt-md-0 mt-5 pt-md-0 pt-sm-5 steps-reach w3-agile-grid">
              <span class="fas fa-check-square" aria-hidden="true"></span>
              <h4>{{$t('step_4')}}</h4>
              <p>Whenever you like or need, spend your points on rewards</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- <how-we-work/> -->
    <section class="about py-5">
      <div class="container py-md-3">
        <h3 class="heading mb-md-5 mb-4 text-center">Where do we get the rewards?</h3>
        <div class="row about-grids agile-info">
          <div class="col-lg-12 mb-lg-0 w3-agile-grid mb-5">
            <p>Our members! Everyone either knows something or has something that someone else would need or love. We make it easy for you to share.</p>
            <br>
            <p>
              What could you offer? Perhaps you know how to cook something others find complicated? Do you have the patience to teach kids the multiplication table? Maybe you have an object that no longer
              <a
                style="all: unset; cursor: pointer; color: blue"
                target="_blank"
                href="https://youtu.be/9AvWs2X-bEA"
              >sparks joy</a>, but others might find valuable? Someone should find any of these rewards to be wonderfully motivating! This is why we give you points for offering and providing rewards.
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
              <p>Get an urge to give</p>
              <div class="style-border">
                <img src="images/sty1.png" alt>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 mt-sm-0 mt-5 steps-reach w3-agile-grid">
              <span class="fab fa-asymmetrik"></span>
              <h4>{{$t('step_2')}}</h4>
              <p>Follow instructions for offering a reward, from our Acts menu</p>
              <div class="style-border second-border">
                <img src="images/sty2.png" alt>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 mt-md-0 mt-5 pt-md-0 pt-sm-5 steps-reach w3-agile-grid">
              <span class="fas fa-bug" aria-hidden="true"></span>
              <h4>{{$t('step_3')}}</h4>
              <p>Receive points when reward posts, and every time someone uses it</p>
              <div class="style-border">
                <img src="images/sty1.png" alt>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 mt-md-0 mt-5 pt-md-0 pt-sm-5 steps-reach w3-agile-grid">
              <span class="fas fa-check-square" aria-hidden="true"></span>
              <h4>{{$t('step_4')}}</h4>
              <p>Whenever you like or need, spend your points on rewards</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="quotes py-5 text-center">
      <div class="container py-md-3">
        <div class="quotes-info agile-info-quotes">
          <h3 class="mb-3">Join Us!</h3>
          <p>Become a member of ABC and join us in enhancing financial wellbeing for us all.</p>
          <br>
          <p>We do not judge and we do not give advice. Membership is confidential and free.</p>
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
              <h3 class="heading mb-lg-5 mb-4">Our Stats</h3>
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
  </div>
</template>
<script>
import axios from "~/plugins/axios";
import MyHeader from "~/components/Header.vue";
import AboutSidebar from "~/components/About_sidebar.vue";
import HowWeWork from "~/components/How_we_work.vue";
export default {
  components: {
    MyHeader,
    AboutSidebar,
    HowWeWork
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
  head() {
    return {
      title: "Asset Building Clinic : Homepage",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "View details about our asset building clinic"
        }
      ]
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
<template>
  <div>
    <div class="page-container">
      <div class="left-content">
        <div class="mother-grid-inner">
          <my-header/>
          <!-- script-for sticky-nav -->
          <!-- /script-for sticky-nav -->
          <!--inner block start here-->
          <div class="inner-block">
            <!--market updates updates-->
            <div class="market-updates">
              <div class="col-md-4 market-update-gd">
                <nuxt-link to="/admin/users">
                  <div class="market-update-block clr-block-1">
                    <div class="col-md-8 market-update-left">
                      <h3>{{data.total_users}}</h3>
                      <h4>{{$t('total_users')}}</h4>
                      <!-- <p>Other hand, we denounce</p> -->
                    </div>
                    <div class="col-md-4 market-update-right">
                      <i class="fa fa-users fa-5x" style="color: white"></i>
                    </div>
                    <div class="clearfix"></div>
                  </div>
                </nuxt-link>
              </div>
              <div class="col-md-4 market-update-gd">
                <nuxt-link to="/admin/acts">
                  <div class="market-update-block clr-block-2">
                    <div class="col-md-8 market-update-left">
                      <h3>{{data.total_acts}}</h3>
                      <h4>{{$t('total_acts')}}</h4>
                      <!-- <p>Other hand, we denounce</p> -->
                    </div>
                    <div class="col-md-4 market-update-right">
                      <i class="fa fa-bars fa-5x" style="color: white"></i>
                    </div>
                    <div class="clearfix"></div>
                  </div>
                </nuxt-link>
              </div>
              <div class="col-md-4 market-update-gd">
                <nuxt-link to="/admin/rewards">
                  <div class="market-update-block clr-block-3">
                    <div class="col-md-8 market-update-left">
                      <h3>{{data.total_rewards}}</h3>
                      <h4>{{$t('total_rewards')}}</h4>
                      <!-- <p>Other hand, we denounce</p> -->
                    </div>
                    <div class="col-md-4 market-update-right">
                      <i class="fa fa-gift fa-5x" style="color: white"></i>
                    </div>
                    <div class="clearfix"></div>
                  </div>
                </nuxt-link>
              </div>
              <div class="clearfix"></div>
            </div>
            <!--market updates end here-->
            <!--mainpage chit-chating-->
            <div class="chit-chat-layer1">
              <div class="col-md-6 chit-chat-layer1-left">
                <div class="work-progres">
                  <div class="chit-chat-heading">{{$t('recent_registrations')}}</div>
                  <div class="table-responsive">
                    <table class="table table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>{{$t('first_name')}}</th>
                          <th>{{$t('last_name')}}</th>
                          <th>{{$t('verified')}}</th>
                          <th>{{$t('registration_time')}}</th>
                          <th>{{$t('actions')}}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(user, index) in data.users">
                          <td>{{index + 1}}</td>
                          <td>{{user.first_name}}</td>
                          <td>{{user.last_name}}</td>
                          <td>
                            <span class="label" :class="user.enabled ? 'label-success' : 'label-danger'">{{user.enabled}}</span>
                          </td>
                          <td>
                            <span class="badge badge-info">{{user.creation_date}}</span>
                          </td>
                          <td>
                            <nuxt-link :to="'/user/' + user._id + '/edit'">
                              <button class="btn btn-primary">{{$t('edit')}}</button>
                            </nuxt-link>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div class="col-md-6 chit-chat-layer1-left">
                <div class="work-progres">
                  <div class="chit-chat-heading">{{$t('recent_acts')}}</div>
                  <div class="table-responsive">
                    <table class="table table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>{{$t('poster_name')}}</th>
                          <th>{{$t('act_name')}}</th>
                          <th>{{$t('verified')}}</th>
                          <th>{{$t('creation_date')}}</th>
                          <!-- <th>{{$t('actions')}}</th> -->
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(act, index) in data.acts">
                          <td>{{index + 1}}</td>
                          <td>{{act.act_provider.first_name}} {{act.act_provider.last_name}}</td>
                          <td>{{act.name}}</td>
                          <td>
                            <span class="label" :class="act.enabled.state ? 'label-success' : 'label-danger'">{{act.enabled.state}}</span>
                          </td>
                          <td>
                            <span class="badge badge-info">{{act.creation_date}}</span>
                          </td>
                          <!-- <td>
                            <nuxt-link :to="'/admin/acts/' + act._id + '/edit'">
                              <button class="btn btn-primary">{{$t('edit')}}</button>
                            </nuxt-link>
                          </td> -->
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div class="clearfix"></div>
            </div>
            <div class="col-md-6 chit-chat-layer1-left">
              <div class="work-progres">
                <div class="chit-chat-heading">{{$t('recent_rewards')}}</div>
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>{{$t('poster_name')}}</th>
                        <th>{{$t('reward_name')}}</th>
                        <th>{{$t('verified')}}</th>
                        <th>{{$t('creation_date')}}</th>
                        <!-- <th>{{$t('actions')}}</th> -->
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(reward, index) in data.rewards">
                        <td>{{index + 1}}</td>
                        <td>{{reward.reward_provider.first_name}} {{reward.reward_provider.last_name}}</td>
                        <td>{{reward.name}}</td>
                        <td>
                          <span class="label" :class="reward.enabled ? 'label-success' : 'label-danger'">{{reward.enabled}}</span>
                        </td>
                        <td>
                          <span class="badge badge-info">{{reward.creation_date}}</span>
                        </td>
                        <!-- <td>
                          <nuxt-link :to="'/admin/rewards/' + reward._id + '/edit'">
                            <button class="btn btn-primary">{{$t('edit')}}</button>
                          </nuxt-link>
                        </td> -->
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!--climate start here-->
            <div class="climate">
              <div class="col-md-4 climate-grids">
                <div class="climate-grid3">
                  <div class="popular-brand" v-if="data.best_act[0]">
                    <div class="col-md-6 popular-bran-left">
                      <h3>{{$t('best_act_of_the_month')}}</h3>
                      <h4>{{data.best_act[0].act[0].name}}</h4>
                      <p class="truncate_text_3_lines" v-html="data.best_act[0].act[0].description"></p>
                    </div>
                    <div class="col-md-6 popular-bran-right">
                      <h3>{{data.best_act[0].count}}</h3>
                    </div>
                    <div class="clearfix"></div>
                  </div>
                  <div class="popular-follow" v-if="data.best_reward[0]">
                    <div class="col-md-6 popular-follo-left">
                      <h4 style="color: #FFBD33">{{$t('best_reward_of_this_month')}}</h4>
                      <p style="color: #DBFF33">{{data.best_reward[0].reward[0].name}}</p>
                      <p class="truncate_text_3_lines" v-html="data.best_reward[0].reward[0].description"
                      ></p>
                    </div>
                    <div class="col-md-6 popular-follo-right">
                      <h4>{{$t('amount_collected')}}</h4>
                      <h5>{{data.best_reward[0].count}}</h5>
                    </div>
                    <div class="clearfix"></div>
                  </div>
                </div>
              </div>
              <div class="clearfix"></div>
            </div>
            <!--climate end here-->
          </div>
          <!--inner block end here-->
          <!--copy rights start here-->
          <my-footer/>
          <!--COPY rights end here-->
        </div>
      </div>
      <my-sidebar/>
      <div class="clearfix"></div>
    </div>
    <!--slide bar menu end here-->
  </div>
</template>
<script>
import axios from "~/plugins/axios";
import MySidebar from "~/components/Admin_Sidebar.vue";
import MyHeader from "~/components/Admin_Header.vue";
import MyFooter from "~/components/Admin_Footer.vue";

export default {
  layout: "admin",
  components: {
    MySidebar,
    MyHeader,
    MyFooter
  },
  async asyncData(context) {
    const token = context.app.$cookies.get("token");
    const refresh_token = context.app.$cookies.get("refresh_token");

    if (!context.query.sort) context.query.sort = "";
    if (!context.query.search) context.query.search = "";
    if (!context.query.order) context.query.order = "";
    if (!context.query.page) context.query.page = 1;
    if (!context.query.type) context.query.type = "AVAILABLE";

    // console.log(context.app.$cookies.getAll());
    // console.log(context.req.headers.cookie);
    let data;
    // console.log(context)
    await axios
      .get(`/api/admin`, {
        headers: { Cookie: `token=${token}; refresh_token=${refresh_token};` }
      })
      .then(function(res) {
        // console.log("I ran");
        // //Redirect to verification page
        // vue_context.$nuxt.$loading.finish();
        // vue_context.$router.push({
        //   path: "/verify_account"
        // });
        // console.log(res);
        data = res.data;
        //Loop through data and format date
        // data.acts.forEach(element => {
        //   if (element.__t == "Event") {
        //     element.formated_start_time = moment(element.start_time).format(
        //       "MMMM Do YYYY, h:mm:ss a"
        //     );
        //     element.formated_end_time = moment(element.end_time).format(
        //       "MMMM Do YYYY, h:mm:ss a"
        //     );

        //     element.start_time = element.start_time.substring(0, element.start_time.length - 8);
        //     element.end_time = element.end_time.substring(0, element.end_time.length - 8);
        //   }
        // });
      })
      .catch(function(err) {
        if (err.response.status == 401) {
          context.redirect("/logout");
        }

        // console.log(context.app.$cookies.getAll());
        // console.log(err.response.data.message);
        // if (err.response.status == 400) {
        //   context.redirect("/logout");
        // }
        // console.log(err.response.status);
        // vue_context.$nuxt.$loading.finish();
        // if (err.response) vue_context.error = err.response.data.message;
      });
    //If user is not logged in
    //Delete cookies and redirect to main page
    //If user is logged in, redirect to main page
    //Place acts in array of acts
    // context.redirect("/");
    //getCook("connect.sid", req.headers.cookie);
    // console.log(context.req.headers.cookie);
    //Check if user is logged in
    //If so, redirect to main page
    // if (process.server) {
    //   if (getCookie("token", context.req.headers.cookie)) {
    //     context.redirect("/");
    //   }
    // }
    // if (process.server)

    // console.log(context.query.sort);
    // context.query.sort = "Hello";
    // console.log(context.query);
    // context.query.sort = "Hello";
    return { data };
  },

  mounted() {
    //Sticky header code
    // $(document).ready(function() {
    //   var navoffeset = $(".header-main").offset().top;
    //   $(window).scroll(function() {
    //     var scrollpos = $(window).scrollTop();
    //     if (scrollpos >= navoffeset) {
    //       $(".header-main").addClass("fixed");
    //     } else {
    //       $(".header-main").removeClass("fixed");
    //     }
    //   });
    // });

    var toggle = true;

    $(".sidebar-icon").click(function() {
      if (toggle) {
        $(".page-container")
          .addClass("sidebar-collapsed")
          .removeClass("sidebar-collapsed-back");
        $("#menu span").css({ position: "absolute" });
      } else {
        $(".page-container")
          .removeClass("sidebar-collapsed")
          .addClass("sidebar-collapsed-back");
        setTimeout(function() {
          $("#menu span").css({ position: "relative" });
        }, 400);
      }
      toggle = !toggle;
    });
  }
};
</script>
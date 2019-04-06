<template>
  <div>
    <my-header :logged_in="logged_in" :page="page" :roles="data.roles"/>
    <my-banner :title="title"/>
    <section class="banner-bottom-w3ls-agileinfo py-5">
      <!--/blog-->
      <div class="container py-md-3">
        <!-- <h2 class="heading mb-lg-5 mb-4">title</h2> -->
        <div class="row inner-sec-wthree-agileits">
          <div class="col-lg-12 blog-sp">
            <article style="margin-bottom: 10px" class="blog-x row">
              <div v-if="data.act.image" class="blog-img w3-agile-grid">
                <img :src="`/api/acts/${data.act._id}/image`" alt class="img-fluid">
              </div>
              <div class="blog_info">
                <h5>
                  <div class="row">
                    <a class="col-md-9" tabindex="-1" v-if="!data.edit">{{data.act.name}}</a>
                  </div>
                  <input
                    id="act_name"
                    v-if="data.edit"
                    type="text"
                    class="form-control"
                    :value="data.act.name"
                  >
                </h5>
                <p>
                  {{$t('by')}} {{data.act.act_provider.first_name}} {{data.act.act_provider.last_name}}
                  <a
                    href="#"
                    class="user-blog"
                  ></a>
                </p>

                <div>
                  <p v-html="data.act.description"></p>
                </div>
                <div v-if="data.act.__t == 'Event'">
                  <div>
                    <span
                      v-if="!data.edit"
                      class="badge badge-light"
                    >{{$t('start_time')}}: {{data.act.formated_start_time}}</span>
                    <div v-if="data.edit">
                      <div
                        class="controls input-append date form_datetime"
                        data-date-format="yyyy-mm-ddThh:ii"
                        data-link-field="dtp_input1"
                      >
                        <input
                          size="16"
                          :placeholder="$t('start_time')"
                          type="text"
                          readonly
                          class="form-control"
                          :value="data.act.start_time"
                          id="act_start_time"
                        >
                        <span class="add-on">
                          <i class="icon-remove"></i>
                        </span>
                        <span class="add-on">
                          <i class="icon-th"></i>
                        </span>
                      </div>
                      <input type="hidden" id="dtp_input1" value>
                    </div>
                  </div>
                  <div>
                    <span
                      v-if="!data.edit"
                      class="badge badge-light"
                    >{{$t('end_time')}}: {{data.act.formated_end_time}}</span>
                    <div v-if="data.edit">
                      <div
                        class="controls input-append date form_datetime"
                        data-date-format="yyyy-mm-ddThh:ii"
                        data-link-field="dtp_input1"
                      >
                        <input
                          size="16"
                          :placeholder="$t('end_time')"
                          type="text"
                          readonly
                          class="form-control"
                          :value="data.act.end_time"
                          id="act_end_time"
                        >
                        <span class="add-on">
                          <i class="icon-remove"></i>
                        </span>
                        <span class="add-on">
                          <i class="icon-th"></i>
                        </span>
                      </div>
                      <input type="hidden" id="dtp_input1" value>
                      <script>
  $(".form_datetime").datetimepicker({
    weekStart: 1,
    todayBtn: 1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    forceParse: 0,
    showMeridian: 1
  });
                      </script>
                    </div>
                  </div>
                </div>
                <br>
                <ul class="blog_list">
                  <li>
                    <span :title="$t('Reward_points')" class="fa fa-credit-card" aria-hidden="true"></span>
                    <span v-if="!data.edit">{{data.act.reward_points}}</span>
                    <i>|</i>
                  </li>
                  <li v-if="data.act.amount > 0">
                    <span title="Amount available" class="fa fa-clone" aria-hidden="true"></span>
                    <span v-if="!data.edit">{{data.act.amount}}</span>
                    <i>|</i>
                  </li>
                  <li>
                    <span
                      :title="$t('popularity')"
                      class="fa fa-angle-double-down"
                      aria-hidden="true"
                    ></span>
                    <span>{{data.act.total_number_of_clicks}}</span>
                    <i>|</i>
                  </li>
                  <li>
                    <span :title="$t('favorites')" class="fa fa-user" aria-hidden="true"></span>
                    <span>{{data.act.total_number_of_completions}}</span>
                  </li>
                </ul>
                <div v-if="!data.edit">
                  <span
                    v-for="tag in data.act.tags"
                    style="margin-right: 5px"
                    class="badge badge-secondary"
                  >{{tag.name}}</span>
                </div>
              </div>
              <div class="clearfix"></div>
            </article>
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
import scrollToElement from "scroll-to-element";
import moment from "moment";
let vue_context;

export default {
  components: {
    MyBanner,
    MyHeader
  },
  created: function() {
    vue_context = this;
  },
  async asyncData(context) {
    let data;
    await axios
      .get(`/api/${context.params.id}/view_act`)
      .then(function(res) {
        data = res.data;
        //Loop through data and format date
        if (data.act.__t == "Event") {
          data.act.formated_start_time = moment(data.act.start_time).format(
            "MMMM Do YYYY, h:mm:ss a"
          );
          data.act.formated_end_time = moment(data.act.end_time).format(
            "MMMM Do YYYY, h:mm:ss a"
          );

          data.act.start_time = data.act.start_time.substring(
            0,
            data.act.start_time.length - 8
          );
          data.act.end_time = data.act.end_time.substring(
            0,
            data.act.end_time.length - 8
          );
        }
      })
      .catch(function(err) {
        if (err) {
          console.log(err)
          // context.redirect("/logout");
          // return;
        }
      });
    
    return { data };
  },
  head() {
    return {
      title: "Asset Building Clinic : View act",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "View more details about your act"
        }
      ]
    };
  },
  data() {
    return {
      title: "Act Details",
      error: "",
      status_message: "",
      status_state: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      files: null,
      logged_in: false,
      page: "view_acts",
      deleted_acts: {},
      upload_type: "act",
      add_act: {
        name: "",
        description: "",
        reward_points: "",
        start_time: "",
        end_time: ""
      },
      reward_rating: 0,
      reward_comments: "",
    };
  },
  methods: {
  }
};
</script>

<style scoped>
form#smileys input[type="radio"] {
  -webkit-appearance: none;
  width: 30px;
  height: 30px;
  border: none;
  cursor: pointer;
  transition: border 0.2s ease;
  -webkit-filter: grayscale(100%);
          filter: grayscale(100%);
  margin: 0 0px;
  transition: all 0.2s ease;
}
form#smileys input[type="radio"]:hover, form#smileys input[type="radio"]:checked {
  -webkit-filter: grayscale(0);
          filter: grayscale(0);
}
form#smileys input[type="radio"]:focus {
  outline: 0;
}
form#smileys input[type="radio"].devil {
  background: url("~assets/images/smileys/devil.svg") center;
  background-size: cover;
}
form#smileys input[type="radio"].sad {
  background: url("~assets/images/smileys/sad.svg") center;
  background-size: cover;
}
form#smileys input[type="radio"].neutral {
  background: url("~assets/images/smileys/meh.svg") center;
  background-size: cover;
}
form#smileys input[type="radio"].happy {
  background: url("~assets/images/smileys/smile.svg") center;
  background-size: cover;
}
form#smileys input[type="radio"].love {
  background: url("~assets/images/smileys/heart.svg") center;
  background-size: cover;
}



.mtt {
  position: fixed;
  bottom: 10px;
  right: 20px;
  color: #999;
  text-decoration: none;
}
.mtt span {
  color: #e74c3c;
}
.mtt:hover {
  color: #666;
}
.mtt:hover span {
  color: #c0392b;
}
</style>
<template>
  <div>
    <my-header :logged_in="logged_in" :page="page" :roles="{}"/>
    <my-banner :title="title"/>
    <section class="banner-bottom-w3ls-agileinfo py-5">
      <!--/blog-->
      <div class="container py-md-3">
        <div class="form-inline justify-content-center">
          <div class="form-group" style="margin-right: 10px">
            <span style="margin-right: 10px">
              <input
                type="text"
                name="search"
                v-model="query.search"
                class="form-control"
                :placeholder="$t('search')"
                @keyup.enter="search"
              >
              <select class="form-control" name="sort" v-model="query.sort">
                <option value disabled :selected="!query.sort">{{$t('sort_by')}}</option>
                <option
                  value="creation_date"
                  :selected="query.sort == 'creation_date'"
                >{{$t('date')}}</option>
                <option
                  value="total_number_of_completions"
                  :selected="query.sort == 'total_number_of_completions'"
                >{{$t('favorites')}}</option>
                <option value="name" :selected="query.sort == 'name'">{{$t('name')}}</option>
                <option
                  value="total_number_of_clicks"
                  :selected="query.sort == 'total_number_of_clicks'"
                >{{$t('popularity')}}</option>
                <option
                  value="reward_points"
                  :selected="query.sort == 'reward_points'"
                >{{$t('Reward_points')}}</option>
              </select>
              
              <select class="form-control" name="order" v-model="query.order">
                <option value disabled :selected="!query.order">{{$t('sort_direction')}}</option>
                <option value="1" :selected="query.order == '1'">{{$t('ascending')}}</option>
                <option value="-1" :selected="query.order == '-1'">{{$t('descending')}}</option>
              </select>
            </span>
            <button
              type="submit"
              @click="search"
              class="btn btn-primary"
              style="margin-right: 10px"
            >{{$t('search')}}</button>
            <button @click="reset" type="button" class="btn btn-danger">{{$t('reset')}}</button>
          </div>
        </div>
        <br>

        <br>
        <div class="row inner-sec-wthree-agileits">
          <div class="col-lg-8 blog-sp" ref="acts_come_here">
            <article
              style="margin-bottom: 10px"
              class="blog-x row"
              v-for="(act, index) in data.acts"
            >
              <div class="blog-img w3-agile-grid">
                <nuxt-link :to="`/acts/${act._id}/view`" v-if="act.image && data.type != 'COMPLETED'">
                  <img :src="`/api/acts/${act._id}/image`" alt class="img-fluid">
                </nuxt-link>
              </div>
              <div class="blog_info">
                <h5>
                  <nuxt-link v-if="!act.edit" :to="{path: 'acts/' + act._id + '/view'}">{{act.name}}</nuxt-link>
                  <input
                    :id="'act_name' + index"
                    v-if="act.edit"
                    type="text"
                    class="form-control"
                    :value="act.name"
                  >
                </h5>
                <p>
                  {{$t('by')}} {{act.act_provider.first_name}} {{act.act_provider.last_name}}
                  <a
                    href="#"
                    class="user-blog"
                  ></a>
                </p>

                <div><p class="truncate_text_3_lines" v-html="act.description"></p></div>
                <textarea
                  :id="'act_description' + index"
                  v-if="act.edit"
                  class="form-control"
                  rows="4"
                  :value="act.description"
                ></textarea>
                <div v-if="act.__t == 'Event'">
                  <div>
                    <span
                      v-if="!act.edit"
                      class="badge badge-light"
                    >{{$t('start_time')}}: {{act.formated_start_time}}</span>
                    <div v-if="act.edit">
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
                          :value="act.start_time"
                          :id="'act_start_time' + index"
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
                      v-if="!act.edit"
                      class="badge badge-light"
                    >{{$t('end_time')}}: {{act.formated_end_time}}</span>
                    <div v-if="act.edit">
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
                          :value="act.end_time"
                          :id="'act_end_time' + index"
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
                <div class="float-right"><nuxt-link v-if="data.type != 'COMPLETE'" :to="`/acts/${act._id}/view`"><button class="btn btn-primary">More details</button></nuxt-link></div>
                <div class="clearfix"></div>
                <ul class="blog_list">
                  <li>
                    <span :title="$t('Reward_points')" class="fa fa-credit-card" aria-hidden="true"></span>
                    <span v-if="!act.edit">{{act.reward_points}}</span>
                    <input
                      :id="'act_reward_points' + index"
                      v-if="act.edit"
                      type="number"
                      style="width: 40px"
                      :value="act.reward_points"
                    >
                    <i>|</i>
                  </li>
                  <li v-if="act.amount > 0">
                    <span title="Amount available" class="fa fa-clone" aria-hidden="true"></span>
                    <span v-if="!act.edit">{{act.amount}}</span>
                    <i>|</i>
                  </li>
                  <li>
                    <span
                      :title="$t('popularity')"
                      class="fa fa-angle-double-down"
                      aria-hidden="true"
                    ></span>
                    <span>{{act.total_number_of_clicks}}</span>
                    <i>|</i>
                  </li>
                  <li>
                    <span :title="$t('favorites')" class="fa fa-user" aria-hidden="true"></span>
                    <span>{{act.total_number_of_completions}}</span>
                  </li>
                </ul>
                <div v-if="!act.edit">
                  <span
                    v-for="tag in act.tags"
                    style="margin-right: 5px"
                    class="badge badge-secondary"
                  >{{tag.name}}</span>
                </div>
              </div>

              <div class="clearfix"></div>
            </article>
            <br>
            <nav aria-label="Page navigation example" v-if="data.count">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{disabled: data.query.page == '1'}">
                  <a class="page-link" @click="previous">{{$t('previous')}}</a>
                </li>

                <li
                  v-for="(pages, index) in data.total_acts"
                  class="page-item"
                  :class="{active: data.query.page == index + 1}"
                >
                  <a
                    class="page-link"
                    :class="{disabled: data.query.page == index + 1}"
                    @click="navigateTo(index + 1)"
                  >{{index + 1}}</a>
                </li>

                <li class="page-item" :class="{disabled: data.query.page == data.count}">
                  <a class="page-link" @click="next">{{$t('next')}}</a>
                </li>
              </ul>
            </nav>
          </div>
          <aside class="col-lg-4 single-left">
            <div class="single-gd tech-btm">
              <h4>{{$t('top_acts_of_the_month')}}</h4>
              <div
                v-for="(top_act, index) in data.best_acts"
                class="blog-grids card card-body"
                style="margin-bottom: 10px"
              >
                <nuxt-link :to="'acts/' + top_act._id + '/view'">{{top_act.act[0].name}}</nuxt-link>
                <p v-html="top_act.act[0].description" class="truncate_text_3_lines"></p>
                <ul class="blog_list">
                  <li>
                    <span title="Favorites" class="fa fa-user" aria-hidden="true"></span>
                    {{top_act.count}}
                  </li>
                </ul>
              </div>
            </div>
          </aside>
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
let izitoast;

let vue_context;

export default {
  components: {
    MyBanner,
    MyHeader
  },
  created: function() {
    vue_context = this;
  },
  async mounted() {
    izitoast = require("izitoast");
  },
  async asyncData(context) {
    const token = context.app.$cookies.get("token");
    const refresh_token = context.app.$cookies.get("refresh_token");

    if (!context.query.sort) context.query.sort = "";
    if (!context.query.search) context.query.search = "";
    if (!context.query.order) context.query.order = "";
    if (!context.query.page) context.query.page = 1;
    context.query.type = "AVAILABLE";

    let data;
    await axios
      .get(
        `/api/view_acts?type=${context.query.type}&sort=${
          context.query.sort
        }&order=${context.query.order}&search=${context.query.search}&page=${
          context.query.page
        }`
      )
      .then(function(res) {
        data = res.data;
        //Loop through data and format date
        data.acts.forEach(element => {
          if (element.__t == "Event") {
            element.formated_start_time = moment(element.start_time).format(
              "MMMM Do YYYY, h:mm:ss a"
            );
            element.formated_end_time = moment(element.end_time).format(
              "MMMM Do YYYY, h:mm:ss a"
            );

            element.start_time = moment(element.start_time).format(
              moment.HTML5_FMT.DATETIME_LOCAL
            );
            element.end_time = moment(element.end_time).format(
              moment.HTML5_FMT.DATETIME_LOCAL
            );
          }
        });
      })
      .catch(function(err) {
        if (err.response.status == 401) {
          console.log("Error:", err)
        }
      });
    return { query: context.query, data };
  },
  head () {
    return {
      title: "Asset Building Clinic : View and filter acts",
      meta: [
        { hid: 'description', name: 'description', content: 'Search for specific acts' }
      ]
    }
  },
  data() {
    return {
      title: "acts",
      error: "",
      status_message: "",
      status_state: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      image: null,
      logged_in: false,
      page: "view_acts",
      saved_tags: [],
      deleted_acts: {},
      upload_type: "act",
      add_act: {
        name: "",
        description: "",
        reward_points: "",
        start_time: "",
        end_time: ""
      }
    };
  },
  async beforeRouteUpdate(to, from, next) {
    if (!to.query.sort) to.query.sort = "";
    if (!to.query.search) to.query.search = "";
    if (!to.query.order) to.query.order = "";
    if (!to.query.page) to.query.page = 1;
    await axios
      .get(
        `/api/view_acts?type=${to.query.type}&sort=${to.query.sort}&order=${
          to.query.order
        }&search=${to.query.search}&page=${to.query.page}`
      )
      .then(function(res) {
        const data = res.data;
        //Loop through data and format date
        data.acts.forEach(element => {
          if (element.__t == "Event") {
            element.formated_start_time = moment(element.start_time).format(
              "MMMM Do YYYY, h:mm:ss a"
            );
            element.formated_end_time = moment(element.end_time).format(
              "MMMM Do YYYY, h:mm:ss a"
            );

            element.start_time = element.start_time.substring(
              0,
              element.start_time.length - 8
            );
            element.end_time = element.end_time.substring(
              0,
              element.end_time.length - 8
            );
          }
        });
        vue_context.data = data;
      })
      .catch(function(err) {
        if (err.response.status == 401) {
          console.log(err)
        }
      });
    next();
  },
  methods: {
    navigateTo(index) {
      var element = this.$refs["acts_come_here"];
      var top = element.offsetTop;

      scrollToElement(element);

      this.$router.push(
        `/view_acts?type=AVAILABLE&sort=${this.query.sort}&order=${
          this.query.order
        }&search=${vue_context.query.search}&page=${index}
        `
      );
    },
    previous() {
      this.navigateTo(this.data.query.page - 1);
    },
    next() {
      this.navigateTo(parseInt(this.data.query.page) + 1);
    },
    reset() {
      this.query.order = "";
      this.query.page = 1;
      this.query.search = "";
      this.query.sort = "";
      this.$router.push(`/view_acts?type=AVAILABLE`);
    },
    async search() {
      this.$router.push(
        `/view_acts?type=AVAILABLE&sort=${this.query.sort}&order=${
          this.query.order
        }&search=${vue_context.query.search}
        `
      );
    },
  }
};
</script>

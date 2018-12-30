<template>
  <div>
    <my-header :logged_in="logged_in" :page="page" :roles="data.roles"/>
    <my-banner :title="title"/>
    <section class="banner-bottom-w3ls-agileinfo py-5">
      <!--/blog-->
      <div class="container py-md-3">
        <!-- <div>
          <div style="float: left; width: 50%"></div>
          <div class="progress" style="float: right; width: 50%">
            <div class="progress-bar" role="progressbar" style="width: 50%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">50 points</div>
          </div>
        </div>-->
        <span class="badge badge-primary float-right">{{data.reward_points.points}} reward points</span>
        <div style="clear: both"></div>
        <br>
        <div class="form-inline justify-content-center">
          <div class="form-group" style="margin-right: 10px">
            <span style="margin-right: 10px">
              <input
                type="text"
                name="search"
                v-model="query.search"
                class="form-control"
                placeholder="Search"
                @keyup.enter="search"
              >
              <select class="form-control" name="sort" v-model="query.sort">
                <option value disabled :selected="!query.sort">Sort by</option>
                <option value="creation_date" :selected="query.sort == 'creation_date'">Date</option>
                <option
                  value="total_number_of_completions"
                  :selected="query.sort == 'total_number_of_completions'"
                >Favorites</option>
                <option value="name" :selected="query.sort == 'name'">Name</option>
                <option
                  value="total_number_of_clicks"
                  :selected="query.sort == 'total_number_of_clicks'"
                >Popularity</option>
                <option
                  value="reward_points"
                  :selected="query.sort == 'reward_points'"
                >Reward points</option>
              </select>
              
              <select class="form-control" name="order" v-model="query.order">
                <option value disabled :selected="!query.order">Sort direction</option>
                <option value="1" :selected="query.order == '1'">Ascending</option>
                <option value="-1" :selected="query.order == '-1'">Descending</option>
              </select>
              
              <select @change="type_changed" class="form-control" name="type" v-model="query.type">
                <option value="AVAILABLE" :selected="!query.type == 'AVAILABLE'">Available</option>
                <option value="REQUESTED" :selected="!query.type == 'REQUESTED'">Requested</option>
                <option value="COLLECTED" :selected="!query.type == 'COLLECTED'">Collected</option>
                <option disabled v-if="data.roles && data.roles.act_poster">──────────</option>
                <option
                  v-if="data.roles && data.roles.act_poster"
                  value="MY_REWARDS"
                  :selected="!query.type == 'MY_REWARDS'"
                >My Rewards</option>
              </select>
            </span>
            <button
              type="submit"
              @click="search"
              class="btn btn-primary"
              style="margin-right: 10px"
            >Search</button>
            <input @click="reset" type="button" class="btn btn-danger" value="Reset">
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
              <!-- <div class="blog-img w3-agile-grid">
                <a>
                  <img src alt class="img-fluid">
                </a>
              </div>-->
              <div class="blog_info">
                <h5>
                  <nuxt-link v-if="!act.edit" :to="{path: 'rewards/' + act._id}">{{act.name}}</nuxt-link>
                  <input
                    :id="'act_name' + index"
                    v-if="act.edit"
                    type="text"
                    class="form-control"
                    :value="act.name"
                  >
                </h5>
                <p>
                  By {{act.reward_provider.first_name}} {{act.reward_provider.last_name}}
                  <a
                    href="#"
                    class="user-blog"
                  ></a>
                </p>

                <p v-if="!act.edit" class="truncate_text_3_lines">{{act.description}}</p>
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
                    >Start time: {{act.formated_start_time}}</span>
                    <div v-if="act.edit">
                      <div
                        class="controls input-append date form_datetime"
                        data-date-format="yyyy-mm-ddThh:ii"
                        data-link-field="dtp_input1"
                      >
                        <input
                          size="16"
                          placeholder="Start time"
                          type="text"
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
                    >End time: {{act.formated_end_time}}</span>
                    <div v-if="act.edit">
                      <div
                        class="controls input-append date form_datetime"
                        data-date-format="yyyy-mm-ddThh:ii"
                        data-link-field="dtp_input1"
                      >
                        <input
                          size="16"
                          placeholder="End time"
                          type="text"
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
                <div class="row" v-if="act.reward_provider.id == data.user.id">
                  <div class="col-md-7">
                    <a
                      tabindex="0"
                      class="badge badge-info"
                      @click="change_act_state(index)"
                      v-if="act.state == 'AVAILABLE'"
                      style="cursor: pointer"
                    >Available</a>
                    <a
                    tabindex="0"
                      @click="change_act_state(index)"
                      v-if="act.state == 'NOT_AVAILABLE'"
                      class="badge badge-info"
                      style="cursor: pointer"
                    >Not Available</a>
                    <!-- <span v-if="act.enabled" class="badge badge-info">Enabled</span> -->
                    <a
                    tabindex="0"
                      class="badge badge-info"
                      @click="change_act_state_by_manager(index)"
                      v-if="act.enabled"
                      style="cursor: pointer"
                    >Enabled</a>
                    <!-- <span v-if="!act.enabled" class="badge badge-info">Disabled</span> -->
                    <a
                    tabindex="0"
                      class="badge badge-info"
                      @click="change_act_state_by_manager(index)"
                      v-if="!act.enabled"
                      style="cursor: pointer"
                    >Disabled</a>
                  </div>
                  <div class="col-md-5">
                    <span v-if="!act.delete">
                      <button v-if="!act.edit" @click="edit_act(index)" class="btn btn-primary">Edit</button>
                      <button v-if="act.edit" @click="save_act(index)" class="btn btn-primary">Save</button>
                      <button v-if="act.edit" @click="edit_act(index)" class="btn btn-danger">Cancel</button>
                    </span>
                    <span v-if="!act.edit">
                      <button
                        v-if="!act.delete"
                        @click="delete_act(index)"
                        class="btn btn-danger"
                      >Delete</button>
                      <button
                        v-if="act.delete"
                        @click="delete_act(index)"
                        class="btn btn-primary"
                      >Cancel</button>
                      <button
                        v-if="act.delete"
                        @click="confirm_delete_act(index)"
                        class="btn btn-danger"
                      >Confirm</button>
                    </span>
                  </div>
                </div>
                <ul class="blog_list">
                  <li>
                    <span
                      title="Rewards points needed to get this reward"
                      class="fa fa-credit-card"
                      aria-hidden="true"
                    ></span>
                    <span v-if="!act.edit">{{act.value}}</span>
                    <input
                      :id="'act_reward_points' + index"
                      v-if="act.edit"
                      type="number"
                      style="width: 40px"
                      :value="act.value"
                    >
                    <i>|</i>
                  </li>
                  <li>
                    <span title="Amount available" class="fa fa-clone" aria-hidden="true"></span>
                    <span v-if="!act.edit">{{act.amount}}</span>
                    <input
                      :id="'act_amount' + index"
                      v-if="act.edit"
                      type="number"
                      style="width: 40px"
                      :value="act.amount"
                    >
                    <i>|</i>
                  </li>
                  <li>
                    <span title="Popularity" class="fa fa-angle-double-down" aria-hidden="true"></span>
                    {{act.total_number_of_users_who_clicked_on_this_reward}}
                    <i>|</i>
                  </li>
                  <li>
                    <span title="Favorites" class="fa fa-user" aria-hidden="true"></span>
                    {{act.total_number_of_users_who_got_this_reward}}
                    <!-- <i>|</i> -->
                  </li>
                  <!-- <li>
                    <a href="#">
                      <span class="fa fa-tag" aria-hidden="true"></span>
                      13
                    </a>
                  </li>-->
                </ul>
              </div>
              <div class="clearfix"></div>
            </article>
            <br>
            <nav aria-label="Page navigation example" v-if="data.count">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{disabled: data.query.page == '1'}">
                  <a class="page-link" @click="previous">Previous</a>
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
                  <a class="page-link" @click="next">Next</a>
                </li>
              </ul>
            </nav>
          </div>
          <aside class="col-lg-4 single-left">
            <div class="single-gd" v-if="data.roles && data.roles.act_poster">
              <!-- <img src="images/a3.jpg" class="img-fluid" alt> -->
              <div
                v-if="status_message"
                class="alert"
                :class="{'alert-danger': status_state == 'Error', 'alert-success': status_state == 'Success'}"
              >
                <strong>{{status_state}}:</strong>
                {{status_message}}
              </div>
              <!-- <select @change="upload_type_changed" class="form-control" v-model="upload_type">
                <option value="act">Add Reward</option>
              </select>
              <br>-->
              <h4>Add Reward</h4>
              <form @submit.prevent="addAct">
                <input
                  class="form-control"
                  v-model="add_act.name"
                  type="text"
                  name="name"
                  placeholder="Name"
                  required
                >
                <textarea
                  rows="10"
                  class="form-control"
                  name="description"
                  placeholder="Description"
                  required
                  v-model="add_act.description"
                ></textarea>
                <div v-if="upload_type == 'event'" class="control-group">
                  <div
                    class="controls input-append date form_datetime"
                    data-date-format="yyyy-mm-ddThh:ii"
                    data-link-field="dtp_input1"
                  >
                    <input
                      size="16"
                      placeholder="Start time"
                      type="text"
                      class="form-control"
                      value
                      id="start_time"
                    >
                    <span class="add-on">
                      <i class="icon-remove"></i>
                    </span>
                    <span class="add-on">
                      <i class="icon-th"></i>
                    </span>
                  </div>
                  <input type="hidden" id="dtp_input1" value>
                  <div
                    class="controls input-append date form_datetime"
                    data-date-format="yyyy-mm-ddThh:ii"
                    data-link-field="dtp_input1"
                  >
                    <input
                      size="16"
                      id="end_time"
                      placeholder="End time"
                      type="text"
                      class="form-control"
                      value
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
                <input
                  class="form-control"
                  type="number"
                  name="reward_points"
                  placeholder="Value"
                  required
                  v-model="add_act.value"
                >
                <input
                  class="form-control"
                  type="number"
                  name="reward_points"
                  placeholder="Amount"
                  required
                  v-model="add_act.amount"
                >
                <!-- <label for="file">Image should be 1600 X 800</label>
                <input class="form-control" id="file" type="file" name="file">-->
                <div class="button">
                  <input class="form-control" type="submit" value="Submit">
                </div>
              </form>
            </div>
            <!-- <div class="single-gd">
              <h4>Our Progress</h4>
              <div class="progress">
                <div
                  class="progress-bar progress-bar-striped"
                  role="progressbar"
                  style="width: 10%"
                  aria-valuenow="10"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <div class="progress">
                <div
                  class="progress-bar progress-bar-striped bg-success"
                  role="progressbar"
                  style="width: 25%"
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <div class="progress">
                <div
                  class="progress-bar progress-bar-striped bg-info"
                  role="progressbar"
                  style="width: 50%"
                  aria-valuenow="50"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <div class="progress">
                <div
                  class="progress-bar progress-bar-striped bg-warning"
                  role="progressbar"
                  style="width: 75%"
                  aria-valuenow="75"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <div class="progress">
                <div
                  class="progress-bar progress-bar-striped bg-danger"
                  role="progressbar"
                  style="width: 100%"
                  aria-valuenow="100"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>-->
            <div class="single-gd tech-btm">
              <h4>Top stories of the week</h4>
              <div class="blog-grids">
                <div class="blog-grid-left">
                  <a href="single.html">
                    <img src="images/a1.jpg" class="img-fluid mb-0" alt>
                  </a>
                </div>
                <div class="blog-grid-right">
                  <h5>
                    <a href="single.html">Pellentesque dui, non felis. Maecenas male</a>
                  </h5>
                </div>
                <div class="clearfix"></div>
              </div>
              <div class="blog-grids">
                <div class="blog-grid-left">
                  <a href="single.html">
                    <img src="images/a2.jpg" class="img-fluid mb-0" alt>
                  </a>
                </div>
                <div class="blog-grid-right">
                  <h5>
                    <a href="single.html">Pellentesque dui, non felis. Maecenas male</a>
                  </h5>
                </div>
                <div class="clearfix"></div>
              </div>
              <div class="blog-grids">
                <div class="blog-grid-left">
                  <a href="single.html">
                    <img src="images/a3.jpg" class="img-fluid mb-0" alt>
                  </a>
                </div>
                <div class="blog-grid-right">
                  <h5>
                    <a href="single.html">Pellentesque dui, non felis. Maecenas male</a>
                  </h5>
                </div>
                <div class="clearfix"></div>
              </div>
            </div>
            <div class="single-gd">
              <h4>Recent Post</h4>
              <img src="images/a1.jpg" class="img-fluid" alt>
              <p>
                Lorem Ipsum convallis diam sapien consequat magna vulputate ornare malesuada. id dignissim velit id felis ac
                cursus eros.
                Cras a elit.
              </p>
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
let iziToast;

let vue_context;

export default {
  components: {
    MyBanner,
    MyHeader
  },
  // head() {
  //   return {
  //     script: [
  //       { src: 'https://cdnjs.cloudflare.com/ajax/li1bs/moment.js/2.13.0/moment.js' },
  //       // { src: 'js/collapse.js' },
  //       // { src: 'js/transition.js' },
  //       { src: 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.17.47/js/bootstrap-datetimepicker.min.js' }
  //     ],
  //     link: [
  //       {href:"https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.17.37/css/bootstrap-datetimepicker.min.css", rel:"stylesheet"}
  //     ]
  //   }
  // },
  created: function() {
    vue_context = this;
  },
  async mounted() {
    iziToast = require("iziToast");

    // this.$nextTick(() => {
    //   this.$nuxt.$loading.start();
    //   setTimeout(() => this.$nuxt.$loading.finish(), 1500);
    // });
    // for (let i = 0; i < 1000; i++)
    //   await axios.get("/api/users/users").then(function(res) {
    //     vue_context.title = res.title;
    //     console.log(res);
    //   });
  },
  async fetch(context) {},
  // async asyncData({ query, req }) {
  async asyncData(context) {
    // console.log("I ran");
    // console.log();
    //Get acts
    // console.log("I ran");
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
      .get(
        `/api/rewards?type=${context.query.type}&sort=${
          context.query.sort
        }&order=${context.query.order}&search=${context.query.search}&page=${
          context.query.page
        }`,
        {
          headers: { Cookie: `token=${token}; refresh_token=${refresh_token};` }
        }
      )
      .then(function(res) {
        // console.log("I ran");
        // //Redirect to verification page
        // vue_context.$nuxt.$loading.finish();
        // vue_context.$router.push({
        //   path: "/verify_account"
        // });
        // console.log(res);
        data = res.data;
        // console.log(data)
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
    return { query: context.query, data };
  },
  data() {
    return {
      title: "Rewards",
      error: "",
      status_message: "",
      status_state: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      image: null,
      logged_in: true,
      page: "rewards",
      // roles: this.data.roles,
      deleted_acts: {},
      upload_type: "act",
      add_act: {
        name: "",
        description: "",
        reward_points: "",
        start_time: "",
        end_time: ""
      }
      // query: this.$route.query
    };
  },
  async beforeRouteUpdate(to, from, next) {
    // console.log(to);
    if (!to.query.sort) to.query.sort = "";
    if (!to.query.search) to.query.search = "";
    if (!to.query.order) to.query.order = "";
    if (!to.query.page) to.query.page = 1;
    const token = this.$cookies.get("token");
    const refresh_token = this.$cookies.get("refresh_token");
    await axios
      .get(
        `/api/rewards?type=${to.query.type}&sort=${to.query.sort}&order=${
          to.query.order
        }&search=${to.query.search}&page=${to.query.page}`,
        {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        }
      )
      .then(function(res) {
        vue_context.data = res.data;
      })
      .catch(function(err) {
        if (err.response.status == 400) {
          vue_context.$router.redirect("/logout");
        }
      });
    next();
  },
  methods: {
    fileChanged(event) {
      this.image = event.target.files[0];
    },
    navigateTo(index) {
      var element = this.$refs["acts_come_here"];
      var top = element.offsetTop;

      scrollToElement(element);
      // window.scrollTo(0, top);

      this.$router.push(
        `/rewards?type=${this.query.type}&sort=${this.query.sort}&order=${
          this.query.order
        }&search=${vue_context.query.search}&page=${index}
        `
      );
    },
    previous() {
      // console.log(this.data.query.page - 1)
      this.navigateTo(this.data.query.page - 1);
    },
    next() {
      // console.log(parseInt(this.data.query.page) + 1)
      this.navigateTo(parseInt(this.data.query.page) + 1);
    },
    reset() {
      this.query.order = "";
      this.query.page = 1;
      this.query.search = "";
      this.query.sort = "";
      // var element = this.$refs["acts_come_here"];

      // scrollToElement(element);
      this.$router.push(`/rewards?type=${this.query.type}`);
    },
    type_changed() {
      // console.log(this.query.type);
      this.$router.push(`/rewards?type=${this.query.type}`);
    },
    upload_type_changed() {
      // console.log(this.upload_type);
    },
    edit_act(index) {
      if (!this.data.acts[index].edit)
        this.$set(this.data.acts[index], "edit", true);
      else this.$set(this.data.acts[index], "edit", false);
    },
    delete_act(index) {
      if (!this.data.acts[index].delete)
        this.$set(this.data.acts[index], "delete", true);
      else this.$set(this.data.acts[index], "delete", false);
    },
    async confirm_delete_act(index) {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      //Store act and it's current index
      this.$set(this.deleted_acts, index, this.data.acts[index]);
      // this.deleted_acts.push({act: this.data.acts[index], index: index});
      //Remove act from array
      this.data.acts.splice(index, 1);
      //Make request to delete act

      await axios
        .put(`/api/rewards/${vue_context.deleted_acts[index]._id}/delete`, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .catch(function(err) {
          //If error, place act back
          vue_context.data.acts.splice(
            index,
            0,
            vue_context.deleted_acts[index]
          );
          delete_act(index);
          // vue_context.$set(
          //   vue_context.data.acts[index],
          //   "state",
          //   vue_context.data.acts[index].previous_data.state
          // );
          //Tell the user that the act could not be deleted
          iziToast.error({
            title: "Error",
            message: "Sorry, the reward could not be deleted",
            position: "topRight"
          });
        });
      delete this.deleted_acts[index];
    },
    async change_act_state(index) {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      //Store previous state of act
      this.$set(this.data.acts[index], "previous_data", {
        state: this.data.acts[index].state
      });
      //Get new state
      let new_state;
      if (this.data.acts[index].previous_data.state == 'AVAILABLE')
        new_state = 'NOT_AVAILABLE';
      else new_state = 'AVAILABLE';
      //Change state of act
      this.$set(this.data.acts[index], "state", new_state);
      //Make request to change state of act

      await axios
        .put(`/api/rewards/${vue_context.data.acts[index]._id}/user_state`, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .catch(function(err) {
          //If error, revert state of act
          vue_context.$set(
            vue_context.data.acts[index],
            "state",
            vue_context.data.acts[index].previous_data.state
          );
          //Tell the user that the act could not be altered
          iziToast.error({
            title: "Error",
            message: "Sorry, the reward state could not be altered",
            position: "topRight"
          });
        });
    },
    async change_act_state_by_manager(index)
    {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      //Store previous state of act
      this.$set(this.data.acts[index], "previous_data", {
        enabled: this.data.acts[index].enabled
      });
      //Get new state
      let new_state;
      if (this.data.acts[index].previous_data.enabled == true)
        new_state = false;
      else new_state = true;
      //Change state of act
      this.$set(this.data.acts[index], "enabled", new_state);
      //Make request to change state of act

      await axios
        .put(`/api/rewards/${vue_context.data.acts[index]._id}/state`, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .catch(function(err) {
          //If error, revert state of act
          vue_context.$set(
            vue_context.data.acts[index],
            "enabled",
            vue_context.data.acts[index].previous_data.enabled
          );
          //Tell the user that the act could not be altered
          iziToast.error({
            title: "Error",
            message: "Sorry, the reward state could not be altered",
            position: "topRight"
          });
        });
    },
    async save_act(index) {
      // iziToast.show({
      //   title: "Hey",
      //   color: 'red',
      //   message: "What would you like to add?",
      //   position: 'topRight',
      //   icon: 'fa fa-heart'
      // });

      // iziToast.error({
      //   title: "Error",
      //   message: "Illegal operation",
      //   position: 'topRight'
      // });

      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      //Get new name, description and reward points
      const name = document.getElementById("act_name" + index).value;
      const description = document.getElementById("act_description" + index)
        .value;
      const value = document.getElementById("act_reward_points" + index).value;
      const amount = document.getElementById("act_amount" + index).value;
      const enabled_state = this.data.acts[index].enabled;
      //If this is an event, get new start and end time too
      // let start_time, end_time;

      // if (this.data.acts[index].__t == "Event") {
      //   start_time = document.getElementById("act_start_time" + index).value;
      //   end_time = document.getElementById("act_end_time" + index).value;
      // }
      //Save previous name, description and reward points and enabled_state
      this.$set(this.data.acts[index], "previous_data", {
        name: this.data.acts[index].name,
        description: this.data.acts[index].description,
        value: this.data.acts[index].value,
        amount: this.data.acts[index].amount,
        enabled: enabled_state
      });
      //If this is an event, save previous start and end times
      // if (this.data.acts[index].__t == "Event") {
      //   this.$set(
      //     this.data.acts[index].previous_data,
      //     "start_time",
      //     this.data.acts[index].formated_start_time
      //   );
      //   this.$set(
      //     this.data.acts[index].previous_data,
      //     "end_time",
      //     this.data.acts[index].formated_end_time
      //   );
      // }
      // if (this.data.acts[index].__t == "Event") {
      //   this.$set(this.data.acts[index].previous_data, "start_time", this.data.acts[index].formated_start_time{
      //     start_time: this.data.acts[index].formated_start_time,
      //     end_time: this.data.acts[index].formated_end_time
      //   });
      // }
      //Update to new name, desription and reward points
      this.$set(this.data.acts[index], "name", name);
      this.$set(this.data.acts[index], "description", description);
      this.$set(this.data.acts[index], "value", value);
      this.$set(this.data.acts[index], "amount", amount);
      // this.$set(this.data.acts[index], "value", value);
      //If this is an event
      //Update to new start and end times
      // if (this.data.acts[index].__t == "Event") {
      //   this.$set(
      //     this.data.acts[index],
      //     "formated_start_time",
      //     moment(start_time).format("MMMM Do YYYY, h:mm:ss a")
      //   );
      //   this.$set(
      //     this.data.acts[index],
      //     "formated_end_time",
      //     moment(end_time).format("MMMM Do YYYY, h:mm:ss a")
      //   );
      // }
      //Remember to disable the act
      // this.$set(this.data.acts[index].enabled, "state", false);
      this.data.acts[index].enabled = false;
      //Remove input fields
      this.edit_act(index);
      //Edit this act
      const params = new URLSearchParams();

      params.append("name", name);
      params.append("description", description);
      params.append("value", value);
      params.append("amount", amount);

      //If this is an event, edit its start and end times
      // if (this.data.acts[index].__t == "Event") {
      //   params.append("start_time", start_time);
      //   params.append("end_time", end_time);
      // }

      await axios
        .put(`/api/rewards/${vue_context.data.acts[index]._id}`, params, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .catch(function(err) {
          //If error, revert to old name and description
          vue_context.$set(
            vue_context.data.acts[index],
            "name",
            vue_context.data.acts[index].previous_data.name
          );
          vue_context.$set(
            vue_context.data.acts[index],
            "description",
            vue_context.data.acts[index].previous_data.description
          );
          vue_context.$set(
            vue_context.data.acts[index],
            "value",
            vue_context.data.acts[index].previous_data.value
          );
          vue_context.$set(
            vue_context.data.acts[index],
            "amount",
            vue_context.data.acts[index].previous_data.amount
          );

          //Revert to previous state
          vue_context.$set(
            vue_context.data.acts[index].enabled,
            "state",
            vue_context.data.acts[index].previous_data.enabled
          );

          //If this is an event, revert to old start and end times
          // if (vue_context.data.acts[index].__t == "Event") {
          //   vue_context.$set(
          //     vue_context.data.acts[index],
          //     "formated_start_time",
          //     vue_context.data.acts[index].previous_data.start_time
          //   );
          //   vue_context.$set(
          //     vue_context.data.acts[index],
          //     "formated_end_time",
          //     vue_context.data.acts[index].previous_data.end_time
          //   );
          // }

          //Tell the user that the act could not be edited
          // let type_of_act = "act";
          // if (vue_context.data.acts[index].__t == "Event")
          //   type_of_act = "event";
          iziToast.error({
            title: "Error",
            message: `Sorry, the reward could not be edited`,
            position: "topRight"
          });
        });
    },
    async addAct() {
      // alert("Hello World");
      //Send act
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");
      const params = new URLSearchParams();

      params.append("name", this.add_act.name);
      params.append("description", this.add_act.description);
      params.append("value", this.add_act.value);
      params.append("amount", this.add_act.amount);
      // if (this.upload_type == "event") {
      //   params.append(
      //     "start_time",
      //     // new Date(document.getElementById("start_time").value + 'Z')
      //     new Date(document.getElementById("start_time").value)
      //   );
      //   params.append(
      //     "end_time",
      //     // new Date(document.getElementById("end_time").value + 'Z')
      //     new Date(document.getElementById("end_time").value)
      //   );
      // }
      await axios
        .post(`/api/rewards`, params, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .then(function(res) {
          // vue_context.data = res.data;
          // console.log(res);
          vue_context.status_state = "Success";
          vue_context.status_message = res.data.message;
          vue_context.add_act.name = "";
          vue_context.add_act.description = "";
          vue_context.add_act.value = "";
          vue_context.add_act.amount = "";
          // document.getElementById("end_time").value = "";
          // document.getElementById("start_time").value = "";
          // vue_context.add_act.reward_points = 0;
        })
        .catch(function(err) {
          vue_context.status_state = "Error";
          vue_context.status_message = err.response.data.message;

          // if (err.response.status == 400) {
          //   vue_context.$router.redirect("/logout");
          // }
          // console.log(err.response.data.message);
        });
      //If error, display error
      //If success, display success message with hint of manager's final say
      //Then clear the form
    },
    async search() {
      // this.$nuxt.$loading.start();

      // const token = this.$cookies.get("token");
      // const refresh_token = this.$cookies.get("refresh_token");
      // await axios
      //   .get(
      //     `/api/acts?type=${vue_context.query.type}&sort=${
      //       vue_context.query.sort
      //     }&order=${vue_context.query.order}&search=${
      //       vue_context.query.search
      //     }`,
      //     {
      //       headers: {
      //         Cookie: `token=${token}; refresh_token=${refresh_token};`
      //       }
      //     }
      //   )
      //   .then(function(res) {
      //     vue_context.data = res.data;
      //   })
      //   .catch(function(err) {
      //     if (err.response.status == 400) {
      //       vue_context.$router.redirect("/logout");
      //     }
      //   });

      // vue_context.$nuxt.$loading.finish();

      this.$router.push(
        `/rewards?type=${this.query.type}&sort=${this.query.sort}&order=${
          this.query.order
        }&search=${vue_context.query.search}
        `
      );
    },
    register() {
      //Check if there an empty input field
      //If so, display error
      if (!this.first_name || !this.last_name || !this.email || !this.password)
        this.error = "All fields must be present";
      else {
        //If all fields are present
        //Convert image to base64 if exists
        // if (this.image)
        // {
        //   const base64_image = base64Img.base64Sync
        // }
        //Send json to server
        // const json = {
        //   first_name: this.first_name,
        //   last_name: this.last_name,
        //   email: this.email,
        //   password: this.password
        // };

        this.$nuxt.$loading.start();

        const formData = new FormData();
        if (this.image) formData.append("file", this.image, this.image.name);

        formData.append("first_name", this.first_name);
        formData.append("last_name", this.last_name);
        formData.append("email", this.email);
        formData.append("password", this.password);

        axios
          .post("/api/users/register", formData)
          .then(function(res) {
            //Redirect to verification page
            vue_context.$nuxt.$loading.finish();
            vue_context.$router.push({
              path: "/verify_account"
            });
          })
          .catch(function(err) {
            vue_context.$nuxt.$loading.finish();
            if (err.response) vue_context.error = err.response.data.message;
          });

        //Else
      }
    }
  }
  // mounted() {
  //   this.msg = "Works";
  // }
  // created: function() {
  //   this.msg = "Works"
  // }
};
</script>

<style scoped>
/*.title {
  margin: 30px 0;
}
.users {
  list-style: none;
  margin: 0;
  padding: 0;
}
.user {
  margin: 10px 0;
}*/
</style>

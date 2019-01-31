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
        <span class="badge badge-primary float-right">{{data.reward_points.points}} {{$t('reward_points')}}</span>
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
                :placeholder="$t('search')"
                @keyup.enter="search"
              >
              <select class="form-control" name="sort" v-model="query.sort">
                <option value disabled :selected="!query.sort">{{$t('sort_by')}}</option>
                <option value="creation_date" :selected="query.sort == 'creation_date'">{{$t('date')}}</option>
                <option
                  value="total_number_of_users_who_got_this_reward"
                  :selected="query.sort == 'total_number_of_users_who_got_this_reward'"
                >{{$t('favorites')}}</option>
                <option value="name" :selected="query.sort == 'name'">{{$t('name')}}</option>
                <option
                  value="total_number_of_users_who_clicked_on_this_reward"
                  :selected="query.sort == 'total_number_of_users_who_clicked_on_this_reward'"
                >{{$t('popularity')}}</option>
                <option
                  value="value"
                  :selected="query.sort == 'value'"
                >{{$t('value')}}</option>
              </select>
              
              <select class="form-control" name="order" v-model="query.order">
                <option value disabled :selected="!query.order">{{$t('sort_direction')}}</option>
                <option value="1" :selected="query.order == '1'">{{$t('ascending')}}</option>
                <option value="-1" :selected="query.order == '-1'">{{$t('descending')}}</option>
              </select>
              
              <select @change="type_changed" class="form-control" name="type" v-model="query.type">
                <option value="AVAILABLE" :selected="!query.type == 'AVAILABLE'">{{$t('available')}}</option>
                <option value="REQUESTED" :selected="!query.type == 'REQUESTED'">{{$t('requested')}}</option>
                <option value="COLLECTED" :selected="!query.type == 'COLLECTED'">{{$t('collected')}}</option>
                <template v-if="data.roles && data.roles.reward_provider">
                <option disabled>──────────</option>
                <option
                  value="MY_REWARDS"
                  :selected="!query.type == 'MY_REWARDS'"
                >{{$t('my_rewards')}}</option>
                <option
                  value="OPEN"
                  :selected="!query.type == 'OPEN'"
                >{{$t('open_transactions')}}</option>
                <option
                  value="CLOSED"
                  :selected="!query.type == 'CLOSED'"
                >{{$t('closed_transactions')}}</option>
                </template>
              </select>
            </span>
            <button
              type="submit"
              @click="search"
              class="btn btn-primary"
              style="margin-right: 10px"
            >{{$t('search')}}</button>
            <input @click="reset" type="button" class="btn btn-danger" :value="$t('reset')">
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
                <nuxt-link :to="`/rewards/${act._id}`" v-if="act.image">
                  <img
                    :src="`/api/rewards/${act._id}/image`"
                    alt
                    class="img-fluid"
                  >
                </nuxt-link>
              </div>
              <div class="blog_info">
                <h5>
                  <a
                  style='cursor: pointer'
                    tabindex="0"
                    v-if="!act.edit && act.reward_provider.id == data.user.id"
                    data-toggle="popover"
                    :title="'<a class=\'view_popover\' name=\'' + act._id + '\' href=\'/rewards/' + act._id + '\'>' + $t('view') + '</a>'"
                    :data-content="'<a class=\'more_details_popover\' name=\'' + act._id + '\' href=\'/rewards/' + act._id + '/details\'>' + $t('more_details') + '</a>'"
                    data-trigger="focus"
                    data-html="true"
                  >{{act.name}}</a>                  
                  <nuxt-link v-if="!act.edit && act.reward_provider.id !== data.user.id" :to="{path: 'rewards/' + act._id}">{{act.name}}</nuxt-link>
                  <input
                    :id="'act_name' + index"
                    v-if="act.edit"
                    type="text"
                    class="form-control"
                    :value="act.name"
                  >
                </h5>
                <p>
                  {{$t('by')}} {{act.reward_provider.first_name}} {{act.reward_provider.last_name}}
                  <a
                    href="#"
                    class="user-blog"
                  ></a>
                </p>

                <div><p v-if="!act.edit" class="truncate_text_3_lines" v-html="act.description"></p></div>
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
                <div class="float-right"><nuxt-link :to="`/rewards/${act._id}`"><button class="btn btn-primary">More details</button></nuxt-link></div>
                <div class="clearfix"></div>
                <div class="row" v-if="act.reward_provider.id == data.user.id || (data.roles && data.roles.manager)">
                  <div class="col-md-7">
                    <span
                      v-if="data.roles && data.roles.manager && !data.roles.administrator"
                      class="badge badge-info"
                    >{{act.state ? $t('available') : $t('not_available')}}</span>
                    <span v-if="act.reward_provider.id == data.user.id || data.roles.administrator">
                    <a
                      tabindex="0"
                      class="badge badge-info"
                      @click="change_act_state(index)"
                      v-if="act.state == 'AVAILABLE'"
                      style="cursor: pointer"
                    >{{$t('available')}}</a>
                    <a
                    tabindex="0"
                      @click="change_act_state(index)"
                      v-if="act.state == 'NOT_AVAILABLE'"
                      class="badge badge-info"
                      style="cursor: pointer"
                    >{{$t('not_available')}}</a>
                    </span>
                    <span v-if="!data.roles || !data.roles.manager" class="badge badge-info">{{ act.enabled ? $t('enabled'):  $t('disabled') }}</span>
                    <span v-if="data.roles && data.roles.manager">
                    <a
                    tabindex="0"
                      class="badge badge-info"
                      @click="change_act_state_by_manager(index)"
                      v-if="act.enabled"
                      style="cursor: pointer"
                    >{{$t('enabled')}}</a>
                    <!-- <span v-if="!act.enabled" class="badge badge-info">{{$t('disabled')}}</span> -->
                    <a
                    tabindex="0"
                      class="badge badge-info"
                      @click="change_act_state_by_manager(index)"
                      v-if="!act.enabled"
                      style="cursor: pointer"
                    >{{$t('disabled')}}</a>
                    </span>
                  </div>
                  <div class="col-md-5" v-if="act.reward_provider.id == data.user.id || ( data.roles && data.roles.administrator)">
                    <span v-if="!act.delete">
                      <nuxt-link :to="`/rewards/${act._id}/edit`">
                        <button
                          class="btn btn-primary"
                        >{{$t('edit')}}</button>
                      </nuxt-link>
                      <!-- <button v-if="!act.edit" @click="edit_act(index)" class="btn btn-primary">{{$t('edit')}}</button> -->
                      <button v-if="act.edit" @click="save_act(index)" class="btn btn-primary">{{$t('save')}}</button>
                      <button v-if="act.edit" @click="edit_act(index)" class="btn btn-danger">{{$t('cancel')}}</button>
                    </span>
                    <span v-if="!act.edit">
                      <button
                        v-if="!act.delete"
                        @click="delete_act(index)"
                        class="btn btn-danger"
                      >{{$t('delete')}}</button>
                      <button
                        v-if="act.delete"
                        @click="delete_act(index)"
                        class="btn btn-primary"
                      >{{$t('cancel')}}</button>
                      <button
                        v-if="act.delete"
                        @click="confirm_delete_act(index)"
                        class="btn btn-danger"
                      >{{$t('confirm')}}</button>
                    </span>
                  </div>
                </div>
                <ul class="blog_list">
                  <li>
                    <span
                      :title="$t('reward_points_needed_to_collect_this_reward')"
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
                  <li v-if="act.amount > 0">
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
              <h4>Best rewards of the month</h4>
              <div
                v-for="(top_act, index) in data.best_acts"
                class="blog-grids card card-body"
                style="margin-bottom: 10px"
              >
                <nuxt-link :to="'rewards/' + top_act._id">{{top_act.act[0].name}}</nuxt-link>
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
    $(document).ready(function() {
      $('[data-toggle="popover"]').popover();
    });

    $(document).on("click", ".view_popover", function(event) {
      event.preventDefault();
      
      event.stopPropagation();
      event.stopImmediatePropagation();
      var target = $(event.target);
      // const index = target[0].id;
      const id = target[0].name;
      vue_context.viewReward(id);
    });
    $(document).on("click", ".more_details_popover", function(event) {
      event.preventDefault();
      
      event.stopPropagation();
      event.stopImmediatePropagation();
      var target = $(event.target);
      // const index = target[0].id;
      const id = target[0].name;
      vue_context.rewardDetails(id);
    });
  },
  async asyncData(context) {
    const token = context.app.$cookies.get("token");
    const refresh_token = context.app.$cookies.get("refresh_token");

    if (!context.query.sort) context.query.sort = "";
    if (!context.query.search) context.query.search = "";
    if (!context.query.order) context.query.order = "";
    if (!context.query.page) context.query.page = 1;
    if (!context.query.type) context.query.type = "AVAILABLE";

    let data;
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
        data = res.data;
      })
      .catch(function(err) {
        if (err.response.status == 401) {
          context.redirect("/logout");
        }
      });
   
    return { query: context.query, data };
  },
  head () {
    return {
      title: "Asset Building Clinic : View rewards",
      meta: [
        { hid: 'description', name: 'description', content: 'Search for specific rewards' }
      ]
    }
  },
  data() {
    return {
      title: "rewards",
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
        if (err.response.status == 401) {
          vue_context.$router.redirect("/logout");
        }
      });
      $('[data-toggle="popover"]').popover();
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
    viewReward(id){
      // alert(id);
      this.$router.push(`rewards/${id}`)
    },
    edit_act(index) {
      if (!this.data.acts[index].edit)
        this.$set(this.data.acts[index], "edit", true);
      else this.$set(this.data.acts[index], "edit", false);
    },
    rewardDetails(id){
      // alert(id);
      this.$router.push(`rewards/${id}/details`)
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
          izitoast.error({
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
          izitoast.error({
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
          izitoast.error({
            title: "Error",
            message: "Sorry, the reward state could not be altered",
            position: "topRight"
          });
        });
    },
    async save_act(index) {
     
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      //Get new name, description and reward points
      const name = document.getElementById("act_name" + index).value;
      const description = document.getElementById("act_description" + index)
        .value;
      const value = document.getElementById("act_reward_points" + index).value;
      const amount = document.getElementById("act_amount" + index).value;
      const enabled_state = this.data.acts[index].enabled;
      
      //Save previous name, description and reward points and enabled_state
      this.$set(this.data.acts[index], "previous_data", {
        name: this.data.acts[index].name,
        description: this.data.acts[index].description,
        value: this.data.acts[index].value,
        amount: this.data.acts[index].amount,
        enabled: enabled_state
      });
      
      //Update to new name, desription and reward points
      this.$set(this.data.acts[index], "name", name);
      this.$set(this.data.acts[index], "description", description);
      this.$set(this.data.acts[index], "value", value);
      this.$set(this.data.acts[index], "amount", amount);
      
      this.data.acts[index].enabled = false;
      //Remove input fields
      this.edit_act(index);
      //Edit this act
      const params = new URLSearchParams();

      params.append("name", name);
      params.append("description", description);
      params.append("value", value);
      params.append("amount", amount);

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

          izitoast.error({
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
     
      await axios
        .post(`/api/rewards`, params, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .then(function(res) {
          vue_context.status_state = "Success";
          vue_context.status_message = res.data.message;
          vue_context.add_act.name = "";
          vue_context.add_act.description = "";
          vue_context.add_act.value = "";
          vue_context.add_act.amount = "";
        })
        .catch(function(err) {
          vue_context.status_state = "Error";
          vue_context.status_message = err.response.data.message;

        });
      
    },
    async search() {
      
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
};
</script>

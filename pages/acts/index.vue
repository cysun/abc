<template>
  <div>
    <my-header :logged_in="logged_in" :page="page" :roles="data.roles"/>
    <my-banner :title="title"/>
    <section class="banner-bottom-w3ls-agileinfo py-5">
      <!--/blog-->
      <div class="container py-md-3">
        <span
          class="badge badge-primary float-right"
        >{{data.reward_points.points}} {{$t('reward_points')}}</span>
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
              
              <select @change="type_changed" class="form-control" name="type" v-model="query.type">
                <option value="AVAILABLE" :selected="!query.type == 'AVAILABLE'">{{$t('available')}}</option>
                <option
                  value="UNDER_REVIEW"
                  :selected="!query.type == 'UNDER_REVIEW'"
                >{{$t('under_review')}}</option>
                <option value="COMPLETED" :selected="!query.type == 'COMPLETED'">{{$t('completed')}}</option>
                <option value="REJECTED" :selected="!query.type == 'REJECTED'">{{$t('rejected')}}</option>
                <option disabled v-if="data.roles && data.roles.act_poster">──────────</option>
                <option
                  v-if="data.roles && data.roles.act_poster"
                  value="MY_ACTS"
                  :selected="!query.type == 'MY_ACTS'"
                >{{$t('my_acts')}}</option>
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
                <nuxt-link :to="`/acts/${act._id}`" v-if="act.image">
                  <img :src="`/api/acts/${act._id}/image`" alt class="img-fluid">
                </nuxt-link>
              </div>
              <div class="blog_info">
                <h5>
                  <nuxt-link v-if="!act.edit" :to="{path: 'acts/' + act._id}">{{act.name}}</nuxt-link>
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

                <p v-if="!act.edit" class="truncate_text_3_lines" v-html="act.description"></p>
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
                <div
                  class="row"
                  v-if="act.act_provider.id == data.user.id || ( data.roles && data.roles.manager)"
                >
                  <div class="col-md-7">
                    <span
                      v-if="data.roles && data.roles.manager && !data.roles.administrator"
                      class="badge badge-info"
                    >{{act.state ? $t('available') : $t('not_available')}}</span>
                    <span v-if="act.act_provider.id == data.user.id">
                      <a
                        tabindex="0"
                        style="cursor: pointer"
                        class="badge badge-info"
                        @click="change_act_state(index)"
                        v-if="act.state == 'AVAILABLE'"
                      >{{$t('available')}}</a>
                      <a
                        @click="change_act_state(index)"
                        v-if="act.state == 'NOT_AVAILABLE'"
                        class="badge badge-info"
                        tabindex="0"
                        style="cursor: pointer"
                      >{{$t('not_available')}}</a>
                    </span>
                    <a
                      v-if="data.roles && data.roles.manager"
                      tabindex="0"
                      class="badge badge-info"
                      @click="change_act_state_by_manager(index)"
                      style="cursor: pointer"
                    >{{act.enabled.state ? $t('enabled') : $t('disabled')}}</a>
                    <span
                      v-if="data.roles && !data.roles.manager"
                      class="badge badge-info"
                    >{{act.enabled.state ? $t('enabled') : $t('disabled')}}</span>
                  </div>
                  <div
                    class="col-md-5"
                    v-if="act.act_provider.id == data.user.id || ( data.roles && data.roles.administrator)"
                  >
                    <span v-if="!act.delete">
                      <!-- <nuxt-link :to="`/acts/${act._id}/edit`">
                        <button
                          v-if="!act.edit"
                          class="btn btn-primary"
                        >{{$t('edit')}}</button>
                      </nuxt-link> -->
                      <button
                        v-if="act.edit"
                        @click="save_act(index)"
                        class="btn btn-primary"
                      >{{$t('save')}}</button>
                      <button
                        v-if="act.edit"
                        @click="edit_act(index)"
                        class="btn btn-danger"
                      >{{$t('cancel')}}</button>
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
                  <li>
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
                <div class="form-inline" v-if="act.edit">
                  <a
                    v-for="(tag, tag_index) in act.tags"
                    tabindex="0"
                    style="margin-right: 5px; cursor: pointer"
                    class="badge badge-secondary"
                    @click="deleteTag(tag_index, index)"
                  >{{tag.name}}</a>
                  <input
                    type="text"
                    id="add_tag"
                    class="form-control"
                    :placeholder="$t('tags_placeholder')"
                  >
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
                <nuxt-link :to="'acts/' + top_act._id">{{top_act.act[0].name}}</nuxt-link>
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
    if (!context.query.type) context.query.type = "AVAILABLE";

    let data;
    await axios
      .get(
        `/api/acts?type=${context.query.type}&sort=${
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
          context.redirect("/logout");
        }
      });
    return { query: context.query, data };
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
      logged_in: true,
      page: "acts",
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
    const token = this.$cookies.get("token");
    const refresh_token = this.$cookies.get("refresh_token");
    await axios
      .get(
        `/api/acts?type=${to.query.type}&sort=${to.query.sort}&order=${
          to.query.order
        }&search=${to.query.search}&page=${to.query.page}`,
        {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        }
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

      this.$router.push(
        `/acts?type=${this.query.type}&sort=${this.query.sort}&order=${
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
      this.$router.push(`/acts?type=${this.query.type}`);
    },
    type_changed() {
      this.$router.push(`/acts?type=${this.query.type}`);
    },
    upload_type_changed() {},
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
    async deleteTag(tag_index, act_index) {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      //Save tag
      this.saved_tags[act_index] = {
        tag_index: this.data.acts[act_index].tags[tag_index]
      };
      const tag_id = this.data.acts[act_index].tags[tag_index]._id;
      //remove tag from screen
      this.data.acts[act_index].tags.splice(tag_index, 1);
      //Make request to delete tag
      await axios
        .delete(
          `/api/acts/${vue_context.data.acts[act_index]._id}/tag/${tag_id}`,
          {
            headers: {
              Cookie: `token=${token}; refresh_token=${refresh_token};`
            }
          }
        )
        .catch(function(err) {
          //If error, place tag back
          vue_context.data.acts[act_index].tags.splice(
            tag_index,
            0,
            vue_context.saved_tags[act_index].tag_index
          );
          //Show error
          izitoast.error({
            title: "Error",
            message: "Sorry, the tag could not be deleted",
            position: "topRight"
          });
        });
    },
    async change_act_state_by_manager(index) {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      //Store previous state of act
      this.$set(this.data.acts[index], "previous_data", {
        enabled: this.data.acts[index].enabled.state
      });
      //Get new state
      let new_state;
      if (this.data.acts[index].previous_data.enabled == true)
        new_state = false;
      else new_state = true;
      //Change state of act
      this.$set(this.data.acts[index].enabled, "state", new_state);
      //Make request to change state of act

      await axios
        .put(
          `/api/acts/${vue_context.data.acts[index]._id}/enable/${new_state}`,
          {
            headers: {
              Cookie: `token=${token}; refresh_token=${refresh_token};`
            }
          }
        )
        .catch(function(err) {
          //If error, revert state of act
          vue_context.$set(
            vue_context.data.acts[index].enabled,
            "state",
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
    async confirm_delete_act(index) {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      //Store act and it's current index
      this.$set(this.deleted_acts, index, this.data.acts[index]);
      //Remove act from array
      this.data.acts.splice(index, 1);
      //Make request to delete act

      await axios
        .put(`/api/acts/${vue_context.deleted_acts[index]._id}/delete`, {
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
          //Tell the user that the act could not be deleted
          izitoast.error({
            title: "Error",
            message: "Sorry, the act could not be deleted",
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
      if (this.data.acts[index].previous_data.state == "AVAILABLE")
        new_state = "NOT_AVAILABLE";
      else new_state = "AVAILABLE";
      //Change state of act
      this.$set(this.data.acts[index], "state", new_state);
      //Make request to change state of act

      await axios
        .put(`/api/acts/${vue_context.data.acts[index]._id}/state`, {
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
            message: "Sorry, the act state could not be altered",
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
      const reward_points = document.getElementById("act_reward_points" + index)
        .value;
      const enabled_state = this.data.acts[index].enabled.state;
      //If this is an event, get new start and end time too
      let start_time, end_time;

      if (this.data.acts[index].__t == "Event") {
        start_time = document.getElementById("act_start_time" + index).value;
        end_time = document.getElementById("act_end_time" + index).value;
      }
      //Save previous name, description and reward points and enabled_state
      this.$set(this.data.acts[index], "previous_data", {
        name: this.data.acts[index].name,
        description: this.data.acts[index].description,
        reward_points: this.data.acts[index].reward_points,
        enabled: enabled_state
      });
      //If this is an event, save previous start and end times
      if (this.data.acts[index].__t == "Event") {
        this.$set(
          this.data.acts[index].previous_data,
          "start_time",
          this.data.acts[index].formated_start_time
        );
        this.$set(
          this.data.acts[index].previous_data,
          "end_time",
          this.data.acts[index].formated_end_time
        );
      }
      //Update to new name, desription and reward points
      this.$set(this.data.acts[index], "name", name);
      this.$set(this.data.acts[index], "description", description);
      this.$set(this.data.acts[index], "reward_points", reward_points);
      //If this is an event
      //Update to new start and end times
      if (this.data.acts[index].__t == "Event") {
        this.$set(
          this.data.acts[index],
          "formated_start_time",
          moment(start_time).format("MMMM Do YYYY, h:mm:ss a")
        );
        this.$set(
          this.data.acts[index],
          "formated_end_time",
          moment(end_time).format("MMMM Do YYYY, h:mm:ss a")
        );
      }
      //Remember to disable the act
      this.$set(this.data.acts[index].enabled, "state", false);
      //Remove input fields
      this.edit_act(index);
      //Edit this act
      const params = new URLSearchParams();

      const new_tag = document.getElementById("add_tag").value;
      document.getElementById("add_tag").value = "";

      params.append("name", name);
      params.append("description", description);
      params.append("reward_points", reward_points);
      if (new_tag) params.append("tags", new_tag);

      //If this is an event, edit its start and end times
      if (this.data.acts[index].__t == "Event") {
        params.append("start_time", start_time);
        params.append("end_time", end_time);
      }

      await axios
        .put(`/api/acts/${vue_context.data.acts[index]._id}`, params, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .then(function(res) {
          // vue_context.data.acts[index].add_tags = "";
          //Replace this act tags
          vue_context.data.acts[index].tags = res.data.tags;
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
            "reward_points",
            vue_context.data.acts[index].previous_data.reward_points
          );

          //Revert to previous state
          vue_context.$set(
            vue_context.data.acts[index].enabled,
            "state",
            vue_context.data.acts[index].previous_data.enabled
          );

          //If this is an event, revert to old start and end times
          if (vue_context.data.acts[index].__t == "Event") {
            vue_context.$set(
              vue_context.data.acts[index],
              "formated_start_time",
              vue_context.data.acts[index].previous_data.start_time
            );
            vue_context.$set(
              vue_context.data.acts[index],
              "formated_end_time",
              vue_context.data.acts[index].previous_data.end_time
            );
          }

          //Tell the user that the act could not be edited
          let type_of_act = "act";
          if (vue_context.data.acts[index].__t == "Event")
            type_of_act = "event";
          izitoast.error({
            title: "Error",
            message: `Sorry, the ${type_of_act} could not be edited`,
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
      params.append("reward_points", this.add_act.reward_points);
      if (this.add_act.tags) params.append("tags", this.add_act.tags);
      if (this.upload_type == "event") {
        if (
          !document.getElementById("start_time").value ||
          !document.getElementById("end_time").value
        ) {
          izitoast.error({
            title: "Error",
            message: "Start time and end time must be inputted",
            position: "topRight"
          });
          return;
        }

        params.append(
          "start_time",
          // new Date(document.getElementById("start_time").value + 'Z')
          new Date(document.getElementById("start_time").value)
        );
        params.append(
          "end_time",
          // new Date(document.getElementById("end_time").value + 'Z')
          new Date(document.getElementById("end_time").value)
        );
      }
      await axios
        .post(`/api/acts/${vue_context.upload_type}`, params, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .then(function(res) {
          izitoast.success({
            title: "Success",
            message: "Your act has been successfully created",
            position: "topRight"
          });
          vue_context.add_act.name = "";
          vue_context.add_act.description = "";
          vue_context.add_act.reward_points = 0;
          vue_context.add_act.tags = "";

          if (vue_context.upload_type == "event") {
            document.getElementById("end_time").value = "";
            document.getElementById("start_time").value = "";
          }

          console.log(vue_context.query.type);
          //If not admin
          if (!vue_context.data.roles.administrator) {
            //If not in My acts
            if (vue_context.query.type != "MY_ACTS") {
              //Navigate to my acts
              vue_context.query.type = "MY_ACTS";
              vue_context.$router.push(`/acts?type=MY_ACTS`);
            } else {
              //If already in my acts
              //Add this new act to top of page
              vue_context.data.acts.splice(0, 0, res.data);
            }
          } else {
            //If admin,
            //If not in available
            if (vue_context.query.type != "AVAILABLE") {
              //Navigate to available
              vue_context.query.type = "AVAILABLE";
              vue_context.$router.push(`/acts?type=AVAILABLE`);
            } else {
              //If in available
              //Add this new act to top of page
              //If this is an event
              //Format the start and end time first

              if (vue_context.upload_type == "event") {
                res.data.formated_start_time = moment(
                  res.data.start_time
                ).format("MMMM Do YYYY, h:mm:ss a");
                ("MMMM Do YYYY, h:mm:ss a");
                res.data.formated_end_time = moment(res.data.end_time).format(
                  "MMMM Do YYYY, h:mm:ss a"
                );
                ("MMMM Do YYYY, h:mm:ss a");

                res.data.start_time = moment(res.data.start_time).format(
                  moment.HTML5_FMT.DATETIME_LOCAL
                );
                res.data.end_time = moment(res.data.end_time).format(
                  moment.HTML5_FMT.DATETIME_LOCAL
                );
              }

              vue_context.data.acts.splice(0, 0, res.data);
            }
          }
        })
        .catch(function(err) {
          console.log(err);
          izitoast.error({
            title: "Error",
            message: err.response.data.message,
            position: "topRight"
          });
        });
    },
    async search() {
      this.$router.push(
        `/acts?type=${this.query.type}&sort=${this.query.sort}&order=${
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
      }
    }
  }
};
</script>

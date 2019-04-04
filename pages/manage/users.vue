<template>
  <div>
    <my-header :logged_in="logged_in" :page="page" :roles="data.roles"/>
    <my-banner :title="title"/>
    <section class="banner-bottom-w3ls-agileinfo py-5">
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
                        <select
                          :disabled="query.type == 'REVIEWS'"
                          class="form-control"
                          name="sort"
                          v-model="query.sort"
                        >
                          <option value disabled :selected="!query.sort">{{$t('sort_by')}}</option>
                          <option
                            value="creation_date"
                            :selected="query.sort == 'creation_date'"
                          >{{$t('date')}}</option>
                          <option
                            value="first_name"
                            :selected="query.sort == 'first_name'"
                          >{{$t('first_name')}}</option>
                          <option
                            value="last_name"
                            :selected="query.sort == 'last_name'"
                          >{{$t('last_name')}}</option>
                        </select>
                        
                        <select
                          :disabled="query.type == 'REVIEWS'"
                          class="form-control"
                          name="order"
                          v-model="query.order"
                        >
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
                      <input
                        @click="reset"
                        type="button"
                        class="btn btn-danger"
                        :value="$t('reset')"
                      >
                    </div>
                  </div>
        <br>
        <div class="table-responsive">
                    <table class="table table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>{{$t('first_name')}}</th>
                          <th>{{$t('last_name')}}</th>
                          <th>{{$t('verified')}}</th>
                          <th>{{$t('registration_date')}}</th>
                          <th>{{$t('actions')}}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(user, index) in data.data">
                          <td>{{index + 1}}</td>
                          <td>{{user.first_name}}</td>
                          <td>{{user.last_name}}</td>
                          <td>
                            <span
                              class="label"
                              :class="{'label-danger': !user.enabled, 'label-success': user.enabled }"
                            >{{user.enabled}}</span>
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
                  <div class="text-center">
                    <nav aria-label="Page navigation example" v-if="data.count">
                      <ul class="pagination justify-content-center">
                        <li class="page-item" :class="{disabled: query.page == '1'}">
                          <a class="page-link" @click="previous">{{$t('previous')}}</a>
                        </li>

                        <li
                          v-for="(pages, index) in data.count"
                          class="page-item"
                          :class="{active: query.page == index + 1}"
                        >
                          <a
                            class="page-link"
                            :class="{disabled: query.page == index + 1}"
                            @click="navigateTo(index + 1)"
                          >{{index + 1}}</a>
                        </li>

                        <li class="page-item" :class="{disabled: query.page == data.count}">
                          <a class="page-link" @click="next">{{$t('next')}}</a>
                        </li>
                      </ul>
                    </nav>
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
  async fetch(context) {},
  // async asyncData({ query, req }) {
  async asyncData(context) {
    const token = context.app.$cookies.get("token");
    const refresh_token = context.app.$cookies.get("refresh_token");

    if (!context.query.sort) context.query.sort = "";
    if (!context.query.search) context.query.search = "";
    if (!context.query.order) context.query.order = "";
    if (!context.query.page) context.query.page = 1;

    let data;
    await axios
      .get(
        `/api/users?search=${context.query.search}&sort=${
          context.query.sort
        }&order=${context.query.order}&page=${context.query.page}`,
        {
          headers: { Cookie: `token=${token}; refresh_token=${refresh_token};` }
        }
      )
      .then(function(res) {
        data = res.data;
        // Loop through data and format date
        data.data.forEach(element => {
          element.creation_date = moment(element.creation_date).format(
            "MMMM Do YYYY"
          );
        });
      })
      .catch(function(err) {
        if (err.response.status == 401) {
          context.redirect("/logout");
        }
      });
    return { query: context.query, data };
  },
  async beforeRouteUpdate(to, from, next) {
    const token = this.$cookies.get("token");
    const refresh_token = this.$cookies.get("refresh_token");

    if (!to.query.sort) to.query.sort = "";
    if (!to.query.search) to.query.search = "";
    if (!to.query.order) to.query.order = "";
    if (!to.query.page) to.query.page = 1;

    let data;
    await axios
      .get(
        `/api/users?sort=${to.query.sort}&order=${to.query.order}&search=${
          to.query.search
        }&page=${to.query.page}`,
        {
          headers: { Cookie: `token=${token}; refresh_token=${refresh_token};` }
        }
      )
      .then(function(res) {
        data = res.data;
        //Loop through data and format date
        data.data.forEach(element => {
          element.creation_date = moment(element.creation_date).format(
            "MMMM Do YYYY"
          );
        });
      })
      .catch(function(err) {
        if (err.response.status == 401) {
          vue_context.$router.redirect("/logout");
        }
      });
    vue_context.query = to.query;
    vue_context.data = data;
    next();
  },
  head () {
    return {
      title: "Asset Building Clinic : Manage Users",
      meta: [
        { hid: 'description', name: 'description', content: 'Manage users on ABC' }
      ]
    }
  },
  data() {
    return {
      title: "manage_users",
      error: "",
      status_message: "",
      status_state: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      image: null,
      logged_in: true,
      page: "manage_acts",
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
  methods: {
    async search() {
      this.$router.push(
        `/manage/users/?&sort=${this.query.sort}&order=${
          this.query.order
        }&search=${this.query.search}
        `
      );
    },
    navigateTo(index) {
      var element = this.$refs["acts_come_here"];
      var top = element.offsetTop;
      scrollToElement(element);

      this.$router.push(
        `/manage/users?sort=${this.query.sort}&order=${
          this.query.order
        }&search=${vue_context.query.search}&page=${index}
        `
      );
    },
    previous() {
      if (this.query.page <= 1) return;
      this.navigateTo(this.query.page - 1);
    },
    next() {
      if (this.query.page >= this.data.count) return;
      this.navigateTo(parseInt(this.query.page) + 1);
    },
    reset() {
      this.query.order = "";
      this.query.page = 1;
      this.query.search = "";
      this.query.sort = "";
      this.$router.push(`/manage/users`);
    }
  }
};
</script>

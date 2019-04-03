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
                >Value</option>
              </select>
              
              <select class="form-control" name="order" v-model="query.order">
                <option value disabled :selected="!query.order">{{$t('sort_direction')}}</option>
                <option value="1" :selected="query.order == '1'">{{$t('ascending')}}</option>
                <option value="-1" :selected="query.order == '-1'">{{$t('descending')}}</option>
              </select>
              
              <select @change="type_changed" class="form-control" name="type" v-model="query.type">
                <option value="ALL" :selected="!query.type == 'ALL'">{{$t('all')}}</option>
                <option value="ENABLED" :selected="!query.type == 'ENABLED'">{{$t('enabled')}}</option>
                <option value="DISABLED" :selected="!query.type == 'DISABLED'">{{$t('disabled')}}</option>
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
        <table class="table table-striped table-hover" ref="acts_come_here">
          <thead>
            <th scope="col" data-type="string">{{$t('poster_name')}}</th>
            <th scope="col" data-type="number">{{$t('reward')}}</th>
            <th scope="col" data-role="annotation">{{$t('value')}}</th>
            <th scope="col" data-role="annotation">{{$t('amount')}}</th>
            <th scope="col" data-role="annotation">{{$t('state')}}</th>
            <th scope="col" data-role="annotation">{{$t('details')}}</th>
          </thead>

          <tr v-for="(act, index) in data.acts">
            <td>{{act.reward_provider.first_name}} {{act.reward_provider.last_name}}</td>
            <td>{{act.name}}</td>
            <td>{{act.value}}</td>
            <td>{{act.amount}}</td>
            <td>
              <button
                @click="change_state(index, act.enabled)"
                class="btn"
                :class="{'btn-danger': act.enabled, 'btn-success': !act.enabled}"
              >{{act.enabled ? $t('disable') : $t('enable') }}</button>
            </td>
            <td>
              <nuxt-link :to="'/rewards/' + act._id">
                <button class="btn btn-primary">{{$t('details')}}</button>
              </nuxt-link>
            </td>
          </tr>
        </table>
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
  // async asyncData({ query, req }) {
  async asyncData(context) {
    const token = context.app.$cookies.get("token");
    const refresh_token = context.app.$cookies.get("refresh_token");

    if (!context.query.sort) context.query.sort = "";
    if (!context.query.search) context.query.search = "";
    if (!context.query.order) context.query.order = "";
    if (!context.query.page) context.query.page = 1;
    if (!context.query.type) context.query.type = "ALL";
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
      title: "Asset Building Clinic : Manage rewards",
      meta: [
        { hid: 'description', name: 'description', content: 'Manage rewards on ABC' }
      ]
    }
  },
  data() {
    return {
      title: "Manage Rewards",
      error: "",
      status_message: "",
      status_state: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      image: null,
      logged_in: true,
      page: "manage_rewards",
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
        if (err.response.status == 401) {
          vue_context.$router.redirect("/logout");
        }
      });
    next();
  },
  methods: {
    change_state(index, state) {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");
      //Save current row
      if (!this.saved_acts)
        this.saved_acts = { [index]: this.data.acts[index] };
      else this.saved_acts[index] = this.data.acts[index];
      //If this is the 'ALL' page
      if (this.data.type == "ALL")
        //Change state
        this.data.acts[index].enabled = !state;
        // this.$set(this.data.acts[index].enabled, "state", !state);

      //Display error
      //Make request to change state
      axios
        .put(`/api/rewards/${vue_context.data.acts[index]._id}/enable/${!state}`, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .then(function(res) {
        })
        .catch(function(err) {
          //If error
          //If all page
          if (vue_context.data.type == "ALL")
            this.data.acts[index].enabled = state;
          //Else
          else {
            //Return the row
            vue_context.data.acts.splice(
              index,
              0,
              vue_context.saved_acts[index]
            );
          }

          //Tell the user that the act could not be altered
          izitoast.error({
            title: "Error",
            message: "Sorry, the change could not be saved",
            position: "topRight"
          });
        });
      if (this.data.type !== "ALL") {
        //If not, remove the row
        this.data.acts.splice(index, 1);
      }
    },
    navigateTo(index) {
      var element = this.$refs["acts_come_here"];
      var top = element.offsetTop;

      scrollToElement(element);
      // window.scrollTo(0, top);

      this.$router.push(
        `/manage/rewards?type=${this.query.type}&sort=${this.query.sort}&order=${
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
      this.$router.push(`/manage/rewards?type=${this.query.type}`);
    },
    type_changed() {
      // console.log(this.query.type);
      this.$router.push(`/manage/rewards?type=${this.query.type}`);
    },
    async search() {
      this.$router.push(
        `/manage/rewards?type=${this.query.type}&sort=${this.query.sort}&order=${
          this.query.order
        }&search=${vue_context.query.search}
        `
      );
    },
  }
};
</script>

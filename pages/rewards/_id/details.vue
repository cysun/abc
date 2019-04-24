<template>
  <div>
    <my-header :logged_in="logged_in" :page="page" :roles="data.roles"/>
    <my-banner :title="data.reward.name"/>
    <section class="banner-bottom-w3ls-agileinfo py-5">
      <div class="container py-md-3">
        <span class="badge badge-primary float-right">{{$t('Accumulated')}} {{data.sum}} {{$t('points')}}</span>
        <div style="clear: both"></div>
        <br>
        <div class="form-inline justify-content-center">
          <div class="form-group" style="margin-right: 10px">
            <span style="margin-right: 10px">
              <input
                type="text"
                name="search"
                :disabled="query.type == 'REVIEWS'"
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
                <option value="creation_date" :selected="query.sort == 'creation_date'">{{$t('date')}}</option>
                <option value="first_name" :selected="query.sort == 'first_name'">{{$t('first_name')}}</option>
                <option value="last_name" :selected="query.sort == 'last_name'">{{$t('last_name')}}</option>
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
              
              <select @change="type_changed" class="form-control" name="type" v-model="query.type">
                <option value="OPEN" :selected="!query.type == 'OPEN'">{{$t('open_transactions')}}</option>
                <option value="CLOSED" :selected="!query.type == 'CLOSED'">{{$t('closed_transactions')}}</option>
                <option value="REVIEWS" :selected="!query.type == 'REVIEWS'">{{$t('user_reviews')}}</option>
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
        <div ref="acts_come_here">
          <button
            class="btn btn-primary"
            @click="showReward"
            style="margin-bottom: 10px"
          >{{$t('reward_details')}}</button>
          <table class="table table-striped table-hover" v-if="query.type != 'REVIEWS'">
            <thead>
              <th scope="col" data-type="string">{{$t('users_name')}}</th>
              <th scope="col" data-type="string">{{$t('email')}}</th>
              <th scope="col" data-type="number">{{$t('date_reward_was')}} {{data.requested}}</th>
              <th
                v-if="data.query.type == 'OPEN'"
                scope="col"
                data-role="annotation"
              >{{$t('confirm_collection')}}</th>
            </thead>

            <tr v-for="(user, index) in data.data">
              <td>{{user.first_name}} {{user.last_name}}</td>
              <td><a :href="`mailto:${user.email}`">{{user.email}}</a></td>
              <td v-if="user.rewards">{{user.rewards[0].time}}</td>
              <td v-if="data.query.type == 'OPEN'">
                <button @click="confirmCollection(index)" class="btn btn-primary">{{$t('confirm_collection')}}</button>
              </td>
            </tr>
          </table>
          <div v-if="data.query.type == 'REVIEWS'" class="comment-top w3-agile-grid">
            <h4>{{$t('reviews')}}</h4>
            <div class="media mb-3" v-for="(user, index) in data.data">
              <div class="media-body">
                <h5 class="mt-0">{{user.first_name}} {{user.last_name}}</h5>
                <p>{{$t('reward_rating')}} : {{user.reward_rating}}</p>
                <p v-if="user.reward_comments">{{user.reward_comments}}</p>
                <p>{{$t('reward_provider_rating')}} : {{user.reward_provider_rating}}</p>
                <p v-if="user.reward_provider_comments">{{user.reward_provider_comments}}</p>
              </div>
            </div>
          </div>
        </div>
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
  async asyncData(context) {
    const token = context.app.$cookies.get("token");
    const refresh_token = context.app.$cookies.get("refresh_token");

    if (!context.query.sort) context.query.sort = "";
    if (!context.query.search) context.query.search = "";
    if (!context.query.order) context.query.order = "";
    if (!context.query.page) context.query.page = 1;
    if (!context.query.type) context.query.type = "OPEN";
    let data;
    await axios
      .get(
        `/api/rewards/${context.route.params.id}/details?type=${
          context.query.type
        }&sort=${context.query.sort}&order=${context.query.order}&search=${
          context.query.search
        }&page=${context.query.page}`,
        {
          headers: { Cookie: `token=${token}; refresh_token=${refresh_token};` }
        }
      )
      .then(function(res) {
        data = res.data;
        //Loop through data and format date
        if (context.query.type != "REVIEWS")
        data.data.forEach(element => {
          element.rewards[0].time = moment(element.rewards[0].time).format(
            "MMMM Do YYYY, h:mm a"
          );
        });
      })
      .catch(function(err) {
        if (err.response.status == 401) {
          context.redirect("/logout");
        }
      });
    data.query = context.query;
    data.requested = "requested";
    if (data.query.type == "CLOSED") data.requested = "collected";
    return { query: context.query, data };
  },
  head () {
    return {
      title: "Asset Building Clinic : View special details about your reward",
      meta: [
        { hid: 'description', name: 'description', content: 'View special details about your reward' }
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
    const token = this.$cookies.get("token");
    const refresh_token = this.$cookies.get("refresh_token");

    if (!to.query.sort) to.query.sort = "";
    if (!to.query.search) to.query.search = "";
    if (!to.query.order) to.query.order = "";
    if (!to.query.page) to.query.page = 1;
    if (!to.query.type) to.query.type = "OPEN";

    let data;
    await axios
      .get(
        `/api/rewards/${this.$route.params.id}/details?type=${
          to.query.type
        }&sort=${to.query.sort}&order=${to.query.order}&search=${
          to.query.search
        }&page=${to.query.page}`,
        {
          headers: { Cookie: `token=${token}; refresh_token=${refresh_token};` }
        }
      )
      .then(function(res) {
        data = res.data;
        //Loop through data and format date
        if (to.query.type != "REVIEWS")
        data.data.forEach(element => {
          element.rewards[0].time = moment(element.rewards[0].time).format(
            "MMMM Do YYYY, h:mm a"
          );
        });
      })
      .catch(function(err) {
        if (err.response.status == 401) {
          vue_context.$router.redirect("/logout");
        }
      });
    data.query = this.$route.query;
    data.requested = "requested";
    if (data.query.type == "CLOSED") data.requested = "collected";
    vue_context.query = to.query;
    vue_context.data = data;
    next();
  },
  methods: {
    navigateTo(index) {
      var element = this.$refs["acts_come_here"];
      var top = element.offsetTop;

      scrollToElement(element);
      // window.scrollTo(0, top);

      this.$router.push(
        `/rewards/${this.$route.params.id}/details?type=${this.query.type}&sort=${this.query.sort}&order=${
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
      this.$router.push(
        `/rewards/${this.$route.params.id}/details?type=${this.query.type}`
      );
    },
    type_changed() {
      // console.log(this.query.type);
      this.$router.push(
        `/rewards/${this.$route.params.id}/details?type=${this.query.type}`
      );
    },
    showReward() {
      this.$router.push("/rewards/" + this.$route.params.id);
    },
    async confirmCollection(index) {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");
      //Save row
      this.deleted_acts[index] = this.data.data[index];
      //Remove from screen
      this.data.data.splice(index, 1);
      //Send request to confirm collection
      this.data.sum = this.data.sum + this.data.reward.value;
      //Add the value of this reward to the accumulated sum
      await axios
        .put(
          `/api/rewards/${vue_context.$route.params.id}/user/${
            vue_context.deleted_acts[index]._id
          }/collected`,
          {
            headers: {
              Cookie: `token=${token}; refresh_token=${refresh_token};`
            }
          }
        )
        .catch(function(err) {
          //If error
          //Remove the value of this reward from the accumulated sum
          vue_context.data.sum =
            vue_context.data.sum - vue_context.data.reward.value;
          //Place on screen
          vue_context.data.data.splice(
            index,
            0,
            vue_context.deleted_acts[index]
          );
          //Display error
          izitoast.error({
            title: "Error",
            message: "Sorry, the request could not be sent",
            position: "topRight"
          });
        });
    },
    async search() {
      this.$router.push(
        `/rewards/${this.$route.params.id}/details?type=${
          this.query.type
        }&sort=${this.query.sort}&order=${this.query.order}&search=${
          vue_context.query.search
        }
        `
      );
    },
  }
};
</script>

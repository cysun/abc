<template>
  <div>
    <my-header :logged_in="logged_in" :page="page" :roles="data.roles"/>
    <my-banner title="User reviews"/>
    <section class="banner-bottom-w3ls-agileinfo py-5">
      <div class="container py-md-3">
        <div ref="acts_come_here">
          <div class="comment-top w3-agile-grid">
            <h4>{{$t('reviews')}}</h4>
            <div class="media mb-3" v-for="(user, index) in data.data">
              <div class="media-body">
                <h5 class="mt-0">{{user.first_name}} {{user.last_name}}</h5>
                <p>{{$t('reward_rating')}} : {{user.user_review_of_act.act_rating}}</p>
                <p
                  v-if="user.user_review_of_act.act_comments"
                >{{user.user_review_of_act.act_comments}}</p>
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

    if (!context.query.page) context.query.page = 1;

    let data;
    await axios
      .get(
        `/api/acts/${context.route.params.id}/details?page=${
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
    // console.log(data);
    data.query = context.query;
    data.requested = "requested";
    if (data.query.type == "CLOSED") data.requested = "collected";
    return { query: context.query, data };
  },
  head() {
    return {
      title: "Asset Building Clinic : View special details about your reward",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "View this act's reviews"
        }
      ]
    };
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

    if (!to.query.page) to.query.page = 1;

    let data;
    await axios
      .get(`/api/acts/${this.$route.params.id}/details?page=${to.query.page}`, {
        headers: { Cookie: `token=${token}; refresh_token=${refresh_token};` }
      })
      .then(function(res) {
        data = res.data;
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
    previous() {
      this.$router.push(
        `/acts/${this.$route.params.id}/details?page=${this.data.query.page -
          1}`
      );
    },
    next() {
      this.$router.push(
        `/acts/${this.$route.params.id}/details?page=${1 +
          this.data.query.page}`
      );
    },
  }
};
</script>

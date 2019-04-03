<template>
  <div>
    <my-header :logged_in="logged_in" :page="page" :roles="data.roles"/>
    <my-banner :title="title"/>
    <section class="banner-bottom-w3ls-agileinfo py-5">
      <div class="container py-md-3">
        <table ref="acts_come_here" class="table table-striped table-hover">
          <thead>
            <th scope="col" data-type="string">{{$t('users_name')}}</th>
            <th scope="col" data-type="number">{{$t('act_name')}}</th>
            <th scope="col" data-role="annotation">{{$t('Reward_points')}}</th>
            <th scope="col" data-role="annotation">{{$t('proof')}}</th>
            <th scope="col" data-role="annotation">{{$t('approve')}}</th>
            <th scope="col" data-role="annotation">{{$t('reject')}}</th>
            <th scope="col" data-role="annotation">{{$t('details')}}</th>
          </thead>
          <template v-for="(act, index) in data.acts">
            <tr v-for="(user, user_index) in act.users_under_review">
              <td>{{user.first_name}} {{user.last_name}}</td>
              <td>{{act.name}}</td>
              <td>{{act.reward_points}}</td>
              <td>
                  <a
                  tabindex="0"
                  style="cursor: pointer"
                    data-toggle="popover"
                    title="Click on a file to view"
                    :data-content="user.popover_html"
                    data-trigger="focus"
                    data-html="true"
                  >{{$t('view_proofs')}}</a>
                <!-- <a href="this.proof_of_completion">View Proof</a> -->
              </td>
              <td>
                <button @click="approve(act._id, user.id, index, user_index)" class="btn btn-success">{{$t('approve')}}</button>
              </td>
              <td>
                <input type="text" v-model="user.reject_comment" @keyup.enter="reject(act._id, user.id, index, user_index)" class="form-control" name="reason">
                <!-- <button type="submit" class="btn btn-danger" name="choice" value="reject">{{$t('reject')}}</button> -->
              </td>
              <td>
                <nuxt-link :to="'/acts/' + act._id">
                  <button class="btn btn-primary">{{$t('details')}}</button>
                </nuxt-link>
              </td>
            </tr>
          </template>
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
    $(document).ready(function() {
      $('[data-toggle="popover"]').popover();
    });
  },
  async fetch(context) {},
  async asyncData(context) {
    const token = context.app.$cookies.get("token");
    const refresh_token = context.app.$cookies.get("refresh_token");

    //Get paginated acts that have users in review
    if (!context.query.page) context.query.page = 1;
    let data;
    await axios
      .get(`/api/acts/review?page=${context.query.page}`, {
        headers: { Cookie: `token=${token}; refresh_token=${refresh_token};` }
      })
      .then(function(res) {
        data = res.data;
      })
      .catch(function(err) {
        if (err.response.status == 401) {
          context.redirect("/logout");
          // console.log(err);
        }
      });
    //Create popover of proofs
    data.acts.forEach(element => {
      element.users_under_review.forEach(element => {
        let user = element;
        if (!user.popover_html) user.popover_html = "";
        element.proof_of_completion.forEach(element => {
          user.popover_html += `<div><a href='/api/acts/manage_proof/${element._id}'>${element.original_name}</a></div>`;
        });
      });
    });
    return { query: context.query, data };
  },
  head () {
    return {
      title: "Asset Building Clinic : Manage proofs",
      meta: [
        { hid: 'description', name: 'description', content: 'Manage proofs on ABC' }
      ]
    }
  },
  data() {
    return {
      title: "manage_proofs",
      error: "",
      status_message: "",
      status_state: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      image: null,
      logged_in: true,
      page: "manage_proofs",
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
    approve(act_id, user_id, act_index, user_index)
    {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");
      //Save current location
      if (!this.data.saved_acts)
      this.data.saved_acts = {
        [act_index]: {
          user_index: user_index,
          user_proof: this.data.acts[act_index].users_under_review[user_index]
          }
      };
      else
      this.data.saved_acts[act_index] = {
          user_index: user_index,
          user_proof: this.data.acts[act_index].users_under_review[user_index]
          }
      //Remove row from screen
      this.data.acts[act_index].users_under_review.splice(user_index, 1);
      
      //If error
      //Return row to screen
      //Display error
      //Send request to approve this user_act
      axios
        .put(`/api/acts/${act_id}/user/${user_id}/approve`, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .then(function(res) {
        })
        .catch(function(err) {
        });
    },
    reject(act_id, user_id, act_index, user_index, value)
    {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");
      //Save current location
      if (!this.data.saved_acts)
      this.data.saved_acts = {
        [act_index]: {
          user_index: user_index,
          user_proof: this.data.acts[act_index].users_under_review[user_index]
          }
      };
      else
      this.data.saved_acts[act_index] = {
          user_index: user_index,
          user_proof: this.data.acts[act_index].users_under_review[user_index]
          }
      
      
      //If error
      //Return row to screen
      //Display error
      //Send request to approve this user_act
      const params = new URLSearchParams();

        params.append("comments", this.data.acts[act_index].users_under_review[user_index].reject_comment);
      axios
        .put(`/api/acts/${act_id}/user/${user_id}/disapprove`, params, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .then(function(res) {
        })
        .catch(function(err) {
        });
        //Remove row from screen
      this.data.acts[act_index].users_under_review.splice(user_index, 1);
    },
    navigateTo(index) {
      var element = this.$refs["acts_come_here"];
      var top = element.offsetTop;

      scrollToElement(element);
      // window.scrollTo(0, top);

      this.$router.push(`/manage/proofs?page=${index}`);
    },
    previous() {
      // console.log(this.data.query.page - 1)
      this.navigateTo(this.data.query.page - 1);
    },
    next() {
      // console.log(parseInt(this.data.query.page) + 1)
      this.navigateTo(parseInt(this.data.query.page) + 1);
    },
  }
};
</script>

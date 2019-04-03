<template>
  <div>
    <div class="page-container">
      <div class="left-content">
        <div class="mother-grid-inner">
          <my-header/>
          <!-- /script-for sticky-nav -->
          <!--inner block start here-->
          <div class="inner-block" ref="acts_come_here">
            <div class="text-center">
              <h1>Users relationship with this act</h1>
            </div>
            <div class="chit-chat-layer1">
              <div class="col-md-2"></div>
              <div class="col-md-8 chit-chat-layer1">
                <div class="work-progres">
                  <div class="form-inline text-center">
                    <div class="form-group" style="margin-right: 10px">
                      <span style="margin-right: 10px">
                        <input
                          type="text"
                          name="search"
                          v-model="query.search"
                          class="form-control"
                          placeholder="Search (Last name)"
                          @keyup.enter="search"
                        >
                        <select class="form-control" name="sort" v-model="query.sort">
                          <option value disabled :selected="!query.sort">{{$t('sort_by')}}</option>
                          <option
                            value="first_name"
                            :selected="query.sort == 'first_name'"
                          >First name</option>
                          <option
                            value="last_name"
                            :selected="query.sort == 'last_name'"
                          >Last name</option>
                          <option value="time" :selected="query.sort == 'time'">Date</option>
                        </select>

                        <select class="form-control" name="order" v-model="query.order">
                          <option value disabled :selected="!query.order">{{$t('sort_direction')}}</option>
                          <option value="1" :selected="query.order == '1'">{{$t('ascending')}}</option>
                          <option value="-1" :selected="query.order == '-1'">{{$t('descending')}}</option>
                        </select>

                        <select
                          @change="type_changed"
                          class="form-control"
                          name="type"
                          v-model="query.type"
                        >
                          <option
                            value="COMPLETED"
                            :selected="!query.type == 'COMPLETED'"
                          >{{$t('completed')}}</option>
                          <option
                            value="UNDER_REVIEW"
                            :selected="!query.type == 'UNDER_REVIEW'"
                          >{{$t('under_review')}}</option>
                          <option
                            value="REJECTED"
                            :selected="!query.type == 'REJECTED'"
                          >{{$t('rejected')}}</option>
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
                  <div class="chit-chat-heading">{{$t('acts')}}</div>
                  <div class="table-responsive">
                    <table class="table table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>User's name</th>
                          <th>Proof of completion</th>
                          <th v-if="query.type == 'REJECTED'">Review of proof</th>
                          <th>Reviewer's name</th>
                          <th>Time</th>
                          
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(act, index) in data.users">
                          <td>{{index + 1}}</td>
                          <td>{{act.completed_users.first_name}} {{act.completed_users.last_name}}</td>
                          <td>
                            <a
                              tabindex="0"
                              style="cursor: pointer"
                              data-toggle="popover"
                              title="Click on a file to view"
                              :data-content="act.completed_users.popover_html"
                              data-trigger="focus"
                              data-html="true"
                            >{{$t('view_proofs')}}</a>
                            <!-- <a href="this.proof_of_completion">View Proof</a> -->
                          </td>
                          <td v-if="query.type == 'REJECTED'">{{act.completed_users.review_of_proof.comments}}</td>
                          <td>{{act.completed_users.review_of_proof.reviewer_name}}</td>
                          <td>{{act.completed_users.time}}</td>
                         
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
              </div>
              
              <div class="clearfix"></div>
            </div>
          </div>
          <!--inner block end here-->
          <!--copy rights start here-->
          <my-footer/>
          <!--COPY rights end here-->
        </div>
      </div>
      <my-sidebar/>
      <div class="clearfix"></div>
    </div>
    <!--slide bar menu end here-->
  </div>
</template>
<script>
import axios from "~/plugins/axios";
import moment from "moment";
import MySidebar from "~/components/Admin_Sidebar.vue";
import MyHeader from "~/components/Admin_Header.vue";
import MyFooter from "~/components/Admin_Footer.vue";
import scrollToElement from "scroll-to-element";
let vue_context;

export default {
  layout: "admin",
  components: {
    MySidebar,
    MyHeader,
    MyFooter
  },
  created: function() {
    vue_context = this;
  },
  head() {
    return {
      title: "Asset Building Clinic : View acts",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "View details of an act"
        }
      ]
    };
  },
  async asyncData(context) {
    const token = context.app.$cookies.get("token");
    const refresh_token = context.app.$cookies.get("refresh_token");

    if (!context.query.sort) context.query.sort = "";
    if (!context.query.search) context.query.search = "";
    if (!context.query.order) context.query.order = "";
    if (!context.query.page) context.query.page = 1;
    if (!context.query.type) context.query.type = "COMPLETED";

    let data;
    // console.log(context)
    await axios
      .get(
        `/api/admin/acts/${context.params.id}/users/${
          context.query.page
        }?search=${context.query.search}&type=${context.query.type}&sort=${context.query.sort}&order=${
          context.query.order
        }&page=${context.query.page}`,
        {
          headers: { Cookie: `token=${token}; refresh_token=${refresh_token};` }
        }
      )
      .then(function(res) {
        data = res.data;
        // Loop through data and format date
        //Create popover of proofs
        console.log(data);
        data.users.forEach(element => {
          let user = element.completed_users;
          element.completed_users.time = moment(
            element.completed_users.time
          ).format("MMMM Do YYYY");
          if (!user.popover_html) user.popover_html = "";
          element.completed_users.proof_of_completion.forEach(element => {
            user.popover_html += `<div><a href='/api/acts/admin_proof/${
              element._id
            }'>${element.original_name}</a></div>`;
          });
        });
      })
      .catch(function(err) {
        console.log(err);
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
    if (!to.query.type) to.query.type = "COMPLETED";

    let data;
    await axios
      .get(
        `/api/admin/acts/${to.params.id}/users/${
          to.query.page
        }?search=${to.query.search}&type=${to.query.type}&sort=${to.query.sort}&order=${
          to.query.order
        }&page=${to.query.page}`,
        {
          headers: { Cookie: `token=${token}; refresh_token=${refresh_token};` }
        }
      )
      .then(function(res) {
        data = res.data;
        console.log(data);
        data.users.forEach(element => {
          let user = element.completed_users;
          element.completed_users.time = moment(
            element.completed_users.time
          ).format("MMMM Do YYYY");
          if (!user.popover_html) user.popover_html = "";
          element.completed_users.proof_of_completion.forEach(element => {
            user.popover_html += `<div><a href='/api/acts/admin_proof/${
              element._id
            }'>${element.original_name}</a></div>`;
          });
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
  mounted() {
    var toggle = true;

    $(".sidebar-icon").click(function() {
      if (toggle) {
        $(".page-container")
          .addClass("sidebar-collapsed")
          .removeClass("sidebar-collapsed-back");
        $("#menu span").css({ position: "absolute" });
      } else {
        $(".page-container")
          .removeClass("sidebar-collapsed")
          .addClass("sidebar-collapsed-back");
        setTimeout(function() {
          $("#menu span").css({ position: "relative" });
        }, 400);
      }
      toggle = !toggle;
    });

    $(document).ready(function() {
      $('[data-toggle="popover"]').popover();
    });
  },
  methods: {
    async search() {
      this.$router.push(
        `/admin/acts/${this.$route.params.id}/users?sort=${
          this.query.sort
        }&order=${this.query.order}&search=${this.query.search}&type=${this.query.type}
        `
      );
    },
    type_changed() {
      this.$router.push(`/admin/acts/${this.$route.params.id}/users?type=${this.query.type}`);
    },
    navigateTo(index) {
      var element = this.$refs["acts_come_here"];
      var top = element.offsetTop;
      scrollToElement(element);

      this.$router.push(
        `/admin/acts?sort=${this.query.sort}&order=${this.query.order}&search=${
          vue_context.query.search
        }&page=${index}
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
      this.$router.push(`/admin/acts/${this.$route.params.id}/users?type=${this.query.type}`);
    }
  }
};
</script>
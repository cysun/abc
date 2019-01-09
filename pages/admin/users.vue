<template>
  <div>
    <div class="page-container">
      <div class="left-content">
        <div class="mother-grid-inner">
          <my-header/>
          <!-- script-for sticky-nav -->
          <!-- /script-for sticky-nav -->
          <!--inner block start here-->
          <div class="inner-block" ref="acts_come_here">
            <div class="chit-chat-layer1">
              <div class="col-md-3"></div>
              <div class="col-md-6 chit-chat-layer1">
                <div class="work-progres">
                  <div class="form-inline text-center">
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
                        <select
                          :disabled="query.type == 'REVIEWS'"
                          class="form-control"
                          name="sort"
                          v-model="query.sort"
                        >
                          <option value disabled :selected="!query.sort">Sort by</option>
                          <option
                            value="creation_date"
                            :selected="query.sort == 'creation_date'"
                          >Date</option>
                          <option
                            value="first_name"
                            :selected="query.sort == 'first_name'"
                          >First Name</option>
                          <option value="last_name" :selected="query.sort == 'last_name'">Last Name</option>
                        </select>
                        
                        <select
                          :disabled="query.type == 'REVIEWS'"
                          class="form-control"
                          name="order"
                          v-model="query.order"
                        >
                          <option value disabled :selected="!query.order">Sort direction</option>
                          <option value="1" :selected="query.order == '1'">Ascending</option>
                          <option value="-1" :selected="query.order == '-1'">Descending</option>
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
                  <div class="chit-chat-heading">Users</div>
                  <div class="table-responsive">
                    <table class="table table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>First name</th>
                          <th>Last name</th>
                          <th>Verified</th>
                          <th>Registration Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(user, index) in data.data">
                          <td>{{index + 1}}</td>
                          <td>{{user.first_name}}</td>
                          <td>{{user.last_name}}</td>
                          <td>
                            <span class="label label-danger">{{user.enabled}}</span>
                          </td>
                          <td>
                            <span class="badge badge-info">{{user.creation_date}}</span>
                          </td>
                          <td>
                            <nuxt-link :to="'/user/' + user._id + '/edit'">
                              <button class="btn btn-primary">Edit</button>
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
                          <a class="page-link" @click="previous">Previous</a>
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
                          <a class="page-link" @click="next">Next</a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
              <!-- <div class="col-md-6 chit-chat-layer1-left">
                <div class="work-progres">
                  <div class="chit-chat-heading">Recent acts</div>
                  <div class="table-responsive">
                    <table class="table table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Poster's name</th>
                          <th>Act's name</th>
                          <th>Verified</th>
                          <th>Creation time</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(act, index) in data.acts">
                          <td>{{index + 1}}</td>
                          <td>{{act.act_provider.first_name}} {{act.act_provider.last_name}}</td>
                          <td>{{act.name}}</td>
                          <td>
                            <span class="label label-danger">{{act.enabled.state}}</span>
                          </td>
                          <td>
                            <span class="badge badge-info">{{act.creation_date}}</span>
                          </td>
                          <td>
                            <nuxt-link :to="'/admin/edit/act/' + act._id">
                              <button class="btn btn-primary">Edit</button>
                            </nuxt-link>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>-->
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
  async asyncData(context) {
    const token = context.app.$cookies.get("token");
    const refresh_token = context.app.$cookies.get("refresh_token");

    if (!context.query.sort) context.query.sort = "";
    if (!context.query.search) context.query.search = "";
    if (!context.query.order) context.query.order = "";
    if (!context.query.page) context.query.page = 1;

    // console.log(context.app.$cookies.getAll());
    // console.log(context.req.headers.cookie);
    let data;
    // console.log(context)
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
      .catch(function(err) {});
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
      .catch(function(err) {});
    vue_context.query = to.query;
    vue_context.data = data;
    next();
  },
  mounted() {
    $(document).ready(function() {
      var navoffeset = $(".header-main").offset().top;
      $(window).scroll(function() {
        var scrollpos = $(window).scrollTop();
        if (scrollpos >= navoffeset) {
          $(".header-main").addClass("fixed");
        } else {
          $(".header-main").removeClass("fixed");
        }
      });
    });

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
  },
  methods: {
    async search() {
      this.$router.push(
        `/admin/users/?&sort=${this.query.sort}&order=${
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
        `/admin/users?sort=${this.query.sort}&order=${
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
      this.$router.push(`/admin/users`);
    }
  }
};
</script>
<template>
  <div>
    <div class="page-container">
      <div class="left-content">
        <div class="mother-grid-inner">
          <!--header start here-->
          <div class="header-main">
            <div class="header-left">
              <div class="logo-name">
                <a href="index.html">
                  <h1>Shoppy</h1>
                  <!--<img id="logo" src="" alt="Logo"/>-->
                </a>
              </div>
              <!--search-box-->
              <div class="search-box">
                <form>
                  <input type="text" placeholder="Search..." required>
                  <input type="submit" value>
                </form>
              </div>
              <!--//end-search-box-->
              <div class="clearfix"></div>
            </div>
            <div class="header-right">
              <div class="profile_details_left">
                <!--notifications of menu start -->
                <ul class="nofitications-dropdown">
                  <li class="dropdown head-dpdn">
                    <a
                      href="#"
                      class="dropdown-toggle"
                      data-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i class="fa fa-envelope"></i>
                      <span class="badge">3</span>
                    </a>
                    <ul class="dropdown-menu">
                      <li>
                        <div class="notification_header">
                          <h3>You have 3 new messages</h3>
                        </div>
                      </li>
                      <li>
                        <a href="#">
                          <div class="user_img">
                            <img src="/images/admin/p4.png" alt>
                          </div>
                          <div class="notification_desc">
                            <p>Lorem ipsum dolor</p>
                            <p>
                              <span>1 hour ago</span>
                            </p>
                          </div>
                          <div class="clearfix"></div>
                        </a>
                      </li>
                      <li class="odd">
                        <a href="#">
                          <div class="user_img">
                            <img src="/images/admin/p2.png" alt>
                          </div>
                          <div class="notification_desc">
                            <p>Lorem ipsum dolor</p>
                            <p>
                              <span>1 hour ago</span>
                            </p>
                          </div>
                          <div class="clearfix"></div>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <div class="user_img">
                            <img src="/images/admin/p3.png" alt>
                          </div>
                          <div class="notification_desc">
                            <p>Lorem ipsum dolor</p>
                            <p>
                              <span>1 hour ago</span>
                            </p>
                          </div>
                          <div class="clearfix"></div>
                        </a>
                      </li>
                      <li>
                        <div class="notification_bottom">
                          <a href="#">See all messages</a>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li class="dropdown head-dpdn">
                    <a
                      href="#"
                      class="dropdown-toggle"
                      data-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i class="fa fa-bell"></i>
                      <span class="badge blue">3</span>
                    </a>
                    <ul class="dropdown-menu">
                      <li>
                        <div class="notification_header">
                          <h3>You have 3 new notification</h3>
                        </div>
                      </li>
                      <li>
                        <a href="#">
                          <div class="user_img">
                            <img src="/images/admin/p5.png" alt>
                          </div>
                          <div class="notification_desc">
                            <p>Lorem ipsum dolor</p>
                            <p>
                              <span>1 hour ago</span>
                            </p>
                          </div>
                          <div class="clearfix"></div>
                        </a>
                      </li>
                      <li class="odd">
                        <a href="#">
                          <div class="user_img">
                            <img src="/images/admin/p6.png" alt>
                          </div>
                          <div class="notification_desc">
                            <p>Lorem ipsum dolor</p>
                            <p>
                              <span>1 hour ago</span>
                            </p>
                          </div>
                          <div class="clearfix"></div>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <div class="user_img">
                            <img src="/images/admin/p7.png" alt>
                          </div>
                          <div class="notification_desc">
                            <p>Lorem ipsum dolor</p>
                            <p>
                              <span>1 hour ago</span>
                            </p>
                          </div>
                          <div class="clearfix"></div>
                        </a>
                      </li>
                      <li>
                        <div class="notification_bottom">
                          <a href="#">See all notifications</a>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li class="dropdown head-dpdn">
                    <a
                      href="#"
                      class="dropdown-toggle"
                      data-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i class="fa fa-tasks"></i>
                      <span class="badge blue1">9</span>
                    </a>
                    <ul class="dropdown-menu">
                      <li>
                        <div class="notification_header">
                          <h3>You have 8 pending task</h3>
                        </div>
                      </li>
                      <li>
                        <a href="#">
                          <div class="task-info">
                            <span class="task-desc">Database update</span>
                            <span class="percentage">40%</span>
                            <div class="clearfix"></div>
                          </div>
                          <div class="progress progress-striped active">
                            <div class="bar yellow" style="width:40%;"></div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <div class="task-info">
                            <span class="task-desc">Dashboard done</span>
                            <span class="percentage">90%</span>
                            <div class="clearfix"></div>
                          </div>
                          <div class="progress progress-striped active">
                            <div class="bar green" style="width:90%;"></div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <div class="task-info">
                            <span class="task-desc">Mobile App</span>
                            <span class="percentage">33%</span>
                            <div class="clearfix"></div>
                          </div>
                          <div class="progress progress-striped active">
                            <div class="bar red" style="width: 33%;"></div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <div class="task-info">
                            <span class="task-desc">Issues fixed</span>
                            <span class="percentage">80%</span>
                            <div class="clearfix"></div>
                          </div>
                          <div class="progress progress-striped active">
                            <div class="bar blue" style="width: 80%;"></div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <div class="notification_bottom">
                          <a href="#">See all pending tasks</a>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
                <div class="clearfix"></div>
              </div>
              <!--notification menu end -->
              <div class="profile_details">
                <ul>
                  <li class="dropdown profile_details_drop">
                    <a
                      href="#"
                      class="dropdown-toggle"
                      data-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div class="profile_img">
                        <span class="prfil-img">
                          <img src="/images/admin/p1.png" alt>
                        </span>
                        <div class="user-name">
                          <p>Malorum</p>
                          <span>Administrator</span>
                        </div>
                        <i class="fa fa-angle-down lnr"></i>
                        <i class="fa fa-angle-up lnr"></i>
                        <div class="clearfix"></div>
                      </div>
                    </a>
                    <ul class="dropdown-menu drp-mnu">
                      <li>
                        <a href="#">
                          <i class="fa fa-cog"></i> Settings
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i class="fa fa-user"></i> Profile
                        </a>
                      </li>
                      <li>
                        <nuxt-link to="/acts">
                          <i class="fa fa-user"></i> Home
                        </nuxt-link>
                      </li>
                      <li>
                        <a href="#">
                          <i class="fa fa-sign-out"></i> Logout
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div class="clearfix"></div>
            </div>
            <div class="clearfix"></div>
          </div>
          <!--heder end here-->
          <!-- script-for sticky-nav -->
          <!-- /script-for sticky-nav -->
          <!--inner block start here-->
          <div class="inner-block" ref="acts_come_here">
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
                          placeholder="Search"
                          @keyup.enter="search"
                        >
                        <select class="form-control" name="sort" v-model="query.sort">
                          <option value disabled :selected="!query.sort">Sort by</option>
                          <option
                            value="creation_date"
                            :selected="query.sort == 'creation_date'"
                          >Date</option>
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
                  <div class="chit-chat-heading">Rewards</div>
                  <div class="table-responsive">
                    <table class="table table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Poster's name</th>
                          <th>Reward's name</th>
                          <th>Verified</th>
                          <th>State</th>
                          <th>Deleted</th>
                          <th>Creation Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(act, index) in data.data">
                          <td>{{index + 1}}</td>
                          <td>{{act.reward_provider.first_name}} {{act.reward_provider.last_name}}</td>
                          <td>{{act.name}}</td>
                          <td>
                            <span class="label label-danger">{{act.enabled}}</span>
                          </td>
                          <td>{{act.state}}</td>
                          <td>
                            <span class="label label-danger">{{act.deleted}}</span>
                          </td>
                          <td>
                            <span class="badge badge-info">{{act.creation_date}}</span>
                          </td>
                          <td>
                            <nuxt-link :to="'/admin/rewards/' + act._id + '/edit'">
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
          <div class="copyrights">
            <p>
              © 2016 Shoppy. All Rights Reserved | Design by
              <a
                href="http://w3layouts.com/"
                target="_blank"
              >W3layouts</a>
            </p>
          </div>
          <!--COPY rights end here-->
        </div>
      </div>
      <!--slider menu-->
      <div class="sidebar-menu">
        <div class="logo">
          <a href="#" class="sidebar-icon">
            <span class="fa fa-bars"></span>
          </a>
          <a href="#">
            <span id="logo"></span>
            <!--<img id="logo" src="" alt="Logo"/>-->
          </a>
        </div>
        <div class="menu">
          <ul id="menu">
            <li id="menu-home">
              <a href="index.html">
                <i class="fa fa-tachometer"></i>
                <span>Dashboard</span>
              </a>
            </li>
            <!-- <li>
              <nuxt-link to="/users">
                <i class="fa fa-users"></i>
                <span>Users</span>
              </nuxt-link>
            </li>-->
            <li>
              <a href="#">
                <i class="fa fa-users"></i>
                <span>Users</span>
                <span class="fa fa-angle-right" style="float: right"></span>
              </a>
              <ul>
                <li>
                  <nuxt-link to="/admin/add_user">Add User</nuxt-link>
                </li>
                <li>
                  <nuxt-link to="/admin/users">View Users</nuxt-link>
                </li>
              </ul>
            </li>
            <li>
              <a href="#">
                <i class="fa fa-cogs"></i>
                <span>Components</span>
                <span class="fa fa-angle-right" style="float: right"></span>
              </a>
              <ul>
                <li>
                  <a href="grids.html">Grids</a>
                </li>
                <li>
                  <a href="portlet.html">Portlets</a>
                </li>
              </ul>
            </li>
            <li id="menu-comunicacao">
              <a href="#">
                <i class="fa fa-book nav_icon"></i>
                <span>Element</span>
                <span class="fa fa-angle-right" style="float: right"></span>
              </a>
              <ul id="menu-comunicacao-sub">
                <li id="menu-mensagens" style="width: 120px">
                  <a href="buttons.html">Buttons</a>
                </li>
                <li id="menu-arquivos">
                  <a href="typography.html">Typography</a>
                </li>
                <li id="menu-arquivos">
                  <a href="icons.html">Icons</a>
                </li>
              </ul>
            </li>

            <li id="menu-academico">
              <a href="#">
                <i class="fa fa-file-text"></i>
                <span>Pages</span>
                <span class="fa fa-angle-right" style="float: right"></span>
              </a>
              <ul id="menu-academico-sub">
                <li id="menu-academico-boletim">
                  <a href="login.html">Login</a>
                </li>
                <li id="menu-academico-avaliacoes">
                  <a href="signup.html">Sign Up</a>
                </li>
              </ul>
            </li>

            <li>
              <a href="charts.html">
                <i class="fa fa-bar-chart"></i>
                <span>Charts</span>
              </a>
            </li>
            <li>
              <a href="#">
                <i class="fa fa-envelope"></i>
                <span>Mailbox</span>
                <span class="fa fa-angle-right" style="float: right"></span>
              </a>
              <ul id="menu-academico-sub">
                <li id="menu-academico-avaliacoes">
                  <a href="inbox.html">Inbox</a>
                </li>
                <li id="menu-academico-boletim">
                  <a href="inbox-details.html">Compose email</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#">
                <i class="fa fa-cog"></i>
                <span>System</span>
                <span class="fa fa-angle-right" style="float: right"></span>
              </a>
              <ul id="menu-academico-sub">
                <li id="menu-academico-avaliacoes">
                  <a href="404.html">404</a>
                </li>
                <li id="menu-academico-boletim">
                  <a href="blank.html">Blank</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#">
                <i class="fa fa-shopping-cart"></i>
                <span>E-Commerce</span>
                <span class="fa fa-angle-right" style="float: right"></span>
              </a>
              <ul id="menu-academico-sub">
                <li id="menu-academico-avaliacoes">
                  <a href="product.html">Product</a>
                </li>
                <li id="menu-academico-boletim">
                  <a href="price.html">Price</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div class="clearfix"></div>
    </div>
    <!--slide bar menu end here-->
  </div>
</template>
<script>
import axios from "~/plugins/axios";
import moment from "moment";
import scrollToElement from "scroll-to-element";
let vue_context;

export default {
  layout: "admin",
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
        `/api/admin/rewards?search=${context.query.search}&sort=${
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
        `/api/rewards?sort=${to.query.sort}&order=${to.query.order}&search=${
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
        `/admin/rewards/?&sort=${this.query.sort}&order=${
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
        `/admin/acts?sort=${this.query.sort}&order=${
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
      this.$router.push(`/admin/rewards`);
    }
  }
};
</script>
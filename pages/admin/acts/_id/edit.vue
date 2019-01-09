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
          <script>
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
          </script>
          <!-- /script-for sticky-nav -->
          <!--inner block start here-->
          <div class="inner-block">
            <div class="login-main">
              <div class="login-head">
                <h1>Edit Act</h1>
              </div>
              <div class="login-block">
                <form @submit.prevent="editAct">
                  <input type="hidden" name="id" value="this_user._id">
                  <label for="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Name"
                    v-model="data.act.name"
                  >
                  <label for="description">Description</label>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    placeholder="Description"
                    v-model="data.act.description"
                  >
                  <label for="reward_points">Reward Points</label>
                  <input
                    type="text"
                    name="reward_points"
                    placeholder="Reward Points"
                    id="reward_points"
                    v-model="data.act.reward_points"
                  >
                  <template v-if="data.act.__t == 'Event'">
                    <label for="start_time">Start Time</label>
                    <div
                      class="controls input-append date form_datetime"
                      data-date-format="yyyy-mm-ddThh:ii"
                      data-link-field="dtp_input1"
                    >
                      <input
                        size="16"
                        placeholder="Start time"
                        readonly
                        @change="start_time_changed"
                        type="text"
                        class="form-control"
                        id="start_time"
                        :value="data.act.start_time"
                      >
                      <span class="add-on">
                        <i class="icon-remove"></i>
                      </span>
                      <span class="add-on">
                        <i class="icon-th"></i>
                      </span>
                    </div>
                    <input type="hidden" @change="start_time_changed" id="dtp_input1" value>
                    <label for="end_time">End Time</label>
                    <div
                      class="controls input-append date form_datetime"
                      data-date-format="yyyy-mm-ddThh:ii"
                      data-link-field="dtp_input1"
                    >
                      <input
                        size="16"
                        placeholder="End Time"
                        readonly
                        @change="end_time_changed"
                        type="text"
                        class="form-control"
                        id="end_time"
                        :value="data.act.end_time"
                      >
                      <span class="add-on">
                        <i class="icon-remove"></i>
                      </span>
                      <span class="add-on">
                        <i class="icon-th"></i>
                      </span>
                    </div>
                  </template>
                  <h3>Tags</h3>
                  <div>
                    <!-- <span v-for="(tag, index) in data.act.tags">
                      <span style="margin-right: 2px" class="badge badge-secondary">{{tag.name}}</span>
                    </span>-->
                    <a
                      v-for="(tag, index) in data.act.tags"
                      tabindex="0"
                      style="margin-right: 5px; cursor: pointer"
                      class="badge badge-secondary"
                      @click="deleteTag(index)"
                    >{{tag.name}}</a>
                  </div>
                  <br>
                  <label for="tags">New Tags</label>
                  <input
                    type="text"
                    name="tags"
                    placeholder="New Tags (Seperate tags by a space)"
                    id="tags"
                    v-model="new_tags"
                  >
                  <br>
                  <div>
                    <a
                      tabindex="0"
                      style="cursor: pointer; margin-right: 1px"
                      class="badge badge-secondary"
                      @click="change_state()"
                    >{{data.act.enabled.state ? 'Enabled' : 'Disabled'}}</a>
                    <a
                      tabindex="0"
                      style="cursor: pointer; margin-right: 1px"
                      class="badge badge-secondary"
                      @click="change_act_state()"
                    >{{data.act.state}}</a>
                    <!-- <span style="margin-right: 1px" class="badge badge-secondary">{{data.act.state}}</span> -->
                    <span
                      v-if="data.act.deleted"
                      style="margin-right: 1px"
                      class="badge badge-secondary"
                    >Deleted</span>
                  </div>
                  <div class="forgot-top-grids">
                    <div class="clearfix"></div>
                  </div>
                  <input type="submit" name="edit" value="Edit">
                </form>
                <!-- <h5><a href="/">Go Back to Home</a></h5> -->
              </div>
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
            <li>
              <a href="maps.html">
                <i class="fa fa-map-marker"></i>
                <span>Maps</span>
              </a>
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
    <script>
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
    </script>
  </div>
</template>
<script>
import axios from "~/plugins/axios";
import moment from "moment";
let vue_context, iziToast;

export default {
  layout: "admin",
  created: function() {
    vue_context = this;
  },
  async mounted() {
    iziToast = require("iziToast");

    $(".form_datetime").datetimepicker({
      weekStart: 1,
      todayBtn: 1,
      autoclose: 1,
      todayHighlight: 1,
      startView: 2,
      forceParse: 0,
      showMeridian: 1
    });

    $(".form_datetime")
      .datetimepicker()
      .on("changeDate", function(e) {
        //Update fields
        vue_context.data.act.start_time = document.getElementById('start_time').value;
        vue_context.data.act.end_time = document.getElementById('end_time').value;
      });
  },
  data() {
    return {
      new_tags: ""
    };
  },
  methods: {
    async change_act_state() {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      const act_state = this.data.act.state;

      //Get new state
      let new_state;
      if (act_state == "AVAILABLE") new_state = "NOT_AVAILABLE";
      else new_state = "AVAILABLE";
      //Change state of act
      this.data.act.state = new_state;
      //Make request to change state of act

      await axios
        .put(`/api/acts/${vue_context.data.act._id}/state`, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .catch(function(err) {
          //If error, revert state of act
          this.data.act.state = act_state;
          //Tell the user that the act could not be altered
          iziToast.error({
            title: "Error",
            message: "Sorry, the state could not be altered",
            position: "topRight"
          });
        });
    },
    async change_state() {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      const state = this.data.act.enabled.state;

      //Change state
      this.data.act.enabled.state = !this.data.act.enabled.state;
      //Make request to change state of act

      await axios
        .put(
          `/api/acts/${vue_context.data.act._id}/enable/${
            vue_context.data.act.enabled.state
          }`,
          {
            headers: {
              Cookie: `token=${token}; refresh_token=${refresh_token};`
            }
          }
        )
        .catch(function(err) {
          //If error, revert state of act
          this.data.act.enabled.state = !this.data.act.enabled.state;
          //Tell the user that the act could not be altered
          iziToast.error({
            title: "Error",
            message: "Sorry, the state could not be altered",
            position: "topRight"
          });
        });
    },
    async deleteTag(tag_index) {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      //Save tag
      const saved_tag = this.data.act.tags[tag_index];
      const tag_id = this.data.act.tags[tag_index]._id;
      //remove tag from screen
      this.data.act.tags.splice(tag_index, 1);
      //Make request to delete tag
      await axios
        .delete(`/api/acts/${vue_context.data.act._id}/tag/${tag_id}`, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .catch(function(err) {
          //If error, place tag back
          vue_context.data.act.tags.splice(tag_index, 0, saved_tag);
          //Show error
          iziToast.error({
            title: "Error",
            message: err.response.data.message,
            position: "topRight"
          });
        });
    },
    start_time_changed(event) {
      console.log(event);
    },
    end_time_changed(event) {
      console.log(event);
    },
    async editAct() {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      //Edit this act
      const params = new URLSearchParams();

      params.append("name", this.data.act.name);
      params.append("description", this.data.act.description);
      params.append("reward_points", this.data.act.reward_points);
      if (this.data.act.start_time) {
        params.append(
          "start_time",
          this.data.act.start_time + 'Z'
        );
        params.append("end_time", this.data.act.end_time + 'Z');
      }
      if (this.new_tags) params.append("tags", this.new_tags);

      // //If this is an event, edit its start and end times
      // if (this.data.acts[index].__t == "Event") {
      //   params.append("start_time", start_time);
      //   params.append("end_time", end_time);
      // }

      await axios
        .put(`/api/acts/${vue_context.data.act._id}`, params, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .then(function(res) {
          vue_context.new_tags = "";
          //Replace this act tags
          vue_context.data.act.tags = res.data.tags;
          iziToast.success({
            title: "Success",
            message: `Changes were saved successfully`,
            position: "topRight"
          });
        })
        .catch(function(err) {
          iziToast.error({
            title: "Error",
            message: err.response.data.message,
            position: "topRight"
          });
        });
    }
  },
  async asyncData(context) {
    const token = context.app.$cookies.get("token");
    const refresh_token = context.app.$cookies.get("refresh_token");
    let data;
    await axios
      .get(`/api/acts/${context.params.id}`, {
        headers: { Cookie: `token=${token}; refresh_token=${refresh_token};` }
      })
      .then(function(res) {
        data = res.data;

        // if (data.act.__t == "Event") {
        //   data.act.start_time = moment(data.act.start_time).format(
        //     "MMMM Do YYYY, h:mm:ss a"
        //   );
        //   data.act.end_time = moment(data.act.end_time).format(
        //     "MMMM Do YYYY, h:mm:ss a"
        //   );
        // }

        data.act.start_time = data.act.start_time.substring(
          0,
          data.act.start_time.length - 8
        );
        data.act.end_time = data.act.end_time.substring(
          0,
          data.act.end_time.length - 8
        );
      })
      .catch(function(err) {});
    return { data };
  }
};
</script>
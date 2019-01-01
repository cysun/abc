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
                            <input type="text" placeholder="Search..." required="">
                            <input type="submit" value="">
                        </form>
                    </div>
                    <!--//end-search-box-->
                    <div class="clearfix"> </div>
                </div>
                <div class="header-right">
                    <div class="profile_details_left">
                        <!--notifications of menu start -->
                        <ul class="nofitications-dropdown">
                            <li class="dropdown head-dpdn">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i
                                        class="fa fa-envelope"></i><span class="badge">3</span></a>
                                <ul class="dropdown-menu">
                                    <li>
                                        <div class="notification_header">
                                            <h3>You have 3 new messages</h3>
                                        </div>
                                    </li>
                                    <li><a href="#">
                                            <div class="user_img"><img src="/images/admin/p4.png" alt=""></div>
                                            <div class="notification_desc">
                                                <p>Lorem ipsum dolor</p>
                                                <p><span>1 hour ago</span></p>
                                            </div>
                                            <div class="clearfix"></div>
                                        </a></li>
                                    <li class="odd"><a href="#">
                                            <div class="user_img"><img src="/images/admin/p2.png" alt=""></div>
                                            <div class="notification_desc">
                                                <p>Lorem ipsum dolor </p>
                                                <p><span>1 hour ago</span></p>
                                            </div>
                                            <div class="clearfix"></div>
                                        </a></li>
                                    <li><a href="#">
                                            <div class="user_img"><img src="/images/admin/p3.png" alt=""></div>
                                            <div class="notification_desc">
                                                <p>Lorem ipsum dolor</p>
                                                <p><span>1 hour ago</span></p>
                                            </div>
                                            <div class="clearfix"></div>
                                        </a></li>
                                    <li>
                                        <div class="notification_bottom">
                                            <a href="#">See all messages</a>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                            <li class="dropdown head-dpdn">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i
                                        class="fa fa-bell"></i><span class="badge blue">3</span></a>
                                <ul class="dropdown-menu">
                                    <li>
                                        <div class="notification_header">
                                            <h3>You have 3 new notification</h3>
                                        </div>
                                    </li>
                                    <li><a href="#">
                                            <div class="user_img"><img src="/images/admin/p5.png" alt=""></div>
                                            <div class="notification_desc">
                                                <p>Lorem ipsum dolor</p>
                                                <p><span>1 hour ago</span></p>
                                            </div>
                                            <div class="clearfix"></div>
                                        </a></li>
                                    <li class="odd"><a href="#">
                                            <div class="user_img"><img src="/images/admin/p6.png" alt=""></div>
                                            <div class="notification_desc">
                                                <p>Lorem ipsum dolor</p>
                                                <p><span>1 hour ago</span></p>
                                            </div>
                                            <div class="clearfix"></div>
                                        </a></li>
                                    <li><a href="#">
                                            <div class="user_img"><img src="/images/admin/p7.png" alt=""></div>
                                            <div class="notification_desc">
                                                <p>Lorem ipsum dolor</p>
                                                <p><span>1 hour ago</span></p>
                                            </div>
                                            <div class="clearfix"></div>
                                        </a></li>
                                    <li>
                                        <div class="notification_bottom">
                                            <a href="#">See all notifications</a>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                            <li class="dropdown head-dpdn">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i
                                        class="fa fa-tasks"></i><span class="badge blue1">9</span></a>
                                <ul class="dropdown-menu">
                                    <li>
                                        <div class="notification_header">
                                            <h3>You have 8 pending task</h3>
                                        </div>
                                    </li>
                                    <li><a href="#">
                                            <div class="task-info">
                                                <span class="task-desc">Database update</span><span class="percentage">40%</span>
                                                <div class="clearfix"></div>
                                            </div>
                                            <div class="progress progress-striped active">
                                                <div class="bar yellow" style="width:40%;"></div>
                                            </div>
                                        </a></li>
                                    <li><a href="#">
                                            <div class="task-info">
                                                <span class="task-desc">Dashboard done</span><span class="percentage">90%</span>
                                                <div class="clearfix"></div>
                                            </div>
                                            <div class="progress progress-striped active">
                                                <div class="bar green" style="width:90%;"></div>
                                            </div>
                                        </a></li>
                                    <li><a href="#">
                                            <div class="task-info">
                                                <span class="task-desc">Mobile App</span><span class="percentage">33%</span>
                                                <div class="clearfix"></div>
                                            </div>
                                            <div class="progress progress-striped active">
                                                <div class="bar red" style="width: 33%;"></div>
                                            </div>
                                        </a></li>
                                    <li><a href="#">
                                            <div class="task-info">
                                                <span class="task-desc">Issues fixed</span><span class="percentage">80%</span>
                                                <div class="clearfix"></div>
                                            </div>
                                            <div class="progress progress-striped active">
                                                <div class="bar  blue" style="width: 80%;"></div>
                                            </div>
                                        </a></li>
                                    <li>
                                        <div class="notification_bottom">
                                            <a href="#">See all pending tasks</a>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <div class="clearfix"> </div>
                    </div>
                    <!--notification menu end -->
                    <div class="profile_details">
                        <ul>
                            <li class="dropdown profile_details_drop">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                    <div class="profile_img">
                                        <span class="prfil-img"><img src="/images/admin/p1.png" alt=""> </span>
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
                                    <li> <a href="#"><i class="fa fa-cog"></i> Settings</a> </li>
                                    <li> <a href="#"><i class="fa fa-user"></i> Profile</a> </li>
                                    <li> <nuxt-link to="/acts"><i class="fa fa-user"></i> Home</nuxt-link> </li>
                                    <li> <a href="#"><i class="fa fa-sign-out"></i> Logout</a> </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div class="clearfix"> </div>
                </div>
                <div class="clearfix"> </div>
            </div>
            <!--heder end here-->
            <!-- script-for sticky-nav -->
            <script>
                $(document).ready(function () {
                    var navoffeset = $(".header-main").offset().top;
                    $(window).scroll(function () {
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
                <!--market updates updates-->
                <div class="market-updates">
                    <div class="col-md-4 market-update-gd">
                        <div class="market-update-block clr-block-1">
                            <div class="col-md-8 market-update-left">
                                <h3>83</h3>
                                <h4>Registered User</h4>
                                <p>Other hand, we denounce</p>
                            </div>
                            <div class="col-md-4 market-update-right">
                                <i class="fa fa-file-text-o"> </i>
                            </div>
                            <div class="clearfix"> </div>
                        </div>
                    </div>
                    <div class="col-md-4 market-update-gd">
                        <div class="market-update-block clr-block-2">
                            <div class="col-md-8 market-update-left">
                                <h3>135</h3>
                                <h4>Daily Visitors</h4>
                                <p>Other hand, we denounce</p>
                            </div>
                            <div class="col-md-4 market-update-right">
                                <i class="fa fa-eye"> </i>
                            </div>
                            <div class="clearfix"> </div>
                        </div>
                    </div>
                    <div class="col-md-4 market-update-gd">
                        <div class="market-update-block clr-block-3">
                            <div class="col-md-8 market-update-left">
                                <h3>23</h3>
                                <h4>New Messages</h4>
                                <p>Other hand, we denounce</p>
                            </div>
                            <div class="col-md-4 market-update-right">
                                <i class="fa fa-envelope-o"> </i>
                            </div>
                            <div class="clearfix"> </div>
                        </div>
                    </div>
                    <div class="clearfix"> </div>
                </div>
                <!--market updates end here-->
                <!--mainpage chit-chating-->
                <div class="chit-chat-layer1">
                    <div class="col-md-6 chit-chat-layer1-left">
                        <div class="work-progres">
                            <div class="chit-chat-heading">
                                Recent registrations
                            </div>
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>First name</th>
                                            <th>Last name</th>
                                            <th>Verified</th>
                                            <th>Registration time</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        
                                        <tr v-for="(user, index) in data.users">
                                            <td>{{index + 1}}</td>
                                            <td>{{user.first_name}}</td>
                                            <td>{{user.last_name}}</td>
                                            <td><span class="label label-danger">{{user.enabled}}</span></td>
                                            <td><span class="badge badge-info">{{user.creation_date}}</span></td>
                                            <td><nuxt-link :to="'/admin/edit/user/' + user._id"><button class='btn btn-primary'>Edit</button></nuxt-link></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 chit-chat-layer1-left">
                        <div class="work-progres">
                            <div class="chit-chat-heading">
                                Recent acts
                            </div>
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Poster's First name</th>
                                            <th>Poster's Last name</th>
                                            <th>Verified</th>
                                            <th>Creation time</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        
                                        <tr v-for="(act, index) in data.acts">
                                            <td>{{index + 1}}</td>
                                            <td>{{act.act_provider.first_name}}</td>
                                            <td>{{act.act_provider.last_name}}</td>
                                            <td><span class="label label-danger">{{act.enabled.state}}</span></td>
                                            <td><span class="badge badge-info">{{act.creation_date}}</span></td>
                                            <td><nuxt-link :to="'/admin/edit/act/' + act._id"><button class='btn btn-primary'>Edit</button></nuxt-link></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="clearfix"> </div>
                </div>
                <div class="col-md-6 chit-chat-layer1-left">
                        <div class="work-progres">
                            <div class="chit-chat-heading">
                                Recent Rewards
                            </div>
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Poster's First name</th>
                                            <th>Poster's Last name</th>
                                            <th>Verified</th>
                                            <th>Creation time</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        
                                        <tr v-for="(reward, index) in data.rewards">
                                            <td>{{index + 1}}</td>
                                            <td>{{reward.reward_provider.first_name}}</td>
                                            <td>{{reward.reward_provider.last_name}}</td>
                                            <td><span class="label label-danger">{{reward.enabled}}</span></td>
                                            <td><span class="badge badge-info">{{reward.creation_date}}</span></td>
                                            <td><nuxt-link :to="'/admin/edit/reward/' + reward._id"><button class='btn btn-primary'>Edit</button></nuxt-link></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                

                <!--climate start here-->
                <div class="climate">
                    <div class="col-md-4 climate-grids">
                        <div class="climate-grid3">
                            <div class="popular-brand">
                                <div class="col-md-6 popular-bran-left">
                                    <h3>Popular</h3>
                                    <h4>Brand of this month</h4>
                                    <p> Duis aute irure in reprehenderit.</p>
                                </div>
                                <div class="col-md-6 popular-bran-right">
                                    <h3>Polo</h3>
                                </div>
                                <div class="clearfix"> </div>
                            </div>
                            <div class="popular-follow">
                                <div class="col-md-6 popular-follo-left">
                                    <p>Lorem ipsum dolor sit amet, adipiscing elit.</p>
                                </div>
                                <div class="col-md-6 popular-follo-right">
                                    <h4>Follower</h4>
                                    <h5>2892</h5>
                                </div>
                                <div class="clearfix"> </div>
                            </div>
                        </div>
                    </div>
                    <div class="clearfix"> </div>
                </div>
                <!--climate end here-->
            </div>
            <!--inner block end here-->
            <!--copy rights start here-->
            <div class="copyrights">
                <p>© 2016 Shoppy. All Rights Reserved | Design by <a href="http://w3layouts.com/" target="_blank">W3layouts</a>
                </p>
            </div>
            <!--COPY rights end here-->
        </div>
    </div>
    <!--slider menu-->
    <div class="sidebar-menu">
        <div class="logo"> <a href="#" class="sidebar-icon"> <span class="fa fa-bars"></span> </a> <a href="#"> <span
                    id="logo"></span>
                <!--<img id="logo" src="" alt="Logo"/>-->
            </a> </div>
        <div class="menu">
            <ul id="menu">
                <li id="menu-home"><a href="index.html"><i class="fa fa-tachometer"></i><span>Dashboard</span></a></li>
                <li><a href="#"><i class="fa fa-cogs"></i><span>Components</span><span class="fa fa-angle-right" style="float: right"></span></a>
                    <ul>
                        <li><a href="grids.html">Grids</a></li>
                        <li><a href="portlet.html">Portlets</a></li>
                    </ul>
                </li>
                <li id="menu-comunicacao"><a href="#"><i class="fa fa-book nav_icon"></i><span>Element</span><span
                            class="fa fa-angle-right" style="float: right"></span></a>
                    <ul id="menu-comunicacao-sub">
                        <li id="menu-mensagens" style="width: 120px"><a href="buttons.html">Buttons</a>
                        </li>
                        <li id="menu-arquivos"><a href="typography.html">Typography</a></li>
                        <li id="menu-arquivos"><a href="icons.html">Icons</a></li>
                    </ul>
                </li>
                <li><a href="maps.html"><i class="fa fa-map-marker"></i><span>Maps</span></a></li>
                <li id="menu-academico"><a href="#"><i class="fa fa-file-text"></i><span>Pages</span><span class="fa fa-angle-right"
                            style="float: right"></span></a>
                    <ul id="menu-academico-sub">
                        <li id="menu-academico-boletim"><a href="login.html">Login</a></li>
                        <li id="menu-academico-avaliacoes"><a href="signup.html">Sign Up</a></li>
                    </ul>
                </li>

                <li><a href="charts.html"><i class="fa fa-bar-chart"></i><span>Charts</span></a></li>
                <li><a href="#"><i class="fa fa-envelope"></i><span>Mailbox</span><span class="fa fa-angle-right" style="float: right"></span></a>
                    <ul id="menu-academico-sub">
                        <li id="menu-academico-avaliacoes"><a href="inbox.html">Inbox</a></li>
                        <li id="menu-academico-boletim"><a href="inbox-details.html">Compose email</a></li>
                    </ul>
                </li>
                <li><a href="#"><i class="fa fa-cog"></i><span>System</span><span class="fa fa-angle-right" style="float: right"></span></a>
                    <ul id="menu-academico-sub">
                        <li id="menu-academico-avaliacoes"><a href="404.html">404</a></li>
                        <li id="menu-academico-boletim"><a href="blank.html">Blank</a></li>
                    </ul>
                </li>
                <li><a href="#"><i class="fa fa-shopping-cart"></i><span>E-Commerce</span><span class="fa fa-angle-right"
                            style="float: right"></span></a>
                    <ul id="menu-academico-sub">
                        <li id="menu-academico-avaliacoes"><a href="product.html">Product</a></li>
                        <li id="menu-academico-boletim"><a href="price.html">Price</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
    <div class="clearfix"> </div>
</div>
<!--slide bar menu end here-->
<script>
    var toggle = true;

    $(".sidebar-icon").click(function () {
        if (toggle) {
            $(".page-container").addClass("sidebar-collapsed").removeClass("sidebar-collapsed-back");
            $("#menu span").css({ "position": "absolute" });
        }
        else {
            $(".page-container").removeClass("sidebar-collapsed").addClass("sidebar-collapsed-back");
            setTimeout(function () {
                $("#menu span").css({ "position": "relative" });
            }, 400);
        }
        toggle = !toggle;
    });
</script>
  </div>
</template>
<script>
import axios from "~/plugins/axios";

export default {
  layout: 'admin',
  async asyncData(context) {
    const token = context.app.$cookies.get("token");
    const refresh_token = context.app.$cookies.get("refresh_token");

    if (!context.query.sort) context.query.sort = "";
    if (!context.query.search) context.query.search = "";
    if (!context.query.order) context.query.order = "";
    if (!context.query.page) context.query.page = 1;
    if (!context.query.type) context.query.type = "AVAILABLE";

    // console.log(context.app.$cookies.getAll());
    // console.log(context.req.headers.cookie);
    let data;
    // console.log(context)
    await axios
      .get(
        `/api/admin`,
        {
          headers: { Cookie: `token=${token}; refresh_token=${refresh_token};` }
        }
      )
      .then(function(res) {
        // console.log("I ran");
        // //Redirect to verification page
        // vue_context.$nuxt.$loading.finish();
        // vue_context.$router.push({
        //   path: "/verify_account"
        // });
        // console.log(res);
        data = res.data;
        //Loop through data and format date
        // data.acts.forEach(element => {
        //   if (element.__t == "Event") {
        //     element.formated_start_time = moment(element.start_time).format(
        //       "MMMM Do YYYY, h:mm:ss a"
        //     );
        //     element.formated_end_time = moment(element.end_time).format(
        //       "MMMM Do YYYY, h:mm:ss a"
        //     );

        //     element.start_time = element.start_time.substring(0, element.start_time.length - 8);
        //     element.end_time = element.end_time.substring(0, element.end_time.length - 8);
        //   }
        // });
      })
      .catch(function(err) {
        // console.log(context.app.$cookies.getAll());
        // console.log(err.response.data.message);
        // if (err.response.status == 400) {
        //   context.redirect("/logout");
        // }
        // console.log(err.response.status);
        // vue_context.$nuxt.$loading.finish();
        // if (err.response) vue_context.error = err.response.data.message;
      });
    //If user is not logged in
    //Delete cookies and redirect to main page
    //If user is logged in, redirect to main page
    //Place acts in array of acts
    // context.redirect("/");
    //getCook("connect.sid", req.headers.cookie);
    // console.log(context.req.headers.cookie);
    //Check if user is logged in
    //If so, redirect to main page
    // if (process.server) {
    //   if (getCookie("token", context.req.headers.cookie)) {
    //     context.redirect("/");
    //   }
    // }
    // if (process.server)

    // console.log(context.query.sort);
    // context.query.sort = "Hello";
    // console.log(context.query);
    // context.query.sort = "Hello";
    return { data };
  },
  head() {
    return {
      // script: [
      //   { src: "js/admin/skycons.js" }
      //   // {
      //   //   src:
      //   //     "https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.9.0/fullcalendar.min.js"
      //   // }
      // ],
      // css: [
      //   '~/assets/css/admin/style.css'
      // ]
      // link: [
      //   {
      //     href:
      //       "https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.9.0/fullcalendar.min.css",
      //     rel: "stylesheet"
      //   }
      // ]
    };
  },
};
</script>
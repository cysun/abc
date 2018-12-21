<template>
  <div>
    <my-header :logged_in="logged_in" :page="page"/>
    <my-banner :title="title"/>
    <section class="banner-bottom-w3ls-agileinfo py-5">
      <!--/blog-->
      <div class="container py-md-3">
        <div class="form-inline justify-content-center">
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
                <option value="creation_date" :selected="query.sort == 'creation_date'">Date</option>
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
              
              <select @change="type_changed" class="form-control" name="type" v-model="query.type">
                <option value="AVAILABLE" :selected="!query.type == 'AVAILABLE'">Available</option>
                <option value="UNDER_REVIEW" :selected="!query.type == 'UNDER_REVIEW'">Under Review</option>
                <option value="COMPLETED" :selected="!query.type == 'COMPLETED'">Completed</option>
                <option value="REJECTED" :selected="!query.type == 'REJECTED'">Rejected</option>
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
        <br>
        <div class="row inner-sec-wthree-agileits">
          <div class="col-lg-8 blog-sp" ref="acts_come_here">
            <article
              style="margin-bottom: 10px"
              class="blog-x row"
              v-for="(act, index) in data.acts"
            >
              <!-- <div class="blog-img w3-agile-grid">
                <a>
                  <img src alt class="img-fluid">
                </a>
              </div>-->
              <div class="blog_info">
                <h5>
                  <a href>{{act.name}}</a>
                </h5>
                <p>
                  By {{act.act_provider.first_name}} {{act.act_provider.last_name}}
                  <a
                    href="#"
                    class="user-blog"
                  ></a>
                </p>

                <p class="truncate_text_3_lines">{{act.description}}</p>
                <ul class="blog_list">
                  <li>
                    <span title="Rewards points" class="fa fa-credit-card" aria-hidden="true"></span>
                    {{act.reward_points}}
                    <i>|</i>
                  </li>
                  <li>
                    <span title="Popularity" class="fa fa-angle-double-down" aria-hidden="true"></span>
                    {{act.total_number_of_clicks}}
                    <i>|</i>
                  </li>
                  <li>
                    <span title="Favorites" class="fa fa-user" aria-hidden="true"></span>
                    {{act.total_number_of_completions}}
                    <!-- <i>|</i> -->
                  </li>
                  <!-- <li>
                    <a href="#">
                      <span class="fa fa-tag" aria-hidden="true"></span>
                      13
                    </a>
                  </li>-->
                </ul>
              </div>
              <div class="clearfix"></div>
            </article>
            <br>
            <nav aria-label="Page navigation example" v-if="data.count">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{disabled: data.query.page == '1'}">
                  <a class="page-link" @click="previous">Previous</a>
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
                  <a class="page-link" @click="next">Next</a>
                </li>
              </ul>
            </nav>
          </div>
          <aside class="col-lg-4 single-left">
            <div class="single-gd" v-if="data.roles && data.roles.act_poster">
              <!-- <img src="images/a3.jpg" class="img-fluid" alt> -->
              <div
                v-if="status_message"
                class="alert"
                :class="{'alert-danger': status_state == 'Error', 'alert-success': status_state == 'Success'}"
              >
                <strong>{{status_state}}:</strong>
                {{status_message}}
              </div>
              <h4>Add Act</h4>
              <form @submit.prevent="addAct">
                <input
                  class="form-control"
                  v-model="add_act.name"
                  type="text"
                  name="name"
                  placeholder="Name"
                  required
                >
                <textarea
                  rows="10"
                  class="form-control"
                  name="description"
                  placeholder="Description"
                  required
                  v-model="add_act.description"
                ></textarea>
                <input
                  class="form-control"
                  type="number"
                  name="reward_points"
                  placeholder="Reward points"
                  required
                  v-model="add_act.reward_points"
                >
                <!-- <label for="file">Image should be 1600 X 800</label>
                <input class="form-control" id="file" type="file" name="file">-->
                <div class="button">
                  <input class="form-control" type="submit" value="Submit">
                </div>
              </form>
            </div>
            <!-- <div class="single-gd">
              <h4>Our Progress</h4>
              <div class="progress">
                <div
                  class="progress-bar progress-bar-striped"
                  role="progressbar"
                  style="width: 10%"
                  aria-valuenow="10"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <div class="progress">
                <div
                  class="progress-bar progress-bar-striped bg-success"
                  role="progressbar"
                  style="width: 25%"
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <div class="progress">
                <div
                  class="progress-bar progress-bar-striped bg-info"
                  role="progressbar"
                  style="width: 50%"
                  aria-valuenow="50"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <div class="progress">
                <div
                  class="progress-bar progress-bar-striped bg-warning"
                  role="progressbar"
                  style="width: 75%"
                  aria-valuenow="75"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <div class="progress">
                <div
                  class="progress-bar progress-bar-striped bg-danger"
                  role="progressbar"
                  style="width: 100%"
                  aria-valuenow="100"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>-->
            <div class="single-gd tech-btm">
              <h4>Top stories of the week</h4>
              <div class="blog-grids">
                <div class="blog-grid-left">
                  <a href="single.html">
                    <img src="images/a1.jpg" class="img-fluid mb-0" alt>
                  </a>
                </div>
                <div class="blog-grid-right">
                  <h5>
                    <a href="single.html">Pellentesque dui, non felis. Maecenas male</a>
                  </h5>
                </div>
                <div class="clearfix"></div>
              </div>
              <div class="blog-grids">
                <div class="blog-grid-left">
                  <a href="single.html">
                    <img src="images/a2.jpg" class="img-fluid mb-0" alt>
                  </a>
                </div>
                <div class="blog-grid-right">
                  <h5>
                    <a href="single.html">Pellentesque dui, non felis. Maecenas male</a>
                  </h5>
                </div>
                <div class="clearfix"></div>
              </div>
              <div class="blog-grids">
                <div class="blog-grid-left">
                  <a href="single.html">
                    <img src="images/a3.jpg" class="img-fluid mb-0" alt>
                  </a>
                </div>
                <div class="blog-grid-right">
                  <h5>
                    <a href="single.html">Pellentesque dui, non felis. Maecenas male</a>
                  </h5>
                </div>
                <div class="clearfix"></div>
              </div>
            </div>
            <div class="single-gd">
              <h4>Recent Post</h4>
              <img src="images/a1.jpg" class="img-fluid" alt>
              <p>
                Lorem Ipsum convallis diam sapien consequat magna vulputate ornare malesuada. id dignissim velit id felis ac
                cursus eros.
                Cras a elit.
              </p>
            </div>
          </aside>
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
    // this.$nextTick(() => {
    //   this.$nuxt.$loading.start();
    //   setTimeout(() => this.$nuxt.$loading.finish(), 1500);
    // });
    // for (let i = 0; i < 1000; i++)
    //   await axios.get("/api/users/users").then(function(res) {
    //     vue_context.title = res.title;
    //     console.log(res);
    //   });
  },
  async fetch(context) {},
  // async asyncData({ query, req }) {
  async asyncData(context) {
    // console.log("I ran");
    // console.log();
    //Get acts
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
        `/api/acts?type=${context.query.type}&sort=${
          context.query.sort
        }&order=${context.query.order}&search=${context.query.search}&page=${
          context.query.page
        }`,
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
      })
      .catch(function(err) {
        // console.log(context.app.$cookies.getAll());
        // console.log(err.response.data.message);
        if (err.response.status == 400) {
          context.redirect("/logout");
        }
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
    return { query: context.query, data };
  },
  data() {
    return {
      title: "Acts",
      error: "",
      status_message: "",
      status_state: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      image: null,
      logged_in: true,
      page: "acts",
      add_act: {
        name: "",
        description: "",
        reward_points: 0
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
        if (err.response.status == 400) {
          vue_context.$router.redirect("/logout");
        }
      });
    next();
  },
  methods: {
    fileChanged(event) {
      this.image = event.target.files[0];
    },
    navigateTo(index) {
      var element = this.$refs["acts_come_here"];
      var top = element.offsetTop;

      scrollToElement(element);
      // window.scrollTo(0, top);

      this.$router.push(
        `/acts?type=${this.query.type}&sort=${this.query.sort}&order=${
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
      this.$router.push(`/acts?type=${this.query.type}`);
    },
    type_changed() {
      // console.log(this.query.type);
      this.$router.push(`/acts?type=${this.query.type}`);
    },
    async addAct() {
      // alert("Hello World");
      //Send act
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");
      const params = new URLSearchParams();

      params.append("name", this.add_act.name);
      params.append("description", this.add_act.description);
      params.append("reward_points", this.add_act.reward_points);
      await axios
        .post("/api/acts", params, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .then(function(res) {
          // vue_context.data = res.data;
          // console.log(res);
          vue_context.status_state = "Success";
          vue_context.status_message = res.data.message;
          vue_context.add_act.name = "";
          vue_context.add_act.description = "";
          vue_context.add_act.reward_points = 0;
        })
        .catch(function(err) {

          vue_context.status_state = "Error";
          vue_context.status_message = err.response.data.message;

          // if (err.response.status == 400) {
          //   vue_context.$router.redirect("/logout");
          // }
          // console.log(err.response.data.message);
        });
      //If error, display error
      //If success, display success message with hint of manager's final say
      //Then clear the form
    },
    async search() {
      // this.$nuxt.$loading.start();

      // const token = this.$cookies.get("token");
      // const refresh_token = this.$cookies.get("refresh_token");
      // await axios
      //   .get(
      //     `/api/acts?type=${vue_context.query.type}&sort=${
      //       vue_context.query.sort
      //     }&order=${vue_context.query.order}&search=${
      //       vue_context.query.search
      //     }`,
      //     {
      //       headers: {
      //         Cookie: `token=${token}; refresh_token=${refresh_token};`
      //       }
      //     }
      //   )
      //   .then(function(res) {
      //     vue_context.data = res.data;
      //   })
      //   .catch(function(err) {
      //     if (err.response.status == 400) {
      //       vue_context.$router.redirect("/logout");
      //     }
      //   });

      // vue_context.$nuxt.$loading.finish();

      this.$router.push(
        `/acts?type=${this.query.type}&sort=${this.query.sort}&order=${
          this.query.order
        }&search=${vue_context.query.search}
        `
      );
    },
    register() {
      //Check if there an empty input field
      //If so, display error
      if (!this.first_name || !this.last_name || !this.email || !this.password)
        this.error = "All fields must be present";
      else {
        //If all fields are present
        //Convert image to base64 if exists
        // if (this.image)
        // {
        //   const base64_image = base64Img.base64Sync
        // }
        //Send json to server
        // const json = {
        //   first_name: this.first_name,
        //   last_name: this.last_name,
        //   email: this.email,
        //   password: this.password
        // };

        this.$nuxt.$loading.start();

        const formData = new FormData();
        if (this.image) formData.append("file", this.image, this.image.name);

        formData.append("first_name", this.first_name);
        formData.append("last_name", this.last_name);
        formData.append("email", this.email);
        formData.append("password", this.password);

        axios
          .post("/api/users/register", formData)
          .then(function(res) {
            //Redirect to verification page
            vue_context.$nuxt.$loading.finish();
            vue_context.$router.push({
              path: "/verify_account"
            });
          })
          .catch(function(err) {
            vue_context.$nuxt.$loading.finish();
            if (err.response) vue_context.error = err.response.data.message;
          });

        //Else
      }
    }
  }
  // mounted() {
  //   this.msg = "Works";
  // }
  // created: function() {
  //   this.msg = "Works"
  // }
};
</script>

<style scoped>
/*.title {
  margin: 30px 0;
}
.users {
  list-style: none;
  margin: 0;
  padding: 0;
}
.user {
  margin: 10px 0;
}*/
</style>

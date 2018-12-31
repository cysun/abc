<template>
  <div>
    <my-header :logged_in="logged_in" :page="page" :roles="data.roles"/>
    <my-banner :title="title"/>
    <section class="banner-bottom-w3ls-agileinfo py-5">
      <div class="container py-md-3">
        <span class="badge badge-primary float-right">Accumulated {{data.sum}} points</span>
        <div style="clear: both"></div>
        <br>
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
                <option value="OPEN" :selected="!query.type == 'OPEN'">Open Transactions</option>
                <option value="CLOSED" :selected="!query.type == 'CLOSED'">Closed Transactions</option>
                <option value="REVIEWS" :selected="!query.type == 'REVIEWS'">User Reviews</option>
                <option disabled v-if="data.roles && data.roles.act_poster">──────────</option>
                <option
                  v-if="data.roles && data.roles.act_poster"
                  value="MY_ACTS"
                  :selected="!query.type == 'MY_ACTS'"
                >My Acts</option>
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
        <div ref="acts_come_here">
          <button class='btn btn-primary' style="margin-bottom: 10px">Reward details</button>
        <table class="table table-striped table-hover" v-if="query.type != 'REVIEWS'">
          <thead>
            <th scope="col" data-type="string">User's name</th>
            <th scope="col" data-type="number">Date reward was {{data.requested}}</th>
            <th v-if="data.query.type == 'OPEN'" scope="col" data-role="annotation">Confirm collection</th>
          </thead>

          <tr v-for="(user, index) in data.data[0].users">
            <td>{{user.first_name}} {{user.last_name}}</td>
            <td>{{user.time}}</td>
            <td v-if="data.query.type == 'OPEN'">
              <button
                @click="confirmCollection(index)"
                class="btn btn-primary"
              >Confirm collection</button>
            </td>
          </tr>
        </table>
        <div v-if="data.query.type == 'REVIEWS'" class="comment-top w3-agile-grid">
					<h4>Reviews</h4>
					<div class="media mb-3" v-for="(user, index) in data.data[0].users">
						<div class="media-body">
							<h5 class="mt-0">{{user.first_name}} {{user.last_name}}</h5>
              <p>Reward rating: {{user.reward_rating}}</p>
              <p v-if="user.reward_comments">{{user.reward_comments}}</p>
							<p>Reward provider rating: {{user.reward_provider_rating}}</p>
              <p v-if="user.reward_provider_comments">{{user.reward_provider_comments}}</p>
						</div>
					</div>
				</div>
        </div>
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
    </section>
  </div>
</template>

<script>
import axios from "~/plugins/axios";
import MyBanner from "~/components/Banner.vue";
import MyHeader from "~/components/Header.vue";
import scrollToElement from "scroll-to-element";
import moment from "moment";
let iziToast;

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
    iziToast = require("iziToast");

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
    // console.log("I ran");
    const token = context.app.$cookies.get("token");
    const refresh_token = context.app.$cookies.get("refresh_token");

    if (!context.query.sort) context.query.sort = "";
    if (!context.query.search) context.query.search = "";
    if (!context.query.order) context.query.order = "";
    if (!context.query.page) context.query.page = 1;
    if (!context.query.type) context.query.type = "OPEN";

    // console.log(context.app.$cookies.getAll());
    // console.log(context.req.headers.cookie);
    let data;
    // console.log(context)
    await axios
      .get(
        `/api/rewards/${context.route.params.id}/details?type=${context.query.type}&sort=${
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
        //Loop through data and format date
        data.data[0].users.forEach(element => {
            element.time = moment(element.time).format(
              "MMMM Do YYYY, h:mm a"
            );
        });
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
      // console.log(data);
    data.query = context.query;
    data.requested = "requested"
    if (data.query.type == 'CLOSED')
    data.requested = "collected"
    return { query: context.query, data };
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
          // //If successful
          // //Show success message
          // iziToast.success({
          //   title: "Success",
          //   message: "The act was successfully deleted",
          //   position: "topRight"
          // });
          // //Navigate (replace) to previous page
          // vue_context.$router.go(-1);
        })
        .catch(function(err) {
          //If error
          //If all page
          if (vue_context.data.type == "ALL")
            //Revert state
            // vue_context.$set(
            //   vue_context.data.acts[index].enabled,
            //   "state",
            //   state
            // );
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
          iziToast.error({
            title: "Error",
            message: "Sorry, the change could not be saved",
            position: "topRight"
          });
        });
      //If error,
      //revert state
      // console.log(index, !state)

      if (this.data.type !== "ALL") {
        //If not, remove the row
        this.data.acts.splice(index, 1);
      }
    },
    fileChanged(event) {
      this.image = event.target.files[0];
    },
    navigateTo(index) {
      var element = this.$refs["acts_come_here"];
      var top = element.offsetTop;

      scrollToElement(element);
      // window.scrollTo(0, top);

      this.$router.push(
        `/manage/acts?type=${this.query.type}&sort=${this.query.sort}&order=${
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
      this.$router.push(`/manage/acts?type=${this.query.type}`);
    },
    type_changed() {
      // console.log(this.query.type);
      this.$router.push(`/rewards/${this.$route.params.id}/details?type=${this.query.type}`);
    },
    upload_type_changed() {
      // console.log(this.upload_type);
    },
    edit_act(index) {
      if (!this.data.acts[index].edit)
        this.$set(this.data.acts[index], "edit", true);
      else this.$set(this.data.acts[index], "edit", false);
    },
    delete_act(index) {
      if (!this.data.acts[index].delete)
        this.$set(this.data.acts[index], "delete", true);
      else this.$set(this.data.acts[index], "delete", false);
    },
    async confirm_delete_act(index) {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      //Store act and it's current index
      this.$set(this.deleted_acts, index, this.data.acts[index]);
      // this.deleted_acts.push({act: this.data.acts[index], index: index});
      //Remove act from array
      this.data.acts.splice(index, 1);
      //Make request to delete act

      await axios
        .put(`/api/acts/${vue_context.deleted_acts[index]._id}/delete`, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .catch(function(err) {
          //If error, place act back
          vue_context.data.acts.splice(
            index,
            0,
            vue_context.deleted_acts[index]
          );
          delete_act(index);
          // vue_context.$set(
          //   vue_context.data.acts[index],
          //   "state",
          //   vue_context.data.acts[index].previous_data.state
          // );
          //Tell the user that the act could not be deleted
          iziToast.error({
            title: "Error",
            message: "Sorry, the act could not be deleted",
            position: "topRight"
          });
        });
      delete this.deleted_acts[index];
    },
    async change_act_state(index) {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      //Store previous state of act
      this.$set(this.data.acts[index], "previous_data", {
        state: this.data.acts[index].state
      });
      //Get new state
      let new_state;
      if (this.data.acts[index].previous_data.state == "AVAILABLE")
        new_state = "NOT_AVAILABLE";
      else new_state = "AVAILABLE";
      //Change state of act
      this.$set(this.data.acts[index], "state", new_state);
      //Make request to change state of act

      await axios
        .put(`/api/acts/${vue_context.data.acts[index]._id}/state`, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .catch(function(err) {
          //If error, revert state of act
          vue_context.$set(
            vue_context.data.acts[index],
            "state",
            vue_context.data.acts[index].previous_data.state
          );
          //Tell the user that the act could not be altered
          iziToast.error({
            title: "Error",
            message: "Sorry, the act state could not be altered",
            position: "topRight"
          });
        });
    },
    async save_act(index) {
      // iziToast.show({
      //   title: "Hey",
      //   color: 'red',
      //   message: "What would you like to add?",
      //   position: 'topRight',
      //   icon: 'fa fa-heart'
      // });

      // iziToast.error({
      //   title: "Error",
      //   message: "Illegal operation",
      //   position: 'topRight'
      // });

      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      //Get new name, description and reward points
      const name = document.getElementById("act_name" + index).value;
      const description = document.getElementById("act_description" + index)
        .value;
      const reward_points = document.getElementById("act_reward_points" + index)
        .value;
      const enabled_state = this.data.acts[index].enabled.state;
      //If this is an event, get new start and end time too
      let start_time, end_time;

      if (this.data.acts[index].__t == "Event") {
        start_time = document.getElementById("act_start_time" + index).value;
        end_time = document.getElementById("act_end_time" + index).value;
      }
      //Save previous name, description and reward points and enabled_state
      this.$set(this.data.acts[index], "previous_data", {
        name: this.data.acts[index].name,
        description: this.data.acts[index].description,
        reward_points: this.data.acts[index].reward_points,
        enabled: enabled_state
      });
      //If this is an event, save previous start and end times
      if (this.data.acts[index].__t == "Event") {
        this.$set(
          this.data.acts[index].previous_data,
          "start_time",
          this.data.acts[index].formated_start_time
        );
        this.$set(
          this.data.acts[index].previous_data,
          "end_time",
          this.data.acts[index].formated_end_time
        );
      }
      // if (this.data.acts[index].__t == "Event") {
      //   this.$set(this.data.acts[index].previous_data, "start_time", this.data.acts[index].formated_start_time{
      //     start_time: this.data.acts[index].formated_start_time,
      //     end_time: this.data.acts[index].formated_end_time
      //   });
      // }
      //Update to new name, desription and reward points
      this.$set(this.data.acts[index], "name", name);
      this.$set(this.data.acts[index], "description", description);
      this.$set(this.data.acts[index], "reward_points", reward_points);
      //If this is an event
      //Update to new start and end times
      if (this.data.acts[index].__t == "Event") {
        this.$set(
          this.data.acts[index],
          "formated_start_time",
          moment(start_time).format("MMMM Do YYYY, h:mm:ss a")
        );
        this.$set(
          this.data.acts[index],
          "formated_end_time",
          moment(end_time).format("MMMM Do YYYY, h:mm:ss a")
        );
      }
      //Remember to disable the act
      this.$set(this.data.acts[index].enabled, "state", false);
      //Remove input fields
      this.edit_act(index);
      //Edit this act
      const params = new URLSearchParams();

      params.append("name", name);
      params.append("description", description);
      params.append("reward_points", reward_points);

      //If this is an event, edit its start and end times
      if (this.data.acts[index].__t == "Event") {
        params.append("start_time", start_time);
        params.append("end_time", end_time);
      }

      await axios
        .put(`/api/acts/${vue_context.data.acts[index]._id}`, params, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .catch(function(err) {
          //If error, revert to old name and description
          vue_context.$set(
            vue_context.data.acts[index],
            "name",
            vue_context.data.acts[index].previous_data.name
          );
          vue_context.$set(
            vue_context.data.acts[index],
            "description",
            vue_context.data.acts[index].previous_data.description
          );
          vue_context.$set(
            vue_context.data.acts[index],
            "reward_points",
            vue_context.data.acts[index].previous_data.reward_points
          );

          //Revert to previous state
          vue_context.$set(
            vue_context.data.acts[index].enabled,
            "state",
            vue_context.data.acts[index].previous_data.enabled
          );

          //If this is an event, revert to old start and end times
          if (vue_context.data.acts[index].__t == "Event") {
            vue_context.$set(
              vue_context.data.acts[index],
              "formated_start_time",
              vue_context.data.acts[index].previous_data.start_time
            );
            vue_context.$set(
              vue_context.data.acts[index],
              "formated_end_time",
              vue_context.data.acts[index].previous_data.end_time
            );
          }

          //Tell the user that the act could not be edited
          let type_of_act = "act";
          if (vue_context.data.acts[index].__t == "Event")
            type_of_act = "event";
          iziToast.error({
            title: "Error",
            message: `Sorry, the ${type_of_act} could not be edited`,
            position: "topRight"
          });
        });
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
      if (this.upload_type == "event") {
        params.append(
          "start_time",
          // new Date(document.getElementById("start_time").value + 'Z')
          new Date(document.getElementById("start_time").value)
        );
        params.append(
          "end_time",
          // new Date(document.getElementById("end_time").value + 'Z')
          new Date(document.getElementById("end_time").value)
        );
      }
      await axios
        .post(`/api/acts/${vue_context.upload_type}`, params, {
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
          document.getElementById("end_time").value = "";
          document.getElementById("start_time").value = "";
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
        `/manage/acts?type=${this.query.type}&sort=${this.query.sort}&order=${
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
<template>
  <div>
    <my-header :logged_in="logged_in" :page="page" :roles="data.roles"/>
    <my-banner/>
    <section class="banner-bottom-w3ls-agileinfo py-5">
      <!--/blog-->
      <div class="container py-md-3">
        <!-- <h2 class="heading mb-lg-5 mb-4">title</h2> -->
        <div class="row inner-sec-wthree-agileits">
          <div class="col-lg-12 blog-sp">
            <article style="margin-bottom: 10px" class="blog-x row">
              <!-- <div class="blog-img w3-agile-grid">
                <a>
                  <img src alt class="img-fluid">
                </a>
              </div>-->
              <div class="blog_info">
                <h5>
                  <div class="row">
                    <a class="col-md-9" tabindex="-1" v-if="!data.edit">{{data.act.name}}</a>
                    <h6 v-if="data.rewards && !data.edit">
                      <span class="badge badge-secondary">{{data.rewards.rewards[0].state}}</span>
                    </h6>
                  </div>
                  <input
                    id="act_name"
                    v-if="data.edit"
                    type="text"
                    class="form-control"
                    :value="data.act.name"
                  >
                </h5>
                <p>
                  {{$t('by')}} {{data.act.reward_provider.first_name}} {{data.act.reward_provider.last_name}}
                  <a
                    href="#"
                    class="user-blog"
                  ></a>
                </p>

                <p v-if="!data.edit">{{data.act.description}}</p>
                <textarea
                  id="act_description"
                  v-if="data.edit"
                  class="form-control"
                  rows="4"
                  :value="data.act.description"
                ></textarea>
                <div v-if="data.act.__t == 'Event'">
                  <div>
                    <span
                      v-if="!data.edit"
                      class="badge badge-light"
                    >{{$t('start_time')}}: {{data.act.formated_start_time}}</span>
                    <div v-if="data.edit">
                      <div
                        class="controls input-append date form_datetime"
                        data-date-format="yyyy-mm-ddThh:ii"
                        data-link-field="dtp_input1"
                      >
                        <input
                          size="16"
                          :placeholder="$t('start_time')"
                          type="text"
                          class="form-control"
                          :value="data.act.start_time"
                          id="act_start_time"
                        >
                        <span class="add-on">
                          <i class="icon-remove"></i>
                        </span>
                        <span class="add-on">
                          <i class="icon-th"></i>
                        </span>
                      </div>
                      <input type="hidden" id="dtp_input1" value>
                    </div>
                  </div>
                  <div>
                    <span
                      v-if="!data.edit"
                      class="badge badge-light"
                    >{{$t('end_time')}}: {{data.act.formated_end_time}}</span>
                    <div v-if="data.edit">
                      <div
                        class="controls input-append date form_datetime"
                        data-date-format="yyyy-mm-ddThh:ii"
                        data-link-field="dtp_input1"
                      >
                        <input
                          size="16"
                          :placeholder="$t('end_time')"
                          type="text"
                          class="form-control"
                          :value="data.act.end_time"
                          id="act_end_time"
                        >
                        <span class="add-on">
                          <i class="icon-remove"></i>
                        </span>
                        <span class="add-on">
                          <i class="icon-th"></i>
                        </span>
                      </div>
                      <input type="hidden" id="dtp_input1" value>
                      <script>
                        $(".form_datetime").datetimepicker({
                          weekStart: 1,
                          todayBtn: 1,
                          autoclose: 1,
                          todayHighlight: 1,
                          startView: 2,
                          forceParse: 0,
                          showMeridian: 1
                        });
                      </script>
                    </div>
                  </div>
                </div>
                <div style="margin-bottom: 10px" v-if="data.proofs.acts[0].state == 'REJECTED'">
                  <span
                    class="badge badge-warning"
                  >{{$t('reason_for_rejection')}}: {{data.proofs.acts[0].comments}}</span>
                </div>
                <div
                  style="margin-bottom: 5px"
                  v-for="(proof, index) in data.proofs.acts[0].proof_of_completion"
                  class="justify-content-center"
                >
                  <a
                    tabindex="0"
                    v-if="data.proofs.acts[0].state !== 'COMPLETED'"
                    data-toggle="popover"
                    :title="'<a href=\'' + proof.new_name + '\'>' + $t('view') + '</a>'"
                    :data-content="'<a id=\'' + index + '\' class=\'delete_name\' name=\'' + proof.new_name + '\'>' + $t('delete') + '</a>'"
                    data-trigger="focus"
                    data-html="true"
                  >{{proof.original_name}}</a>
                  <a
                    v-if="data.proofs.acts[0].state == 'COMPLETED'"
                    :href="proof.new_name"
                  >{{proof.original_name}}</a>
                </div>
                <br>
                
                <form id="smileys" v-if="data.rewards && data.rewards.rewards[0].state == 'COMPLETED' && !data.review" @submit.prevent="submitRating">
                  <span class="align-top">{{$t('rate_the_reward')}}: </span>
  <input type="radio" name="smiley" value="1" class="devil" v-model="reward_rating">
	<input type="radio" name="smiley" value="2" class="sad" v-model="reward_rating">
	<input type="radio" name="smiley" value="3" class="neutral" v-model="reward_rating">
	<input type="radio" name="smiley" value="4" class="happy" v-model="reward_rating">
  <input type="radio" name="smiley" value="5" class="love" v-model="reward_rating">
  <textarea class="form-control" v-model="reward_comments" :placeholder="$t('additional_comments_about_the_reward')"></textarea>
    
<br>
                  <span class="align-top">{{$t('rate_the_reward_provider')}}: </span>
  <input type="radio" name="smiley1" value="1" class="devil" v-model="reward_provider_rating">
	<input type="radio" name="smiley1" value="2" class="sad" v-model="reward_provider_rating">
	<input type="radio" name="smiley1" value="3" class="neutral" v-model="reward_provider_rating">
	<input type="radio" name="smiley1" value="4" class="happy" v-model="reward_provider_rating">
  <input type="radio" name="smiley1" value="5" class="love" v-model="reward_provider_rating">
  <textarea class="form-control" v-model="reward_provider_comments" :placeholder="$t('additional_comments_about_the_reward_provider')"></textarea>
  <br>
<div class='text-center'><input class='btn btn-primary' type='submit' :value="$t('submit_rating')"></div>    
</form>



                <div
                  v-if="data.act.enabled && !data.rewards"
                  class="form-inline justify-content-center"
                >
                  <input
                    @click="requestReward"
                    type="button"
                    :value="$t('request_reward')"
                    class="btn btn-primary"
                  >
                </div>
                <div
                  v-if="data.rewards && data.rewards.rewards[0].state == 'ON GOING'"
                  class="form-inline justify-content-center"
                >
                  <input
                    @click="collectedReward"
                    type="button"
                    :value="$t('i_have_collected_the_reward')"
                    class="btn btn-primary"
                  >
                </div>
                <br>
                <div class="row" v-if="data.act.reward_provider.id == data.user.id || data.roles.manager">
                  <div class="col-md-7">
                    <span v-if="data.act.reward_provider.id == data.user.id">
                    <a
                      href="#"
                      class="badge badge-info"
                      @click="change_act_state(index)"
                      v-if="data.act.state == 'AVAILABLE'"
                    >{{$t('available')}}</a>
                    <span
                      @click="change_act_state(index)"
                      v-if="data.act.state == 'NOT_AVAILABLE'"
                      class="badge badge-info"
                      style="cursor: pointer"
                    >{{$t('not_available')}}</span>
                    </span>
                    <a
                    tabindex="0"
                    v-if="data.roles.manager"
                      class="badge badge-info"
                      @click="change_act_state_by_manager()"
                      style="cursor: pointer"
                    >{{data.act.enabled ? "Enabled" : "Disabled"}}</a>
                  </div>
                  <div class="col-md-5">
                    <span v-if="!data.delete">
                      <button v-if="!data.edit" @click="edit_act" class="btn btn-primary">{{$t('edit')}}</button>
                      <button v-if="data.edit" @click="save_act" class="btn btn-primary">{{$t('save')}}</button>
                      <button v-if="data.edit" @click="edit_act" class="btn btn-danger">{{$t('cancel')}}</button>
                    </span>
                    <span v-if="!data.edit">
                      <button v-if="!data.delete" @click="delete_act" class="btn btn-danger">' + {{$t('delete')}} + '</button>
                      <button v-if="data.delete" @click="delete_act" class="btn btn-primary">{{$t('cancel')}}</button>
                      <button
                        v-if="data.delete"
                        @click="confirm_delete_act"
                        class="btn btn-danger"
                      >{{$t('confirm')}}</button>
                    </span>
                  </div>
                </div>
                <ul class="blog_list">
                  <li>
                    <span
                      :title="$t('reward_points_needed_to_collect_this_reward')"
                      class="fa fa-credit-card"
                      aria-hidden="true"
                    ></span>
                    <span v-if="!data.edit">{{data.act.value}}</span>
                    <input
                      id="act_reward_points"
                      v-if="data.edit"
                      type="number"
                      style="width: 40px"
                      :value="data.act.value"
                    >
                    <i>|</i>
                  </li>
                  <li>
                    <span title="Amount available" class="fa fa-clone" aria-hidden="true"></span>
                    <span v-if="!data.edit">{{data.act.amount}}</span>
                    <input
                      id="act_amount"
                      v-if="data.edit"
                      type="number"
                      style="width: 40px"
                      :value="data.act.amount"
                    >
                    <i>|</i>
                  </li>
                  <li>
                    <span title="Popularity" class="fa fa-angle-double-down" aria-hidden="true"></span>
                    {{data.act.total_number_of_users_who_clicked_on_this_reward}}
                    <i>|</i>
                  </li>
                  <li>
                    <span title="Favorites" class="fa fa-user" aria-hidden="true"></span>
                    {{data.act.total_number_of_users_who_got_this_reward}}
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
          </div>
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
    $('#smileys input').on('click', function() {
	$('#result').html($(this).val());
});
    $(document).ready(function() {
      $('[data-toggle="popover"]').popover();
    });

    $(document).on("click", ".delete_name", function(event) {
      event.stopPropagation();
      event.stopImmediatePropagation();
      var target = $(event.target);
      const index = target[0].id;
      const id = target[0].name;
      // console.log(target);
      // return;

      vue_context.deleteProof(index, id);
    });
  },
  async fetch(context) {},
  // async asyncData({ query, req }) {
  async asyncData(context) {
    const token = context.app.$cookies.get("token");
    const refresh_token = context.app.$cookies.get("refresh_token");

    let data;
    await axios
      .get(`/api/rewards/${context.params.id}`, {
        headers: { Cookie: `token=${token}; refresh_token=${refresh_token};` }
      })
      .then(function(res) {
        data = res.data;
      })
      .catch(function(err) {
        if (err.response.status == 401) {
          context.redirect("/logout");
        }
      });
    if (!data.proofs) {
      const acts = {
        acts: [{ state: "" }]
      };
      data.proofs = acts;
    } else if (data.proofs.acts[0].state) {
      data.proofs.acts[0].state = data.proofs.acts[0].state.replace("_", " ");
    }
    if (data.rewards)
    data.rewards.rewards[0].state = data.rewards.rewards[0].state.replace("_", " ");
    // console.log(data);
    return { data };
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
      files: null,
      logged_in: true,
      page: "",
      reward_rating: 0,
      reward_provider_rating: 0,
      reward_comments: "",
      reward_provider_comments: "",
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
    async collectedReward(){
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");
      

      //Change state to "Completed"
      this.data.rewards.rewards[0].state = "COMPLETED";

      //Make request to change state
      await axios
        .put(
          `/api/rewards/${vue_context.data.act._id}/user/${
            vue_context.data.user.id
          }/collected`,
          {
            headers: {
              Cookie: `token=${token}; refresh_token=${refresh_token};`
            }
          }
        )
        .then(function(res) {
          // vue_context.data = res.data;
          //If works,
          //Display permanent notice of reward requested
        })
        .catch(function(err) {
          // if (err.response.status == 400) {
          //   vue_context.$router.redirect("/logout");
          // }
          //If error
      //Revert state
      //If error, revert to "ON GOING";
      vue_context.data.rewards.rewards[0].state = "ON GOING";
      //Display notification of error
          iziToast.error({
            title: "Error",
            message: err.response.data.message,
            position: "topRight"
          });
          // console.log(err.response.data.message);
        });
    },
    async requestReward() {
      //Change state to 'Requested'
      const rewards = {
        rewards: [{ state: "ON GOING" }]
      };
      this.data.rewards = rewards;
      
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");
      //Make request to change state on server
      await axios
        .put(
          `/api/rewards/${vue_context.data.act._id}/user/${
            vue_context.data.user.id
          }/request_reward`,
          {
            headers: {
              Cookie: `token=${token}; refresh_token=${refresh_token};`
            }
          }
        )
        .then(function(res) {
          // vue_context.data = res.data;
          //If works,
          //Display permanent notice of reward requested
        })
        .catch(function(err) {
          // if (err.response.status == 400) {
          //   vue_context.$router.redirect("/logout");
          // }
          //If error
      //Revert state
      vue_context.data.rewards = null
      //Display notification of error
          iziToast.error({
            title: "Error",
            message: err.response.data.message,
            position: "topRight"
          });
          // console.log(err.response.data.message);
        });
    },
    fileChanged(event) {
      this.files = event.target.files;
      // console.log(this.files);
    },
    async uploadProof() {
      if (!this.files || this.files.length == 0) return;
      // console.log(this.files.length);
      // console.log("Hello World");

      //Save current state
      this.data.current_state = this.data.proofs.acts[0].state;
      //Change state to under review
      this.data.proofs.acts[0].state = "UNDER REVIEW";

      const formData = new FormData();
      for (let i = 0; i < this.files.length; i++)
        formData.append("files", this.files[i], this.files[i].name);

      await axios
        .post(`/api/acts/${vue_context.data.act._id}/complete`, formData)
        .then(function(res) {
          //Redirect to verification page
          // vue_context.$nuxt.$loading.finish();
          // vue_context.$router.push({
          //   path: "/verify_account"
          // });
          if (vue_context.data.proofs.acts[0].proof_of_completion)
            vue_context.data.proofs.acts[0].proof_of_completion = vue_context.data.proofs.acts[0].proof_of_completion.concat(
              res.data
            );
          else
            vue_context.$set(
              vue_context.data.proofs.acts[0],
              "proof_of_completion",
              res.data
            );
          document.getElementById("file_input").value = null;
        })
        .catch(function(err) {
          //If error
          //Return state to original value
          vue_context.data.proofs.acts[0].state =
            vue_context.data.current_state;

          // vue_context.$nuxt.$loading.finish();
          // if (err.response) vue_context.error = err.response.data.message;
        });
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
    submitRating(){
      //If reward or reward provider rating is 0, error
      if (this.reward_rating == 0 || this.reward_provider_rating == 0)
      {
        iziToast.error({
            title: "Error",
            message: "You must rate the reward and reward provider",
            position: "topRight"
          });
          return;
      }
      //Remove the form from the page
      this.data.review = true;
      //Send rating
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      const params = new URLSearchParams();
      params.append("reward_rating", this.reward_rating);
      params.append("reward_comments", this.reward_comments);
      params.append("reward_provider_rating", this.reward_provider_rating);
      params.append("reward_provider_comments", this.reward_provider_comments);


      axios
        .put(`/api/rewards/${vue_context.data.act._id}/review`, params, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .then(function(res) {
          //If successful
          //Show success message
          iziToast.success({
            title: "Thank you",
            message: "Your review has been received",
            position: "topRight"
          });
        })
        .catch(function(err) {
                //If error,
      //Place the form back
      vue_context.data.review = null;
      //Give error
          iziToast.error({
            title: "Error",
            message: "Sorry, your review could not be sent",
            position: "topRight"
          });
        });

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
    upload_type_changed() {
      // console.log(this.upload_type);
    },
    edit_act() {
      if (!this.data.edit) this.$set(this.data, "edit", true);
      else this.$set(this.data, "edit", false);
    },
    delete_act() {
      if (!this.data.delete) this.$set(this.data, "delete", true);
      else this.$set(this.data, "delete", false);
    },
    async confirm_delete_act() {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");
      //Make request to delete act

      await axios
        .put(`/api/rewards/${vue_context.data.act._id}/delete`, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .then(function(res) {
          //If successful
          //Show success message
          iziToast.success({
            title: "Success",
            message: "The reward was successfully deleted",
            position: "topRight"
          });
          //Navigate (replace) to previous page
          vue_context.$router.go(-1);
        })
        .catch(function(err) {
          //If error, place act back
          //Tell the user that the act could not be deleted
          iziToast.error({
            title: "Error",
            message: "Sorry, the reward could not be deleted",
            position: "topRight"
          });
        });
    },
    async deleteProof(index, id) {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      //Save the current state of the proof
      if (!this.data.proofs.acts[0].previous_proof)
        this.$set(this.data.proofs.acts[0], "previous_proof", {
          [index]: this.data.proofs.acts[0].proof_of_completion[index]
        });
      else
        this.$set(
          this.data.proofs.acts[0].previous_proof,
          index,
          this.data.proofs.acts[0].proof_of_completion[index]
        );

      //Remove the proof from the screen
      this.data.proofs.acts[0].proof_of_completion.splice(index, 1);
      const encoded_id = btoa(id);

      //Send request to remove the proof from the database
      await axios
        .delete(`/api/acts/proof/${encoded_id}`, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .catch(function(err) {
          //If something goes wrong, put the proof back
          vue_context.data.proofs.acts[0].proof_of_completion.splice(
            index,
            0,
            vue_context.data.proofs.acts[0].previous_proof[index]
          );
          // delete_act(index);
          // vue_context.$set(
          //   vue_context.data.acts[index],
          //   "state",
          //   vue_context.data.acts[index].previous_data.state
          // );
          //Tell the user that the act could not be deleted
          iziToast.error({
            title: "Error",
            message: "Sorry, the proof could not be deleted",
            position: "topRight"
          });
        });

      // return;

      // //Store act and it's current index
      // this.$set(this.deleted_acts, index, this.data.acts[index]);
      // // this.deleted_acts.push({act: this.data.acts[index], index: index});
      // //Remove act from array
      // this.data.acts.splice(index, 1);
      // //Make request to delete act

      // delete this.deleted_acts[index];
    },
    async change_act_state_by_manager()
    {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      //Store previous state of act
      this.$set(this.data.act, "previous_data", {
        enabled: this.data.act.enabled
      });
      //Get new state
      let new_state;
      if (this.data.act.previous_data.enabled == true)
        new_state = false;
      else new_state = true;
      //Change state of act
      this.$set(this.data.act, "enabled", new_state);
      //Make request to change state of act

      await axios
        .put(`/api/rewards/${vue_context.data.act._id}/state`, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .catch(function(err) {
          //If error, revert state of act
          vue_context.$set(
            vue_context.data.act,
            "enabled",
            vue_context.data.act.previous_data.enabled
          );
          //Tell the user that the act could not be altered
          iziToast.error({
            title: "Error",
            message: "Sorry, the reward state could not be altered",
            position: "topRight"
          });
        });
    },
    async change_act_state(index) {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      //Store previous state of act
      this.$set(this.data.act, "previous_data", {
        state: this.data.act.state
      });
      //Get new state
      let new_state;
      if (this.data.act.previous_data.state == "AVAILABLE")
        new_state = "NOT_AVAILABLE";
      else new_state = "AVAILABLE";
      //Change state of act
      this.$set(this.data.act, "state", new_state);
      //Make request to change state of act

      await axios
        .put(`/api/rewards/${vue_context.data.act._id}/user_state`, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .catch(function(err) {
          //If error, revert state of act
          vue_context.$set(
            vue_context.data.act,
            "state",
            vue_context.data.act.previous_data.state
          );
          //Tell the user that the act could not be altered
          iziToast.error({
            title: "Error",
            message: err.response.data.message,
            position: "topRight"
          });
        });
    },
    async save_act() {
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
      const name = document.getElementById("act_name").value;
      const description = document.getElementById("act_description").value;
      const value = document.getElementById("act_reward_points").value;
      const amount = document.getElementById("act_amount").value;
      const enabled_state = this.data.act.enabled;
      //If this is an event, get new start and end time too
      let start_time, end_time;

      // if (this.data.act.__t == "Event") {
      //   start_time = document.getElementById("act_start_time").value;
      //   end_time = document.getElementById("act_end_time").value;
      // }
      //Save previous name, description and reward points and enabled_state
      this.$set(this.data.act, "previous_data", {
        name: this.data.act.name,
        description: this.data.act.description,
        value: this.data.act.value,
        amount: this.data.act.amount,
        enabled: enabled_state
      });
      //If this is an event, save previous start and end times
      // if (this.data.act.__t == "Event") {
      //   this.$set(
      //     this.data.act.previous_data,
      //     "start_time",
      //     this.data.act.formated_start_time
      //   );
      //   this.$set(
      //     this.data.act.previous_data,
      //     "end_time",
      //     this.data.act.formated_end_time
      //   );
      // }
      // if (this.data.acts[index].__t == "Event") {
      //   this.$set(this.data.acts[index].previous_data, "start_time", this.data.acts[index].formated_start_time{
      //     start_time: this.data.acts[index].formated_start_time,
      //     end_time: this.data.acts[index].formated_end_time
      //   });
      // }
      //Update to new name, desription and reward points
      this.$set(this.data.act, "name", name);
      this.$set(this.data.act, "description", description);
      this.$set(this.data.act, "value", value);
      this.$set(this.data.act, "amount", amount);
      //If this is an event
      //Update to new start and end times
      // if (this.data.act.__t == "Event") {
      //   this.$set(
      //     this.data.act,
      //     "formated_start_time",
      //     moment(start_time).format("MMMM Do YYYY, h:mm:ss a")
      //   );
      //   this.$set(
      //     this.data.act,
      //     "formated_end_time",
      //     moment(end_time).format("MMMM Do YYYY, h:mm:ss a")
      //   );
      // }
      //Remember to disable the act
      // this.$set(this.data.act.enabled, "state", false);
      this.data.act.enabled = false;
      //Remove input fields
      this.edit_act();
      //Edit this act
      const params = new URLSearchParams();

      params.append("name", name);
      params.append("description", description);
      params.append("value", value);
      params.append("amount", amount);

      //If this is an event, edit its start and end times
      // if (this.data.act.__t == "Event") {
      //   params.append("start_time", start_time);
      //   params.append("end_time", end_time);
      // }

      await axios
        .put(`/api/rewards/${vue_context.data.act._id}`, params, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .catch(function(err) {
          //If error, revert to old name and description
          vue_context.$set(
            vue_context.data.act,
            "name",
            vue_context.data.act.previous_data.name
          );
          vue_context.$set(
            vue_context.data.act,
            "description",
            vue_context.data.act.previous_data.description
          );
          vue_context.$set(
            vue_context.data.act,
            "value",
            vue_context.data.act.previous_data.value
          );
          vue_context.$set(
            vue_context.data.act,
            "amount",
            vue_context.data.act.previous_data.amount
          );

          //Revert to previous state
          // vue_context.$set(
          //   vue_context.data.act.enabled,
          //   "state",
          //   vue_context.data.act.previous_data.enabled
          // );
          vue_context.data.act.enabled =
            vue_context.data.act.previous_data.enabled;

          //If this is an event, revert to old start and end times
          // if (vue_context.data.act.__t == "Event") {
          //   vue_context.$set(
          //     vue_context.data.act,
          //     "formated_start_time",
          //     vue_context.data.act.previous_data.start_time
          //   );
          //   vue_context.$set(
          //     vue_context.data.act,
          //     "formated_end_time",
          //     vue_context.data.act.previous_data.end_time
          //   );
          // }

          //Tell the user that the act could not be edited
          // let type_of_act = "act";
          // if (vue_context.data.act.__t == "Event")
          //   type_of_act = "event";
          iziToast.error({
            title: "Error",
            message: `Sorry, the reward could not be edited`,
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
form#smileys input[type="radio"] {
  -webkit-appearance: none;
  width: 30px;
  height: 30px;
  border: none;
  cursor: pointer;
  transition: border 0.2s ease;
  -webkit-filter: grayscale(100%);
          filter: grayscale(100%);
  margin: 0 0px;
  transition: all 0.2s ease;
}
form#smileys input[type="radio"]:hover, form#smileys input[type="radio"]:checked {
  -webkit-filter: grayscale(0);
          filter: grayscale(0);
}
form#smileys input[type="radio"]:focus {
  outline: 0;
}
form#smileys input[type="radio"].devil {
  background: url("~assets/images/smileys/devil.svg") center;
  background-size: cover;
}
form#smileys input[type="radio"].sad {
  background: url("~assets/images/smileys/sad.svg") center;
  background-size: cover;
}
form#smileys input[type="radio"].neutral {
  background: url("~assets/images/smileys/meh.svg") center;
  background-size: cover;
}
form#smileys input[type="radio"].happy {
  background: url("~assets/images/smileys/smile.svg") center;
  background-size: cover;
}
form#smileys input[type="radio"].love {
  background: url("~assets/images/smileys/heart.svg") center;
  background-size: cover;
}



.mtt {
  position: fixed;
  bottom: 10px;
  right: 20px;
  color: #999;
  text-decoration: none;
}
.mtt span {
  color: #e74c3c;
}
.mtt:hover {
  color: #666;
}
.mtt:hover span {
  color: #c0392b;
}
</style>

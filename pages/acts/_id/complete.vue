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
              <div v-if="data.act.image" class="blog-img w3-agile-grid">
                <img :src="`/api/acts/${data.act._id}/image`" alt class="img-fluid">
              </div>
              <div class="blog_info">
                <h5>
                  <div class="row">
                    <a class="col-md-9" tabindex="-1" v-if="!data.edit">{{data.act.name}}</a>
                    <h6>
                      <span class="badge badge-secondary">COMPLETED</span>
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
                  {{$t('by')}} {{data.act.act_provider.first_name}} {{data.act.act_provider.last_name}}
                  <a
                    href="#"
                    class="user-blog"
                  ></a>
                </p>

                <div>
                  <p v-html="data.act.description"></p>
                </div>
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
                          readonly
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
                          readonly
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
                <div
                  style="margin-bottom: 5px"
                  v-for="(proof, index) in data.proofs.completed_users[0].proof_of_completion"
                  class="justify-content-center"
                >
                  <a :href="`/api/acts/proof/${proof._id}`">{{proof.original_name}}</a>
                </div>
                <br>

                <form
                  id="smileys"
                  v-if="!data.proofs.completed_users[0].user_review_of_act.act_rating && !data.proofs.completed_users[0].user_review_of_act.act_comments"
                  @submit.prevent="submitRating"
                >
                  <span class="align-top">Rate the act:</span>
                  <input type="radio" name="smiley" value="1" class="devil" v-model="reward_rating">
                  <input type="radio" name="smiley" value="2" class="sad" v-model="reward_rating">
                  <input
                    type="radio"
                    name="smiley"
                    value="3"
                    class="neutral"
                    v-model="reward_rating"
                  >
                  <input type="radio" name="smiley" value="4" class="happy" v-model="reward_rating">
                  <input type="radio" name="smiley" value="5" class="love" v-model="reward_rating">
                  <textarea
                    class="form-control"
                    v-model="reward_comments"
                    placeholder="Additional comments about the act"
                  ></textarea>
                  <div class='text-center'><input class='btn btn-primary' type='submit' :value="$t('submit_rating')"></div>
                </form>
                <div
                  class="row"
                  v-if="data.act.act_provider.id == data.user.id || (data.roles && data.roles.manager)"
                >
                  <div class="col-md-7">
                    <span
                      v-if="data.roles && data.roles.manager && !data.roles.administrator"
                      class="badge badge-info"
                    >{{data.act.state ? $t('available') : $t('not_available')}}</span>
                    <span v-if="data.act.act_provider.id == data.user.id">
                      <a
                        tabindex="0"
                        style="cursor: pointer"
                        class="badge badge-info"
                        @click="change_act_state()"
                        v-if="data.act.state == 'AVAILABLE'"
                      >{{$t('available')}}</a>
                      <a
                        @click="change_act_state()"
                        v-if="data.act.state == 'NOT_AVAILABLE'"
                        class="badge badge-info"
                        tabindex="0"
                        style="cursor: pointer"
                      >{{$t('not_available')}}</a>
                    </span>
                    <a
                      v-if="data.roles && data.roles.manager"
                      tabindex="0"
                      class="badge badge-info"
                      @click="change_act_state_by_manager(index)"
                      style="cursor: pointer"
                    >{{data.act.enabled.state ? $t('enabled') : $t('disabled')}}</a>
                    <span
                      v-if="data.roles && !data.roles.manager"
                      class="badge badge-info"
                    >{{data.act.enabled.state ? $t('enabled') : $t('disabled')}}</span>
                  </div>
                  <div
                    class="col-md-5"
                    v-if="data.act.act_provider.id == data.user.id || ( data.roles && data.roles.administrator)"
                  >
                    <span v-if="!data.delete">
                      <nuxt-link :to="`/acts/${data.act._id}/edit`">
                        <button class="btn btn-primary">{{$t('edit')}}</button>
                      </nuxt-link>
                      
                      <button
                        v-if="data.edit"
                        @click="save_act"
                        class="btn btn-primary"
                      >{{$t('save')}}</button>
                      <button
                        v-if="data.edit"
                        @click="edit_act"
                        class="btn btn-danger"
                      >{{$t('cancel')}}</button>
                    </span>
                    <span v-if="!data.edit">
                      <button
                        v-if="!data.delete"
                        @click="delete_act"
                        class="btn btn-danger"
                      >{{$t('delete')}}</button>
                      <button
                        v-if="data.delete"
                        @click="delete_act"
                        class="btn btn-primary"
                      >{{$t('cancel')}}</button>
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
                    <span :title="$t('Reward_points')" class="fa fa-credit-card" aria-hidden="true"></span>
                    <span v-if="!data.edit">{{data.act.reward_points}}</span>
                    <input
                      id="act_reward_points"
                      v-if="data.edit"
                      type="number"
                      style="width: 40px"
                      :value="data.act.reward_points"
                    >
                    <i>|</i>
                  </li>
                  <li v-if="data.act.amount > 0">
                    <span title="Amount available" class="fa fa-clone" aria-hidden="true"></span>
                    <span v-if="!data.edit">{{data.act.amount}}</span>
                    <i>|</i>
                  </li>
                  <li>
                    <span
                      :title="$t('popularity')"
                      class="fa fa-angle-double-down"
                      aria-hidden="true"
                    ></span>
                    <span>{{data.act.total_number_of_clicks}}</span>
                    <i>|</i>
                  </li>
                  <li>
                    <span :title="$t('favorites')" class="fa fa-user" aria-hidden="true"></span>
                    <span>{{data.act.total_number_of_completions}}</span>
                  </li>
                </ul>
                <div v-if="!data.edit">
                  <span
                    v-for="tag in data.act.tags"
                    style="margin-right: 5px"
                    class="badge badge-secondary"
                  >{{tag.name}}</span>
                </div>
                <div class="form-inline" v-if="data.edit">
                  <a
                    v-for="(tag, tag_index) in data.act.tags"
                    tabindex="0"
                    style="margin-right: 5px; cursor: pointer"
                    class="badge badge-secondary"
                    @click="deleteTag(tag_index)"
                  >{{tag.name}}</a>
                  <input
                    type="text"
                    id="add_tag"
                    class="form-control"
                    :placeholder="$t('tags_placeholder')"
                  >
                </div>
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
  async asyncData(context) {
    const token = context.app.$cookies.get("token");
    const refresh_token = context.app.$cookies.get("refresh_token");

    let data;
    await axios
      .get(`/api/acts/${context.params.id}/complete`, {
        headers: { Cookie: `token=${token}; refresh_token=${refresh_token};` }
      })
      .then(function(res) {
        data = res.data;
        console.log(data.proofs.completed_users[0].proof_of_completion);
        //Loop through data and format date
        if (data.act.__t == "Event") {
          data.act.formated_start_time = moment(data.act.start_time).format(
            "MMMM Do YYYY, h:mm:ss a"
          );
          data.act.formated_end_time = moment(data.act.end_time).format(
            "MMMM Do YYYY, h:mm:ss a"
          );

          data.act.start_time = data.act.start_time.substring(
            0,
            data.act.start_time.length - 8
          );
          data.act.end_time = data.act.end_time.substring(
            0,
            data.act.end_time.length - 8
          );
        }
      })
      .catch(function(err) {
        if (err.response.status == 401) {
          context.redirect("/logout");
          return;
        }
      });
    
    return { data };
  },
  head() {
    return {
      title: "Asset Building Clinic : View act",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "View more details about your act"
        }
      ]
    };
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
      page: "acts",
      deleted_acts: {},
      upload_type: "act",
      add_act: {
        name: "",
        description: "",
        reward_points: "",
        start_time: "",
        end_time: ""
      },
      reward_rating: 0,
      reward_comments: "",
    };
  },
  methods: {
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
        .put(`/api/acts/${vue_context.data.act._id}/delete`, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .then(function(res) {
          //If successful
          //Show success message
          izitoast.success({
            title: "Success",
            message: "The act was successfully deleted",
            position: "topRight"
          });
          //Navigate (replace) to previous page
          vue_context.$router.go(-1);
        })
        .catch(function(err) {
          //If error, place act back
          //Tell the user that the act could not be deleted
          izitoast.error({
            title: "Error",
            message: "Sorry, the act could not be deleted",
            position: "topRight"
          });
        });
    },
    async deleteTag(tag_index) {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      //Save tag
      const saved_tag = this.data.act.tags[tag_index];
      //remove tag from screen
      this.data.act.tags.splice(tag_index, 1);
      //Make request to delete tag
      await axios
        .delete(`/api/acts/${vue_context.data.act._id}/tag/${saved_tag._id}`, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .catch(function(err) {
          //If error, place tag back
          vue_context.data.act.tags.splice(tag_index, 0, saved_tag);
          //Show error
          izitoast.error({
            title: "Error",
            message: "Sorry, the tag could not be deleted",
            position: "topRight"
          });
        });
    },
    async change_act_state_by_manager(index) {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      //Store previous state of act
      this.$set(this.data.act, "previous_data", {
        enabled: this.data.act.enabled.state
      });
      //Get new state
      let new_state;
      if (this.data.act.previous_data.enabled == true) new_state = false;
      else new_state = true;
      //Change state of act
      this.$set(this.data.act.enabled, "state", new_state);
      //Make request to change state of act

      await axios
        .put(`/api/acts/${vue_context.data.act._id}/enable/${new_state}`, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .catch(function(err) {
          //If error, revert state of act
          vue_context.$set(
            vue_context.data.act.enabled,
            "state",
            vue_context.data.act.previous_data.enabled
          );
          //Tell the user that the act could not be altered
          izitoast.error({
            title: "Error",
            message: "Sorry, the reward state could not be altered",
            position: "topRight"
          });
        });
    },
    async change_act_state() {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      //Store previous state of act
      this.data.act.previous_state = this.data.act.state;

      //Get new state
      let new_state;
      if (this.data.act.previous_state == "AVAILABLE")
        new_state = "NOT_AVAILABLE";
      else new_state = "AVAILABLE";
      //Change state of act
      this.$set(this.data.act, "state", new_state);
      //Make request to change state of act

      await axios
        .put(`/api/acts/${vue_context.data.act._id}/state`, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .catch(function(err) {
          //If error, revert state of act
          vue_context.$set(
            vue_context.data.act,
            "state",
            vue_context.data.act.previous_state
          );
          //Tell the user that the act could not be altered
          izitoast.error({
            title: "Error",
            message: "Sorry, the act state could not be altered",
            position: "topRight"
          });
        });
    },
    submitRating(){
      //If reward or reward provider rating is 0, error
      if (this.reward_rating == 0)
      {
        izitoast.error({
            title: "Error",
            message: "You must rate the act before submitting",
            position: "topRight"
          });
          return;
      }
      //Remove the form from the page
      this.$set(this.data.proofs.completed_users[0], 'user_review_of_act', {act_rating: 1});
      // this.data.proofs.completed_users[0].user_review_of_act.act_rating = 1;
      //Send rating
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      const params = new URLSearchParams();
      params.append("reward_rating", this.reward_rating);
      params.append("reward_comments", this.reward_comments);

      axios
        .put(`/api/acts/${this.$route.params.id}/review`, params, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .then(function(res) {
          //If successful
          //Show success message
          izitoast.success({
            title: "Thank you",
            message: "Your review has been received",
            position: "topRight"
          });
        })
        .catch(function(err) {
                //If error,
      //Place the form back
      // vue_context.data.proofs.completed_users[0].user_review_of_act.act_rating = null;
      vue_context.$set(vue_context.data.proofs.completed_users[0], 'user_review_of_act', {act_rating: null});
      //Give error
          izitoast.error({
            title: "Error",
            message: "Sorry, your review could not be sent",
            position: "topRight"
          });
        });

    },
  }
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
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
                <img :src="`/api/acts/${$route.params.id}/image`" alt class="img-fluid">
              </div>
              <div class="blog_info">
                <h5>
                  <div class="row">
                    <a class="col-md-9" tabindex="-1" v-if="!data.edit">{{data.act.name}}</a>
                    <h6>
                      <span class="badge badge-secondary">{{data.proofs.acts[0].state}}</span>
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
                <!-- <textarea
                  id="act_description"
                  v-if="data.edit"
                  class="form-control"
                  rows="4"
                  :value="data.act.description"
                ></textarea>-->
                <!-- <div>
                  <h3>How to submit evidences</h3>
                  <p v-html="data.act.how_to_submit_evidences"></p>
                </div> -->
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
                    :title="'<a href=\'/api/acts/proof/' + proof._id + '\'>' + $t('view') + '</a>'"
                    :data-content="'<a style=\'cursor: pointer\' id=\'' + index + '\' class=\'delete_name\' name=\'' + proof._id + '\'>' + $t('delete') + '</a>'"
                    data-trigger="focus"
                    data-html="true"
                    style="cursor: pointer"
                  >{{proof.original_name}}</a>
                  <a
                    v-if="data.proofs.acts[0].state == 'COMPLETED'"
                    :href="`/api/acts/proof/${proof._id}`"
                  >{{proof.original_name}}</a>
                </div>
                <br>

                <!-- <form
                  id="smileys"
                  v-if="data.rewards && data.rewards.rewards[0].state == 'COMPLETED' && !data.review"
                  @submit.prevent="submitRating"
                >
                  <span class="align-top">{{$t('rate_the_reward')}}:</span>
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
                    :placeholder="$t('additional_comments_about_the_reward')"
                  ></textarea>

                  <br>
                  <span class="align-top">{{$t('rate_the_reward_provider')}}:</span>
                  <input
                    type="radio"
                    name="smiley1"
                    value="1"
                    class="devil"
                    v-model="reward_provider_rating"
                  >
                  <input
                    type="radio"
                    name="smiley1"
                    value="2"
                    class="sad"
                    v-model="reward_provider_rating"
                  >
                  <input
                    type="radio"
                    name="smiley1"
                    value="3"
                    class="neutral"
                    v-model="reward_provider_rating"
                  >
                  <input
                    type="radio"
                    name="smiley1"
                    value="4"
                    class="happy"
                    v-model="reward_provider_rating"
                  >
                  <input
                    type="radio"
                    name="smiley1"
                    value="5"
                    class="love"
                    v-model="reward_provider_rating"
                  >
                  <textarea
                    class="form-control"
                    v-model="reward_provider_comments"
                    :placeholder="$t('additional_comments_about_the_reward_provider')"
                  ></textarea>
                  <br>
                  <div class="text-center">
                    <input class="btn btn-primary" type="submit" :value="$t('submit_rating')">
                  </div>
                </form> -->

                <div
                  v-if="data.act.enabled.state && data.act.state == 'AVAILABLE' && data.proofs.acts[0].state !== 'COMPLETED'"
                  class="form-inline justify-content-center"
                >
                  <input
                    @change="fileChanged"
                    type="file"
                    multiple
                    class="form-control"
                    name="file"
                    id="file_input"
                  >
                  <input
                    @click="uploadProof"
                    type="button"
                    :value="$t('upload_proof_of_completion')"
                    class="btn btn-primary"
                  >
                </div>
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
                      <!-- <button
                        v-if="!data.edit"
                        @click="edit_act"
                        class="btn btn-primary"
                      >{{$t('edit')}}</button>-->
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

    $(document).on("click", ".delete_name", function(event) {
      event.stopPropagation();
      event.stopImmediatePropagation();
      var target = $(event.target);
      const index = target[0].id;
      const id = target[0].name;
      vue_context.deleteProof(index, id);
    });
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
    if (!data.proofs) {
      const acts = {
        acts: [{ state: "" }]
      };
      data.proofs = acts;
    } else if (data.proofs.acts[0].state) {
      data.proofs.acts[0].state = data.proofs.acts[0].state.replace("_", " ");
    }
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
      }
    };
  },
  methods: {
    fileChanged(event) {
      this.files = event.target.files;
    },
    async uploadProof() {
      if (!this.files || this.files.length == 0) return;
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
          // if (vue_context.data.proofs.acts[0].proof_of_completion)
          //   vue_context.data.proofs.acts[0].proof_of_completion = vue_context.data.proofs.acts[0].proof_of_completion.concat(
          //     res.data
          //   );
          // else
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
      $('[data-toggle="popover"]').popover();
    },
    navigateTo(index) {
      var element = this.$refs["acts_come_here"];
      var top = element.offsetTop;

      scrollToElement(element);
      this.$router.push(
        `/acts?type=${this.query.type}&sort=${this.query.sort}&order=${
          this.query.order
        }&search=${vue_context.query.search}&page=${index}
        `
      );
    },
    previous() {
      this.navigateTo(this.data.query.page - 1);
    },
    next() {
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
      this.$router.push(`/acts?type=${this.query.type}`);
    },
    upload_type_changed() {},
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
      // const encoded_id = btoa(id);

      //Send request to remove the proof from the database
      await axios
        .delete(`/api/acts/proof/${id}`, {
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
          //Tell the user that the act could not be deleted
          izitoast.error({
            title: "Error",
            message: "Sorry, the proof could not be deleted",
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
    async save_act() {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      //Get new name, description and reward points
      const name = document.getElementById("act_name").value;
      const description = document.getElementById("act_description").value;
      const reward_points = document.getElementById("act_reward_points").value;
      const enabled_state = this.data.act.enabled.state;
      //If this is an event, get new start and end time too
      let start_time, end_time;

      if (this.data.act.__t == "Event") {
        start_time = document.getElementById("act_start_time").value;
        end_time = document.getElementById("act_end_time").value;
      }
      //Save previous name, description and reward points and enabled_state
      this.$set(this.data.act, "previous_data", {
        name: this.data.act.name,
        description: this.data.act.description,
        reward_points: this.data.act.reward_points,
        enabled: enabled_state
      });
      //If this is an event, save previous start and end times
      if (this.data.act.__t == "Event") {
        this.$set(
          this.data.act.previous_data,
          "start_time",
          this.data.act.formated_start_time
        );
        this.$set(
          this.data.act.previous_data,
          "end_time",
          this.data.act.formated_end_time
        );
      }
      //Update to new name, desription and reward points
      this.$set(this.data.act, "name", name);
      this.$set(this.data.act, "description", description);
      this.$set(this.data.act, "reward_points", reward_points);
      //If this is an event
      //Update to new start and end times
      if (this.data.act.__t == "Event") {
        this.$set(
          this.data.act,
          "formated_start_time",
          moment(start_time).format("MMMM Do YYYY, h:mm:ss a")
        );
        this.$set(
          this.data.act,
          "formated_end_time",
          moment(end_time).format("MMMM Do YYYY, h:mm:ss a")
        );
      }
      //Remember to disable the act
      this.$set(this.data.act.enabled, "state", false);
      //Remove input fields
      this.edit_act();
      //Edit this act
      const params = new URLSearchParams();

      const new_tag = document.getElementById("add_tag").value;
      document.getElementById("add_tag").value = "";

      params.append("name", name);
      params.append("description", description);
      params.append("reward_points", reward_points);
      if (new_tag) params.append("tags", new_tag);

      //If this is an event, edit its start and end times
      if (this.data.act.__t == "Event") {
        params.append("start_time", start_time);
        params.append("end_time", end_time);
      }

      await axios
        .put(`/api/acts/${vue_context.data.act._id}`, params, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .then(function(res) {
          // vue_context.data.act.add_tags = "";
          //Replace this act tags
          vue_context.$set(vue_context.data.act, "tags", res.data.tags);
        })
        .catch(function(err) {
          if (err) {
            console.log("Error:", err);
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
              "reward_points",
              vue_context.data.act.previous_data.reward_points
            );

            //Revert to previous state
            vue_context.$set(
              vue_context.data.act.enabled,
              "state",
              vue_context.data.act.previous_data.enabled
            );

            //If this is an event, revert to old start and end times
            if (vue_context.data.act.__t == "Event") {
              vue_context.$set(
                vue_context.data.act,
                "formated_start_time",
                vue_context.data.act.previous_data.start_time
              );
              vue_context.$set(
                vue_context.data.act,
                "formated_end_time",
                vue_context.data.act.previous_data.end_time
              );
            }

            //Tell the user that the act could not be edited
            let type_of_act = "act";
            if (vue_context.data.act.__t == "Event") type_of_act = "event";
            izitoast.error({
              title: "Error",
              message: err.response.data.message,
              position: "topRight"
            });
          }
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
        });
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
      }
    }
  }
};
</script>

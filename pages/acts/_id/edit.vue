<template>
  <div>
    <my-header :logged_in="logged_in" :page="page" :roles="data.roles"/>
    <my-banner :title="title"/>
    <section class="banner-bottom-w3ls-agileinfo py-5">
      <!--/blog-->
      <div class="container py-md-3">
        <br>
        <div class="row inner-sec-wthree-agileits">
          <div class="col-lg-12 blog-sp">
            <div class="single-gd" v-if="data.roles && data.roles.act_poster">
              <template v-if="data.act.image">
                <img :src="`/api/acts/${data.act._id}/image`" class="img-fluid" alt>
                <div class="text-center">
                  <button
                    @click="deleteImage"
                    class="btn btn-danger"
                    :class="{'disabled': disable_delete_button}"
                  >{{delete_act_image}}</button>
                </div>
                <br>
              </template>
              <!-- <h4>Add Act</h4> -->
              <form @submit.prevent="editAct">
                <label for="name">Name</label>
                <input
                  class="form-control"
                  v-model="data.act.name"
                  type="text"
                  name="name"
                  :placeholder="$t('name')"
                  required
                  id="name"
                >
                <!-- <textarea
                  rows="10"
                  class="form-control"
                  name="description"
                  :placeholder="$t('description')"
                  required
                ></textarea>-->
                <label for="summernote">Description</label>
                <textarea id="summernote" name="editordata"></textarea>
                <br>
                <label for="summernote1">How to submit evidences</label>
                <textarea id="summernote1" name="editordata"></textarea>
                <br>
                <div v-if="data.act.__t == 'Event'" class="control-group">
                  <div
                    class="controls input-append date form_datetime"
                    data-date-format="yyyy-mm-ddThh:ii"
                    data-link-field="dtp_input1"
                  >
                    <input
                      size="16"
                      :placeholder="$t('start_time')"
                      readonly
                      type="text"
                      class="form-control"
                      v-model="data.act.formated_start_time"
                      id="start_time"
                    >
                    <span class="add-on">
                      <i class="icon-remove"></i>
                    </span>
                    <span class="add-on">
                      <i class="icon-th"></i>
                    </span>
                  </div>
                  <input type="hidden" id="dtp_input1" value>
                  <div
                    class="controls input-append date form_datetime"
                    data-date-format="yyyy-mm-ddThh:ii"
                    data-link-field="dtp_input1"
                  >
                    <input
                      size="16"
                      id="end_time"
                      readonly
                      :placeholder="$t('end_time')"
                      type="text"
                      class="form-control"
                      v-model="data.act.formated_end_time"
                    >
                    <span class="add-on">
                      <i class="icon-remove"></i>
                    </span>
                    <span class="add-on">
                      <i class="icon-th"></i>
                    </span>
                  </div>
                  <input type="hidden" id="dtp_input1" value>
                  <script></script>
                </div>
                <label for="amount">Amount of users who can execute this act ( -1 is unlimited )</label>
                <input
                  class="form-control"
                  type="number"
                  name="amount"
                  placeholder="Amount of users who can execute this act"
                  required
                  id="amount"
                  v-model="data.act.amount"
                >
                <label for="reward_points">Reward points</label>
                <input
                  class="form-control"
                  type="number"
                  name="reward_points"
                  id="reward_points"
                  :placeholder="$t('Reward_points')"
                  required
                  v-model="data.act.reward_points"
                >
                <label for="tags">Tags</label>
                <input
                  class="form-control"
                  type="text"
                  name="tags"
                  id="tags"
                  :placeholder="$t('tags_placeholder')"
                  v-model="tags"
                >
                <label for="file">Image should be 1600 X 800</label>
                <input class="form-control" @change="fileChanged" id="file" type="file" name="file">
                <label for="expiration_date">Expiration date</label>
                <div class="input-append date" id="dp3" data-date-format="yyyy-mm-dd">
                  <input
                    placeholder="Expiration date"
                    readonly
                    class="span2 form-control"
                    size="16"
                    type="text"
                    id="expiration_date"
                    :value="data.act.expiration_date"
                  >
                  <span class="add-on">
                    <i class="icon-th"></i>
                  </span>
                </div>
                <!-- <input
                  class="form-control"
                  type="text"
                  name="expiration_date"
                  placeholder="Expiration date"
                  v-model="add_act.expiration_date"
                >-->
                <!-- <label for="file">Image should be 1600 X 800</label>
                <input class="form-control" id="file" type="file" name="file">-->
                <div class="button">
                  <input class="form-control" type="submit" :value="$t('submit')">
                </div>
              </form>
            </div>
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
    $(".form_datetime")
      .datetimepicker({
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        forceParse: 0,
        showMeridian: 1
      })
      .on("changeDate", function(ev) {
        vue_context.data.act.start_time = document.getElementById('start_time').value;
        vue_context.data.act.formated_start_time = document.getElementById('start_time').value;
        vue_context.data.act.end_time = document.getElementById('end_time').value;
        vue_context.data.act.formated_end_time = document.getElementById('end_time').value;
      });
    const doc = document.createElement("span");
    doc.innerHTML = vue_context.data.act.description;
    const doc1 = document.createElement("span");
    doc1.innerHTML = vue_context.data.act.how_to_submit_evidences;
    izitoast = require("izitoast");
    $(document).ready(function() {
      $("#summernote").summernote({
        placeholder: "Description",
        height: 300,
        callbacks: {
          // onChange: function(contents, $editable) {
          //   vue_context.$set(vue_context.data.act, 'description', contents)
          //   vue_context.data.act.description = contents;
          //   // console.log('onChange:', contents);
          // }
        }
      });
      $("#summernote").summernote("insertNode", doc);
      $("#summernote1").summernote({
        placeholder: "How to submit evidences",
        height: 300,
      });
      $("#summernote1").summernote("insertNode", doc1);
    });
    $("#dp3")
      .datepicker({
        autoclose: true
      })
      .on("changeDate", function(ev) {
        vue_context.data.act.expiration_date = ev.date;
      });
  },
  async asyncData(context) {
    const token = context.app.$cookies.get("token");
    const refresh_token = context.app.$cookies.get("refresh_token");

    let data, tags;
    tags = "";
    await axios
      .get(`/api/acts/${context.params.id}`, {
        headers: { Cookie: `token=${token}; refresh_token=${refresh_token};` }
      })
      .then(function(res) {
        data = res.data;
        //Loop through data and format date
        if (data.act.tags)
          data.act.tags.forEach(element => {
            tags += `${element.name} `;
          });
        if (data.act.expiration_date)
          data.act.expiration_date = moment(data.act.expiration_date).format(
            "YYYY-MM-DD"
          );
        if (data.act.__t == "Event") {
          data.act.formated_start_time = moment(data.act.start_time).format(
            "YYYY-MM-DDTHH:mm"
          );
          data.act.formated_end_time = moment(data.act.end_time).format(
            "YYYY-MM-DDTHH:mm"
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
    return { data, tags };
  },
  head () {
    return {
      title: "Asset Building Clinic : Edit act",
      meta: [
        { hid: 'description', name: 'description', content: 'Make changes to your act' }
      ]
    }
  },
  data() {
    return {
      title: "edit_act",
      error: "",
      disable_delete_button: false,
      delete_act_image: "Delete Act Image",
      status_message: "",
      status_state: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      image: null,
      logged_in: true,
      page: "add_act",
      saved_tags: [],
      deleted_acts: {},
      upload_type: "act",
      add_act: {
        name: "",
        amount: "",
        description: "",
        how_to_submit_evidences: "",
        reward_points: "",
        start_time: "",
        end_time: "",
        expiration_date: ""
      }
    };
  },
  async beforeRouteUpdate(to, from, next) {
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
        const data = res.data;
        //Loop through data and format date
        data.acts.forEach(element => {
          if (element.__t == "Event") {
            element.formated_start_time = moment(element.start_time).format(
              "MMMM Do YYYY, h:mm:ss a"
            );
            element.formated_end_time = moment(element.end_time).format(
              "MMMM Do YYYY, h:mm:ss a"
            );

            element.start_time = element.start_time.substring(
              0,
              element.start_time.length - 8
            );
            element.end_time = element.end_time.substring(
              0,
              element.end_time.length - 8
            );
          }
        });
        vue_context.data = data;
      })
      .catch(function(err) {
        if (err.response.status == 401) {
          vue_context.$router.redirect("/logout");
        }
      });
    next();
  },
  methods: {
    fileChanged(event) {
      this.image = event.target.files[0];
      console.log(this.image);
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
    async deleteImage() {
      if (this.disable_delete_button) return;
      //Disable delete button
      this.disable_delete_button = true;
      //Change button to indicate current state
      this.delete_act_image = "Deleting image...";
      //Send request to delete image
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      await axios
        .delete(`/api/acts/${this.$route.params.id}/image`, {
          headers: { Cookie: `token=${token}; refresh_token=${refresh_token};` }
        })
        .then(function(res) {
          //If works
          //Remove image from screen
          vue_context.data.act.image = null;
          //Give success message
          izitoast.success({
            title: "Success",
            message: "Image successfully deleted",
            position: "topRight"
          });
        })
        .catch(function(err) {
          //If error
          //Give error
          izitoast.error({
            title: "Error",
            message: "Image could not be deleted",
            position: "topRight"
          });
        });

      //When done,
      //Return button to clickable state
      //Change button text to show normal state
      this.disable_delete_button = false;
      this.delete_act_image = "Delete Act Image";
    },
    reset() {
      this.query.order = "";
      this.query.page = 1;
      this.query.search = "";
      this.query.sort = "";
      this.$router.push(`/acts?type=${this.query.type}`);
    },
    type_changed() {
      this.$router.push(`/acts?type=${this.query.type}`);
    },
    upload_type_changed() {},
    async editAct() {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");
      const params = new FormData();

      this.data.act.description = $("#summernote").summernote("code");
      this.data.act.how_to_submit_evidences = $("#summernote1").summernote("code");

      params.append("name", this.data.act.name);
      params.append("description", this.data.act.description);
      params.append("how_to_submit_evidences", this.data.act.how_to_submit_evidences);
      params.append("reward_points", this.data.act.reward_points);
      params.append("amount", this.data.act.amount);
      if (this.data.act.expiration_date)
        params.append("expiration_date", this.data.act.expiration_date);
      if (this.image) params.append("file", this.image, this.image.name);
      if (this.tags) params.append("tags", this.tags);
      if (this.data.act.__t == "Event") {
        if (
          !document.getElementById("start_time").value ||
          !document.getElementById("end_time").value
        ) {
          izitoast.error({
            title: "Error",
            message: "Start time and end time must be inputted",
            position: "topRight"
          });
          return;
        }

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
        .put(`/api/acts/${vue_context.$route.params.id}`, params, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .then(function(res) {
          izitoast.success({
            title: "Success",
            message: "Your act has been successfully edited",
            position: "topRight"
          });

          //If image was uploaded, attach the image to this act

          // vue_context.add_act.name = "";
          // vue_context.add_act.description = "";
          // $("#summernote").summernote("code", "");
          // vue_context.add_act.amount = "";
          // vue_context.add_act.reward_points = "";
          // vue_context.add_act.tags = "";
          document.getElementById("file").value = null;

          // if (vue_context.upload_type == "event") {
          //   document.getElementById("end_time").value = "";
          //   document.getElementById("start_time").value = "";
          // } else document.getElementById("expiration_date").value = "";
        })
        .catch(function(err) {
          izitoast.error({
            title: "Error",
            message: err.response.data.message,
            position: "topRight"
          });
        });
    },
    delete_act(index) {
      if (!this.data.acts[index].delete)
        this.$set(this.data.acts[index], "delete", true);
      else this.$set(this.data.acts[index], "delete", false);
    },
    async deleteTag(tag_index, act_index) {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      //Save tag
      this.saved_tags[act_index] = {
        tag_index: this.data.acts[act_index].tags[tag_index]
      };
      const tag_id = this.data.acts[act_index].tags[tag_index]._id;
      //remove tag from screen
      this.data.acts[act_index].tags.splice(tag_index, 1);
      //Make request to delete tag
      await axios
        .delete(
          `/api/acts/${vue_context.data.acts[act_index]._id}/tag/${tag_id}`,
          {
            headers: {
              Cookie: `token=${token}; refresh_token=${refresh_token};`
            }
          }
        )
        .catch(function(err) {
          //If error, place tag back
          vue_context.data.acts[act_index].tags.splice(
            tag_index,
            0,
            vue_context.saved_tags[act_index].tag_index
          );
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
      this.$set(this.data.acts[index], "previous_data", {
        enabled: this.data.acts[index].enabled.state
      });
      //Get new state
      let new_state;
      if (this.data.acts[index].previous_data.enabled == true)
        new_state = false;
      else new_state = true;
      //Change state of act
      this.$set(this.data.acts[index].enabled, "state", new_state);
      //Make request to change state of act

      await axios
        .put(
          `/api/acts/${vue_context.data.acts[index]._id}/enable/${new_state}`,
          {
            headers: {
              Cookie: `token=${token}; refresh_token=${refresh_token};`
            }
          }
        )
        .catch(function(err) {
          //If error, revert state of act
          vue_context.$set(
            vue_context.data.acts[index].enabled,
            "state",
            vue_context.data.acts[index].previous_data.enabled
          );
          //Tell the user that the act could not be altered
          izitoast.error({
            title: "Error",
            message: "Sorry, the reward state could not be altered",
            position: "topRight"
          });
        });
    },
    async confirm_delete_act(index) {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      //Store act and it's current index
      this.$set(this.deleted_acts, index, this.data.acts[index]);
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
          //Tell the user that the act could not be deleted
          izitoast.error({
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
          izitoast.error({
            title: "Error",
            message: "Sorry, the act state could not be altered",
            position: "topRight"
          });
        });
    },
    async save_act(index) {
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

      const new_tag = document.getElementById("add_tag").value;
      document.getElementById("add_tag").value = "";

      params.append("name", name);
      params.append("description", description);
      params.append("reward_points", reward_points);
      if (new_tag) params.append("tags", new_tag);

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
        .then(function(res) {
          // vue_context.data.acts[index].add_tags = "";
          //Replace this act tags
          vue_context.data.acts[index].tags = res.data.tags;
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
          izitoast.error({
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
      const params = new FormData();

      this.add_act.description = $("#summernote").summernote("code");

      params.append("name", this.add_act.name);
      params.append("description", this.add_act.description);
      params.append("reward_points", this.add_act.reward_points);
      params.append("amount", this.add_act.amount);
      if (this.add_act.expiration_date)
        params.append("expiration_date", this.add_act.expiration_date);
      if (this.image) params.append("file", this.image, this.image.name);
      if (this.add_act.tags) params.append("tags", this.add_act.tags);
      if (this.upload_type == "event") {
        if (
          !document.getElementById("start_time").value ||
          !document.getElementById("end_time").value
        ) {
          izitoast.error({
            title: "Error",
            message: "Start time and end time must be inputted",
            position: "topRight"
          });
          return;
        }

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
          izitoast.success({
            title: "Success",
            message: "Your act has been successfully created",
            position: "topRight"
          });
          vue_context.add_act.name = "";
          vue_context.add_act.description = "";
          $("#summernote").summernote("code", "");
          vue_context.add_act.amount = "";
          vue_context.add_act.reward_points = "";
          vue_context.add_act.tags = "";
          document.getElementById("file").value = null;

          if (vue_context.upload_type == "event") {
            document.getElementById("end_time").value = "";
            document.getElementById("start_time").value = "";
          } else document.getElementById("expiration_date").value = "";

          // // console.log(vue_context.query.type);
          // //If not admin
          // if (!vue_context.data.roles.administrator) {
          //   //If not in My acts
          //   if (vue_context.query.type != "MY_ACTS") {
          //     //Navigate to my acts
          //     vue_context.query.type = "MY_ACTS";
          //     vue_context.$router.push(`/acts?type=MY_ACTS`);
          //   } else {
          //     //If already in my acts
          //     //Add this new act to top of page
          //     vue_context.data.acts.splice(0, 0, res.data);
          //   }
          // } else {
          //   //If admin,
          //   //If not in available
          //   if (vue_context.query.type != "AVAILABLE") {
          //     //Navigate to available
          //     vue_context.query.type = "AVAILABLE";
          //     vue_context.$router.push(`/acts?type=AVAILABLE`);
          //   } else {
          //     //If in available
          //     //Add this new act to top of page
          //     //If this is an event
          //     //Format the start and end time first

          //     if (vue_context.upload_type == "event") {
          //       res.data.formated_start_time = moment(
          //         res.data.start_time
          //       ).format("MMMM Do YYYY, h:mm:ss a");
          //       ("MMMM Do YYYY, h:mm:ss a");
          //       res.data.formated_end_time = moment(res.data.end_time).format(
          //         "MMMM Do YYYY, h:mm:ss a"
          //       );
          //       ("MMMM Do YYYY, h:mm:ss a");

          //       res.data.start_time = moment(res.data.start_time).format(
          //         moment.HTML5_FMT.DATETIME_LOCAL
          //       );
          //       res.data.end_time = moment(res.data.end_time).format(
          //         moment.HTML5_FMT.DATETIME_LOCAL
          //       );
          //     }

          //     vue_context.data.acts.splice(0, 0, res.data);
          //   }
          // }
        })
        .catch(function(err) {
          // console.log(err);
          izitoast.error({
            title: "Error",
            message: err.response.data.message,
            position: "topRight"
          });
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
        //If all fields are present
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

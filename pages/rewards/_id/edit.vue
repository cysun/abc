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
                <img :src="`/api/rewards/${data.act._id}/image`" class="img-fluid" alt>
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
                <label for="summernote">Description</label>
                <textarea id="summernote" name="editordata"></textarea>
                <div v-if="upload_type == 'event'" class="control-group">
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
                      value
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
                      value
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
                <label for="value">Value</label>
                <input
                  class="form-control"
                  type="number"
                  name="value"
                  placeholder="Value"
                  required
                  id="value"
                  v-model="data.act.value"
                >
                <label for="amount">Amount available ( -1 is unlimited )</label>
                <input
                  class="form-control"
                  type="number"
                  name="amount"
                  id="amount"
                  :placeholder="$t('amount')"
                  required
                  v-model="data.act.amount"
                >
                <label for="file">Image should be 1600 X 800</label>
                <input class="form-control" @change="fileChanged" id="file" type="file" name="file">
               
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
    const doc = document.createElement("span");
    doc.innerHTML = vue_context.data.act.description;
    izitoast = require("izitoast");
    $(document).ready(function() {
      $("#summernote").summernote({
        placeholder: "Description",
        height: 300,
        toolbar: [
          ["para", ["style"]],
          ["style", ["bold", "underline", "clear"]],
          ["style", ["fontname", "fontsize"]],
          ["color", ["color"]],
          ["para", ["ul", "ol", "paragraph"]],
          ["insert", ["table"]],
          ["insert", ["link", "picture"]],
          ["misc", ["fullscreen", "codeview", "help"]]
        ]
      });
      $("#summernote").summernote("insertNode", doc);
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
      .get(`/api/rewards/${context.params.id}`, {
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
    return { data, tags };
  },
  head() {
    return {
      title: "Asset Building Clinic : Edit your reward",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Make changes to your reward"
        }
      ]
    };
  },
  data() {
    return {
      title: "edit_reward",
      error: "",
      disable_delete_button: false,
      delete_act_image: "Delete Reward Image",
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
        .delete(`/api/rewards/${this.$route.params.id}/image`, {
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
      this.delete_act_image = "Delete Reward Image";
    },
    async editAct() {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");
      const params = new FormData();

      this.data.act.description = $("#summernote").summernote("code");

      params.append("name", this.data.act.name);
      params.append("description", this.data.act.description);
      params.append("value", this.data.act.value);
      params.append("amount", this.data.act.amount);
      if (this.data.act.expiration_date)
        params.append("expiration_date", this.data.act.expiration_date);
      if (this.image) params.append("file", this.image, this.image.name);
      if (this.tags) params.append("tags", this.tags);
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
        .put(`/api/rewards/${vue_context.$route.params.id}`, params, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .then(function(res) {
          izitoast.success({
            title: "Success",
            message: "Your reward has been successfully edited",
            position: "topRight"
          });

          //If image was uploaded, attach the image to this act
          document.getElementById("file").value = null;
        })
        .catch(function(err) {
          izitoast.error({
            title: "Error",
            message: err.response.data.message,
            position: "topRight"
          });
        });
    },
  }
};
</script>

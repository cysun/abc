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
            <div class="single-gd" v-if="data.roles && data.roles.reward_provider">
              <form @submit.prevent="addAct">
                <label for="name">Name</label>
                <input
                  class="form-control"
                  v-model="add_act.name"
                  type="text"
                  name="name"
                  id="name"
                  :placeholder="$t('name')"
                  required
                >
                <label for="summernote">Description</label>
                <textarea id="summernote" name="editordata"></textarea>
                <div v-if="upload_type == 'event'" class="control-group">
                  <label for="start_time">Start time</label>
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
                      <i class="icon-th"></i>
                    </span>
                  </div>
                  <input type="hidden" id="dtp_input1" value>
                  <label for="end_time">End time</label>
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
                  id="value"
                  name="value"
                  placeholder="Value"
                  required
                  v-model="add_act.value"
                >
                <label for="amount">Amount available ( -1 is unlimited )</label>
                <input
                  class="form-control"
                  type="number"
                  id="amount"
                  name="reward_points"
                  placeholder="Amount available"
                  required
                  v-model="add_act.amount"
                >
                <label for="file">Image should be 1600 X 800</label>
                <input class="form-control" @change="fileChanged" id="file" type="file" name="file">
                <div class="button">
                  <input
                    class="form-control"
                    :class="{'disabled': disable_submit_button}"
                    type="submit"
                    :value="submit_text"
                  >
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
    izitoast = require("izitoast");
    $(document).ready(function() {
      $("#summernote").summernote({
        placeholder: "Description",
        height: 300,
        toolbar: [
          // [groupName, [list of button]]
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
    });
  },
  async asyncData(context) {
    const token = context.app.$cookies.get("token");
    const refresh_token = context.app.$cookies.get("refresh_token");

    if (!context.query.sort) context.query.sort = "";
    if (!context.query.search) context.query.search = "";
    if (!context.query.order) context.query.order = "";
    if (!context.query.page) context.query.page = 1;
    if (!context.query.type) context.query.type = "AVAILABLE";

    let data;
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
        data = res.data;
        //Loop through data and format date
        data.acts.forEach(element => {
          if (element.__t == "Event") {
            element.formated_start_time = moment(element.start_time).format(
              "MMMM Do YYYY, h:mm:ss a"
            );
            element.formated_end_time = moment(element.end_time).format(
              "MMMM Do YYYY, h:mm:ss a"
            );

            element.start_time = moment(element.start_time).format(
              moment.HTML5_FMT.DATETIME_LOCAL
            );
            element.end_time = moment(element.end_time).format(
              moment.HTML5_FMT.DATETIME_LOCAL
            );
          }
        });
      })
      .catch(function(err) {
        if (err.response.status == 401) {
          context.redirect("/logout");
        }
      });
    return { query: context.query, data };
  },
  head () {
    return {
      title: "Asset Building Clinic : Create Reward",
      meta: [
        { hid: 'description', name: 'description', content: 'Create rewards' }
      ]
    }
  },
  data() {
    return {
      title: "add_reward",
      submit_text: "Submit",
      disable_submit_button: false,
      error: "",
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
        value: ""
      }
    };
  },
  methods: {
    fileChanged(event) {
      this.image = event.target.files[0];
    },
    async addAct() {
      if (this.disable_submit_button) return;
      this.disable_submit_button = true;
      this.submit_text = "Submitting...";
      this.$nuxt.$loading.start();
      // vue_context.$nuxt.$loading.finish();
      // alert("Hello World");
      //Send act
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");
      const params = new FormData();

      this.add_act.description = $("#summernote").summernote("code");

      params.append("name", this.add_act.name);
      params.append("description", this.add_act.description);
      params.append("value", this.add_act.value);
      params.append("amount", this.add_act.amount);
      if (this.image) params.append("file", this.image, this.image.name);
      await axios
        .post(`/api/rewards`, params, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .then(function(res) {
          izitoast.success({
            title: "Success",
            message: "Your reward has been successfully created",
            position: "topRight"
          });
          vue_context.add_act.name = "";
          vue_context.add_act.description = "";
          $("#summernote").summernote("code", "");
          vue_context.add_act.amount = "";
          vue_context.add_act.value = "";
          document.getElementById("file").value = null;
        })
        .catch(function(err) {
          izitoast.error({
            title: "Error",
            message: err.response.data.message,
            position: "topRight"
          });
        });
      this.disable_submit_button = false;
      this.submit_text = "Submit";
      this.$nuxt.$loading.finish();
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

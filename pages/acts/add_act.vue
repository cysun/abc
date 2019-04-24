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
              <!-- <img src="images/a3.jpg" class="img-fluid" alt> -->
              <div
                v-if="status_message"
                class="alert"
                :class="{'alert-danger': status_state == 'Error', 'alert-success': status_state == 'Success'}"
              >
                <strong>{{status_state}}:</strong>
                {{status_message}}
              </div>
              <select @change="upload_type_changed" class="form-control" v-model="upload_type">
                <option value="act">{{$t('add_act')}}</option>
                <option value="event">{{$t('add_event')}}</option>
              </select>
              <br>
              <!-- <h4>Add Act</h4> -->
              <form @submit.prevent="addAct">
                <label for="name">{{$t('name')}}</label>
                <input
                  class="form-control"
                  v-model="add_act.name"
                  type="text"
                  name="name"
                  id="name"
                  :placeholder="$t('name')"
                  required
                >
                
                <label for="summernote">{{$t('description')}}</label>
                <textarea id="summernote" name="editordata"></textarea>
                <br>
                <div v-if="upload_type == 'event'" class="control-group">
                  <label for="start_time">{{$t('start_time')}}</label>
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
                    <!-- <span class="add-on">
                      <i class="icon-remove"></i>
                    </span>-->
                    <span class="add-on">
                      <i class="icon-th"></i>
                    </span>
                  </div>
                  <input type="hidden" id="dtp_input1" value>
                  <label for="end_time">{{$t('end_time')}}</label>
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
                    <!-- <span class="add-on">
                      <i class="icon-remove"></i>
                    </span>-->
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
                <label for="amount">{{$t('amount_of_users')}}</label>
                <input
                  class="form-control"
                  type="number"
                  id="amount"
                  name="amount"
                  :placeholder="$t('amount_of_users')"
                  required
                  v-model="add_act.amount"
                >
                <label for="reward">{{$t('Reward_points')}}</label>
                <input
                  class="form-control"
                  type="number"
                  id="reward"
                  name="reward_points"
                  :placeholder="$t('Reward_points')"
                  required
                  v-model="add_act.reward_points"
                >
                <div>
                <input placeholder="Hello" style="width: auto; box-shadow: none" v-model="add_act.repeatable" type="checkbox" id="repeatable" name="repeatable">
                <label for="repeatable">{{$t('repeatable')}}</label>
                </div>
                <label for="tags">{{$t('tags')}}</label>
                <input
                  class="form-control"
                  type="text"
                  id="tags"
                  name="tags"
                  :placeholder="$t('tags_placeholder')"
                  v-model="add_act.tags"
                >
                <label for="file">{{$t('image_should_be')}}</label>
                <input class="form-control" @change="fileChanged" id="file" type="file" name="file">
                <label for="importance">{{$t('importance')}}</label>
                <input
                  class="form-control"
                  type="number"
                  id="importance"
                  name="importance"
                  :placeholder="$t('importance')"
                  required
                  v-model="add_act.importance"
                >
                <label for="expiration_date">{{$t('expiration_date')}}</label>
                <div class="input-append date" id="dp3" data-date-format="yyyy-mm-dd">
                  <input
                    :placeholder="$t('expiration_date')"
                    readonly
                    class="span2 form-control"
                    size="16"
                    type="text"
                    id="expiration_date"
                  >
                  <span class="add-on">
                    <i class="icon-th"></i>
                  </span>
                </div>
                
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
      $("#summernote1").summernote({
        placeholder: "How to submit evidences",
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
    });
    $("#dp3")
      .datepicker({
        autoclose: true
      })
      .on("changeDate", function(ev) {
        vue_context.add_act.expiration_date = ev.date;
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
      title: "Asset Building Clinic : Create act",
      meta: [
        { hid: 'description', name: 'description', content: 'Create an act' }
      ]
    }
  },
  data() {
    return {
      title: "add_act",
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
        amount: -1,
        description: "",
        how_to_submit_evidences: "",
        reward_points: "",
        start_time: "",
        end_time: "",
        expiration_date: "",
        repeatable: false,
        importance: 0
      }
    };
  },
  methods: {
    fileChanged(event) {
      this.image = event.target.files[0];
      console.log(this.image);
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
      this.add_act.how_to_submit_evidences = $("#summernote1").summernote("code");
      

      params.append("name", this.add_act.name);
      params.append("description", this.add_act.description);
      params.append("how_to_submit_evidences", this.add_act.how_to_submit_evidences);
      params.append("reward_points", this.add_act.reward_points);
      params.append("amount", this.add_act.amount);
      params.append("repeatable", this.add_act.repeatable);
      params.append("importance", this.add_act.importance);
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
      let good_ending = false;
      let id = "";
      await axios
        .post(`/api/acts/${vue_context.upload_type}`, params, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .then(function(res) {
          id = res.data._id;
          izitoast.success({
            title: "Success",
            message: "Your act has been successfully created",
            position: "topRight"
          });
          vue_context.add_act.name = "";
          vue_context.add_act.description = "";
          $("#summernote").summernote("code", "");
          $("#summernote1").summernote("code", "");
          vue_context.add_act.amount = "";
          vue_context.add_act.reward_points = "";
          vue_context.add_act.tags = "";
          document.getElementById("file").value = null;

          if (vue_context.upload_type == "event") {
            document.getElementById("end_time").value = "";
            document.getElementById("start_time").value = "";
          } else document.getElementById("expiration_date").value = "";

          good_ending = true;
        })
        .catch(function(err) {
          // console.log(err);
          izitoast.error({
            title: "Error",
            message: err.response.data.message,
            position: "topRight"
          });
        });
      this.disable_submit_button = false;
      this.submit_text = "Submit";
      this.$nuxt.$loading.finish();
      if (good_ending)
      {
        this.$router.push(`/acts/${id}`);
      }
    },
  }
};
</script>

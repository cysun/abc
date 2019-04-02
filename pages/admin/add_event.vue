<template>
  <div>
    <div class="page-container">
      <div class="left-content">
        <div class="mother-grid-inner">
          <my-header/>
          <!-- /script-for sticky-nav -->
          <!--inner block start here-->
          <div class="inner-block">
            <div class="login-main">
              <div class="login-head">
                <h1>{{$t('add_event')}}</h1>
              </div>
              <div class="login-block">
                <form @submit.prevent="addAct">
                  <input type="hidden" name="id" value="this_user._id">
                  <label for="name">{{$t('name')}}</label>
                  <input type="text" name="name" id="name" :placeholder="$t('name')" v-model="name">
                  <label for="summernote">Description</label>
                  <textarea id="summernote" name="editordata"></textarea>
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
                      id="start_time"
                      :value="start_time"
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
                      :placeholder="$t('end_time')"
                      readonly
                      type="text"
                      class="form-control"
                      id="end_time"
                      :value="end_time"
                    >
                    <!-- <span class="add-on">
                      <i class="icon-remove"></i>
                    </span>-->
                    <span class="add-on">
                      <i class="icon-th"></i>
                    </span>
                  </div>
                  <label for="amount">Amount of users who can execute this act</label>
                  <input
                    type="text"
                    id="amount"
                    name="amount"
                    placeholder="Amount of users who can execute this act"
                    required
                    v-model="amount"
                  >
                  <label for="reward_points">{{$t('Reward_points')}}</label>
                  <input
                    type="text"
                    name="reward_points"
                    :placeholder="$t('Reward_points')"
                    id="reward_points"
                    v-model="reward_points"
                  >
                  <div>
                <input placeholder="Hello" style="width: auto; box-shadow: none" v-model="repeatable" type="checkbox" id="repeatable" name="repeatable">
                <label for="repeatable">Repeatable</label>
                </div>
                  <label for="tags">{{$t('tags')}}</label>
                  <input
                    type="text"
                    name="tags"
                    :placeholder="$t('tags_placeholder')"
                    id="tags"
                    v-model="tags"
                  >
                  <label for="file">Image should be 1600 X 800</label>
                  <input
                    class="form-control"
                    @change="fileChanged"
                    id="file"
                    type="file"
                    name="file"
                  >
                  <label for="importance">Importance</label>
                <input
                  class="form-control"
                  type="number"
                  id="importance"
                  name="importance"
                  placeholder="Importance"
                  required
                  v-model="importance"
                >
                  <label for="expiration_date">Expiration date</label>
                  <div class="input-append date" id="dp3" data-date-format="yyyy-mm-dd">
                    <input
                      placeholder="Expiration date"
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
                  <input
                    type="submit"
                    :class="{'disabled': disable_submit_button}"
                    name="edit"
                    :value="submit_text"
                  >
                </form>
                <!-- <h5><a href="/">Go Back to Home</a></h5> -->
              </div>
            </div>
          </div>
          <!--inner block end here-->
          <!--copy rights start here-->
          <my-footer/>
          <!--COPY rights end here-->
        </div>
      </div>
      <my-sidebar/>
      <div class="clearfix"></div>
    </div>
    <!--slide bar menu end here-->
  </div>
</template>
<script>
import axios from "~/plugins/axios";
import MySidebar from "~/components/Admin_Sidebar.vue";
import MyHeader from "~/components/Admin_Header.vue";
import MyFooter from "~/components/Admin_Footer.vue";
let vue_context, izitoast;

export default {
  layout: "admin",
  components: {
    MySidebar,
    MyHeader,
    MyFooter
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
        // callbacks: {
        //   onImageUpload: function(files) {
        //     // upload image to server and create imgNode...
        //     // $("#summernote").summernote('insertNode', imgNode);
        //     $('#summernote').summernote('insertText', "<p>Hello World</p>");
        //     console.log(files);
        //   }
        // }
      });
    });
    $("#dp3")
      .datepicker({
        autoclose: true
      })
      .on("changeDate", function(ev) {
        vue_context.expiration_date = ev.date;
      });

    $(".form_datetime").datetimepicker({
      weekStart: 1,
      todayBtn: 1,
      autoclose: 1,
      todayHighlight: 1,
      startView: 2,
      forceParse: 0,
      showMeridian: 1
    });

    $(".form_datetime")
      .datetimepicker()
      .on("changeDate", function(e) {
        //Update fields
        vue_context.start_time = document.getElementById("start_time").value;
        vue_context.end_time = document.getElementById("end_time").value;
      });
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
      //Send act
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");
      const params = new FormData();

      this.description = $("#summernote").summernote("code");

      params.append("name", this.name);
      params.append("description", this.description);
      params.append("reward_points", this.reward_points);
      params.append("amount", this.amount);
      params.append("repeatable", this.repeatable);
      params.append("importance", this.importance);
      if (this.expiration_date)
        params.append("expiration_date", this.expiration_date);
      if (this.image) params.append("file", this.image, this.image.name);
      if (this.tags) params.append("tags", this.tags);
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
      await axios
        .post(`/api/acts/event`, params, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .then(function(res) {
          document.getElementById("file").value = null;
          document.getElementById("end_time").value = "";
          document.getElementById("start_time").value = "";
          document.getElementById("expiration_date").value = "";

          izitoast.success({
            title: "Success",
            message: "Your event has been successfully created",
            position: "topRight"
          });
          vue_context.name = "";
          vue_context.description = "";
          $("#summernote").summernote("code", "");
          vue_context.amount = "";
          vue_context.reward_points = "";
          vue_context.tags = "";
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
    }
  },
  head () {
    return {
      title: "Asset Building Clinic : Create event",
      meta: [
        { hid: 'description', name: 'description', content: 'Create an event' }
      ]
    }
  },
  data() {
    return {
      name: "",
      description: "",
      reward_points: "",
      start_time: "",
      expiration_date: "",
      end_time: "",
      tags: "",
      repeatable: false,
      image: null,
      amount: "",
      submit_text: "Submit",
      disable_submit_button: false,
      importance: 0
    };
  }
};
</script>

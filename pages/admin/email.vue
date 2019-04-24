<template>
  <div>
    <div class="page-container">
      <div class="left-content">
        <div class="mother-grid-inner">
          <my-header/>
          <!-- script-for sticky-nav -->
          <!-- /script-for sticky-nav -->
          <!--inner block start here-->
          <div class="inner-block">
            <div class="login-main">
              <div class="login-head">
                <h1>{{$t('send_email')}}</h1>
              </div>
              <div class="login-block">
                <form @submit.prevent="addAct">
                  <input type="hidden" name="id" value="this_user._id">
                  <label for="name">Subject</label>
                  <input type="text" name="name" id="name" placeholder="Subject" v-model="name">
                  <label for="summernote">{{$t('email')}}</label>

                  <textarea id="summernote" name="editordata"></textarea>
                  <br>
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
        placeholder: "Email",
        height: 300,
        toolbar: [
          // [groupName, [list of button]]
          ["para", ["style"]],
          ["style", ["bold", "underline", "clear"]],
          ["style", ["fontname", "fontsize"]],
          ["color", ["color"]],
          ["para", ["ul", "ol", "paragraph"]],
          ["insert", ["table"]],
          ["insert", ["link"]],
          ["misc", ["fullscreen", "codeview", "help"]]
        ]
      });
    });

    $("#dp3")
      .datepicker({
        autoclose: true
      })
      .on("changeDate", function(ev) {
        vue_context.expiration_date = ev.date;
      });

    var toggle = true;

    $(".sidebar-icon").click(function() {
      if (toggle) {
        $(".page-container")
          .addClass("sidebar-collapsed")
          .removeClass("sidebar-collapsed-back");
        $("#menu span").css({ position: "absolute" });
      } else {
        $(".page-container")
          .removeClass("sidebar-collapsed")
          .addClass("sidebar-collapsed-back");
        setTimeout(function() {
          $("#menu span").css({ position: "relative" });
        }, 400);
      }
      toggle = !toggle;
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
      this.description = $("#summernote").summernote("code");

      //Subject and email must be filled
      //Pass details to server

      const params = new URLSearchParams();
      params.append("name", this.name);
      params.append("description", this.description);

      await axios
        .post(`/api/admin/email`, params, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .then(function(res) {
          izitoast.success({
            title: "Success",
            message: "Email has been sent successfully",
            position: "topRight"
          });
          vue_context.name = "";
          vue_context.description = "";
          $("#summernote").summernote("code", "");
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
  head() {
    return {
      title: "Asset Building Clinic : Send email",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Send an email to users"
        }
      ]
    };
  },
  data() {
    return {
      name: "",
      description: "",
      reward_points: "",
      amount: "",
      tags: "",
      repeatable: false,
      image: null,
      expiration_date: "",
      disable_submit_button: false,
      submit_text: "Submit",
      importance: 0
    };
  }
};
</script>

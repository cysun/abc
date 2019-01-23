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
                <h1>{{$t('add_reward')}}</h1>
              </div>
              <div class="login-block">
                <form @submit.prevent="addAct">
                  <input type="hidden" name="id" value="this_user._id">
                  <label for="name">{{$t('name')}}</label>
                  <input type="text" name="name" id="name" :placeholder="$t('name')" v-model="name">
                  <label for="summernote">Description</label>
                  <textarea id="summernote" name="editordata"></textarea>
                  <label for="reward_points">{{$t('value')}}</label>
                  <input
                    type="text"
                    name="reward_points"
                    :placeholder="$t('value')"
                    id="reward_points"
                    v-model="value"
                  >
                  <label for="amount">{{$t('amount')}}</label>
                  <input
                    type="text"
                    name="amount"
                    :placeholder="$t('amount')"
                    id="amount"
                    v-model="amount"
                  >
                  <label for="file">Image should be 1600 X 800</label>
                  <input
                    class="form-control"
                    @change="fileChanged"
                    id="file"
                    type="file"
                    name="file"
                  >
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
          ["style", ["fontname"]],
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

      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");
      const params = new FormData();
      this.description = $("#summernote").summernote("code");

      params.append("name", this.name);
      params.append("description", this.description);
      params.append("value", this.value);
      params.append("amount", this.amount);
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
            message: res.data.message,
            position: "topRight"
          });
          vue_context.name = "";
          vue_context.description = "";
          vue_context.value = "";
          vue_context.amount = "";
          $("#summernote").summernote("code", "");
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
    }
  },
  data() {
    return {
      name: "",
      description: "",
      value: "",
      amount: "",
      image: null,
      submit_text: "Submit",
      disable_submit_button: false
    };
  }
};
</script>

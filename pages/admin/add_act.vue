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
                <h1>{{$t('add_act')}}</h1>
              </div>
              <div class="login-block">
                <form @submit.prevent="addAct">
                  <input type="hidden" name="id" value="this_user._id">
                  <label for="name">{{$t('name')}}</label>
                  <input type="text" name="name" id="name" :placeholder="$t('name')" v-model="name">
                  <label for="summernote">{{$t('description')}}</label>
                  <!-- <input
                    type="text"
                    name="description"
                    id="description"
                    :placeholder="$t('description')"
                    v-model="description"
                  >-->
                  <textarea id="summernote" name="editordata"></textarea>
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
      // vue_context.$nuxt.$loading.finish();
      // alert("Hello World");
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
      await axios
        .post(`/api/acts/act`, params, {
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
          vue_context.name = "";
          vue_context.description = "";
          $("#summernote").summernote("code", "");
          vue_context.amount = "";
          vue_context.reward_points = "";
          vue_context.tags = "";
          document.getElementById("file").value = null;
          document.getElementById("expiration_date").value = "";
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
    }
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

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
                  <label for="description">{{$t('description')}}</label>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    :placeholder="$t('description')"
                    v-model="description"
                  >
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
                    <span class="add-on">
                      <i class="icon-remove"></i>
                    </span>
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
                    <span class="add-on">
                      <i class="icon-remove"></i>
                    </span>
                    <span class="add-on">
                      <i class="icon-th"></i>
                    </span>
                  </div>
                  <label for="reward_points">{{$t('Reward_points')}}</label>
                  <input
                    type="text"
                    name="reward_points"
                    :placeholder="$t('Reward_points')"
                    id="reward_points"
                    v-model="reward_points"
                  >
                  <label for="tags">{{$t('tags')}}</label>
                  <input
                    type="text"
                    name="tags"
                    :placeholder="$t('tags_placeholder')"
                    id="tags"
                    v-model="tags"
                  >
                  <input type="submit" name="edit" :value="$t('add_event')">
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
let vue_context, iziToast;

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
    iziToast = require("iziToast");

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
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");
      const params = new URLSearchParams();

      params.append("name", this.name);
      params.append("description", this.description);
      params.append("reward_points", this.reward_points);
      if (this.tags) params.append("tags", this.tags);
      params.append("start_time", this.start_time + "Z");
      params.append("end_time", this.end_time + "Z");

      await axios
        .post(`/api/acts/event`, params, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .then(function(res) {
          iziToast.success({
            title: "Success",
            message: res.data.message,
            position: "topRight"
          });
          vue_context.name = "";
          vue_context.description = "";
          vue_context.reward_points = 0;
          vue_context.tags = "";

          vue_context.start_time = "";
          vue_context.end_time = "";
        })
        .catch(function(err) {
          iziToast.error({
            title: "Error",
            message: err.response.data.message,
            position: "topRight"
          });
        });
    }
  },
  data() {
    return {
      name: "",
      description: "",
      reward_points: "",
      start_time: "",
      end_time: "",
      tags: ""
    };
  }
};
</script>
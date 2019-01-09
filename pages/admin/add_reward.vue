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
                <h1>Add Reward</h1>
              </div>
              <div class="login-block">
                <form @submit.prevent="addAct">
                  <input type="hidden" name="id" value="this_user._id">
                  <label for="name">Name</label>
                  <input type="text" name="name" id="name" placeholder="Name" v-model="name">
                  <label for="description">Description</label>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    placeholder="Description"
                    v-model="description"
                  >
                  <label for="reward_points">Value</label>
                  <input
                    type="text"
                    name="reward_points"
                    placeholder="Value"
                    id="reward_points"
                    v-model="value"
                  >
                  <label for="amount">Amount</label>
                  <input
                    type="text"
                    name="amount"
                    placeholder="Amount"
                    id="amount"
                    v-model="amount"
                  >
                  <input type="submit" name="edit" value="Add Reward">
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
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");
      const params = new URLSearchParams();

      params.append("name", this.name);
      params.append("description", this.description);
      params.append("value", this.value);
      params.append("amount", this.amount);
      
      await axios
        .post(`/api/rewards`, params, {
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
          vue_context.value = 0;
          vue_context.amount = "";

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
      value: "",
      amount: "",
      tags: ""
    };
  }
};
</script>
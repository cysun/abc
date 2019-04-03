<template>
  <div>
    <div class="page-container">
      <div class="left-content">
        <div class="mother-grid-inner">
          <my-header/>
          <!--inner block start here-->
          <div class="inner-block">
            <div class="login-main">
              <div class="login-head">
                <h1>{{$t('edit_user')}}</h1>
              </div>
              <div class="login-block">
                <form @submit.prevent="editUser">
                  <input type="hidden" name="id" value="this_user._id">
                  <label for="first_name">{{$t('first_name')}}</label>
                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    :placeholder="$t('first_name')"
                    v-model="data.user.first_name"
                  >
                  <label for="last_name">{{$t('last_name')}}</label>
                  <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    :placeholder="$t('last_name')"
                    v-model="data.user.last_name"
                  >
                  <label for="email">Email</label>
                  <input
                    type="text"
                    name="email"
                    :placeholder="$t('email')"
                    id="email"
                    disabled
                    :value="data.user.email"
                  >
                  <h3>{{$t('roles')}}</h3>
                  <div class="forgot-top-grids">
                    <div class="forgot-grid">
                      <ul>
                        <li>
                          <input
                            type="checkbox"
                            id="act_poster"
                            value="Act Poster"
                            v-model="data.roles.act_poster"
                            name="roles"
                          >
                          <label for="act_poster">
                            <span></span>
                            {{$t('act_poster')}}
                          </label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id="reward_provider"
                            :value="$t('reward_provider')"
                            v-model="data.roles.reward_provider"
                            name="roles"
                          >
                          <label for="reward_provider">
                            <span></span>
                            {{$t('reward_provider')}}
                          </label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id="manager"
                            :value="$t('manager')"
                            v-model="data.roles.manager"
                            name="roles"
                          >
                          <label for="manager">
                            <span></span>
                            {{$t('manager')}}
                          </label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id="admin"
                            v-model="data.roles.administrator"
                            value="Administrator"
                            name="roles"
                          >
                          <label for="admin">
                            <span></span>
                            {{$t('admin')}}
                          </label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id="enabled"
                            v-model="data.user.enabled"
                            value="true"
                            name="enabled"
                          >
                          <label for="enabled">
                            <span></span>
                            {{$t('enabled')}}
                          </label>
                        </li>
                      </ul>
                    </div>
                    <div class="clearfix"></div>
                  </div>
                  <input type="submit" name="edit" :value="$t('edit')">
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
    async editUser() {
      //Format data
      const roles = [];
      if (this.data.roles.act_poster) roles.push({ name: "Act Poster" });
      if (this.data.roles.reward_provider)
        roles.push({ name: "Reward Provider" });
      if (this.data.roles.manager) roles.push({ name: "Manager" });
      if (this.data.roles.administrator) roles.push({ name: "Administrator" });

      const json = {
        first_name: this.data.user.first_name,
        last_name: this.data.user.last_name,
        enabled: this.data.user.enabled,
        roles: roles
      };

      //Send request to edit user
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      await axios
        .put(`/api/users/${vue_context.$route.params.id}`, json, {
          headers: { Cookie: `token=${token}; refresh_token=${refresh_token};` }
        })
        .then(function(res) {
          //If success, display success message
          izitoast.success({
            title: "Success",
            message: "User has been edited successfully",
            position: "topRight"
          });
        })
        .catch(function(err) {
          //If error, display error
          izitoast.error({
            title: "Error",
            message: "The request could not be granted",
            position: "topRight"
          });
        });
    }
  },
  async asyncData(context) {
    const token = context.app.$cookies.get("token");
    const refresh_token = context.app.$cookies.get("refresh_token");

    let data;
    await axios
      .get(`/api/users/${context.params.id}/edit`, {
        headers: { Cookie: `token=${token}; refresh_token=${refresh_token};` }
      })
      .then(function(res) {
        data = res.data;
      })
      .catch(function(err) {
        if (err.response.status == 401) {
          context.redirect("/logout");
        }
      });
    return { data };
  },
  head() {
    return {
      title: "Asset Building Clinic : Edit user",
      meta: [
        { hid: 'description', name: 'description', content: 'Make changes to user details' }
      ]
    };
  }
};
</script>

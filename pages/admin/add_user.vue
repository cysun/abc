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
                <h1>{{$t('add_user')}}</h1>
              </div>
              <div class="login-block">
                <form @submit.prevent="addUser">
                  <input type="hidden" name="id" value="this_user._id">
                  <label for="first_name">{{$t('first_name')}}</label>
                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    :placeholder="$t('first_name')"
                    v-model="first_name"
                  >
                  <label for="last_name">{{$t('last_name')}}</label>
                  <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    :placeholder="$t('last_name')"
                    v-model="last_name"
                  >
                  <label for="email">{{$t('email')}}</label>
                  <input
                    type="text"
                    name="email"
                    :placeholder="$t('email')"
                    id="email"
                    v-model="email"
                  >
                  <label for="password">{{$t('password')}}</label>
                  <input
                    type="password"
                    name="password"
                    :placeholder="$t('password')"
                    id="password"
                    v-model="password"
                  >
                  <label for="image">{{$t('profile_picture')}}</label>
                  <input @change="fileChanged" type="file" name="image" id="image">
                  <h3>{{$t('roles')}}</h3>
                  <div class="forgot-top-grids">
                    <div class="forgot-grid">
                      <ul>
                        <li>
                          <input
                            type="checkbox"
                            id="act_poster"
                            :value="$t('act_poster')"
                            v-model="roles.act_poster"
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
                            v-model="roles.reward_provider"
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
                            v-model="roles.manager"
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
                            v-model="roles.administrator"
                            :value="$t('administrator')"
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
                            v-model="enabled"
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
                  <input type="submit" name="edit" :value="$t('add_user')">
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
      <!--slider menu-->
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
    addUser() {
      //Check if there an empty input field
      //If so, display error
      if (!this.first_name || !this.last_name || !this.email || !this.password)
        iziToast.error({
          title: "Error",
          message: "All fields must be present",
          position: "topRight"
        });
      else {
        //If all fields are present
        this.$nuxt.$loading.start();

        const formData = new FormData();
        if (this.image) formData.append("file", this.image, this.image.name);

        formData.append("first_name", this.first_name);
        formData.append("last_name", this.last_name);
        formData.append("email", this.email);
        formData.append("password", this.password);
        formData.append("act_poster", this.roles.act_poster);
        formData.append("manager", this.roles.manager);
        formData.append("reward_provider", this.roles.reward_provider);
        formData.append("administrator", this.roles.administrator);
        formData.append("enabled", this.enabled);

        axios
          .post("/api/register", formData)
          .then(function(res) {
            vue_context.$nuxt.$loading.finish();
            iziToast.success({
              title: "Success",
              message: "User successfully created",
              position: "topRight"
            });

            //Clear form
            vue_context.first_name = vue_context.last_name = vue_context.email = vue_context.password =
              "";
            vue_context.roles.act_poster = vue_context.roles.manager = vue_context.roles.reward_provider = vue_context.roles.administrator = false;
            document.getElementById("image").value = null;
          })
          .catch(function(err) {
            vue_context.$nuxt.$loading.finish();
            if (err.response) {
              iziToast.error({
                title: "Error",
                message: err.response.data.message,
                position: "topRight"
              });
            }
          });
      }
    }
  },
  data() {
    return {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      image: null,
      enabled: true,
      roles: {
        act_poster: false,
        reward_provider: false,
        manager: false,
        administrator: false
      }
    };
  }
};
</script>
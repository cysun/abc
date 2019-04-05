<template>
  <div>
    <my-header :logged_in="logged_in" :page="page" :roles="data.roles"/>
    <homepage/>
  </div>
</template>
<script>
import axios from "~/plugins/axios";
import MyHeader from "~/components/Header.vue";
import Homepage from "~/components/Homepage.vue";
import AboutSidebar from "~/components/About_sidebar.vue";
import HowWeWork from "~/components/How_we_work.vue";
export default {
  components: {
    MyHeader,
    AboutSidebar,
    HowWeWork,
    Homepage
  },
  async asyncData(context) {
    const token = context.app.$cookies.get("token");
    const refresh_token = context.app.$cookies.get("refresh_token");
    //Make request to server
    let data, logged_in;
    data = {
      roles: {}
    };
    logged_in = false;
    await axios
      .get(`/api/users/details`, {
        headers: { Cookie: `token=${token}; refresh_token=${refresh_token};` }
      })
      .then(function(res) {
        data = res.data;
        logged_in = true;
      })
      .catch(function(err) {
        data.roles = {};
      });

    return { data, logged_in };
  },
  data() {
    return {
      page: 'homepage',
    }
  },
  head() {
    return {
      title: "Asset Building Clinic : Homepage",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "View details about our asset building clinic"
        }
      ]
    };
  }
};
</script>
<template>
  <div>
    <my-header/>
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
    if (context.app.$cookies.get("token")) context.redirect("/acts");
    context.store.commit('SET_LOGGEDIN_STATE', false)
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
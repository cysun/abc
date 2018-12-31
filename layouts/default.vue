<template>
  <div>
    <!-- <my-header/> -->
    <nuxt/>
    <my-footer/>
  </div>
</template>

<script>

import MyFooter from "~/components/Footer.vue";

export default {
  components: {
    MyFooter
  },
  head() {
    return {
      script: [
        { src: '/js/bootstrap.js' }
        // {
        //   src:
        //     "https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.9.0/fullcalendar.min.js"
        // }
      ],
      // css: [
      //   '~/assets/css/style.css',
      // ]
      link: [
        {
          href:
            'css/bootstrap.css',
          rel: "stylesheet"
        },
        {
          href:
            "css/style.css",
          rel: "stylesheet"
        }
      ]
    }
  },
};
</script>
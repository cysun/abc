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
        { src: '/js/bootstrap.js' },
        { src: '/js/move-top.js' },
        { src: '/js/main.js' },
        { src: '/js/summernote-bs4.js' }
      ],
      link: [
        {
          href:
            '/css/bootstrap.css',
          rel: "stylesheet"
        },
        {
          href:
            "/css/style.css",
          rel: "stylesheet"
        },
        {
          href:
            "/css/summernote-bs4.css",
          rel: "stylesheet"
        }
      ]
    }
  },
};
</script>
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
  }
};
</script>
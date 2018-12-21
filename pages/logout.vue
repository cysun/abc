<template>
  <div></div>
</template>
<script>
export default {
  async asyncData(context) {
    context.app.$cookies.remove("token");
    context.app.$cookies.remove("refresh_token");
    context.redirect("/");
  }
};
</script>

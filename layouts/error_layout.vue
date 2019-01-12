<template>
  <div>
    <nuxt/>
  </div>
</template>

<script>
export default {
  head() {
    return {
      script: [{ src: "/js/main.js" }],
      link: [
        {
          href: "/css/404.css",
          rel: "stylesheet"
        },
        {
          href: "//fonts.googleapis.com/css?family=Viga",
          rel: "stylesheet"
        }
      ]
    };
  }
};
</script>
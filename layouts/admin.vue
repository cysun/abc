<template>
  <div>
    <nuxt/>
  </div>
</template>

<script>
export default {
  head() {
    return {
      script: [
        { src: "/js/admin/bootstrap.js" },
        // { src: "js/admin/scripts.js" },
        { src: "/js/admin/jquery.nicescroll.js" },
        { src: "/js/admin/skycons.js" }
        // {
        //   src:
        //     "https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.9.0/fullcalendar.min.js"
        // }
      ],
      // css: [
      //   '~/assets/css/admin/style.css',
      //   '~/assets/css/admin/font-awesome.css'
      // ],
      link: [
        {
          href: "/css/admin/bootstrap.css",
          rel: "stylesheet"
        },
        {
          href: "/css/admin/style.css",
          rel: "stylesheet"
        },
        {
          href: "/css/admin/font-awesome.css",
          rel: "stylesheet"
        },
        {
          href: "//fonts.googleapis.com/css?family=Carrois+Gothic",
          rel: "stylesheet"
        },
        {
          href: "//fonts.googleapis.com/css?family=Work+Sans:400,500,600",
          rel: "stylesheet"
        }
      ]
    };
  }
};
</script>
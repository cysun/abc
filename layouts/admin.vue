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
        { src: "/js/admin/jquery.nicescroll.js" },
        { src: "/js/admin/skycons.js" },
        { src: '/js/summernote.js' }
      ],
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
        },
        {
          href:
            "/css/summernote.css",
          rel: "stylesheet"
        }
      ]
    };
  }
};
</script>
//Uncomment the line below when running tests
// require("dotenv").load({ path: "./.env_test" });
//Comment the line above during development/production
require("dotenv").load();

module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: "starter",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "Nuxt.js project" }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href:
          "//fonts.googleapis.com/css?family=Source+Sans+Pro:200,200i,300,300i,400,400i,600,600i,700,700i,900,900i&amp;subset=cyrillic,cyrillic-ext,greek,greek-ext,latin-ext,vietnamese"
      }
    ],
    script: [
      { src: "/js/iziToast.min.js" },
      { src: "/js/jquery-2.1.4.min.js" },
      {
        src:
          "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
      },
      // { src: '/js/bootstrap.js' },
      { src: "/js/waypoints.min.js" },
      { src: "/js/counterup.min.js" },
      { src: "/js/responsiveslides.min.js" },
      { src: "/js/bootstrap-datetimepicker.js" },
      { src: "/js/SmoothScroll.min.js" },
      { src: "/js/easing.js" },
      { src: "/js/jquery.flexslider.js" },
      { src: "/js/bootstrap-datepicker.js" },
      // { src: "/js/summernote-bs4.js" }
    ]
  },
  /*
   ** Global CSS
   */
  css: [
    // '~/assets/css/bootstrap.css',
    "~/assets/css/flexslider.css",
    "~/assets/css/fontawesome-all.css",
    // '~/assets/css/style.css',
    "~/assets/css/iziToast.min.css",
    "~/assets/css/bootstrap-datetimepicker.min.css",
    "~/assets/css/datepicker.css",
    // "~/assets/css/summernote-bs4.css"
  ],
  loading: {
    color: "blue"
  },

  modules: [
    // Simple usage
    "cookie-universal-nuxt"
    // With options
    // ['cookie-universal-nuxt', { alias: 'cookiz' }],
  ],
  /*
   ** Add axios globally
   */
  build: {
    vendor: ["axios"]
  },
  env: {
    email_address: process.env.email_address
  },
  serverMiddleware: [
    // API middleware
    "~/api/index.js"
  ],
  plugins: ["plugins/i18n.js"],
  router: {
    middleware: ["get_user_from_jwt", "i18n", "only_admin_is_allowed"]
  }
};

<template>
  <div class="main">
    <div class="nav_w3l">
      <ul>
        <li>
          <nuxt-link class="hvr-sweep-to-bottom" to="/">Home</nuxt-link>
        </li>
        <li>
          <nuxt-link class="hvr-sweep-to-bottom" to="/about">About Us</nuxt-link>
        </li>
        <li>
          <nuxt-link class="hvr-sweep-to-bottom" to="/contact">Contact Us</nuxt-link>
        </li>
      </ul>
    </div>
    <h1>404</h1>
    <h2>ooops, something goes wrong</h2>
    <div class="more_w3ls">
      <nuxt-link :to="$route.path">Try Once Again</nuxt-link>
    </div>
    <div class="wthree_social_icons">
      <div>
        <a href="#">
          <span>Facebook</span>
        </a>
        <a href="#">
          <span>Twitter</span>
        </a>
        <a href="#">
          <span>Tumblr</span>
        </a>
        <a href="#">
          <span>LinkedIn</span>
        </a>
        <a href="#">
          <span>Vimeo</span>
        </a>
      </div>
    </div>
    <div class="copyright">
      <p>© 2019 Cool 404 Page Widget. All rights reserved | Design by
        <a href="http://w3layouts.com">W3layouts</a>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  layout: "error_layout"
};
</script>
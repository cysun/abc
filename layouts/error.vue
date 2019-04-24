<template>
  <div class="main">
    <div class="nav_w3l">
      <ul>
        <li>
          <nuxt-link class="hvr-sweep-to-bottom" to="/">{{$t('home')}}</nuxt-link>
        </li>
        <li>
          <nuxt-link class="hvr-sweep-to-bottom" to="/about">{{$t('about_us')}}</nuxt-link>
        </li>
        <li>
          <nuxt-link class="hvr-sweep-to-bottom" to="/contact">{{$t('contact_us')}}</nuxt-link>
        </li>
      </ul>
    </div>
    <h1>404</h1>
    <h2>{{$t('oops')}}</h2>
    <div class="more_w3ls">
      <nuxt-link :to="$route.path">{{$t('try_again')}}</nuxt-link>
    </div>
    <div class="wthree_social_icons">
      <div>
        <a href="#">
          <span>{{$t('facebook')}}</span>
        </a>
        <a href="#">
          <span>{{$t('twitter')}}</span>
        </a>
        <a href="#">
          <span>{{$t('tumbler')}}</span>
        </a>
        <a href="#">
          <span>{{$t('linked_in')}}</span>
        </a>
        <a href="#">
          <span>{{$t('vimeo')}}</span>
        </a>
      </div>
    </div>
    <div class="copyright">
      <p>{{$t('footer_text')}}</p>
    </div>
  </div>
</template>
<script>
export default {
  layout: "error_layout"
};
</script>
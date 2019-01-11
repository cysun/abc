<template>
  <section class="inner-banner">
    <div class="banner-layer">
      <h1 class="text-center">{{$t(title)}}</h1>
    </div>
  </section>
</template>

<script>
export default {
  props: ['title']
};
</script>
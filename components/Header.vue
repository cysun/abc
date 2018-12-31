<template>
  <header>
    <div class="container">
      <nav class="navbar navbar-expand-lg navbar-light">
        <nuxt-link to="/" class="navbar-brand">
          <span class="fab fa-asymmetrik"></span> ABC
        </nuxt-link>
        <div class="dropdown">
          <button
            class="navbar-toggler ml-md-auto"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon dropbtn"></span>
          </button>
        </div>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mx-auto text-center">
            <li v-if="!logged_in" :class="{active: !page}" class="nav-item mr-lg-3">
              <nuxt-link to="/" class="nav-link">
                Home
                <span class="sr-only">(current)</span>
              </nuxt-link>
            </li>

            <li class="nav-item dropdown mr-lg-3" v-if="roles && roles.manager">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                :class="{active: page == 'manage_acts' || page == 'manage_proofs' || page == 'manage_rewards' }"
              >Manage</a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <nuxt-link
                  to="/manage/acts"
                  class="dropdown-item"
                  :class="{active: page == 'manage_acts'}"
                >Acts</nuxt-link>
                <nuxt-link
                  to="/manage/proofs"
                  class="dropdown-item"
                  :class="{active: page == 'manage_proofs'}"
                >Proofs</nuxt-link>
                <nuxt-link
                  to="/manage/rewards"
                  class="dropdown-item"
                  :class="{active: page == 'manage_rewards'}"
                >Rewards</nuxt-link>
              </div>
            </li>
            <li class="nav-item mr-lg-3" v-if="logged_in">
              <nuxt-link to="/acts" class="nav-link" :class="{active: page == 'acts'}">Acts</nuxt-link>
            </li>
            <li class="nav-item mr-lg-3" v-if="logged_in">
              <nuxt-link class="nav-link" :class="{active: page == 'rewards'}" to="/rewards">Rewards</nuxt-link>
            </li>
            <li class="nav-item mr-lg-3" v-if="logged_in">
              <nuxt-link
                to="/calendar"
                class="nav-link"
                :class="{active: page == 'calendar'}"
              >Calendar</nuxt-link>
            </li>
            <li class="nav-item mr-lg-3" v-if="roles && roles.administrator">
              <nuxt-link class="nav-link" to="/admin">Admin</nuxt-link>
            </li>
            <li class="nav-item mr-lg-3">
              <a class="nav-link" href="/about">About</a>
            </li>
            <li class="nav-item mr-lg-3">
              <a class="nav-link" href="/contact">Contact</a>
            </li>
            <li class="nav-item" v-if="!logged_in">
              <nuxt-link to="/login" class="nav-link" :class="{active: page == 'login'}">Login</nuxt-link>
            </li>
            <li class="nav-item" v-if="!logged_in" :class="{active: page == 'sign_up'}">
              <nuxt-link class="nav-link" to="/sign_up">Sign up</nuxt-link>
            </li>
            <li class="nav-item" v-if="logged_in">
              <a class="nav-link" @click="logout" href="#">Log out</a>
              <!-- <a class="nav-link" href="/logout">Log out</a> -->
            </li>
          </ul>
          <!-- <div class="buttons">
            <a href="tel:+12 445 8976 2334">
              <p>
                <i class="fas mr-1 fa-phone"></i>+12 445 8976 2334
              </p>
            </a>
          </div>
          <div class="little_margin"></div>
          <div class="buttons">
            <a href="mailto:abc@finance.com">
              <p>
                <i class="fas mr-1 fa-envelope"></i>abc@finance.com
              </p>
            </a>
          </div>-->
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  props: ["logged_in", "page", "roles"],
  methods: {
    logout() {
      this.$cookies.remove("token");
      this.$cookies.remove("refresh_token");
      this.$router.push("/");
    }
  }
};
</script>
<template>
  <header>
    <div class="container">
      <nav class="navbar navbar-expand-lg navbar-light">
        <nuxt-link to="/" class="navbar-brand">
          <!-- <span class="fab fa-asymmetrik"></span> ABC -->
          <img src="~assets/img/abc.png" style="width:120px">
          <!-- ABC -->
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
                {{$t('home')}}
                <span class="sr-only">(current)</span>
              </nuxt-link>
            </li>
            <li v-if="logged_in" :class="{active: page == 'homepage'}" class="nav-item mr-lg-3">
              <nuxt-link to="/homepage" class="nav-link">
                {{$t('home')}}
                <span class="sr-only">(current)</span>
              </nuxt-link>
            </li>
            <li v-if="!logged_in" :class="{active: page == 'view_acts'}" class="nav-item mr-lg-3">
              <nuxt-link to="/view_acts" class="nav-link">
                {{$t('acts')}}
                <span class="sr-only">(current)</span>
              </nuxt-link>
            </li>
            <li class="nav-item mr-lg-3" v-if="logged_in && ((roles && !roles.act_poster) || !roles)">
              <nuxt-link
                to="/acts"
                class="nav-link"
                :class="{active: page == 'acts'}"
              >{{$t('acts')}}</nuxt-link>
            </li>
            <li class="nav-item dropdown mr-lg-3" v-if="roles && roles.act_poster">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                :class="{active: page == 'acts' || page == 'add_act' || page == 'edit_act' }"
              >Acts</a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <nuxt-link
                  to="/acts"
                  class="dropdown-item"
                  :class="{active: page == 'acts'}"
                >View Acts</nuxt-link>
                <nuxt-link
                  to="/acts/add_act"
                  class="dropdown-item"
                  :class="{active: page == 'add_act'}"
                >Add Act</nuxt-link>
              </div>
            </li>
            <li class="nav-item mr-lg-3" v-if="logged_in && ((roles && !roles.reward_provider) || !roles)">
              <nuxt-link
                class="nav-link"
                :class="{active: page == 'rewards'}"
                to="/rewards"
              >{{$t('rewards')}}</nuxt-link>
            </li>
            <li class="nav-item dropdown mr-lg-3" v-if="roles && roles.reward_provider">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                :class="{active: page == 'rewards' || page == 'add_rewards' || page == 'edit_reward' }"
              >Rewards</a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <nuxt-link
                  to="/rewards"
                  class="dropdown-item"
                  :class="{active: page == 'rewards'}"
                >View Rewards</nuxt-link>
                <nuxt-link
                  to="/rewards/add_reward"
                  class="dropdown-item"
                  :class="{active: page == 'add_reward'}"
                >Add Reward</nuxt-link>
              </div>
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
              >{{$t('manage')}}</a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <nuxt-link
                  to="/manage/acts"
                  class="dropdown-item"
                  :class="{active: page == 'manage_acts'}"
                >{{$t('acts')}}</nuxt-link>
                <nuxt-link
                  to="/manage/proofs"
                  class="dropdown-item"
                  :class="{active: page == 'manage_proofs'}"
                >{{$t('proofs')}}</nuxt-link>
                <nuxt-link
                  to="/manage/rewards"
                  class="dropdown-item"
                  :class="{active: page == 'manage_rewards'}"
                >{{$t('rewards')}}</nuxt-link>
              </div>
            </li>
            <li class="nav-item mr-lg-3" v-if="logged_in">
              <nuxt-link
                to="/calendar"
                class="nav-link"
                :class="{active: page == 'calendar'}"
              >{{$t('calendar')}}</nuxt-link>
            </li>
            <li class="nav-item mr-lg-3" v-if="roles && roles.administrator">
              <a class="nav-link" href="/admin">{{$t('admin')}}</a>
            </li>
            <li class="nav-item mr-lg-3">
              <nuxt-link
                class="nav-link"
                :class="{active: page == 'about'}"
                to="/about"
              >{{$t('about')}}</nuxt-link>
            </li>
            <li class="nav-item mr-lg-3">
              <nuxt-link
                class="nav-link"
                :class="{active: page == 'contact'}"
                to="/contact"
              >{{$t('contact')}}</nuxt-link>
            </li>
            <li class="nav-item" v-if="!logged_in">
              <nuxt-link
                to="/login"
                class="nav-link"
                :class="{active: page == 'login'}"
              >{{$t('login')}}</nuxt-link>
            </li>
            <li class="nav-item" v-if="!logged_in" :class="{active: page == 'sign_up'}">
              <nuxt-link class="nav-link" to="/sign_up">{{$t('sign_up')}}</nuxt-link>
            </li>
            <li class="nav-item" v-if="logged_in">
              <a class="nav-link" @click="logout" href="/logout">{{$t('log_out')}}</a>
            </li>
          </ul>
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
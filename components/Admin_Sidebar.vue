<template>
  <!--slider menu-->
  <div class="sidebar-menu">
    <div class="logo">
      <a href="#" class="sidebar-icon">
        <span class="fa fa-bars"></span>
      </a>
      <a href="#">
        <span id="logo"></span>
        <!--<img id="logo" src="" alt="Logo"/>-->
      </a>
    </div>
    <div class="menu">
      <ul id="menu">
        <li id="menu-home">
          <a href="/">
            <i class="fa fa-home"></i>
            <span>{{$t('home')}}</span>
          </a>
        </li>
        <li id="menu-home">
          <nuxt-link to="/admin">
            <i class="fa fa-area-chart"></i>
            <span>{{$t('dashboard')}}</span>
          </nuxt-link>
        </li>
        <li>
          <a href="#">
            <i class="fa fa-users"></i>
            <span>{{$t('users')}}</span>
            <span class="fa fa-angle-right" style="float: right"></span>
          </a>
          <ul>
            <li>
              <nuxt-link to="/admin/add_user">{{$t('add_user')}}</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/admin/users">{{$t('view_users')}}</nuxt-link>
            </li>
          </ul>
        </li>
        <li>
          <a href="#">
            <i class="fa fa-calendar-check-o"></i>
            <span>{{$t('acts')}}</span>
            <span class="fa fa-angle-right" style="float: right"></span>
          </a>
          <ul>
            <li>
              <nuxt-link to="/admin/add_act">{{$t('add_act')}}</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/admin/add_event">{{$t('add_event')}}</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/admin/acts">{{$t('view_acts')}}</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/admin/events">View Events</nuxt-link>
            </li>
          </ul>
        </li>
        <li>
          <a href="#">
            <i class="fa fa-gift"></i>
            <span>{{$t('rewards')}}</span>
            <span class="fa fa-angle-right" style="float: right"></span>
          </a>
          <ul>
            <li>
              <nuxt-link to="/admin/add_reward">{{$t('add_reward')}}</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/admin/rewards">{{$t('view_rewards')}}</nuxt-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
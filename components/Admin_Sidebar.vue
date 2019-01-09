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
          <nuxt-link to="/admin">
            <i class="fa fa-area-chart"></i>
            <span>Dashboard</span>
          </nuxt-link>
        </li>
        <li>
          <a href="#">
            <i class="fa fa-users"></i>
            <span>Users</span>
            <span class="fa fa-angle-right" style="float: right"></span>
          </a>
          <ul>
            <li>
              <nuxt-link to="/admin/add_user">Add User</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/admin/users">View Users</nuxt-link>
            </li>
          </ul>
        </li>
        <li>
          <a href="#">
            <i class="fa fa-calendar-check-o"></i>
            <span>Acts</span>
            <span class="fa fa-angle-right" style="float: right"></span>
          </a>
          <ul>
            <li>
              <nuxt-link to="/admin/add_act">Add Act</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/admin/add_event">Add Event</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/admin/acts">View Acts</nuxt-link>
            </li>
          </ul>
        </li>
        <li>
          <a href="#">
            <i class="fa fa-gift"></i>
            <span>Rewards</span>
            <span class="fa fa-angle-right" style="float: right"></span>
          </a>
          <ul>
            <li>
              <nuxt-link to="/admin/add_reward">Add Reward</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/admin/rewards">View Rewards</nuxt-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
<template>
  <!--header start here-->
  <div class="header-main">
    <div class="header-left">
      <div class="logo-name">
        <nuxt-link to="/admin">
          <h1>Administrator Dashboard</h1>
          <!--<img id="logo" src="" alt="Logo"/>-->
        </nuxt-link>
      </div>
      <div class="clearfix"></div>
    </div>
    <div class="header-right">
      <div class="profile_details">
        <ul>
          <li class="dropdown profile_details_drop">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
              <div class="profile_img">
                <span class="prfil-img">
                  <img src="/images/admin/p1.png" alt>
                </span>
                <div class="user-name">
                  <p>Dr Joanna</p>
                  <span>Administrator</span>
                </div>
                <i class="fa fa-angle-down lnr"></i>
                <i class="fa fa-angle-up lnr"></i>
                <div class="clearfix"></div>
              </div>
            </a>
            <ul class="dropdown-menu drp-mnu">
              <li>
                <a href="/acts">
                  <i class="fa fa-home"></i> Home
                </a>
              </li>
              <li>
                <a href="/logout">
                  <i class="fa fa-close"></i> Logout
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="clearfix"></div>
    </div>
    <div class="clearfix"></div>
  </div>
  <!--header end here-->
</template>
<template>
<div>
  <section class="about py-5">
      <div class="container py-md-3">
        <!-- <h3 class="heading mb-md-5 mb-4">How we Work</h3> -->
        <div class="row about-grids agile-info">
          <div class="col-lg-12 mb-lg-0 w3-agile-grid mb-5">
            <p>{{$t('as_fellow_travelers')}}</p>
            <p class="mt-2 mb-3">{{$t('with_the_majority')}}</p>
            <ul>
              <li>{{$t('we_can_take_free')}}</li>
              <li>{{$t('we_can_learn')}}</li>
              <li>{{$t('we_can_find')}}</li>
              <li>{{$t('we_can_invite')}}</li>
            </ul><br>
            <p>{{$t('abc_pays')}}</p>
          </div>
        </div>
      </div>
    </section>
    <section class="work">
      <div class="work-layer py-5">
        <div class="container py-md-3">
          <!-- <h3 class="heading mb-lg-5 mb-4">{{$t('how_we_work')}}</h3> -->
          <div class="row join agile-info">
            <div class="col-md-3 col-sm-6 steps-reach w3-agile-grid">
              <span class="fab fa-algolia"></span>
              <h4>{{$t('step_1')}}</h4>
              <p>{{$t('step_1_text')}}</p>
              <div class="style-border">
                <img src="images/sty1.png" alt>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 mt-sm-0 mt-5 steps-reach w3-agile-grid">
              <span class="fab fa-asymmetrik"></span>
              <h4>{{$t('step_2')}}</h4>
              <p>{{$t('step_2_text')}}</p>
              <div class="style-border second-border">
                <img src="images/sty2.png" alt>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 mt-md-0 mt-5 pt-md-0 pt-sm-5 steps-reach w3-agile-grid">
              <span class="fas fa-bug" aria-hidden="true"></span>
              <h4>{{$t('step_3')}}</h4>
              <p>{{$t('step_3_text')}}</p>
              <div class="style-border">
                <img src="images/sty1.png" alt>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 mt-md-0 mt-5 pt-md-0 pt-sm-5 steps-reach w3-agile-grid">
              <span class="fas fa-check-square" aria-hidden="true"></span>
              <h4>{{$t('step_4')}}</h4>
              <p>{{$t('step_4_text')}}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
</template>
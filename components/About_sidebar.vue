<template>
  <section class="about py-5">
      <div class="container py-md-3">
        <h3 class="heading mb-md-5 mb-4">{{$t('about_us')}}</h3>
        <div class="row about-grids agile-info">
          <div class="col-lg-6 mb-lg-0 w3-agile-grid mb-5">
            <p>{{$t('about_us_text_1')}}</p>
            <p class="mt-2 mb-3">{{$t('about_us_text_2')}}</p>
          </div>
          <div class="col-lg-3 col-md-4 w3-agile-grid pr-md-0">
            <h3 class="margin">{{$t('years_experience')}}</h3>
            <h3 class="black">{{$t('valuable_services')}}</h3>
          </div>
          <div class="col-lg-3 col-md-4 w3-agile-grid mt-md-0 mt-4">
            <h3 class="margin green">{{$t('experienced_professionals')}}</h3>
            <h3 class="grey">{{$t('financial_solutions')}}</h3>
          </div>
        </div>
      </div>
    </section>
</template>
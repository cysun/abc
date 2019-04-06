export const state = () => ({
    locales: ['en', 'cn', 'es'],
    locale: 'en',
    logged_in: false
  })
  
  export const mutations = {
    SET_LANG (state, locale) {
      if (state.locales.indexOf(locale) !== -1) {
        state.locale = locale
      }
    },
    SET_LOGGEDIN_STATE(state, logged_in){
      state.logged_in = logged_in
    }
  }
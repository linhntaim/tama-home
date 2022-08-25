<template lang="pug">
.login.text-center
    h2.mb-3 Login
    form.row(@submit.prevent="onSubmit")
        .col-md-6.col-lg-4.col-xl-3.mx-auto
            .mb-3
                input.form-control(:class="{'is-invalid': !!error.validation.email}" v-model="email" type="email" name="email" placeholder="Email" required)
                .invalid-feedback.text-start(v-if="error.validation.email")
                    template(v-for="message in error.validation.email")
                        | {{ message }}
                        br
            .mb-3
                input.form-control(v-model="password" type="password" name="password" placeholder="Password" autocomplete="off" required)
            button.btn.btn-primary(:disabled="loading._" type="submit") Submit
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
    // eslint-disable-next-line
    name: 'Login',
    data() {
        return {
            loading: {
                _: false,
            },

            email: '',
            password: '',

            error: {
                messages: [],
                validation: {},
            },
        }
    },
    computed: {
        ...mapGetters({
            accountIsLoggedIn: 'account/isLoggedIn',
        }),
    },
    methods: {
        ...mapActions({
            accountLogin: 'account/sanctumLogin',
        }),
        onSubmit() {
            this.loading._ = true
            this.accountLogin({
                email: this.email,
                password: this.password,
            }).then(() => {
                this.loading._ = false
                if (this.accountIsLoggedIn) {
                    this.$router.push(this.$config.app.routes.redirect_after_authenticated)
                }
            }).catch(err => {
                this.loading._ = false
                this.error.messages = err.messages
                if (err.data && 'validation' in err.data) {
                    this.error.validation = err.data.validation
                }
            })
        },
    },
}
</script>

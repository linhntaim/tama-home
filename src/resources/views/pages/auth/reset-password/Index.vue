<template lang="pug">
.reset-password
    h2.mb-3 Reset Password
    form(@submit.prevent="onSubmit")
        .col-md-6.col-lg-4.col-xl-3.mx-auto
            .mb-3
                input.form-control(:class="{'is-invalid': !!error.validation.password}" v-model="password" type="password" name="password" placeholder="Password" autocomplete="off" required)
                .invalid-feedback.text-start(v-if="error.validation.password")
                    template(v-for="message in error.validation.password")
                        | {{ message }}
                        br
            .mb-3
                input.form-control(v-model="passwordConfirmation" type="password" name="password_confirmation" placeholder="Password Confirmation" autocomplete="off" required)
            button.btn.btn-primary(:disabled="loading._" type="submit") Submit
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex'

export default {
    // eslint-disable-next-line
    name: 'Index',
    data() {
        return {
            loading: {
                _: false,
            },

            error: {
                messages: [],
                validation: {},
            },
        }
    },
    computed: {
        ...mapGetters({
            resetPasswordProgressing: 'resetPassword/progressing',
        }),
        token: {
            get() {
                return this.$store.state.resetPassword.token
            },
            set(value) {
                this.$store.state.resetPassword.token = value
            },
        },
        email: {
            get() {
                return this.$store.state.resetPassword.email
            },
            set(value) {
                this.$store.state.resetPassword.email = value
            },
        },
        password: {
            get() {
                return this.$store.state.resetPassword.password
            },
            set(value) {
                this.$store.state.resetPassword.password = value
            },
        },
        passwordConfirmation: {
            get() {
                return this.$store.state.resetPassword.passwordConfirmation
            },
            set(value) {
                this.$store.state.resetPassword.passwordConfirmation = value
            },
        },
    },
    created() {
        if (!this.resetPasswordProgressing) {
            this.resetPasswordReset()
        }

        this.token = this.$route.params.token
        if ('email' in this.$route.query) {
            this.email = this.$route.query.email
        }
    },
    methods: {
        ...mapActions({
            resetPassword: 'resetPassword/resetPassword',
        }),
        ...mapMutations({
            resetPasswordSetProgressing: 'resetPassword/setProgressing',
            resetPasswordReset: 'resetPassword/reset',
        }),
        onSubmit() {
            this.loading._ = true
            this.resetPassword().then(() => {
                this.loading._ = false
                this.resetPasswordSetProgressing(true)
                this.$router.push({name: 'password.reset.success'})
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

<template lang="pug">
.forgot-password
    h2.mb-3 Forgot Password
    form.row(@submit.prevent="onSubmit")
        .col-md-6.col-lg-4.col-xl-3.mx-auto
            .mb-3
                input.form-control(:class="{'is-invalid': !!error.validation.email}" v-model="email" type="email" name="email" placeholder="Email" required)
                .invalid-feedback.text-start(v-if="error.validation.email")
                    template(v-for="message in error.validation.email")
                        | {{ message }}
                        br
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
            forgotPasswordProgressing: 'forgotPassword/progressing',
        }),
        email: {
            get() {
                return this.$store.state.forgotPassword.email
            },
            set(value) {
                this.$store.state.forgotPassword.email = value
            },
        },
    },
    created() {
        if (!this.forgotPasswordProgressing) {
            this.forgotPasswordReset()
        }
    },
    methods: {
        ...mapActions({
            forgotPassword: 'forgotPassword/forgotPassword',
        }),
        ...mapMutations({
            forgotPasswordSetProgressing: 'forgotPassword/setProgressing',
            forgotPasswordReset: 'forgotPassword/reset',
        }),
        onSubmit() {
            this.loading._ = true
            this.forgotPassword({
                reset_url: this.$url.route({
                    name: 'password.reset',
                    params: {
                        token: '{token}',
                    },
                }),
            }).then(() => {
                this.loading._ = false
                this.forgotPasswordSetProgressing(true)
                this.$router.push({name: 'password.request.success'})
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

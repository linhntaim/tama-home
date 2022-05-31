<template lang="pug">
.register
    h2.mb-3 Register
    form.row(@submit.prevent="onSubmit")
        .col-md-6.col-lg-4.col-xl-3.mx-auto
            .mb-3
                input.form-control(:class="{'is-invalid': !!error.validation.name}" v-model="name" type="text" name="name" placeholder="Name" required)
                .invalid-feedback.text-start(v-if="error.validation.name")
                    template(v-for="message in error.validation.name")
                        | {{ message }}
                        br
            .mb-3
                input.form-control(:class="{'is-invalid': !!error.validation.email}" v-model="email" type="email" name="email" placeholder="Email" required)
                .invalid-feedback.text-start(v-if="error.validation.email")
                    template(v-for="message in error.validation.email")
                        | {{ message }}
                        br
            .mb-3
                input.form-control(:class="{'is-invalid': !!error.validation.password}" v-model="password" type="password" name="password" placeholder="Password" required)
                .invalid-feedback.text-start(v-if="error.validation.password")
                    template(v-for="message in error.validation.password")
                        | {{ message }}
                        br
            .mb-3
                input.form-control(v-model="passwordConfirmation" type="password" name="password_confirmation" placeholder="Password Confirmation" required)
            button.btn.btn-primary(:disabled="loading._" type="submit") Submit
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex'
import {StarterServiceError} from '@/app/support/services'

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
            registerProgressing: 'register/progressing',
        }),
        name: {
            get() {
                return this.$store.state.register.name
            },
            set(value) {
                this.$store.state.register.name = value
            },
        },
        email: {
            get() {
                return this.$store.state.register.email
            },
            set(value) {
                this.$store.state.register.email = value
            },
        },
        password: {
            get() {
                return this.$store.state.register.password
            },
            set(value) {
                this.$store.state.register.password = value
            },
        },
        passwordConfirmation: {
            get() {
                return this.$store.state.register.passwordConfirmation
            },
            set(value) {
                this.$store.state.register.passwordConfirmation = value
            },
        },
    },
    created() {
        if (!this.registerProgressing) {
            this.registerReset()
        }
    },
    methods: {
        ...mapActions({
            register: 'register/register',
        }),
        ...mapMutations({
            registerSetProgressing: 'register/setProgressing',
            registerReset: 'register/reset',
        }),
        onSubmit() {
            this.loading._ = true
            this.register({
                login_url: this.$url.route({name: 'login'}),
            }).then(() => {
                this.loading._ = false
                this.registerSetProgressing(true)
                this.$router.push({name: 'register.success'})
            }).catch(err => {
                this.loading._ = false
                if (err instanceof StarterServiceError) {
                    this.error.messages = err.messages
                    if (err.data && 'validation' in err.data) {
                        this.error.validation = err.data.validation
                    }
                }
            })
        },
    },
}
</script>

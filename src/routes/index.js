import {middlewares} from '@/app/middlewares'
import Base from '@/resources/views/master/Base'
import BaseBlank from '@/resources/views/master/BaseBlank'

export const routes = [
    {
        path: '/',
        component: Base,
        meta: {
            middleware: middlewares,
        },
        children: [
            {
                path: 'error',
                component: BaseBlank,
                children: [
                    {
                        path: 'connection-lost',
                        name: 'connection_lost',
                        component: () => import('@/resources/views/errors/ConnectionLost.vue'),
                    },
                    {
                        path: '404',
                        name: 'not_found',
                        component: () => import('@/resources/views/errors/NotFound.vue'),
                    },
                ],
            },
            //
            {
                path: '/',
                redirect: 'trading',
            },
            {
                path: 'trading',
                name: 'trading',
                component: () => import('@/resources/views/pages/Trading.vue'),
            },
            {
                path: 'holding',
                name: 'holding',
                component: () => import('@/resources/views/pages/Holding.vue'),
            },
            //
            {
                path: ':pathMatch(.*)*',
                component: () => import('@/resources/views/errors/NotFound.vue'),
            },
        ],
    },
]
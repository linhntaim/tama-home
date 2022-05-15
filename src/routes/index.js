import {middlewares} from '@/app/middlewares'
import Base from '@/resources/views/master/Base'
import BaseError from '@/resources/views/master/BaseError'

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
                component: BaseError,
                children: [
                    {
                        path: 'connection-lost',
                        name: 'connection_lost',
                        component: () => import('@/resources/views/errors/ConnectionLost'),
                    },
                    {
                        path: '404',
                        name: 'not_found',
                        component: () => import('@/resources/views/errors/NotFound'),
                    },
                ],
            },
            //
            {
                path: '/',
                redirect: 'holding',
            },
            {
                path: 'holding',
                name: 'holding',
                component: () => import('@/resources/views/pages/holding/Index'),
            },
            {
                path: 'trading',
                name: 'trading',
                component: () => import('@/resources/views/pages/trading/Index'),
            },
            //
            {
                path: ':pathMatch(.*)*',
                component: () => import('@/resources/views/errors/NotFound'),
            },
        ],
    },
]
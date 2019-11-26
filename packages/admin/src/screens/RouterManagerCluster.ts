import { createElement as create, FC, Fragment } from 'react'
import { useLocalRouter, Modal, Layout, IconBar } from 'wga-theme'
import { UpdateCluster } from './UpdateCluster'
import { UpdatePayment } from './UpdatePayment'
import { useUniversal } from '../hooks/useUniversal'
import { RemovePayment } from './RemovePayment'
import { ShowCluster } from './ShowCluster'
import { SwitchCluster } from './SwitchCluster'
import { ShowClusterKeys } from './ShowClusterKeys'
import { CreateCluster } from './CreateCluster'

export const RouterManagerCluster: FC<{
  visible?: boolean
  close: () => void
}> = ({ close, visible }) => {
  const universal = useUniversal()
  const router = useLocalRouter({
    nomatch: '/inspect',
    options: [
      {
        key: '/inspect',
        children: create(ShowCluster, {
          keys: () => router.change('/keys'),
        }),
      },
      {
        key: '/keys',
        children: create(ShowClusterKeys, {
          back: () => router.change('/inspect'),
        }),
      },
      { key: '/update', children: create(UpdateCluster) },
      {
        key: '/switch',
        children: create(SwitchCluster, {
          add: () => router.change('/create'),
        }),
      },
      { key: '/create', children: create(CreateCluster) },
      {
        key: '/payment',
        children: create(UpdatePayment, {
          change: () => router.change('/inspect'),
          cancel: () => router.change('/cancel'),
        }),
      },
      {
        key: '/cancel',
        children: create(RemovePayment, {
          change: () => router.change('/inspect'),
        }),
      },
    ],
  })
  return create(Modal, {
    close,
    visible,
    children: create(Layout, {
      grow: true,
      children: [
        create(IconBar, {
          key: 'iconBar',
          icons: [
            {
              icon: 'glasses',
              label: 'Inspect',
              focused: !!router.current && router.current.key === '/inspect',
              click: () => router.change('/inspect'),
            },
            !universal.subscribed && {
              icon: 'bolt',
              label: 'Payment',
              focused: !!router.current && router.current.key === '/payment',
              click: () => router.change('/payment'),
            },
            {
              icon: 'sliders-h',
              label: 'Update',
              focused: !!router.current && router.current.key === '/update',
              click: () => router.change('/update'),
            },
            {
              icon: 'sync-alt',
              label: 'Switch',
              focused: !!router.current && router.current.key === '/switch',
              click: () => router.change('/switch'),
            },
            !!universal.subscribed && {
              icon: 'wallet',
              label: 'Payment',
              focused: !!router.current && router.current.key === '/payment',
              click: () => router.change('/payment'),
            },
            {
              icon: 'times-circle',
              label: 'Close',
              click: close,
              prefix: 'far',
              seperated: true,
            },
          ],
        }),
        router.current &&
          create(Fragment, {
            key: 'children',
            children: router.current.children,
          }),
      ],
    }),
  })
}

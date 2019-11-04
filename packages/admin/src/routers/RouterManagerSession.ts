import { createElement as create, FC } from 'react'
import { useLocalRouter, Modal, Layout, IconBar } from 'wga-theme'

export const RouterManagerSession: FC<{
  id?: string
  change?: (id?: string) => void
  visible?: boolean
  close: () => void
}> = ({ id, change, close, visible }) => {
  const router = useLocalRouter({
    nomatch: id ? '/update' : '/create',
    options: id
      ? [{ key: '/update', children: null }]
      : [{ key: '/create', children: null }],
  })
  return create(Modal, {
    visible,
    children: create(Layout, {
      children: [
        create(IconBar, {
          key: 'iconBar',
          icons: id
            ? [
                {
                  icon: 'plus',
                  label: 'Update',
                  click: () => router.change('/update'),
                },
                {
                  icon: 'times-circle',
                  label: 'Close',
                  click: close,
                  solid: false,
                  seperated: true,
                },
              ]
            : [
                {
                  icon: 'plus',
                  label: 'Create',
                  click: () => router.change('/create'),
                },
                {
                  icon: 'times-circle',
                  label: 'Close',
                  click: close,
                  solid: false,
                  seperated: true,
                },
              ],
        }),
        router.current &&
          create((() => router.current.children) as FC, {
            key: 'children',
          }),
      ],
    }),
  })
}

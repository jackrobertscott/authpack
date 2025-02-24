import { createElement as element, FC, Fragment, useState } from 'react'
import { IconBar, useRouter } from '@authpack/theme'
import { useAuthpack } from '@authpack/react'
import { RouterSideBarHome } from './RouterSideBarHome'
import { RouterManagerClusterClient } from './RouterManagerClusterClient'
import { Explorer } from './Explorer'
import { usePreferences } from '../utils/preferences'
import { authpack } from '../utils/authpack'

export const RouterCentral: FC = () => {
  const auth = useAuthpack()
  const preferences = usePreferences()
  const [appear, appearChange] = useState<boolean>(false)
  const [goto, gotoChange] = useState<string | undefined>()
  const router = useRouter({
    nomatch: '/app',
    options: [
      {
        path: '/app',
        children: element(RouterSideBarHome, {
          openSettings: key => {
            gotoChange(key)
            appearChange(true)
          },
        }),
      },
      { path: '/developers', children: element(Explorer) },
    ],
  })
  return element(IconBar, {
    children: [
      element(RouterManagerClusterClient, {
        key: 'cluster',
        visible: appear,
        close: () => appearChange(false),
        goto,
      }),
      router.current &&
        element(Fragment, {
          key: 'children',
          children: router.current.children,
        }),
    ],
    icons: [
      {
        icon: 'home',
        label: 'Home',
        focused: !!router.current && router.current.path.startsWith('/app'),
        click: () => router.change('/app'),
      },
      !!auth.membership &&
        !!auth.membership.superadmin && {
          icon: 'code',
          label: 'Developers',
          focused: !!router.current && router.current.path === '/developers',
          click: () => router.change('/developers'),
          hidesmall: true,
        },
      {
        prefix: 'far',
        icon: 'question-circle',
        label: 'Help & Feedback',
        hidesmall: true,
        options: [
          {
            icon: 'book',
            label: 'Documents',
            helper: 'See installation instructions',
            click: () =>
              window.open(
                'https://www.notion.so/Documents-5aacd2c94989476283d0e18117e490c4'
              ),
          },
          {
            icon: 'bug',
            label: 'Bug',
            helper: 'Report an problem',
            click: () =>
              window.open(
                'https://github.com/jackrobertscott/authpack-client/issues'
              ),
          },
          {
            icon: 'magic',
            label: 'Feedback',
            helper: 'Request a new feature',
            click: () =>
              window.open(
                'https://github.com/jackrobertscott/authpack-client/issues'
              ),
          },
        ],
      },
      {
        icon: preferences.theme === 'snow_storm' ? 'toggle-off' : 'toggle-on',
        label: 'Dark Mode',
        click: () =>
          preferences.update({
            theme:
              preferences.theme === 'snow_storm' ? 'night_sky' : 'snow_storm',
          }),
        seperated: true,
      },
      {
        icon: 'cog',
        label: 'Settings',
        click: () => appearChange(!appear),
      },
      {
        icon: 'user-circle',
        label: 'Account',
        click: () => authpack.open(),
      },
    ],
  })
}

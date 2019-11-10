import { createElement as create, FC, useState, Fragment } from 'react'
import { useLocalRouter, Layout, IconBar } from 'wga-theme'
import { LoginUser } from '../screens/LoginUser'
import { SignupUser } from '../screens/SignupUser'
import { ForgotUserPassword } from '../screens/ForgotUserPassword'
import { useSettings } from '../hooks/useSettings'
import { Devmode } from '../screens/Devmode'

export const RouterModalUnauthed: FC<{
  close: () => void
}> = ({ close }) => {
  const [devopen, devopenChange] = useState<boolean>(false)
  const settings = useSettings()
  const router = useLocalRouter({
    nomatch: '/login',
    options: [
      { key: '/login', children: create(LoginUser) },
      { key: '/signup', children: create(SignupUser) },
      { key: '/forgot', children: create(ForgotUserPassword) },
    ],
  })
  return create(Layout, {
    children: [
      create(IconBar, {
        key: 'iconBar',
        icons: [
          {
            icon: 'unlock',
            label: 'Login',
            click: () => router.change('/login'),
          },
          {
            icon: 'plus',
            label: 'Sign Up',
            click: () => router.change('/signup'),
          },
          {
            icon: 'question-circle',
            label: 'Forgot Password?',
            click: () => router.change('/forgot'),
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
      devopen
        ? create(Devmode, {
            key: 'devmode',
            close: () => devopenChange(false),
          })
        : router.current &&
          create(Fragment, {
            key: 'children',
            children: router.current.children,
          }),
    ],
  })
}

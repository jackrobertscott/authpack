import {
  createElement as create,
  FC,
  ReactNode,
  useState,
  useEffect,
} from 'react'
import { Layout, Iconbar, IIconbarSubmenu } from 'wga-theme'

export type IGadgetsIconbarScreen = {
  id?: string
  icon: string
  label: string
  children: ReactNode
  skip?: boolean
  submenu?: Array<{ children?: ReactNode } & IIconbarSubmenu>
}

export type IGadgetsIconbar = {
  close?: () => void
  screens: IGadgetsIconbarScreen[]
}

export const GadgetsIconbar: FC<IGadgetsIconbar> = ({ close, screens }) => {
  const starting =
    screens[0].submenu && screens[0].submenu.length
      ? screens[0].submenu[0]
      : screens[0]
  const [active, changeActive] = useState<{
    label: string
    children?: ReactNode
  }>(starting)
  const compareActive = (screen: IGadgetsIconbarScreen) => {
    return screen.label === active.label
  }
  useEffect(() => {
    if (!screens.find(compareActive)) changeActive(starting)
    // eslint-disable-next-line
  }, [screens])
  return create(Layout.Container, {
    children: [
      create(Iconbar.Container, {
        key: 'iconbar',
        top: screens
          .filter(({ skip }) => !skip)
          .map((screen, i) => {
            return create(Iconbar.Pointer, {
              key: screen.id || String(i),
              label: screen.label,
              submenu: screen.submenu,
              children: create(Iconbar.Icon, {
                name: screen.icon,
                click: () => changeActive(screen),
                active: compareActive(screen),
              }),
            })
          }),
        bottom:
          close &&
          create(Iconbar.Pointer, {
            label: 'Close',
            children: create(Iconbar.Icon, {
              name: 'times-circle',
              click: close,
            }),
          }),
      }),
      create((() => active.children || null) as FC, {
        key: 'children',
      }),
    ],
  })
}

import { createElement as create, FC } from 'react'
import { Button, Gadgets, Poster } from 'wga-theme'
import { createUseGraph } from '../hooks/useGraph'

export type IRemovePermission = {
  id: string
  change?: () => void
}

export const RemovePermission: FC<IRemovePermission> = ({ id, change }) => {
  // remove the permission when the form is submitted
  const removePermission = useRemovePermission()
  const remove = () => {
    removePermission
      .fetch({
        options: { id },
      })
      .then(change)
  }
  return create(Gadgets.Container, {
    label: 'Remove Permission',
    brand: 'Authenticator',
    children: create(Gadgets.Spacer, {
      children: [
        create(Poster.Container, {
          key: 'poster',
          icon: 'radiation',
          label: 'Delete Permission',
          description: 'Permanently remove this permission',
        }),
        create(Button.Container, {
          key: 'remove',
          label: 'Delete',
          click: remove,
          confirm: true,
        }),
      ],
    }),
  })
}

const useRemovePermission = createUseGraph<{
  permission: {
    id: string
  }
}>({
  name: 'RemovePermission',
  query: `
    mutation RemovePermission($options: RemovePermissionOptions!) {
      permission: RemovePermission(options: $options) {
        id
      }
    }
  `,
})

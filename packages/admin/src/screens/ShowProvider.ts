import { createElement as element, FC, useEffect } from 'react'
import { Layout, Snippet, Page } from '@authpack/theme'
import { format } from 'date-fns'
import { createUseServer } from '../hooks/useServer'

export const ShowProvider: FC<{
  id: string
}> = ({ id }) => {
  const gqlGetProvider = useGetProvider()
  useEffect(() => {
    gqlGetProvider.fetch({ id })
    // eslint-disable-next-line
  }, [id])
  const provider = gqlGetProvider.data
    ? gqlGetProvider.data.provider
    : undefined
  return element(Page, {
    title: 'Inspect',
    subtitle: 'Provider',
    children: !provider
      ? null
      : element(Layout, {
          column: true,
          children: [
            element(Snippet, {
              key: 'id',
              icon: 'fingerprint',
              label: 'Id',
              value: provider.id,
            }),
            element(Snippet, {
              key: 'preset',
              icon: 'share-alt',
              label: 'Preset',
              value: provider.preset,
            }),
            element(Snippet, {
              key: 'client',
              icon: 'key',
              label: 'Client Id',
              value: provider.client,
            }),
            element(Snippet, {
              key: 'redirect_uri',
              icon: 'compass',
              label: 'Advanced Redirect Uri',
              value: provider.redirect_uri || '...',
            }),
            element(Snippet, {
              key: 'scopes',
              icon: 'user-shield',
              label: 'Scopes',
              value: (provider.scopes && provider.scopes.join(', ')) || '...',
            }),
            element(Layout, {
              key: 'dates',
              grow: true,
              media: true,
              children: [
                element(Snippet, {
                  key: 'created',
                  icon: 'clock',
                  label: 'Created',
                  value:
                    provider.created &&
                    format(new Date(provider.created), 'dd LLL yyyy @ h:mm a'),
                }),
                element(Snippet, {
                  key: 'updated',
                  icon: 'clock',
                  label: 'Updated',
                  value:
                    provider.updated &&
                    format(new Date(provider.updated), 'dd LLL yyyy @ h:mm a'),
                }),
              ],
            }),
          ],
        }),
  })
}

const useGetProvider = createUseServer<{
  provider: {
    id: string
    created: string
    updated: string
    preset: string
    client: string
    redirect_uri: string
    scopes: string[]
  }
}>({
  query: `
    query GetProvider($id: String!) {
      provider: GetProvider(id: $id) {
        id
        created
        updated
        preset
        client
        redirect_uri
        scopes
      }
    }
  `,
})

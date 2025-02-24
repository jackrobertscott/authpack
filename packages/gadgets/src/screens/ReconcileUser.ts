import * as yup from 'yup'
import { createElement as element, FC } from 'react'
import {
  Layout,
  useSchema,
  InputString,
  Button,
  Focus,
  useToaster,
} from '@authpack/theme'
import { createUseServer } from '../hooks/useServer'
import { SettingsStore } from '../utils/settings'

export const ReconcileUser: FC<{
  email: string
}> = ({ email }) => {
  const toaster = useToaster()
  const gqlRecoverUser = useRecoverUser()
  const gqlReconcileUser = useReconcileUser()
  const schema = useSchema({
    schema: SchemaReconcileUser,
    submit: value => {
      gqlReconcileUser.fetch({ ...value, email }).then(({ session }) => {
        SettingsStore.update({
          bearer: `Bearer ${session.token}`,
        })
      })
    },
  })
  return element(Layout, {
    grow: true,
    children: [
      element(Focus, {
        key: 'poster',
        icon: 'unlock',
        label: 'Verify Email',
        helper: 'A code was sent to your email',
        children: element(Layout, {
          column: true,
          divide: true,
          children: [
            element(InputString, {
              key: 'code',
              value: schema.value('code'),
              change: schema.change('code'),
              placeholder: 'Code...',
            }),
            element(Layout, {
              key: 'layout',
              divide: true,
              children: [
                element(Button, {
                  key: 'submit',
                  label: 'Verify',
                  loading: gqlReconcileUser.loading,
                  disabled: !schema.valid,
                  click: schema.submit,
                }),
                element(Button, {
                  key: 'resend',
                  icon: 'paper-plane',
                  label: 'Resend',
                  loading: gqlRecoverUser.loading,
                  click: () =>
                    gqlRecoverUser.fetch({ email }).then(() => {
                      toaster.add({
                        label: 'Success',
                        helper: `Email sent to ${email}`,
                      })
                    }),
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  })
}

const SchemaReconcileUser = yup.object().shape({
  code: yup.string().required('Please provide your recover code'),
})

const useReconcileUser = createUseServer<{
  session: {
    id: string
    token: string
  }
}>({
  query: `
    mutation ReconcileUserClient($email: String!, $code: String!) {
      session: ReconcileUserClient(email: $email, code: $code) {
        id
        token
      }
    }
  `,
})

const useRecoverUser = createUseServer<{}>({
  query: `
    mutation RecoverUserClient($email: String!) {
      RecoverUserClient(email: $email) { id }
    }
  `,
})

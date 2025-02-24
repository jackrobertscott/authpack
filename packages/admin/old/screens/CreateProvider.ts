import * as validator from 'yup'
import { createElement as create, FC, useState, useEffect } from 'react'
import { Inputs, Button, Gadgets } from 'wga-theme'
import { createUseGraph } from '../hooks/useGraph'
import { useStore } from '../hooks/useStore'

export type ICreateProvider = {
  change?: () => void
}

export const CreateProvider: FC<ICreateProvider> = ({ change }) => {
  // initialize the provider form values and apply validators
  const [issue, issueChange] = useState<Error>()
  const [value, valueStore] = useStore('CreateProvider', {
    ...schemaCreateProvider.default(),
  })
  const validateAndPatch = (path: string) => (data: any) => {
    const update = { ...value, [path]: data }
    valueStore.change(update)
    return schemaCreateProvider.validateAt(path, update)
  }
  useEffect(() => {
    let mounted = true
    schemaCreateProvider
      .validate(value)
      .then(() => mounted && issueChange(undefined))
      .catch(error => mounted && issueChange(error))
    return () => {
      mounted = false
    }
  }, [value])
  // create the provider when the form is submitted
  const createProvider = useCreateProvider()
  const submit = () => {
    schemaCreateProvider
      .validate(value)
      .then(data => createProvider.fetch({ options: data }))
      .then(() => {
        if (change) change()
        setTimeout(() =>
          valueStore.change({ ...schemaCreateProvider.default() })
        )
      })
  }
  return create(Gadgets.Container, {
    label: 'Create Provider',
    brand: 'Authenticator',
    children: create(Gadgets.Spacer, {
      children: [
        create(Inputs.Control, {
          key: 'preset',
          label: 'Preset',
          description: 'A unique identifier for your provider',
          change: validateAndPatch('preset'),
          input: props =>
            create(Inputs.Select, {
              ...props,
              options: [
                {
                  value: 'facebook',
                  label: 'Facebook',
                  description: 'Connect to Facebook OAuth',
                },
                {
                  value: 'google',
                  label: 'Google',
                  description: 'Connect to Google OAuth',
                },
                {
                  value: 'github',
                  label: 'GitHub',
                  description: 'Connect to GitHub OAuth',
                },
                {
                  value: 'slack',
                  label: 'Slack',
                  description: 'Connect to Slack OAuth',
                },
              ],
            }),
        }),
        create(Inputs.Control, {
          key: 'client',
          label: 'Client Id',
          description: 'Please provide the client id provided by OAuth',
          change: validateAndPatch('client'),
          input: props =>
            create(Inputs.String, {
              ...props,
              value: value.client,
              placeholder: 'E.g. daf77t823aft872b23b87y',
            }),
        }),
        create(Inputs.Control, {
          key: 'secret',
          label: 'Client Secret',
          description: 'Please provide the client secret provided by OAuth',
          change: validateAndPatch('secret'),
          input: props =>
            create(Inputs.String, {
              ...props,
              value: value.secret,
              placeholder: 'E.g. 89v7t2387by3b8y234b7bf',
            }),
        }),
        create(Inputs.Control, {
          key: 'redirect',
          label: 'Redirect Url',
          description: 'Please provide the url where your gadgets are shown',
          change: validateAndPatch('redirect'),
          input: props =>
            create(Inputs.String, {
              ...props,
              value: value.redirect,
              placeholder: 'E.g. https://yourapp.com/login',
            }),
        }),
        create(Inputs.Control, {
          key: 'scopes',
          label: 'Scopes',
          description: 'These are specific to each OAuth provider',
          change: validateAndPatch('scopes'),
          input: props =>
            create(Inputs.StringArray, {
              ...props,
              value: value.scopes,
              placeholder: 'E.g. user:repos or user_likes',
            }),
        }),
        create(Button.Container, {
          key: 'submit',
          label: 'Create',
          click: submit,
          disable: !!issue,
        }),
      ],
    }),
  })
}

const useCreateProvider = createUseGraph<{
  provider: {
    id: string
  }
}>({
  name: 'CreateProvider',
  query: `
    mutation CreateProvider($options: CreateProviderOptions!) {
      provider: CreateProvider(options: $options) {
        id
      }
    }
  `,
})

const schemaCreateProvider = validator.object().shape({
  preset: validator.string().required('Please provide a unique provider tag'),
  client: validator
    .string()
    .required('Please provide your 3rd party oauth client id'),
  secret: validator
    .string()
    .required('Please provide your 3rd party oauth client secret'),
  redirect: validator
    .string()
    .url('Please make sure use a valid redirect url')
    .required('Please provide your 3rd party oauth client id'),
  scopes: validator
    .array()
    .of(validator.string().required('Scopes can not be empty')),
})

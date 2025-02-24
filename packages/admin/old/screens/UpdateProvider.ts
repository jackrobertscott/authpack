import * as validator from 'yup'
import { createElement as create, FC, useState, useEffect } from 'react'
import { Inputs, Button, Gadgets } from 'wga-theme'
import { createUseGraph } from '../hooks/useGraph'

export type IUpdateProvider = {
  id: string
}

export const UpdateProvider: FC<IUpdateProvider> = ({ id }) => {
  // initialize the provider form values and apply validators
  const [issue, issueChange] = useState<Error>()
  const [value, valueChange] = useState({ ...schemaUpdateProvider.default() })
  const validateAndPatch = (path: string) => (data: any) => {
    const update = { ...value, [path]: data }
    valueChange(update)
    return schemaUpdateProvider.validateAt(path, update)
  }
  useEffect(() => {
    let mounted = true
    schemaUpdateProvider
      .validate(value)
      .then(() => mounted && issueChange(undefined))
      .catch(error => mounted && issueChange(error))
    return () => {
      mounted = false
    }
  }, [value])
  // load the provider and set as default form values
  const retrieveProvider = useRetrieveProvider({
    options: { id },
  })
  useEffect(() => {
    if (retrieveProvider.data)
      valueChange({
        preset: retrieveProvider.data.provider.preset,
        redirect: retrieveProvider.data.provider.redirect,
        scopes: retrieveProvider.data.provider.scopes,
      })
  }, [retrieveProvider.data])
  // update the provider when the form is submitted
  const updateProvider = useUpdateProvider()
  const submit = () => {
    schemaUpdateProvider.validate(value).then(data => {
      const options = { ...data, id }
      updateProvider.fetch({ options }, 'UpdateProvider')
    })
  }
  return create(Gadgets.Container, {
    label: 'Update Provider',
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
          label: 'Update',
          click: submit,
          disable: !!issue,
        }),
      ],
    }),
  })
}

const useRetrieveProvider = createUseGraph<{
  provider: {
    id: string
    preset: string
    redirect: string
    scopes: string[]
  }
}>({
  name: 'RetrieveProvider',
  query: `
    query RetrieveProvider($options: RetrieveProviderOptions!) {
      provider: RetrieveProvider(options: $options) {
        id
        preset
        redirect
        scopes
      }
    }
  `,
})

const useUpdateProvider = createUseGraph<{
  provider: {
    id: string
  }
}>({
  name: 'UpdateProvider',
  query: `
    mutation UpdateProvider($options: UpdateProviderOptions!) {
      provider: UpdateProvider(options: $options) {
        id
      }
    }
  `,
})

const schemaUpdateProvider = validator.object().shape({
  preset: validator.string().required('Please provide a unique provider tag'),
  redirect: validator
    .string()
    .url('Please make sure use a valid redirect url')
    .required('Please provide your 3rd party oauth client id'),
  scopes: validator
    .array()
    .of(validator.string().required('Scopes can not be empty')),
})

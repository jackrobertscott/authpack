import { createElement as create, FC, useState, useEffect } from 'react'
import { Inputs, Button, Gadgets } from 'wga-theme'
import * as validator from 'yup'
import { useGraph } from '../hooks/useGraph'

const schema = validator.object().shape({
  email: validator
    .string()
    .email('Please make sure you have used a valid email address')
    .required('Please provide your name'),
  password: validator.string().required('Please provide your email'),
})

export type IUnauthedLogin = {}

export const UnauthedLogin: FC<IUnauthedLogin> = () => {
  const [value, valueChange] = useState({ ...schema.default() })
  const [issue, issueChange] = useState<Error>()
  const [graph, { execute }] = useGraph({
    api: true,
    query: `
      mutation Login($email: String!, $password: String!) {
        session: CreateSession(options: { email: $email, password: $password }) {
          id
          token
        }
      }
    `,
  })
  const submit = () => {
    schema
      .validate(value)
      .then(data => execute(data, 'Login'))
      .then(console.log)
  }
  const patch = (path: string) => (data: any) => {
    const update = { ...value, [path]: data }
    valueChange(update)
    return schema.validateAt(path, update)
  }
  useEffect(() => {
    schema
      .validate(value)
      .then(() => issueChange(undefined))
      .catch(issueChange)
  }, [value])
  return create(Gadgets.Container, {
    label: 'Login',
    brand: 'Your App',
    children: create(Gadgets.Spacer, {
      children: [
        create(Inputs.Control, {
          key: 'email',
          label: 'Email',
          description: 'Please use a valid email address',
          change: patch('email'),
          input: props =>
            create(Inputs.String, {
              ...props,
              placeholder: 'fred.blogs@example.com',
            }),
        }),
        create(Inputs.Control, {
          key: 'password',
          label: 'Password',
          description: 'Please use more than 6 characters',
          change: patch('password'),
          input: props =>
            create(Inputs.String, {
              ...props,
              placeholder: '**********',
            }),
        }),
        create(Button.Container, {
          key: 'submit',
          label: 'Submit',
          click: submit,
          disable: !!issue,
        }),
      ],
    }),
  })
}

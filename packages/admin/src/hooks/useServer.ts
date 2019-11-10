import { useGQL } from 'wga-theme'
import { useGlobal } from './useGlobal'
import { wga } from '../utils/gadgets'
import { config } from '../config'

export const createUseServer = <T>(options: {
  name?: string
  query: string
}) => () => {
  return useServer<T>(options)
}

export const useServer = <T>({
  name,
  query,
}: {
  name?: string
  query: string
}) => {
  const global = useGlobal()
  return useGQL<T>({
    url: config.api,
    authorization: [config.admin_domain_key, wga.current.bearer]
      .filter(Boolean)
      .join(','),
    name,
    query,
  })
}

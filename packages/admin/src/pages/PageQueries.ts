import { createElement as create, FC } from 'react'
import { css } from 'emotion'
import GraphiQL from 'graphiql'
import 'graphiql/graphiql.css'
import { chat } from '../utils/server'

export type IPageQueries = {}

export const PageQueries: FC<IPageQueries> = () => {
  return create('div', {
    className: css({
      flexGrow: 1,
    }),
    children: create(GraphiQL, {
      fetcher: (graphQLParams: any) =>
        chat({ ...graphQLParams, api: true }).catch(console.warn),
    } as any),
  })
}

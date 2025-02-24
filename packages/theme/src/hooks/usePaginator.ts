import { useState, useEffect, useMemo } from 'react'

export const usePaginator = ({
  count,
  limit,
}: {
  count?: number
  limit?: number
}) => {
  const [paginator, changePaginator] = useState({
    total: 0,
    limit: limit || 50,
    page: 0,
    skip: 0,
  })
  const hasNext = () => {
    const value =
      paginator.total &&
      paginator.total > (paginator.page + 1) * paginator.limit
    return Boolean(value)
  }
  const hasPrevious = () => Boolean(paginator.page > 0)
  const next = () => {
    if (hasNext())
      changePaginator({
        total: paginator.total,
        limit: paginator.limit,
        page: paginator.page + 1,
        skip: paginator.limit * (paginator.page + 1),
      })
  }
  const previous = () => {
    if (hasPrevious())
      changePaginator({
        total: paginator.total,
        limit: paginator.limit,
        page: paginator.page - 1,
        skip: paginator.limit * (paginator.page - 1),
      })
  }
  useEffect(() => {
    changePaginator(state => ({
      ...state,
      total: count || 0,
    }))
  }, [count])
  return useMemo(() => {
    return {
      ...paginator,
      hasNext,
      hasPrevious,
      next,
      previous,
    }
  }, [paginator])
}

import { useState, useEffect, useCallback } from 'react'

interface UseInfiniteScrollProps {
  fetchMore: () => Promise<void>
  hasMore: boolean
  threshold?: number
}

export const useInfiniteScroll = ({ 
  fetchMore, 
  hasMore, 
  threshold = 200 
}: UseInfiniteScrollProps) => {
  const [isFetching, setIsFetching] = useState(false)

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= 
      document.body.offsetHeight - threshold &&
      hasMore &&
      !isFetching
    ) {
      setIsFetching(true)
    }
  }, [hasMore, isFetching, threshold])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (!isFetching) return

    const fetchData = async () => {
      await fetchMore()
      setIsFetching(false)
    }

    fetchData()
  }, [isFetching, fetchMore])

  return { isFetching }
}
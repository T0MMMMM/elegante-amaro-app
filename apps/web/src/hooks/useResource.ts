import { useCallback, useEffect, useState } from 'react'

interface State<T> {
  data: T[]
  loading: boolean
  error: string | null
}

export function useResource<T>(fetcher: () => Promise<T[]>) {
  const [state, setState] = useState<State<T>>({ data: [], loading: true, error: null })

  const load = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }))
    try {
      const data = await fetcher()
      setState({ data, loading: false, error: null })
    } catch (e) {
      setState(s => ({ ...s, loading: false, error: e instanceof Error ? e.message : 'Erreur inconnue' }))
    }
  }, [fetcher])

  useEffect(() => { load() }, [load])

  const setData = (updater: (prev: T[]) => T[]) =>
    setState(s => ({ ...s, data: updater(s.data) }))

  return { ...state, reload: load, setData }
}

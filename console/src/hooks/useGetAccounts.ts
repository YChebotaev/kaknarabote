import { useSuspenseQuery } from '@tanstack/react-query'
import { useApiClient } from "./useApiClient"

export const useGetAccounts = () => {
  const apiClient = useApiClient()

  const { data } = useSuspenseQuery({
    queryKey: ["accounts"],
    queryFn: () => apiClient.getAccounts()
  })

  return data
}
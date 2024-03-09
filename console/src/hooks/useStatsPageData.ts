import { useQuery } from '@tanstack/react-query'
import { useApiClient } from "./useApiClient"
import { getAccountId } from '../utils/getAccountId'

export const useStatsPageData = () => {
  const apiClient = useApiClient()

  const { data } = useQuery({
    queryKey: ["stats"],
    queryFn: () => apiClient.getStats({ accountId: getAccountId()! })
  })

  return data
}

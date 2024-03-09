import { useSuspenseQuery } from '@tanstack/react-query'
import { useApiClient } from "./useApiClient"
import { getAccountId } from '../utils/getAccountId'

export const useFeedbackPageData = () => {
  const apiClient = useApiClient()

  const { data } = useSuspenseQuery({
    queryKey: ["textFeedback"],
    queryFn: () => apiClient.getTextFeedback({ accountId: getAccountId()! })
  })

  return data
}
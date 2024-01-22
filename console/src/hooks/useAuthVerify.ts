import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import type {
  AuthVerifyData,
  AuthVerifyQuery,
} from "@checkyourstaff/console-backend/types";
import { useApiClient } from "./useApiClient";

export const useAuthVerify = ({
  onSuccess,
}: {
  onSuccess(data: AuthVerifyData): void;
}) => {
  const apiClient = useApiClient();
  const [searchParams] = useSearchParams();
  const { data, isLoading } = useQuery({
    queryKey: ["auth", "verify"],
    async queryFn() {
      const { data } = await apiClient.get<AuthVerifyData>("/auth/verify", {
        params: {
          id: searchParams.get("id")! /* Telegram user id */,
          first_name: searchParams.get("first_name")!,
          last_name: searchParams.get("last_name")!,
          username: searchParams.get("username")!,
          photo_url: searchParams.get("photo_url")!,
          auth_date: searchParams.get("auth_date")!,
          hash: searchParams.get("hash")!,
        } satisfies AuthVerifyQuery,
      });

      return data;
    },
  });

  useEffect(() => {
    if (!isLoading && data != null) {
      onSuccess(data);
    }
  }, [data, isLoading, onSuccess]);
};
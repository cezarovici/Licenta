import { api } from "../types/api/fetch";

type StatusMessage = {
  type: "success" | "error";
  message: string;
} | null;

export const useUserType = () => {
  const {
    data: userType,
    isLoading: isLoadingUserType,
    error: errorLoadingUserType,
  } = api.useQuery("get", "/api/user-type/", {
    params: {
      header: { "X-User-Id": 1 },
    },
  });

  return {
    userType,
    isLoadingUserType,
    errorLoadingUserType,
  };
};

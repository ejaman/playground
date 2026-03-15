import { QueryClient } from "@tanstack/react-query";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 1분 동안 데이터를 캐시에 저장
        staleTime: 1000 * 60,
        // 1번 재시도
        retry: 1,
      },
    },
  });
}

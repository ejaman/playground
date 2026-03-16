/**
 * Velite가 .velite 를 생성하기 전에도 TS가 #site/content 를 인식하도록 하는 선언
 * velite build 실행 후에는 .velite 에서 생성된 타입이 사용
 */
declare module "#site/content" {
  export interface Post {
    slug: string;
    id: string;
    title: string;
    date: string;
    tags?: string[];
    series?: string;
    description?: string;
    thumbnail?: string;
    published?: boolean;
    body: string;
    url: string;
    seriesTitle?: string;
  }

  export const posts: Post[];
}

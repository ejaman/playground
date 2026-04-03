export const profile = {
  /** 헤더/히어로에 표시되는 이니셜 (대문자 권장) */
  monogram: "LEE JIMIN",

  /** 풀네임 */
  fullName: "이지민",

  /** 헤더 브랜드명 */
  brandName: "JIMIN",

  /** 히어로 서브타이틀 (모바일) */
  subtitle:
    "React & TypeScript 기반 프론트엔드 개발자입니다. 확장성과 유지보수성을 최우선으로 고려하는 엔지니어입니다.",

  /** 히어로 소개문 (데스크탑 우측) — 1~2문장 */
  heroIntro:
    "서비스의 지속 가능한 구조를 설계하는 3년차 프론트엔드 개발자입니다. 대규모 마이그레이션과 데이터 시각화 도구 개발을 통해 기술적 부채를 해결하고 함께 성장하는 개발 문화를 만들어갑니다.",

  /** 연락처 */
  email: "leegm17@naver.com",

  /** 소셜 링크 — 미사용 항목은 null */
  social: {
    blog: "https://velog.io/@ejaman/posts" as string | null,
    github: "https://velog.io/@ejaman/posts" as string | null,
  },
} as const;

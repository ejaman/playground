export const philosophy = {
  /** 데스크탑 섹션 메인 타이틀 */
  title: "CODE IS READ MORE THAN IT IS WRITTEN.",

  /** 모바일 섹션 메인 타이틀 */
  titleMobile: "ENGINEER'S PHILOSOPHY",

  /** 히어로 소개 + 철학 본문 (데스크탑 우측) */
  body: "React와 TypeScript 기반 프론트엔드 개발자 이지민입니다. 단순한 기능 구현을 넘어, 서비스의 확장성과 유지보수성을 최우선으로 고려합니다. 오늘의 코드가 미래의 레거시라는 생각으로  가독성 좋은 코드, 더 나아가 설명이 필요 없는 구조를 지향합니다.",

  /** 데스크탑 좌측 원칙 목록 */
  principles: [
    "CODE IS WRITTEN ONCE, BUT READ A HUNDRED TIMES. / 코드는 한 번 쓰지만, 백 번 읽힌다. 나는 항상 읽는 사람의 입장에서 쓴다.",
    "NAMING IS NOT DECORATION, IT IS DESIGN. / 이름 하나, 구조 하나가 주석 열 줄보다 낫다. 좋은 네이밍은 문서보다 강하다.",
    "DON'T PASS TODAY'S COMPLEXITY TO TOMORROW'S DEVELOPER. / 오늘의 복잡함을 내일의 누군가에게 떠넘기지 않는다. 그 누군가는 대부분 미래의 나다.",
  ],

  /** 모바일 01 — CONTEXT 인용구 */
  quote:
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. — Martin Fowler\n컴퓨터가 이해하는 코드는 누구나 쓸 수 있다. 좋은 개발자는 사람이 이해하는 코드를 쓴다.",

  /** 모바일 02 — EXECUTION 설명 */
  execution:
    "레거시 마이그레이션, 데이터 시각화, 모노레포 설계까지 — 모든 결정의 기준은 하나입니다. 지금의 나뿐 아니라, 6개월 후의 나와 팀원이 읽을 수 있는 코드.",

  /** 모바일 03 — 슬로건 */
  slogan: "READABLE FIRST, CLEVER NEVER",
} as const;

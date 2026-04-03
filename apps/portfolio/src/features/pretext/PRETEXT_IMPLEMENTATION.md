# @chenglou/pretext 마우스 반발 효과 구현 정리

## 왜 pretext를 쓰는가

### 문제: DOM 읽기-쓰기 교차로 인한 Layout Flush

마우스 위치와 텍스트 글자의 충돌 여부를 판단하려면 각 글자의 위치를 알아야 한다.
일반적인 DOM 방식으로 `getBoundingClientRect()`를 쓰면 다음 문제가 생긴다:

```
1. 각 글자에 CSS transform 쓰기 예약 (브라우저가 배치에 담아둠)
2. 다음 글자 위치 읽기 요청 (getBoundingClientRect)
3. 브라우저: "쓰기가 예정되어 있어서 값이 바뀔 수 있음 → 배치된 쓰기 강제 실행"
4. Layout 발생
5. 읽기 완료
6. 다시 다음 글자 → 1번부터 반복
```

글자 수가 수백 개라면 **글자마다 Layout이 발생**해 프레임이 뚝뚝 끊긴다.

### 해결: pretext의 Canvas 기반 사전 계산

```
mount 시 (1회):
  prepareWithSegments(text, font)  →  canvas로 폰트 메트릭 측정
  layoutWithLines(prepared, maxWidth, lineHeight)  →  줄별 텍스트 획득
  ctx.measureText(char).width  →  글자별 x 좌표 계산
  → 모든 글자의 (homeX, homeY) 메모리에 저장

매 프레임 (mousemove 없이 rAF):
  읽기: 메모리의 homeX/homeY vs mouse.x/mouse.y → 거리 계산  ← DOM 읽기 없음
  쓰기: ox/oy 오프셋 업데이트, canvas fillText            ← 배치 처리 가능
```

DOM을 전혀 읽지 않으므로 브라우저가 쓰기를 한 번에 배치 처리 → **Layout flush 없음**.

---

## 핵심 API

```ts
import { prepareWithSegments, layoutWithLines } from "@chenglou/pretext";

// 1. 텍스트 분석 + canvas 폰트 메트릭 측정
const prepared = prepareWithSegments(text, font); // font: CSS font string

// 2. 줄 단위 레이아웃 계산 (순수 산술, DOM 없음)
const { lines } = layoutWithLines(prepared, maxWidth, lineHeight);
// lines: Array<{ text: string, width: number, ... }>
```

`font` 파라미터는 CSS font 문자열 그대로 사용:
```ts
'700 72px Inter, sans-serif'
'400 12px "JetBrains Mono", monospace'
```

---

## 구현 구조

### 1. 글자 객체 (Glyph)

```ts
type Glyph = {
  char: string;
  homeX: number; homeY: number; // 원래 위치 (고정)
  x: number;     y: number;     // 실제 렌더 위치 (오프셋 적용)
  ox: number;    oy: number;    // 현재 오프셋 (스프링)
  font: string;  color: string;
};
```

`homeX/homeY`는 mount 시 한 번만 계산되고 변하지 않는다.
`ox/oy`는 매 프레임 물리 연산으로 갱신된다.

### 2. 글자 위치 계산 (읽기 단계)

```ts
function glyphsForLine(ctx, text, startX, baseline, font, color): Glyph[] {
  ctx.font = font;
  let x = startX;
  for (const char of text) {
    const w = ctx.measureText(char).width; // canvas 측정 (DOM 읽기 아님)
    glyphs.push({ char, homeX: x, homeY: baseline, ... });
    x += w;
  }
}
```

pretext가 줄 단위로 나눠준 `line.text`를 다시 글자 단위로 쪼개서 x 좌표 누적.

### 3. 물리 루프 (쓰기 단계)

```ts
function loop() {
  for (const g of glyphs) {
    const dx = g.homeX - mouse.x;
    const dy = g.homeY - mouse.y;
    const d = Math.hypot(dx, dy);

    let fx = 0, fy = 0;
    if (d < REPEL_R && d > 0.1) {
      const t = 1 - d / REPEL_R;       // 거리에 따른 감쇠 (가까울수록 강함)
      const f = t * t * REPEL_F;        // 이차 감쇠로 자연스러운 경계
      fx = (dx / d) * f;                // 마우스 반대 방향으로 힘
      fy = (dy / d) * f;
    }

    // 스프링 보간: 목표 오프셋으로 부드럽게 수렴
    g.ox += (fx - g.ox) * 0.12;
    g.oy += (fy - g.oy) * 0.12;
    g.x = g.homeX + g.ox;
    g.y = g.homeY + g.oy;
  }

  ctx.clearRect(0, 0, W, H);
  for (const g of glyphs) {
    ctx.font = g.font;
    ctx.fillStyle = g.color;
    ctx.fillText(g.char, g.x, g.y);   // 모든 쓰기가 여기서 일괄 처리
  }

  requestAnimationFrame(loop);
}
```

### 4. 캔버스 DPR 처리 (고해상도 디스플레이 대응)

```ts
dpr = Math.min(devicePixelRatio || 1, 2);
canvas.width  = Math.round(W * dpr);   // 물리 픽셀 크기
canvas.height = Math.round(H * dpr);
canvas.style.width  = `${W}px`;        // CSS 표시 크기
canvas.style.height = `${H}px`;
ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // 이후 좌표계는 CSS px 기준
```

### 5. 폰트 로드 대응

```ts
document.fonts.ready.then(() => { dirty = true; });
```

브라우저 폰트가 로드되기 전에 canvas가 먼저 렌더링될 수 있다.
`fonts.ready` 이후 재레이아웃(`dirty = true`)으로 정확한 메트릭을 보장한다.

---

## 조정 가능한 값

| 상수 | 현재값 | 의미 |
|------|--------|------|
| `REPEL_R` | `120` | 마우스 감지 반경 (px). 클수록 멀리서부터 반응 |
| `REPEL_F` | `30` | 최대 밀림 강도. 클수록 강하게 밀림 |
| `0.12` (스프링) | `0.12` | 복원 속도. 낮을수록 느리게 돌아옴 (0.05~0.2 권장) |

---

## 파일 위치

```
src/features/pretext/
├── index.ts                    # barrel export
└── ui/
    └── philosophy-canvas.tsx   # 구현체
```

`widgets/philosophy-section.tsx`의 데스크탑 영역에서 `<PhilosophyCanvas />`로 사용.
모바일은 기존 DOM 렌더링 유지 (canvas는 `hidden md:block` 래퍼 안에 위치).

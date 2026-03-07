---
title: "javascript3"
date: "2026-03-07T06:50:56.707Z"
tags: ["javascript"]
series: "javascript"
published: false
---

# 3️⃣ 비동기 작업을 만났을 때 👉 이벤트 루프의 조율

실행 중인 `fetch`나 `setTimeout`같은 비동기 작업을 만나면 엔진은 이를 브라우저(Web API)에 맡기고 다음 코드를 실행함. 작업이 끝나면 `Promise`가 후속 처리 로직이 Microtask Queue에 쌓이고, 이벤트 루프는 현재 실행 중인 코드가 끝날 때까지 기다렸다가 이를 Call Stack으로 옮겨 실행.
이 과정을 가독성있게 만든 것이 `async/await`

<br/><br/>

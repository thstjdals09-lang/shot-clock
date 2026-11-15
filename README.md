# 딜러 샷클락

안드로이드 크롬에서 열고 **홈 화면에 추가**하면 전체화면 앱처럼 쓰인다.
야자수 홀덤관리 프로그램(thstjdals09-lang/yajasu)과 같은 파이어베이스 DB를 쓴다. 익명 로그인으로 자동 입장하며, 파이어베이스 콘솔 → Authentication → Sign-in method 에서 **익명(Anonymous)** 을 켜야 한다. 꺼져 있으면 야자수 계정 이메일 로그인 화면이 뜬다(한 번 로그인하면 폰에 유지됨).

## 조작
- 입장: 이벤트 → 테이블 → 시간(초, 소수 가능) → 입장
- 한 번 터치: 멈춤 / 재개
- 옆으로 밀기: 초기화 후 바로 시작
- 두 손가락 터치: 플레이어 아웃 화면 → 이름 누르고 확인
- 오른쪽 위 ⚙: 테이블·시간 다시 설정
- PC 시험: 클릭 = 터치, Shift+클릭 = 초기화, 우클릭 = 아웃 화면

## 다른 프로그램과 연동
- 아웃: `tournament/ps/{idx}` 의 `busted, bustedTable, bustedSeat, bustedAt` 만 갱신하고 `tournament/_sid` 를 바꾼다. 야자수 PC 화면이 그대로 반영한다.
- 시계 상태: `shotclock/{eventId}/{table}` 에 `{durationMs, remainingMs, running, endsAt, updatedAt, sid}` 를 상태가 바뀔 때마다 쓴다. TV 화면 등은 `endsAt - Date.now()` 로 남은 시간을 계산하면 된다.

## 시험
`node test.mjs`

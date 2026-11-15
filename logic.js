// 순수 로직 — index.html 과 test.mjs 가 함께 쓴다.

// ms → "29.99" / "1:05.00"
export function fmt(ms) {
  const cs = Math.max(0, Math.floor(ms / 10));
  const s = Math.floor(cs / 100), c = String(cs % 100).padStart(2, '0');
  if (s < 60) return `${s}.${c}`;
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}.${c}`;
}

// 파이어베이스 ps 노드(배열 또는 {idx:player}) → [[키, 플레이어], ...]
export function entries(raw) {
  return Object.entries(raw || {}).filter(([, p]) => p && typeof p === 'object');
}

export function events(raw) {
  return Object.values(raw || {}).filter(e => e && e.id != null);
}

// 이벤트에서 아직 살아있는 플레이어가 있는 테이블 번호들
export function tables(ps, eventId) {
  const t = new Set(entries(ps).filter(([, p]) => p.eventId === eventId && !p.busted).map(([, p]) => p.table));
  return [...t].filter(Number.isFinite).sort((a, b) => a - b);
}

export function seated(ps, eventId, table) {
  return entries(ps).map(([, p]) => p)
    .filter(p => p.eventId === eventId && p.table === table && !p.busted)
    .sort((a, b) => a.seat - b.seat);
}

// 야자수 bust() 와 같은 필드만 바꾸는 다중 경로 update 페이로드. _sid 를 바꿔야 야자수 PC가 다시 읽는다.
export function bustUpdate(ps, pid, sid, now = new Date()) {
  const hit = entries(ps).find(([, p]) => p.id === pid);
  if (!hit || hit[1].busted) return null;
  const [k, p] = hit;
  return {
    [`ps/${k}/busted`]: true,
    [`ps/${k}/bustedTable`]: p.table,
    [`ps/${k}/bustedSeat`]: p.seat,
    [`ps/${k}/bustedAt`]: now.toISOString(),
    _sid: sid,
  };
}

// 한 손가락 제스처 판정: 밀면 reset, 짧게 찍으면 tap
export function gesture(dx, dy, dt) {
  const d = Math.hypot(dx, dy);
  if (d >= 60) return 'reset';
  if (d < 15 && dt < 500) return 'tap';
  return null;
}

import assert from 'node:assert/strict';
import { fmt, tables, seated, bustUpdate, gesture, entries } from './logic.js';

assert.equal(fmt(29990), '29.99');
assert.equal(fmt(5), '0.00');
assert.equal(fmt(-100), '0.00');
assert.equal(fmt(65000), '1:05.00');

const ps = [
  { id: 1, eventId: 1, table: 3, seat: 2, name: '가' },
  { id: 2, eventId: 1, table: 3, seat: 1, name: '나' },
  { id: 3, eventId: 1, table: 3, seat: 5, name: '다', busted: true },
  { id: 4, eventId: 2, table: 1, seat: 1, name: '라' },
  { id: 5, eventId: 1, table: 7, seat: 1, name: '마' },
];
assert.deepEqual(tables(ps, 1), [3, 7]);
assert.deepEqual(seated(ps, 1, 3).map(p => p.name), ['나', '가']);
// 파이어베이스가 객체 형태로 줄 때도 키 보존
const obj = { '0': ps[0], '4': ps[4] };
assert.deepEqual(entries(obj).map(([k]) => k), ['0', '4']);
assert.deepEqual(tables(obj, 1), [3, 7]);

const now = new Date('2026-11-15T10:00:00Z');
assert.deepEqual(bustUpdate(ps, 2, 'S', now), {
  'ps/1/busted': true, 'ps/1/bustedTable': 3, 'ps/1/bustedSeat': 1,
  'ps/1/bustedAt': '2026-11-15T10:00:00.000Z', _sid: 'S',
});
assert.equal(bustUpdate(ps, 3, 'S', now), null, '이미 아웃이면 null');
assert.equal(bustUpdate(ps, 99, 'S', now), null, '없는 사람이면 null');
assert.equal(bustUpdate(obj, 5, 'S', now)['ps/4/busted'], true, '객체 키 그대로 사용');

assert.equal(gesture(80, 0, 100), 'reset');
assert.equal(gesture(-70, 10, 800), 'reset');
assert.equal(gesture(3, 2, 120), 'tap');
assert.equal(gesture(3, 2, 900), null, '길게 누르면 무시');
assert.equal(gesture(30, 0, 100), null, '애매한 움직임 무시');
console.log('ok');

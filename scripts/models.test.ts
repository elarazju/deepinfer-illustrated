import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateDrafts, cacheReplay, timelineModel } from '../src/lib/models';

test('zero confidence allows zero verified drafts; unity accepts every candidate',()=>{
  const zero=evaluateDrafts([0,0,0,0,0],[1,1.1,1.2,1.3,1.4,1.5]);
  assert.equal(zero.best.k,0);
  const full=evaluateDrafts([1,1,1,1,1],[1,1.1,1.2,1.3,1.4,1.5]);
  assert.equal(full.best.k,5);assert.equal(full.best.expected,6);
});
test('cumulative acceptance and expected output include the base token',()=>{
  const result=evaluateDrafts([.5,.5],[1,1,1]);
  assert.deepEqual(result.rates,[.5,.25]);assert.equal(result.best.expected,1.75);
});
test('SWA missing rolls back one block without changing Block KV hit',()=>{
  assert.deepEqual(cacheReplay(1024,768,false,128,134),{cap:890,maxHit:768,hit:768,start:640,replay:128});
  assert.equal(cacheReplay(1024,768,true,128,134).start,768);
});
test('SWA clamps short inputs, excessive hits and partial blocks',()=>{
  for(let length=0;length<4200;length+=13){
    const r=cacheReplay(length,9999,false,128,134);
    assert(r.start>=0&&r.start<=r.hit&&r.hit<=r.cap);
    assert.equal(r.hit%128,0);assert(r.replay<=128);
  }
  assert.equal(cacheReplay(1024,767,false,128,134).hit,640);
});
test('timeline idle includes CPU bottleneck even in async mode',()=>{
  assert.equal(timelineModel(false,{cpuSchedule:2,forward:6,sample:2,post:2}).idle,1/3);
  assert.equal(timelineModel(true,{cpuSchedule:2,forward:6,sample:2,post:2}).idle,0);
  assert.equal(timelineModel(true,{cpuSchedule:10,forward:6,sample:2,post:6}).idle,.5);
});

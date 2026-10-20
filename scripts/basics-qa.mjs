import {chromium} from '@playwright/test';
const b=await chromium.launch({channel:'chrome'}); const c=await b.newContext({viewport:{width:375,height:812},reducedMotion:'reduce'});const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto('http://127.0.0.1:5173/?lang=zh');await p.locator('#basics').waitFor();
const initial=await p.locator('#autoregressive-player').innerText();await p.waitForTimeout(1500);if(initial!==await p.locator('#autoregressive-player').innerText())throw Error('Unexpected autoplay');
await p.locator('#autoregressive-player button').nth(1).focus();await p.keyboard.press('Enter');if(await p.locator('.generation-tokens .cached').count()!==3)throw Error('Cache stage incorrect');
const slider=p.locator('#kv-growth input').first();await slider.focus();await p.keyboard.press('End');if(await slider.inputValue()!=='32768')throw Error('Slider keyboard failed');
if(errors.length||await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error(errors.join(';')||'Overflow');
await p.locator('#basics-generation').screenshot({path:'research/screenshots/v2-basics-zh-mobile.png'});console.log('Basics keyboard, reduced-motion default, cache timing and overflow PASS');await b.close();

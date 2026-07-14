/* ============================================================
   Shared helpers
============================================================ */
function parseList(text){
  return text.split(/[\n,]/).map(s=>s.trim()).filter(Boolean);
}
function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
function esc(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function wsHeader(title, sub){
  return `
    <div class="ws-title">${esc(title)}</div>
    <div class="ws-sub">${esc(sub)}</div>
    <div class="ws-name-line">Name: <span class="blank"></span> Date: <span class="blank" style="width:100px"></span></div>
  `;
}
function practiceLine(guideText){
  return `
    <div class="practice-line">
      <span class="guide-text">${esc(guideText)}</span>
    </div>
  `;
}
function shell(controlsHTML, previewLabel){
  return `
    <div class="panel active">
      <div class="controls">${controlsHTML}</div>
      <div class="preview-wrap">
        <div class="preview-toolbar">
          <span class="name">${esc(previewLabel)}</span>
          <div>
            <button class="gen-btn print-btn" style="display:inline-block;width:auto;padding:8px 16px;margin:0" onclick="window.print()">🖨️ 列印</button>
          </div>
        </div>
        <div class="worksheet" id="preview"><div class="empty-state">填好左邊欄位，按「產生」即可預覽</div></div>
      </div>
    </div>
  `;
}

const practiceLineCSS = `
.practice-line{ position:relative; height:40px; margin-bottom:12px; }
.practice-line::before{ content:''; position:absolute; top:0; left:0; right:0; border-top:1px solid #d8cdb4; }
.practice-line::after{ content:''; position:absolute; bottom:8px; left:0; right:0; border-top:1.5px solid #a89b78; }
.practice-line .mid-line{ position:absolute; top:50%; left:0; right:0; border-top:1px dashed #e3d9bc; }
.practice-line .guide-text{ position:absolute; bottom:5px; left:2px; font-family:'Patrick Hand',cursive; font-size:26px;
  color:transparent; -webkit-text-stroke:1px #c9bfa3; letter-spacing:2px; line-height:1; }
`;
(function injectCSS(){
  const style = document.createElement('style');
  style.textContent = practiceLineCSS + `
    .word-card{ break-inside:avoid; margin-bottom:22px; }
    .word-card .label{ font-family:'Baloo 2',sans-serif; font-weight:700; font-size:16px; margin-bottom:6px; }
    .tracing-grid{ display:grid; gap:22px 28px; }
    .match-cols{ display:flex; gap:60px; margin-top:10px; }
    .match-col{ flex:1; list-style:none; padding:0; margin:0; }
    .match-col li{ display:flex; align-items:center; gap:8px; height:40px; font-size:20px; font-family:'Patrick Hand',cursive; }
    .match-col.left li{ justify-content:flex-start; }
    .match-col.right li{ justify-content:flex-end; }
    .dot{ width:10px; height:10px; border-radius:50%; background:var(--teal); flex:0 0 auto; }
    .circle-row{ display:flex; flex-wrap:wrap; gap:14px 18px; margin:10px 0 20px; }
    .circle-row span{ font-family:'Patrick Hand',cursive; font-size:22px; padding:2px 10px; border:2px solid transparent; border-radius:8px; }
    .wordbank{ background:var(--teal-light); border-radius:10px; padding:10px 14px; margin-bottom:18px; font-size:14px; }
    .wordbank b{ font-family:'Baloo 2',sans-serif; }
    .sentence-row{ font-size:17px; margin-bottom:14px; display:flex; align-items:baseline; gap:6px; }
    .sentence-row .blankline{ display:inline-block; min-width:110px; border-bottom:1.5px dashed #a89b78; height:20px; }
    table.wordsearch{ border-collapse:collapse; margin:10px 0; }
    table.wordsearch td{ width:26px; height:26px; text-align:center; font-family:'Courier New',monospace; font-weight:700;
      font-size:15px; border:1px solid #eee1c9; }
    .found-list{ display:flex; flex-wrap:wrap; gap:8px 16px; margin-top:14px; font-size:14px; }
    .found-list span{ background:var(--sun-light); padding:3px 10px; border-radius:999px; font-weight:700; }

    /* bingo */
    .bingo-cards{ display:flex; flex-wrap:wrap; gap:24px; }
    .bingo-card{ border:2px solid var(--ink); border-radius:6px; overflow:hidden; break-inside:avoid; }
    .bingo-card .bingo-title{ background:var(--teal); color:#fff; text-align:center; font-family:'Baloo 2',sans-serif;
      font-weight:800; letter-spacing:4px; padding:6px 0; font-size:15px; }
    .bingo-card table{ border-collapse:collapse; }
    .bingo-card td{ width:66px; height:56px; border:1px solid var(--ink); text-align:center; font-size:12px;
      padding:2px; font-family:'Noto Sans TC',sans-serif; vertical-align:middle; }
    .bingo-card td.free{ background:var(--sun-light); font-weight:700; font-family:'Baloo 2',sans-serif; }

    /* memory match */
    .memory-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
    .memory-card{ border:2px dashed #c9bfa3; border-radius:10px; height:90px; display:flex; align-items:center;
      justify-content:center; font-size:16px; font-family:'Baloo 2',sans-serif; font-weight:700; text-align:center;
      break-inside:avoid; }
    .memory-card.emoji-face{ font-size:40px; font-family:inherit; }

    /* dice net */
    .dice-net{ display:grid; grid-template-columns:repeat(4, 84px); grid-template-rows:repeat(3, 84px); gap:0; margin:20px 0; }
    .dice-face{ border:1.5px dashed #a89b78; display:flex; align-items:center; justify-content:center;
      flex-direction:column; font-size:13px; text-align:center; padding:4px; }
    .dice-face .emoji{ font-size:26px; }

    /* board game path */
    .board-row{ display:flex; }
    .board-row.reverse{ flex-direction:row-reverse; }
    .board-cell{ width:78px; height:78px; border:2px solid var(--ink); display:flex; flex-direction:column;
      align-items:center; justify-content:center; font-size:11px; text-align:center; margin:-1px; background:#fff; }
    .board-cell .num{ font-family:'Baloo 2',sans-serif; font-weight:800; font-size:11px; color:var(--coral); }
    .board-cell.start{ background:var(--teal-light); }
    .board-cell.finish{ background:var(--coral-light); }

    /* picture match / phonics choice rows */
    .choice-row{ display:flex; align-items:center; gap:18px; margin-bottom:20px; break-inside:avoid; }
    .choice-row .big-emoji{ font-size:44px; width:60px; text-align:center; flex:0 0 auto; }
    .choice-row .choices{ display:flex; gap:16px; }
    .choice-row .choices span{ font-family:'Patrick Hand',cursive; font-size:20px; border:2px solid var(--line);
      border-radius:8px; padding:4px 14px; }

    /* sorting worksheet */
    .sort-bank{ display:flex; flex-wrap:wrap; gap:10px 16px; background:var(--teal-light); border-radius:10px;
      padding:12px 16px; margin-bottom:20px; }
    .sort-bank span{ font-family:'Baloo 2',sans-serif; font-weight:700; font-size:14px; }
    .sort-cols{ display:flex; gap:24px; }
    .sort-col{ flex:1; border:2px solid var(--ink); border-radius:10px; min-height:220px; padding:10px; }
    .sort-col .cat-title{ font-family:'Baloo 2',sans-serif; font-weight:800; text-align:center; margin-bottom:10px;
      background:var(--sun-light); border-radius:6px; padding:6px; }

    /* coloring worksheet */
    .coloring-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
    .coloring-cell{ text-align:center; break-inside:avoid; }
    .coloring-cell .label{ font-family:'Baloo 2',sans-serif; font-weight:700; margin-top:6px; font-size:14px; }

    /* picture-picture matching (no reading required) */
    .picpic-cols{ display:flex; gap:80px; margin-top:14px; }
    .picpic-col{ list-style:none; padding:0; margin:0; }
    .picpic-col li{ display:flex; align-items:center; gap:10px; height:64px; font-size:40px; }
    .picpic-col.right li{ justify-content:flex-end; }

    /* counting worksheet */
    .counting-row{ display:flex; align-items:center; gap:22px; margin-bottom:24px; break-inside:avoid; }
    .counting-row .emoji-group{ font-size:30px; letter-spacing:4px; flex:1; }
    .counting-row .num-box{ width:56px; height:56px; border:2.5px solid var(--ink); border-radius:10px;
      display:flex; align-items:center; justify-content:center; font-family:'Baloo 2',sans-serif; font-size:14px; color:#ccc; flex:0 0 auto; }
    .counting-row .word-label{ font-family:'Baloo 2',sans-serif; font-weight:700; font-size:16px; flex:0 0 auto; min-width:90px; }

    /* prepositions scene */
    .prep-row{ display:flex; align-items:center; gap:30px; margin-bottom:24px; break-inside:avoid; }
    .prep-scene{ position:relative; width:110px; height:110px; flex:0 0 auto; }
    .prep-scene .box{ position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); font-size:52px; }
    .prep-scene .obj{ position:absolute; left:50%; font-size:32px; transform:translateX(-50%); }
    .prep-scene .obj.pos-in{ top:38%; font-size:22px; }
    .prep-scene .obj.pos-on{ top:-6px; }
    .prep-scene .obj.pos-under{ top:78%; }

    /* plural pairs */
    .plural-block{ margin-bottom:26px; break-inside:avoid; }
    .plural-block .divider-label{ font-family:'Baloo 2',sans-serif; font-weight:700; font-size:12px; color:var(--muted);
      margin:4px 0; }

    /* body parts diagram */
    .bodyparts-wrap{ display:flex; gap:40px; align-items:flex-start; }
    .bp-numlabel{ font-family:'Baloo 2',sans-serif; font-weight:800; font-size:12px; fill:#fff; }
    .bp-blanks{ font-size:14px; line-height:2.4; }
    .bp-blanks .blankline{ display:inline-block; min-width:110px; border-bottom:1.5px dashed #a89b78; height:18px; margin-left:6px; }

    @media print{
      .word-card, .sentence-row, table.wordsearch, .circle-row, .bingo-card, .memory-card, .board-row,
      .choice-row, .sort-cols, .coloring-cell, .picpic-cols, .counting-row, .prep-row, .plural-block,
      .bodyparts-wrap{ break-inside: avoid; }
    }
  `;
  document.head.appendChild(style);
})();

/* ============================================================
   Router
============================================================ */
function renderTab(name){
  const main = document.getElementById('main');
  main.innerHTML = TABS[name].html;
  TABS[name].init();
}

const TABS = {};

/* ============================================================
   2. 字母配對練習單 (Letter Matching)
============================================================ */
TABS.matching = {
  html: shell(`
    <h2>字母配對練習單</h2>
    <div class="desc">選擇配對模式，孩子練習畫線連連看</div>
    <label>配對模式</label>
    <div class="radio-row">
      <label><input type="radio" name="m-mode" value="case" checked> 大寫配小寫</label>
      <label><input type="radio" name="m-mode" value="word"> 字母配單字</label>
    </div>
    <label id="m-label">字母清單（大寫）</label>
    <textarea id="m-input" placeholder="A,B,C,D,E">A,B,C,D,E,F</textarea>
    <div class="hint" id="m-hint">大小寫小寫會自動產生對應</div>
    <button class="gen-btn" onclick="genMatching()">產生配對練習單</button>
  `, "字母配對練習單"),
  init(){
    document.querySelectorAll('input[name=m-mode]').forEach(r=>{
      r.addEventListener('change', ()=>{
        const mode = document.querySelector('input[name=m-mode]:checked').value;
        if(mode==='case'){
          document.getElementById('m-label').textContent = '字母清單（大寫）';
          document.getElementById('m-input').value = 'A,B,C,D,E,F';
          document.getElementById('m-hint').textContent = '會自動配對成對應的小寫字母';
        }else{
          document.getElementById('m-label').textContent = '單字清單（用第一個字母配對）';
          document.getElementById('m-input').value = 'Apple, Ball, Cat, Dog, Egg';
          document.getElementById('m-hint').textContent = '每個單字的第一個字母會出現在左欄，右欄是打散的單字';
        }
      });
    });
  }
};
function genMatching(){
  const mode = document.querySelector('input[name=m-mode]:checked').value;
  const raw = parseList(document.getElementById('m-input').value);
  if(!raw.length) return;
  let leftItems, rightItems;
  if(mode==='case'){
    const letters = raw.map(s=>s.toUpperCase());
    leftItems = shuffle(letters);
    rightItems = shuffle(letters.map(l=>l.toLowerCase()));
  }else{
    leftItems = shuffle(raw.map(w=>w[0].toUpperCase()));
    rightItems = shuffle(raw);
  }
  const leftLi = leftItems.map(t=>`<li><span class="dot"></span>${esc(t)}</li>`).join('');
  const rightLi = rightItems.map(t=>`<li>${esc(t)}<span class="dot"></span></li>`).join('');
  document.getElementById('preview').innerHTML = `
    ${wsHeader('字母配對練習單', 'Letter Matching — 畫線連連看')}
    <div class="match-cols">
      <ul class="match-col left">${leftLi}</ul>
      <ul class="match-col right">${rightLi}</ul>
    </div>
  `;
}

/* ============================================================
   3. Sight Words 練習單
============================================================ */
const FILLER_POOL = ['the','is','on','at','it','an','we','he','she','see','can','to','a','of','in','and','you','go','me','my'];
TABS.sight = {
  html: shell(`
    <h2>Sight Words 練習單</h2>
    <div class="desc">每行一個 sight word，會自動產生描寫行＋「圈出正確單字」練習</div>
    <label>Sight Word 清單</label>
    <textarea id="s-words">the
is
see
you</textarea>
    <button class="gen-btn" onclick="genSight()">產生 Sight Words 練習單</button>
  `, "Sight Words 練習單"),
  init(){}
};
function genSight(){
  const words = parseList(document.getElementById('s-words').value);
  if(!words.length) return;
  const blocks = words.map(word=>{
    const trace = practiceLine(word) + practiceLine(word);
    const distractPool = FILLER_POOL.filter(w=>w!==word.toLowerCase());
    let tokens = [];
    for(let i=0;i<8;i++) tokens.push(word);
    const distractCount = 8 - Math.floor(Math.random()*2) - 4; // ~4-5 real, rest distractors
    tokens = [];
    const realCount = 4;
    for(let i=0;i<realCount;i++) tokens.push(word);
    for(let i=0;i<8-realCount;i++) tokens.push(shuffle(distractPool)[0] || 'xx');
    tokens = shuffle(tokens);
    const circleRow = `<div class="circle-row">圈出「${esc(word)}」：${tokens.map(t=>`<span>${esc(t)}</span>`).join('')}</div>`;
    return `<div class="word-card"><div class="label">${esc(word)}</div>${trace}${circleRow}</div>`;
  }).join('');
  document.getElementById('preview').innerHTML = `
    ${wsHeader('Sight Words 練習單', 'Trace it, then circle the matching word')}
    ${blocks}
  `;
}

/* ============================================================
   13. 字首音練習 (Initial Sound Phonics)
============================================================ */
TABS.phonics = {
  html: shell(`
    <h2>字首音練習</h2>
    <div class="desc">格式：單字:emoji。看圖圈出正確的開頭字母（3 選 1）</div>
    <label>單字清單</label>
    <textarea id="ph-words">apple:🍎
banana:🍌
cat:🐱
dog:🐶
egg:🥚</textarea>
    <button class="gen-btn" onclick="genPhonics()">產生字首音練習單</button>
  `, "字首音練習"),
  init(){}
};
function genPhonics(){
  const raw = parseList(document.getElementById('ph-words').value);
  if(!raw.length) return;
  const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const rows = raw.map(r=>{
    const [word, icon] = r.split(':');
    const correct = word[0].toUpperCase();
    let distractors = new Set();
    while(distractors.size < 2){
      const letter = AZ[Math.floor(Math.random()*26)];
      if(letter !== correct) distractors.add(letter);
    }
    const choices = shuffle([correct, ...distractors]);
    return `<div class="choice-row">
      <div class="big-emoji">${esc(icon||'❓')}</div>
      <div class="choices">${choices.map(c=>`<span>${esc(c)}</span>`).join('')}</div>
    </div>`;
  }).join('');
  document.getElementById('preview').innerHTML = `
    ${wsHeader('字首音練習', 'Which letter does the picture start with?')}
    ${rows}
  `;
}

/* ============================================================
   11. 圖片單字配對 (Picture-Word Match, multiple choice)
============================================================ */
TABS.picmatch = {
  html: shell(`
    <h2>圖片單字配對</h2>
    <div class="desc">格式：單字:emoji，例如 apple:🍎。每題看圖圈出正確單字（3 選 1）</div>
    <label>單字清單</label>
    <textarea id="pm-words">apple:🍎
banana:🍌
cat:🐱
dog:🐶
fish:🐟</textarea>
    <button class="gen-btn" onclick="genPicMatch()">產生圖片配對練習單</button>
  `, "圖片單字配對"),
  init(){}
};
function genPicMatch(){
  const raw = parseList(document.getElementById('pm-words').value);
  if(raw.length < 3) {
    document.getElementById('preview').innerHTML = `<div class="empty-state">至少需要 3 個單字才能產生選項</div>`;
    return;
  }
  const items = raw.map(r=>{ const [w,i]=r.split(':'); return {word:w, icon:i||'❓'}; });
  const rows = items.map(item=>{
    const distractors = shuffle(items.filter(x=>x.word!==item.word)).slice(0,2).map(x=>x.word);
    const choices = shuffle([item.word, ...distractors]);
    return `<div class="choice-row">
      <div class="big-emoji">${esc(item.icon)}</div>
      <div class="choices">${choices.map(c=>`<span>${esc(c)}</span>`).join('')}</div>
    </div>`;
  }).join('');
  document.getElementById('preview').innerHTML = `
    ${wsHeader('圖片單字配對', 'Look at the picture, circle the correct word')}
    ${rows}
  `;
}

/* ============================================================
   5. 單字拼圖 Word Search
============================================================ */
TABS.wordsearch = {
  html: shell(`
    <h2>單字拼圖 Word Search</h2>
    <div class="desc">自動排版字母格，適合 5 歲孩子建議關閉斜線與反向</div>
    <label>單字清單</label>
    <textarea id="w-words">CAT
DOG
SUN
RED</textarea>
    <label>格子大小</label>
    <input type="number" id="w-size" value="10" min="6" max="16">
    <div class="radio-row">
      <label><input type="checkbox" id="w-diag"> 允許斜線</label>
      <label><input type="checkbox" id="w-back"> 允許反向</label>
    </div>
    <button class="gen-btn" onclick="genWordSearch()">產生單字拼圖</button>
  `, "單字拼圖 Word Search"),
  init(){}
};
function buildWordSearch(words, size, allowDiag, allowBack){
  const grid = Array.from({length:size},()=>Array(size).fill(null));
  let dirs = [[0,1],[1,0]];
  if(allowDiag) dirs.push([1,1],[-1,1]);
  if(allowBack) dirs = dirs.concat(dirs.map(([dr,dc])=>[-dr,-dc]));
  const placed = [];
  const sorted = words.slice().sort((a,b)=>b.length-a.length);
  for(const wordRaw of sorted){
    const word = wordRaw.toUpperCase().replace(/[^A-Z]/g,'');
    if(!word) continue;
    let ok = false;
    for(let attempt=0; attempt<300 && !ok; attempt++){
      const [dr,dc] = dirs[Math.floor(Math.random()*dirs.length)];
      const r0 = Math.floor(Math.random()*size);
      const c0 = Math.floor(Math.random()*size);
      const rEnd = r0 + dr*(word.length-1);
      const cEnd = c0 + dc*(word.length-1);
      if(rEnd<0||rEnd>=size||cEnd<0||cEnd>=size) continue;
      let fits = true;
      for(let i=0;i<word.length;i++){
        const r=r0+dr*i, c=c0+dc*i;
        const cell = grid[r][c];
        if(cell!==null && cell!==word[i]){ fits=false; break; }
      }
      if(!fits) continue;
      for(let i=0;i<word.length;i++){
        const r=r0+dr*i, c=c0+dc*i;
        grid[r][c]=word[i];
      }
      placed.push(word);
      ok = true;
    }
  }
  const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for(let r=0;r<size;r++) for(let c=0;c<size;c++){
    if(grid[r][c]===null) grid[r][c] = AZ[Math.floor(Math.random()*26)];
  }
  return { grid, placed };
}
function genWordSearch(){
  const words = parseList(document.getElementById('w-words').value);
  const size = Math.max(6, Math.min(16, parseInt(document.getElementById('w-size').value)||10));
  const diag = document.getElementById('w-diag').checked;
  const back = document.getElementById('w-back').checked;
  if(!words.length) return;
  const { grid, placed } = buildWordSearch(words, size, diag, back);
  const table = `<table class="wordsearch">${grid.map(row=>
    `<tr>${row.map(ch=>`<td>${ch}</td>`).join('')}</tr>`
  ).join('')}</table>`;
  const foundList = `<div class="found-list">${placed.map(w=>`<span>${esc(w)}</span>`).join('')}</div>`;
  const skipped = words.length - placed.length;
  document.getElementById('preview').innerHTML = `
    ${wsHeader('單字拼圖 Word Search', '找出下面所有的單字')}
    ${table}
    ${foundList}
    ${skipped>0 ? `<div class="hint" style="margin-top:8px;color:#c0392b">有 ${skipped} 個單字格子太小放不下，建議把格子大小調大一點</div>` : ''}
  `;
}

/* ============================================================
   4. 句型填空練習單 (Sentence Pattern)
============================================================ */
TABS.sentence = {
  html: shell(`
    <h2>句型填空練習單</h2>
    <div class="desc">用 ___ 代表空格，例如：I like ___.</div>
    <label>句型</label>
    <input type="text" id="p-pattern" value="I like ___.">
    <label>單字庫（填空用）</label>
    <textarea id="p-words">apple
banana
cats
dogs</textarea>
    <button class="gen-btn" onclick="genSentence()">產生句型練習單</button>
  `, "句型填空練習單"),
  init(){}
};
function genSentence(){
  const pattern = document.getElementById('p-pattern').value.trim() || 'I like ___.';
  const words = parseList(document.getElementById('p-words').value);
  if(!words.length) return;
  const bank = `<div class="wordbank"><b>Word Bank：</b> ${words.map(esc).join(' · ')}</div>`;
  const parts = pattern.split('___');
  const rows = words.map((w,i)=>{
    return `<div class="sentence-row">${i+1}. ${esc(parts[0]||'')}<span class="blankline"></span>${esc(parts[1]||'')}</div>`;
  }).join('');
  document.getElementById('preview').innerHTML = `
    ${wsHeader('句型填空練習單', 'Sentence Pattern Practice')}
    ${bank}
    ${rows}
  `;
}


/* ============================================================
   17. 介係詞練習 (Prepositions: in / on / under)
============================================================ */
TABS.preposition = {
  html: shell(`
    <h2>介係詞練習</h2>
    <div class="desc">格式：物品:emoji，每題會隨機決定 in/on/under 其中一個，畫出情境圖，孩子三選一圈出正確介係詞</div>
    <label>物品清單</label>
    <textarea id="pr-words">ball:⚽
cat:🐱
book:📖
apple:🍎</textarea>
    <button class="gen-btn" onclick="genPreposition()">產生介係詞練習單</button>
  `, "介係詞練習"),
  init(){}
};
function genPreposition(){
  const raw = parseList(document.getElementById('pr-words').value);
  if(!raw.length) return;
  const preps = ['in','on','under'];
  const rows = raw.map(r=>{
    const parts = r.split(':');
    const obj = parts[1] || '❓';
    const correct = preps[Math.floor(Math.random()*preps.length)];
    const choices = shuffle(preps);
    return `<div class="prep-row">
      <div class="prep-scene">
        <div class="box">📦</div>
        <div class="obj pos-${correct}">${esc(obj)}</div>
      </div>
      <div class="choices" style="display:flex;gap:16px;">
        ${choices.map(c=>`<span style="font-family:'Patrick Hand',cursive;font-size:20px;border:2px solid var(--line);border-radius:8px;padding:4px 14px;">${c}</span>`).join('')}
      </div>
    </div>`;
  }).join('');
  document.getElementById('preview').innerHTML = `
    ${wsHeader('介係詞練習', 'Where is it? Circle in / on / under')}
    ${rows}
  `;
}

/* ============================================================
   18. 單複數練習 (Singular / Plural)
============================================================ */
TABS.plural = {
  html: shell(`
    <h2>單複數練習</h2>
    <div class="desc">格式：單字:emoji，自動產生單數（1個）與複數（+s，3個）對照，孩子描寫兩種型態</div>
    <label>單字清單</label>
    <textarea id="pl-words">cat:🐱
dog:🐶
book:📖
apple:🍎</textarea>
    <button class="gen-btn" onclick="genPlural()">產生單複數練習單</button>
  `, "單複數練習"),
  init(){}
};
function genPlural(){
  const raw = parseList(document.getElementById('pl-words').value);
  if(!raw.length) return;
  const blocks = raw.map(r=>{
    const parts = r.split(':');
    const word = parts[0], icon = parts[1] || '❓';
    const pluralWord = word.endsWith('s') ? word + 'es' : word + 's';
    return `<div class="plural-block">
      <div class="counting-row">
        <div class="emoji-group">${esc(icon)}</div>
        <div class="num-box">1</div>
        <div class="word-label">${esc(word)}</div>
      </div>
      <div class="counting-row">
        <div class="emoji-group">${esc(icon.repeat(3))}</div>
        <div class="num-box">3</div>
        <div class="word-label">${esc(pluralWord)}</div>
      </div>
    </div>`;
  }).join('');
  document.getElementById('preview').innerHTML = `
    ${wsHeader('單複數練習', 'One vs. many — trace both forms')}
    ${blocks}
  `;
}

/* ============================================================
   19. 身體部位標示 (Body Parts Labeling)
============================================================ */
TABS.bodyparts = {
  html: shell(`
    <h2>身體部位標示</h2>
    <div class="desc">人體圖上有編號，孩子從單字庫裡找出正確的身體部位名稱填在對應編號後面</div>
    <button class="gen-btn" onclick="genBodyParts()">產生身體部位練習單</button>
  `, "身體部位標示"),
  init(){}
};
const BODY_PARTS = [
  {label:'Head', x:100, y:30},
  {label:'Arm', x:55, y:90},
  {label:'Hand', x:30, y:135},
  {label:'Tummy', x:100, y:100},
  {label:'Leg', x:85, y:170},
  {label:'Foot', x:85, y:225}
];
function genBodyParts(){
  const shuffledWords = shuffle(BODY_PARTS.map(p=>p.label));
  const dots = BODY_PARTS.map((p,i)=>`
    <circle cx="${p.x}" cy="${p.y}" r="11" fill="#E8734A" stroke="#fff" stroke-width="2"/>
    <text x="${p.x}" y="${p.y+4}" text-anchor="middle" class="bp-numlabel">${i+1}</text>
  `).join('');
  const blanks = BODY_PARTS.map((p,i)=>`${i+1}. <span class="blankline"></span>`).join('&nbsp;&nbsp;&nbsp;');
  document.getElementById('preview').innerHTML = `
    ${wsHeader('身體部位標示', 'Use the word bank to label each numbered part')}
    <div class="bodyparts-wrap">
      <svg width="200" height="260" viewBox="0 0 200 260">
        <circle cx="100" cy="30" r="24" fill="none" stroke="#33312C" stroke-width="2.5"/>
        <line x1="100" y1="54" x2="100" y2="150" stroke="#33312C" stroke-width="2.5"/>
        <line x1="100" y1="70" x2="55" y2="110" stroke="#33312C" stroke-width="2.5"/>
        <line x1="55" y1="110" x2="30" y2="135" stroke="#33312C" stroke-width="2.5"/>
        <line x1="100" y1="70" x2="145" y2="110" stroke="#33312C" stroke-width="2.5"/>
        <line x1="145" y1="110" x2="170" y2="135" stroke="#33312C" stroke-width="2.5"/>
        <line x1="100" y1="150" x2="85" y2="220" stroke="#33312C" stroke-width="2.5"/>
        <line x1="85" y1="220" x2="85" y2="230" stroke="#33312C" stroke-width="2.5"/>
        <line x1="100" y1="150" x2="115" y2="220" stroke="#33312C" stroke-width="2.5"/>
        <line x1="115" y1="220" x2="115" y2="230" stroke="#33312C" stroke-width="2.5"/>
        ${dots}
      </svg>
      <div>
        <div class="wordbank"><b>Word Bank：</b> ${shuffledWords.map(esc).join(' · ')}</div>
        <div class="bp-blanks">${blanks}</div>
      </div>
    </div>
  `;
}

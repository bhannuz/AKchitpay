// ═══════════════════════════════════════════════════════════
// AK Chit Funds — UI & NAVIGATION
// Edit only this file when changing tab switching, toasts, modals, search, updateUI
// ═══════════════════════════════════════════════════════════

function switchTab(t){
    document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(i=>i.classList.remove('active'));
    document.querySelectorAll('.tab-nav-item-desktop').forEach(i=>i.classList.remove('active'));
    
    document.getElementById(t+'Tab').classList.add('active');
    const mobNavId = 'nav'+t.charAt(0).toUpperCase()+t.slice(1);
    const mobNav = document.getElementById(mobNavId);
    if(mobNav) mobNav.classList.add('active');
    
    const desktopNavId = 'nav'+t.charAt(0).toUpperCase()+t.slice(1)+'Desktop';
    const desktopNav = document.getElementById(desktopNavId);
    if(desktopNav) desktopNav.classList.add('active');
    
    updateUI();
}

async function migrateData(){
    const ms=await getCollection('members');
    for(let m of ms){if(m.groupId&&!m.groupIds){await db.collection('members').doc(m.id).update({groupIds:[m.groupId],groupId:firebase.firestore.FieldValue.delete()});}}
    updateUI();
}

async function updateUI(){
    const m=await getCollection('members');const g=await getCollection('groups');const p=await getCollection('payments');
    ALL_MEMBERS=m;
    
    // Set member-mode class based on user role
    if(CURRENT_USER && CURRENT_USER.role==='member'){
        document.body.classList.add('member-mode');
        const myPays=p.filter(x=>x.memberId===CURRENT_USER.memberId);
        const myGroups=new Set(myPays.map(x=>x.groupId));
        document.getElementById('memberCount').innerText='—';
        document.getElementById('groupCount').innerText=myGroups.size;
        const today=new Date().toISOString().split('T')[0];
        document.getElementById('todayColl').innerText=fmtAmt(myPays.filter(x=>x.date===today).reduce((s,x)=>s+(parseFloat(x.paid)||0),0));
        return;
    } else {
        document.body.classList.remove('member-mode');
    }
    document.getElementById('memberCount').innerText=m.length;
    document.getElementById('groupCount').innerText=g.length;
    const today=new Date().toISOString().split('T')[0];
    document.getElementById('todayColl').innerText=fmtAmt(p.filter(x=>x.date===today).reduce((s,x)=>s+(parseFloat(x.paid)||0),0));
    if(document.getElementById('groupsTab').classList.contains('active'))renderGroupsTab();
}

function filterSearch(inputId,listId,hiddenId){
    const query=document.getElementById(inputId).value.toLowerCase();
    const list=document.getElementById(listId);
    list.innerHTML='';if(!query){list.style.display='none';return;}
    const filtered=ALL_MEMBERS.filter(m=>m.name.toLowerCase().includes(query));
    if(filtered.length>0){
        list.style.display='block';
        filtered.forEach(m=>{
            const div=document.createElement('div');div.className='suggestion-item';div.innerText=m.name;
            div.onclick=()=>{
                document.getElementById(inputId).value=m.name;
                document.getElementById(hiddenId).value=m.id;
                list.style.display='none';
                if(hiddenId==='summaryView') loadMemberLedger();
                if(hiddenId==='pMember') linkGroupForPayment();
                // Auto-add for QR member search
                if(hiddenId==='qr_member_id') qrAddMember();
            };
            list.appendChild(div);});
    }else{list.style.display='none';}
}

// ── Member Sub-tab Switcher ───────────────────────────────────────────────────
function switchMemberSubTab(tab) {
    const panels = { dash:'mDashPanel', pay:'mPayPanel', stats:'mStatsPanel', qr:'mQrPanel' };
    const btns   = { dash:'mSubDash', pay:'mSubPay', stats:'mSubStats', qr:'mSubQr' };
    const colors = { dash:'rgba(243,156,18,0.85)', pay:'rgba(99,102,241,0.85)', stats:'rgba(16,185,129,0.85)', qr:'rgba(59,130,246,0.85)' };
    const fgcols = { dash:'black', pay:'white', stats:'white', qr:'white' };

    Object.keys(panels).forEach(k => {
        const p = document.getElementById(panels[k]);
        const b = document.getElementById(btns[k]);
        if(p) p.style.display = k === tab ? '' : 'none';
        if(b){
            b.style.background = k === tab ? colors[k] : 'var(--card-bg)';
            b.style.color      = k === tab ? fgcols[k] : 'var(--text-dim)';
            b.style.border     = k === tab ? 'none' : '1px solid var(--border)';
        }
    });
    if(tab === 'stats') renderMemberStats();
    if(tab === 'pay')   loadMemberLedger();
    if(tab === 'qr')    renderMemberQrPanel();
}

async function renderMemberStats() {
    if(!CURRENT_USER || CURRENT_USER.role !== 'member') return;
    const mid = CURRENT_USER.memberId;
    const ps  = await getCollection('payments');
    const gs  = await getCollection('groups');
    const myPays = ps.filter(p => p.memberId === mid);
    const today  = new Date().toISOString().split('T')[0];
    const thisMonth = today.slice(0,7);

    const totalPaid    = myPays.reduce((s,p) => s + (parseFloat(p.paid)||0), 0);
    const totalBal     = myPays.reduce((s,p) => s + (parseFloat(p.balance)||0), 0);
    const monthPaid    = myPays.filter(p=>(p.date||'').startsWith(thisMonth)).reduce((s,p)=>s+(parseFloat(p.paid)||0),0);
    const chitPicks    = myPays.filter(p=>p.chitPicked==='Yes').length;
    const myGroupIds   = [...new Set(myPays.map(p=>p.groupId))];

    // Summary table
    const sumEl = document.getElementById('mStatsSummary');
    if(sumEl) sumEl.innerHTML = [
        ['💰 Total Paid',    fmtAmt(totalPaid),  '#f39c12'],
        ['📋 Balance Due',   fmtAmt(totalBal),   totalBal>0?'#f87171':'#34d399'],
        ['📅 This Month',    fmtAmt(monthPaid),  '#60a5fa'],
        ['📝 Payments Made', myPays.length,       '#a5b4fc'],
        ['🎯 Chits Picked',  chitPicks,           '#34d399'],
        ['📂 My Groups',     myGroupIds.length,   '#f59e0b'],
    ].map(([lbl,val,col],i) => `<tr style="border-bottom:${i<5?'1px solid rgba(255,255,255,0.05)':'none'};">
        <td style="padding:9px 14px;font-size:0.78rem;color:var(--text-dim);">${lbl}</td>
        <td style="padding:9px 14px;font-size:0.88rem;font-weight:800;color:${col};text-align:right;">${val}</td>
    </tr>`).join('');

    // Group-wise breakdown
    const grpEl = document.getElementById('mStatsGroups');
    if(grpEl){
        const rows = myGroupIds.map(gid => {
            const g    = gs.find(x=>x.id===gid);
            const gPay = myPays.filter(p=>p.groupId===gid);
            const paid = gPay.reduce((s,p)=>s+(parseFloat(p.paid)||0),0);
            const bal  = gPay.reduce((s,p)=>s+(parseFloat(p.balance)||0),0);
            const dur  = g?.duration || g?.months || 13;
            const paidMonths = new Set();
            gPay.forEach(p=>{ if(Array.isArray(p.monthSlots)) p.monthSlots.forEach(s=>paidMonths.add(s)); else if(p.monthSlot!=null) paidMonths.add(p.monthSlot); });
            const pct = Math.min(100, Math.round((paidMonths.size / dur) * 100));
            return `<tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                <td style="padding:8px 14px;font-size:0.75rem;color:white;font-weight:700;">${g?.name||gid}</td>
                <td style="padding:8px 14px;font-size:0.75rem;color:#34d399;text-align:right;white-space:nowrap;">${fmtAmt(paid)}</td>
                <td style="padding:8px 14px;font-size:0.75rem;color:${bal>0?'#f87171':'#34d399'};text-align:right;white-space:nowrap;">${fmtAmt(bal)}</td>
                <td style="padding:8px 14px;">
                    <div style="display:flex;align-items:center;gap:5px;">
                        <div style="flex:1;background:rgba(255,255,255,0.07);border-radius:3px;height:5px;overflow:hidden;">
                            <div style="background:linear-gradient(90deg,#6366f1,#34d399);width:${pct}%;height:100%;border-radius:3px;"></div>
                        </div>
                        <span style="font-size:0.65rem;color:var(--text-dim);white-space:nowrap;">${pct}%</span>
                    </div>
                </td>
            </tr>`;
        });
        grpEl.innerHTML = rows.length ? rows.join('') : '<tr><td colspan="4" style="padding:12px;text-align:center;color:var(--text-dim);font-size:0.75rem;">No data</td></tr>';
    }

    // Monthly history (last 12)
    const monEl = document.getElementById('mStatsMonthly');
    if(monEl){
        const sorted = [...myPays].sort((a,b)=>(b.date||'').localeCompare(a.date||'')).slice(0,20);
        monEl.innerHTML = sorted.length ? sorted.map((p,i) => `<tr style="border-bottom:${i<sorted.length-1?'1px solid rgba(255,255,255,0.04)':'none'};">
            <td style="padding:7px 14px;font-size:0.75rem;color:var(--text-dim);">${p.date||'—'}</td>
            <td style="padding:7px 14px;font-size:0.75rem;font-weight:800;color:#34d399;text-align:right;">${fmtAmt(parseFloat(p.paid)||0)}</td>
            <td style="padding:7px 14px;font-size:0.75rem;color:var(--text-dim);">${p.paidBy||'—'}</td>
        </tr>`).join('')
        : '<tr><td colspan="3" style="padding:12px;text-align:center;color:var(--text-dim);font-size:0.75rem;">No payments yet</td></tr>';
    }
}

async function renderMemberQrPanel() {
    const el = document.getElementById('mQrPanel');
    if(!el) return;
    if(!CURRENT_USER) return;
    // Load the member's pending QR codes from the shared QR collection
    const mid  = CURRENT_USER.memberId;
    const pays = await getCollection('payments');
    const gs   = await getCollection('groups');
    const myPays = pays.filter(p=>p.memberId===mid);
    const myGids = [...new Set(myPays.map(p=>p.groupId))];

    // Show pending balance per group with a "Pay via UPI" link if UPI is configured
    const cards = myGids.map(gid => {
        const g   = gs.find(x=>x.id===gid);
        const gPays = myPays.filter(p=>p.groupId===gid);
        const bal = gPays.reduce((s,p)=>s+(parseFloat(p.balance)||0),0);
        const upi = g?.upiId || '';
        const amt = g?.chitAmount || g?.amount || 0;
        const payUrl = upi ? `upi://pay?pa=${upi}&am=${amt}&tn=${encodeURIComponent((g?.name||'Chit'))}` : '';
        return `<div style="background:var(--card-bg);border:1px solid var(--border);border-radius:12px;padding:12px 14px;margin-bottom:8px;">
            <div style="font-weight:800;font-size:0.85rem;color:white;margin-bottom:4px;">${g?.name||gid}</div>
            <div style="font-size:0.75rem;color:var(--text-dim);margin-bottom:10px;">Balance: <span style="color:${bal>0?'#f87171':'#34d399'};font-weight:800;">${fmtAmt(bal)}</span></div>
            ${payUrl ? `<a href="${payUrl}" style="display:block;text-align:center;background:linear-gradient(135deg,#25D366,#128C7E);color:white;border-radius:10px;padding:10px;font-size:0.82rem;font-weight:800;text-decoration:none;">💳 Pay ₹${Number(amt).toLocaleString('en-IN')} via UPI</a>` : '<div style="font-size:0.72rem;color:var(--text-dim);text-align:center;">UPI not configured for this group</div>'}
        </div>`;
    });
    el.innerHTML = cards.length ? cards.join('') : '<div style="text-align:center;padding:30px;color:var(--text-dim);font-size:0.82rem;">No groups found</div>';
}

// ── Member Sub-tab Switcher ───────────────────────────────────────────────────
function switchMemberSubTab(tab) {
    // Panels: dash = homeTab content, stats = mStatsPanel
    const homeTab   = document.getElementById('homeTab');
    const statsPanel= document.getElementById('mStatsPanel');
    const btnDash   = document.getElementById('mSubDash');
    const btnStats  = document.getElementById('mSubStats');

    if(tab === 'dash'){
        if(homeTab)    homeTab.style.display    = '';
        if(statsPanel) statsPanel.style.display = 'none';
        if(btnDash){ btnDash.style.background='rgba(243,156,18,0.85)'; btnDash.style.color='black'; btnDash.style.border='none'; }
        if(btnStats){ btnStats.style.background='var(--card-bg)'; btnStats.style.color='var(--text-dim)'; btnStats.style.border='1px solid var(--border)'; }
    } else {
        if(homeTab)    homeTab.style.display    = 'none';
        if(statsPanel) statsPanel.style.display = '';
        if(btnStats){ btnStats.style.background='rgba(99,102,241,0.85)'; btnStats.style.color='white'; btnStats.style.border='none'; }
        if(btnDash){ btnDash.style.background='var(--card-bg)'; btnDash.style.color='var(--text-dim)'; btnDash.style.border='1px solid var(--border)'; }
        renderMemberStats();
    }
}

async function renderMemberStats(){
    if(!CURRENT_USER || CURRENT_USER.role !== 'member') return;
    const mid  = CURRENT_USER.memberId;
    const ps   = await getCollection('payments');
    const gs   = await getCollection('groups');
    const myPays = ps.filter(p => p.memberId === mid);
    const today  = new Date().toISOString().split('T')[0];
    const thisMonth = today.slice(0,7);

    const totalPaid  = myPays.reduce((s,p)=>s+(parseFloat(p.paid)||0),0);
    const totalBal   = myPays.reduce((s,p)=>s+(parseFloat(p.balance)||0),0);
    const monthPaid  = myPays.filter(p=>(p.date||'').startsWith(thisMonth)).reduce((s,p)=>s+(parseFloat(p.paid)||0),0);
    const chitPicks  = myPays.filter(p=>p.chitPicked==='Yes').length;
    const myGids     = [...new Set(myPays.map(p=>p.groupId))];

    // Summary
    const sumEl = document.getElementById('mStatsSummary');
    if(sumEl) sumEl.innerHTML = [
        ['💰 Total Paid',   fmtAmt(totalPaid),  '#f39c12'],
        ['📋 Balance Due',  fmtAmt(totalBal),   totalBal>0?'#f87171':'#34d399'],
        ['📅 This Month',   fmtAmt(monthPaid),  '#60a5fa'],
        ['📝 Payments',     myPays.length,       '#a5b4fc'],
        ['🎯 Chits Picked', chitPicks,           '#34d399'],
        ['📂 Groups',       myGids.length,       '#f59e0b'],
    ].map(([lbl,val,col],i)=>`<tr style="border-bottom:${i<5?'1px solid rgba(255,255,255,0.05)':'none'};">
        <td style="padding:8px 12px;font-size:0.78rem;color:var(--text-dim);">${lbl}</td>
        <td style="padding:8px 12px;font-size:0.85rem;font-weight:800;color:${col};text-align:right;">${val}</td>
    </tr>`).join('');

    // Group-wise
    const grpEl = document.getElementById('mStatsGroups');
    if(grpEl){
        grpEl.innerHTML = myGids.length ? myGids.map(gid=>{
            const g    = gs.find(x=>x.id===gid);
            const gPay = myPays.filter(p=>p.groupId===gid);
            const paid = gPay.reduce((s,p)=>s+(parseFloat(p.paid)||0),0);
            const bal  = gPay.reduce((s,p)=>s+(parseFloat(p.balance)||0),0);
            const dur  = parseInt(g?.duration||g?.months||13);
            const paidM= new Set();
            gPay.forEach(p=>{ if(Array.isArray(p.monthSlots)) p.monthSlots.forEach(s=>paidM.add(s)); else if(p.monthSlot!=null) paidM.add(p.monthSlot); });
            const pct  = Math.min(100,Math.round((paidM.size/dur)*100));
            return `<tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                <td style="padding:7px 12px;font-size:0.75rem;color:white;font-weight:700;max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${g?.name||gid}</td>
                <td style="padding:7px 12px;font-size:0.75rem;color:#34d399;text-align:right;white-space:nowrap;">${fmtAmt(paid)}</td>
                <td style="padding:7px 12px;font-size:0.75rem;color:${bal>0?'#f87171':'#34d399'};text-align:right;white-space:nowrap;">${fmtAmt(bal)}</td>
                <td style="padding:7px 12px;">
                    <div style="display:flex;align-items:center;gap:4px;">
                        <div style="flex:1;background:rgba(255,255,255,0.07);border-radius:3px;height:5px;overflow:hidden;min-width:30px;">
                            <div style="background:linear-gradient(90deg,#6366f1,#34d399);width:${pct}%;height:100%;border-radius:3px;"></div>
                        </div>
                        <span style="font-size:0.6rem;color:var(--text-dim);white-space:nowrap;">${pct}%</span>
                    </div>
                </td>
            </tr>`;
        }).join('') : '<tr><td colspan="4" style="padding:12px;text-align:center;color:var(--text-dim);font-size:0.75rem;">No data</td></tr>';
    }

    // Recent payments
    const monEl = document.getElementById('mStatsMonthly');
    if(monEl){
        const sorted = [...myPays].sort((a,b)=>(b.date||'').localeCompare(a.date||'')).slice(0,15);
        monEl.innerHTML = sorted.length ? sorted.map((p,i)=>{
            const g = gs.find(x=>x.id===p.groupId);
            return `<tr style="border-bottom:${i<sorted.length-1?'1px solid rgba(255,255,255,0.04)':'none'};">
                <td style="padding:6px 12px;font-size:0.72rem;color:var(--text-dim);white-space:nowrap;">${p.date||'—'}</td>
                <td style="padding:6px 12px;font-size:0.72rem;font-weight:800;color:#34d399;text-align:right;white-space:nowrap;">${fmtAmt(parseFloat(p.paid)||0)}</td>
                <td style="padding:6px 12px;font-size:0.72rem;color:var(--text-dim);">${p.paidBy||'—'}</td>
                <td style="padding:6px 12px;font-size:0.72rem;color:var(--text-dim);max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${g?.name||'—'}</td>
            </tr>`;
        }).join('') : '<tr><td colspan="4" style="padding:12px;text-align:center;color:var(--text-dim);font-size:0.75rem;">No payments yet</td></tr>';
    }
}

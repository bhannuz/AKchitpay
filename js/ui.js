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
const _mSubCfg = {
    dash:  { btn:'mSubDash',  panel:'mDashPanel',  color:'rgba(243,156,18,0.85)', fg:'black'  },
    pay:   { btn:'mSubPay',   panel:'mPayPanel',   color:'rgba(99,102,241,0.85)', fg:'white'  },
    stats: { btn:'mSubStats', panel:'mStatsPanel', color:'rgba(16,185,129,0.85)', fg:'white'  },
    qr:    { btn:'mSubQr',    panel:'mQrPanel',    color:'rgba(59,130,246,0.85)', fg:'white'  },
};

function switchMemberSubTab(tab) {
    // homeTab is the dash panel
    const homeTab = document.getElementById('homeTab');
    Object.keys(_mSubCfg).forEach(k => {
        const cfg = _mSubCfg[k];
        const panel = k === 'dash' ? homeTab : document.getElementById(cfg.panel);
        const btn   = document.getElementById(cfg.btn);
        const active = k === tab;
        if(panel) panel.style.display = active ? '' : 'none';
        if(btn){
            btn.style.background = active ? cfg.color : 'var(--card-bg)';
            btn.style.color      = active ? cfg.fg    : 'var(--text-dim)';
            btn.style.border     = active ? 'none'    : '1px solid var(--border)';
        }
    });
    if(tab === 'stats') renderMemberStats();
    if(tab === 'pay')   { document.getElementById('memberLedgerArea') && loadMemberLedger(); }
    if(tab === 'qr')    renderMemberQrPanel();
}

// ── Member Statistics (interactive) ──────────────────────────────────────────
async function renderMemberStats(filterGid, filterMonth) {
    if(!CURRENT_USER || CURRENT_USER.role !== 'member') return;
    const mid  = CURRENT_USER.memberId;
    const ps   = await getCollection('payments');
    const gs   = await getCollection('groups');
    const myPaysAll = ps.filter(p => p.memberId === mid);
    const myGids    = [...new Set(myPaysAll.map(p=>p.groupId))];

    // Populate group filter
    const gSel = document.getElementById('mStatsGroupFilter');
    if(gSel && gSel.options.length <= 1){
        myGids.forEach(gid=>{
            const g = gs.find(x=>x.id===gid);
            const o = document.createElement('option');
            o.value = gid; o.text = g?.name||gid;
            gSel.appendChild(o);
        });
    }

    // Populate month filter
    const mSel = document.getElementById('mStatsMonthFilter');
    if(mSel && mSel.options.length <= 1){
        const months = [...new Set(myPaysAll.map(p=>(p.date||'').slice(0,7)).filter(Boolean))].sort().reverse();
        months.forEach(m=>{
            const o = document.createElement('option');
            o.value = m; o.text = m;
            mSel.appendChild(o);
        });
    }

    // Read current filters
    const activeGid   = filterGid   ?? (gSel?.value||'');
    const activeMonth = filterMonth ?? (mSel?.value||'');

    let myPays = myPaysAll;
    if(activeGid)   myPays = myPays.filter(p=>p.groupId===activeGid);
    if(activeMonth) myPays = myPays.filter(p=>(p.date||'').startsWith(activeMonth));

    const today     = new Date().toISOString().split('T')[0];
    const thisMonth = today.slice(0,7);
    const totalPaid = myPays.reduce((s,p)=>s+(parseFloat(p.paid)||0),0);
    const totalBal  = myPays.reduce((s,p)=>s+(parseFloat(p.balance)||0),0);
    const chitPicks = myPays.filter(p=>p.chitPicked==='Yes').length;

    // Summary
    const sumEl = document.getElementById('mStatsSummary');
    if(sumEl) sumEl.innerHTML = [
        ['💰 Total Paid',   fmtAmt(totalPaid), '#f39c12'],
        ['📋 Balance Due',  fmtAmt(totalBal),  totalBal>0?'#f87171':'#34d399'],
        ['📝 Payments',     myPays.length,      '#a5b4fc'],
        ['🎯 Chits Picked', chitPicks,          '#34d399'],
        ['📂 Groups',       activeGid ? 1 : myGids.length, '#f59e0b'],
    ].map(([lbl,val,col],i)=>`<tr style="border-bottom:${i<4?'1px solid rgba(255,255,255,0.05)':'none'};">
        <td style="padding:8px 12px;font-size:0.78rem;color:var(--text-dim);">${lbl}</td>
        <td style="padding:8px 12px;font-size:0.85rem;font-weight:800;color:${col};text-align:right;">${val}</td>
    </tr>`).join('');

    // Group-wise (show all groups, highlight filtered)
    const grpEl = document.getElementById('mStatsGroups');
    if(grpEl){
        const rows = myGids.map(gid=>{
            const g    = gs.find(x=>x.id===gid);
            const gPay = myPaysAll.filter(p=>p.groupId===gid);
            const paid = gPay.reduce((s,p)=>s+(parseFloat(p.paid)||0),0);
            const bal  = gPay.reduce((s,p)=>s+(parseFloat(p.balance)||0),0);
            const dur  = parseInt(g?.duration||g?.months||13);
            const paidM= new Set();
            gPay.forEach(p=>{ if(Array.isArray(p.monthSlots)) p.monthSlots.forEach(s=>paidM.add(s)); else if(p.monthSlot!=null) paidM.add(p.monthSlot); });
            const pct  = Math.min(100,Math.round((paidM.size/dur)*100));
            const highlighted = activeGid===gid;
            return `<tr style="border-bottom:1px solid rgba(255,255,255,0.04);cursor:pointer;${highlighted?'background:rgba(99,102,241,0.08);':''}" onclick="document.getElementById('mStatsGroupFilter').value='${gid}';renderMemberStats();">
                <td style="padding:7px 12px;font-size:0.75rem;color:${highlighted?'#a5b4fc':'white'};font-weight:700;max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${g?.name||gid}</td>
                <td style="padding:7px 12px;font-size:0.75rem;color:#34d399;text-align:right;white-space:nowrap;">${fmtAmt(paid)}</td>
                <td style="padding:7px 12px;font-size:0.75rem;color:${bal>0?'#f87171':'#34d399'};text-align:right;white-space:nowrap;">${fmtAmt(bal)}</td>
                <td style="padding:7px 12px;">
                    <div style="display:flex;align-items:center;gap:4px;">
                        <div style="flex:1;background:rgba(255,255,255,0.07);border-radius:3px;height:5px;overflow:hidden;min-width:28px;">
                            <div style="background:linear-gradient(90deg,#6366f1,#34d399);width:${pct}%;height:100%;border-radius:3px;"></div>
                        </div>
                        <span style="font-size:0.6rem;color:var(--text-dim);">${paidM.size}/${dur}</span>
                    </div>
                </td>
            </tr>`;
        });
        grpEl.innerHTML = rows.length ? rows.join('') : '<tr><td colspan="4" style="padding:12px;text-align:center;color:var(--text-dim);font-size:0.75rem;">No data</td></tr>';
    }

    // Recent payments table
    const monEl = document.getElementById('mStatsMonthly');
    if(monEl){
        const sorted = [...myPays].sort((a,b)=>(b.date||'').localeCompare(a.date||''));
        monEl.innerHTML = sorted.length ? sorted.map((p,i)=>{
            const g = gs.find(x=>x.id===p.groupId);
            return `<tr style="border-bottom:${i<sorted.length-1?'1px solid rgba(255,255,255,0.04)':'none'};">
                <td style="padding:6px 12px;font-size:0.72rem;color:var(--text-dim);white-space:nowrap;">${p.date||'—'}</td>
                <td style="padding:6px 12px;font-size:0.72rem;font-weight:800;color:#34d399;text-align:right;white-space:nowrap;">${fmtAmt(parseFloat(p.paid)||0)}</td>
                <td style="padding:6px 12px;font-size:0.72rem;color:var(--text-dim);">${p.paidBy||'—'}</td>
                <td style="padding:6px 12px;font-size:0.72rem;color:var(--text-dim);max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${g?.name||'—'}</td>
                <td style="padding:6px 12px;font-size:0.65rem;color:${p.chitPicked==='Yes'?'#34d399':'var(--text-dim)'};">${p.chitPicked==='Yes'?'✅':''}</td>
            </tr>`;
        }).join('') : '<tr><td colspan="5" style="padding:12px;text-align:center;color:var(--text-dim);font-size:0.75rem;">No payments</td></tr>';
    }
}

async function renderMemberQrPanel() {
    const el = document.getElementById('mQrPanel');
    if(!el || !CURRENT_USER) return;
    el.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text-dim);font-size:0.8rem;">Loading…</div>';
    const mid  = CURRENT_USER.memberId;
    const pays = await getCollection('payments');
    const gs   = await getCollection('groups');
    const myGids = [...new Set(pays.filter(p=>p.memberId===mid).map(p=>p.groupId))];
    if(!myGids.length){ el.innerHTML='<div style="text-align:center;padding:30px;color:var(--text-dim);">No groups found</div>'; return; }
    el.innerHTML = myGids.map(gid=>{
        const g   = gs.find(x=>x.id===gid);
        const gPay= pays.filter(p=>p.memberId===mid&&p.groupId===gid);
        const bal = gPay.reduce((s,p)=>s+(parseFloat(p.balance)||0),0);
        const upi = g?.upiId||'';
        const amt = g?.chitAmount||g?.amount||0;
        const payUrl = upi?`upi://pay?pa=${upi}&am=${amt}&tn=${encodeURIComponent(g?.name||'Chit')}` : '';
        return `<div style="background:var(--card-bg);border:1px solid var(--border);border-radius:12px;padding:12px 14px;margin-bottom:8px;">
            <div style="font-weight:800;font-size:0.85rem;color:white;margin-bottom:4px;">${g?.name||gid}</div>
            <div style="font-size:0.75rem;color:var(--text-dim);margin-bottom:10px;">Balance: <span style="color:${bal>0?'#f87171':'#34d399'};font-weight:800;">${fmtAmt(bal)}</span></div>
            ${payUrl?`<a href="${payUrl}" style="display:block;text-align:center;background:linear-gradient(135deg,#25D366,#128C7E);color:white;border-radius:10px;padding:10px;font-size:0.82rem;font-weight:800;text-decoration:none;">💳 Pay ₹${Number(amt).toLocaleString('en-IN')} via UPI</a>`:'<div style="font-size:0.72rem;color:var(--text-dim);text-align:center;">UPI not configured for this group</div>'}
        </div>`;
    }).join('');
}

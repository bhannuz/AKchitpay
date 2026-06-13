// ═══════════════════════════════════════════════════════════
// AK Chit Funds — DATA BACKUP / RESTORE
// Edit only this file when changing backup or restore logic
// ═══════════════════════════════════════════════════════════

async function exportFullBackup(){
    if(!isAdmin()){showToast('🚫 Access denied',false);return;}
    const d={m:await getCollection('members'),g:await getCollection('groups'),p:await getCollection('payments')};
    const a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([JSON.stringify(d,null,2)],{type:'application/json'}));
    a.download=`AK_Chit_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('✅ Backup downloaded!');
}

async function exportToExcel(){
    if(!isAdmin()){showToast('🚫 Access denied',false);return;}
    showToast('⏳ Generating Excel…',true);
    const members=await getCollection('members');
    const groups=await getCollection('groups');
    const payments=await getCollection('payments');
    const wb=XLSX.utils.book_new();
    const today=new Date().toISOString().split('T')[0];

    const mRows=members.map(m=>({'Name':m.name||'','Phone':m.phone||'','Groups':((m.groupIds||[]).map(gid=>{const g=groups.find(x=>x.id===gid);return g?g.name:gid;})).join(', ')}));
    const wsM=XLSX.utils.json_to_sheet(mRows.length?mRows:[{'Name':'','Phone':'','Groups':''}]);
    wsM['!cols']=[{wch:28},{wch:16},{wch:40}];
    XLSX.utils.book_append_sheet(wb,wsM,'Members');

    const gRows=groups.map(g=>{
        const gPays=payments.filter(p=>p.groupId===g.id);
        const gMs=members.filter(m=>m.groupIds&&m.groupIds.includes(g.id));
        return{'Group Name':g.name||'','Duration (Months)':g.duration||g.gDuration||'','Start Date':g.startDate||g.gStart||'','Due Day':g.dueDay||'','Members':gMs.length,'Total Collected':gPays.reduce((s,p)=>s+(parseFloat(p.paid)||0),0),'Total Balance':gPays.reduce((s,p)=>s+(parseFloat(p.balance)||0),0),'Chits Picked':gPays.filter(p=>p.chitPicked==='Yes').length};
    });
    const wsG=XLSX.utils.json_to_sheet(gRows.length?gRows:[{}]);
    wsG['!cols']=[{wch:24},{wch:18},{wch:14},{wch:10},{wch:10},{wch:18},{wch:14},{wch:14}];
    XLSX.utils.book_append_sheet(wb,wsG,'Groups');

    const pRows=payments.map(p=>{
        const m=members.find(x=>x.id===p.memberId);
        const g=groups.find(x=>x.id===p.groupId);
        return{'Date':p.date||'','Member':m?m.name:'Unknown','Phone':m?m.phone||'':'','Group':g?g.name:'Unknown','Chit/Month':parseFloat(p.chit)||0,'Months':p.numMonths||1,'Total Paid':parseFloat(p.paid)||0,'Balance':parseFloat(p.balance)||0,'Mode':p.paidBy||'','Chit Picked':p.chitPicked||'No','Chit Picked Value':p.chitPickedBy||''};
    }).sort((a,b)=>a['Date'].localeCompare(b['Date']));
    const wsP=XLSX.utils.json_to_sheet(pRows.length?pRows:[{}]);
    wsP['!cols']=[{wch:12},{wch:24},{wch:14},{wch:20},{wch:12},{wch:8},{wch:12},{wch:12},{wch:14},{wch:12},{wch:18}];
    XLSX.utils.book_append_sheet(wb,wsP,'All Payments');

    const sumRows=[];
    members.forEach(m=>{
        (m.groupIds||[]).forEach(gid=>{
            const g=groups.find(x=>x.id===gid);
            const mp=payments.filter(p=>p.memberId===m.id&&p.groupId===gid);
            const pickedPay=mp.find(p=>p.chitPicked==='Yes');
            sumRows.push({'Member':m.name||'','Phone':m.phone||'','Group':g?g.name:'','Months Paid':mp.reduce((s,p)=>s+(p.numMonths||1),0),'Total Paid':mp.reduce((s,p)=>s+(parseFloat(p.paid)||0),0),'Total Balance':mp.reduce((s,p)=>s+(parseFloat(p.balance)||0),0),'Chit Picked':pickedPay?'Yes':'No','Chit Picked Value':pickedPay?pickedPay.chitPickedBy||'':'','Last Payment':mp.length?mp.sort((a,b)=>b.date.localeCompare(a.date))[0].date:''});
        });
    });
    const wsS=XLSX.utils.json_to_sheet(sumRows.length?sumRows:[{}]);
    wsS['!cols']=[{wch:24},{wch:14},{wch:20},{wch:12},{wch:12},{wch:14},{wch:12},{wch:18},{wch:14}];
    XLSX.utils.book_append_sheet(wb,wsS,'Member Summary');

    XLSX.writeFile(wb,`AKChitFunds_Export_${today}.xlsx`);
    showToast('✅ Excel exported!');
}

function confirmRestore(){
    if(!isAdmin()){showToast('🚫 Access denied',false);return;}
    const file=document.getElementById('restoreFile').files[0];
    if(!file)return showToast('❌ Select a backup file first',false);
    showConfirm('🔄','Restore All Data?','This will overwrite ALL existing data.',()=>executeRestore());
}

async function executeRestore(){
    const file=document.getElementById('restoreFile').files[0];if(!file)return;
    showToast('⏳ Restoring…',true);
    const reader=new FileReader();
    reader.onload=async(e)=>{
        try{
            const data=JSON.parse(e.target.result);
            const delCol=async(col)=>{const s=await db.collection(col).get();const batch=db.batch();s.docs.forEach(d=>batch.delete(d.ref));if(s.docs.length)await batch.commit();};
            await delCol('members');await delCol('groups');await delCol('payments');
            let count=0;
            if(data.m)for(let x of data.m){const {id,...rest}=x;await db.collection('members').doc(id).set(rest);count++;}
            if(data.g)for(let x of data.g){const {id,...rest}=x;await db.collection('groups').doc(id).set(rest);count++;}
            if(data.p)for(let x of data.p){const {id,...rest}=x;await db.collection('payments').doc(id).set(rest);count++;}
            bustCache('members');bustCache('groups');bustCache('payments');
            showToast('✅ Restored '+count+' records!');
            updateUI();
        }catch(err){console.error(err);showToast('❌ Invalid backup file',false);}
    };
    reader.readAsText(file);
}

// ── Backup Sub-tab Switcher ──────────────────────────────────
function switchBackupSubTab(tab) {
    const statsBtn   = document.getElementById('bkSubStats');
    const backupBtn  = document.getElementById('bkSubBackup');
    const statsPanel = document.getElementById('bkStatsPanel');
    const backupPanel= document.getElementById('bkBackupPanel');

    if (tab === 'stats') {
        statsPanel.style.display  = '';
        backupPanel.style.display = 'none';
        statsBtn.style.background  = 'rgba(99,102,241,0.85)';
        statsBtn.style.color       = 'white';
        statsBtn.style.border      = 'none';
        backupBtn.style.background = 'var(--card-bg)';
        backupBtn.style.color      = 'var(--text-dim)';
        backupBtn.style.border     = '1px solid var(--border)';
        loadStatistics();
    } else {
        statsPanel.style.display  = 'none';
        backupPanel.style.display = '';
        backupBtn.style.background = 'rgba(99,102,241,0.85)';
        backupBtn.style.color      = 'white';
        backupBtn.style.border     = 'none';
        statsBtn.style.background  = 'var(--card-bg)';
        statsBtn.style.color       = 'var(--text-dim)';
        statsBtn.style.border      = '1px solid var(--border)';
    }
}

// ── Statistics Loader ───────────────────────────────────────

// ── Statistics Loader ───────────────────────────────────────
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
}

function clearStatFilters() {
    ['sfActiveGroup','sfActiveMode','sfActiveChit','sfActiveMember'].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = '';
    });
    // reset dropdowns
    ['statGroupFilter','statModeFilter','statChitFilter'].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
    const mf = document.getElementById('statMemberFilter'); if(mf) mf.value='';
    // reset type selector & hide sub
    const ft = document.getElementById('statFilterType'); if(ft) ft.value='';
    const sw = document.getElementById('statSubFilterWrap'); if(sw) sw.style.display='none';
    renderStatFilterChips();
    loadStatistics();
}

function onStatFilterTypeChange() {
    const type = document.getElementById('statFilterType').value;
    const wrap = document.getElementById('statSubFilterWrap');
    ['sfGroup','sfMode','sfChit','sfMember'].forEach(id => {
        const el = document.getElementById(id); if(el) el.style.display='none';
    });
    if (!type) { wrap.style.display='none'; return; }
    wrap.style.display = '';
    const map = { group:'sfGroup', mode:'sfMode', chit:'sfChit', member:'sfMember' };
    const panel = document.getElementById(map[type]);
    if (panel) panel.style.display = '';
}

function applyStatSubFilter() {
    const type = (document.getElementById('statFilterType')||{}).value;
    const vals = {
        group:  (document.getElementById('statGroupFilter') ||{}).value||'',
        mode:   (document.getElementById('statModeFilter')  ||{}).value||'',
        chit:   (document.getElementById('statChitFilter')  ||{}).value||'',
        member: (document.getElementById('statMemberFilter')||{}).value||''
    };
    const keys = { group:'sfActiveGroup', mode:'sfActiveMode', chit:'sfActiveChit', member:'sfActiveMember' };
    if (type && keys[type]) {
        const el = document.getElementById(keys[type]);
        if (el) el.value = vals[type];
    }
    renderStatFilterChips();
    loadStatistics();
}

function renderStatFilterChips() {
    const container = document.getElementById('statActiveFilters');
    if (!container) return;
    const defs = [
        { key:'sfActiveGroup',  label:'Group',   icon:'🏦' },
        { key:'sfActiveMode',   label:'Mode',    icon:'💳' },
        { key:'sfActiveChit',   label:'Chit',    icon:'✅' },
        { key:'sfActiveMember', label:'Member',  icon:'👤' },
    ];
    container.innerHTML = '';
    defs.forEach(d => {
        const el = document.getElementById(d.key);
        const val = el ? el.value.trim() : '';
        if (!val) return;
        const chip = document.createElement('div');
        chip.style.cssText = 'display:inline-flex;align-items:center;gap:5px;background:rgba(99,102,241,0.18);border:1px solid rgba(99,102,241,0.4);border-radius:20px;padding:4px 10px;font-size:0.72rem;font-weight:700;color:#a5b4fc;';
        chip.innerHTML = `${d.icon} ${d.label}: <span style="color:white;">${val}</span> <span onclick="removeStatFilter('${d.key}')" style="cursor:pointer;color:#ef4444;margin-left:2px;font-size:0.8rem;">✕</span>`;
        container.appendChild(chip);
    });
}

function removeStatFilter(key) {
    const el = document.getElementById(key);
    if (el) el.value = '';
    // also reset the corresponding dropdown/input
    const map = { sfActiveGroup:'statGroupFilter', sfActiveMode:'statModeFilter', sfActiveChit:'statChitFilter', sfActiveMember:'statMemberFilter' };
    const inputEl = document.getElementById(map[key]);
    if (inputEl) inputEl.value = '';
    renderStatFilterChips();
    loadStatistics();
}

async function loadStatistics() {
    if (!isAdmin()) return;

    const members  = await getCollection('members');
    const groups   = await getCollection('groups');
    const allPays  = await getCollection('payments');

    // ── Populate filter dropdowns (first load only)
    const grpSel  = document.getElementById('statGroupFilter');
    const modeSel = document.getElementById('statModeFilter');
    if (grpSel && grpSel.options.length <= 1) {
        groups.forEach(g => { const o = document.createElement('option'); o.value = g.id; o.text = g.name || g.id; grpSel.appendChild(o); });
    }
    if (modeSel && modeSel.options.length <= 1) {
        const modes = [...new Set(allPays.map(p => p.paidBy).filter(Boolean))].sort();
        modes.forEach(m => { const o = document.createElement('option'); o.value = m; o.text = m; modeSel.appendChild(o); });
    }

    // ── Read filters from hidden state holders
    const grpFilter  = (document.getElementById('sfActiveGroup')  || {}).value || '';
    const modeFilter = (document.getElementById('sfActiveMode')   || {}).value || '';
    const chitFilter = (document.getElementById('sfActiveChit')   || {}).value || '';
    const memFilter  = ((document.getElementById('sfActiveMember')|| {}).value || '').toLowerCase().trim();

    const filteredMemberIds = memFilter
        ? members.filter(m => m.name.toLowerCase().includes(memFilter)).map(m => m.id)
        : null;

    // ── Apply filters
    const payments = allPays.filter(p => {
        if (grpFilter  && p.groupId !== grpFilter)   return false;
        if (modeFilter && (p.paidBy || '') !== modeFilter) return false;
        if (chitFilter && (p.chitPicked || 'No') !== chitFilter) return false;
        if (filteredMemberIds && !filteredMemberIds.includes(p.memberId)) return false;
        return true;
    });

    // ── Summary cards
    const totalCollected = payments.reduce((s, p) => s + (parseFloat(p.paid) || 0), 0);
    const totalBalance   = payments.reduce((s, p) => s + (parseFloat(p.balance) || 0), 0);
    const chitsPicked    = payments.filter(p => p.chitPicked === 'Yes').length;
    const totalMembers   = new Set(payments.map(p => p.memberId)).size || members.length;
    const pendingChits   = payments.filter(p => (p.chitPicked || 'No') === 'No').length;
    document.getElementById('statTotalCollected').innerText = fmtAmt(totalCollected);
    document.getElementById('statTotalBalance').innerText   = fmtAmt(totalBalance);
    document.getElementById('statTotalPayments').innerText  = payments.length;
    document.getElementById('statChitsPicked').innerText    = chitsPicked;
    document.getElementById('statTotalMembers').innerText   = totalMembers;
    document.getElementById('statPendingChits').innerText   = pendingChits;

    // ── Monthly bar chart (last 6 months in filtered data)
    const monthMap = {};
    payments.forEach(p => {
        if (!p.date) return;
        const ym = p.date.substring(0, 7);
        monthMap[ym] = (monthMap[ym] || 0) + (parseFloat(p.paid) || 0);
    });
    const sortedMonths = Object.keys(monthMap).sort().slice(-6);
    const monthAmounts = sortedMonths.map(m => monthMap[m] || 0);
    const maxAmt = Math.max(...monthAmounts, 1);
    const chartEl = document.getElementById('statMonthlyChart');
    chartEl.innerHTML = '';
    const mNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    if (!sortedMonths.length) {
        chartEl.innerHTML = '<tr><td colspan="3" style="padding:14px;text-align:center;color:var(--text-dim);font-size:0.78rem;">No data for selected filters</td></tr>';
    } else {
        sortedMonths.forEach((ym, i) => {
            const amt = monthAmounts[i];
            const pct = Math.max(2, Math.round((amt / maxAmt) * 100));
            const [y, m] = ym.split('-');
            const label = mNames[parseInt(m, 10) - 1] + ' ' + y;
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid rgba(255,255,255,0.04)';
            tr.innerHTML = `
                <td style="padding:7px 14px;font-size:0.78rem;color:var(--text-dim);">${label}</td>
                <td style="padding:7px 14px;font-size:0.82rem;font-weight:800;color:#6366f1;text-align:right;">${fmtAmt(amt)}</td>
                <td style="padding:7px 14px;">
                    <div style="background:rgba(255,255,255,0.07);border-radius:3px;height:6px;overflow:hidden;">
                        <div style="background:linear-gradient(90deg,#6366f1,#a5b4fc);width:${pct}%;height:100%;border-radius:3px;"></div>
                    </div>
                </td>`;
            chartEl.appendChild(tr);
        });
    }

    // ── Group-wise breakdown
    const groupEl = document.getElementById('statGroupList');
    groupEl.innerHTML = '';
    const groupTotals = groups.map(g => {
        const gPays = payments.filter(p => p.groupId === g.id);
        const collected = gPays.reduce((s, p) => s + (parseFloat(p.paid) || 0), 0);
        const balance   = gPays.reduce((s, p) => s + (parseFloat(p.balance) || 0), 0);
        const mCount    = members.filter(m => m.groupIds && m.groupIds.includes(g.id)).length;
        return { name: g.name || g.id, collected, balance, mCount };
    }).filter(g => g.collected > 0).sort((a, b) => b.collected - a.collected);
    const maxG = Math.max(...groupTotals.map(x => x.collected), 1);
    groupTotals.forEach((g, i) => {
        const pct = Math.max(2, Math.round((g.collected / maxG) * 100));
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid rgba(255,255,255,0.04)';
        tr.innerHTML = `
            <td style="padding:7px 14px;font-size:0.78rem;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:120px;">${g.name}</td>
            <td style="padding:7px 14px;font-size:0.82rem;font-weight:800;color:#10b981;text-align:right;white-space:nowrap;">${fmtAmt(g.collected)}</td>
            <td style="padding:7px 14px;">
                <div style="background:rgba(255,255,255,0.07);border-radius:3px;height:6px;overflow:hidden;">
                    <div style="background:linear-gradient(90deg,#6366f1,#10b981);width:${pct}%;height:100%;border-radius:3px;"></div>
                </div>
            </td>`;
        groupEl.appendChild(tr);
    });
    if (!groupTotals.length) groupEl.innerHTML = '<tr><td colspan="3" style="padding:14px;text-align:center;color:var(--text-dim);font-size:0.78rem;">No data</td></tr>';

    // ── Payment mode chips
    const modeMap = {};
    payments.forEach(p => { const mode = p.paidBy || 'Unknown'; modeMap[mode] = (modeMap[mode] || 0) + (parseFloat(p.paid) || 0); });
    const modeColors = ['#6366f1','#10b981','#f39c12','#ef4444','#a5b4fc','#34d399'];
    const modeTotal  = Object.values(modeMap).reduce((s, v) => s + v, 0) || 1;
    const pieEl = document.getElementById('statPayModePie');
    pieEl.innerHTML = '';
    Object.entries(modeMap).sort((a, b) => b[1] - a[1]).forEach(([mode, amt], i) => {
        const pct   = Math.round((amt / modeTotal) * 100);
        const color = modeColors[i % modeColors.length];
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid rgba(255,255,255,0.04)';
        tr.innerHTML = `
            <td style="padding:7px 14px;font-size:0.78rem;color:var(--text-dim);">${mode}</td>
            <td style="padding:7px 14px;font-size:0.82rem;font-weight:800;text-align:right;color:${color};">${fmtAmt(amt)}</td>
            <td style="padding:7px 14px;font-size:0.75rem;font-weight:700;text-align:right;color:var(--text-dim);">${pct}%</td>`;
        pieEl.appendChild(tr);
    });
    if (!Object.keys(modeMap).length) pieEl.innerHTML = '<tr><td colspan="3" style="padding:14px;text-align:center;color:var(--text-dim);font-size:0.78rem;">No data</td></tr>';

    // ── Top members
    const memberTotals = members.map(m => {
        const mp  = payments.filter(p => p.memberId === m.id);
        const amt = mp.reduce((s, p) => s + (parseFloat(p.paid) || 0), 0);
        return { name: m.name, amt };
    }).filter(x => x.amt > 0).sort((a, b) => b.amt - a.amt).slice(0, 5);
    const topEl = document.getElementById('statTopMembers');
    topEl.innerHTML = '';
    const maxM = Math.max(...memberTotals.map(x => x.amt), 1);
    const medals = ['🥇','🥈','🥉','4️⃣','5️⃣'];
    memberTotals.forEach((m, i) => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid rgba(255,255,255,0.04)';
        tr.innerHTML = `
            <td style="padding:7px 14px;font-size:0.78rem;color:var(--text-primary);font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:130px;">${medals[i]} ${m.name}</td>
            <td style="padding:7px 14px;font-size:0.82rem;font-weight:800;color:#f39c12;text-align:right;white-space:nowrap;">${fmtAmt(m.amt)}</td>`;
        topEl.appendChild(tr);
    });
    if (!memberTotals.length) topEl.innerHTML = '<tr><td colspan="2" style="padding:14px;text-align:center;color:var(--text-dim);font-size:0.78rem;">No data</td></tr>';
}

// Stubs so other files don't error
function loadEmailConfigToForm(){}
function updateBackupStatusUI(){}
function checkAndShowBackupReminder(){}

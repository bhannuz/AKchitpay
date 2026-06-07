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
async function loadStatistics() {
    if (!isAdmin()) return;

    const members  = await getCollection('members');
    const groups   = await getCollection('groups');
    const payments = await getCollection('payments');

    // ── Summary cards
    const totalCollected = payments.reduce((s, p) => s + (parseFloat(p.paid) || 0), 0);
    const totalBalance   = payments.reduce((s, p) => s + (parseFloat(p.balance) || 0), 0);
    const chitsPicked    = payments.filter(p => p.chitPicked === 'Yes').length;

    document.getElementById('statTotalCollected').innerText = fmtAmt(totalCollected);
    document.getElementById('statTotalBalance').innerText   = fmtAmt(totalBalance);
    document.getElementById('statTotalPayments').innerText  = payments.length;
    document.getElementById('statChitsPicked').innerText    = chitsPicked;

    // ── Monthly collections (last 6 months)
    const monthMap = {};
    payments.forEach(p => {
        if (!p.date) return;
        const ym = p.date.substring(0, 7); // "YYYY-MM"
        monthMap[ym] = (monthMap[ym] || 0) + (parseFloat(p.paid) || 0);
    });
    const sortedMonths = Object.keys(monthMap).sort().slice(-6);
    const monthAmounts = sortedMonths.map(m => monthMap[m] || 0);
    const maxAmt = Math.max(...monthAmounts, 1);

    const chartEl  = document.getElementById('statMonthlyChart');
    const labelsEl = document.getElementById('statMonthlyLabels');
    chartEl.innerHTML  = '';
    labelsEl.innerHTML = '';
    const mNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    sortedMonths.forEach((ym, i) => {
        const amt     = monthAmounts[i];
        const pct     = Math.max(4, Math.round((amt / maxAmt) * 100));
        const [y, m]  = ym.split('-');
        const label   = mNames[parseInt(m, 10) - 1] + ' ' + y.slice(2);

        const bar = document.createElement('div');
        bar.style.cssText = `flex:1;background:rgba(99,102,241,0.75);border-radius:6px 6px 0 0;height:${pct}%;min-height:4px;position:relative;cursor:default;transition:opacity .2s;`;
        bar.title = label + ': ' + fmtAmt(amt);
        bar.onmouseenter = () => bar.style.opacity = '0.75';
        bar.onmouseleave = () => bar.style.opacity = '1';
        chartEl.appendChild(bar);

        const lbl = document.createElement('div');
        lbl.style.cssText = 'flex:1;text-align:center;font-size:0.55rem;color:var(--text-dim);white-space:nowrap;overflow:hidden;';
        lbl.innerText = label;
        labelsEl.appendChild(lbl);
    });

    // ── Group-wise breakdown
    const groupEl = document.getElementById('statGroupList');
    groupEl.innerHTML = '';
    const groupTotals = groups.map(g => {
        const gPays = payments.filter(p => p.groupId === g.id);
        const collected = gPays.reduce((s, p) => s + (parseFloat(p.paid) || 0), 0);
        const balance   = gPays.reduce((s, p) => s + (parseFloat(p.balance) || 0), 0);
        const mCount    = (members.filter(m => m.groupIds && m.groupIds.includes(g.id))).length;
        return { name: g.name || g.id, collected, balance, mCount };
    }).sort((a, b) => b.collected - a.collected);

    const maxG = Math.max(...groupTotals.map(x => x.collected), 1);
    groupTotals.forEach(g => {
        const pct = Math.max(2, Math.round((g.collected / maxG) * 100));
        const row = document.createElement('div');
        row.innerHTML = `
            <div style="display:flex;justify-content:space-between;font-size:0.78rem;font-weight:700;margin-bottom:4px;">
                <span style="color:var(--text-primary);">${g.name}</span>
                <span style="color:#10b981;">${fmtAmt(g.collected)}</span>
            </div>
            <div style="background:rgba(255,255,255,0.07);border-radius:4px;height:6px;overflow:hidden;margin-bottom:2px;">
                <div style="background:linear-gradient(90deg,#6366f1,#10b981);width:${pct}%;height:100%;border-radius:4px;"></div>
            </div>
            <div style="font-size:0.65rem;color:var(--text-dim);">${g.mCount} member${g.mCount!==1?'s':''} · Balance ${fmtAmt(g.balance)}</div>`;
        groupEl.appendChild(row);
    });
    if (!groupTotals.length) groupEl.innerHTML = '<div style="color:var(--text-dim);font-size:0.8rem;text-align:center;">No group data</div>';

    // ── Payment mode breakdown
    const modeMap = {};
    payments.forEach(p => {
        const mode = p.paidBy || 'Unknown';
        modeMap[mode] = (modeMap[mode] || 0) + (parseFloat(p.paid) || 0);
    });
    const modeColors = ['#6366f1','#10b981','#f39c12','#ef4444','#a5b4fc','#34d399'];
    const modeTotal  = Object.values(modeMap).reduce((s, v) => s + v, 0) || 1;
    const pieEl = document.getElementById('statPayModePie');
    pieEl.innerHTML = '';
    Object.entries(modeMap).sort((a, b) => b[1] - a[1]).forEach(([mode, amt], i) => {
        const pct  = Math.round((amt / modeTotal) * 100);
        const color = modeColors[i % modeColors.length];
        const chip = document.createElement('div');
        chip.style.cssText = `background:rgba(${hexToRgb(color)},0.15);border:1px solid ${color}44;border-radius:10px;padding:6px 12px;font-size:0.72rem;font-weight:700;`;
        chip.innerHTML = `<span style="color:${color};">${mode}</span> <span style="color:var(--text-dim);">${pct}% · ${fmtAmt(amt)}</span>`;
        pieEl.appendChild(chip);
    });
    if (!Object.keys(modeMap).length) pieEl.innerHTML = '<div style="color:var(--text-dim);font-size:0.8rem;">No payment data</div>';

    // ── Top 5 members by total paid
    const memberTotals = members.map(m => {
        const mp  = payments.filter(p => p.memberId === m.id);
        const amt = mp.reduce((s, p) => s + (parseFloat(p.paid) || 0), 0);
        return { name: m.name, amt };
    }).filter(x => x.amt > 0).sort((a, b) => b.amt - a.amt).slice(0, 5);

    const topEl = document.getElementById('statTopMembers');
    topEl.innerHTML = '';
    const maxM = Math.max(...memberTotals.map(x => x.amt), 1);
    memberTotals.forEach((m, i) => {
        const pct    = Math.max(2, Math.round((m.amt / maxM) * 100));
        const medals = ['🥇','🥈','🥉','4️⃣','5️⃣'];
        const row = document.createElement('div');
        row.innerHTML = `
            <div style="display:flex;justify-content:space-between;font-size:0.78rem;margin-bottom:3px;">
                <span style="color:var(--text-primary);font-weight:700;">${medals[i]} ${m.name}</span>
                <span style="color:#f39c12;font-weight:800;">${fmtAmt(m.amt)}</span>
            </div>
            <div style="background:rgba(255,255,255,0.07);border-radius:4px;height:5px;overflow:hidden;">
                <div style="background:linear-gradient(90deg,#f39c12,#f59e0b);width:${pct}%;height:100%;border-radius:4px;"></div>
            </div>`;
        topEl.appendChild(row);
    });
    if (!memberTotals.length) topEl.innerHTML = '<div style="color:var(--text-dim);font-size:0.8rem;text-align:center;">No member payment data</div>';
}

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
}

// Stubs so other files don't error
function loadEmailConfigToForm(){}
function updateBackupStatusUI(){}
function checkAndShowBackupReminder(){}

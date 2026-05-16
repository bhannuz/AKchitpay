// ═══════════════════════════════════════════════════════════
// AK Chit Funds — PAYMENTS
// ═══════════════════════════════════════════════════════════

// MULTI-MONTH HELPERS
// ══════════════════════════════════════════
async function getPaidSlots(memberId, groupId, group){
    const allDueDates=getGroupDueDates(group);
    const ps=await getCollection('payments');
    const mPays=ps.filter(p=>p.memberId===memberId&&p.groupId===groupId);
    const paidSlots=new Set();
    mPays.forEach(p=>{
        if(Array.isArray(p.monthSlots)) p.monthSlots.forEach(s=>paidSlots.add(s));
        else if(p.monthSlot!==undefined&&p.monthSlot!==null) paidSlots.add(p.monthSlot);
        else { const slot=getMonthSlot(allDueDates,p.date); if(slot>=0) paidSlots.add(slot); }
    });
    return {paidSlots, allDueDates};
}

function getSelectedMonthSlots(){
    return Array.from(document.querySelectorAll('#monthSelectorGrid input[type=checkbox]:checked:not(:disabled)')).map(cb=>parseInt(cb.value));
}

// ══════════════════════════════════════════
// SINGLE MONTH SELECTOR — dropdown of all months
// ══════════════════════════════════════════
window._singleMonthPaidSlots = new Set();

async function buildSingleMonthDropdown(){
    const mid=document.getElementById('pMember').value;
    const gid=document.getElementById('pGroup').value;
    const wrap=document.getElementById('singleMonthDropdownWrap');
    const sel=document.getElementById('pSingleMonthSlot');
    const badge=document.getElementById('singleMonthBadge');
    window._singleMonthPaidSlots=new Set();
    sel.innerHTML='<option value="">-- Select Month --</option>';
    badge.style.display='none';
    if(!mid||!gid){wrap.style.display='none';return;}
    const gs=await getCollection('groups');
    const grp=gs.find(g=>g.id===gid);
    if(!grp){wrap.style.display='none';return;}
    const {paidSlots,allDueDates}=await getPaidSlots(mid,gid,grp);
    window._singleMonthPaidSlots=paidSlots;
    if(!allDueDates.length){wrap.style.display='none';return;}
    wrap.style.display='block';
    const today=new Date().toISOString().split('T')[0];
    const currentSlot=getMonthSlot(allDueDates,today);
    let autoSelect=currentSlot;
    // If current month already paid, jump to next unpaid
    if(paidSlots.has(currentSlot)){
        for(let i=currentSlot+1;i<allDueDates.length;i++){
            if(!paidSlots.has(i)){autoSelect=i;break;}
        }
    }
    sel.innerHTML='<option value="">-- Select Month --</option>'+allDueDates.map((dd,i)=>{
        const isPaid=paidSlots.has(i);
        const isPast=dd<today;
        const isCurrent=i===currentSlot;
        let tag='';
        if(isPaid) tag=' ✅ Paid';
        else if(isCurrent) tag=' ← Current';
        else if(isPast) tag=' ⚠ Overdue';
        else tag=' (Upcoming)';
        return `<option value="${i}" ${i===autoSelect?'selected':''}>${fmtDate(dd)}${tag}</option>`;
    }).join('');
    onSingleMonthSlotChange();
}

function onSingleMonthSlotChange(){
    const sel=document.getElementById('pSingleMonthSlot');
    const badge=document.getElementById('singleMonthBadge');
    const slot=parseInt(sel.value);
    if(isNaN(slot)||sel.value===''){badge.style.display='none';return;}
    const isPaid=window._singleMonthPaidSlots.has(slot);
    badge.style.display='block';
    if(isPaid){
        badge.style.background='rgba(245,158,11,0.13)';
        badge.style.borderColor='rgba(245,158,11,0.4)';
        badge.style.color='#fbbf24';
        badge.innerHTML='⚠️ This month already has a payment recorded. A new entry will be saved as an <strong>additional / partial payment</strong>.';
    } else {
        badge.style.background='rgba(16,185,129,0.1)';
        badge.style.borderColor='rgba(16,185,129,0.3)';
        badge.style.color='#34d399';
        badge.innerHTML='✅ This month has no payment yet.';
    }
    calcBalance();
}

async function onNumMonthsChange(){
    const val=document.getElementById('pNumMonths').value;
    const preview=document.getElementById('multiMonthPreview');
    const singleWrap=document.getElementById('singleMonthDropdownWrap');
    document.getElementById('totalChitRef').style.display='none';
    if(val==='1'){
        preview.style.display='none';
        document.getElementById('perMonthLabel').textContent='';
        await buildSingleMonthDropdown();
    } else {
        singleWrap.style.display='none';
        document.getElementById('perMonthLabel').textContent='(per month)';
        preview.style.display='block';
        await buildMonthSelectorGrid();
    }
    calcBalance();
}

async function buildMonthSelectorGrid(){
    const mid=document.getElementById('pMember').value;
    const gid=document.getElementById('pGroup').value;
    const grid=document.getElementById('monthSelectorGrid');
    const summary=document.getElementById('selectedSummary');
    grid.innerHTML='<div style="color:var(--text-dim);font-size:0.92rem;padding:8px;">Select member & group first\u2026</div>';
    summary.style.display='none';
    document.getElementById('perMonthAmtWrap').style.display='none';
    document.getElementById('perMonthCustomToggle').checked=false;
    if(!mid||!gid) return;
    const gs=await getCollection('groups');
    window._gs_cache=gs;
    const grp=gs.find(g=>g.id===gid);
    if(!grp){grid.innerHTML='<div style="color:#f87171;font-size:0.92rem;">Group not found</div>';return;}
    const {paidSlots,allDueDates}=await getPaidSlots(mid,gid,grp);
    if(!allDueDates.length){grid.innerHTML='<div style="color:#f87171;font-size:0.92rem;">No due dates configured for this group</div>';return;}
    const today=new Date().toISOString().split('T')[0];
    grid.innerHTML=allDueDates.map((dd,i)=>{
        const paid=paidSlots.has(i);
        const isPast=dd<=today;
        return`<label class="month-cb-item ${paid?'already-paid':''}">
            <input type="checkbox" value="${i}" ${paid?'disabled checked':''} onchange="updateSelectedSummary();calcBalance();">
            <div>
                <div style="font-size:1.05rem;font-weight:700;">${fmtDate(dd)}</div>
                <div style="font-size:0.98rem;color:${paid?'#34d399':(isPast?'#f87171':'var(--text-dim)')}">${paid?'\u2705 Paid':(isPast?'\u26a0 Overdue':'Upcoming')}</div>
            </div>
        </label>`;
    }).join('');
    updateSelectedSummary();
}

function updateSelectedSummary(){
    const newlySelected=Array.from(document.querySelectorAll('#monthSelectorGrid input[type=checkbox]:checked:not(:disabled)')).map(cb=>parseInt(cb.value));
    const summary=document.getElementById('selectedSummary');
    if(newlySelected.length===0){
        summary.style.display='none';
        document.getElementById('perMonthAmtWrap').style.display='none';
    } else {
        summary.style.display='block';
        summary.textContent=`\ud83d\udcc5 ${newlySelected.length} month${newlySelected.length>1?'s':''} selected for payment`;
        document.getElementById('perMonthAmtWrap').style.display='block';
        buildPerMonthAmtGrid(newlySelected);
    }
    calcBalance();
}

function buildPerMonthAmtGrid(selectedSlots){
    const isCustom=document.getElementById('perMonthCustomToggle').checked;
    const grid=document.getElementById('perMonthAmtGrid');
    if(!isCustom){ grid.style.display='none'; return; }
    grid.style.display='flex';
    const gs_cache=window._gs_cache||[];
    const gid=document.getElementById('pGroup').value;
    const grp=gs_cache.find(g=>g.id===gid);
    const allDueDates=grp?getGroupDueDates(grp):[];
    const chit=parseFloat(document.getElementById('pChit').value)||0;
    const existing={};
    grid.querySelectorAll('.pma-row').forEach(r=>{ existing[r.dataset.slot]=r.querySelector('input').value; });
    grid.innerHTML=selectedSlots.map(slot=>{
        const label=allDueDates[slot]?fmtDate(allDueDates[slot]):`Month ${slot+1}`;
        const val=existing[slot]!==undefined?existing[slot]:(chit||'');
        return `<div class="pma-row" data-slot="${slot}" style="display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:8px;padding:7px 10px;">
            <span style="flex:1;font-size:0.92rem;color:#a5b4fc;font-weight:700;">${label}</span>
            <input type="number" placeholder="\u20b9 amount" value="${val}" style="width:110px;background:var(--input-bg);border:1px solid var(--border);color:white;padding:6px 9px;border-radius:7px;font-size:1rem;" oninput="calcBalance()">
        </div>`;
    }).join('');
}

function togglePerMonthCustom(){
    const isCustom=document.getElementById('perMonthCustomToggle').checked;
    const slots=Array.from(document.querySelectorAll('#monthSelectorGrid input[type=checkbox]:checked:not(:disabled)')).map(cb=>parseInt(cb.value));
    if(isCustom && slots.length>0) buildPerMonthAmtGrid(slots);
    else document.getElementById('perMonthAmtGrid').style.display='none';
    calcBalance();
}

function onChitAmtChange(){
    if(document.getElementById('perMonthCustomToggle')?.checked){
        const chit=parseFloat(document.getElementById('pChit').value)||0;
        document.querySelectorAll('#perMonthAmtGrid .pma-row input').forEach(inp=>{
            if(!inp.value) inp.value=chit||'';
        });
    }
    calcBalance();
}

function getPerMonthAmounts(){
    if(!document.getElementById('perMonthCustomToggle')?.checked) return null;
    const map={};
    document.querySelectorAll('#perMonthAmtGrid .pma-row').forEach(r=>{
        const slot=parseInt(r.dataset.slot);
        const val=parseFloat(r.querySelector('input').value)||0;
        if(!isNaN(slot)) map[slot]=val;
    });
    return map;
}

function calcBalance(){
    const chit=parseFloat(document.getElementById('pChit').value)||0;
    const paid=parseFloat(document.getElementById('pPaid').value)||0;
    const isMulti=document.getElementById('pNumMonths').value==='multi';
    if(isMulti){
        const selectedCBs=Array.from(document.querySelectorAll('#monthSelectorGrid input[type=checkbox]:checked:not(:disabled)'));
        const n=Math.max(1,selectedCBs.length);
        const isCustom=document.getElementById('perMonthCustomToggle')?.checked;
        let totalChit=0;
        if(isCustom){
            const amtMap=getPerMonthAmounts()||{};
            selectedCBs.forEach(cb=>{ totalChit+=(amtMap[parseInt(cb.value)]||chit); });
        } else {
            totalChit=chit*n;
        }
        const bal=Math.max(0,totalChit-paid);
        if(n>1){
            document.getElementById('totalChitRef').style.display='block';
            document.getElementById('totalChitVal').textContent=isCustom
                ? `\u20b9${totalChit.toLocaleString('en-IN')} (${n} months, custom amounts)`
                : `\u20b9${totalChit.toLocaleString('en-IN')} (${n}\u00d7\u20b9${chit.toLocaleString('en-IN')})`;
            document.getElementById('totalBalVal').textContent=`\u20b9${bal.toLocaleString('en-IN')}`;
        } else {
            document.getElementById('totalChitRef').style.display='none';
        }
    } else {
        document.getElementById('totalChitRef').style.display='none';
    }
}


// CO-PAYER / SPLIT PAYMENT
// ══════════════════════════════════════════
function toggleSplitPay(){
    const on = document.getElementById('splitPayToggle').checked;
    const sec = document.getElementById('coPayerSection');
    sec.style.display = on ? 'block' : 'none';
    if(on) buildCoPayerRows();
    else document.getElementById('coPayerRows').innerHTML='';
}

async function buildCoPayerRows(){
    const mid = document.getElementById('pMember').value;
    const paid = parseFloat(document.getElementById('pPaid').value)||0;
    const ms = await getCollection('members');
    const primaryMember = ms.find(m=>m.id===mid);
    const primaryName = primaryMember ? primaryMember.name : 'Primary Member';

    // Build search list for co-payer (all members except primary)
    const otherMembers = ms.filter(m=>m.id!==mid);
    const memberOpts = otherMembers.map(m=>`<option value="${m.id}" data-name="${m.name}">${m.name}${m.phone?' ('+m.phone+')':''}</option>`).join('');

    const half = paid>0 ? (paid/2).toFixed(0) : '';

    document.getElementById('coPayerRows').innerHTML = `
        <!-- Row 1: Primary member -->
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:9px;padding:8px 10px;">
            <span style="font-size:0.88rem;font-weight:800;color:#a5b4fc;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">👤 ${primaryName} <span style="font-size:0.7rem;color:var(--text-dim);font-weight:600;">(Primary)</span></span>
            <input type="number" id="coPay_primary" placeholder="₹ amount" value="${half}"
                style="width:110px;background:var(--input-bg);border:1px solid var(--border);color:white;padding:6px 9px;border-radius:7px;font-size:0.95rem;"
                oninput="calcCoPayerTotal()">
        </div>
        <!-- Row 2: Co-payer -->
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:9px;padding:8px 10px;flex-wrap:wrap;">
            <select id="coPayer_memberId" style="flex:2;min-width:130px;background:var(--input-bg);border:1px solid var(--border);color:white;padding:7px 10px;border-radius:7px;font-size:0.88rem;" onchange="calcCoPayerTotal()">
                <option value="">-- Select Co-payer --</option>
                ${memberOpts}
            </select>
            <input type="number" id="coPay_amount" placeholder="₹ amount" value="${half}"
                style="width:110px;background:var(--input-bg);border:1px solid var(--border);color:white;padding:6px 9px;border-radius:7px;font-size:0.95rem;"
                oninput="calcCoPayerTotal()">
        </div>`;
    calcCoPayerTotal();
}

function calcCoPayerTotal(){
    const paid = parseFloat(document.getElementById('pPaid').value)||0;
    const p1 = parseFloat(document.getElementById('coPay_primary')?.value)||0;
    const p2 = parseFloat(document.getElementById('coPay_amount')?.value)||0;
    const total = p1+p2;
    const totalDiv = document.getElementById('coPayerTotal');
    if(!totalDiv) return;
    totalDiv.style.display = 'block';
    const match = paid>0 && Math.abs(total-paid)<1;
    const diff = total-paid;
    totalDiv.style.color = match ? '#34d399' : '#f87171';
    totalDiv.style.borderLeft = `3px solid ${match?'#10b981':'#ef4444'}`;
    totalDiv.innerHTML = match
        ? `✅ Split totals match: ₹${total.toLocaleString('en-IN')}`
        : `⚠️ Split total ₹${total.toLocaleString('en-IN')} ${diff>0?'exceeds':'is short of'} paid amount ₹${paid.toLocaleString('en-IN')} by ₹${Math.abs(diff).toLocaleString('en-IN')}`;
}

function getCoPayerData(){
    if(!document.getElementById('splitPayToggle')?.checked) return null;
    const mid = document.getElementById('pMember').value;
    const p1amt = parseFloat(document.getElementById('coPay_primary')?.value)||0;
    const coMemberId = document.getElementById('coPayer_memberId')?.value||'';
    const coAmt = parseFloat(document.getElementById('coPay_amount')?.value)||0;
    if(!coMemberId) return null;
    return {
        isSplit: true,
        splitMembers: [
            { memberId: mid, amount: p1amt },
            { memberId: coMemberId, amount: coAmt }
        ]
    };
}
// ══════════════════════════════════════════

// PAYMENT FORM
// ══════════════════════════════════════════
function resetPaymentForm(){
    document.getElementById('pDate').value=new Date().toISOString().split('T')[0];
    document.getElementById('pMemberSearch').value='';
    document.getElementById('pMember').value='';
    document.getElementById('pMemberList').style.display='none';
    document.getElementById('pGroup').innerHTML='<option value="">-- Select Member First --</option>';
    document.getElementById('pNumMonths').value='1';
    if(document.getElementById('perMonthCustomToggle')) document.getElementById('perMonthCustomToggle').checked=false;
    if(document.getElementById('perMonthAmtGrid')) document.getElementById('perMonthAmtGrid').style.display='none';
    if(document.getElementById('perMonthAmtWrap')) document.getElementById('perMonthAmtWrap').style.display='none';
    document.getElementById('pChit').value='';
    document.getElementById('pPaid').value='';
    document.getElementById('pPaidBy').value='';
    document.getElementById('pChitPicked').value='No';
    document.getElementById('pChitPickedBy').value='';
    document.getElementById('chitPickedNameDiv').style.display='none';
    document.getElementById('multiMonthPreview').style.display='none';
    document.getElementById('totalChitRef').style.display='none';
    document.getElementById('perMonthLabel').textContent='';
    document.getElementById('monthSelectorGrid').innerHTML='';
    document.getElementById('selectedSummary').style.display='none';
    const sel=document.getElementById('pChitPicked');
    [...sel.options].forEach(o=>o.disabled=false);
    sel.title='';
    // reset split pay
    if(document.getElementById('splitPayToggle')){ document.getElementById('splitPayToggle').checked=false; }
    if(document.getElementById('coPayerSection')){ document.getElementById('coPayerSection').style.display='none'; }
    if(document.getElementById('coPayerRows')){ document.getElementById('coPayerRows').innerHTML=''; }
    if(document.getElementById('coPayerTotal')){ document.getElementById('coPayerTotal').style.display='none'; }
    // reset single month dropdown
    if(document.getElementById('singleMonthDropdownWrap')) document.getElementById('singleMonthDropdownWrap').style.display='none';
    if(document.getElementById('pSingleMonthSlot')) document.getElementById('pSingleMonthSlot').innerHTML='<option value="">-- Select Month --</option>';
    if(document.getElementById('singleMonthBadge')) document.getElementById('singleMonthBadge').style.display='none';
    window._singleMonthPaidSlots=new Set();
}

function openPaymentModal(){
    if(!isAdmin()){showToast('\ud83d\udeab Access denied',false);return;}
    resetPaymentForm();
    openModal('paymentModal');
}

async function linkGroupForPayment(){
    const mid=document.getElementById('pMember').value;
    const ms=await getCollection('members');const m=ms.find(x=>x.id===mid);if(!m)return;
    const gs=await getCollection('groups');

    let opts='';
    if(m.enrollments && m.enrollments.length){
        opts = m.enrollments.map(e=>{
            const g=gs.find(x=>x.id===e.groupId);
            if(!g) return '';
            const qty = parseInt(e.qty||1);
            if(qty > 1){
                return Array.from({length:qty},(_,i)=>{
                    const slotLabel = e.label ? `${e.label} \u2014 Chit ${i+1}` : `Chit ${i+1} of ${qty}`;
                    return `<option value="${e.groupId}" data-enrollment-id="${e.enrollmentId}" data-slot="${i+1}">${g.name} (${slotLabel})</option>`;
                }).join('');
            } else {
                const dispLabel = e.label ? ` (${e.label})` : '';
                return `<option value="${e.groupId}" data-enrollment-id="${e.enrollmentId}" data-slot="1">${g.name}${dispLabel}</option>`;
            }
        }).join('');
    } else {
        opts = gs.filter(g=>m.groupIds&&m.groupIds.includes(g.id)).map(g=>`<option value="${g.id}" data-slot="1">${g.name}</option>`).join('');
    }
    document.getElementById('pGroup').innerHTML = opts || '<option value="">No groups assigned</option>';

    const sel = document.getElementById('pGroup');
    sel.onchange = function(){
        const chosen = sel.options[sel.selectedIndex];
        document.getElementById('pEnrollmentId').value = chosen ? (chosen.dataset.enrollmentId||'') : '';
        document.getElementById('pSlotNum').value = chosen ? (chosen.dataset.slot||'1') : '1';
        onGroupChange();
    };
    const first = sel.options[sel.selectedIndex];
    document.getElementById('pEnrollmentId').value = first ? (first.dataset.enrollmentId||'') : '';
    document.getElementById('pSlotNum').value = first ? (first.dataset.slot||'1') : '1';
    await onGroupChange();
}

async function onGroupChange(){
    document.getElementById('pChit').value='';
    document.getElementById('pPaid').value='';
    document.getElementById('totalChitRef').style.display='none';
    const mid=document.getElementById('pMember').value;
    const gid=document.getElementById('pGroup').value;
    // Show joint member info if this enrollment is a joint chit
    await showJointMemberInfo(mid, gid);
    if(gid){
        const gs=await getCollection('groups');
        const grp=gs.find(g=>g.id===gid);
        let autoChit=0;
        if(grp && grp.amtType!=='variable' && grp.fixedAmt){
            autoChit=parseFloat(grp.fixedAmt)||0;
        }
        if(!autoChit && mid){
            const ps2=await getCollection('payments');
            const lastP=ps2.filter(p=>p.memberId===mid&&p.groupId===gid&&p.chit).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
            if(lastP.length) autoChit=parseFloat(lastP[0].chit)||0;
        }
        if(autoChit){
            document.getElementById('pChit').value=autoChit;
            calcBalance();
        }
    }
    if(mid&&gid){
        const ps=await getCollection('payments');
        const alreadyPicked=ps.some(p=>p.memberId===mid&&p.groupId===gid&&p.chitPicked==='Yes');
        const sel=document.getElementById('pChitPicked');
        if(alreadyPicked){
            sel.value='No';
            [...sel.options].forEach(o=>{if(o.value==='Yes')o.disabled=true;});
            sel.title='This member already picked the chit in this group';
            document.getElementById('chitPickedNameDiv').style.display='none';
        } else {
            [...sel.options].forEach(o=>o.disabled=false);
            sel.title='';
        }
    }
    if(document.getElementById('pNumMonths').value==='multi'){
        await buildMonthSelectorGrid();
    } else {
        await buildSingleMonthDropdown();
    }
}


// JOINT ENROLLMENT DISPLAY
// ══════════════════════════════════════════
async function showJointMemberInfo(mid, gid){
    let banner = document.getElementById('jointMemberBanner');
    if(!banner) return;
    banner.style.display='none';
    banner.innerHTML='';
    if(!mid||!gid) return;
    const ms = await getCollection('members');
    const m = ms.find(x=>x.id===mid);
    if(!m||!m.enrollments) return;
    const enr = m.enrollments.find(e=>e.groupId===gid);
    if(!enr||!enr.coMemberId) return;
    const coM = ms.find(x=>x.id===enr.coMemberId);
    if(!coM) return;
    banner.style.display='block';
    banner.innerHTML=`
        <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:1.3rem;">👥</span>
            <div>
                <div style="font-size:0.88rem;font-weight:800;color:#a5b4fc;">Joint Chit</div>
                <div style="font-size:0.8rem;color:var(--text-dim);">
                    <strong style="color:#c4b5fd;">${m.name}</strong>
                    <span style="margin:0 6px;color:var(--text-dim);">+</span>
                    <strong style="color:#c4b5fd;">${coM.name}</strong>
                    ${coM.phone?'<span style="color:var(--text-dim);"> · '+coM.phone+'</span>':''}
                    share this chit slot
                </div>
            </div>
        </div>`;
}
// ══════════════════════════════════════════

async function savePayment(){
    if(!isAdmin()){showToast('\ud83d\udeab Access denied',false);return;}
    const mid=document.getElementById('pMember').value;
    const gid=document.getElementById('pGroup').value;
    const date=document.getElementById('pDate').value;
    const chitPerMonth=parseFloat(document.getElementById('pChit').value)||0;
    const paid=parseFloat(document.getElementById('pPaid').value)||0;
    const paidBy=document.getElementById('pPaidBy').value;
    const chitPicked=document.getElementById('pChitPicked').value;
    const chitPickedBy=document.getElementById('pChitPickedBy').value.trim();
    const isMulti=document.getElementById('pNumMonths').value==='multi';

    if(!mid)return showToast('\u274c Select a member',false);
    if(!gid)return showToast('\u274c Select a group',false);
    if(!date)return showToast('\u274c Enter date',false);
    if(!paid)return showToast('\u274c Enter amount paid',false);

    if(chitPicked==='Yes'){
        const ps=await getCollection('payments');
        const alreadyPicked=ps.some(p=>p.memberId===mid&&p.groupId===gid&&p.chitPicked==='Yes');
        if(alreadyPicked)return showToast('\u274c This member already picked the chit',false);
    }

    if(isMulti){
        const monthSlots=getSelectedMonthSlots();
        if(monthSlots.length===0)return showToast('\u274c Select at least one month',false);
        const numMonths=monthSlots.length;
        const perMonthMap=getPerMonthAmounts();
        let totalChit=0;
        let perMonthBreakdown=null;
        if(perMonthMap && Object.keys(perMonthMap).length>0){
            perMonthBreakdown=monthSlots.map(s=>({slot:s, amt:perMonthMap[s]||chitPerMonth}));
            totalChit=perMonthBreakdown.reduce((s,r)=>s+r.amt,0);
        } else {
            totalChit=chitPerMonth*numMonths;
        }
        const balance=Math.max(0,totalChit-paid);
        const enrollmentId1 = document.getElementById('pEnrollmentId').value||'';
        const slotNum1 = parseInt(document.getElementById('pSlotNum').value||'1');
        const multiRef=await db.collection('payments').add({
            memberId:mid, groupId:gid, enrollmentId:enrollmentId1, slotNum:slotNum1, date,
            chit:chitPerMonth, paid, balance, paidBy, chitPicked, chitPickedBy,
            numMonths, monthSlots, monthSlot:monthSlots[0],
            paidPerMonth:paid/numMonths, balPerMonth:balance/numMonths,
            ...(perMonthBreakdown?{perMonthBreakdown}:{})
        });
        // Mirror to co-member if joint
        const ms3=await getCollection('members');
        const pM3=ms3.find(x=>x.id===mid);
        const pEnr3=pM3&&pM3.enrollments?pM3.enrollments.find(e=>e.groupId===gid):null;
        const coMid3=pEnr3&&pEnr3.coMemberId?pEnr3.coMemberId:'';
        if(coMid3){
            const coM3=ms3.find(x=>x.id===coMid3);
            const coEnr3=coM3&&coM3.enrollments?coM3.enrollments.find(e=>e.groupId===gid):null;
            await db.collection('payments').add({
                memberId:coMid3, groupId:gid,
                enrollmentId:coEnr3?coEnr3.enrollmentId||'':enrollmentId1,
                slotNum:slotNum1, date,
                chit:chitPerMonth, paid, balance, paidBy, chitPicked, chitPickedBy,
                numMonths, monthSlots, monthSlot:monthSlots[0],
                paidPerMonth:paid/numMonths, balPerMonth:balance/numMonths,
                mirroredFrom:multiRef.id,
                mirroredPrimaryMemberId:mid,
                isJointMirror:true,
                ...(perMonthBreakdown?{perMonthBreakdown}:{})
            });
        }
        bustCache('payments');
        const jointNote3=coMid3?' — reflected in both ledgers':'';
        showToast('\u2705 '+numMonths+'-month payment saved!'+jointNote3);
    } else {
        // Single month — use the dropdown-selected slot
        const slotSel=document.getElementById('pSingleMonthSlot');
        const selectedSlot=slotSel.value!==''?parseInt(slotSel.value):null;
        if(selectedSlot===null)return showToast('\u274c Select which month this payment is for',false);
        const gs=await getCollection('groups');
        const grp=gs.find(g=>g.id===gid);
        const dueDates=grp?getGroupDueDates(grp):[];
        const slotLabel=dueDates[selectedSlot]?fmtDate(dueDates[selectedSlot]):`Month ${selectedSlot+1}`;
        const balance=Math.max(0,chitPerMonth-paid);
        const isPartial=paid>0&&chitPerMonth>0&&paid<chitPerMonth;
        const enrollmentId2=document.getElementById('pEnrollmentId').value||'';
        const slotNum2=parseInt(document.getElementById('pSlotNum').value||'1');
        const coPayerData = getCoPayerData();
        // Validate split total if split is on
        if(coPayerData){
            const splitTotal = coPayerData.splitMembers.reduce((s,m)=>s+m.amount,0);
            if(!coPayerData.splitMembers[1].memberId) return showToast('❌ Select a co-payer member',false);
            if(Math.abs(splitTotal-paid)>1) return showToast('❌ Split amounts must add up to total paid',false);
        }
        // Save primary payment
        const primaryRef=await db.collection('payments').add({
            memberId:mid, groupId:gid, enrollmentId:enrollmentId2, slotNum:slotNum2, date,
            chit:chitPerMonth, paid, balance, paidBy, chitPicked, chitPickedBy,
            numMonths:1, monthSlot:selectedSlot, monthSlots:[selectedSlot],
            isPartial:isPartial, slotLabel:slotLabel,
            ...(coPayerData||{})
        });
        // Mirror to co-member if joint enrollment
        const ms2=await getCollection('members');
        const primaryMember=ms2.find(x=>x.id===mid);
        const primaryEnr=primaryMember&&primaryMember.enrollments
            ?primaryMember.enrollments.find(e=>e.groupId===gid):null;
        const coMid=primaryEnr&&primaryEnr.coMemberId?primaryEnr.coMemberId:'';
        if(coMid){
            const coM2=ms2.find(x=>x.id===coMid);
            const coEnr2=coM2&&coM2.enrollments?coM2.enrollments.find(e=>e.groupId===gid):null;
            await db.collection('payments').add({
                memberId:coMid, groupId:gid,
                enrollmentId:coEnr2?coEnr2.enrollmentId||'':enrollmentId2,
                slotNum:slotNum2, date,
                chit:chitPerMonth, paid, balance, paidBy, chitPicked, chitPickedBy,
                numMonths:1, monthSlot:selectedSlot, monthSlots:[selectedSlot],
                isPartial:isPartial, slotLabel:slotLabel,
                mirroredFrom:primaryRef.id,
                mirroredPrimaryMemberId:mid,
                isJointMirror:true
            });
        }
        bustCache('payments');
        const partialNote=isPartial?' (Partial)':'';
        const jointNote=coMid?' - reflected in both ledgers':'';
        showToast('\u2705 Payment saved for '+slotLabel+partialNote+jointNote+'!');
    }

    closeModal('paymentModal');
    updateUI();
    if(document.getElementById('summaryView').value===mid) loadMemberLedger();
}

// ══════════════════════════════════════════

// EDIT / DELETE EXISTING PAYMENT
// ══════════════════════════════════════════
async function openEditPayment(pid){
    if(!isAdmin()){showToast('\ud83d\udeab Access denied',false);return;}
    const ps=await getCollection('payments');
    const p=ps.find(x=>x.id===pid);if(!p)return;
    document.getElementById('epId').value=pid;
    document.getElementById('epDate').value=p.date||'';
    document.getElementById('epChit').value=p.chit||'';
    document.getElementById('epPaid').value=p.paid||'';
    document.getElementById('epBal').value=p.balance||'';
    document.getElementById('epPaidBy').value=p.paidBy||'';
    document.getElementById('epChitPicked').value=p.chitPicked||'No';
    document.getElementById('epChitPickedBy').value=p.chitPickedBy||'';
    document.getElementById('epChitPickedNameDiv').style.display=p.chitPicked==='Yes'?'block':'none';

    const infoBox=document.getElementById('epMultiMonthInfo');
    const detailEl=document.getElementById('epMultiMonthDetail');
    if(p.numMonths&&p.numMonths>1){
        infoBox.style.display='block';
        const gs=await getCollection('groups');
        const grp=gs.find(g=>g.id===p.groupId);
        let slotLabels='';
        if(grp&&p.monthSlots){
            const dueDates=getGroupDueDates(grp);
            slotLabels=p.monthSlots.map((s,i)=>dueDates[s]?fmtDate(dueDates[s]):`Month ${s+1}`).join(' \u2192 ');
        }
        detailEl.innerHTML=`Covers <strong>${p.numMonths} months</strong>${slotLabels?': '+slotLabels:''}`;
    } else {
        infoBox.style.display='none';
    }

    openModal('editPaymentModal');
}

function epCalcBalance(){
    const chit=parseFloat(document.getElementById('epChit').value)||0;
    const paid=parseFloat(document.getElementById('epPaid').value)||0;
    document.getElementById('epBal').value=Math.max(0,chit-paid);
}
function epTogglePickedName(){
    document.getElementById('epChitPickedNameDiv').style.display=document.getElementById('epChitPicked').value==='Yes'?'block':'none';
}

async function saveEditPayment(){
    if(!isAdmin()){showToast('\ud83d\udeab Access denied',false);return;}
    const pid=document.getElementById('epId').value;if(!pid)return;
    const date=document.getElementById('epDate').value;
    const chit=parseFloat(document.getElementById('epChit').value)||0;
    const paid=parseFloat(document.getElementById('epPaid').value)||0;
    const balance=Math.max(0,chit-paid);
    const paidBy=document.getElementById('epPaidBy').value;
    const chitPicked=document.getElementById('epChitPicked').value;
    const chitPickedBy=document.getElementById('epChitPickedBy').value.trim();
    if(!date)return showToast('\u274c Enter date',false);
    if(!paid)return showToast('\u274c Enter amount paid',false);
    await db.collection('payments').doc(pid).update({date,chit,paid,balance,paidBy,chitPicked,chitPickedBy});
    bustCache('payments');
    closeModal('editPaymentModal');showToast('\u2705 Payment updated!');updateUI();
    const mid=document.getElementById('summaryView').value;
    if(mid)loadMemberLedger();
}

async function deletePayment(){
    if(!isAdmin()){showToast('\ud83d\udeab Access denied',false);return;}
    const pid=document.getElementById('epId').value;if(!pid)return;
    showConfirm('\ud83d\uddd1','Delete Payment?','This will permanently delete this payment and its joint mirror (if any).',async()=>{
        // Delete mirrored joint record too
        const allPs=await getCollection('payments');
        const mirror=allPs.find(p=>p.mirroredFrom===pid&&p.isJointMirror);
        if(mirror) await db.collection('payments').doc(mirror.id).delete();
        await db.collection('payments').doc(pid).delete();
        bustCache('payments');
        closeModal('editPaymentModal');showToast('\ud83d\uddd1 Payment deleted');updateUI();
        const mid=document.getElementById('summaryView').value;
        if(mid)loadMemberLedger();
    });
}

// ══════════════════════════════════════════

// --- LEDGER RENDERING ---
function renderLedger(mid) {
    const m = _cache.m.find(x => x.id === mid);
    const mPays = _cache.p.filter(p => p.memberId === mid);
    const totalPaid = mPays.reduce((s, p) => s + (parseFloat(p.amountPaid) || 0), 0);

    document.getElementById('ledgerArea').innerHTML = `
        <div class="member-card">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-3">
                    <div class="avatar">${m.name[0]}</div>
                    <div><h4 class="mb-0 fw-bold">${m.name}</h4><small class="text-dim">${mPays.length} payments</small></div>
                </div>
                <button class="btn btn-warning btn-sm fw-bold" onclick="printPDF('${m.id}')">🖨️ Print PDF</button>
            </div>
            <div class="history-bar" onclick="toggleHistory()">
                <span class="small fw-bold text-dim">PAYMENT HISTORY</span>
                <div class="d-flex gap-3"><span class="text-success fw-bold">₹${totalPaid.toLocaleString()} paid</span><span>▼</span></div>
            </div>
            <div id="hist" style="display:none; overflow-x:auto;">
                <table class="table-history">
                    <thead><tr><th>#</th><th>Date</th><th>Paid</th><th>Bal</th><th>Pick</th></tr></thead>
                    <tbody>${mPays.map((p, i) => `
                        <tr>
                            <td>${i+1}</td>
                            <td>${p.date}</td>
                            <td class="text-success">₹${p.amountPaid}</td>
                            <td class="text-warning">₹${p.balance}</td>
                            <td>${p.chitPicked === 'Yes' ? '✅' : '—'}</td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
}

// --- PRINT ENGINE ---
function printPDF(mid) {
    const m = _cache.m.find(x => x.id === mid);
    const mPays = _cache.p.filter(p => p.memberId === mid);
    const totalPaid = mPays.reduce((s, p) => s + (parseFloat(p.amountPaid) || 0), 0);
    const totalBal = mPays.reduce((s, p) => s + (parseFloat(p.balance) || 0), 0);

    const overlay = document.getElementById('printOverlay');
    overlay.innerHTML = `
        <div class="no-print mb-4 d-flex gap-2">
            <button class="btn btn-warning fw-bold" onclick="window.print()">Confirm Print</button> 
            <button class="btn btn-light border" onclick="document.getElementById('printOverlay').style.display='none'">Close</button>
        </div>
        <div class="print-content">
            <h3>AK CHIT FUNDS - STATEMENT</h3>
            <div class="print-box">
                <div><h1>${m.name}</h1><p>Contact: ${m.phone || 'N/A'}</p></div>
                <div class="d-flex gap-2">
                    <div class="print-stat"><b>Rs.${totalPaid}</b><br><small>PAID</small></div>
                    <div class="print-stat"><b>Rs.${totalBal}</b><br><small>BAL</small></div>
                </div>
            </div>
            <table class="print-table">
                <thead><tr><th>#</th><th>Date</th><th>Chit Amt</th><th>Paid</th><th>Balance</th><th>Mode</th></tr></thead>
                <tbody>${mPays.map((p, i) => `
                    <tr>
                        <td>${i+1}</td>
                        <td>${p.date}</td>
                        <td>Rs.${p.amountPaid + p.balance}</td>
                        <td>Rs.${p.amountPaid}</td>
                        <td>Rs.${p.balance}</td>
                        <td>${p.mode}</td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>`;
    overlay.style.display = 'block';
}

function checkChitStatus() {
    const mid = document.getElementById('pSelectedMid').value;
    const gid = document.getElementById('pGroup').value;
    const isPicked = _cache.p.some(p => p.memberId === mid && p.groupId === gid && p.chitPicked === 'Yes');
    const sel = document.getElementById('pPicked');
    if (isPicked) { sel.value = "No"; sel.options[1].disabled = true; }
    else { sel.options[1].disabled = false; }
}

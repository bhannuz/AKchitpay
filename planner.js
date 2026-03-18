// --- HELPERS ---
// Converts YYYY-MM-DD (Firebase standard) to DD/MM/YYYY
const fmtDate = (d) => {
    if (!d || d === "") return '—';
    const parts = d.split('-');
    if (parts.length !== 3) return d; // Return original if already formatted
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

// Ensures values are numbers to avoid "undefined" errors
const cleanNum = (n) => parseFloat(n) || 0;

// --- LEDGER RENDERING ---
function renderLedger(mid) {
    const m = _cache.m.find(x => x.id === mid);
    if (!m) return;

    const mPays = _cache.p.filter(p => p.memberId === mid);
    // Sort payments by Month Number so history is chronological
    mPays.sort((a, b) => (parseInt(a.monthPaid) || 0) - (parseInt(b.monthPaid) || 0));

    const totalPaid = mPays.reduce((s, p) => s + cleanNum(p.amountPaid), 0);

    document.getElementById('ledgerArea').innerHTML = `
        <div class="member-card">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-3">
                    <div class="avatar">${m.name ? m.name[0].toUpperCase() : '?'}</div>
                    <div>
                        <h4 class="mb-0 fw-bold">${m.name}</h4>
                        <small class="text-dim">${mPays.length} payments recorded</small>
                    </div>
                </div>
                <button class="btn btn-warning btn-sm fw-bold" onclick="printPDF('${m.id}')">🖨️ Print PDF</button>
            </div>
            
            <div class="history-bar" onclick="toggleHistory()">
                <span class="small fw-bold text-dim">PAYMENT HISTORY</span>
                <div class="d-flex gap-3">
                    <span class="text-success fw-bold">₹${totalPaid.toLocaleString()} paid</span>
                    <span>▼</span>
                </div>
            </div>

            <div id="hist" style="display:none; overflow-x:auto;">
                <table class="table-history">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Month</th>
                            <th>Date</th>
                            <th>Paid</th>
                            <th>Bal</th>
                            <th>Pick</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${mPays.map((p, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td><span class="badge-meta">M-${p.monthPaid || '—'}</span></td>
                            <td>${fmtDate(p.date)}</td>
                            <td class="text-success">₹${cleanNum(p.amountPaid)}</td>
                            <td class="text-warning">₹${cleanNum(p.balance)}</td>
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
    if (!m) return;

    const mPays = _cache.p.filter(p => p.memberId === mid);
    mPays.sort((a, b) => (parseInt(a.monthPaid) || 0) - (parseInt(b.monthPaid) || 0));

    const totalPaid = mPays.reduce((s, p) => s + cleanNum(p.amountPaid), 0);
    const totalBal = mPays.reduce((s, p) => s + cleanNum(p.balance), 0);

    const overlay = document.getElementById('printOverlay');
    overlay.innerHTML = `
        <div class="no-print mb-4 d-flex gap-2">
            <button class="btn btn-warning fw-bold" onclick="window.print()">Confirm Print</button> 
            <button class="btn btn-light border" onclick="document.getElementById('printOverlay').style.display='none'">Close</button>
        </div>
        <div class="print-content" style="color: black; background: white;">
            <h3 style="text-align:center; border-bottom: 2px solid #f39c12; padding-bottom: 10px;">AK CHIT FUNDS - STATEMENT</h3>
            
            <div class="print-box" style="display:flex; justify-content:space-between; margin: 20px 0; border: 1px solid #ddd; padding: 15px; border-radius: 10px;">
                <div>
                    <h1 style="margin:0;">${m.name}</h1>
                    <p style="margin:5px 0 0 0;">Contact: ${m.phone || 'N/A'}</p>
                </div>
                <div style="display:flex; gap: 15px;">
                    <div style="text-align:center;">
                        <b style="font-size: 1.2rem; color: green;">Rs.${totalPaid.toLocaleString()}</b><br>
                        <small>TOTAL PAID</small>
                    </div>
                    <div style="text-align:center;">
                        <b style="font-size: 1.2rem; color: red;">Rs.${totalBal.toLocaleString()}</b><br>
                        <small>TOTAL BAL</small>
                    </div>
                </div>
            </div>

            <table class="print-table" style="width:100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f8f9fa;">
                        <th style="border: 1px solid #ddd; padding: 8px;">Month</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Date</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Chit Amt</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Paid</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Balance</th>
                    </tr>
                </thead>
                <tbody>
                    ${mPays.map(p => `
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align:center;">M-${p.monthPaid}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align:center;">${fmtDate(p.date)}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align:right;">Rs.${(cleanNum(p.amountPaid) + cleanNum(p.balance)).toLocaleString()}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align:right;">Rs.${cleanNum(p.amountPaid).toLocaleString()}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align:right;">Rs.${cleanNum(p.balance).toLocaleString()}</td>
                    </tr>`).join('')}
                </tbody>
            </table>
            <div style="margin-top: 30px; text-align: right; font-size: 0.8rem; color: #777;">
                Generated on: ${new Date().toLocaleString()}
            </div>
        </div>`;
    overlay.style.display = 'block';
}

// Function to handle showing/hiding history
function toggleHistory() {
    const el = document.getElementById('hist');
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

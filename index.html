<!DOCTYPE html>

<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<title>ChitPay – Bhanu Prasad</title>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root{--bg:#0a0f1e;--surface:#111827;--surface2:#1a2235;--accent:#f59e0b;--text:#f1f5f9;--muted:#64748b;--border:rgba(255,255,255,0.08);--gold:linear-gradient(135deg,#f59e0b,#fbbf24,#d97706);--green:linear-gradient(135deg,#10b981,#34d399);}
  *{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
  body{font-family:'Sora',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;max-width:430px;margin:0 auto;overflow-x:hidden;}
  body::before{content:'';position:fixed;top:-200px;right:-200px;width:500px;height:500px;background:radial-gradient(circle,rgba(245,158,11,.12) 0%,transparent 70%);pointer-events:none;z-index:0;}
  body::after{content:'';position:fixed;bottom:-150px;left:-150px;width:400px;height:400px;background:radial-gradient(circle,rgba(16,185,129,.1) 0%,transparent 70%);pointer-events:none;z-index:0;}

.topbar{position:sticky;top:0;z-index:100;background:rgba(10,15,30,.92);backdrop-filter:blur(20px);padding:16px 20px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(–border);}
.topbar-logo{font-size:20px;font-weight:800;letter-spacing:-.5px;}
.topbar-logo span{background:var(–gold);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.topbar-bell{width:38px;height:38px;border-radius:12px;background:var(–surface2);border:1px solid var(–border);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:18px;position:relative;}
.notif-dot{position:absolute;top:6px;right:6px;width:8px;height:8px;border-radius:50%;background:var(–accent);border:2px solid var(–bg);}

.page{display:none;animation:fadeUp .3s ease;}
.page.active{display:block;}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}

.bottom-nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:rgba(17,24,39,.96);backdrop-filter:blur(20px);border-top:1px solid var(–border);display:flex;z-index:100;padding:8px 0 calc(8px + env(safe-area-inset-bottom));}
.nav-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;padding:6px 0;transition:all .2s;}
.nav-icon{font-size:22px;transition:transform .2s;}
.nav-label{font-size:10px;font-weight:500;color:var(–muted);transition:color .2s;}
.nav-item.active .nav-label{color:var(–accent);}
.nav-item.active .nav-icon{transform:scale(1.15);}

.content{padding:20px 20px 90px;}
.card{background:var(–surface);border:1px solid var(–border);border-radius:20px;padding:20px;margin-bottom:16px;position:relative;overflow:hidden;}
.card-glow::after{content:’’;position:absolute;top:0;left:0;right:0;height:2px;background:var(–gold);}
.card-glow-green::after{content:’’;position:absolute;top:0;left:0;right:0;height:2px;background:var(–green);}
.section-title{font-size:14px;font-weight:700;color:var(–muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;}

/* HOME ACTION BUTTONS */
.home-actions{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px;}
.action-btn{border-radius:20px;padding:22px 16px;cursor:pointer;border:1px solid;display:flex;flex-direction:column;gap:10px;transition:transform .15s,opacity .15s;position:relative;overflow:hidden;}
.action-btn:active{transform:scale(.97);opacity:.9;}
.action-btn.add{background:linear-gradient(135deg,#1c1a0a,#1a160a);border-color:rgba(245,158,11,.35);}
.action-btn.view{background:linear-gradient(135deg,#0d1f18,#0a1a12);border-color:rgba(16,185,129,.35);}
.action-btn .ab-icon{font-size:28px;}
.action-btn .ab-title{font-size:15px;font-weight:700;}
.action-btn .ab-sub{font-size:11px;color:var(–muted);line-height:1.4;}
.action-btn.add .ab-title{background:var(–gold);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.action-btn.view .ab-title{color:#34d399;}

/* BALANCE */
.balance-card{background:linear-gradient(135deg,#1a2d1a 0%,#0f2318 100%);border-color:rgba(16,185,129,.25);}
.balance-amount{font-size:30px;font-weight:800;color:#34d399;margin:4px 0;font-family:‘JetBrains Mono’,monospace;}

.stats-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.stat-card{background:var(–surface);border:1px solid var(–border);border-radius:16px;padding:16px;}
.stat-icon{font-size:24px;margin-bottom:8px;}
.stat-val{font-size:20px;font-weight:700;font-family:‘JetBrains Mono’,monospace;}
.stat-lbl{font-size:11px;color:var(–muted);margin-top:2px;font-weight:500;}

.months-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;}
.month-pill{aspect-ratio:1;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:11px;font-weight:600;cursor:pointer;transition:transform .15s;}
.month-pill:active{transform:scale(.92);}
.month-pill.paid{background:rgba(16,185,129,.2);border:1px solid rgba(16,185,129,.4);color:#34d399;}
.month-pill.pending{background:rgba(245,158,11,.15);border:1px solid rgba(245,158,11,.35);color:#fbbf24;}
.month-pill.future{background:var(–surface2);border:1px solid var(–border);color:var(–muted);}
.month-pill .m-num{font-size:13px;font-weight:700;}
.month-pill .m-status{font-size:8px;margin-top:1px;opacity:.8;}

/* FORMS */
.form-group{margin-bottom:14px;}
.form-label{font-size:12px;color:var(–muted);font-weight:600;margin-bottom:8px;display:block;letter-spacing:.5px;text-transform:uppercase;}
.form-input{width:100%;background:var(–surface2);border:1px solid var(–border);border-radius:12px;padding:13px 16px;color:var(–text);font-family:‘Sora’,sans-serif;font-size:14px;outline:none;transition:border-color .2s;}
.form-input:focus{border-color:rgba(245,158,11,.5);}
.form-input option{background:var(–surface);}
.form-input:disabled{opacity:.45;cursor:not-allowed;}

/* MODAL */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(6px);z-index:200;display:none;align-items:flex-end;justify-content:center;}
.modal-overlay.open{display:flex;}
.modal{background:var(–surface);border-radius:24px 24px 0 0;width:100%;max-width:430px;padding:24px 24px calc(24px + env(safe-area-inset-bottom));border-top:1px solid var(–border);animation:slideUp .3s cubic-bezier(.32,.72,0,1);max-height:92vh;overflow-y:auto;}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.modal-handle{width:40px;height:4px;background:var(–border);border-radius:4px;margin:0 auto 20px;}
.modal-title{font-size:18px;font-weight:700;margin-bottom:4px;}
.modal-sub{font-size:13px;color:var(–muted);margin-bottom:20px;}

.primary-btn{width:100%;background:linear-gradient(135deg,#f59e0b,#d97706);border:none;border-radius:14px;padding:15px;color:#000;font-family:‘Sora’,sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:opacity .2s,transform .1s;margin-top:4px;}
.primary-btn:active{transform:scale(.98);opacity:.9;}
.primary-btn.green{background:linear-gradient(135deg,#10b981,#059669);color:#fff;}
.secondary-btn{width:100%;background:var(–surface2);border:1px solid var(–border);border-radius:14px;padding:14px;color:var(–text);font-family:‘Sora’,sans-serif;font-size:14px;font-weight:600;cursor:pointer;margin-top:10px;}

/* STATEMENT */
.stmt-header{background:linear-gradient(135deg,#0d1f18,#0a1a12);border:1px solid rgba(16,185,129,.25);border-radius:16px;padding:18px;margin-bottom:16px;}
.stmt-name{font-size:20px;font-weight:800;}
.stmt-meta{font-size:12px;color:#6ee7b7;margin-top:4px;}
.stmt-group-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(16,185,129,.12);border:1px solid rgba(16,185,129,.3);border-radius:8px;padding:4px 10px;font-size:12px;color:#34d399;font-weight:600;margin-top:10px;}

.stmt-summary{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px;}
.stmt-stat{background:var(–surface);border:1px solid var(–border);border-radius:14px;padding:14px;text-align:center;}
.stmt-stat-val{font-size:18px;font-weight:800;font-family:‘JetBrains Mono’,monospace;}
.stmt-stat-lbl{font-size:10px;color:var(–muted);margin-top:3px;font-weight:600;}

.month-row{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(–border);}
.month-row:last-child{border-bottom:none;}
.month-dot{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;font-family:‘JetBrains Mono’,monospace;}
.month-dot.paid{background:rgba(16,185,129,.2);color:#34d399;border:1px solid rgba(16,185,129,.3);}
.month-dot.pending{background:rgba(245,158,11,.15);color:#fbbf24;border:1px solid rgba(245,158,11,.3);}
.month-dot.future{background:var(–surface2);color:var(–muted);border:1px solid var(–border);}
.month-row-info{flex:1;}
.month-row-title{font-size:13px;font-weight:600;}
.month-row-date{font-size:11px;color:var(–muted);margin-top:2px;}
.month-row-amt{font-size:13px;font-weight:700;font-family:‘JetBrains Mono’,monospace;}
.month-row-amt.paid{color:#34d399;}
.month-row-amt.pending{color:#fbbf24;}
.month-row-amt.future{color:var(–muted);}

.chip{display:inline-flex;align-items:center;border-radius:6px;padding:3px 8px;font-size:10px;font-weight:700;}
.chip.paid{background:rgba(16,185,129,.15);color:#34d399;border:1px solid rgba(16,185,129,.3);}
.chip.pending{background:rgba(245,158,11,.15);color:#fbbf24;border:1px solid rgba(245,158,11,.3);}
.chip.future{background:var(–surface2);color:var(–muted);border:1px solid var(–border);}

.detail-row{display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid var(–border);}
.detail-row:last-of-type{border-bottom:none;}
.detail-key{font-size:13px;color:var(–muted);}
.detail-val{font-size:13px;font-weight:600;text-align:right;}

.mini-bar{height:4px;background:var(–surface2);border-radius:4px;margin-top:8px;overflow:hidden;}
.mini-bar-fill{height:100%;border-radius:4px;background:var(–green);transition:width .4s ease;}
.mini-bar-fill.amber{background:var(–gold);}

/* MEMBERS PAGE */
.search-bar{background:var(–surface2);border:1px solid var(–border);border-radius:14px;padding:12px 16px;display:flex;align-items:center;gap:10px;margin-bottom:16px;}
.search-bar input{flex:1;background:none;border:none;outline:none;color:var(–text);font-family:‘Sora’,sans-serif;font-size:14px;}
.search-bar input::placeholder{color:var(–muted);}
.member-card{background:var(–surface);border:1px solid var(–border);border-radius:16px;padding:16px;margin-bottom:10px;display:flex;align-items:center;gap:14px;cursor:pointer;transition:background .2s;}
.member-card:active{background:var(–surface2);}
.member-avatar{width:46px;height:46px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;flex-shrink:0;}
.member-info{flex:1;min-width:0;}
.member-name{font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.member-slot{font-size:11px;color:var(–muted);margin-top:2px;}
.member-paid{font-size:13px;font-weight:700;color:#34d399;font-family:‘JetBrains Mono’,monospace;}

/* REPORTS */
.report-tabs{display:flex;background:var(–surface2);border-radius:12px;padding:4px;margin-bottom:20px;}
.report-tab{flex:1;text-align:center;padding:9px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;color:var(–muted);}
.report-tab.active{background:var(–surface);color:var(–text);box-shadow:0 2px 8px rgba(0,0,0,.3);}
.summary-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;}
.summary-stat{background:var(–surface);border:1px solid var(–border);border-radius:16px;padding:16px;}
.ss-label{font-size:11px;color:var(–muted);font-weight:600;text-transform:uppercase;letter-spacing:.5px;}
.ss-val{font-size:20px;font-weight:800;margin-top:6px;font-family:‘JetBrains Mono’,monospace;}
.ss-sub{font-size:11px;color:var(–muted);margin-top:3px;}

.toast{position:fixed;top:80px;left:50%;transform:translateX(-50%) translateY(-20px);background:#1a3a2a;border:1px solid rgba(16,185,129,.4);border-radius:12px;padding:12px 20px;color:#34d399;font-size:13px;font-weight:600;z-index:300;opacity:0;transition:all .3s;pointer-events:none;white-space:nowrap;}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
::-webkit-scrollbar{width:0;}

.ring-wrap{display:flex;align-items:center;gap:20px;}
.tl-item{display:flex;gap:14px;position:relative;}
.tl-item::before{content:’’;position:absolute;left:19px;top:40px;bottom:-14px;width:2px;background:var(–border);z-index:0;}
.tl-item:last-child::before{display:none;}
.tl-dot{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;position:relative;z-index:1;}
.tl-dot.paid{background:rgba(16,185,129,.2);border:2px solid #34d399;}
.tl-dot.pending{background:rgba(245,158,11,.2);border:2px solid #f59e0b;}
.tl-dot.upcoming{background:var(–surface2);border:2px solid var(–border);}
.tl-content{flex:1;background:var(–surface);border:1px solid var(–border);border-radius:14px;padding:14px;margin-bottom:14px;}
.tl-month{font-size:14px;font-weight:700;}
.tl-meta{display:flex;justify-content:space-between;align-items:center;margin-top:6px;}
.tl-date{font-size:11px;color:var(–muted);}
.tl-amt{font-size:13px;font-weight:700;font-family:‘JetBrains Mono’,monospace;}
.tl-amt.paid{color:#34d399;}.tl-amt.pending{color:#f59e0b;}.tl-amt.upcoming{color:var(–muted);}
</style>

</head>
<body>

<div class="topbar">
  <div class="topbar-logo">Chit<span>Pay</span></div>
  <div class="topbar-bell" onclick="showToast('No new notifications')">🔔<div class="notif-dot"></div></div>
</div>

<!-- ═══════ HOME ═══════ -->

<div class="page active" id="page-home">
  <div class="content">

```
<div style="margin-bottom:20px;">
  <div style="font-size:13px;color:var(--muted);">Welcome back 👋</div>
  <div style="font-size:22px;font-weight:700;margin-top:2px;">Bhanu Prasad</div>
  <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(245,158,11,.12);border:1px solid rgba(245,158,11,.3);border-radius:8px;padding:4px 10px;font-size:12px;color:var(--accent);font-weight:600;margin-top:10px;">🏦 Group A – Slot #7</div>
</div>

<!-- TWO ACTION BUTTONS -->
<div class="home-actions">
  <div class="action-btn add" onclick="openAddModal()">
    <div class="ab-icon">➕</div>
    <div class="ab-title">Add New Record</div>
    <div class="ab-sub">Add member or record a payment</div>
  </div>
  <div class="action-btn view" onclick="openViewModal()">
    <div class="ab-icon">📋</div>
    <div class="ab-title">View Statement</div>
    <div class="ab-sub">Member history &amp; group info</div>
  </div>
</div>

<!-- BALANCE -->
<div class="card balance-card card-glow-green">
  <div style="font-size:12px;color:#6ee7b7;font-weight:500;">TOTAL AMOUNT COLLECTED</div>
  <div class="balance-amount">₹1,54,000</div>
  <div style="font-size:12px;color:#6ee7b7;opacity:.7;">Your group kitty as of Feb 2026</div>
</div>

<div class="stats-row" style="margin-bottom:12px;">
  <div class="stat-card"><div class="stat-icon">✅</div><div class="stat-val" style="color:#34d399;">7</div><div class="stat-lbl">Months Paid</div></div>
  <div class="stat-card"><div class="stat-icon">⏳</div><div class="stat-val" style="color:#f59e0b;">14</div><div class="stat-lbl">Months Left</div></div>
</div>
<div class="stats-row" style="margin-bottom:20px;">
  <div class="stat-card"><div class="stat-icon">💰</div><div class="stat-val" style="font-size:16px;color:#fbbf24;">₹1,49,500</div><div class="stat-lbl">Paid So Far</div></div>
  <div class="stat-card"><div class="stat-icon">📅</div><div class="stat-val" style="font-size:16px;color:#94a3b8;">₹2,94,500</div><div class="stat-lbl">Balance Payable</div></div>
</div>

<!-- PROGRESS RING -->
<div class="card card-glow">
  <div class="section-title">Completion Progress</div>
  <div class="ring-wrap">
    <svg width="90" height="90" viewBox="0 0 90 90">
      <circle cx="45" cy="45" r="36" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="9"/>
      <circle cx="45" cy="45" r="36" fill="none" stroke="url(#gG)" stroke-width="9"
        stroke-dasharray="226.2" stroke-dashoffset="151.5" stroke-linecap="round" transform="rotate(-90 45 45)"/>
      <defs><linearGradient id="gG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#fbbf24"/>
      </linearGradient></defs>
      <text x="45" y="49" text-anchor="middle" fill="#f59e0b" font-size="16" font-weight="800" font-family="JetBrains Mono,monospace">33%</text>
    </svg>
    <div>
      <div style="font-size:16px;font-weight:700;">7 of 21 months paid</div>
      <p style="font-size:12px;color:var(--muted);margin-top:6px;line-height:1.5;">Next due: <strong style="color:#f59e0b;">Mar 5, 2026</strong><br>Amount: <strong style="color:#f59e0b;">₹22,000</strong></p>
    </div>
  </div>
</div>

<!-- MONTH GRID -->
<div class="card">
  <div class="section-title">Payment Months</div>
  <div class="months-grid" id="monthGrid"></div>
  <div style="display:flex;gap:16px;margin-top:14px;flex-wrap:wrap;">
    <div style="display:flex;align-items:center;gap:6px;font-size:11px;color:#34d399;"><div style="width:10px;height:10px;border-radius:3px;background:rgba(16,185,129,.4);"></div>Paid</div>
    <div style="display:flex;align-items:center;gap:6px;font-size:11px;color:#fbbf24;"><div style="width:10px;height:10px;border-radius:3px;background:rgba(245,158,11,.4);"></div>Pending</div>
    <div style="display:flex;align-items:center;gap:6px;font-size:11px;color:var(--muted);"><div style="width:10px;height:10px;border-radius:3px;background:var(--surface2);"></div>Future</div>
  </div>
</div>
```

  </div>
</div>

<!-- ═══════ MEMBERS ═══════ -->

<div class="page" id="page-members">
  <div class="content">
    <div style="margin-bottom:20px;">
      <div class="section-title">Group Members</div>
      <div style="font-size:22px;font-weight:800;">21 Members</div>
      <div style="font-size:13px;color:var(--muted);margin-top:4px;">Group A · Started Aug 2025</div>
    </div>
    <div class="search-bar"><span>🔍</span><input type="text" placeholder="Search members…" oninput="filterMembers(this.value)"></div>
    <div id="membersContainer"></div>
  </div>
</div>

<!-- ═══════ PAY ═══════ -->

<div class="page" id="page-pay">
  <div class="content">
    <div style="text-align:center;padding:10px 0 20px;">
      <div style="font-size:22px;font-weight:800;">Make Payment</div>
      <div style="font-size:13px;color:var(--muted);margin-top:4px;">Record your monthly chit contribution</div>
    </div>
    <div style="background:linear-gradient(135deg,#1c1a0a,#1a160a);border:1px solid rgba(245,158,11,.3);border-radius:20px;padding:24px;text-align:center;margin-bottom:20px;">
      <div style="font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">This Month's Contribution</div>
      <div style="font-size:40px;font-weight:800;font-family:'JetBrains Mono',monospace;background:var(--gold);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">₹22,000</div>
      <div style="font-size:12px;color:var(--muted);margin-top:6px;">Month 8 of 21 · Due Mar 5, 2026</div>
    </div>
    <div class="form-group"><label class="form-label">Member Name</label><select class="form-input" id="payMember" onchange="updateMemberMonth()"><option value="">Select Member</option></select></div>
    <div class="form-group"><label class="form-label">Month</label><select class="form-input" id="payMonth"><option value="">Select Month</option></select></div>
    <div class="form-group"><label class="form-label">Amount (₹21,000 – ₹24,000)</label><input class="form-input" type="number" id="payAmtInput" min="21000" max="24000" value="22000"></div>
    <div class="form-group"><label class="form-label">Payment Mode</label><select class="form-input"><option>UPI</option><option>NEFT / Bank Transfer</option><option>Cash</option><option>Cheque</option></select></div>
    <div class="form-group"><label class="form-label">Reference / UTR No.</label><input class="form-input" type="text" placeholder="Optional"></div>
    <button class="primary-btn" onclick="recordPayment()">✓ Record Payment</button>
    <div style="margin-top:28px;"><div class="section-title">Recent Payments</div><div id="recentPayments"></div></div>
  </div>
</div>

<!-- ═══════ REPORTS ═══════ -->

<div class="page" id="page-report">
  <div class="content">
    <div style="margin-bottom:20px;">
      <div class="section-title">Analytics & Reports</div>
      <div style="font-size:22px;font-weight:800;">Group A Report</div>
    </div>
    <div class="report-tabs">
      <div class="report-tab active" onclick="switchReportTab(this,'summary')">Summary</div>
      <div class="report-tab" onclick="switchReportTab(this,'timeline')">Timeline</div>
      <div class="report-tab" onclick="switchReportTab(this,'defaulters')">Defaulters</div>
    </div>
    <div id="reportContent"></div>
  </div>
</div>

<nav class="bottom-nav">
  <div class="nav-item active" onclick="navigate('home',this)"><span class="nav-icon">🏠</span><span class="nav-label">Home</span></div>
  <div class="nav-item" onclick="navigate('members',this)"><span class="nav-icon">👥</span><span class="nav-label">Members</span></div>
  <div class="nav-item" onclick="navigate('pay',this)"><span class="nav-icon">💳</span><span class="nav-label">Pay</span></div>
  <div class="nav-item" onclick="navigate('report',this)"><span class="nav-icon">📊</span><span class="nav-label">Reports</span></div>
</nav>

<!-- ═══════ ADD NEW RECORD MODAL ═══════ -->

<div class="modal-overlay" id="addModal" onclick="closeModalOutside(event,'addModal')">
  <div class="modal">
    <div class="modal-handle"></div>
    <div class="modal-title">➕ Add New Record</div>
    <div class="modal-sub">Add a new member or record a payment</div>

```
<!-- TABS -->
<div class="report-tabs" style="margin-bottom:20px;">
  <div class="report-tab active" id="addTab-member" onclick="switchAddTab('member')">New Member</div>
  <div class="report-tab" id="addTab-payment" onclick="switchAddTab('payment')">New Payment</div>
</div>

<!-- NEW MEMBER FORM -->
<div id="addForm-member">
  <div class="form-group"><label class="form-label">Full Name</label><input class="form-input" type="text" id="newMemberName" placeholder="e.g. Venkata Subba Rao"></div>
  <div class="form-group"><label class="form-label">Select Group</label>
    <select class="form-input" id="newMemberGroup">
      <option value="">-- Select Group --</option>
      <option value="A">Group A</option>
      <option value="B">Group B</option>
      <option value="C">Group C</option>
    </select>
  </div>
  <div class="form-group"><label class="form-label">Slot Number</label><input class="form-input" type="number" id="newMemberSlot" placeholder="e.g. 22" min="1"></div>
  <div class="form-group"><label class="form-label">Phone Number</label><input class="form-input" type="tel" id="newMemberPhone" placeholder="e.g. 9876543210"></div>
  <div class="form-group"><label class="form-label">Join Date</label><input class="form-input" type="date" id="newMemberDate"></div>
  <button class="primary-btn" onclick="addNewMember()">✓ Add Member</button>
</div>

<!-- NEW PAYMENT FORM -->
<div id="addForm-payment" style="display:none;">
  <div class="form-group"><label class="form-label">Select Group</label>
    <select class="form-input" id="payGroup" onchange="loadGroupMembers()">
      <option value="">-- Select Group --</option>
      <option value="A">Group A</option>
      <option value="B">Group B</option>
      <option value="C">Group C</option>
    </select>
  </div>
  <div class="form-group"><label class="form-label">Select Member</label>
    <select class="form-input" id="payGroupMember" onchange="loadMemberMonths()" disabled>
      <option value="">-- Select Member --</option>
    </select>
  </div>
  <div class="form-group"><label class="form-label">Month</label>
    <select class="form-input" id="payGroupMonth" disabled>
      <option value="">-- Select Month --</option>
    </select>
  </div>
  <div class="form-group"><label class="form-label">Amount (₹21,000 – ₹24,000)</label><input class="form-input" type="number" id="payGroupAmt" min="21000" max="24000" value="22000"></div>
  <div class="form-group"><label class="form-label">Payment Mode</label>
    <select class="form-input" id="payGroupMode"><option>UPI</option><option>NEFT / Bank Transfer</option><option>Cash</option><option>Cheque</option></select>
  </div>
  <div class="form-group"><label class="form-label">Reference / UTR</label><input class="form-input" type="text" placeholder="Optional"></div>
  <button class="primary-btn" onclick="addNewPayment()">✓ Record Payment</button>
</div>

<button class="secondary-btn" onclick="closeModal('addModal')">Cancel</button>
```

  </div>
</div>

<!-- ═══════ VIEW STATEMENT MODAL ═══════ -->

<div class="modal-overlay" id="viewModal" onclick="closeModalOutside(event,'viewModal')">
  <div class="modal">
    <div class="modal-handle"></div>
    <div class="modal-title">📋 View Statement</div>
    <div class="modal-sub">Select group and member to view their full statement</div>

```
<div id="stmtSelector">
  <div class="form-group"><label class="form-label">Select Group</label>
    <select class="form-input" id="stmtGroup" onchange="loadStmtMembers()">
      <option value="">-- Select Group --</option>
      <option value="A">Group A</option>
      <option value="B">Group B</option>
      <option value="C">Group C</option>
    </select>
  </div>
  <div class="form-group"><label class="form-label">Select Member</label>
    <select class="form-input" id="stmtMember" disabled>
      <option value="">-- Select Member --</option>
    </select>
  </div>
  <button class="primary-btn green" onclick="showStatement()">📄 View Statement</button>
</div>

<div id="stmtResult" style="display:none;"></div>
<button class="secondary-btn" id="stmtBackBtn" style="display:none;" onclick="resetStatement()">← Back to Selection</button>
<button class="secondary-btn" onclick="closeModal('viewModal')" id="stmtCloseBtn">Close</button>
```

  </div>
</div>

<!-- MEMBER DETAIL MODAL -->

<div class="modal-overlay" id="memberModal" onclick="closeModalOutside(event,'memberModal')">
  <div class="modal"><div class="modal-handle"></div><div id="modalBody"></div>
  <button class="secondary-btn" onclick="closeModal('memberModal')">Close</button></div>
</div>

<div class="toast" id="toast"></div>

<script>
// ─── DATA ───
const TOTAL_MONTHS=21, MIN_AMT=21000, MAX_AMT=24000;
const colors=['#7c3aed','#0891b2','#065f46','#92400e','#be185d','#1e40af','#6d28d9','#b45309','#047857','#9d174d','#1d4ed8','#dc2626','#7c3aed','#0891b2','#065f46','#92400e','#be185d','#1e40af','#6d28d9','#b45309','#4f46e5'];
const names=['Bhanu Prasad','Rama Krishna','Sita Devi','Venkata Rao','Lakshmi Prasad','Suresh Babu','Padmavathi','Nageswara Rao','Savithri Devi','Ranga Rao','Annapurna','Srinivasa Rao','Komala Devi','Tirupati Rao','Vijaya Lakshmi','Hanumantha Rao','Durga Prasad','Saraswathi','Bhaskar Rao','Kamala Devi','Narayana Swamy'];

function randAmt(){return MIN_AMT+Math.floor(Math.random()*4)*1000;}

const members=names.map((name,i)=>{
  const pm=i===0?7:Math.floor(Math.random()*9)+2;
  const pays=[];
  for(let m=1;m<=pm;m++){
    const d=new Date(2025,7+m-1,3+Math.floor(Math.random()*5));
    pays.push({month:m,date:d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}),amount:randAmt()});
  }
  return{id:i+1,name,slot:i+1,group:'A',paidMonths:pm,payments:pays,color:colors[i],initials:name.split(' ').map(x=>x[0]).join('')};
});

const bpMonths=[
  {m:1,date:'3 Aug 2025',amt:21000},{m:2,date:'4 Sep 2025',amt:21500},
  {m:3,date:'5 Oct 2025',amt:22000},{m:4,date:'3 Nov 2025',amt:21000},
  {m:5,date:'4 Dec 2025',amt:23000},{m:6,date:'3 Jan 2026',amt:21500},
  {m:7,date:'4 Feb 2026',amt:22000}
];

let recentPayments=[
  {name:'Bhanu Prasad',month:7,date:'4 Feb 2026',amount:22000,mode:'UPI'},
  {name:'Rama Krishna',month:7,date:'5 Feb 2026',amount:21500,mode:'NEFT'},
  {name:'Sita Devi',month:7,date:'3 Feb 2026',amount:23000,mode:'Cash'},
  {name:'Venkata Rao',month:6,date:'4 Jan 2026',amount:22000,mode:'UPI'},
];

// ─── MONTH GRID ───
function renderMonthGrid(){
  const g=document.getElementById('monthGrid');
  for(let i=1;i<=TOTAL_MONTHS;i++){
    const d=document.createElement('div');
    const c=i<=7?'paid':i===8?'pending':'future';
    d.className=`month-pill ${c}`;
    d.innerHTML=`<div class="m-num">${i}</div><div class="m-status">${c==='paid'?'✓':c==='pending'?'!':'·'}</div>`;
    d.onclick=()=>{if(i<=7){const p=bpMonths[i-1];showToast(`Month ${i}: ₹${p.amt.toLocaleString('en-IN')} on ${p.date}`);}else if(i===8)showToast('Month 8 pending · Due Mar 5, 2026');else showToast(`Month ${i}: Upcoming`);};
    g.appendChild(d);
  }
}

// ─── HOME MODALS ───
function openAddModal(){document.getElementById('addModal').classList.add('open');switchAddTab('member');}
function openViewModal(){document.getElementById('viewModal').classList.add('open');resetStatement();}
function closeModal(id){document.getElementById(id).classList.remove('open');}
function closeModalOutside(e,id){if(e.target.id===id)closeModal(id);}

// ADD TABS
function switchAddTab(tab){
  document.getElementById('addForm-member').style.display=tab==='member'?'block':'none';
  document.getElementById('addForm-payment').style.display=tab==='payment'?'block':'none';
  document.getElementById('addTab-member').classList.toggle('active',tab==='member');
  document.getElementById('addTab-payment').classList.toggle('active',tab==='payment');
}

// ADD MEMBER
function addNewMember(){
  const name=document.getElementById('newMemberName').value.trim();
  const group=document.getElementById('newMemberGroup').value;
  const slot=document.getElementById('newMemberSlot').value;
  if(!name){showToast('❌ Enter member name');return;}
  if(!group){showToast('❌ Select a group');return;}
  if(!slot){showToast('❌ Enter slot number');return;}
  const initials=name.split(' ').map(x=>x[0]).join('').toUpperCase().slice(0,2);
  const col=colors[members.length%colors.length];
  members.push({id:members.length+1,name,slot:parseInt(slot),group,paidMonths:0,payments:[],color:col,initials});
  showToast(`✅ ${name} added to Group ${group}`);
  document.getElementById('newMemberName').value='';
  document.getElementById('newMemberSlot').value='';
  document.getElementById('newMemberPhone').value='';
  closeModal('addModal');
}

// PAYMENT IN ADD MODAL
function loadGroupMembers(){
  const g=document.getElementById('payGroup').value;
  const ms=document.getElementById('payGroupMember');
  ms.innerHTML='<option value="">-- Select Member --</option>';
  ms.disabled=!g;
  document.getElementById('payGroupMonth').innerHTML='<option value="">-- Select Month --</option>';
  document.getElementById('payGroupMonth').disabled=true;
  if(g){
    members.filter(m=>m.group===g).forEach(m=>{
      const o=document.createElement('option');o.value=m.id;o.textContent=`${m.name} (Slot #${m.slot})`;ms.appendChild(o);
    });
  }
}
function loadMemberMonths(){
  const id=parseInt(document.getElementById('payGroupMember').value);
  const ms=document.getElementById('payGroupMonth');
  ms.innerHTML='<option value="">-- Select Month --</option>';
  ms.disabled=!id;
  if(id){
    const m=members.find(x=>x.id===id);
    for(let i=m.paidMonths+1;i<=TOTAL_MONTHS;i++){
      const o=document.createElement('option');o.value=i;o.textContent=`Month ${i}`;
      if(i===m.paidMonths+1)o.selected=true;ms.appendChild(o);
    }
  }
}
function addNewPayment(){
  const id=parseInt(document.getElementById('payGroupMember').value);
  const month=parseInt(document.getElementById('payGroupMonth').value);
  const amt=parseInt(document.getElementById('payGroupAmt').value);
  const mode=document.getElementById('payGroupMode').value;
  if(!id){showToast('❌ Select a member');return;}
  if(!month){showToast('❌ Select a month');return;}
  if(isNaN(amt)||amt<MIN_AMT||amt>MAX_AMT){showToast(`❌ Amount must be ₹${MIN_AMT.toLocaleString('en-IN')}–₹${MAX_AMT.toLocaleString('en-IN')}`);return;}
  const m=members.find(x=>x.id===id);
  m.paidMonths=Math.max(m.paidMonths,month);
  const today=new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
  m.payments.push({month,date:today,amount:amt});
  recentPayments.unshift({name:m.name,month,date:today,amount:amt,mode});
  renderRecentPayments();
  showToast(`✅ ₹${amt.toLocaleString('en-IN')} recorded for ${m.name}!`);
  closeModal('addModal');
}

// ─── VIEW STATEMENT ───
function loadStmtMembers(){
  const g=document.getElementById('stmtGroup').value;
  const sel=document.getElementById('stmtMember');
  sel.innerHTML='<option value="">-- Select Member --</option>';
  sel.disabled=!g;
  if(g){
    members.filter(m=>m.group===g).forEach(m=>{
      const o=document.createElement('option');o.value=m.id;o.textContent=`${m.name} (Slot #${m.slot})`;sel.appendChild(o);
    });
  }
}
function showStatement(){
  const id=parseInt(document.getElementById('stmtMember').value);
  const grp=document.getElementById('stmtGroup').value;
  if(!grp){showToast('❌ Select a group first');return;}
  if(!id){showToast('❌ Select a member');return;}
  const m=members.find(x=>x.id===id);
  const totalPaid=m.payments.reduce((s,p)=>s+p.amount,0);
  const balance=(TOTAL_MONTHS-m.paidMonths)*22000;
  const pct=Math.round(m.paidMonths/TOTAL_MONTHS*100);
  const status=m.paidMonths<6?'⚠️ Defaulter':m.paidMonths===TOTAL_MONTHS?'✅ Completed':'🟡 Active';

  // Build monthly breakdown for ALL 21 months
  const monthRows=Array.from({length:TOTAL_MONTHS},(_,i)=>{
    const mn=i+1;
    const pay=m.payments.find(p=>p.month===mn);
    const isPaid=!!pay;
    const isPending=!isPaid&&mn===m.paidMonths+1;
    const cls=isPaid?'paid':isPending?'pending':'future';
    return `<div class="month-row">
      <div class="month-dot ${cls}">${mn}</div>
      <div class="month-row-info">
        <div class="month-row-title">Month ${mn}${isPending?' <span class="chip pending" style="margin-left:6px;">DUE</span>':''}</div>
        <div class="month-row-date">${isPaid?pay.date:isPending?'Due Mar 5, 2026':'Upcoming'}</div>
      </div>
      <div class="month-row-amt ${cls}">${isPaid?'₹'+pay.amount.toLocaleString('en-IN'):isPending?'₹22,000':'—'}</div>
    </div>`;
  }).join('');

  document.getElementById('stmtResult').innerHTML=`
    <div class="stmt-header">
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="width:50px;height:50px;border-radius:14px;background:${m.color}22;border:2px solid ${m.color}55;color:${m.color};display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;">${m.initials}</div>
        <div>
          <div class="stmt-name">${m.name}${m.id===1?' 👤':''}</div>
          <div class="stmt-meta">Slot #${m.slot} · Joined Aug 2025</div>
        </div>
      </div>
      <div class="stmt-group-badge">🏦 Group ${m.group} · ${status}</div>
    </div>

    <div class="stmt-summary">
      <div class="stmt-stat"><div class="stmt-stat-val" style="color:#34d399;">${m.paidMonths}</div><div class="stmt-stat-lbl">Months Paid</div></div>
      <div class="stmt-stat"><div class="stmt-stat-val" style="color:#f59e0b;">${TOTAL_MONTHS-m.paidMonths}</div><div class="stmt-stat-lbl">Remaining</div></div>
      <div class="stmt-stat"><div class="stmt-stat-val" style="color:#f59e0b;font-size:14px;">${pct}%</div><div class="stmt-stat-lbl">Complete</div></div>
    </div>

    <div class="card" style="margin-bottom:14px;">
      <div class="section-title">Financial Summary</div>
      <div class="detail-row"><span class="detail-key">Total Paid</span><span class="detail-val" style="color:#34d399;">₹${totalPaid.toLocaleString('en-IN')}</span></div>
      <div class="detail-row"><span class="detail-key">Balance Payable</span><span class="detail-val" style="color:#f59e0b;">₹${balance.toLocaleString('en-IN')} (est)</span></div>
      <div class="detail-row"><span class="detail-key">Avg per Month</span><span class="detail-val">₹${m.paidMonths>0?Math.round(totalPaid/m.paidMonths).toLocaleString('en-IN'):'—'}</span></div>
      <div class="detail-row"><span class="detail-key">Last Payment</span><span class="detail-val">${m.payments.length?m.payments.at(-1).date:'—'}</span></div>
      <div style="margin-top:12px;">
        <div style="font-size:11px;color:var(--muted);margin-bottom:6px;">Progress</div>
        <div class="mini-bar" style="height:8px;"><div class="mini-bar-fill ${m.paidMonths<TOTAL_MONTHS?'amber':''}" style="width:${pct}%;height:8px;"></div></div>
      </div>
    </div>

    <div class="card" style="margin-bottom:4px;">
      <div class="section-title">Monthly Breakdown</div>
      ${monthRows}
    </div>
  `;
  document.getElementById('stmtSelector').style.display='none';
  document.getElementById('stmtResult').style.display='block';
  document.getElementById('stmtBackBtn').style.display='block';
  document.getElementById('stmtCloseBtn').textContent='Close';
}
function resetStatement(){
  document.getElementById('stmtSelector').style.display='block';
  document.getElementById('stmtResult').style.display='none';
  document.getElementById('stmtBackBtn').style.display='none';
  document.getElementById('stmtGroup').value='';
  document.getElementById('stmtMember').innerHTML='<option value="">-- Select Member --</option>';
  document.getElementById('stmtMember').disabled=true;
}

// ─── MEMBERS PAGE ───
function renderMembers(list){
  document.getElementById('membersContainer').innerHTML=list.map(m=>`
    <div class="member-card" onclick="openMemberDetail(${m.id})">
      <div class="member-avatar" style="background:${m.color}22;border:1.5px solid ${m.color}55;color:${m.color};">${m.initials}</div>
      <div class="member-info">
        <div class="member-name">${m.name}${m.id===1?' 👤':''}</div>
        <div class="member-slot">Group ${m.group} · Slot #${m.slot} · ${TOTAL_MONTHS-m.paidMonths>0?TOTAL_MONTHS-m.paidMonths+' months due':'Completed ✅'}</div>
        <div class="mini-bar"><div class="mini-bar-fill ${m.paidMonths<TOTAL_MONTHS?'amber':''}" style="width:${Math.round(m.paidMonths/TOTAL_MONTHS*100)}%"></div></div>
      </div>
      <div style="text-align:right;">
        <div class="member-paid">${m.paidMonths}/${TOTAL_MONTHS}</div>
        <div style="font-size:10px;color:var(--muted);">months</div>
      </div>
    </div>`).join('');
}
function filterMembers(q){renderMembers(members.filter(m=>m.name.toLowerCase().includes(q.toLowerCase())));}

function openMemberDetail(id){
  const m=members.find(x=>x.id===id);
  const totalPaid=m.payments.reduce((s,p)=>s+p.amount,0);
  document.getElementById('modalBody').innerHTML=`
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px;">
      <div style="width:56px;height:56px;border-radius:16px;background:${m.color}22;border:2px solid ${m.color}55;color:${m.color};display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;">${m.initials}</div>
      <div><div style="font-size:18px;font-weight:700;">${m.name}${m.id===1?' 👤':''}</div><div style="font-size:12px;color:var(--muted);">Group ${m.group} · Slot #${m.slot}</div></div>
    </div>
    <div class="detail-row"><span class="detail-key">Months Paid</span><span class="detail-val" style="color:#34d399;">${m.paidMonths} of ${TOTAL_MONTHS}</span></div>
    <div class="detail-row"><span class="detail-key">Balance Months</span><span class="detail-val" style="color:#f59e0b;">${TOTAL_MONTHS-m.paidMonths}</span></div>
    <div class="detail-row"><span class="detail-key">Total Paid</span><span class="detail-val" style="color:#34d399;">₹${totalPaid.toLocaleString('en-IN')}</span></div>
    <div class="detail-row"><span class="detail-key">Last Payment</span><span class="detail-val">${m.payments.length?m.payments.at(-1).date:'N/A'}</span></div>
    <div class="detail-row"><span class="detail-key">Status</span><span class="detail-val">${m.paidMonths===TOTAL_MONTHS?'✅ Completed':m.paidMonths<6?'⚠️ Defaulter':'🟡 Active'}</span></div>
    <div style="margin-top:14px;"><div class="mini-bar" style="height:8px;"><div class="mini-bar-fill" style="width:${Math.round(m.paidMonths/TOTAL_MONTHS*100)}%;height:8px;"></div></div><div style="font-size:11px;color:var(--muted);margin-top:6px;">${Math.round(m.paidMonths/TOTAL_MONTHS*100)}% complete</div></div>`;
  document.getElementById('memberModal').classList.add('open');
}

// ─── PAY PAGE ───
function initPayPage(){
  const sel=document.getElementById('payMember');
  sel.innerHTML='<option value="">Select Member</option>';
  members.forEach(m=>{const o=document.createElement('option');o.value=m.id;o.textContent=`${m.name} (Slot #${m.slot})`;sel.appendChild(o);});
  sel.value='1'; updateMemberMonth(); renderRecentPayments();
}
function updateMemberMonth(){
  const id=parseInt(document.getElementById('payMember').value);
  const m=members.find(x=>x.id===id);
  const ms=document.getElementById('payMonth');
  ms.innerHTML='<option value="">Select Month</option>';
  if(m){for(let i=m.paidMonths+1;i<=TOTAL_MONTHS;i++){const o=document.createElement('option');o.value=i;o.textContent=`Month ${i}`;if(i===m.paidMonths+1)o.selected=true;ms.appendChild(o);}}
}
function recordPayment(){
  const id=parseInt(document.getElementById('payMember').value);
  const month=parseInt(document.getElementById('payMonth').value);
  const amt=parseInt(document.getElementById('payAmtInput').value);
  if(!id){showToast('❌ Select a member');return;}
  if(!month){showToast('❌ Select a month');return;}
  if(isNaN(amt)||amt<MIN_AMT||amt>MAX_AMT){showToast(`❌ Amount ₹${MIN_AMT.toLocaleString()}–₹${MAX_AMT.toLocaleString()}`);return;}
  const m=members.find(x=>x.id===id);
  m.paidMonths=Math.max(m.paidMonths,month);
  const today=new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
  m.payments.push({month,date:today,amount:amt});
  recentPayments.unshift({name:m.name,month,date:today,amount:amt,mode:'UPI'});
  renderRecentPayments(); updateMemberMonth();
  showToast(`✅ ₹${amt.toLocaleString('en-IN')} recorded for ${m.name}!`);
}
function renderRecentPayments(){
  document.getElementById('recentPayments').innerHTML=recentPayments.slice(0,5).map(p=>`
    <div style="display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--border);">
      <div style="width:40px;height:40px;border-radius:12px;background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.3);display:flex;align-items:center;justify-content:center;font-size:18px;">💸</div>
      <div style="flex:1;"><div style="font-size:13px;font-weight:600;">${p.name} · Month ${p.month}</div><div style="font-size:11px;color:var(--muted);margin-top:2px;">${p.date} · ${p.mode}</div></div>
      <div style="font-size:14px;font-weight:700;color:#34d399;font-family:'JetBrains Mono',monospace;">₹${p.amount.toLocaleString('en-IN')}</div>
    </div>`).join('');
}

// ─── REPORTS ───
let activeTab='summary';
function switchReportTab(el,tab){
  document.querySelectorAll('.report-tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active'); activeTab=tab; renderReport();
}
function renderReport(){
  const c=document.getElementById('reportContent');
  if(activeTab==='summary'){
    const total=members.reduce((s,m)=>s+m.payments.reduce((ss,p)=>ss+p.amount,0),0);
    const done=members.filter(m=>m.paidMonths===TOTAL_MONTHS).length;
    const def=members.filter(m=>m.paidMonths<6).length;
    const avg=Math.round(members.reduce((s,m)=>s+m.paidMonths,0)/members.length);
    const bpTotal=bpMonths.reduce((s,p)=>s+p.amt,0);
    c.innerHTML=`
      <div class="summary-grid">
        <div class="summary-stat"><div class="ss-label">Group Collected</div><div class="ss-val" style="color:#34d399;font-size:16px;">₹${(total/100000).toFixed(1)}L</div><div class="ss-sub">All members</div></div>
        <div class="summary-stat"><div class="ss-label">Avg Months</div><div class="ss-val" style="color:#f59e0b;">${avg}/${TOTAL_MONTHS}</div><div class="ss-sub">Per member</div></div>
        <div class="summary-stat"><div class="ss-label">Your Paid</div><div class="ss-val" style="color:#34d399;font-size:16px;">₹${bpTotal.toLocaleString('en-IN')}</div><div class="ss-sub">7 months</div></div>
        <div class="summary-stat"><div class="ss-label">Defaulters</div><div class="ss-val" style="color:#ef4444;">${def}</div><div class="ss-sub">Behind &lt;6 months</div></div>
      </div>
      <div class="card"><div class="section-title">Bhanu Prasad's History</div>
        ${bpMonths.map(p=>`<div class="detail-row"><span class="detail-key">Month ${p.m}</span><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:11px;color:var(--muted);">${p.date}</span><span class="detail-val" style="color:#34d399;">₹${p.amt.toLocaleString('en-IN')}</span></div></div>`).join('')}
        <div class="detail-row"><span class="detail-key" style="font-weight:700;">Total</span><span class="detail-val" style="color:#34d399;font-size:16px;">₹${bpTotal.toLocaleString('en-IN')}</span></div>
      </div>`;
  } else if(activeTab==='timeline'){
    c.innerHTML=`<div class="card"><div class="section-title">Bhanu Prasad's Journey</div><div>
      ${Array.from({length:TOTAL_MONTHS},(_,i)=>i+1).map(i=>{
        const paid=i<=7,pending=i===8,p=paid?bpMonths[i-1]:null;
        return`<div class="tl-item">
          <div class="tl-dot ${paid?'paid':pending?'pending':'upcoming'}">${paid?'✓':pending?'!':'○'}</div>
          <div class="tl-content">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div class="tl-month">Month ${i}</div>
              <div class="chip ${paid?'paid':pending?'pending':'upcoming'}">${paid?'PAID':pending?'DUE':'UPCOMING'}</div>
            </div>
            <div class="tl-meta">
              <div class="tl-date">${paid?p.date:pending?'Due Mar 5, 2026':'~'+new Date(2025,7+i-1,5).toLocaleDateString('en-IN',{month:'short',year:'numeric'})}</div>
              <div class="tl-amt ${paid?'paid':pending?'pending':'upcoming'}">${paid?'₹'+p.amt.toLocaleString('en-IN'):pending?'₹22,000':'₹21K–24K'}</div>
            </div>
          </div>
        </div>`;}).join('')}
    </div></div>`;
  } else {
    const def=members.filter(m=>m.paidMonths<6).sort((a,b)=>a.paidMonths-b.paidMonths);
    const late=members.filter(m=>m.paidMonths>=6&&m.paidMonths<8&&m.id!==1);
    c.innerHTML=`
      <div class="card" style="background:rgba(239,68,68,.05);border-color:rgba(239,68,68,.2);">
        <div class="section-title" style="color:#ef4444;">⚠️ Defaulters (${def.length})</div>
        ${def.length===0?'<p style="color:var(--muted);font-size:13px;">No defaulters 🎉</p>':def.map(m=>`
          <div class="member-card" style="margin-bottom:8px;" onclick="openMemberDetail(${m.id})">
            <div class="member-avatar" style="background:${m.color}22;border:1.5px solid ${m.color}55;color:${m.color};">${m.initials}</div>
            <div class="member-info"><div class="member-name">${m.name}</div><div class="member-slot" style="color:#ef4444;">Only ${m.paidMonths} months paid</div><div class="mini-bar"><div class="mini-bar-fill" style="background:linear-gradient(135deg,#ef4444,#f87171);width:${Math.round(m.paidMonths/TOTAL_MONTHS*100)}%"></div></div></div>
            <div style="text-align:right;"><div class="member-paid" style="color:#ef4444;">${m.paidMonths}/${TOTAL_MONTHS}</div></div>
          </div>`).join('')}
      </div>
      <div class="card" style="background:rgba(245,158,11,.05);border-color:rgba(245,158,11,.2);">
        <div class="section-title" style="color:#f59e0b;">⏳ Needs Attention (${late.length})</div>
        ${late.length===0?'<p style="color:var(--muted);font-size:13px;">All on track 👍</p>':late.map(m=>`
          <div class="member-card" style="margin-bottom:8px;" onclick="openMemberDetail(${m.id})">
            <div class="member-avatar" style="background:${m.color}22;border:1.5px solid ${m.color}55;color:${m.color};">${m.initials}</div>
            <div class="member-info"><div class="member-name">${m.name}</div><div class="member-slot" style="color:#f59e0b;">${m.paidMonths} months paid</div><div class="mini-bar"><div class="mini-bar-fill amber" style="width:${Math.round(m.paidMonths/TOTAL_MONTHS*100)}%"></div></div></div>
            <div style="text-align:right;"><div class="member-paid" style="color:#f59e0b;">${m.paidMonths}/${TOTAL_MONTHS}</div></div>
          </div>`).join('')}
      </div>`;
  }
}

function navigate(page,el){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  el.classList.add('active');
  if(page==='members')renderMembers(members);
  if(page==='pay')initPayPage();
  if(page==='report')renderReport();
}

function showToast(msg){
  const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2800);
}

renderMonthGrid();
</script>

</body>
</html>

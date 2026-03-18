// --- DATABASE INITIALIZATION ---
const firebaseConfig = { 
    apiKey: "AIzaSyCqb7gAbpa3UabPU3g_YhNITuPWtWPY4KU", 
    authDomain: "ak-events-2016.firebaseapp.com", 
    projectId: "ak-events-2016" 
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
let _cache = { m: [], g: [], p: [] };

// --- SYNC & SEARCH ---
async function sync() {
    const [m, g, p] = await Promise.all([
        db.collection('members').get(), 
        db.collection('groups').get(), 
        db.collection('payments').get()
    ]);
    _cache.m = m.docs.map(d => ({id:d.id, ...d.data()}));
    _cache.g = g.docs.map(d => ({id:d.id, ...d.data()}));
    _cache.p = p.docs.map(d => ({id:d.id, ...d.data()}));
    
    document.getElementById('stM').innerText = _cache.m.length;
    document.getElementById('stG').innerText = _cache.g.length;
}

function handleSearch(val, listId, inputId, isMain) {
    const list = document.getElementById(listId);
    if (val.length < 1) { list.style.display = 'none'; return; }
    const filtered = _cache.m.filter(m => m.name.toLowerCase().includes(val.toLowerCase()));
    list.innerHTML = filtered.map(m => `<div class="suggestion-item" onclick="onSelect('${m.id}','${m.name}','${listId}','${inputId}',${isMain})">${m.name}</div>`).join('');
    list.style.display = 'block';
}

function onSelect(id, name, listId, inputId, isMain) {
    document.getElementById(inputId).value = name;
    document.getElementById(listId).style.display = 'none';
    if(isMain) renderLedger(id);
    else {
        document.getElementById('pSelectedMid').value = id;
        const member = _cache.m.find(x => x.id === id);
        document.getElementById('pGroup').innerHTML = (member.groupIds || []).map(gid => {
            const group = _cache.g.find(g => g.id === gid);
            return `<option value="${gid}">${group ? group.name : 'Unknown Group'}</option>`;
        }).join('');
        checkChitStatus();
    }
}

// --- CORE ACTIONS ---
async function savePayment() {
    const pAmt = parseFloat(document.getElementById('pPaid').value) || 0;
    const chitAmt = parseFloat(document.getElementById('pChit').value) || 0;
    
    const data = {
        memberId: document.getElementById('pSelectedMid').value,
        groupId: document.getElementById('pGroup').value,
        amountPaid: pAmt,
        balance: chitAmt - pAmt,
        mode: document.getElementById('pMode').value,
        chitPicked: document.getElementById('pPicked').value,
        date: document.getElementById('pDate').value,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    if(!data.memberId) return alert("Please select a member");
    
    await db.collection('payments').add(data);
    closeModal('payModal'); 
    sync();
    alert("Payment Synced Successfully!");
}

async function createMember() {
    const name = document.getElementById('memN').value;
    const phone = document.getElementById('memP').value;
    if(!name) return;
    await db.collection('members').add({ name, phone, groupIds: [] });
    closeModal('memModal'); sync();
}

async function createGroup() {
    const name = document.getElementById('grpN').value;
    const duration = document.getElementById('grpD').value;
    await db.collection('groups').add({ name, duration });
    closeModal('grpModal'); sync();
}

// --- UI HELPERS ---
function openModal(id) { 
    if(id === 'payModal') document.getElementById('pDate').value = new Date().toISOString().split('T')[0];
    document.getElementById(id).style.display = 'block'; 
}
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
function toggleHistory() {
    const el = document.getElementById('hist');
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

// Init
sync();

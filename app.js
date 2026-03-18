async function savePayment() {
    // 1. Capture Inputs with Fallbacks
    const mId = document.getElementById('pSelectedMid').value;
    const gId = document.getElementById('pGroup').value;
    const monthVal = document.getElementById('pMonthNum').value; 
    const chitAmt = parseFloat(document.getElementById('pChit').value) || 0;
    const paidAmt = parseFloat(document.getElementById('pPaid').value) || 0;
    const pDate = document.getElementById('pDate').value;

    // 2. Validation Guard Clauses
    if (!mId) return alert("❌ Please select a Member first!");
    if (!gId) return alert("❌ Please select a Group!");
    if (!monthVal) return alert("❌ Please enter the Month Number!");
    if (!pDate) return alert("❌ Please select a Payment Date!");

    // 3. Construct Data Object
    const data = {
        memberId: mId,
        groupId: gId,
        monthPaid: parseInt(monthVal), // Ensure it's a number for sorting
        amountPaid: paidAmt,
        balance: chitAmt - paidAmt,    // Auto-calculates balance
        mode: document.getElementById('pMode').value,
        chitPicked: document.getElementById('pPicked').value,
        date: pDate,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        // 4. Save to Firestore
        await db.collection('payments').add(data);
        
        // 5. UI Cleanup & Refresh
        alert(`✅ Payment for Month ${monthVal} saved!`);
        closeModal('payModal');
        resetPayForm(); // Important: Clear fields for the next entry
        await sync();   // Refresh the dashboard stats
        
    } catch (error) {
        console.error("Error saving payment: ", error);
        alert("System Error: Could not save payment. Check console.");
    }
}

// Add this helper to clear your form
function resetPayForm() {
    const fields = ['pMSearch', 'pSelectedMid', 'pMonthNum', 'pChit', 'pPaid'];
    fields.forEach(id => document.getElementById(id).value = '');
    document.getElementById('pGroup').innerHTML = '<option value="">-- Select Member First --</option>';
}

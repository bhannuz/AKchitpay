async function savePayment() {
    // Add this to get the month value (you'll need to add the input to HTML below)
    const monthVal = document.getElementById('pMonthNum').value; 

    const data = {
        memberId: document.getElementById('pSelectedMid').value,
        groupId: document.getElementById('pGroup').value,
        monthPaid: monthVal, // Records which month this is for (1, 2, 3...)
        amountPaid: parseFloat(document.getElementById('pPaid').value) || 0,
        balance: (parseFloat(document.getElementById('pChit').value) || 0) - (parseFloat(document.getElementById('pPaid').value) || 0),
        mode: document.getElementById('pMode').value,
        chitPicked: document.getElementById('pPicked').value,
        date: document.getElementById('pDate').value,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    if(!data.memberId) return alert("Please select a member");
    
    await db.collection('payments').add(data);
    closeModal('payModal'); 
    sync();
}

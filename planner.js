// --- WHATSAPP LOGIC ---
function sendReminder(phone, name, groupName) {
    if (!phone) return alert("No phone number found!");
    
    const cleanPhone = phone.replace(/\D/g, '');
    const finalPhone = cleanPhone.length === 10 ? "91" + cleanPhone : cleanPhone;
    
    const msg = `Hello ${name}, this is a reminder from AK Chit Funds. Your payment for Group: ${groupName} is due. Please ignore if already paid.`;
    window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(msg)}`, '_blank');
}

// --- GROUPS TAB RENDERING ---
function renderGroupsView() {
    const container = document.getElementById('groupsContent');
    
    if (_cache.g.length === 0) {
        container.innerHTML = `<div class="text-center p-5">No groups created yet.</div>`;
        return;
    }

    container.innerHTML = _cache.g.map(group => {
        // Find members linked to this group
        const groupMembers = _cache.m.filter(m => 
            m.groupId === group.id || (m.groupIds && m.groupIds.includes(group.id))
        );

        return `
            <div class="group-card">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="text-warning fw-bold mb-0">🏦 ${group.name}</h5>
                    <span class="badge-v3">${groupMembers.length} Members</span>
                </div>
                <div class="table-responsive">
                    <table class="table-history">
                        <thead>
                            <tr>
                                <th>Member</th>
                                <th>Status</th>
                                <th class="text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${groupMembers.map(m => {
                                // Check if they paid this month
                                const currentMonth = new Date().getMonth() + 1;
                                const hasPaid = _cache.p.some(p => p.memberId === m.id && p.groupId === group.id);
                                
                                return `
                                    <tr>
                                        <td>${m.name}</td>
                                        <td>${hasPaid ? '<span class="status-paid">Paid</span>' : '<span class="status-pending">Pending</span>'}</td>
                                        <td class="text-end">
                                            <button class="btn-wa" onclick="sendReminder('${m.phone}', '${m.name}', '${group.name}')">📲 Remind</button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }).join('');
}

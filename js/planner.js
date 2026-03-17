const ChitPlanner = {
    generateSchedule: function(amount, members, duration, escalationRate) {
        const r = escalationRate / 100;
        let basePay;
        if (r > 0) {
            const factor = (Math.pow(1 + r, duration) - 1) / r;
            basePay = amount / factor;
        } else {
            basePay = amount / members;
        }

        return Array.from({ length: duration }, (_, i) => {
            const mp = Math.round(basePay * Math.pow(1 + r, i));
            return {
                month: i + 1,
                pay: mp,
                collected: mp * members,
                profit: (mp * members) - amount
            };
        });
    }
};

async function loadMemberLedger() {
    const mid = document.getElementById('summaryView')?.value;
    if (!mid) return;
    const ps = await getCollection('payments');
    const mPays = ps.filter(p => p.memberId === mid);
    // Render logic for the ledger table...
}

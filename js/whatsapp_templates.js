/**
 * WhatsApp Template Management System
 * Handles creation, versioning, and usage of message templates
 */

// ============================================
// TEMPLATE MANAGEMENT FUNCTIONS
// ============================================

/**
 * Load all WhatsApp templates from Firebase
 */
async function loadWhatsAppTemplates() {
    try {
        const snapshot = await db.collection('whatsappTemplates')
            .orderBy('type')
            .orderBy('version', 'desc')
            .get();
        
        window.whatsappTemplates = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        console.log('✅ Loaded templates:', window.whatsappTemplates.length);
        return window.whatsappTemplates;
    } catch (error) {
        console.error('❌ Error loading templates:', error);
        return [];
    }
}

/**
 * Save new WhatsApp template
 */
async function saveWhatsAppTemplate(templateData) {
    try {
        const { type, name, message, variables } = templateData;
        
        if (!type || !name || !message) {
            alert('❌ Please fill all required fields');
            return;
        }
        
        // Get next version number
        const existingTemplates = window.whatsappTemplates.filter(t => t.type === type && t.name === name);
        const nextVersion = existingTemplates.length > 0 
            ? Math.max(...existingTemplates.map(t => t.version || 1)) + 1 
            : 1;
        
        const newTemplate = {
            type: type,
            name: name,
            message: message,
            variables: extractVariables(message),
            version: nextVersion,
            isActive: true,
            createdAt: new Date(),
            createdBy: CURRENT_USER?.email || 'admin',
            updatedAt: new Date()
        };
        
        const docRef = await db.collection('whatsappTemplates').add(newTemplate);
        
        console.log('✅ Template saved:', docRef.id);
        await loadWhatsAppTemplates();
        return docRef.id;
    } catch (error) {
        console.error('❌ Error saving template:', error);
        alert('Failed to save template');
    }
}

/**
 * Update existing template
 */
async function updateWhatsAppTemplate(templateId, templateData) {
    try {
        await db.collection('whatsappTemplates').doc(templateId).update({
            ...templateData,
            variables: extractVariables(templateData.message),
            updatedAt: new Date()
        });
        
        console.log('✅ Template updated:', templateId);
        await loadWhatsAppTemplates();
    } catch (error) {
        console.error('❌ Error updating template:', error);
    }
}

/**
 * Delete (deactivate) template
 */
async function deleteWhatsAppTemplate(templateId) {
    try {
        await db.collection('whatsappTemplates').doc(templateId).update({
            isActive: false,
            deletedAt: new Date()
        });
        
        console.log('✅ Template deactivated:', templateId);
        await loadWhatsAppTemplates();
    } catch (error) {
        console.error('❌ Error deleting template:', error);
    }
}

/**
 * Get template by ID
 */
function getWhatsAppTemplate(templateId) {
    return window.whatsappTemplates?.find(t => t.id === templateId);
}

/**
 * Get all active templates by type
 */
function getTemplatesByType(type) {
    return window.whatsappTemplates?.filter(t => t.type === type && t.isActive) || [];
}

/**
 * Extract variables from message ({{variable}})
 */
function extractVariables(message) {
    const regex = /{{(\w+)}}/g;
    const variables = [];
    let match;
    
    while ((match = regex.exec(message)) !== null) {
        if (!variables.includes(match[1])) {
            variables.push(match[1]);
        }
    }
    
    return variables;
}

// ============================================
// MESSAGE PREVIEW & REPLACEMENT
// ============================================

/**
 * Replace variables in template with actual values
 */
function replaceTemplateVariables(message, data) {
    let processedMessage = message;
    
    const replacements = {
        memberName: data.memberName || '—',
        amount: formatAmount(data.amount) || '—',
        dueDate: formatDate(data.dueDate) || '—',
        groupName: data.groupName || '—',
        chitNumber: data.chitNumber || '—',
        paidAmount: formatAmount(data.paidAmount) || '—',
        balance: formatAmount(data.balance) || '—',
        paymentMode: data.paymentMode || '—',
        timestamp: formatDate(new Date()) || '—',
        nextDueDate: formatDate(data.nextDueDate) || '—',
        slot: data.slot || data.chitNumber || '—'
    };
    
    // Replace all variables
    Object.keys(replacements).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        processedMessage = processedMessage.replace(regex, replacements[key]);
    });
    
    return processedMessage;
}

/**
 * Get preview of template with sample data
 */
function getTemplatePreview(template) {
    const sampleData = {
        memberName: 'John Doe',
        amount: 23077,
        dueDate: '2026-05-05',
        groupName: '3 Lakhs',
        chitNumber: '1',
        paidAmount: 23077,
        balance: 0,
        paymentMode: 'UPI',
        nextDueDate: '2026-06-05'
    };
    
    return replaceTemplateVariables(template.message, sampleData);
}

// ============================================
// UI COMPONENTS
// ============================================

/**
 * Open template selection modal
 */
function openTemplateModal(onSelectCallback) {
    const templates = window.whatsappTemplates?.filter(t => t.isActive) || [];
    
    let html = `
        <div class="modal-overlay" onclick="closeTemplateModal(event)">
            <div class="modal-content" style="max-width:500px;" onclick="event.stopPropagation()">
                <h3>Select WhatsApp Template</h3>
                
                <div class="template-tabs">
                    <button class="tab-btn active" onclick="filterTemplateType('all')">All Templates</button>
                    <button class="tab-btn" onclick="filterTemplateType('reminder')">Reminders</button>
                    <button class="tab-btn" onclick="filterTemplateType('payment')">Payment Ack</button>
                    <button class="tab-btn" onclick="filterTemplateType('followup')">Follow-ups</button>
                </div>
                
                <div id="templateList" style="max-height:400px; overflow-y:auto;">
    `;
    
    templates.forEach(template => {
        const preview = getTemplatePreview(template).substring(0, 80) + '...';
        html += `
            <div class="template-item" style="padding:12px; border:1px solid #ddd; border-radius:8px; margin:8px 0; cursor:pointer;" onclick="selectTemplate('${template.id}', '${onSelectCallback}')">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="font-weight:700; color:#34d399;">${template.type.toUpperCase()}</div>
                        <div style="font-size:0.9rem; color:#a5b4fc;">${template.name} (v${template.version})</div>
                        <div style="font-size:0.8rem; color:#888; margin-top:4px;">${preview}</div>
                    </div>
                    <button class="btn-sm" onclick="event.stopPropagation(); previewTemplate('${template.id}')">Preview</button>
                </div>
            </div>
        `;
    });
    
    html += `
                </div>
                
                <div style="margin-top:16px; display:flex; gap:8px;">
                    <button class="btn-secondary" onclick="closeTemplateModal()">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', html);
}

/**
 * Close template modal
 */
function closeTemplateModal(event) {
    if (event && event.target !== event.currentTarget) return;
    document.querySelector('.modal-overlay')?.remove();
}

/**
 * Select template and populate message
 */
function selectTemplate(templateId, onSelectCallback) {
    const template = getWhatsAppTemplate(templateId);
    closeTemplateModal();
    
    if (onSelectCallback && typeof window[onSelectCallback] === 'function') {
        window[onSelectCallback](template);
    }
    
    console.log('✅ Template selected:', template.name);
}

/**
 * Preview template in full
 */
function previewTemplate(templateId) {
    const template = getWhatsAppTemplate(templateId);
    const preview = getTemplatePreview(template);
    
    alert(`📱 Template Preview\n\nType: ${template.type}\nName: ${template.name}\nVersion: ${template.version}\n\n---\n\n${preview}`);
}

// ============================================
// SEND MESSAGE FUNCTIONS
// ============================================

/**
 * Send template message via WhatsApp
 */
async function sendTemplateViaWhatsApp(templateId, memberData) {
    try {
        const template = getWhatsAppTemplate(templateId);
        
        if (!template) {
            alert('❌ Template not found');
            return;
        }
        
        // Replace variables
        const message = replaceTemplateVariables(template.message, memberData);
        
        // Prepare WhatsApp message
        const phoneNumber = memberData.phoneNumber;
        const encodedMessage = encodeURIComponent(message);
        
        // Open WhatsApp Web
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
        
        // Log message sent
        await logMessageSent(templateId, memberData.memberId, message);
        
        console.log('✅ Message sent to:', phoneNumber);
    } catch (error) {
        console.error('❌ Error sending message:', error);
    }
}

/**
 * Log sent messages for analytics
 */
async function logMessageSent(templateId, memberId, message) {
    try {
        await db.collection('messageLogs').add({
            templateId: templateId,
            memberId: memberId,
            message: message,
            sentAt: new Date(),
            sentBy: CURRENT_USER?.email || 'admin',
            platform: 'whatsapp'
        });
        
        console.log('✅ Message logged');
    } catch (error) {
        console.error('❌ Error logging message:', error);
    }
}

// ============================================
// DROPDOWN TEMPLATE SELECTOR
// ============================================

/**
 * Create dropdown for template selection
 */
function createTemplateDropdown(templateType, elementId) {
    const templates = getTemplatesByType(templateType);
    
    let html = `<select id="${elementId}" onchange="loadTemplatePreview('${elementId}')">
        <option value="">-- Select ${templateType} Template --</option>`;
    
    templates.forEach(template => {
        html += `<option value="${template.id}">${template.name} (v${template.version})</option>`;
    });
    
    html += `</select>`;
    
    return html;
}

/**
 * Load and show template preview when selected
 */
function loadTemplatePreview(elementId) {
    const templateId = document.getElementById(elementId).value;
    const template = getWhatsAppTemplate(templateId);
    
    if (!template) return;
    
    const preview = getTemplatePreview(template);
    const previewElementId = elementId + '_preview';
    
    let previewHtml = `
        <div id="${previewElementId}" style="
            background: #f0f0f0;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 12px;
            margin-top: 8px;
            font-size: 0.9rem;
            white-space: pre-wrap;
            word-break: break-word;
        ">${preview}</div>
    `;
    
    const existingPreview = document.getElementById(previewElementId);
    if (existingPreview) {
        existingPreview.outerHTML = previewHtml;
    } else {
        document.getElementById(elementId).insertAdjacentHTML('afterend', previewHtml);
    }
}

// ============================================
// ADMIN PANEL - CREATE/EDIT TEMPLATES
// ============================================

/**
 * Open template editor modal
 */
function openTemplateEditor(templateId = null) {
    const template = templateId ? getWhatsAppTemplate(templateId) : null;
    
    const templateTypes = [
        { value: 'reminder', label: '📬 Payment Reminder' },
        { value: 'payment', label: '✅ Payment Received' },
        { value: 'followup', label: '⏰ Follow-up Notice' }
    ];
    
    let html = `
        <div class="modal-overlay" onclick="closeTemplateEditor(event)">
            <div class="modal-content" style="max-width:600px;" onclick="event.stopPropagation()">
                <h3>${templateId ? 'Edit' : 'Create New'} WhatsApp Template</h3>
                
                <form id="templateForm">
                    <div class="form-group">
                        <label>Template Type *</label>
                        <select id="templateType" required>
                            <option value="">-- Select Type --</option>
    `;
    
    templateTypes.forEach(type => {
        const selected = template?.type === type.value ? 'selected' : '';
        html += `<option value="${type.value}" ${selected}>${type.label}</option>`;
    });
    
    html += `
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Template Name *</label>
                        <input type="text" id="templateName" value="${template?.name || ''}" placeholder="e.g., Standard Payment Reminder" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Message *</label>
                        <textarea id="templateMessage" rows="8" placeholder="Hi {{memberName}}, your payment of ₹{{amount}} is due on {{dueDate}}..." required>${template?.message || ''}</textarea>
                        <small>Use {{variable}} for dynamic content</small>
                    </div>
                    
                    <div class="form-group">
                        <label>Available Variables:</label>
                        <div style="display:flex; flex-wrap:wrap; gap:6px;">
                            ${['memberName', 'amount', 'dueDate', 'groupName', 'balance', 'paidAmount', 'paymentMode', 'nextDueDate']
                                .map(v => `<span style="background:#34d399; color:#000; padding:4px 8px; border-radius:4px; font-size:0.8rem; cursor:pointer;" onclick="insertVariable('${v}')">\{\{${v}\}\}</span>`)
                                .join('')}
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Preview:</label>
                        <div id="templatePreview" style="background:#f9f9f9; border:1px solid #ddd; border-radius:8px; padding:12px; white-space:pre-wrap; word-break:break-word; min-height:100px; max-height:200px; overflow-y:auto;">
                            ${template ? getTemplatePreview(template) : 'Preview will appear here...'}
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="templateActive" ${template?.isActive !== false ? 'checked' : ''}>
                            Active (Use this template)
                        </label>
                    </div>
                    
                    <div style="margin-top:16px; display:flex; gap:8px;">
                        <button type="button" class="btn-secondary" onclick="closeTemplateEditor()">Cancel</button>
                        <button type="button" class="btn-primary" onclick="submitTemplateForm('${templateId || ''}')">${templateId ? 'Update' : 'Create'} Template</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', html);
}

/**
 * Insert variable into message
 */
function insertVariable(variable) {
    const textarea = document.getElementById('templateMessage');
    const cursorPos = textarea.selectionStart;
    const textBefore = textarea.value.substring(0, cursorPos);
    const textAfter = textarea.value.substring(cursorPos);
    
    textarea.value = textBefore + `{{${variable}}}` + textAfter;
    textarea.focus();
    textarea.selectionStart = cursorPos + variable.length + 4;
    
    updateTemplatePreview();
}

/**
 * Update preview when message changes
 */
function updateTemplatePreview() {
    const message = document.getElementById('templateMessage').value;
    const sampleData = {
        memberName: 'John Doe',
        amount: 23077,
        dueDate: '2026-05-05',
        groupName: '3 Lakhs',
        balance: 0,
        paidAmount: 23077,
        paymentMode: 'UPI',
        nextDueDate: '2026-06-05'
    };
    
    const preview = replaceTemplateVariables(message, sampleData);
    document.getElementById('templatePreview').textContent = preview;
}

/**
 * Submit template form
 */
async function submitTemplateForm(templateId) {
    const templateData = {
        type: document.getElementById('templateType').value,
        name: document.getElementById('templateName').value,
        message: document.getElementById('templateMessage').value,
        isActive: document.getElementById('templateActive').checked
    };
    
    if (templateId) {
        await updateWhatsAppTemplate(templateId, templateData);
    } else {
        await saveWhatsAppTemplate(templateData);
    }
    
    closeTemplateEditor();
}

/**
 * Close template editor
 */
function closeTemplateEditor(event) {
    if (event && event.target !== event.currentTarget) return;
    document.querySelector('.modal-overlay')?.remove();
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    await loadWhatsAppTemplates();
    console.log('✅ WhatsApp Templates System Loaded');
});


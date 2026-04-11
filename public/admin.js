let adminToken = null;

// Admin login
async function adminLogin() {
  const username = document.getElementById('adminUsername').value;
  const password = document.getElementById('adminPassword').value;
  const errorEl = document.getElementById('loginError');
  errorEl.textContent = '';

  if (!username || !password) {
    errorEl.textContent = 'أدخل اسم المستخدم وكلمة المرور';
    return;
  }

  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      errorEl.textContent = data.error || 'بيانات غير صحيحة';
      return;
    }

    adminToken = data.token;
    localStorage.setItem('adminToken', adminToken);

    // Show dashboard
    document.getElementById('adminLogin').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');

    // Load data
    loadCategories();
    loadSoftware();
    loadInvitations();
    loadTickets();
  } catch (err) {
    errorEl.textContent = 'خطأ في الاتصال بالخادم';
    console.error(err);
  }
}

// Switch tabs
function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.admin-nav-btn').forEach(btn => btn.classList.remove('active'));

  // Show selected tab
  document.getElementById(tabName + 'Tab').classList.add('active');
  event.target.classList.add('active');
}

// ============= CATEGORIES =============

async function loadCategories() {
  try {
    const response = await fetch('/api/categories');
    const categories = await response.json();

    const container = document.getElementById('categoriesList');
    container.innerHTML = '';

    if (categories.length === 0) {
      container.innerHTML = '<p style="padding: 20px; text-align: center; color: #999;">لا توجد فئات</p>';
      return;
    }

    categories.forEach(cat => {
      const item = document.createElement('div');
      item.className = 'item';
      item.innerHTML = `
        <div class="item-content">
          <h3>${cat.name}</h3>
          <p>${cat.description || 'بدون وصف'}</p>
        </div>
        <div class="item-actions">
          <button class="btn-edit" onclick="editCategory('${cat.id}', '${cat.name}', '${cat.description || ''}')">تعديل</button>
          <button class="btn-delete" onclick="deleteCategory('${cat.id}')">حذف</button>
        </div>
      `;
      container.appendChild(item);
    });

    // Update category select in software tab
    updateCategorySelect(categories);
  } catch (err) {
    console.error('Error loading categories:', err);
  }
}

async function createCategory() {
  const name = document.getElementById('categoryName').value.trim();
  const description = document.getElementById('categoryDesc').value.trim();

  if (!name) {
    alert('أدخل اسم الفئة');
    return;
  }

  try {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ name, description })
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.error || 'حدث خطأ');
      return;
    }

    document.getElementById('categoryName').value = '';
    document.getElementById('categoryDesc').value = '';
    loadCategories();
  } catch (err) {
    console.error('Error creating category:', err);
  }
}

async function editCategory(id, currentName, currentDesc) {
  const newName = prompt('اسم الفئة:', currentName);
  if (!newName) return;

  const newDesc = prompt('وصف الفئة:', currentDesc);

  try {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ name: newName, description: newDesc })
    });

    if (!response.ok) throw new Error('Failed to update');
    loadCategories();
  } catch (err) {
    alert('خطأ في التعديل');
    console.error(err);
  }
}

async function deleteCategory(id) {
  if (!confirm('هل تريد حذف هذه الفئة؟')) return;

  try {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    if (!response.ok) throw new Error('Failed to delete');
    loadCategories();
  } catch (err) {
    alert('خطأ في الحذف');
    console.error(err);
  }
}

function updateCategorySelect(categories) {
  const select = document.getElementById('softwareCategory');
  select.innerHTML = '<option value="">-- اختر الفئة --</option>';
  
categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.name;
    select.appendChild(option);
  });
}

// ============= SOFTWARE =============

async function loadSoftware() {
  try {
    const response = await fetch('/api/software');
    const software = await response.json();

    const container = document.getElementById('softwareList');
    container.innerHTML = '';

    if (software.length === 0) {
      container.innerHTML = '<p style="padding: 20px; text-align: center; color: #999;">لا توجد برامج</p>';
      return;
    }

    software.forEach(app => {
      const item = document.createElement('div');
      item.className = 'item';
      item.innerHTML = `
        <div class="item-content">
          <h3>${app.name}</h3>
          <p>${app.description || 'بدون وصف'}</p>
          <p style="font-size: 0.85em; color: #999;">الإصدار: ${app.version} | الحجم: ${app.fileSize}</p>
        </div>
        <div class="item-actions">
          <button class="btn-edit" onclick="editSoftware('${app.id}')">تعديل</button>
          <button class="btn-delete" onclick="deleteSoftware('${app.id}')">حذف</button>
        </div>
      `;
      container.appendChild(item);
    });
  } catch (err) {
    console.error('Error loading software:', err);
  }
}

async function createSoftware() {
  const name = document.getElementById('softwareName').value.trim();
  const description = document.getElementById('softwareDesc').value.trim();
  const version = document.getElementById('softwareVersion').value.trim();
  const categoryId = document.getElementById('softwareCategory').value;
  const downloadUrl = document.getElementById('softwareUrl').value.trim();
  const fileSize = document.getElementById('softwareSize').value.trim();
  const tags = document.getElementById('softwareTags').value.trim();

  if (!name || !categoryId || !downloadUrl) {
    alert('الرجاء ملء الحقول المطلوبة');
    return;
  }

  try {
    const response = await fetch('/api/software', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name, description, version, categoryId, downloadUrl, fileSize, tags
      })
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.error || 'حدث خطأ');
      return;
    }

    // Clear form
    document.getElementById('softwareName').value = '';
    document.getElementById('softwareDesc').value = '';
    document.getElementById('softwareVersion').value = '';
    document.getElementById('softwareCategory').value = '';
    document.getElementById('softwareUrl').value = '';
    document.getElementById('softwareSize').value = '';
    document.getElementById('softwareTags').value = '';

    loadSoftware();
  } catch (err) {
    console.error('Error creating software:', err);
  }
}

async function deleteSoftware(id) {
  if (!confirm('هل تريد حذف هذا البرنامج؟')) return;

  try {
    const response = await fetch(`/api/software/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    if (!response.ok) throw new Error('Failed to delete');
    loadSoftware();
  } catch (err) {
    alert('خطأ في الحذف');
    console.error(err);
  }
}

function editSoftware(id) {
  alert('ميزة التعديل قريباً');
}

// ============= INVITATIONS =============

async function loadInvitations() {
  try {
    const response = await fetch('/api/invitations', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    const codes = await response.json();
    const container = document.getElementById('invitationsList');
    container.innerHTML = '';

    if (codes.length === 0) {
      container.innerHTML = '<p style="padding: 20px; text-align: center; color: #999;">لا توجد أكواد</p>';
      return;
    }

    codes.forEach(code => {
      const expiresAt = new Date(code.expiresAt);
      const isExpired = expiresAt < new Date();
      const isUsed = code.isUsed;

      const item = document.createElement('div');
      item.className = 'item';
      item.innerHTML = `
        <div class="item-content">
          <h3 style="font-family: monospace; letter-spacing: 2px;">${code.code}</h3>
          <p>
            ${isUsed ? '<span class="status-badge status-closed">✓ مستخدم</span>' : '<span class="status-badge status-open">⏳ متاح</span>'}
            ${isExpired ? '<span class="status-badge status-pending">⚠️ منتهي</span>' : ''}
          </p>
          <p style="font-size: 0.85em; color: #999;">
            ينتهي: ${expiresAt.toLocaleDateString('ar-SA')}
          </p>
        </div>
        <div class="item-actions">
          <button class="btn-delete" onclick="deleteCode('${code.id}')">حذف</button>
        </div>
      `;
      container.appendChild(item);
    });
  } catch (err) {
    console.error('Error loading invitations:', err);
  }
}

async function generateCode() {
  const duration = parseInt(document.getElementById('codeDuration').value);

  if (!duration || duration < 1) {
    alert('أدخل مدة صحيحة');
    return;
  }

  try {
    const response = await fetch('/api/invitations/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ durationDays: duration })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || 'حدث خطأ');
      return;
    }

    alert(`تم إنشاء الكود:\n${data.code}\nينتهي بعد: ${duration} يوم`);
    document.getElementById('codeDuration').value = '30';
    loadInvitations();
  } catch (err) {
    console.error('Error generating code:', err);
  }
}

async function deleteCode(id) {
  if (!confirm('هل تريد حذف هذا الكود؟')) return;

  try {
    const response = await fetch(`/api/invitations/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    if (!response.ok) throw new Error('Failed to delete');
    loadInvitations();
  } catch (err) {
    alert('خطأ في الحذف');
    console.error(err);
  }
}

// ============= TICKETS =============

async function loadTickets() {
  try {
    const response = await fetch('/api/tickets', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    const tickets = await response.json();
    const container = document.getElementById('ticketsList');
    container.innerHTML = '';

    if (tickets.length === 0) {
      container.innerHTML = '<p style="padding: 20px; text-align: center; color: #999;">لا توجد دعاوي</p>';
      return;
    }

    tickets.forEach(ticket => {
      const item = document.createElement('div');
      item.className = 'item';
      item.innerHTML = `
        <div class="item-content">
          <h3>${ticket.title}</h3>
          <p>${ticket.description}</p>
          <p>
            <span class="status-badge ${ticket.status === 'open' ? 'status-open' : 'status-closed'}">${ticket.status === 'open' ? '📖 مفتوحة' : '✓ مغلقة'}</span>
            <span style="font-size: 0.85em; color: #999;">تاريخ: ${new Date(ticket.createdAt).toLocaleDateString('ar-SA')}</span>
          </p>
          ${ticket.response ? `<p><strong>الرد:</strong> ${ticket.response}</p>` : ''}
        </div>
        <div class="item-actions">
          <button class="btn-respond" onclick="respondToTicket('${ticket.id}')">رد</button>
        </div>
      `;
      container.appendChild(item);
    });
  } catch (err) {
    console.error('Error loading tickets:', err);
  }
}

async function respondToTicket(ticketId) {
  const response = prompt('الرد على الدعوة:');
  if (!response) return;

  try {
    const res = await fetch(`/api/tickets/${ticketId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'closed', response })
    });

    if (!res.ok) throw new Error('Failed to respond');
    loadTickets();
  } catch (err) {
    alert('خطأ في الرد');
    console.error(err);
  }
}

// Admin logout
function adminLogout() {
  localStorage.removeItem('adminToken');
  adminToken = null;
  document.getElementById('adminDashboard').classList.add('hidden');
  document.getElementById('adminLogin').classList.remove('hidden');
  document.getElementById('adminUsername').value = '';
  document.getElementById('adminPassword').value = '';
}

// Check if already logged in
window.addEventListener('DOMContentLoaded', () => {
  const savedToken = localStorage.getItem('adminToken');
  if (savedToken) {
    adminToken = savedToken;
    document.getElementById('adminLogin').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
    loadCategories();
    loadSoftware();
    loadInvitations();
    loadTickets();
  }
});
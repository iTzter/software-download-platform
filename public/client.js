let userCode = null;

// Verify invitation code
async function verifyCode() {
  const code = document.getElementById('invitationCode').value.trim().toUpperCase();
  const errorEl = document.getElementById('loginError');
  errorEl.textContent = '';

  if (!code) {
    errorEl.textContent = 'أدخل كود الدعوة';
    return;
  }

  try {
    const response = await fetch('/api/invitations/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    const data = await response.json();

    if (!response.ok) {
      errorEl.textContent = data.error || 'كود غير صحيح';
      return;
    }

    // Use the code
    await fetch('/api/invitations/use', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    userCode = code;
    localStorage.setItem('userCode', code);
    
    // Show main content
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('mainContent').classList.remove('hidden');

    // Load data
    loadCategories();
    loadSoftware();
  } catch (err) {
    errorEl.textContent = 'خطأ في الاتصال بالخادم';
    console.error(err);
  }
}

// Load categories
async function loadCategories() {
  try {
    const response = await fetch('/api/categories');
    const categories = await response.json();

    const container = document.getElementById('categoryButtons');
    container.innerHTML = '';

    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'nav-btn';
      btn.textContent = cat.name;
      btn.onclick = () => filterByCategory(cat.id);
      container.appendChild(btn);
    });
  } catch (err) {
    console.error('Error loading categories:', err);
  }
}

// Load software
async function loadSoftware() {
  try {
    const response = await fetch('/api/software');
    const software = await response.json();

    const container = document.getElementById('softwareList');
    container.innerHTML = '';

    if (software.length === 0) {
      container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 40px;">لا توجد برامج متاحة</p>';
      return;
    }

    software.forEach(app => {
      const card = document.createElement('div');
      card.className = 'software-card';
      card.innerHTML = `
        <div class="software-card-header">
          <h3>${app.name}</h3>
          <p>${app.version || 'آخر إصدار'}</p>
        </div>
        <div class="software-card-body">
          <p>${app.description || 'بدون وصف'}</p>
          <div class="software-meta">
            <span>📦 ${app.fileSize || 'حجم غير محدد'}</span>
            <span>📅 ${new Date(app.createdAt).toLocaleDateString('ar-SA')}</span>
          </div>
          ${app.tags ? `
            <div class="tags">
              ${app.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}
            </div>
          ` : ''}
        </div>
        <div class="software-card-footer">
          <a href="${app.downloadUrl}" target="_blank" class="download-btn">⬇️ تحميل</a>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading software:', err);
  }
}

// Filter by category
async function filterByCategory(categoryId) {
  // Update active button
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  try {
    let response;
    if (categoryId === 'all') {
      response = await fetch('/api/software');
    } else {
      response = await fetch(`/api/software/category/${categoryId}`);
    }

    const software = await response.json();
    const container = document.getElementById('softwareList');
    container.innerHTML = '';

    if (software.length === 0) {
      container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 40px;">لا توجد برامج في هذه الفئة</p>';
      return;
    }

    software.forEach(app => {
      const card = document.createElement('div');
      card.className = 'software-card';
      card.innerHTML = `
        <div class="software-card-header">
          <h3>${app.name}</h3>
          <p>${app.version || 'آخر إصدار'}</p>
        </div>
        <div class="software-card-body">
          <p>${app.description || 'بدون وصف'}</p>
          <div class="software-meta">
            <span>📦 ${app.fileSize || 'حجم غير محدد'}</span>
            <span>📅 ${new Date(app.createdAt).toLocaleDateString('ar-SA')}</span>
          </div>
          ${app.tags ? `
            <div class="tags">
              ${app.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}
            </div>
          ` : ''}
        </div>
        <div class="software-card-footer">
          <a href="${app.downloadUrl}" target="_blank" class="download-btn">⬇️ تحميل</a>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Error filtering software:', err);
  }
}

// Open ticket form
function openTicketForm() {
  document.getElementById('ticketModal').classList.remove('hidden');
}

// Close ticket form
function closeTicketForm() {
  document.getElementById('ticketModal').classList.add('hidden');
  document.getElementById('ticketTitle').value = '';
  document.getElementById('ticketDescription').value = '';
}

// Submit ticket
async function submitTicket() {
  const title = document.getElementById('ticketTitle').value.trim();
  const description = document.getElementById('ticketDescription').value.trim();
  const errorEl = document.getElementById('ticketError');
  errorEl.textContent = '';

  if (!title || !description) {
    errorEl.textContent = 'الرجاء ملء جميع الحقول';
    return;
  }

  try {
    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        userCode
      })
    });

    const data = await response.json();

    if (!response.ok) {
      errorEl.textContent = data.error || 'حدث خطأ';
      return;
    }

    alert('تم إرسال الدعوة بنجاح! سيتم التواصل معك قريباً.');
    closeTicketForm();
  } catch (err) {
    errorEl.textContent = 'خطأ في الاتصال بالخادم';
    console.error(err);
  }
}

// Logout
function logout() {
  localStorage.removeItem('userCode');
  userCode = null;
  document.getElementById('mainContent').classList.add('hidden');
  document.getElementById('loginSection').classList.remove('hidden');
  document.getElementById('invitationCode').value = '';
  document.getElementById('loginError').textContent = '';
}

// Check if already logged in
window.addEventListener('DOMContentLoaded', () => {
  const savedCode = localStorage.getItem('userCode');
  if (savedCode) {
    userCode = savedCode;
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
    loadCategories();
    loadSoftware();
  }
});
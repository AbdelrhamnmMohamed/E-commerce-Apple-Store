import { getCurrentUser } from "../../shared/store.js";
import { 
  getContactMessages, 
  deleteContactMessage, 
  markMessageAsRead 
} from "../../contact/contact.js";

// Check if user is admin
const currentUser = getCurrentUser();
if (!currentUser || currentUser.role !== 'admin') {
  alert('Access Denied! Only admins can view contact messages.');
  window.location.href = '../../index.html';
}

let currentFilter = 'all';

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

function updateStats() {
  const messages = getContactMessages();
  const unread = messages.filter(msg => msg.status === 'unread');
  const read = messages.filter(msg => msg.status === 'read');
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMessages = messages.filter(msg => {
    const msgDate = new Date(msg.createdAt);
    msgDate.setHours(0, 0, 0, 0);
    return msgDate.getTime() === today.getTime();
  });

  document.getElementById('totalMessages').textContent = messages.length;
  document.getElementById('unreadMessages').textContent = unread.length;
  document.getElementById('readMessages').textContent = read.length;
  document.getElementById('todayMessages').textContent = todayMessages.length;
}

function renderMessages() {
  const messages = getContactMessages();
  const container = document.getElementById('messagesContainer');
  const emptyState = document.getElementById('emptyState');
  
  // Sort by date (newest first)
  const sortedMessages = messages.sort((a, b) => b.createdAt - a.createdAt);
  
  // Filter messages
  let filtered = sortedMessages;
  if (currentFilter === 'unread') {
    filtered = sortedMessages.filter(msg => msg.status === 'unread');
  } else if (currentFilter === 'read') {
    filtered = sortedMessages.filter(msg => msg.status === 'read');
  }
  
  if (filtered.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }
  
  emptyState.style.display = 'none';
  
  container.innerHTML = filtered.map(msg => `
    <div class="message-card ${msg.status}" data-id="${msg.id}">
      <div class="message-header">
        <div>
          <h5 class="mb-1">
            <i class="fa fa-user-circle me-2 text-muted"></i>${msg.name}
          </h5>
          <div class="message-meta">
            <span><i class="fa fa-envelope me-1"></i>${msg.email}</span>
            <span><i class="fa fa-clock me-1"></i>${formatDate(msg.createdAt)}</span>
          </div>
        </div>
        <span class="badge-${msg.status}">
          ${msg.status === 'unread' ? 'New' : 'Read'}
        </span>
      </div>
      
      <div class="message-subject">
        <i class="fa fa-tag me-2"></i>${msg.subject}
      </div>
      
      <div class="message-body">
        ${msg.message}
      </div>
      
      <div class="message-actions">
        ${msg.status === 'unread' ? `
          <button class="btn btn-sm btn-primary mark-read" data-id="${msg.id}">
            <i class="fa fa-check me-1"></i>Mark as Read
          </button>
        ` : ''}
        <button class="btn btn-sm btn-outline-danger delete-msg" data-id="${msg.id}">
          <i class="fa fa-trash me-1"></i>Delete
        </button>
      </div>
    </div>
  `).join('');
  
  // Attach event listeners
  attachEventListeners();
}

function attachEventListeners() {
  // Mark as read
  document.querySelectorAll('.mark-read').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      markMessageAsRead(id);
      updateStats();
      renderMessages();
    });
  });
  
  // Delete message
  document.querySelectorAll('.delete-msg').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (confirm('Are you sure you want to delete this message?')) {
        deleteContactMessage(id);
        updateStats();
        renderMessages();
      }
    });
  });
}

// Filter tabs
document.querySelectorAll('.nav-link[data-filter]').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.nav-link[data-filter]').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    renderMessages();
  });
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  updateStats();
  renderMessages();
  
  // Auto-refresh every 30 seconds
  setInterval(() => {
    updateStats();
    renderMessages();
  }, 30000);
});


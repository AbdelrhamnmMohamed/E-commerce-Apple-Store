// Create a beautiful login prompt modal

export function showLoginPrompt(action = 'add items to your wishlist') {
  // Remove existing modal if any
  const existing = document.getElementById('loginPromptModal');
  if (existing) existing.remove();

  // Create modal HTML
  const modal = document.createElement('div');
  modal.id = 'loginPromptModal';
  modal.innerHTML = `
    <div class="login-prompt-overlay">
      <div class="login-prompt-card">
        <div class="login-prompt-icon">
          <i class="fa-solid fa-lock"></i>
        </div>
        <h3 class="login-prompt-title">Login Required</h3>
        <p class="login-prompt-message">Please log in to ${action}</p>
        <div class="login-prompt-buttons">
          <button class="btn-login" id="loginPromptYes">
            <i class="fa-solid fa-right-to-bracket me-2"></i>Go to Login
          </button>
          <button class="btn-cancel" id="loginPromptNo">Cancel</button>
        </div>
      </div>
    </div>
  `;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .login-prompt-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .login-prompt-card {
      background: white;
      border-radius: 16px;
      padding: 32px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      text-align: center;
      animation: slideUp 0.3s ease-out;
    }

    .login-prompt-icon {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      font-size: 28px;
      color: white;
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }

    .login-prompt-title {
      font-size: 24px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 12px 0;
      font-family: 'Poppins', sans-serif;
    }

    .login-prompt-message {
      font-size: 16px;
      color: #6b7280;
      margin: 0 0 28px 0;
      line-height: 1.5;
    }

    .login-prompt-buttons {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    .login-prompt-buttons button {
      padding: 12px 28px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      font-family: 'Poppins', sans-serif;
    }

    .btn-login {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-login:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
    }

    .btn-cancel {
      background: #f3f4f6;
      color: #6b7280;
    }

    .btn-cancel:hover {
      background: #e5e7eb;
      color: #374151;
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .login-prompt-card {
        background: #1f2937;
      }
      
      .login-prompt-title {
        color: #f9fafb;
      }
      
      .login-prompt-message {
        color: #d1d5db;
      }
      
      .btn-cancel {
        background: #374151;
        color: #d1d5db;
      }
      
      .btn-cancel:hover {
        background: #4b5563;
        color: #f3f4f6;
      }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(modal);

  // Return a promise that resolves when user clicks a button
  return new Promise((resolve) => {
    const yesBtn = document.getElementById('loginPromptYes');
    const noBtn = document.getElementById('loginPromptNo');
    const overlay = modal.querySelector('.login-prompt-overlay');

    const cleanup = () => {
      modal.remove();
      style.remove();
    };

    yesBtn.addEventListener('click', () => {
      cleanup();
      resolve(true);
    });

    noBtn.addEventListener('click', () => {
      cleanup();
      resolve(false);
    });

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        cleanup();
        resolve(false);
      }
    });

    // Close on Escape key
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        cleanup();
        resolve(false);
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  });
}



import { getCurrentUser } from "../shared/store.js";

// Save contact messages to localStorage
export function saveContactMessage(message) {
  const messages = JSON.parse(localStorage.getItem("contactMessages") || "[]");
  messages.push(message);
  localStorage.setItem("contactMessages", JSON.stringify(messages));
}

// Get all contact messages (admin only)
export function getContactMessages() {
  return JSON.parse(localStorage.getItem("contactMessages") || "[]");
}

// Delete contact message
export function deleteContactMessage(id) {
  const messages = getContactMessages();
  const filtered = messages.filter(msg => msg.id !== id);
  localStorage.setItem("contactMessages", JSON.stringify(filtered));
}

// Mark message as read
export function markMessageAsRead(id) {
  const messages = getContactMessages();
  const updated = messages.map(msg => {
    if (msg.id === id) {
      return { ...msg, status: 'read', readAt: Date.now() };
    }
    return msg;
  });
  localStorage.setItem("contactMessages", JSON.stringify(updated));
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".contact-card");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");

  if (!form) return;

  // Bootstrap-like validation styles
  const setInvalid = (input, message) => {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    
    // Remove existing feedback
    const existingFeedback = input.nextElementSibling;
    if (existingFeedback && existingFeedback.classList.contains("invalid-feedback")) {
      existingFeedback.remove();
    }
    
    // Add new feedback
    const feedback = document.createElement("div");
    feedback.className = "invalid-feedback d-block";
    feedback.style.cssText = "color: #dc3545; font-size: 0.875rem; margin-top: 0.25rem;";
    feedback.textContent = message;
    input.parentNode.appendChild(feedback);
  };

  const setValid = (input) => {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    
    // Remove feedback
    const existingFeedback = input.nextElementSibling;
    if (existingFeedback && existingFeedback.classList.contains("invalid-feedback")) {
      existingFeedback.remove();
    }
  };

  const clearValidation = (input) => {
    input.classList.remove("is-invalid", "is-valid");
    const existingFeedback = input.nextElementSibling;
    if (existingFeedback && existingFeedback.classList.contains("invalid-feedback")) {
      existingFeedback.remove();
    }
  };

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Real-time validation
  nameInput.addEventListener("input", () => {
    if (nameInput.value.trim().length >= 2) {
      setValid(nameInput);
    } else if (nameInput.value.length > 0) {
      setInvalid(nameInput, "Name must be at least 2 characters");
    } else {
      clearValidation(nameInput);
    }
  });

  emailInput.addEventListener("input", () => {
    if (emailRegex.test(emailInput.value)) {
      setValid(emailInput);
    } else if (emailInput.value.length > 0) {
      setInvalid(emailInput, "Please enter a valid email address");
    } else {
      clearValidation(emailInput);
    }
  });

  subjectInput.addEventListener("input", () => {
    if (subjectInput.value.trim().length >= 3) {
      setValid(subjectInput);
    } else if (subjectInput.value.length > 0) {
      setInvalid(subjectInput, "Subject must be at least 3 characters");
    } else {
      clearValidation(subjectInput);
    }
  });

  messageInput.addEventListener("input", () => {
    if (messageInput.value.trim().length >= 10) {
      setValid(messageInput);
    } else if (messageInput.value.length > 0) {
      setInvalid(messageInput, "Message must be at least 10 characters");
    } else {
      clearValidation(messageInput);
    }
  });

  // Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Validate all fields
    let isValid = true;

    // Name validation
    if (nameInput.value.trim().length < 2) {
      setInvalid(nameInput, "Name must be at least 2 characters");
      isValid = false;
    } else {
      setValid(nameInput);
    }

    // Email validation
    if (!emailRegex.test(emailInput.value)) {
      setInvalid(emailInput, "Please enter a valid email address");
      isValid = false;
    } else {
      setValid(emailInput);
    }

    // Subject validation
    if (subjectInput.value.trim().length < 3) {
      setInvalid(subjectInput, "Subject must be at least 3 characters");
      isValid = false;
    } else {
      setValid(subjectInput);
    }

    // Message validation
    if (messageInput.value.trim().length < 10) {
      setInvalid(messageInput, "Message must be at least 10 characters");
      isValid = false;
    } else {
      setValid(messageInput);
    }

    if (!isValid) {
      // Scroll to first invalid field
      const firstInvalid = form.querySelector(".is-invalid");
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
        firstInvalid.focus();
      }
      return;
    }

    // Get current user if logged in
    const currentUser = getCurrentUser();

    // Create message object
    const contactMessage = {
      id: "msg-" + Date.now(),
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      subject: subjectInput.value.trim(),
      message: messageInput.value.trim(),
      status: "unread",
      createdAt: Date.now(),
      userId: currentUser ? currentUser.id : null,
      userEmail: currentUser ? currentUser.email : emailInput.value.trim()
    };

    // Save to localStorage
    saveContactMessage(contactMessage);

    // Show success message
    const successMsg = document.createElement("div");
    successMsg.className = "alert alert-success mt-3";
    successMsg.style.cssText = "animation: slideIn 0.3s ease-out;";
    successMsg.innerHTML = `
      <i class="fa fa-check-circle me-2"></i>
      <strong>Message Sent!</strong> Thank you for contacting us. We'll get back to you soon.
    `;

    form.appendChild(successMsg);

    // Add animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);

    // Reset form
    form.reset();
    clearValidation(nameInput);
    clearValidation(emailInput);
    clearValidation(subjectInput);
    clearValidation(messageInput);

    // Remove success message after 5 seconds
    setTimeout(() => {
      successMsg.style.animation = "slideIn 0.3s ease-out reverse";
      setTimeout(() => successMsg.remove(), 300);
    }, 5000);
  });
});


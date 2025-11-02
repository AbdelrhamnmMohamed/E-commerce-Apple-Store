


function getTickets() {
  return JSON.parse(localStorage.getItem("tickets")) || [];
}

function updateTicketStats() {
  const tickets = getTickets();
  const openTickets = tickets.filter((t) => t.status === "Open").length;
  const closedTickets = tickets.filter((t) => t.status === "Closed").length;

  const totalEl = document.getElementById("totalTickets");
  const openEl = document.getElementById("openTickets");
  const closedEl = document.getElementById("closedTickets");

  if (totalEl) totalEl.textContent = tickets.length;
  if (openEl) openEl.textContent = openTickets;
  if (closedEl) closedEl.textContent = closedTickets;
}

function loadTickets() {
  const tickets = getTickets();
  const tbody = document.getElementById("ticketsTableBody");

  if (!tbody) return;

  if (tickets.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-muted py-4">No tickets submitted yet.</td>
      </tr>
    `;
    return;
  }


  tickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  tbody.innerHTML = tickets
    .map((ticket, index) => {
      const statusBadge =
        ticket.status === "Open"
          ? '<span class="badge bg-success">Open</span>'
          : '<span class="badge bg-danger">Closed</span>';

      return `
      <tr>
        <td class="fw-medium">${ticket.id}</td>
        <td>${ticket.name}</td>
        <td>${ticket.email}</td>
        <td class="text-start">${ticket.subject}</td>
        <td>${
          ticket.createdAtFormatted ||
          new Date(ticket.createdAt).toLocaleDateString()
        }</td>
        <td>${ticket.category}</td>
        <td>${statusBadge}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary view-ticket" data-index="${index}" title="View Details">
            <i class="fa fa-eye"></i>
          </button>
          <button class="btn btn-sm ${
            ticket.status === "Open"
              ? "btn-outline-danger"
              : "btn-outline-success"
          } toggle-status" data-index="${index}" title="${
        ticket.status === "Open" ? "Close Ticket" : "Reopen Ticket"
      }">
            <i class="fa ${
              ticket.status === "Open" ? "fa-times" : "fa-check"
            }"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger delete-ticket" data-index="${index}" title="Delete">
            <i class="fa fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
    })
    .join("");

  attachEventHandlers();
}

function attachEventHandlers() {

  document.querySelectorAll(".view-ticket").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      const tickets = getTickets();
      const ticket = tickets[index];

      if (ticket) {
        const details = `
Ticket ID: ${ticket.id}
Customer: ${ticket.name}
Email: ${ticket.email}
Subject: ${ticket.subject}
Category: ${ticket.category}
Order Number: ${ticket.orderNumber}
Created: ${ticket.createdAtFormatted}
Status: ${ticket.status}

Description:
${ticket.description}
        `;
        alert(details);
      }
    });
  });


  document.querySelectorAll(".toggle-status").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      const tickets = getTickets();

      if (tickets[index]) {
        tickets[index].status =
          tickets[index].status === "Open" ? "Closed" : "Open";
        localStorage.setItem("tickets", JSON.stringify(tickets));
        loadTickets();
        updateTicketStats();
      }
    });
  });


  document.querySelectorAll(".delete-ticket").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirm("Are you sure you want to delete this ticket?")) return;

      const index = btn.dataset.index;
      const tickets = getTickets();
      tickets.splice(index, 1);
      localStorage.setItem("tickets", JSON.stringify(tickets));
      loadTickets();
      updateTicketStats();
    });
  });
}


document.addEventListener("DOMContentLoaded", () => {
  updateTicketStats();
  loadTickets();
});

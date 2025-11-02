


function saveTicket(ticketData) {

  const tickets = JSON.parse(localStorage.getItem("tickets")) || [];


  tickets.push(ticketData);


  localStorage.setItem("tickets", JSON.stringify(tickets));
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("ticketForm");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();


      const name = document.getElementById("ticketName").value.trim();
      const email = document.getElementById("ticketEmail").value.trim();
      const subject = document.getElementById("ticketSubject").value.trim();
      const category = document.getElementById("ticketCategory").value;
      const orderNumber = document
        .getElementById("ticketOrderNumber")
        .value.trim();
      const description = document
        .getElementById("ticketDescription")
        .value.trim();


      if (!name || !email || !subject || !description) {
        alert("Please fill in all required fields.");
        return;
      }

      if (!email.includes("@")) {
        alert("Please enter a valid email address.");
        return;
      }


      const ticket = {
        id: "TKT-" + Date.now(),
        name: name,
        email: email,
        subject: subject,
        category: category,
        orderNumber: orderNumber || "N/A",
        description: description,
        status: "Open",
        createdAt: new Date().toISOString(),
        createdAtFormatted: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      };


      saveTicket(ticket);


      alert("Ticket submitted successfully! Our team will contact you soon.");


      form.reset();


      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1500);
    });
  }
});

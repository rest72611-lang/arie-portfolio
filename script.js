const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");
const year = document.getElementById("year");
const navItems = document.querySelectorAll(".nav-links a");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitButton = document.getElementById("submitButton");

// Replace this with your real n8n Production Webhook URL.
// Example: https://your-n8n-domain.com/webhook/portfolio-contact
const N8N_WEBHOOK_URL = "https://ariestein.app.n8n.cloud/webhook/portfolio-contact";

menuButton?.addEventListener("click", () => {
  navLinks?.classList.toggle("open");
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navLinks?.classList.remove("open");
  });
});

const sections = [...document.querySelectorAll("main section")];

window.addEventListener("scroll", () => {
  const current = sections.find((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= 160 && rect.bottom >= 160;
  });

  if (!current) return;

  navItems.forEach((item) => {
    item.classList.toggle("active", item.getAttribute("href") === `#${current.id}`);
  });
});

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!N8N_WEBHOOK_URL || N8N_WEBHOOK_URL.includes("PASTE_YOUR")) {
    formStatus.textContent = "Webhook is not configured yet. Add your n8n webhook URL in script.js.";
    return;
  }

  const formData = new FormData(contactForm);

  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    source: "portfolio-site",
    submittedAt: new Date().toISOString(),
  };

  try {
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    formStatus.textContent = "";

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Webhook request failed");
    }

    contactForm.reset();
    formStatus.textContent = "Message sent successfully.";
  } catch (error) {
    formStatus.textContent = "Something went wrong. Please email me directly.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Send Message";
  }
});

if (year) {
  year.textContent = new Date().getFullYear();
}

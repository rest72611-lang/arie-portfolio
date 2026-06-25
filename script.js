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

document.querySelectorAll("[data-screen-toggle]").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const panel = toggle.nextElementSibling;
    const isOpen = toggle.getAttribute("aria-expanded") === "true";

    toggle.setAttribute("aria-expanded", String(!isOpen));
    if (panel) panel.hidden = isOpen;
  });
});

const conceptScreens = [
  {
    src: "./assets/showcase/ui11_realestate.jpg",
    alt: "Product UI concept for a real estate business dashboard",
    caption: "Business Dashboard Concept",
  },
  {
    src: "./assets/showcase/ui12_medical.jpg",
    alt: "Medical management dashboard interface concept",
    caption: "Admin Management Interface",
  },
  {
    src: "./assets/showcase/ui13_education.jpg",
    alt: "Education platform dashboard concept with data management screens",
    caption: "Data Management Dashboard",
  },
  {
    src: "./assets/showcase/ui14_travel.jpg",
    alt: "Travel product UI concept with booking and dashboard screens",
    caption: "Product UI Concept",
  },
  {
    src: "./assets/showcase/ui15_fitness.jpg",
    alt: "Fitness business dashboard interface concept for memberships and activity",
    caption: "Responsive Web Interface",
  },
  {
    src: "./assets/showcase/ui16_music.jpg",
    alt: "Music platform dashboard concept with content and analytics screens",
    caption: "Reports & Analytics View",
  },
  {
    src: "./assets/showcase/ui17_smarthome.jpg",
    alt: "Smart home automation dashboard concept with connected device controls",
    caption: "Automation Workflow Concept",
  },
  {
    src: "./assets/showcase/ui18_hr.jpg",
    alt: "HR management system demo screen with employee profile and performance metrics",
    caption: "System Demo Screen",
  },
  {
    src: "./assets/showcase/ui19_restaurant.jpg",
    alt: "Restaurant management interface concept with orders and business operations",
    caption: "Customer Management Screen",
  },
  {
    src: "./assets/showcase/ui20_projectmgmt.jpg",
    alt: "Project management dashboard concept with tasks and workflow tracking",
    caption: "Project Management Concept",
  },
];

document.querySelectorAll("[data-pair-carousel]").forEach((carousel) => {
  const cards = [...carousel.querySelectorAll("[data-pair-card]")];
  const next = carousel.querySelector("[data-pair-next]");
  const counter = carousel.querySelector("[data-pair-counter]");
  const screens = [...conceptScreens];
  let currentPair = 0;

  if (screens.length % 2 === 1) {
    screens.push(screens[screens.length - 1]);
  }

  const pairCount = Math.ceil(screens.length / 2);

  const updatePair = () => {
    const pair = screens.slice(currentPair * 2, currentPair * 2 + 2);

    cards.forEach((card, index) => {
      const screen = pair[index];
      const image = card.querySelector("img");
      const caption = card.querySelector("figcaption");

      if (!screen || !image || !caption) return;

      image.src = screen.src;
      image.alt = screen.alt;
      caption.textContent = screen.caption;
    });

    if (counter) counter.textContent = `${currentPair + 1} / ${pairCount}`;
  };

  next?.addEventListener("click", () => {
    currentPair = (currentPair + 1) % pairCount;
    updatePair();
  });

  updatePair();
});

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const slides = [...carousel.querySelectorAll(".screen-slide")];
  const prev = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  const counter = carousel.querySelector("[data-carousel-counter]");
  let current = 0;

  const updateCarousel = () => {
    slides.forEach((slide, index) => {
      slide.hidden = index !== current;
    });

    if (counter) counter.textContent = `${current + 1} / ${slides.length}`;
    if (prev) prev.disabled = slides.length <= 1;
    if (next) next.disabled = slides.length <= 1;
  };

  prev?.addEventListener("click", () => {
    current = (current - 1 + slides.length) % slides.length;
    updateCarousel();
  });

  next?.addEventListener("click", () => {
    current = (current + 1) % slides.length;
    updateCarousel();
  });

  updateCarousel();
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

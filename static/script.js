const navbar = document.querySelector(".navbar");
const scrollWatcher = document.createElement("div");
scrollWatcher.setAttribute("data-scroll-watcher", "");
navbar.before(scrollWatcher);

// Sticky navbar toggle
const navObserve = new IntersectionObserver((entries) => {
  navbar.classList.toggle("sticking", !entries[0].isIntersecting);
});
navObserve.observe(scrollWatcher);

const sections = document.querySelectorAll(
  "#Home, #About, #skills, #Projects, #Contact"
);
const navLinks = document.querySelectorAll(".navbar-links");

window.addEventListener("scroll", () => {
  const navbarRect = navbar.getBoundingClientRect();
  const navbarBottom = navbarRect.bottom;

  let currentSectionId = null;
  let lastSectionTop = -Infinity;

  sections.forEach((section) => {
    const sectionRect = section.getBoundingClientRect();
    if (
      navbarBottom + 200 >= sectionRect.top &&
      sectionRect.top > lastSectionTop
    ) {
      lastSectionTop = sectionRect.top;
      currentSectionId = section.id;
    }
  });

  if (!currentSectionId) {
    sections.forEach((section) => {
      const sectionRect = section.getBoundingClientRect();
      if (0 >= sectionRect.top && 0 < sectionRect.bottom) {
        currentSectionId = section.id;
      }
    });
  }

  if (currentSectionId) {
    navLinks.forEach((link) => link.classList.remove("active-link"));
    const activeLink = document.querySelector(
      `.navbar-links[href="#${currentSectionId}"]`
    );
    if (activeLink) activeLink.classList.add("active-link");

    navbar.classList.forEach((c) => {
      if (c.startsWith("navbar-")) navbar.classList.remove(c);
    });
    navbar.classList.add(`navbar-${currentSectionId.toLowerCase()}`);
  }
});

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const submitButton = document.getElementById("submit");
const isMobile = window.innerWidth <= 786;

submitButton.addEventListener("click", async () => {
  const name = document.getElementById("Name").value.trim();
  const email = document.getElementById("Email").value.trim();
  const message = document.getElementById("Message").value.trim();

  if (!name || !isValidEmail(email) || !message) {
    const msg = !name
      ? "Please enter your Name"
      : !isValidEmail(email)
      ? "Invalid Email Address"
      : "Please enter a message";

    submitButton.style = `background-color: rgb(239,68,68); width: ${
      isMobile ? "70%" : "40%"
    }`;
    submitButton.textContent = msg;
    return;
  }

  submitButton.style =
    "background-color: rgb(255, 197, 47); width: 35%; color: rgba(0,0,0,0.8);";
  submitButton.textContent = "Sending...";
  submitButton.disabled = true;

  try {
    const response = await fetch("https://your-app-name.onrender.com/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    const result = await response.json();

    if (result.success) {
      submitButton.style = `background-color: rgb(34, 197, 94); width: ${
        isMobile ? "70%" : "50%"
      }`;
      submitButton.textContent = "Message sent successfully";
    } else {
      throw new Error("Server failed to send message");
    }
  } catch (error) {
    console.error(error);
    submitButton.style = `background-color: rgb(239,68,68); width: ${
      isMobile ? "70%" : "40%"
    }`;
    submitButton.textContent = "Failed to send message";
  } finally {
    submitButton.disabled = false;
  }
});

["Name", "Email", "Message"].forEach((id) =>
  document.getElementById(id).addEventListener("input", () => {
    submitButton.style = "background-color: rgb(255, 197, 47); width: 30%";
    submitButton.textContent = "Send";
  })
);

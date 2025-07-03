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
  const viewportTop = 0;

  let currentSectionId = null;
  let lastSectionTop = -Infinity;

  sections.forEach((section) => {
    const sectionRect = section.getBoundingClientRect();

    // Add +200px buffer here
    if (
      navbarBottom + 200 >= sectionRect.top &&
      sectionRect.top > lastSectionTop
    ) {
      lastSectionTop = sectionRect.top;
      currentSectionId = section.id;
    }
  });

  // Fallback: If no section matched, check if viewport top is inside any section (helps detect short Contact)
  if (!currentSectionId) {
    sections.forEach((section) => {
      const sectionRect = section.getBoundingClientRect();
      if (viewportTop >= sectionRect.top && viewportTop < sectionRect.bottom) {
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

    // Remove previous navbar-section classes and add current
    navbar.classList.forEach((c) => {
      if (c.startsWith("navbar-")) navbar.classList.remove(c);
    });
    navbar.classList.add(`navbar-${currentSectionId.toLowerCase()}`);
  }
});

// Validation function stays here
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const submitButton = document.getElementById("submit");
const isMobile = window.innerWidth <= 786;
const systemInfo = {
  userAgent: navigator.userAgent,
  platform: navigator.platform,
  language: navigator.language,
  screenWidth: window.screen.width,
  screenHeight: window.screen.height,
};

submitButton.addEventListener("click", async () => {
  const name = document.getElementById("Name").value.trim();
  const email = document.getElementById("Email").value.trim();
  const message = document.getElementById("Message").value.trim();

  if (!name) {
    if (!isMobile)
      submitButton.style = "background-color: rgb(239,68,68); width: 40%";
    else submitButton.style = "background-color: rgb(239,68,68); width: 70%";
    submitButton.textContent = "Please enter your Name";
    return;
  }

  if (!isValidEmail(email)) {
    if (!isMobile)
      submitButton.style = "background-color: rgb(239,68,68); width: 40%";
    else submitButton.style = "background-color: rgb(239,68,68); width: 65%";
    submitButton.textContent = "Invalid Email Address";
    return;
  }

  if (!message) {
    if (!isMobile)
      submitButton.style = "background-color: rgb(239,68,68); width: 40%";
    else submitButton.style = "background-color: rgb(239,68,68); width: 70%";
    submitButton.textContent = "Please enter a message";
    return;
  }

  // Immediate feedback while sending
  submitButton.style = "background-color: rgb(255, 197, 47); width: 35%;";
  submitButton.textContent = "Sending...";
  submitButton.disabled = true;
  submitButton.style = "color: rgba(0,0,0,0.8)";

  try {
    const response = await fetch(
      "https://parsa-website.onrender.com/send_email",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          systemInfo,
        }),
      }
    );

    const result = await response.json();

    if (result.success) {
      if (!isMobile)
        submitButton.style = "background-color: rgb(34, 197, 94); width: 50%";
      else
        submitButton.style = "background-color: rgb(34, 197, 94); width: 70%";
      submitButton.textContent = "Message sent successfully";
    } else {
      if (!isMobile)
        submitButton.style = "background-color: rgb(239,68,68); width: 40%";
      else submitButton.style = "background-color: rgb(239,68,68); width: 70%";
      submitButton.textContent = "Failed to send message";
    }
  } catch (error) {
    console.error(error);
    if (!isMobile)
      submitButton.style = "background-color: rgb(239,68,68); width: 40%";
    else submitButton.style = "background-color: rgb(239,68,68); width: 70%";
    submitButton.textContent = "Failed to send message";
  } finally {
    submitButton.disabled = false;
  }
});
document.getElementById("Name").addEventListener("input", setBackButton);
document.getElementById("Email").addEventListener("input", setBackButton);
document.getElementById("Message").addEventListener("input", setBackButton);

function setBackButton() {
  submitButton.style = "background-color: rgb(255, 197, 47); width: 30%";
  submitButton.textContent = "Send";
}

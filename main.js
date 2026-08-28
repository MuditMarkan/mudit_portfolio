// ===== Mobile Nav Toggle =====
const navLinks = document.getElementById("nav-links");
const menuBtn = document.getElementById("menu-btn");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-3-line");
});

navLinks.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-3-line");
});

// ===== Scroll Reveal =====
const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

// Hero / Header
ScrollReveal().reveal(".header__content h1", { ...scrollRevealOption });
ScrollReveal().reveal(".header__content .section__description", { ...scrollRevealOption, delay: 300 });
ScrollReveal().reveal(".header__content .header__btn", { ...scrollRevealOption, delay: 600 });

// About / Profile
ScrollReveal().reveal(".about__content .section__tag", { ...scrollRevealOption });
ScrollReveal().reveal(".about__content .section__header", { ...scrollRevealOption, delay: 200 });
ScrollReveal().reveal(".about__content .about__desc", { ...scrollRevealOption, delay: 400, interval: 200 });
ScrollReveal().reveal(".about__info__item", { ...scrollRevealOption, delay: 600, interval: 150 });

// Skills
ScrollReveal().reveal(".skills__card", { ...scrollRevealOption, interval: 150 });
ScrollReveal().reveal(".timeline__item", { ...scrollRevealOption, interval: 200 });

// Work Samples
ScrollReveal().reveal(".work__card", { ...scrollRevealOption, interval: 150 });
ScrollReveal().reveal(".work__github__cta", { ...scrollRevealOption, delay: 400 });

// Education
ScrollReveal().reveal(".education__card", { ...scrollRevealOption, interval: 200 });
ScrollReveal().reveal(".recommendation__card", { ...scrollRevealOption, interval: 200 });
ScrollReveal().reveal(".competency__item", { ...scrollRevealOption, interval: 100 });

// Contact
ScrollReveal().reveal(".contact__container .logo", { ...scrollRevealOption });
ScrollReveal().reveal(".contact__container .section__header", { ...scrollRevealOption, delay: 200 });
ScrollReveal().reveal(".contact__info__item", { ...scrollRevealOption, delay: 400, interval: 150 });
ScrollReveal().reveal(".contact__socials a", { ...scrollRevealOption, delay: 600, interval: 100 });

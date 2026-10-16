
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  const year = document.getElementById("year");


  if (year) {
    year.textContent = new Date().getFullYear();
  }

  
  document.body.classList.add("loading");

  const hideLoader = () => {
    if (loader) {
      loader.classList.add("done");
    }

    document.body.classList.remove("loading");

    document.querySelectorAll(".hero .reveal").forEach((element, index) => {
      setTimeout(() => {
        element.classList.add("visible");
      }, 120 + index * 160);
    });
  };

  if (document.readyState === "complete") {
    setTimeout(hideLoader, 350);
  } else {
    window.addEventListener("load", () => {
      setTimeout(hideLoader, 350);
    }, { once: true });
  }

 
  const revealElements = document.querySelectorAll(
    ".reveal:not(.hero .reveal)"
  );

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(element => {
      element.classList.add("visible");
    });
  }

 
  document.querySelectorAll(".value-grid, .gallery-grid").forEach(grid => {
    const cards = grid.querySelectorAll(".reveal");

    cards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 100}ms`;
    });
  });

 
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");

      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Закрыть меню" : "Открыть меню"
      );
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Открыть меню");
      });
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        nav.classList.remove("open");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

 
  const parallaxElements = document.querySelectorAll(".parallax");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let ticking = false;

  function updateParallax() {
    if (reducedMotion.matches) {
      parallaxElements.forEach(element => {
        element.style.transform = "";
      });

      ticking = false;
      return;
    }

    const viewportHeight = window.innerHeight;

    parallaxElements.forEach(element => {
      const rect = element.getBoundingClientRect();

      if (rect.bottom < 0 || rect.top > viewportHeight) {
        return;
      }

      const speed = Number(element.dataset.speed) || 0.05;
      const centerOffset =
        rect.top + rect.height / 2 - viewportHeight / 2;

      const movement = -centerOffset * speed;

      element.style.transform =
        `translate3d(0, ${movement.toFixed(2)}px, 0)`;
    });

    ticking = false;
  }

  function requestParallaxUpdate() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateParallax);
    }
  }

  window.addEventListener("scroll", requestParallaxUpdate, {
    passive: true
  });

  window.addEventListener("resize", requestParallaxUpdate);

  updateParallax();

  
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: reducedMotion.matches ? "auto" : "smooth",
        block: "start"
      });

      history.replaceState(null, "", targetId);
    });
  });
});

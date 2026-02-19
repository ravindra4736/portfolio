const revealNodes = [...document.querySelectorAll(".reveal")];

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealNodes.forEach((node, index) => {
    node.style.transitionDelay = `${Math.min(index * 60, 320)}ms`;
    revealObserver.observe(node);
  });
} else {
  revealNodes.forEach((node) => node.classList.add("in"));
}

const counters = [...document.querySelectorAll("[data-count]")];
if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target;
        const max = Number(target.dataset.count || 0);
        const start = performance.now();
        const duration = 1200;

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const value = Math.floor(progress * max);
          target.textContent = `${value}+`;
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        counterObserver.unobserve(target);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

const glow = document.querySelector(".cursor-glow");
const parallaxNodes = [...document.querySelectorAll("[data-parallax]")];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (window.matchMedia("(min-width: 901px)").matches && !reduceMotion) {
  window.addEventListener("pointermove", (event) => {
    if (glow) {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;

    parallaxNodes.forEach((node) => {
      const speed = Number(node.dataset.parallax || 0);
      const moveX = -deltaX * speed;
      const moveY = -deltaY * speed;
      node.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });
  });
}

const loadMoreButton = document.querySelector("#load-more-projects");
const hiddenProjects = [...document.querySelectorAll(".hidden-project")];

if (loadMoreButton && hiddenProjects.length) {
  let expanded = false;
  const loadMoreText = loadMoreButton.querySelector("span");
  loadMoreButton.addEventListener("click", () => {
    expanded = !expanded;
    hiddenProjects.forEach((project) => {
      project.style.display = expanded ? "block" : "none";
      if (expanded) project.classList.add("in");
    });
    if (loadMoreText) {
      loadMoreText.textContent = expanded ? "Show Less Projects" : "Load More Projects";
    } else {
      loadMoreButton.textContent = expanded ? "Show Less Projects" : "Load More Projects";
    }
    loadMoreButton.setAttribute("aria-expanded", String(expanded));
  });
}

const navLinks = [...document.querySelectorAll(".section-nav .nav-link")];
const navTargets = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const setActiveNav = (id) => {
  let activeLink = null;
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("active", isActive);
    if (isActive) activeLink = link;
  });

  if (activeLink && window.matchMedia("(max-width: 900px)").matches) {
    activeLink.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }
};

if ("IntersectionObserver" in window && navTargets.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveNav(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
  );

  navTargets.forEach((target) => navObserver.observe(target));
}

// Ensure "Contact" is highlighted at the very bottom where footer visibility
// can be too small for intersection thresholds on some viewport sizes.
const onScrollNavFallback = () => {
  const atBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
  if (atBottom) setActiveNav("contact");
};

window.addEventListener("scroll", onScrollNavFallback, { passive: true });

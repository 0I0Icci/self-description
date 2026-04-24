// 页面交互：全屏页面切换、浇水转场、移动端导航。
document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const pages = Array.from(document.querySelectorAll(".page"));
  const waterLayer = document.querySelector(".transition-water");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navItems = Array.from(document.querySelectorAll("[data-page-link]"));
  const waterButtons = Array.from(document.querySelectorAll(".water-next"));
  const screenshotButtons = Array.from(document.querySelectorAll("[data-full-image]"));
  const lightbox = document.querySelector(".image-lightbox");
  const lightboxImage = lightbox ? lightbox.querySelector("img") : null;
  const lightboxClose = document.querySelector(".lightbox-close");
  const storyToggles = Array.from(document.querySelectorAll(".expand-story-toggle"));
  const projectPage = document.querySelector(".project-case-page");
  const projectAnchors = Array.from(document.querySelectorAll("[data-project-anchor]"));
  const projectSections = projectPage
    ? Array.from(projectPage.querySelectorAll(".project-section"))
    : [];
  let currentPage = 0;
  let isTransitioning = false;

  function closeMenu() {
    if (!navLinks || !navToggle) return;
    navLinks.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  function setActiveNav(pageIndex) {
    navItems.forEach(function (item) {
      item.classList.toggle("active", Number(item.dataset.pageLink) === pageIndex);
    });
  }

  function setActiveProjectAnchor(sectionId) {
    projectAnchors.forEach(function (link) {
      link.classList.toggle("active", link.dataset.projectAnchor === sectionId);
    });
  }

  function syncProjectAnchor() {
    if (!projectPage || currentPage !== 5) return;

    const topOffset = projectPage.scrollTop + 170;
    let activeId = projectSections.length ? projectSections[0].id : "";

    projectSections.forEach(function (section) {
      if (section.offsetTop <= topOffset) {
        activeId = section.id;
      }
    });

    if (activeId) {
      setActiveProjectAnchor(activeId);
    }
  }

  function showPage(pageIndex, withWater) {
    const target = pages.find(function (page) {
      return Number(page.dataset.page) === pageIndex;
    });

    if (!target || isTransitioning) return;
    isTransitioning = true;

    if (withWater && waterLayer) {
      waterLayer.classList.remove("is-active");
      void waterLayer.offsetWidth;
      waterLayer.classList.add("is-active");
    }

    window.setTimeout(function () {
      pages.forEach(function (page) {
        page.classList.toggle("active", page === target);
      });

      body.dataset.theme = target.dataset.theme || "seed";
      target.classList.remove("page-replay");
      void target.offsetWidth;
      target.classList.add("page-replay");
      currentPage = pageIndex;
      setActiveNav(pageIndex);
      if (pageIndex === 5 && projectPage) {
        window.setTimeout(syncProjectAnchor, 60);
      }
      closeMenu();

      if (window.innerWidth <= 980) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, withWater ? 320 : 0);

    window.setTimeout(function () {
      if (waterLayer) {
        waterLayer.classList.remove("is-active");
      }
      isTransitioning = false;
    }, withWater ? 850 : 120);
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      const isOpen = navLinks.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  navItems.forEach(function (item) {
    item.addEventListener("click", function (event) {
      event.preventDefault();
      showPage(Number(item.dataset.pageLink), true);
    });
  });

  waterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      showPage(Number(button.dataset.next), true);
    });
  });

  projectAnchors.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = link.dataset.projectAnchor;
      const targetSection = targetId ? document.getElementById(targetId) : null;
      if (!projectPage || !targetSection) return;
      event.preventDefault();

      projectPage.scrollTo({
        top: Math.max(0, targetSection.offsetTop - 118),
        behavior: "smooth"
      });

      setActiveProjectAnchor(targetId);
    });
  });

  if (projectPage) {
    projectPage.addEventListener("scroll", syncProjectAnchor, { passive: true });
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImage) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    lightboxImage.alt = "";
  }

  screenshotButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      if (!lightbox || !lightboxImage) return;
      lightboxImage.src = button.dataset.fullImage;
      lightboxImage.alt = button.dataset.imageAlt || "截图预览";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });

  if (lightbox) {
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  storyToggles.forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      const card = toggle.closest(".expand-story-card");
      if (!card) return;
      const isOpen = card.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeLightbox();
      return;
    }

    if (event.key === "ArrowDown" || event.key === "PageDown") {
      event.preventDefault();
      showPage((currentPage + 1) % pages.length, true);
    }

    if (event.key === "ArrowUp" || event.key === "PageUp") {
      event.preventDefault();
      showPage((currentPage - 1 + pages.length) % pages.length, true);
    }
  });

  setActiveNav(currentPage);
  setActiveProjectAnchor("project-cover");
});

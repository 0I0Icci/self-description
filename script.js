// 移动端导航、锚点滚动状态等轻量交互。
document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("main section[id]");

  if (toggleButton && navLinks) {
    toggleButton.addEventListener("click", function () {
      const isOpen = navLinks.classList.toggle("is-open");
      toggleButton.classList.toggle("is-open", isOpen);
      toggleButton.setAttribute("aria-expanded", String(isOpen));
    });
  }

  navItems.forEach(function (item) {
    item.addEventListener("click", function () {
      navLinks.classList.remove("is-open");
      toggleButton.classList.remove("is-open");
      toggleButton.setAttribute("aria-expanded", "false");
    });
  });

  // 根据滚动位置高亮当前导航项，帮助招聘方快速定位页面结构。
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        navItems.forEach(function (item) {
          const isActive = item.getAttribute("href") === "#" + entry.target.id;
          item.classList.toggle("active", isActive);
        });
      });
    },
    {
      rootMargin: "-35% 0px -55% 0px",
      threshold: 0
    }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
});

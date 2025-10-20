// SLIDESHOW
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
let index = 0;

// Función para mostrar una slide
function showSlide(n) {
  slides[index].classList.remove("active");
  if (dots[index]) dots[index].classList.remove("active");

  index = (n + slides.length) % slides.length;

  slides[index].classList.add("active");
  if (dots[index]) dots[index].classList.add("active");
}

// Eventos para navegación
prevBtn.addEventListener("click", () => showSlide(index - 1));
nextBtn.addEventListener("click", () => showSlide(index + 1));
dots.forEach(dot => dot.addEventListener("click", () => showSlide(parseInt(dot.dataset.index))));

// Inicializar la primera slide
showSlide(index);

// MODAL ZOOM
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");

slides.forEach(slide => {
  const img = slide.querySelector("img");
  if (!img) return;

  img.addEventListener("click", () => {
    modalImg.src = img.dataset.full || img.src;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Evita scroll al abrir modal
  });
});

// Cerrar modal al hacer clic (en cualquier lugar)
modal.addEventListener("click", () => {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  setTimeout(() => {
    if (!modal.classList.contains("show")) modal.style.display = "none";
  }, 280);
  document.body.style.overflow = "";
});

// Cerrar modal con tecla Esc
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("show")) {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    setTimeout(() => {
      if (!modal.classList.contains("show")) modal.style.display = "none";
    }, 280);
    document.body.style.overflow = "";
  }
});

// Asegurar display:flex al abrir modal
const observer = new MutationObserver(() => {
  if (modal.classList.contains("show")) {
    modal.style.display = "flex";
  } else {
    setTimeout(() => {
      if (!modal.classList.contains("show")) modal.style.display = "none";
    }, 300);
  }
});
observer.observe(modal, { attributes: true, attributeFilter: ['class'] });

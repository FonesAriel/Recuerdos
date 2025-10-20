// SLIDESHOW
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
let index = 0;
const AUTO_DELAY = 6000;
let slideInterval = null;

function showSlide(n) {
  slides[index].classList.remove("active");
  if (dots[index]) dots[index].classList.remove("active");
  index = (n + slides.length) % slides.length;
  slides[index].classList.add("active");
  if (dots[index]) dots[index].classList.add("active");
}

function startAutoplay() {
  stopAutoplay();
  slideInterval = setInterval(() => showSlide(index + 1), AUTO_DELAY);
}
function stopAutoplay() {
  if (slideInterval) { clearInterval(slideInterval); slideInterval = null; }
}
startAutoplay();

prevBtn.addEventListener("click", () => showSlide(index - 1));
nextBtn.addEventListener("click", () => showSlide(index + 1));
dots.forEach(dot => dot.addEventListener("click", () => showSlide(parseInt(dot.dataset.index))));

// MODAL ZOOM (clic en imagen abre, clic fuera o en imagen cierra, Esc cierra)
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");

// Abrir modal al hacer clic en la imagen (escuchamos la img dentro del slide)
slides.forEach(slide => {
  const img = slide.querySelector("img");
  if (!img) return;
  img.addEventListener("click", (e) => {
    // evitar abrir si el clic proviene de un control (por ejemplo, flechas)
    // (no debería ocurrir aquí porque overlay no captura clicks, pero es seguro)
    modalImg.src = img.dataset.full || img.src; // usa data-full si existe, sino la src
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    // mostrar modal (display:flex lo maneja la clase .show)
    // pausamos autoplay
    stopAutoplay();
    // evitar scroll del body cuando modal abierto
    document.body.style.overflow = "hidden";
  });
});

// Cerrar modal: click fuera o click en la propia imagen
modal.addEventListener("click", (e) => {
  // si se hace clic en cualquier lugar del modal, lo cerramos
  // (esto incluye clic en la imagen)
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  // permitir que la transición termine antes de quitar display
  setTimeout(() => {
    // si la clase show no está, ocultamos (display se controla vía CSS .show)
    if (!modal.classList.contains("show")) {
      modal.style.display = "none"; // por seguridad; la clase show usa display:flex
    }
  }, 280);
  // restaurar autoplay y scroll
  startAutoplay();
  document.body.style.overflow = "";
});

// Cuando abrimos por primera vez, aseguramos que display:flex se active (ya que .show cambia visibilidad):
// Alternativa simple: cuando se añade .show, forzamos display:flex (usado arriba).
// Para evitar problemas en algunos navegadores, también podemos forzar display antes de añadir show:
const originalOpenHandlers = []; // no usado, pero dejado por claridad

// Cerrar con tecla Esc
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("show")) {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    setTimeout(() => {
      if (!modal.classList.contains("show")) modal.style.display = "none";
    }, 280);
    startAutoplay();
    document.body.style.overflow = "";
  }
});

// Mejora: cuando se agrega .show, aseguramos display:flex inmediatamente
// (esto evita que el navegador ignore la animación si display estaba 'none')
const observer = new MutationObserver(() => {
  if (modal.classList.contains("show")) {
    modal.style.display = "flex";
  } else {
    // lo dejamos que el timeout lo oculte; pero como fallback:
    setTimeout(() => { if (!modal.classList.contains("show")) modal.style.display = "none"; }, 300);
  }
});
observer.observe(modal, { attributes: true, attributeFilter: ['class'] });

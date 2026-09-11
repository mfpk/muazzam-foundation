/* =========================================================
   AL QASIM INSTITUTE — SHARED SITE SCRIPT
   Nav toggle, sticky header, scroll reveal, animated counters,
   gallery filter + lightbox, donation amount picker, contact form.
   ========================================================= */
(function(){
  "use strict";

  document.addEventListener("DOMContentLoaded", function(){
    initHeader();
    initMobileNav();
    initHeroSlider();
    initVideoFacade();
    initReveal();
    initCounters();
    initGalleryFilter();
    initLightbox();
    initDonationForm();
    initContactForm();
    initBackToTop();
    initYear();
  });

  /* ---------- Sticky header shadow ---------- */
  function initHeader(){
    var header = document.querySelector(".site-header");
    if(!header) return;
    var onScroll = function(){
      header.classList.toggle("scrolled", window.scrollY > 10);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, {passive:true});
  }

  /* ---------- Mobile hamburger nav ---------- */
  function initMobileNav(){
    var btn = document.querySelector(".hamburger");
    var nav = document.querySelector(".main-nav");
    var backdrop = document.querySelector(".nav-backdrop");
    if(!btn || !nav) return;

    function close(){
      btn.classList.remove("open");
      nav.classList.remove("open");
      if(backdrop) backdrop.classList.remove("open");
      btn.setAttribute("aria-expanded","false");
      document.body.style.overflow = "";
    }
    function toggle(){
      var open = nav.classList.toggle("open");
      btn.classList.toggle("open", open);
      if(backdrop) backdrop.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    }
    btn.addEventListener("click", toggle);
    if(backdrop) backdrop.addEventListener("click", close);
    nav.querySelectorAll("a").forEach(function(a){ a.addEventListener("click", close); });
    window.addEventListener("keydown", function(e){ if(e.key === "Escape") close(); });
  }

  /* ---------- Hero photo slider ---------- */
  function initHeroSlider(){
    var slider = document.querySelector(".hero--slider");
    if(!slider) return;
    var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
    var prevBtn = slider.querySelector(".hero-slider-arrow.prev");
    var nextBtn = slider.querySelector(".hero-slider-arrow.next");
    if(slides.length < 2) return;
    var index = 0;
    var delay = parseInt(slider.getAttribute("data-autoplay"), 10) || 5000;
    var timer = null;
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function show(i){
      index = (i + slides.length) % slides.length;
      slides.forEach(function(s, n){ s.classList.toggle("active", n === index); });
      dots.forEach(function(d, n){
        d.classList.toggle("active", n === index);
        d.setAttribute("aria-selected", n === index ? "true" : "false");
      });
    }
    function next(){ show(index + 1); }
    function prev(){ show(index - 1); }
    function start(){
      if(reduceMotion) return;
      stop();
      timer = window.setInterval(next, delay);
    }
    function stop(){
      if(timer){ window.clearInterval(timer); timer = null; }
    }

    if(prevBtn) prevBtn.addEventListener("click", function(){ prev(); start(); });
    if(nextBtn) nextBtn.addEventListener("click", function(){ next(); start(); });
    dots.forEach(function(dot, n){
      dot.addEventListener("click", function(){ show(n); start(); });
    });
    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    slider.addEventListener("focusin", stop);
    slider.addEventListener("focusout", start);

    show(0);
    start();
  }

  /* ---------- Click-to-play YouTube facade ----------
     Keeps the heavy YouTube iframe out of the page until the visitor
     actually wants to watch, and lets a custom poster photo be used
     instead of YouTube's auto-picked thumbnail. */
  function initVideoFacade(){
    var facades = document.querySelectorAll(".yt-facade");
    facades.forEach(function(facade){
      function play(){
        var id = facade.getAttribute("data-yt-id");
        if(!id) return;
        var iframe = document.createElement("iframe");
        iframe.src = "https://www.youtube.com/embed/" + id + "?autoplay=1";
        iframe.title = facade.getAttribute("aria-label") || "Video";
        iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
        iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
        iframe.allowFullscreen = true;
        iframe.style.position = "absolute";
        iframe.style.inset = "0";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "0";
        facade.innerHTML = "";
        facade.classList.remove("yt-facade");
        facade.removeAttribute("role");
        facade.removeAttribute("tabindex");
        facade.appendChild(iframe);
      }
      facade.addEventListener("click", play);
      facade.addEventListener("keydown", function(e){
        if(e.key === "Enter" || e.key === " "){ e.preventDefault(); play(); }
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal(){
    var els = document.querySelectorAll(".reveal");
    if(!els.length) return;
    if(!("IntersectionObserver" in window)){
      els.forEach(function(el){ el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.15, rootMargin:"0px 0px -40px 0px"});
    els.forEach(function(el){ io.observe(el); });
  }

  /* ---------- Animated counters ---------- */
  function initCounters(){
    var counters = document.querySelectorAll("[data-count]");
    if(!counters.length) return;

    function animate(el){
      var target = parseFloat(el.getAttribute("data-count")) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      var duration = 1600;
      var start = null;
      function step(ts){
        if(start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.round(target * eased);
        el.textContent = value.toLocaleString() + suffix;
        if(progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if(!("IntersectionObserver" in window)){
      counters.forEach(animate);
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.5});
    counters.forEach(function(el){ io.observe(el); });
  }

  /* ---------- Gallery category filter ---------- */
  function initGalleryFilter(){
    var buttons = document.querySelectorAll(".filter-btn");
    var items = document.querySelectorAll(".gallery-item");
    if(!buttons.length || !items.length) return;

    buttons.forEach(function(btn){
      btn.addEventListener("click", function(){
        buttons.forEach(function(b){ b.classList.remove("active"); });
        btn.classList.add("active");
        var cat = btn.getAttribute("data-filter");
        items.forEach(function(item){
          var match = cat === "all" || item.getAttribute("data-category") === cat;
          item.style.display = match ? "" : "none";
        });
      });
    });
  }

  /* ---------- Lightbox ---------- */
  function initLightbox(){
    var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
    var lightbox = document.querySelector(".lightbox");
    if(!items.length || !lightbox) return;

    var img = lightbox.querySelector("img");
    var cap = lightbox.querySelector(".lb-cap");
    var closeBtn = lightbox.querySelector(".lb-close");
    var prevBtn = lightbox.querySelector(".lb-prev");
    var nextBtn = lightbox.querySelector(".lb-next");
    var visible = [];
    var index = 0;

    function refreshVisible(){
      visible = items.filter(function(it){ return it.style.display !== "none"; });
    }

    function open(item){
      refreshVisible();
      index = visible.indexOf(item);
      if(index === -1) index = 0;
      render();
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function render(){
      var item = visible[index];
      if(!item) return;
      var full = item.getAttribute("data-full") || item.querySelector("img").src;
      var caption = item.getAttribute("data-caption") || item.querySelector("img").alt;
      img.src = full;
      img.alt = caption;
      cap.textContent = caption;
    }
    function close(){
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }
    function step(dir){
      refreshVisible();
      if(!visible.length) return;
      index = (index + dir + visible.length) % visible.length;
      render();
    }

    items.forEach(function(item){
      item.addEventListener("click", function(){ open(item); });
      item.setAttribute("tabindex","0");
      item.setAttribute("role","button");
      item.addEventListener("keydown", function(e){
        if(e.key === "Enter" || e.key === " "){ e.preventDefault(); open(item); }
      });
    });
    if(closeBtn) closeBtn.addEventListener("click", close);
    if(prevBtn) prevBtn.addEventListener("click", function(){ step(-1); });
    if(nextBtn) nextBtn.addEventListener("click", function(){ step(1); });
    lightbox.addEventListener("click", function(e){ if(e.target === lightbox) close(); });
    window.addEventListener("keydown", function(e){
      if(!lightbox.classList.contains("open")) return;
      if(e.key === "Escape") close();
      if(e.key === "ArrowLeft") step(-1);
      if(e.key === "ArrowRight") step(1);
    });
  }

  /* ---------- Donation amount picker ----------
     NOTE: This is a front-end placeholder only. Wire the "Donate Now"
     button to your real payment processor (Stripe, PayPal, JazzCash,
     Easypaisa, etc.) by replacing handleDonateSubmit() below. */
  function initDonationForm(){
    var amountBtns = document.querySelectorAll(".amount-btn");
    var customInput = document.querySelector(".amount-custom input");
    var donateBtn = document.querySelector("[data-donate-submit]");
    var freqBtns = document.querySelectorAll(".freq-toggle button");
    var summaryAmount = document.querySelector(".donate-summary-amount");
    var summaryFreq = document.querySelector(".donate-summary-freq");
    if(!amountBtns.length && !donateBtn) return;

    var selected = null;

    function updateSummary(){
      if(summaryAmount){
        var amount = selected || (customInput && customInput.value) || "25";
        summaryAmount.textContent = "£" + amount;
      }
      if(summaryFreq){
        var freqBtn = document.querySelector(".freq-toggle button.active");
        summaryFreq.textContent = freqBtn && freqBtn.textContent.trim() === "Monthly" ? "every month" : "one-time";
      }
    }

    amountBtns.forEach(function(btn){
      btn.addEventListener("click", function(){
        amountBtns.forEach(function(b){ b.classList.remove("active"); });
        btn.classList.add("active");
        selected = btn.getAttribute("data-amount");
        if(customInput) customInput.value = "";
        updateSummary();
      });
    });
    if(customInput){
      customInput.addEventListener("input", function(){
        amountBtns.forEach(function(b){ b.classList.remove("active"); });
        selected = customInput.value;
        updateSummary();
      });
    }
    freqBtns.forEach(function(btn){
      btn.addEventListener("click", function(){
        freqBtns.forEach(function(b){ b.classList.remove("active"); });
        btn.classList.add("active");
        updateSummary();
      });
    });
    updateSummary();
    if(donateBtn){
      donateBtn.addEventListener("click", function(e){
        e.preventDefault();
        var amount = selected || (customInput && customInput.value) || "25";
        handleDonateSubmit(amount);
      });
    }
  }
  function handleDonateSubmit(amount){
    // Placeholder action — replace with a real payment gateway redirect/API call.
    alert("Thank you for choosing to donate £" + amount + ". Connect this button to your payment gateway (Stripe / PayPal / JazzCash / Easypaisa) to complete secure processing.");
  }

  /* ---------- Contact form (client-side placeholder) ----------
     NOTE: Replace this handler with a real submission (e.g. POST to
     your backend, Formspree, or a mailto: fallback) when ready. */
  function initContactForm(){
    var form = document.querySelector("#contact-form");
    if(!form) return;
    var success = document.querySelector(".form-success");
    form.addEventListener("submit", function(e){
      e.preventDefault();
      if(!form.checkValidity()){
        form.reportValidity();
        return;
      }
      if(success){
        success.classList.add("show");
        success.scrollIntoView({behavior:"smooth", block:"center"});
      }
      form.reset();
    });
  }

  /* ---------- Back to top ---------- */
  function initBackToTop(){
    var btn = document.querySelector(".back-to-top");
    if(!btn) return;
    window.addEventListener("scroll", function(){
      btn.classList.toggle("show", window.scrollY > 480);
    }, {passive:true});
    btn.addEventListener("click", function(){
      window.scrollTo({top:0, behavior:"smooth"});
    });
  }

  /* ---------- Footer year ---------- */
  function initYear(){
    var el = document.querySelector("#footer-year");
    if(el) el.textContent = new Date().getFullYear();
  }
})();

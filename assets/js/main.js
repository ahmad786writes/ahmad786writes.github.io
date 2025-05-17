
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }
  /**
   * Hero Animation
   */
  window.addEventListener("DOMContentLoaded", () => {
    VANTA.NET({
      el: "#hero",
      mouseControls: true,
      touchControls: true,
      gyroControls: true,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x1F51FF, // Cyan nodes
      backgroundColor: 0x0d0d0d, // Dark background
      points: 12.00,
      maxDistance: 20.00,
      spacing: 15.00
    });
  });
  
  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    })
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('body').classList.toggle('mobile-nav-active')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let body = select('body')
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

  /**
   * Hero type effect
   */
  const typed = select('.typed')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }


  const blogContainer = document.getElementById('blog-posts');
  const mediumRSS = 'https://medium.com/feed/@ahmad786.writes'; // your medium username

  function extractImage(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    const img = div.querySelector('img');
    return img ? img.src : 'https://via.placeholder.com/150'; // fallback image
  }

  fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(mediumRSS)}`)
  .then(response => response.json())
  .then(data => {
    const posts = data.items.slice(0, 5);
    let html = '';
    posts.forEach(post => {
      const imgSrc = extractImage(post.description);
      html += `
        <div class="col-12 col-md-6 col-lg-4">
          <article class="blog-post card h-100 p-2">
            <img src="${imgSrc}" class="card-img-top blog-img" alt="Blog image" />
            <div class="card-body p-3 d-flex flex-column">
              <h3 class="card-title"><a href="${post.link}" target="_blank" rel="noopener">${post.title}</a></h3>
              <p class="card-text">${post.description.replace(/<[^>]+>/g, '').substring(0, 100)}...</p>
              <small class="text-muted mt-auto">Published on: ${new Date(post.pubDate).toLocaleDateString()}</small>
            </div>
          </article>
        </div>
      `;
    });
    blogContainer.innerHTML = html;
  })
  .catch(err => {
    blogContainer.innerHTML = '<p>Unable to load blogs at the moment.</p>';
    console.error('Failed to fetch Medium posts:', err);
  });


  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Initiate portfolio details lightbox 
   */
  const portfolioDetailsLightbox = GLightbox({
    selector: '.portfolio-details-lightbox',
    width: '90%',
    height: '90vh'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });
  

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

/* === CHATBOT FUNCTIONALITY === */

// Sound effect for new bot message
const botSound = new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg');

// Show/hide notification dot
function showNotificationDot() {
  const dot = document.getElementById('notification-dot');
  if (dot) dot.style.display = 'block';
}

function hideNotificationDot() {
  const dot = document.getElementById('notification-dot');
  if (dot) dot.style.display = 'none';
}

// Check if user is at the bottom of chat
function isScrolledToBottom() {
  const chatBody = document.getElementById('chat-body');
  return chatBody.scrollTop + chatBody.clientHeight >= chatBody.scrollHeight - 20;
}

window.toggleChat = function () {
  const chatWidget = document.getElementById('chat-widget');
  const chatBody = document.getElementById('chat-body');

  if (chatWidget) {
    const isOpening = chatWidget.style.display === 'none' || chatWidget.style.display === '';

    chatWidget.style.display = isOpening ? 'flex' : 'none';

    if (isOpening) {
      hideNotificationDot(); // Hide dot when chat opens
    }

    // Show system message only the first time
    if (isOpening && !chatBody.dataset.initialized) {
      const systemMessage = document.createElement('div');
      systemMessage.className = 'bot-message';
      systemMessage.textContent = "I am Ahmad's AI assistant, how can I help you today?(Due to High Server Load, You might have to wait for 50 to 55 Seconds for the first answer, Thanks)";
      chatBody.appendChild(systemMessage);
      chatBody.dataset.initialized = true;
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }
};

const sendBtn = document.getElementById('send-btn');
if (sendBtn) {
  sendBtn.addEventListener('click', async () => {
    const userInputElem = document.getElementById('user-input');
    const userInput = userInputElem.value.trim();
    if (!userInput) return;

    const chatBody = document.getElementById('chat-body');
    const userMessage = document.createElement('div');
    userMessage.className = 'user-message';
    userMessage.textContent = userInput;
    chatBody.appendChild(userMessage);

    userInputElem.value = '';

    try {
      const response = await fetch('https://ahmad-rag-chatbot.onrender.com/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userInput })
      });

      const data = await response.json();
      const botMessage = document.createElement('div');
      botMessage.className = 'bot-message';
      botMessage.textContent = data.response;
      chatBody.appendChild(botMessage);

      botSound.play(); // 🔊 Play sound on bot message

      const chatWidget = document.getElementById('chat-widget');
      if (chatWidget.style.display === 'none' || !isScrolledToBottom()) {
        showNotificationDot(); // 🔴 Show notification if chat is closed or user is scrolled up
      }

      // Auto-scroll if at bottom
      if (isScrolledToBottom()) {
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
}

// Enter key sends message (except Shift+Enter for new line)
const userInputElem = document.getElementById('user-input');
if (userInputElem && sendBtn) {
  userInputElem.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent newline
      sendBtn.click();        // Trigger send button click handler
    }
  });
}

// Hide dot when user scrolls to bottom
document.getElementById('chat-body').addEventListener('scroll', () => {
  if (isScrolledToBottom()) {
    hideNotificationDot();
  }
});

})()
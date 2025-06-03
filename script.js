
// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
  hamburger.classList.remove('active');
  navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offsetTop = target.offsetTop - 70; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(22, 14, 46, 0.98)';
  } else {
    navbar.style.background = 'rgba(22, 14, 46, 0.95)';
  }
});

// Service Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const serviceCards = document.querySelectorAll('.service-card');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    // Add active class to clicked button
    button.classList.add('active');
    
    const filterValue = button.getAttribute('data-filter');
    
    serviceCards.forEach(card => {
      if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
        card.style.display = 'block';
        card.style.animation = 'fadeIn 0.5s ease-in-out';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// Contact Form Handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const formObject = Object.fromEntries(formData);
    
    // Simulate form submission (replace with actual Supabase integration)
    try {
      // Here you would integrate with Supabase
      console.log('Form data:', formObject);
      
      // Show success message
      showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
      contactForm.reset();
    } catch (error) {
      showNotification('Error sending message. Please try again.', 'error');
      console.error('Form submission error:', error);
    }
  });
}

// Blog Load More Functionality
const loadMoreBtn = document.querySelector('.blog-load-more .btn');
if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    // Simulate loading more blog posts
    showNotification('Loading more articles...', 'info');
    
    // Here you would fetch more blog posts from Supabase
    setTimeout(() => {
      showNotification('More articles loaded!', 'success');
    }, 1500);
  });
}

// Dashboard Navigation
const dashboardLinks = document.querySelectorAll('.dashboard-link');
dashboardLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Remove active class from all links
    dashboardLinks.forEach(l => l.classList.remove('active'));
    // Add active class to clicked link
    link.classList.add('active');
    
    // Here you would load different dashboard content
    const linkText = link.textContent.trim();
    showNotification(`Loading ${linkText}...`, 'info');
  });
});

// Dashboard Toggle
const dashboardSection = document.querySelector('#dashboard');
const loginBtn = document.querySelector('.btn-login');

if (loginBtn && dashboardSection) {
  loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Toggle dashboard visibility
    if (dashboardSection.classList.contains('hidden')) {
      // Show dashboard
      dashboardSection.classList.remove('hidden');
      dashboardSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      showNotification('Welcome to your dashboard!', 'success');
    } else {
      // Hide dashboard
      dashboardSection.classList.add('hidden');
      document.querySelector('#home').scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
    }
  });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('section, .service-card, .blog-card, .team-card').forEach(el => {
  observer.observe(el);
});

// Notification System
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 90px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideInRight 0.3s ease-out;
    max-width: 350px;
    font-weight: 500;
  `;
  
  notification.querySelector('.notification-content').style.cssText = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
  `;
  
  notification.querySelector('.notification-close').style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  `;
  
  document.body.appendChild(notification);
  
  // Close button functionality
  notification.querySelector('.notification-close').addEventListener('click', () => {
    notification.remove();
  });
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// Add notification animations to CSS
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(notificationStyles);

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  // Add loading animation to page
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease-in-out';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
  
  // Show welcome message
  setTimeout(() => {
    showNotification('Welcome to Zedekiah Tech Clinic!', 'success');
  }, 1000);
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.code);
  if (konamiCode.length > konamiSequence.length) {
    konamiCode.shift();
  }
  
  if (konamiCode.length === konamiSequence.length && 
      konamiCode.every((code, index) => code === konamiSequence[index])) {
    showNotification('🎉 Easter egg found! You discovered the Konami code!', 'success');
    // Add special effect
    document.body.style.animation = 'rainbow 3s ease-in-out';
    setTimeout(() => {
      document.body.style.animation = '';
    }, 3000);
  }
});

// Add rainbow animation
const rainbowStyles = document.createElement('style');
rainbowStyles.textContent = `
  @keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    25% { filter: hue-rotate(90deg); }
    50% { filter: hue-rotate(180deg); }
    75% { filter: hue-rotate(270deg); }
    100% { filter: hue-rotate(360deg); }
  }
`;
document.head.appendChild(rainbowStyles);

// Scroll to top functionality
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #ff9800, #ff5722);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  box-shadow: 0 5px 15px rgba(255, 152, 0, 0.3);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    scrollToTopBtn.style.opacity = '1';
    scrollToTopBtn.style.visibility = 'visible';
  } else {
    scrollToTopBtn.style.opacity = '0';
    scrollToTopBtn.style.visibility = 'hidden';
  }
});

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  const stars = document.querySelector('.stars');
  
  if (hero && stars) {
    const rate = scrolled * -0.5;
    stars.style.transform = `translateY(${rate}px)`;
  }
});

console.log('🚀 Zedekiah Tech Clinic website loaded successfully!');
console.log('💡 Try the Konami code for a surprise: ↑↑↓↓←→←→BA');

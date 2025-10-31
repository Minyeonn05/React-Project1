import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/animate.css'; 
import '../assets/css/styles.css';
import '../assets/css/HomePage.css';

function HomePage() {
  const slides = useMemo(
    () => [
      '/images/slider/fashion-slideshow-01.jpg',
      '/images/slider/fashion-slideshow-02.jpg',
      '/images/slider/fashion-slideshow-03.jpg',
    ],
    []
  );
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const slideContent = [
    { 
      title: <>Glamorous<br/>Glam</>, 
      subtitle: "From casual to formal, we've got you covered" 
    },
    { 
      title: <>Simple <br className="md-hidden"/>Style</>, 
      subtitle: "From casual to formal, we've got you covered" 
    },
    { 
      title: <>Glamorous<br/>Glam</>, 
      subtitle: "From casual to formal, we've got you covered" 
    },
  ];

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [current]);

  // Trigger animation reset when slide changes
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [current]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrent(index);
  };

  return (
    <main>
      <div className="tf-slideshow slider-effect-fade position-relative">
        <div className="wrap-slider">
          {/* Animated image with fade effect */}
          <div 
            className="slider-image-wrapper"
            style={{
              position: 'relative',
              width: '100%',
              height: '100vh',
              overflow: 'hidden'
            }}
          >
            {slides.map((slide, index) => (
              <img 
                key={index}
                src={slide} 
                alt={`fashion-slideshow-${index + 1}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: current === index ? 1 : 0,
                  transition: 'opacity 1s ease-in-out'
                }}
              />
            ))}
          </div>

          {/* Text content with animations */}
          <div className="box-content">
            <div className="container">
              {!isAnimating && (
                <>
                  <h1 
                    className="fade-item fade-item-1"
                    style={{
                      animation: 'fadeInUp 1s ease-out',
                      animationDelay: '0.2s',
                      animationFillMode: 'both'
                    }}
                  >
                    {slideContent[current].title}
                  </h1>
                  <p 
                    className="fade-item fade-item-2"
                    style={{
                      animation: 'fadeInUp 1s ease-out',
                      animationDelay: '0.4s',
                      animationFillMode: 'both'
                    }}
                  >
                    {slideContent[current].subtitle}
                  </p>
                  <Link 
                    to="/shop-default" 
                    className="fade-item fade-item-3 tf-btn btn-fill animate-hover-btn btn-xl radius-3"
                    style={{
                      animation: 'fadeInUp 1s ease-out',
                      animationDelay: '0.6s',
                      animationFillMode: 'both'
                    }}
                  >
                    <span>Shop collection</span>
                    <i className="icon icon-arrow-right"></i>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      
        {/* Pagination dots */}
        <div className="wrap-pagination">
          <div className="container">
            <div className="sw-dots sw-pagination-slider justify-content-center">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`swiper-pagination-bullet${i === current ? ' swiper-pagination-bullet-active' : ''}`}
                  aria-pressed={i === current}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => goToSlide(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default HomePage;
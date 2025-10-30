import React, { useMemo, useState } from 'react';

function HomePage() {
  const slides = useMemo(
    () => [
      '../images/slider/fashion-slideshow-01.jpg',
      '../images/slider/fashion-slideshow-02.jpg',
      '../images/slider/fashion-slideshow-03.jpg',
    ],
    []
  );
  const [current, setCurrent] = useState(0);

  return (
    <main>
      <section className="home-hero">
        <div className="home-hero__inner container-fluid">
          <div className="home-hero__text">
            <h1 className="home-hero__title">Glamorous<br/>Glam</h1>
            <p className="home-hero__subtitle">From casual to formal, we've got you covered</p>
            <a href="/shop-default" className="btn btn-dark home-hero__cta">
              <span>Shop collection</span>
              <span className="home-hero__cta-arrow">›</span>
            </a>
          </div>
          <div
            className="home-hero__image"
            aria-hidden="true"
            style={{ backgroundImage: `url(${slides[current]})` }}
          />
        </div>
        <div className="home-hero__dots" role="tablist" aria-label="Slideshow controls">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`dot${i === current ? ' active' : ''}`}
              aria-pressed={i === current}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default HomePage;



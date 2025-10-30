import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link สำหรับ React Router
import '../assets/css/animate.css'; 
import '../assets/css/styles.css';

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

  // 2. สร้าง Array ของข้อมูลสไลด์ (เผื่ออนาคตข้อความต่างกัน)
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

  return (
    <main>
      {/* 3. เปลี่ยน <section className="home-hero"> เป็นโครงสร้างจาก index.html */}
      <div className="tf-slideshow slider-effect-fade position-relative">

        {/*          * ใน index.html จริงๆ จะมี swiper-wrapper และ swiper-slide
         * แต่เราใช้ React state ควบคุม จึงจำลองแค่โครงสร้างข้างใน
        */}
        <div className="wrap-slider">
          {/* 4. (สำคัญ!) ใช้ <img /> tag แทน div+backgroundImage (จะแก้ปัญหา height) */}
          <img src={slides[current]} alt="fashion-slideshow" />

          {/* 5. เปลี่ยน home-hero__text เป็น box-content และเพิ่ม .container */}
          <div className="box-content">
            <div className="container">
              {/* 6. อัปเดต className ของ h1, p, a ให้ตรงกับ index.html */}
              {/* 10. (สำคัญ!) เพิ่ม key={current} เพื่อบังคับให้ React re-render 
                 *                 และ re-trigger CSS animation (fade-item) 
                 *                 เมื่อสไลด์เปลี่ยน
              */}
              <h1 key={`title-${current}`} className="fade-item fade-item-1">{slideContent[current].title}</h1>
              <p key={`subtitle-${current}`} className="fade-item fade-item-2">{slideContent[current].subtitle}</p>
              <Link 
                key={`link-${current}`}
                to="/shop-default" 
                className="fade-item fade-item-3 tf-btn btn-fill animate-hover-btn btn-xl radius-3"
              >
                <span>Shop collection</span>
                {/* 7. เปลี่ยน span (ลูกศร) เป็น i tag */}
                <i className="icon icon-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      
        {/* 8. อัปเดตโครงสร้าง Dots (ปุ่มกลมๆ) ให้ตรงกับ index.html */}
        <div className="wrap-pagination">
          <div className="container">
            <div className="sw-dots sw-pagination-slider justify-content-center">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  // 9. ใช้ Class ของ Swiper ที่ CSS คุณน่าจะรู้จัก
                  className={`swiper-pagination-bullet${i === current ? ' swiper-pagination-bullet-active' : ''}`}
                  aria-pressed={i === current}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setCurrent(i)}
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




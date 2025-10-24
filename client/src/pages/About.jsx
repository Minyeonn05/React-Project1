import React from 'react';

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero / Banner (from original about-us.html) */}
      <section className="tf-slideshow about-us-page position-relative py-5">
        <div className="banner-wrapper">
          <img
            src="/images/collections/AutAunGle.jpg"
            alt="hero"
            className="w-100"
          />
          <div className="box-content text-center py-5">
            <div className="container py-4">
              <div className="text text-white fs-1" style={{fontSize: '5rem', fontWeight: 1000 }}>
                Empowering women to achieve <br className="d-xl-block d-none" /> fitness
                goals with style
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro/title */}
      <section className="flat-spacing-9 py-5">
        <div className="container">
          <div className="flat-title my-0 text-center">
            <h2 className="title mb-3">We are Ecommerc</h2>
            <p className="sub-title text-black-2 fs-5 mx-auto" style={{maxWidth: 860}}>
              Welcome to our classic women's clothing store, where we believe that
              timeless style never goes out of fashion. Our collection features
              classic pieces that are both stylish and versatile, perfect for
              building a wardrobe that will last for years.
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="line"></div>
      </div>

      {/* Team / content sections (simplified and converted to JSX) */}
      <section className="flat-spacing-23 flat-image-text-section py-5">
        <div className="container">
          <div className="tf-grid-layout md-col-2 tf-img-with-text style-4 align-items-center">
            <div className="tf-image-wrap mb-3 mb-md-0">
              <img
                src="/images/collections/69Aut.png"
                alt="Anud"
                className="w-100 rounded"
              />
            </div>
            <div className="tf-content-wrap px-0 d-flex justify-content-center w-100">
              <div className="px-3 px-md-0">
                <div className="heading mb-2" style={{ fontSize: '3.2rem', fontWeight:700 }}>Anud Chuatrakool</div>
                <div className="heading mb-3" style={{ fontSize: '1.6rem', fontWeight:600 }}>Student ID : 672110165</div>
                <div className="heading mb-3">Role : Backend</div>
                <div className="text">
                  <p className="h5 mb-2">คุณ อนุตร ฉั่วตระกูล คือผู้สร้างสรรค์ระบบ Backend</p>
                  <p className="h5 mb-2">ของแพลตฟอร์ม E-commerce เสื้อผ้าที่ใหญ่และดีที่สุด</p>
                  <p className="h5 mb-2">ทำให้เขากลายเป็นบุคคลสำคัญเบื้องหลังความสำเร็จของวง</p>
                  <p className="h5 mb-0">การแฟชั่นออนไลน์ในภูมิภาค.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flat-spacing-15 py-5">
        <div className="container">
          <div className="tf-grid-layout md-col-2 tf-img-with-text style-4 align-items-center">
            <div className="tf-content-wrap px-0 d-flex justify-content-center w-100 order-2 order-md-1">
              <div className="px-3 px-md-0">
                <div className="heading mb-2" style={{ fontSize: '3.2rem', fontWeight:700 }}>Anugul Sompoch</div>
                <div className="heading mb-3" style={{ fontSize: '1.6rem', fontWeight:600 }}>Student ID : 672110164</div>
                <div className="heading mb-3">Role : Frontend</div>
                <div className="text">
                  <p className="h5 mb-2">คือผู้ที่อยู่เบื้องหลังหน้าตาและประสบการณ์การใช้งานของแพลตฟอร์ม</p>
                  <p className="h5 mb-2">Ecommerce เล็ก เขาไม่ใช่คนเขียนโค้ด Frontend ด้วยตัวเองมากนัก</p>
                  <p className="h5 mb-2">แต่เป็นผู้ออกแบบ Wireframes และเขามุ่งเน้นที่การสร้างประสบการณ์</p>
                  <p className="h5 mb-0">ผู้ใช้ที่ดีที่สุดทำให้ประสบความสำเร็จแม้เขาจะกากในการเขียนโค้ด</p>
                </div>
              </div>
            </div>
            <div className="grid-img-group order-1 order-md-2">
              <div className="tf-image-wrap box-img item-1 mb-3"></div>
              <div className="tf-image-wrap box-img item-2">
                <div className="img-style">
                  <img
                    src="/images/collections/71Aun.jpg"
                    alt="Anugul"
                    className="w-100 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flat-testimonial-v2 flat-spacing-24 py-5">
        <div className="container">
          <div className="tf-grid-layout md-col-2 tf-img-with-text style-4 align-items-center">
            <div className="tf-image-wrap mb-3 mb-md-0">
              <img
                src="/images/collections/70Google.png"
                alt="Krittayot"
                className="w-100 rounded"
              />
            </div>
            <div className="tf-content-wrap px-0 d-flex justify-content-center w-100">
              <div className="px-3 px-md-0">
                <div className="heading mb-2" style={{ fontSize: '3.2rem', fontWeight:700 }}>Krittayot Kaewkanlaya</div>
                <div className="heading mb-3" style={{ fontSize: '1.6rem', fontWeight:600 }}>Student ID : 672110135</div>
                <div className="heading mb-3">Role : Frontend</div>
                <div className="text">
                  <p className="h5 mb-2">ในโลก E-commerce เขาคือดอนอันโตนิโอ"ช่างตัดเย็บดิจิทัล"</p>
                  <p className="h5 mb-2">ผู้ไม่เคยเขียนโค้ด แต่เขียน"กฎ"บัญชาการเขาใช้โค้ดทุกบรรทัด</p>
                  <p className="h5 mb-0">เป็นเครื่องมือต่อรองบีบคั้นให้ผู้ใช้ต้องยอมจำนนต่อปุ่มซื้อผลงานของเขา</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="line"></div>
      </div>
    </div>
  );
}

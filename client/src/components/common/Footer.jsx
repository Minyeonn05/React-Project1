import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer id="footer" className="footer">
      <div className="footer-wrap">
        <div className="footer-body">
          <div className="container">
            <div className="row">
              <div className="col-xl-3 col-md-6 col-12">
                <div className="footer-infor">
                  <div className="footer-logo">
                    <Link to="/">
                      {/* 2. ย้ายโลโก้ไปที่ /public/images/logo/logo.svg */}
                      <img src="/images/logo/logo.svg" alt="" />
                    </Link>
                  </div>
                  <ul>
                    <li>
                      <p>Address: 1234 Fashion Street, Suite 567, <br /> New York, NY 10001</p>
                    </li>
                    <li>
                      <p>Email: <a href="mailto:info@fashionshop.com">info@fashionshop.com</a></p>
                    </li>
                    <li>
                      <p>Phone: <a href="tel:(212) 555-1234">(212) 555-1234</a></p>
                    </li>
                  </ul>
                  <Link to="/contact" className="tf-btn btn-line">Get direction<i
                      className="icon icon-arrow1-top-left"></i></Link>
                  <ul className="tf-social-icon d-flex gap-10">
                    <li><a href="#" className="box-icon w_34 round social-facebook border-line-black"><i
                          className="icon fs-14 icon-fb"></i></a></li>
                    <li><a href="#" className="box-icon w_34 round social-twiter border-line-black"><i
                          className="icon fs-12 icon-Icon-x"></i></a></li>
                    <li><a href="#"
                        className="box-icon w_34 round social-instagram border-line-black"><i
                          className="icon fs-14 icon-instagram"></i></a></li>
                    <li><a href="#" className="box-icon w_34 round social-tiktok border-line-black"><i
                          className="icon fs-14 icon-tiktok"></i></a></li>
                    <li><a href="#"
                        className="box-icon w_34 round social-pinterest border-line-black"><i
                          className="icon fs-14 icon-pinterest-1"></i></a></li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-3 col-md-6 col-12 footer-col-block">
                <div className="footer-heading footer-heading-desktop">
                  <h6>Help</h6>
                </div>
                <div className="footer-heading footer-heading-moblie">
                  <h6>Help</h6>
                </div>
                <ul className="footer-menu-list tf-collapse-content">
                  {/* 3. เปลี่ยน <a> เป็น <Link> สำหรับหน้าภายใน */}
                  <li>
                    <Link to="/privacy-policy" className="footer-menu_item">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link to="/delivery-return" className="footer-menu_item"> Returns + Exchanges
                    </Link>
                  </li>
                  <li>
                    <Link to="/shipping-delivery" className="footer-menu_item">Shipping</Link>
                  </li>
                  <li>
                    <Link to="/terms-conditions" className="footer-menu_item">Terms &amp;
                      Conditions</Link>
                  </li>
                  <li>
                    <Link to="/faq" className="footer-menu_item">FAQ’s</Link>
                  </li>
                  <li>
                    <Link to="/compare" className="footer-menu_item">Compare</Link>
                  </li>
                  <li>
                    <Link to="/wishlist" className="footer-menu_item">My Wishlist</Link>
                  </li>
                </ul>
              </div>
              <div className="col-xl-3 col-md-6 col-12 footer-col-block">
                <div className="footer-heading footer-heading-desktop">
                  <h6>About us</h6>
                </div>
                <div className="footer-heading footer-heading-moblie">
                  <h6>About us</h6>
                </div>
                <ul className="footer-menu-list tf-collapse-content">
                  <li>
                    <Link to="/about-us" className="footer-menu_item">Our Story</Link>
                  </li>
                  <li>
                    <Link to="/our-store" className="footer-menu_item">Visit Our Store</Link>
                  </li>
                  <li>
                    <Link to="/contact" className="footer-menu_item">Contact Us</Link>
                  </li>
                  <li>
                    <Link to="/my-account" className="footer-menu_item">Account</Link>
                  </li>
                </ul>
              </div>
              <div className="col-xl-3 col-md-6 col-12">
                <div className="footer-newsletter footer-col-block">
                  <div className="footer-heading footer-heading-desktop">
                    <h6>Sign Up for Email</h6>
                  </div>
                  <div className="footer-heading footer-heading-moblie">
                    <h6>Sign Up for Email</h6>
                  </div>
                  <div className="tf-collapse-content">
                    <div className="footer-menu_item">Sign up to get first dibs on new arrivals, sales,
                      exclusive content, events and more!</div>
                    {/* 4. <form> ยังคงเดิม แต่เราจะจัดการมันด้วย State ใน React ทีหลัง */}
                    <form className="form-newsletter" id="subscribe-form" action="#" method="post"
                      acceptCharset="utf-8" data-mailchimp="true">
                      <div id="subscribe-content">
                        <fieldset className="email">
                          <input type="email" name="email-form" id="subscribe-email"
                            placeholder="Enter your email...." tabIndex="0"
                            aria-required="true" />
                        </fieldset>
                        <div className="button-submit">
                          <button id="subscribe-button"
                            className="tf-btn btn-sm radius-3 btn-fill btn-icon animate-hover-btn"
                            type="button">Subscribe<i
                              className="icon icon-arrow1-top-left"></i></button>
                        </div>
                      </div>
                      <div id="subscribe-msg"></div>
                    </form>
                    {/* ... ส่วน Currencies / Languages (อาจจะต้องใช้ Component แยก) ... */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div
                  className="footer-bottom-wrap d-flex gap-20 flex-wrap justify-content-between align-items-center">
                  <div className="footer-menu_item">© 2024 Ecomus Store. All Rights Reserved</div>
                  <div className="tf-payment">
                    {/* 5. img ต้องมี /> ปิดท้าย และย้ายรูปไป /public/images/payments/ */}
                    <img src="/images/payments/visa.png" alt="" />
                    <img src="/images/payments/img-1.png" alt="" />
                    <img src="/images/payments/img-2.png" alt="" />
                    <img src="/images/payments/img-3.png" alt="" />
                    <img src="/images/payments/img-4.png" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  
    );
};


export default Footer;
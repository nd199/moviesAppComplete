import React from "react";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import "./AboutUs.css";
import Lottie from "react-lottie";
import {
  AboutUsOptions,
  vastOptions,
  streamOptions,
  offlineOptions,
  affordOptions,
  AccessOptions,
  personalizedOptions,
  adBlockOption,
  parentalOption,
  downOption,
} from "../Components/AboutUsAnimationData";

const AboutUs = () => {
  return (
    <div className="aboutUs">
      <NavBar />
      <div className="aboutContainer">
        <h1>About</h1>
        <div className="aboutDesc">
          <div className="aboutLeft">
            <div className="aboutUsText">
              <p>
                Welcome to CN.io, the cutting-edge OTT (Over-The-Top) platform
                redefining the way you experience entertainment. Founded with
                the vision of bringing high-quality content to audiences
                worldwide, CN.io is committed to providing an unparalleled
                streaming experience that caters to all tastes and preferences.
              </p>
            </div>
          </div>
          <div className="aboutRight">
            <div className="aboutUsImage">
              <Lottie options={AboutUsOptions} />
            </div>
          </div>
        </div>
        <div className="about-container">
          <h2>What We Offer</h2>
          <div className="offer-cards">
            <div className="offer-card">
              <div className="card-top">
                <Lottie options={vastOptions} />
              </div>
              <div className="card-bottom">
                <h3>Vast Content Library</h3>
                <p>
                  CN.io boasts an extensive collection of movies, shows,
                  documentaries, and more, spanning various genres such as
                  drama, comedy, action, romance, and horror. Our library
                  includes both Hollywood blockbusters and independent films,
                  ensuring a wide array of choices for our viewers.
                </p>
              </div>
            </div>
            <div className="offer-card">
              <div className="card-top">
                <Lottie options={streamOptions} />
              </div>
              <div className="card-bottom">
                <h3>High-Quality Streaming</h3>
                <p>
                  Our platform utilizes the latest technology to deliver
                  high-definition video and superior sound quality. With
                  adaptive streaming, you can enjoy a seamless viewing
                  experience, regardless of your internet connection.
                </p>
              </div>
            </div>
            <div className="offer-card">
              <div className="card-top">
                <Lottie options={personalizedOptions} />
              </div>
              <div className="card-bottom">
                <h3>Personalized Experience</h3>
                <p>
                  CN.io’s intelligent recommendation system learns your viewing
                  preferences and suggests content tailored to your tastes.
                  Discover new favorites effortlessly and enjoy a curated
                  viewing experience.
                </p>
              </div>
            </div>
            <div className="offer-card">
              <div className="card-top">
                <Lottie options={AccessOptions} />
              </div>
              <div className="card-bottom">
                <h3>Accessibility and Convenience</h3>
                <p>
                  CN.io is available on multiple devices, including TVs,
                  laptops, tablets, and smartphones. Our user-friendly interface
                  ensures easy navigation, allowing you to find and enjoy
                  content quickly.
                </p>
              </div>
            </div>
            <div className="offer-card">
              <div className="card-top">
                <Lottie options={affordOptions} />
              </div>
              <div className="card-bottom">
                <h3>Affordable Plans</h3>
                <p>
                  We offer a variety of subscription plans to suit different
                  budgets and viewing needs. From monthly to annual plans, our
                  pricing is designed to provide maximum value.
                </p>
              </div>
            </div>
            <div className="offer-card">
              <div className="card-top">
                <Lottie options={adBlockOption} />
              </div>
              <div className="card-bottom">
                <h3>Ad-Free Viewing</h3>
                <p>
                  Enjoy your favorite shows and movies without interruptions.
                  CN.io offers an ad-free viewing experience, letting you
                  immerse yourself fully in the content.
                </p>
              </div>
            </div>
            <div className="offer-card">
              <div className="card-top" style={{ width: "100%" }}>
                <Lottie options={offlineOptions} />
              </div>
              <div className="card-bottom">
                <h3>Offline Viewing</h3>
                <p>
                  Take your entertainment on the go with our offline viewing
                  feature. Download your favorite titles and watch them anytime,
                  anywhere, without needing an internet connection.
                </p>
              </div>
            </div>
            <div className="offer-card">
              <div className="card-top">
                <Lottie options={parentalOption} />
              </div>
              <div className="card-bottom">
                <h3>Parental Controls</h3>
                <p>
                  CN.io is a family-friendly platform with customizable parental
                  controls. Ensure a safe and appropriate viewing environment
                  for your children with ease.
                </p>
              </div>
            </div>
            <div className="offer-card">
              <div className="card-top">
                <Lottie options={downOption} />
              </div>
              <div className="card-bottom">
                <h3>Easy Downloads</h3>
                <p>
                  Download your sources withing seconds and watch anywhere on
                  any device.
                </p>
              </div>
            </div>
          </div>
          <h2>Our Commitment</h2>
          <p>
            CN.io is dedicated to continuously improving our platform and
            expanding our content library. We are passionate about fostering a
            community of entertainment enthusiasts and are always looking for
            ways to innovate and enhance the user experience.
          </p>
          <p>
            Join us at CN.io, where stories come to life. Whether you're looking
            for the latest blockbuster, a hidden indie gem, or exclusive
            original content, CN.io is your gateway to endless entertainment.
            Thank you for choosing CN.io. Happy streaming!
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;

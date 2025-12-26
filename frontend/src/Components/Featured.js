import { AddToQueueOutlined, PlayArrowOutlined } from "@mui/icons-material";
import { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "./Featured.css";
import VideoComponent from "./VideoComponent";

const Featured = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedItems, setExpandedItems] = useState({});

  const featuredData = [
    {
      title: "John Wick 4",
      year: "2023",
      rating: "R",
      genre: "Action • Thriller",
      desc: "An action-packed thriller that follows legendary hitman John Wick (Keanu Reeves) as he continues his relentless quest for freedom. With the bounty on his head ever increasing, Wick faces his most formidable foes yet across New York, Paris, Osaka, and Berlin.",
      descMore:
        "John Wick uncovers a path to defeating the High Table once and for all, but a powerful new enemy, the Marquis de Gramont, forces old allies to turn against him. Each city brings stylized, brutal combat, stunning choreography, and a deeper emotional core as his past catches up. One final fight for peace, freedom, and redemption.",
      videoId: "X27pvZBu1ykSt5rHtmZA",
    },
    {
      title: "Coolie",
      year: "2025",
      rating: "U/A",
      genre: "Action • Thriller",
      desc: "A man from a humble background rises against a powerful criminal system in a high-octane action drama.",
      descMore:
        "Coolie (2025) is an action-thriller centered around a protagonist from the working class who challenges a deeply rooted criminal network, blending mass action sequences with social themes.",
      videoId: "sIwcMUy8Y3xypseKBH7E",
    },
    {
      title: "Athadu",
      year: "2005",
      rating: "U/A",
      genre: "Action • Thriller",
      desc: "A professional assassin takes on a new identity after being framed for a political murder.",
      descMore:
        "Athadu follows a highly skilled hitman who, after being falsely accused of assassinating a politician, assumes the identity of a deceased stranger and finds redemption while evading law enforcement and powerful enemies.",
      videoId: "ER3zitX5AEe45hn9KGq5",
    },
    {
      title: "Vedhalam",
      year: "2015",
      rating: "U/A",
      genre: "Action • Drama",
      desc: "A taxi driver with a mysterious past seeks justice while protecting his sister.",
      descMore:
        "Vedhalam tells the story of a seemingly simple taxi driver whose violent past resurfaces when his sister becomes the target of criminals, leading to a gripping tale of revenge, sacrifice, and redemption.",
      videoId: "BoneWfjXFHFzsbWY22lJ",
    },
    {
      title: "Jailer 2",
      year: "2025",
      rating: "U/A",
      genre: "Action • Thriller",
      desc: "A retired jailer is forced back into action when a powerful criminal network threatens his family.",
      descMore:
        "Jailer 2 continues the story of a fearless former jailer who confronts an even deadlier criminal syndicate, delivering intense action and emotional moments.",
      videoId: "ExGx22jAdDWUZ9jYAODc",
    },
  ];

  const toggleMore = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <section className="featured-slider">
      <div className="featured-header">
        <h2 className="featured-title-main">Featured</h2>
        <span className="featured-subtitle">
          Epic movies handpicked for you
        </span>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="featured-swiper"
      >
        {featuredData.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="featured-slide">
              <div className="featured-overlay" />

              <div className="featured-grid">
                <div className="featured-video-wrapper">
                  <VideoComponent
                    className="featured-video"
                    videoId={item.videoId}
                  />
                </div>

                {/* RIGHT: INFO */}
                <div className="featured-info">
                  <div className="featured-tag">Now Streaming</div>

                  <h1 className="featured-title">{item.title}</h1>

                  <div className="featured-meta">
                    <span className="featured-year">{item.year}</span>
                    <span className="featured-dot" />
                    <span className="featured-rating">{item.rating}</span>
                    <span className="featured-dot" />
                    <span className="featured-genre">{item.genre}</span>
                  </div>

                  <div className="featured-desc">
                    <p>{item.desc}</p>

                    {expandedItems[index] && (
                      <p className="featured-desc-more">{item.descMore}</p>
                    )}

                    <button
                      className="featured-more-btn"
                      onClick={() => toggleMore(index)}
                    >
                      {expandedItems[index] ? "Show less" : "More..."}
                    </button>
                  </div>

                  <div className="featured-buttons">
                    <button className="featured-btn featured-btn-primary">
                      <PlayArrowOutlined className="featured-btn-icon" />
                      <span>Watch</span>
                    </button>

                    <button className="featured-btn featured-btn-secondary">
                      <AddToQueueOutlined className="featured-btn-icon" />
                      <span>
                        <span className="featured-btn-sm-hidden">Add to </span>
                        Watchlist
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Featured;

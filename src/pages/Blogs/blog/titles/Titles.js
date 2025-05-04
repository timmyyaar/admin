import React, { useState, useEffect } from "react";

function Titles({ titles, mainTitleRef, titlesRefs }) {
  const [activeTitle, setActiveTitle] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const isAtBottom =
        Math.ceil(window.scrollY + window.innerHeight) >=
        document.documentElement.scrollHeight - 10;

      if (isAtBottom) {
        setActiveTitle(titles[titles.length - 1]);
      }
    };

    window.addEventListener("scroll", handleScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const title = titles.find(
            (t) =>
              titlesRefs.current[t] === entry.target ||
              (t === titles[0] && mainTitleRef.current === entry.target),
          );

          if (entry.isIntersecting) {
            setActiveTitle(title);
          }
        });
      },
      {
        threshold: [0],
        rootMargin: "0px 0px -90% 0px",
      },
    );

    if (mainTitleRef.current) {
      observer.observe(mainTitleRef.current);
    }

    titles.forEach((title) => {
      if (titlesRefs.current[title]) {
        observer.observe(titlesRefs.current[title]);
      }
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [titles, mainTitleRef, titlesRefs]);

  return (
    <div className="blog-titles">
      <span className="font-weight-semi-bold blog-titles-title">Content</span>
      <div className="blog-titles-content">
        {titles.map((title, index) => (
          <div
            key={`title-${index}`}
            className="blog-title"
            onClick={() => {
              if (!index) {
                mainTitleRef.current?.scrollIntoView({ behavior: "smooth" });
              } else {
                titlesRefs.current[title]?.scrollIntoView({
                  behavior: "smooth",
                });
              }
            }}
          >
            <span className="blog-title-number">{index + 1}.</span>{" "}
            <span
              className={`blog-title-text ${activeTitle === title ? "active" : ""}`}
            >
              {title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Titles;

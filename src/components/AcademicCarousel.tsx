import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// ✅ Import each image with a unique name
import heroImage1 from "@/assets/hero-image-1.jpg";
import heroImage2 from "@/assets/hero-image-2.jpg";
import heroImage3 from "@/assets/hero-image-3.jpg";


// ✅ Each slide can also define its text color (white or black)
const slides = [
  {
    image: heroImage1,
    title: "Connecting Proctors & Proctees",
    subtitle: "Building stronger academic relationships through technology",
    textColor: "text-white"
  },
  {
    image: heroImage2,
    title: "Track Academic Progress",
    subtitle: "Monitor grades, achievements, and milestones seamlessly",
    textColor: "text-white"
  },
  {
    image: heroImage3,
    title: "Digital Academic Records",
    subtitle: "Secure, organized, and accessible academic documentation",
    textColor: "text-white"
  },
 
];

const AcademicCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-96 rounded-xl overflow-hidden shadow-elevated">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="h-full w-full bg-cover bg-center relative"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            {/* ❌ Removed hero-gradient to keep original image color */}

            {/* ✅ Alternate text color per slide */}
            <div
              className={`absolute inset-0 flex flex-col justify-center items-center text-center p-6 ${slide.textColor}`}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {slide.title}
              </h2>
              <p className="text-lg md:text-xl opacity-90">{slide.subtitle}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default AcademicCarousel;

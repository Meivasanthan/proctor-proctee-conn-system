import { useState, useEffect } from 'react';
import loginSlide1 from '@/assets/login-slide-1.jpg';
import loginSlide2 from '@/assets/login-slide-2.jpg';
import loginSlide3 from '@/assets/login-slide-3.jpg';

const LoginSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: loginSlide1,
      alt: "Student and teacher collaboration"
    },
    {
      image: loginSlide2,
      alt: "Students and mentors in library"
    },
    {
      image: loginSlide3,
      alt: "Mentor guiding student work"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full h-48 md:h-56 rounded-xl overflow-hidden shadow-elevated mb-6">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      ))}
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default LoginSlideshow;
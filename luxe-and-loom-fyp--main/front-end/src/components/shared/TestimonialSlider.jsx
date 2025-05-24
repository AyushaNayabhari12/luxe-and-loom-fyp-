import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Controller } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Star } from "lucide-react"; // or any star icon
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const TestimonialSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const testimonials = [
    {
      text: "The quality of their shawls is unmatched. I've never felt anything so luxurious!",
      author: "Sarah J.",
      location: "New York",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1522767131594-6b7e96848fba?auto=format&fit=crop&q=80",
    },
    {
      text: "Their custom design service helped me create the perfect piece for my wedding day.",
      author: "Emily R.",
      location: "London",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80",
    },
    {
      text: "Exceptional craftsmanship and attention to detail. Worth every penny!",
      author: "Michael T.",
      location: "Paris",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80",
    },
    {
      text: "Exceptional craftsmanship and attention to detail. Worth every penny!",
      author: "Michael T.",
      location: "Paris",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80",
    },
    {
      text: "Exceptional craftsmanship and attention to detail. Worth every penny!",
      author: "Michael T.",
      location: "Paris",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="relative py-20">
      {/* Custom Nav Buttons */}
      <button
        ref={prevRef}
        className="absolute top-1/2 left-1 z-10 transform -translate-y-1/2 bg-white rounded-full shadow-md h-8 w-8 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
      >
        <FaChevronLeft />
      </button>
      <button
        ref={nextRef}
        className="absolute top-1/2 right-0 z-10 transform -translate-y-1/2 bg-white rounded-full shadow-md h-8 w-8 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
      >
        <FaChevronRight />
      </button>

      <Swiper
        modules={[Navigation, Autoplay, Controller]}
        autoplay={{ delay: 5000 }}
        loop={true}
        spaceBetween={30}
        slidesPerView={1}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        breakpoints={{
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white p-8 rounded-2xl shadow-sm h-full flex flex-col">
              <div className="flex-1">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-lg italic mb-6">{testimonial.text}</p>
              </div>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-gray-600">{testimonial.location}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TestimonialSlider;

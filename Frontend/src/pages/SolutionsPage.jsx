import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LandingNavbar from '../components/LandingNavbar';
import LandingFooter from '../components/LandingFooter';
import connectIllustration from '../assets/connect.svg';
import studentImage from '../assets/student.png';
import student2Image from '../assets/student2.png';
import student3Image from '../assets/student3.png';
import successIllustration from '../assets/success-social-media---achievement-woman-trophy-award-reward-win-competition.svg';
import mentorImage from '../assets/mentor.png';
import mentor2Image from '../assets/mentor2.png';
import mentorDashboardImage from '../assets/MentorDahboard.png';

const SolutionsPage = () => {
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [isHeadlineVisible, setIsHeadlineVisible] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mentorImageIndex, setMentorImageIndex] = useState(0);

  const mentorImages = [
    { src: mentorImage, title: 'Mentor Chat Section', desc: 'Interact with mentees through real-time chat' },
    { src: mentor2Image, title: 'Ratings & Reviews', desc: 'View mentee feedback and performance ratings' }
  ];

  useEffect(() => {
    const imageElement = document.getElementById('student-solution-image');
    const headlineElement = document.getElementById('student-solution-headline');

    const imageObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsImageVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const headlineObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeadlineVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (imageElement) imageObserver.observe(imageElement);
    if (headlineElement) headlineObserver.observe(headlineElement);

    return () => {
      if (imageElement) imageObserver.unobserve(imageElement);
      if (headlineElement) headlineObserver.unobserve(headlineElement);
    };
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1410] to-[#0a0a0a]">
      <LandingNavbar />
      
      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text */}
            <div>
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-8">
                Solutions for Students
              </h1>
              <p className="text-2xl text-gray-300 mb-8">
                Tailored mentorship solutions designed for students to achieve their goals.
              </p>
            </div>
            
            {/* Right Side - Illustration */}
            <div className="hidden lg:flex justify-center">
              <img 
                src={connectIllustration} 
                alt="Connect Illustration" 
                className="w-full max-w-md h-auto"
                style={{
                  filter: 'brightness(0.8) invert(1) sepia(1) hue-rotate(180deg) saturate(5) contrast(1.5) brightness(1.2)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Student Solution Image Section */}
      <div className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div 
            id="student-solution-headline"
            className="mb-12 text-center"
            style={{
              opacity: isHeadlineVisible ? 1 : 0,
              transform: isHeadlineVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s ease-out'
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Student Forum Solution
            </h2>
            <p className="text-lg text-gray-400">
              Connect with peers, ask questions, and share knowledge in a collaborative community
            </p>
          </div>
          <div
            id="student-solution-image"
            style={{
              opacity: isImageVisible ? 1 : 0,
              transform: isImageVisible ? 'scale(1)' : 'scale(0.95)',
              transition: 'all 0.8s ease-out'
            }}
          >
            <div 
              className="relative w-full max-w-4xl mx-auto h-96 cursor-pointer"
              style={{ perspective: '1000px' }}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div 
                className="relative w-full h-full transition-all duration-700 ease-in-out"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* Front Side - Student Image */}
                <div 
                  className="absolute w-full h-full rounded-xl group"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden'
                  }}
                >
                  <img 
                    src={studentImage}
                    alt="Student Solution"
                    className="w-full h-full rounded-xl object-cover"
                    style={{
                      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  />
                  {/* Overlay - Shows on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="text-white">
                      <h3 className="text-xl font-bold mb-2">Student Forum</h3>
                      <p className="text-sm text-gray-200">Click to flip and explore</p>
                    </div>
                  </div>
                </div>
                
                {/* Back Side - Student2 Image */}
                <div 
                  className="absolute w-full h-full rounded-xl"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)'
                  }}
                >
                  <img 
                    src={student2Image}
                    alt="Student Forum Demo"
                    className="w-full h-full rounded-xl object-cover"
                  />
                  {/* Overlay - Shows on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="text-white">
                      <h3 className="text-xl font-bold mb-2">Forum in Action</h3>
                      <p className="text-sm text-gray-200">Click to flip back</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-gray-400 mt-4 text-sm">Click to flip card</p>
          </div>
        </div>
      </div>

      {/* Task Completion Solution Section */}
      <div className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Task Completion Solution
              </h2>
              <p className="text-xl text-gray-400">
                Students are given structured tasks to complete, helping them apply knowledge and track progress
              </p>
            </div>

            {/* Right Side - Image */}
            <div className="flex justify-center">
              <img 
                src={student3Image}
                alt="Task Completion"
                className="w-full max-w-2xl rounded-xl"
                style={{
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Solutions for Mentors Section */}
      <div className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Mentor Hero Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-6xl md:text-7xl font-bold text-white mb-8">
                Solutions for Mentors
              </h2>
              <p className="text-2xl text-gray-300">
                Powerful tools to manage mentees, track progress, and build meaningful mentorship relationships.
              </p>
            </div>

            {/* Mentor Features Grid */}
            <div className="flex justify-center">
              <img 
                src={successIllustration}
                alt="Mentor Success"
                className="w-full max-w-sm h-auto"
                style={{
                  filter: 'brightness(0) invert(1) drop-shadow(0 10px 20px rgba(0, 0, 0, 0.4))'
                }}
              />
            </div>
          </div>

          {/* Mentor Image Section with Carousel */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-4xl">
              {/* Image Container */}
              <div className="relative overflow-hidden rounded-xl">
                <div 
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{
                    transform: `translateX(-${mentorImageIndex * 100}%)`
                  }}
                >
                  {mentorImages.map((image, index) => (
                    <div key={index} className="w-full flex-shrink-0 flex items-center justify-center">
                      <div className="relative group">
                        <img 
                          src={image.src}
                          alt={image.title}
                          className="w-full rounded-xl"
                          style={{
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                          <div className="text-white">
                            <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                            <p className="text-sm text-gray-200">{image.desc}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Left Arrow Button */}
              <button
                onClick={() => setMentorImageIndex((prev) => (prev === 0 ? mentorImages.length - 1 : prev - 1))}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all duration-300 z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Right Arrow Button */}
              <button
                onClick={() => setMentorImageIndex((prev) => (prev === mentorImages.length - 1 ? 0 : prev + 1))}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all duration-300 z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 mt-6">
                {mentorImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setMentorImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === mentorImageIndex ? 'bg-white w-8' : 'bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Trusted Banner */}
          <div className="mt-20 text-center">
            <p className="text-gray-400 mb-8">Trusted by many students</p>
            <div className="flex flex-wrap justify-center items-center gap-12">
              <div className="text-white font-bold text-lg">10K+ Students</div>
              <div className="text-white font-bold text-lg">500+ Mentors</div>
              <div className="text-white font-bold text-lg">4.9★ Rating</div>
              <div className="text-white font-bold text-lg">95% Success</div>
            </div>
          </div>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
};

export default SolutionsPage;

import React, { useState, useEffect } from 'react';
import Header from "../parts/Header";
import Footer from "../parts/Footer";
import Home from "../parts/Home";
import News from "../parts/News";
import Projects from "../parts/Projects";
import Contact from "../parts/Contact";
import './css/style.css'

const HomePage = () => {
    const [counter, setCounter] = useState(1);

    const autoSlide = () => {
        setCounter((prevCounter) => prevCounter + 1);
    };

    const plusSlides = (n) => {
        setCounter((prevCounter) => prevCounter + n);
    };

    const currentSlide = (n) => {
        setCounter(n);
    };

    return (
        <div>
            <Header/>
            <main className="main">
                <Home/>
                <News/>
                <Projects/>
                <Contact/>
            </main>
            <a href="#" className="scrollup" id="scroll-up">
                <i className="ri-arrow-up-s-line scrollup__icon"></i>
            </a>
            <Footer/>

        </div>
    );
};

export default HomePage;

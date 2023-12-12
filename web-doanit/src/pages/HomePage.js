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
            <main className="main">
                <Home/>
                <News/>
                <Projects/>
                <Contact/>
            </main>


        </div>
    );
};

export default HomePage;

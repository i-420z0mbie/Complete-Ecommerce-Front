import React from "react";
import Hero from "../components/Hero";
import CatHome from "../components/CatHome.jsx";

const Home = () => {
    return (
        <div>
            <Hero />
            <div className="container my-5">
            </div>
            <div>
                <CatHome />
            </div>
        </div>
    );
};

export default Home;

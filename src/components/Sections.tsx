import React from 'react';

const Sections: React.FC = () => {
    return (
        <>
            <section className="morning" id="about">
                <h2>🌅 About Me</h2>
                <p>The dawn breaks, a fresh start. This is my story and passion for creating beautiful digital experiences.</p>
            </section>
            <section className="noon" id="projects">
                <h2>☀️ Projects</h2>
                <p>In the full light of day, my work shines. Here are some of my most notable projects.</p>
                <div className="projects-grid">
                    <div className="project-card"><h3>Project 1</h3><p>A full-stack web application for e-commerce.</p></div>
                    <div className="project-card"><h3>Project 2</h3><p>A responsive marketing website for a startup.</p></div>
                    <div className="project-card"><h3>Project 3</h3><p>An interactive data visualization tool.</p></div>
                </div>
            </section>
            <section className="evening">
                <h2>🌇 Case Studies</h2>
                <p>As the day winds down, I reflect on the process. A deeper look into my approach, challenges, and solutions for key projects.</p>
            </section>
            <section className="dusk">
                <h2>🌄 My Thoughts</h2>
                <p>The sky is warm and glowing, just before sunset. Here, I share personal insights on design and technology.</p>
            </section>
            <section className="tech">
                <h2>🛠 Tech Stack</h2>
                <p>Here’s the arsenal i use to build modern web experiences.</p>
                <div className="tech-grid">
                    <div className="tech-card"><h3>React</h3><p>Modern frontend framework for building dynamic UI.</p></div>
                    <div className="tech-card"><h3>TypeScript</h3><p>Typed JavaScript for more reliable code.</p></div>
                    <div className="tech-card"><h3>Node.js</h3><p>Backend JavaScript runtime for APIs and server logic.</p></div>
                    <div className="tech-card"><h3>Tailwind CSS</h3><p>Utility-first CSS for rapid styling.</p></div>
                    <div className="tech-card"><h3>Framer Motion</h3><p>Advanced animations for React components.</p></div>
                </div>
            </section>
        </>
    );
};

export default Sections;
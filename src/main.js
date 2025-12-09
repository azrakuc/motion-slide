import { marked } from 'marked';
import slidesMarkdown from '../slides.md?raw';

const slideContainer = document.getElementById('slide-container');
let slides = [];
let currentSlideIndex = 0;
const slideDuration = 5000; // 5 seconds per slide

async function init() {
    try {
        const text = slidesMarkdown;
        const html = marked.parse(text);

        // Split by <hr> (horizontal rule) to create slides
        // marked converts '---' to '<hr>'
        const slideContents = html.split('<hr>');

        slideContents.forEach((content, index) => {
            if (content.trim() === '') return;

            const slideDiv = document.createElement('div');
            slideDiv.classList.add('slide');
            slideDiv.innerHTML = content;

            // Apply motion typography to text nodes
            applyMotionTypography(slideDiv);

            slideContainer.appendChild(slideDiv);
            slides.push(slideDiv);
        });

        createBackgroundLights();

        if (slides.length > 0) {
            showSlide(0);
            setInterval(nextSlide, slideDuration);
        }
    } catch (error) {
        console.error('Failed to load slides:', error);
        slideContainer.innerHTML = '<p>Error loading slides.</p>';
    }
}

function applyMotionTypography(element) {
    // Simple implementation: wrap characters in tags
    const targets = element.querySelectorAll('h1, h2, p, li');
    targets.forEach(target => {
        const text = target.innerText;
        // Avoid destroying child elements if any (simple text only for now)
        if (target.children.length === 0) {
            target.innerHTML = text.split('').map(char => {
                if (char === ' ') return ' ';
                return `<span class="char">${char}</span>`;
            }).join('');
        }
    });
}

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active', 'slide-enter', 'slide-exit');
        if (i === index) {
            slide.classList.add('active', 'slide-enter');
        } else if (i === (index - 1 + slides.length) % slides.length) {
            // Previous slide exits
        }
    });
}

function nextSlide() {
    const prevIndex = currentSlideIndex;
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;

    const prevSlide = slides[prevIndex];
    const nextSlideEl = slides[currentSlideIndex];

    prevSlide.classList.remove('active', 'slide-enter');
    prevSlide.classList.add('slide-exit');

    nextSlideEl.classList.add('active', 'slide-enter');

    // Cleanup exit class after animation
    setTimeout(() => {
        prevSlide.classList.remove('slide-exit');
    }, 800);
}

function createBackgroundLights() {
    const backgroundContainer = document.getElementById('background');
    const lightCount = 50;

    for (let i = 0; i < lightCount; i++) {
        const light = document.createElement('div');
        light.classList.add('light');

        // Random properties
        const size = Math.random() * 100 + 20; // 20px to 120px
        const left = Math.random() * 100; // 0% to 100%
        const duration = Math.random() * 10 + 5; // 5s to 15s
        const delay = Math.random() * 10; // 0s to 10s

        // Random Color (Vibrant HSL)
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
        const lightness = Math.floor(Math.random() * 20) + 50; // 50-70%
        const color = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`;

        light.style.width = `${size}px`;
        light.style.height = `${size}px`;
        light.style.left = `${left}%`;
        light.style.animationDuration = `${duration}s`;
        light.style.animationDelay = `-${delay}s`; // Negative delay to start immediately

        // Override default white gradient with colored one
        light.style.background = `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0) 70%)`;

        backgroundContainer.appendChild(light);
    }
}

init();

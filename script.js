// Neural Network Background Animation
class NeuralNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.mouseX = 0;
        this.mouseY = 0;

        this.resize();
        this.initNodes();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    initNodes() {
        const nodeCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        this.nodes = [];

        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw nodes
        this.nodes.forEach((node, i) => {
            // Move nodes
            node.x += node.vx;
            node.y += node.vy;

            // Bounce off edges
            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;

            // Mouse interaction
            const dx = this.mouseX - node.x;
            const dy = this.mouseY - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                const force = (150 - dist) / 150;
                node.x -= dx * force * 0.03;
                node.y -= dy * force * 0.03;
            }

            // Draw node (monochrome dark)
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(10, 10, 10, 0.4)';
            this.ctx.fill();

            // Draw connections
            for (let j = i + 1; j < this.nodes.length; j++) {
                const other = this.nodes[j];
                const dx = other.x - node.x;
                const dy = other.y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(node.x, node.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = `rgba(10, 10, 10, ${(1 - distance / 150) * 0.15})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize neural network on page load
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('neural-bg');
    if (canvas) {
        new NeuralNetwork(canvas);
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Voice Agent Integration
const AGENT_ID = 'agent_8101k74c1nh9f81t2rfwt67j3v7g';
let isAnimatingActive = false;

document.addEventListener('DOMContentLoaded', async function() {
    const waveform = document.getElementById('voiceWaveform');
    const status = document.getElementById('voiceStatus');

    if (!waveform || !status) return;

    // Import voice agent module
    const { startVoiceAgent, stopVoiceAgent, isConversationActive } = await import('./voice-agent.js');

    status.textContent = 'Click to start voice conversation';
    waveform.style.cursor = 'pointer';

    // Handle waveform click - toggle on/off
    waveform.addEventListener('click', async function() {
        if (isConversationActive()) {
            await stopVoiceAgent();
            isAnimatingActive = false;
            waveform.classList.remove('active');
            status.textContent = 'Click to start voice conversation';
        } else {
            // Always use English (no language switching)
            await startVoiceAgent(AGENT_ID, handleStatusChange, 'en');
        }
    });

    function handleStatusChange(mode, statusText) {
        status.textContent = statusText;

        if (mode === 'listening' || mode === 'agent_speaking') {
            if (!isAnimatingActive) {
                isAnimatingActive = true;
                waveform.classList.add('active');
                animateWaveformActive();
            }
        } else if (mode === 'disconnected' || mode === 'error') {
            isAnimatingActive = false;
            waveform.classList.remove('active');
        }
    }

    // Active animation (when listening/speaking)
    function animateWaveformActive() {
        if (!isAnimatingActive) return;

        const bars = waveform.querySelectorAll('.waveform-bar');
        bars.forEach((bar, index) => {
            const height = 15 + Math.random() * 50;
            bar.style.height = height + 'px';
        });
        requestAnimationFrame(animateWaveformActive);
    }

    // Idle animation
    function animateWaveformIdle() {
        if (isAnimatingActive) {
            requestAnimationFrame(animateWaveformIdle);
            return;
        }

        const bars = waveform.querySelectorAll('.waveform-bar');
        bars.forEach((bar, index) => {
            const height = 20 + Math.sin(Date.now() / 200 + index) * 15;
            bar.style.height = height + 'px';
        });
        requestAnimationFrame(animateWaveformIdle);
    }

    animateWaveformIdle();
});

// Log site build info
console.log('%c⚡ Paul Gosnell - Anthropic Frontier Prototyping', 'font-size: 20px; font-weight: bold; color: #0A0A0A;');
console.log('%cBuilt with Claude Code in under 5 hours', 'font-size: 14px; color: #525252;');
console.log('%cApplying to: Software Engineer, Frontier Prototyping', 'font-size: 12px; color: #A3A3A3;');

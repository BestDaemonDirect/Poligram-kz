const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");

const setHeaderState = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 18);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

menuToggle?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
        nav.classList.remove("is-open");
        menuToggle?.setAttribute("aria-expanded", "false");
    }
});

const counters = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        const target = Number(element.dataset.count);
        const duration = 900;
        const start = performance.now();

        const tick = (time) => {
            const progress = Math.min((time - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = Math.round(target * eased);

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        };

        requestAnimationFrame(tick);
        counterObserver.unobserve(element);
    });
}, { threshold: 0.45 });

counters.forEach((counter) => counterObserver.observe(counter));

const canvas = document.getElementById("projectsChart");

if (canvas) {
    const context = canvas.getContext("2d");
    const years = [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
    const values = [1, 9, 5, 23, 30, 38, 12, 29, 22, 19, 15, 31, 52, 88, 26, 15, 17];

    const drawChart = () => {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.width * 0.45 * dpr);
        context.setTransform(dpr, 0, 0, dpr, 0, 0);

        const width = rect.width;
        const height = rect.width * 0.45;
        const padding = {
            top: 22,
            right: 18,
            bottom: 62,
            left: 58
        };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;
        const max = 90;

        context.clearRect(0, 0, width, height);
        context.fillStyle = "#202528";
        context.fillRect(0, 0, width, height);
        context.strokeStyle = "rgba(255, 255, 255, 0.16)";
        context.lineWidth = 1;

        for (let tick = 0; tick <= max; tick += 20) {
            const y = padding.top + chartHeight - (tick / max) * chartHeight;
            context.beginPath();
            context.moveTo(padding.left, y);
            context.lineTo(width - padding.right, y);
            context.stroke();
            context.fillStyle = "rgba(255, 255, 255, 0.66)";
            context.font = "12px Arial";
            context.textAlign = "right";
            context.fillText(String(tick), padding.left - 10, y + 4);
        }

        const gap = 8;
        const barWidth = Math.max(8, (chartWidth - gap * (values.length - 1)) / values.length);

        values.forEach((value, index) => {
            const x = padding.left + index * (barWidth + gap);
            const barHeight = (value / max) * chartHeight;
            const y = padding.top + chartHeight - barHeight;
            const gradient = context.createLinearGradient(0, y, 0, y + barHeight);
            gradient.addColorStop(0, "#37b6ff");
            gradient.addColorStop(1, "#1683d2");
            context.fillStyle = gradient;
            context.strokeStyle = "rgba(255, 255, 255, 0.65)";
            context.fillRect(x, y, barWidth, barHeight);
            context.strokeRect(x, y, barWidth, barHeight);

            context.save();
            context.translate(x + barWidth / 2, height - padding.bottom + 34);
            context.rotate(-Math.PI / 4);
            context.fillStyle = "rgba(255, 255, 255, 0.76)";
            context.font = "12px Arial";
            context.textAlign = "right";
            context.fillText(String(years[index]), 0, 0);
            context.restore();
        });

        context.fillStyle = "rgba(255, 255, 255, 0.78)";
        context.font = "13px Arial";
        context.textAlign = "center";
        context.fillText("Год подписания договора", padding.left + chartWidth / 2, height - 14);

        context.save();
        context.translate(16, padding.top + chartHeight / 2);
        context.rotate(-Math.PI / 2);
        context.fillText("Количество проектов", 0, 0);
        context.restore();
    };

    drawChart();
    window.addEventListener("resize", drawChart);
}

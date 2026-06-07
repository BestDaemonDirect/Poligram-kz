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
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const animateCounter = (element) => {
    const target = Number(element.dataset.count);

    if (!Number.isFinite(target)) {
        return;
    }

    if (prefersReducedMotion) {
        element.textContent = String(target);
        return;
    }

    const duration = Number(element.dataset.countDuration ?? 1200);
    const decimals = (String(element.dataset.count).split(".")[1] ?? "").length;
    const start = performance.now();

    const formatValue = (value) => {
        return decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
    };

    const tick = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = formatValue(target * eased);

        if (progress < 1) {
            requestAnimationFrame(tick);
        }
    };

    element.textContent = "0";
    requestAnimationFrame(tick);
};

if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        });
    }, { threshold: 0.45 });

    counters.forEach((counter) => counterObserver.observe(counter));
} else {
    counters.forEach(animateCounter);
}

const canvas = document.getElementById("projectsChart");
const years = [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
const values = [1, 9, 5, 23, 30, 38, 12, 29, 22, 19, 15, 31, 52, 88, 26, 15, 17];
let chartFrameId = 0;
let chartAnimationToken = 0;
let chartObserver = null;

const chartLabels = {
    ru: {
        x: "Год подписания договора",
        y: "Количество проектов"
    },
    en: {
        x: "Contract signing year",
        y: "Number of projects"
    },
    kk: {
        x: "Шарт жасалған жыл",
        y: "Жобалар саны"
    }
};

const getI18n = () => window.PoligramI18n;
const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);
const easeOutBack = (value) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(value - 1, 3) + c1 * Math.pow(value - 1, 2);
};

const drawChart = (animationProgress = 1) => {
    if (!canvas) {
        return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
        return;
    }

    const language = getI18n()?.getCurrentLanguage?.() ?? "ru";
    const labels = chartLabels[language] ?? chartLabels.ru;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width;
    const height = rect.width * 0.45;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const padding = {
        top: 22,
        right: 18,
        bottom: 62,
        left: 58
    };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const max = 90;
    const sweepY = padding.top + chartHeight * (1 - animationProgress);

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
        const barRevealStart = index * 0.04;
        const barReveal = clamp((animationProgress - barRevealStart) / 0.28);
        const grow = clamp(easeOutBack(barReveal), 0, 1.08);
        const animatedHeight = barHeight * grow;
        const animatedY = padding.top + chartHeight - animatedHeight;
        const centerX = x + barWidth / 2;
        const gradient = context.createLinearGradient(0, animatedY, 0, animatedY + animatedHeight);
        const fillAlpha = 0.16 + barReveal * 0.84;

        gradient.addColorStop(0, "#37b6ff");
        gradient.addColorStop(1, "#1683d2");

        if (barReveal > 0) {
            context.save();
            context.shadowColor = "rgba(55, 182, 255, 0.35)";
            context.shadowBlur = 18 * clamp(animationProgress - barRevealStart, 0, 1);
            context.fillStyle = gradient;
            context.globalAlpha = fillAlpha;
            context.fillRect(x, animatedY, barWidth, animatedHeight);
            context.globalAlpha = Math.min(1, fillAlpha + 0.15);
            context.strokeStyle = "rgba(255, 255, 255, 0.65)";
            context.strokeRect(x, animatedY, barWidth, animatedHeight);
            context.restore();

            if (barReveal > 0.95) {
                context.save();
                context.fillStyle = "rgba(83, 184, 255, 0.26)";
                context.beginPath();
                context.ellipse(centerX, animatedY - 2, Math.max(10, barWidth * 0.38), 6, 0, 0, Math.PI * 2);
                context.fill();
                context.restore();
            }
        }

        context.save();
        context.translate(centerX, height - padding.bottom + 34);
        context.rotate(-Math.PI / 4);
        context.globalAlpha = clamp((animationProgress - 0.25) * 1.4);
        context.fillStyle = "rgba(255, 255, 255, 0.76)";
        context.font = "12px Arial";
        context.textAlign = "right";
        context.fillText(String(years[index]), 0, 0);
        context.restore();
    });

    if (animationProgress < 1) {
        context.save();
        context.globalAlpha = 0.18 * (1 - animationProgress);
        context.strokeStyle = "#53b8ff";
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(padding.left, sweepY);
        context.lineTo(width - padding.right, sweepY);
        context.stroke();
        context.restore();
    }

    context.fillStyle = "rgba(255, 255, 255, 0.78)";
    context.font = "13px Arial";
    context.textAlign = "center";
    context.globalAlpha = clamp((animationProgress - 0.2) * 1.4);
    context.fillText(labels.x, padding.left + chartWidth / 2, height - 14);

    context.save();
    context.translate(16, padding.top + chartHeight / 2);
    context.rotate(-Math.PI / 2);
    context.globalAlpha = clamp((animationProgress - 0.2) * 1.4);
    context.fillText(labels.y, 0, 0);
    context.restore();
};

const animateChart = () => {
    if (prefersReducedMotion) {
        drawChart(1);
        return;
    }

    chartAnimationToken += 1;
    const token = chartAnimationToken;
    const duration = 1900;
    const startedAt = performance.now();

    cancelAnimationFrame(chartFrameId);

    const frame = (time) => {
        if (token !== chartAnimationToken) {
            return;
        }

        const progress = clamp((time - startedAt) / duration);
        drawChart(easeOutCubic(progress));

        if (progress < 1) {
            chartFrameId = requestAnimationFrame(frame);
        }
    };

    chartFrameId = requestAnimationFrame(frame);
};

const startChartAnimation = () => {
    if ("IntersectionObserver" in window && canvas) {
        chartObserver?.disconnect();
        chartObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                animateChart();
                chartObserver?.unobserve(entry.target);
            });
        }, { threshold: 0.3 });

        chartObserver.observe(canvas);
        return;
    }

    animateChart();
};

startChartAnimation();

document.addEventListener("poligram:language-change", startChartAnimation);
window.addEventListener("resize", startChartAnimation);

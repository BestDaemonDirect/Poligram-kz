const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");

let scrollTimeout;
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
        const duration = 800;

    /* Mouse-driven subtle parallax for the page background.
       Uses background-position updates (throttled via rAF) and respects
       prefers-reduced-motion. Disabled on small screens. */
    (function() {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const el = document.querySelector('.interactive-bg');
        if (!el) return;

        let mouseX = 0, mouseY = 0;
        let rafId = null;
        const strength = 6; // max percent offset

        function update() {
            rafId = null;
            const posX = 50 + mouseX * strength;
            const posY = 50 + mouseY * (strength * 0.6);
            el.style.backgroundPosition = `${posX}% ${posY}%`;
        }

        function onMove(e) {
            const rect = document.documentElement.getBoundingClientRect();
            const x = (e.touches ? e.touches[0].clientX : e.clientX) || 0;
            const y = (e.touches ? e.touches[0].clientY : e.clientY) || 0;
            // normalize to -1..1
            mouseX = ((x - rect.left) / rect.width - 0.5) * 2;
            mouseY = ((y - rect.top) / rect.height - 0.5) * 2;
            if (!rafId) rafId = requestAnimationFrame(update);
        }

        function reset() {
            if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
            el.style.backgroundPosition = '50% 50%';
        }

        // Disable on small screens for touch UX/performance
        function isSmall() { return window.innerWidth <= 640; }

        function startListeners() {
            window.addEventListener('mousemove', onMove, { passive: true });
            window.addEventListener('touchmove', onMove, { passive: true });
            window.addEventListener('mouseleave', reset, { passive: true });
        }

        function stopListeners() {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('mouseleave', reset);
        }

        if (!isSmall()) startListeners();
        window.addEventListener('resize', () => {
            if (isSmall()) stopListeners(); else startListeners();
        });
    })();
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

const revealItems = document.querySelectorAll(
    ".hero-content, .hero-meta, .section-heading, .section-copy, .engineer-photo, .stats-grid article, .glass-panel, .projects-grid article, .chart-shell, .contact-card, .logos-grid img"
);

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("reveal-visible");
        observer.unobserve(entry.target);
    });
}, { threshold: 0.18 });

revealItems.forEach((item) => revealObserver.observe(item));

const canvas = document.getElementById("projectsChart");
let drawChart = null;
const languageButtons = document.querySelectorAll("[data-lang]");
const i18nElements = document.querySelectorAll("[data-i18n]");
const chartLabelsByLang = {
    ru: {
        xAxis: "Год подписания договора",
        yAxis: "Количество проектов"
    },
    en: {
        xAxis: "Year of contract signing",
        yAxis: "Project count"
    },
    kk: {
        xAxis: "Келісімшартқа қол қою жылы",
        yAxis: "Жобалар саны"
    }
};
const translations = {
    ru: {
        "nav.about": "О компании",
        "nav.scale": "Масштаб",
        "nav.tech": "Технологии",
        "nav.projects": "Проекты",
        "nav.partners": "Партнеры",
        "nav.contacts": "Контакты",
        "selector.about": "О компании",
        "selector.scale": "Масштаб",
        "selector.tech": "Технологии",
        "selector.projects": "Проекты",
        "selector.partners": "Партнёры",
        "selector.contacts": "Контакты",
        "hero.kicker": "Архитектура будущего, рассчитанная до миллиметра",
        "hero.title": "POLIGRAM",
        "hero.services": "Проектирование • Инжиниринг • Цифровые технологии строительства",
        "about.title": "О компании",
        "about.description1": "ТОО «Poligram» — это полностью казахстанская компания, динамично развивающаяся на внутреннем рынке инжиниринга и строительства.",
        "about.description2": "Мы используем опыт высококлассных специалистов для предоставления качественных услуг в нефтегазовом, промышленном и гражданском секторах.",
        "about.goal": "Наша цель",
        "about.goalDescription": "Обеспечение безопасности и эффективности каждого объекта через инновационные проектные решения.",
        "scale.title": "Масштабы бизнеса",
        "scale.years": "лет на рынке",
        "scale.experts": "штатных экспертов",
        "scale.branches": "филиалов по РК",
        "scale.departments": "проф. отделов",
        "scale.note": "Компания обладает достаточной материально-технической базой и всеми необходимыми ресурсами для оказания полного комплекса услуг по всем профилям.",
        "tech.title": "Технологический потенциал в цифрах",
        "tech.projects": "успешно реализованных крупных проектов",
        "tech.localContent": "казахстанское содержание с развитой сетью из 5 региональных филиалов",
        "tech.license": "государственной лицензии на проектирование и СМР",
        "tech.category": "I категория",
        "tech.certification": "международная сертификация систем менеджмента, экологии и безопасности",
        "projects.title": "Текущие и перспективные проекты компании",
        "projects.energy.title": "Энергетика",
        "projects.energy.description": "ПСД на строительство крупной водогрейной котельной мощностью 100 Гкал/час в г. Алматы для КГУ «Управление энергетики и водоснабжения».",
        "projects.networks.title": "Магистральные сети",
        "projects.networks.description": "Проектирование и перекладка стратегического подземного газопровода по проспекту Аль-Фараби для АО «QAZAQGAZ AIMAQ».",
        "projects.transport.title": "Транспорт и логистика",
        "projects.transport.description": "Проектирование и авторский надзор за строительством новых путей широкой колеи на станции Алтынколь для АО «НК «КТЖ».",
        "projects.engineering.title": "СМР-инжиниринг",
        "projects.engineering.description": "Разработка ПСД по монтажу систем греющего кабеля водостоков и усилению конструкций на НПС «Исатай» и «Курмангазы» для АО «КТК-К».",
        "dynamics.title": "Динамика реализации проектов",
        "dynamics.range": "2009–2025",
        "partners.title": "Нам доверяют лидеры рынка",
        "contacts.title": "ТОО «Poligram»",
        "contacts.bin.label": "БИН",
        "contacts.legal.label": "Юридический адрес",
        "contacts.legal.value": "Республика Казахстан, Атырау, улица Жәнібек Хан, дом 30",
        "contacts.actual.label": "Фактический адрес",
        "contacts.actual.value": "г. Атырау, ул. Талгата Бигельдинова, 51, 3-й этаж",
        "contacts.iban.label": "IBAN",
        "contacts.bank.label": "Банк",
        "contacts.bank.value": "АО «Народный Банк Казахстан», БИК HSBKKZKX",
        "contacts.phone.label": "Телефон",
        "contacts.phone.value": "8 (7122) 30 51 37",
        "contacts.email.label": "Email",
        "contacts.ceo.label": "Директор",
        "contacts.ceo.value": "Баязитов Г.И.",
        "footer.text": "ТОО «Poligram» — инженерная компания с полным циклом проектирования и цифровыми решениями для крупных объектов.",
        "footer.links.contacts": "Контакты",
        "footer.links.partners": "Партнёры",
        "footer.links.about": "О компании",
        "footer.copy": "© 2025 POLIGRAM. Все права защищены."
    },
    en: {
        "nav.about": "About",
        "nav.scale": "Scale",
        "nav.tech": "Technology",
        "nav.projects": "Projects",
        "nav.partners": "Partners",
        "nav.contacts": "Contacts",
        "selector.about": "About",
        "selector.scale": "Scale",
        "selector.tech": "Technology",
        "selector.projects": "Projects",
        "selector.partners": "Partners",
        "selector.contacts": "Contacts",
        "hero.kicker": "Future architecture engineered to the millimeter",
        "hero.title": "POLIGRAM",
        "hero.services": "Design • Engineering • Digital construction technologies",
        "about.title": "About the company",
        "about.description1": "LLP Poligram is a fully Kazakhstani company actively growing in the domestic engineering and construction market.",
        "about.description2": "We use the experience of top specialists to provide high-quality services in the oil and gas, industrial, and civil sectors.",
        "about.goal": "Our mission",
        "about.goalDescription": "Ensuring safety and efficiency of every facility through innovative design solutions.",
        "scale.title": "Business scale",
        "scale.years": "years on the market",
        "scale.experts": "in-house experts",
        "scale.branches": "branches across Kazakhstan",
        "scale.departments": "professional divisions",
        "scale.note": "The company has sufficient material and technical resources to provide a full range of services across all profiles.",
        "tech.title": "Technological potential in numbers",
        "tech.projects": "successfully completed large-scale projects",
        "tech.localContent": "100% Kazakhstani content with a developed network of 5 regional offices",
        "tech.license": "state license for design and construction works",
        "tech.category": "Category I",
        "tech.certification": "international certification of management, environment, and safety systems",
        "projects.title": "Current and future company projects",
        "projects.energy.title": "Energy",
        "projects.energy.description": "Design documentation for the construction of a large hot-water boiler house with a capacity of 100 Gcal/h in Almaty for KGU ‘Energy and Water Supply Management’.",
        "projects.networks.title": "Main pipelines",
        "projects.networks.description": "Design and relocation of a strategic underground gas pipeline along Al-Farabi Avenue for JSC ‘QAZAQGAZ AIMAQ’.",
        "projects.transport.title": "Transport and logistics",
        "projects.transport.description": "Design and architectural supervision of new broad-gauge tracks at Altynkol station for JSC ‘NC ‘KTZ’.",
        "projects.engineering.title": "Construction engineering",
        "projects.engineering.description": "Development of design documentation for the installation of heated gutter cable systems and reinforcement of structures at Isatai and Kurmangazy pump stations for JSC ‘KTK-K’.",
        "dynamics.title": "Project execution dynamics",
        "dynamics.range": "2009–2025",
        "partners.title": "Trusted by market leaders",
        "contacts.title": "LLP Poligram",
        "contacts.bin.label": "BIN",
        "contacts.legal.label": "Legal address",
        "contacts.legal.value": "Republic of Kazakhstan, Atyrau, Zhanibek Khan Street, house 30",
        "contacts.actual.label": "Physical address",
        "contacts.actual.value": "Atyrau, Talgat Bigeldinov St., 51, 3rd floor",
        "contacts.iban.label": "IBAN",
        "contacts.bank.label": "Bank",
        "contacts.bank.value": "JSC ‘People’s Bank of Kazakhstan’, BIC HSBKKZKX",
        "contacts.phone.label": "Phone",
        "contacts.phone.value": "+7 (7122) 30 51 37",
        "contacts.email.label": "Email",
        "contacts.ceo.label": "Director",
        "contacts.ceo.value": "Bayazitov G.I.",
        "footer.text": "LLP Poligram is an engineering company with full-cycle design and digital solutions for major facilities.",
        "footer.links.contacts": "Contacts",
        "footer.links.partners": "Partners",
        "footer.links.about": "About",
        "footer.copy": "© 2025 POLIGRAM. All rights reserved."
    },
    kk: {
        "nav.about": "Компания туралы",
        "nav.scale": "Көлемі",
        "nav.tech": "Технологиялар",
        "nav.projects": "Жобалар",
        "nav.partners": "Серіктестер",
        "nav.contacts": "Байланыс",
        "selector.about": "Компания туралы",
        "selector.scale": "Көлемі",
        "selector.tech": "Технологиялар",
        "selector.projects": "Жобалар",
        "selector.partners": "Серіктестер",
        "selector.contacts": "Байланыс",
        "hero.kicker": "Болашақ архитектурасы миллиметрге дейін есептелген",
        "hero.title": "POLIGRAM",
        "hero.services": "Жобалау • Инжиниринг • Құрылысқа цифрлық технологиялар",
        "about.title": "Компания туралы",
        "about.description1": "ТОО «Poligram» — бұл инженерлік және құрылыс саласындағы отандық нарықта қарқынды дамып келе жатқан толықтай қазақстандық компания.",
        "about.description2": "Біз мұнай-газ, өнеркәсіп және азаматтық салаларда жоғары сапалы қызмет көрсету үшін жоғары білікті сарапшылардың тәжірибесін пайдаланамыз.",
        "about.goal": "Біздің мақсатымыз",
        "about.goalDescription": "Әр нысанның қауіпсіздігі мен тиімділігін инновациялық жобалық шешімдер арқылы қамтамасыз ету.",
        "scale.title": "Бизнестің көлемі",
        "scale.years": "жыл нарықта",
        "scale.experts": "штат бойынша сарапшылар",
        "scale.branches": "Қазақстан бойынша филиалдар",
        "scale.departments": "проф. бөлімдер",
        "scale.note": "Компания барлық профилдер бойынша толық қызмет көрсетуге жеткілікті материалдық-техникалық базаға және ресурстарға ие.",
        "tech.title": "Сандық көрсеткіштер бойынша технологиялық әлеует",
        "tech.projects": "сәтті жүзеге асырылған ірі жобалар",
        "tech.localContent": "5 өңірлік филиалдан тұратын 100% қазақстандық құрам",
        "tech.license": "жобалау және құрылыс жұмыстарын орындауға мемлекеттік лицензия",
        "tech.category": "I санат",
        "tech.certification": "басқару, экология және қауіпсіздік жүйелерінің халықаралық сертификаты",
        "projects.title": "Компанияның ағымдағы және перспективалы жобалары",
        "projects.energy.title": "Энергетика",
        "projects.energy.description": "Алматыда КГУ «Энергетика және сумен жабдықтау басқармасы» үшін 100 Гкал/сағ қуатты ірі ыстық су қазандық үйін салуға арналған жобалық-сметалық құжаттама.",
        "projects.networks.title": "Магистральдық желілер",
        "projects.networks.description": "АО «QAZAQGAZ AIMAQ» үшін Әл-Фараби даңғылы бойымен стратегиялық жерүсті газ құбырын жобалау және қайта орнату.",
        "projects.transport.title": "Көлік және логистика",
        "projects.transport.description": "АО «ҰК «ҚТЖ» үшін Алтынколь станциясында жаңа кең жолақты жолдарды жобалау және авторлық қадағалау.",
        "projects.engineering.title": "CМР-инжиниринг",
        "projects.engineering.description": "АО «КТК-К» үшін Исатай және Құрманғазы мұнай салу станцияларында жылу кабельдік жүйелерін монтаждау және конструкцияларды күшейту бойынша жобалық құжаттама әзірлеу.",
        "dynamics.title": "Жобаларды іске асыру динамикасы",
        "dynamics.range": "2009–2025",
        "partners.title": "Нарық көшбасшылары бізге сенім артады",
        "contacts.title": "ТОО «Poligram»",
        "contacts.bin.label": "БСН",
        "contacts.legal.label": "Заңды мекенжай",
        "contacts.legal.value": "Қазақстан Республикасы, Атырау, Жәнібек Хан көшесі, 30 үй",
        "contacts.actual.label": "Фактілік мекенжай",
        "contacts.actual.value": "Атырау, Талғат Бигелдинов көшесі, 51, 3-қабат",
        "contacts.iban.label": "IBAN",
        "contacts.bank.label": "Банк",
        "contacts.bank.value": "АО «Халық Банкі Қазақстан», БИК HSBKKZKX",
        "contacts.phone.label": "Телефон",
        "contacts.phone.value": "+7 (7122) 30 51 37",
        "contacts.email.label": "Электрондық пошта",
        "contacts.ceo.label": "Директор",
        "contacts.ceo.value": "Баязитов Г.И.",
        "footer.text": "ТОО «Poligram» — толық циклді жобалау және ірі нысандарға арналған цифрлық шешімдер ұсынатын инженерлік компания.",
        "footer.links.contacts": "Байланыс",
        "footer.links.partners": "Серіктестер",
        "footer.links.about": "Компания туралы",
        "footer.copy": "© 2025 POLIGRAM. Барлық құқықтар қорғалған."
    }
};
let currentChartLang = localStorage.getItem("siteLang") || "ru";

const setActiveLang = (lang) => {
    languageButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.lang === lang);
    });
};

const translatePage = (lang) => {
    document.documentElement.lang = lang;
    localStorage.setItem("siteLang", lang);

    i18nElements.forEach((element) => {
        const key = element.dataset.i18n;
        const translation = translations[lang]?.[key];
        if (translation) {
            element.textContent = translation;
        }
    });

    const altElements = document.querySelectorAll("[data-i18n-alt]");
    altElements.forEach((element) => {
        const key = element.dataset.i18nAlt;
        const translation = translations[lang]?.[key];
        if (translation) {
            element.alt = translation;
        }
    });

    currentChartLang = lang;
    if (canvas && typeof drawChart === "function") {
        drawChart();
    }
};

languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const lang = button.dataset.lang;
        setActiveLang(lang);
        translatePage(lang);
    });
});

setActiveLang(currentChartLang);
translatePage(currentChartLang);

if (canvas) {
    const context = canvas.getContext("2d");
    const years = [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
    const values = [1, 9, 5, 23, 30, 38, 12, 29, 22, 19, 15, 31, 52, 88, 26, 15, 17];

    drawChart = () => {
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
        const backGradient = context.createLinearGradient(0, 0, 0, height);
        backGradient.addColorStop(0, "rgba(234, 243, 255, 0.95)");
        backGradient.addColorStop(1, "rgba(215, 230, 255, 0.95)");
        context.fillStyle = backGradient;
        context.fillRect(0, 0, width, height);

        context.fillStyle = "rgba(255, 255, 255, 0.95)";
        context.fillRect(padding.left, padding.top, chartWidth, chartHeight);

        context.strokeStyle = "rgba(15, 50, 100, 0.14)";
        context.lineWidth = 1;
        context.setLineDash([4, 6]);

        for (let tick = 0; tick <= max; tick += 20) {
            const y = padding.top + chartHeight - (tick / max) * chartHeight;
            context.beginPath();
            context.moveTo(padding.left, y);
            context.lineTo(width - padding.right, y);
            context.stroke();
            context.fillStyle = "rgba(15, 50, 100, 0.65)";
            context.font = "12px Arial";
            context.textAlign = "right";
            context.fillText(String(tick), padding.left - 10, y + 4);
        }

        context.setLineDash([]);
        context.beginPath();
        context.moveTo(padding.left, padding.top);
        context.lineTo(padding.left, height - padding.bottom + 1);
        context.lineTo(width - padding.right, height - padding.bottom + 1);
        context.strokeStyle = "rgba(15, 50, 100, 0.2)";
        context.stroke();

        const gap = 10;
        const barWidth = Math.max(8, (chartWidth - gap * (values.length - 1)) / values.length);
        const labelStep = chartWidth / values.length < 40 ? 3 : chartWidth / values.length < 55 ? 2 : 1;
        const barGradient = context.createLinearGradient(0, padding.top, 0, height - padding.bottom);
        barGradient.addColorStop(0, "rgba(29, 134, 255, 0.95)");
        barGradient.addColorStop(1, "rgba(17, 37, 74, 0.9)");

        values.forEach((value, index) => {
            const x = padding.left + index * (barWidth + gap);
            const barHeight = (value / max) * chartHeight;
            const y = padding.top + chartHeight - barHeight;
            context.fillStyle = barGradient;
            context.fillRect(x, y, barWidth, barHeight);
            context.strokeStyle = "rgba(15, 50, 100, 0.22)";
            context.strokeRect(x, y, barWidth, barHeight);

            if (index % labelStep === 0) {
                context.save();
                context.translate(x + barWidth / 2, height - padding.bottom + 22);
                context.fillStyle = "rgba(15, 50, 100, 0.85)";
                context.font = "10px Arial";
                context.textAlign = "center";
                context.fillText(String(years[index]), 0, 0);
                context.restore();
            }
        });

        const chartLabels = chartLabelsByLang[currentChartLang] || chartLabelsByLang.ru;
        context.fillStyle = "rgba(15, 50, 100, 0.95)";
        context.font = "13px Arial";
        context.textAlign = "center";
        context.fillText(chartLabels.xAxis, padding.left + chartWidth / 2, height - 14);

        context.save();
        context.translate(16, padding.top + chartHeight / 2);
        context.rotate(-Math.PI / 2);
        context.fillText(chartLabels.yAxis, 0, 0);
        context.restore();
    };

    drawChart();
    
    // Throttled resize handler
    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(drawChart, 250);
    });
}

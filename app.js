// Константы с данными визитки
const clientData = {
    name: "Дмитрий Малышев",
    description: "Помогаю бизнесу автоматизировать процессы и увеличивать прибыль | Экономлю ваше время и ресурсы",
    avatar: "home.png",
    socialLinks: [
        { name: "telegram", url: "https://t.me/developer_telegrams", icon: "🤖" },
    ],
    skills: [
        "Telegram боты",
        "Маркетплейсы",
        "API сервисы",
        "Android автоматизация",
        "Парсинг сайтов",
        "Автоматизация сайтов",
        "Сайты",
        "Внедрение ИИ"
    ]
};

// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand();

// Получение элементов DOM
const elements = {
    name: document.getElementById('name'),
    description: document.getElementById('description'),
    avatar: document.getElementById('avatar'),
    socialLinks: document.getElementById('socialLinks'),
    telegramBtn: document.getElementById('telegramBtn'),
    themeToggle: document.getElementById('themeToggle'),
    skillsGrid: document.getElementById('skillsGrid'),
    telegramGreeting: document.getElementById('telegramGreeting')
};

// Функция для установки данных в DOM
function setData() {
    elements.name.textContent = clientData.name;
    elements.description.textContent = clientData.description;
    elements.avatar.src = clientData.avatar;
    
    // Создание социальных ссылок
    clientData.socialLinks.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        a.className = 'social-link';
        a.innerHTML = link.icon;
        a.target = '_blank';
        a.addEventListener('click', () => {
            trackVisit(`Пользователь перешел в ${link.name}`);
        });
        elements.socialLinks.appendChild(a);
    });

    // Создание навыков
    clientData.skills.forEach(skill => {
        const div = document.createElement('div');
        div.className = 'skill-item';
        div.textContent = skill;
        div.addEventListener('click', () => {
            trackVisit(`Пользователь заинтересовался навыком: ${skill}`);
        });
        elements.skillsGrid.appendChild(div);
    });
}

// Обработка темы
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    trackVisit(`Пользователь сменил тему на ${newTheme}`);
}

function updateThemeIcon(theme) {
    const icon = elements.themeToggle.querySelector('.theme-icon');
    icon.textContent = theme === 'light' ? '🌙' : '☀️';
}

// Функция для отправки данных о посещении
async function trackVisit(action) {
    try {
        const user = tg.initDataUnsafe.user;
        const visitData = {
            user_id: user?.id || 'не указан',
            username: user?.username ? `@${user.username}` : 'не указан',
            first_name: user?.first_name || 'не указано',
            last_name: user?.last_name || 'не указано',
            source: "telegram_webapp",
            action: action,
            timestamp: new Date().toISOString(),
            platform: user ? 'Telegram' : 'Веб-браузер',
            has_telegram_data: !!user
        };

        await fetch('https://dima-razrab.ru/visits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(visitData)
        });
    } catch (error) {
        console.error('Error tracking visit:', error);
    }
}

// Обработка Telegram Web App
function initTelegram() {
    if (tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user;
        const greeting = `Привет, ${user.first_name}!`;
        elements.telegramBtn.textContent = greeting;
        
        if (user.username) {
            console.log(`Username пользователя: @${user.username}`);
            localStorage.setItem('tg_username', user.username);
        }

        // Отправляем данные о первом посещении
        trackVisit('Пользователь открыл визитку');
    }
    
    elements.telegramBtn.addEventListener('click', () => {
        trackVisit('Пользователь нажал "Написать в Telegram"');
        tg.close();
    });
}

// Инициализация приложения
function init() {
    setData();
    initTheme();
    initTelegram();
    
    elements.themeToggle.addEventListener('click', toggleTheme);

    // Отслеживание кликов по кнопкам
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const btnText = btn.textContent.trim();
            trackVisit(`Пользователь нажал кнопку: ${btnText}`);
        });
    });
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', init); 
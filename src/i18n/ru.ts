export const ru = {
    common: {
        loading: "Загрузка...",
        noData: "Нет данных",
        close: "Закрыть",
        logout: "Выйти",
        about: "О нас",
        opacity: "Прозрачность",
    },

    topControls: {
        switchToEnglish: "Переключить на английский",
        switchToRussian: "Переключить на русский",
        lightTheme: "Светлая тема",
        darkTheme: "Тёмная тема",
    },

    sidebar: {
        areaFlux: "Площадные потоки",
        pointSources: "Точечные источники",
        infrastructure: "Инфраструктура",
    },

    areaFlux: {
        sentinel5p: {
            title: "Sentinel-5P",
            description: "Ежедневные данные метана Sentinel-5P",
            availableDates: "Доступные даты",
            loading: "Загрузка данных Sentinel-5P...",
            loadingMonth: "Загрузка месяца...",
            notFound: "Данные Sentinel-5P не найдены.",
            loadError: "Не удалось загрузить данные Sentinel-5P.",
            datesLoadError: "Не удалось загрузить даты Sentinel-5P.",
        },

        annualMethane: {
            title: "Годовой метан",
            description: "Среднегодовые данные метана Sentinel-5P",
            year: "Год",
            loading: "Загрузка годовых данных метана...",
            notFound: "Годовые данные метана не найдены.",
            loadError: "Не удалось загрузить годовые данные метана.",
        },
    },

    calendar: {
        previousMonth: "Предыдущий месяц",
        nextMonth: "Следующий месяц",

        weekdays: {
            mon: "Пн",
            tue: "Вт",
            wed: "Ср",
            thu: "Чт",
            fri: "Пт",
            sat: "Сб",
            sun: "Вс",
        },
    },

    map: {
        controls: {
            zoomIn: "Приблизить",
            zoomOut: "Отдалить",
            reset: "Исходный вид",
            layers: "Подложки",
        },

        basemaps: {
            custom: "Кастомная",
            streets: "Улицы",
            satellite: "Спутник",
        },

        pixel: {
            title: "Sentinel-5P",
            annualTitle: "Годовой метан",
            methane: "XCH₄",
            unit: "ppb",
            loading: "Получение значения...",
            noData: "Нет данных",
            loadError: "Не удалось получить значение пикселя.",
            close: "Закрыть",
        },
    },

    infrastructure: {
        title: "Инфраструктура",
        oilGas: "Нефть и газ",
        other: "Другие",
    },

    adminLayers: {
        title: "\u0410\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u0438\u0432\u043d\u044b\u0435 \u0441\u043b\u043e\u0438",
        country: {
            title: "\u0413\u0440\u0430\u043d\u0438\u0446\u0430 \u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d\u0430",
            description: "\u0413\u043e\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u0435\u043d\u043d\u0430\u044f \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u0438\u0432\u043d\u0430\u044f \u0433\u0440\u0430\u043d\u0438\u0446\u0430",
        },
        regions: {
            title: "\u041e\u0431\u043b\u0430\u0441\u0442\u0438",
            description: "\u0413\u0440\u0430\u043d\u0438\u0446\u044b \u043e\u0431\u043b\u0430\u0441\u0442\u0435\u0439",
        },
        districts: {
            title: "\u0420\u0430\u0439\u043e\u043d\u044b",
            description: "\u0413\u0440\u0430\u043d\u0438\u0446\u044b \u0440\u0430\u0439\u043e\u043d\u043e\u0432",
        },
    },

    auth: {
        login: {
            title: "Вход",
            description: "Войдите в аккаунт, чтобы получить доступ.",
            email: "Email",
            password: "Пароль",
            submit: "Войти",
            createAccount: "Создать аккаунт",
            error: "Не удалось выполнить вход.",
        },

        register: {
            title: "Создать аккаунт",
            description: "Запросите доступ к карте мониторинга метана.",
            name: "Имя",
            email: "Email",
            password: "Пароль",
            organization: "Организация",
            referralSource: "Откуда вы узнали о сайте?",
            usageReason: "С какой целью будете использовать сайт?",
            submit: "Создать аккаунт",
            backToLogin: "Вернуться ко входу",
            error: "Не удалось создать аккаунт.",
        },
    },
} as const;

type WidenStrings<T> = {
    [K in keyof T]: T[K] extends string ? string : WidenStrings<T[K]>;
};

export type Translation = WidenStrings<typeof ru>;

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
        today: "Сегодня",
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

        plumeLegend: {
            title: "Легенда шлейфа",
            paletteOnly: "Цветовая шкала",
            unavailable: "Параметры шкалы для EMIT пока не настроены.",
        },

        plumePixel: {
            title: "Значение пикселя",
            coordinates: "Координаты (широта, долгота)",
        },
    },

    infrastructure: {
        title: "Инфраструктура",
        oilGas: "Нефть и газ",
        other: "Другие",
        layers: {
            oilGasInfrastructure: "Нефтегазовые объекты",
            oilGasPipelines: "Нефте- и газопроводы",
            landfills: "Полигоны ТБО",
        },
        categories: {
            flaring: "Факельное сжигание газа",
            offshore: "Морские платформы",
            refineries: "НПЗ",
            terminals: "Нефтяные терминалы",
            processing: "Сбор и переработка",
            lng: "СПГ-объекты",
        },
        hints: {
            refineries: "Нефтеперерабатывающие заводы",
            lng: "Объекты сжиженного природного газа",
            landfills: "Полигоны твёрдых бытовых отходов",
        },
        popup: {
            operator: "Оператор",
            country: "Страна",
            region: "Регион",
            status: "Статус",
            date: "Дата источника",
        },
    },

    adminLayers: {
        title: "Административные слои",

        country: {
            title: "Граница Казахстана",
            description: "Государственная административная граница",
        },

        regions: {
            title: "Области",
            description: "Границы областей",
        },

        districts: {
            title: "Районы",
            description: "Границы районов",
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
    pointSources: {
        title: "Точечные источники",
        groups: "Группировки шлейфов",
        description: "Источники с повторными наблюдениями",
        group: "Источник",
        observations: "Наблюдений: {{count}}",
        unknownCount: "Число наблюдений неизвестно",
        page: "Страница",
        previousPage: "Предыдущая страница",
        nextPage: "Следующая страница",
        loadError: "Не удалось загрузить группировки.",
        noGroups: "Группировки не найдены.",
        retry: "Повторить",
        sources: {
            emit: "EMIT",
            tanager: "Tanager",
            orbio: "Orbio",
        },

        timeline: {
            title: "Хронология наблюдений",
            newestFirst: "Сначала новые",
            oldestFirst: "Сначала старые",
            notQuantified: "Не рассчитано",
            emissionHidden: "Не опубликовано",
            unknownSatellite: "Спутник не указан",
        },

        tabs: {
            timeline: "Хронология",
            details: "Детали шлейфа",
        },

        sort: {
            newest: "Сначала новые",
            oldest: "Сначала старые",
            emissionDesc: "Наибольший выброс",
            emissionAsc: "Наименьший выброс",
        },

        filters: {
            title: "Фильтры",
            sort: "Сортировка",
            satellites: "Спутники",
            from: "От",
            to: "До",
            date: "Дата наблюдения",
            single: "Одна дата",
            range: "Период",
            chooseDate: "Выбрать",
            clearDate: "Очистить дату",
            reset: "Сбросить",
            found: "Найдено: {{count}}",
            noMatches: "По выбранным фильтрам ничего не найдено.",
        },

        details: {
            title: "Наблюдения шлейфов",
            observations: "Наблюдений: {{count}}",
            loading: "Загрузка наблюдений...",
            loadError: "Не удалось загрузить наблюдения.",
            partialError: "Не удалось загрузить данные",
            noObservations: "Наблюдения не найдены.",
            limitWarning: "Достигнут лимит загрузки для",
            yes: "Да",
            no: "Нет",
            selectPlume: "Выберите шлейф в хронологии, чтобы посмотреть подробную информацию.",
        },

        metadata: {
            plume_id: "ID шлейфа",
            observed_at: "Дата наблюдения",
            date: "Дата",
            dcid: "DCID",
            orbit: "Орбита",
            scene_fids: "Scene FIDs",
            scene_id: "Scene ID",
            source_id: "ID источника",
            scene_timestamp: "Время съёмки",
            instrument: "Инструмент",
            platform: "Платформа",
            gas: "Газ",
            status: "Статус",
            satellite: "Спутник",
            model: "Модель",
            tile_name: "Тайл",
            mgrs: "MGRS",
            gsd: "Пространственное разрешение",
            off_nadir: "Угол отклонения",
            max_plume_concentration: "Макс. концентрация",
            concentration_uncertainty: "Погрешность концентрации",
            max_concentration_lat: "Широта максимума",
            max_concentration_lon: "Долгота максимума",
            emission_auto: "Оценка эмиссии",
            emission_uncertainty_auto: "Погрешность эмиссии",
            wind_speed_avg_auto: "Скорость ветра",
            wind_direction_avg_auto: "Направление ветра",
            likelihood: "Вероятность",
            q_kg_hr: "Эмиссия",
            q_low_kg_hr: "Нижняя оценка",
            q_high_kg_hr: "Верхняя оценка",
            plume_length_m: "Длина шлейфа",
            wind_speed_m_s: "Скорость ветра",
            plume_index: "Индекс шлейфа",
        },

        units: {
            kgPerHour: "кг/ч",
            meters: "м",
            metersPerSecond: "м/с",
        },

        chart: {
            title: "Динамика выбросов",
            subtitle: "Средние выбросы в группировке",
            monthly: "По месяцам",
            observations: "Наблюдения",
            averageEmission: "Средний расход",
            quantifiedPlumes: "Шлейфов с оценкой",
            observedDays: "Дней наблюдения",
            empty: "Нет наблюдений с рассчитанным выбросом.",
            hint: "Нажмите на точку, чтобы открыть хронологию.",
            monthAverageCount: "Среднее по {{count}} наблюдениям",
            singleObservation: "Отдельное наблюдение",
            collapse: "Свернуть график",
            expand: "Показать график",
            periodMode: "Динамика",
            daysMode: "По дням",
            periodMonth: "По месяцам",
            periodQuarter: "По кварталам",
            scaleLinear: "Лин.",
            scaleLog: "Лог.",
            earlier: "Раньше",
            later: "Позже",
            discreteAxisHint:
                "Дни расположены по порядку; расстояние между точками не соответствует длительности перерывов.",

            help: {
                button: "Как читать график",
                title: "Как читать график выбросов",

                averageTitle: "Средний расход",
                averageText:
                    "Арифметическое среднее значений расхода метана для наблюдений с количественной оценкой. Это не средний непрерывный выброс за весь период.",

                countTitle: "Шлейфов с оценкой",
                countText:
                    "Количество наблюдений, для которых доступно численное значение расхода метана. Наблюдения без оценки не включаются.",

                daysTitle: "Дней наблюдения",
                daysText:
                    "Количество уникальных дат, когда обнаружены шлейфы. Несколько шлейфов за одну дату считаются одним днём.",

                dynamicsTitle: "Динамика",
                dynamicsText:
                    "Каждая точка показывает средний расход за месяц или квартал. Период агрегации выбирается автоматически по продолжительности ряда.",

                dailyTitle: "По дням",
                dailyText:
                    "Одна точка соответствует одной дате наблюдения. Точки располагаются равномерно для удобства просмотра, поэтому расстояние между ними не означает количество прошедших дней.",

                gapTitle: "Пунктирная линия",
                gapText:
                    "Показывает большой временной промежуток без измерений. Соединение точек не означает, что выбросы непрерывно измерялись между датами.",

                scaleTitle: "Масштаб",
                scaleText:
                    "Линейная шкала показывает пропорциональные расстояния между значениями. Логарифмическая помогает рассмотреть небольшие выбросы рядом с крупными; нулевые значения обрабатываются отдельно через log(1 + x).",

                clickTitle: "Нажатие на точку",
                clickText:
                    "Если в периоде только один шлейф с рассчитанным расходом, он выбирается на карте. Если несколько — хронология фильтруется по выбранному периоду.",
            },
            scaleLinearHint: "Линейная шкала: расстояние пропорционально расходу метана.",
            scaleLogHint:
                "Логарифмическая шкала log(1 + x): позволяет различать небольшие значения рядом с большими.",
        },
    },
} as const;

type WidenStrings<T> = {
    [K in keyof T]: T[K] extends string ? string : WidenStrings<T[K]>;
};

export type Translation = WidenStrings<typeof ru>;

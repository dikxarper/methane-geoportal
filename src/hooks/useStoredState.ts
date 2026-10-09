import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

/**
 * Сохраняет только настройки интерфейса.
 * Не использовать для токенов авторизации, паролей и ответов API.
 */
export function useStoredState<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState<T>(() => {
        try {
            const saved = window.localStorage.getItem(`geoportal:v1:${key}`);

            return saved === null ? initial : (JSON.parse(saved) as T);
        } catch {
            return initial;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(`geoportal:v1:${key}`, JSON.stringify(value));
        } catch {
            // Приложение продолжает работать, даже если storage недоступен.
        }
    }, [key, value]);

    return [value, setValue];
}

// src/utils/formatters.ts

/**
 * Formats a date string (ISO) into a localized date
 */
export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
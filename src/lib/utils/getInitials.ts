// src/lib/utils/getInitials.ts
export function getInitials(firstName: string = "", lastName: string = ""): string {
    const f = firstName.trim().charAt(0).toUpperCase();
    const l = lastName.trim().charAt(0).toUpperCase();

    if (/[A-Z]/.test(f) && /[A-Z]/.test(l)) return `${f}${l}`;
    if (/[A-Z]/.test(f)) return f;
    return "U";
}
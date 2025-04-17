export const sortBy = <T, K extends keyof T>(data: T[], key: K, asc: boolean) => {
    return [...data].sort((a, b) => {
        if (typeof a[key] === "number") {
            return asc ? (a[key] as number) - (b[key] as number) : (b[key] as number) - (a[key] as number);
        }
        return asc
            ? String(a[key]).localeCompare(String(b[key]))
            : String(b[key]).localeCompare(String(a[key]));
    });
};

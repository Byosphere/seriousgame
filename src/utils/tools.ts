export function getNavigatorLanguage(raw?: string) {
    let language = (navigator.languages && navigator.languages[0]) || navigator.language;
    if (language.length > 2 && !raw) {
        language = language.split("-")[0];
        language = language.split("_")[0];
    }

    return language;
}

export function convertToCss(n: number) {
    let str = "";
    for (let index = 0; index < n; index++) {
        str+= " 1fr";
    }
    return str;
}
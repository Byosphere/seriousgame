export function getNavigatorLanguage(raw?: string) {
    let language = (navigator.languages && navigator.languages[0]) || navigator.language;
    if (language.length > 2 && !raw) {
        language = language.split("-")[0];
        language = language.split("_")[0];
    }

    return language;
}

export function gridConvertToCss(n: number) {
    let str = "";
    for (let index = 0; index < n; index++) {
        str += " 1fr";
    }
    return str;
}

export function positionConvertToCss(cols: string, rows: string) {
    return {
        gridColumn: cols,
        gridRow: rows
    }
}

export function getObject(arr: Array<any>, objectId: number) {
    return arr.find(el => { return el.id === objectId });
}

export function syntaxHighlight(json: string) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

let interval: any = null;

export function imageExists(src: string, callback: Function) {

    if (!interval) {
        interval = setInterval(() => {
            var img = new Image();

            img.onload = function () {
                callback(true);
            };

            img.onerror = function () {
                callback(false);
            };

            img.src = src;
            clearInterval(interval);
            interval = null;
        }, 1000);
    } else {
        clearInterval(interval);
        interval = null;
        imageExists(src, callback);
    }
}
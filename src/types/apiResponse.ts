//   import { Convert, Welcome } from "./file";
//
//   const welcome = Convert.toWelcome(json);

export interface Welcome {
    success: number;
    results: Result[];
}

export interface Result {
    FI:          string;
    event_id:    string;
    asian_lines: AsianLines;
    goals:       Goals;
    half:        Goals;
    main:        Goals;
    minutes:     Minutes;
    others:      Other[];
    schedule:    Schedule;
    specials:    Specials;
}

export interface AsianLines {
    updated_at: string;
    key:        string;
    sp:         AsianLinesSP;
}

export interface AsianLinesSP {
    asian_handicap:                      The1_StHalfAsianHandicap;
    goal_line:                           The1_StHalfAsianHandicap;
    alternative_asian_handicap:          The1_StHalfAsianHandicap;
    alternative_goal_line:               The1_StHalfAsianHandicap;
    "1st_half_asian_handicap":           The1_StHalfAsianHandicap;
    "1st_half_goal_line":                The1_StHalfAsianHandicap;
    alternative_1st_half_asian_handicap: The1_StHalfAsianHandicap;
    alternative_1st_half_goal_line:      The1_StHalfAsianHandicap;
}

export interface The1_StHalfAsianHandicap {
    id:   string;
    name: string;
    odds: Main[];
}

export interface Main {
    id:        string;
    odds:      string;
    header?:   string;
    handicap?: string;
    name?:     string;
    team?:     string;
}

export interface Goals {
    updated_at: string;
    key:        string;
    sp:         { [key: string]: The1_StHalfAsianHandicap };
}

export interface Minutes {
    updated_at: string;
    key:        string;
    sp:         MinutesSP;
}

export interface MinutesSP {
    "10_minute_result":               The1_StHalfAsianHandicap;
    "first_10_minutes_(00:00_09:59)": The1_StHalfAsianHandicap;
}

export interface Other {
    updated_at: string;
    sp:         { [key: string]: The1_StHalfAsianHandicap };
}

export interface Schedule {
    updated_at: string;
    key:        string;
    sp:         ScheduleSP;
}

export interface ScheduleSP {
    main: Main[];
}

export interface Specials {
    updated_at: string;
    key:        string;
    sp:         SpecialsSP;
}

export interface SpecialsSP {
    specials:           The1_StHalfAsianHandicap;
    to_score_in_half:   The1_StHalfAsianHandicap;
    to_score_a_penalty: The1_StHalfAsianHandicap;
    to_miss_a_penalty:  The1_StHalfAsianHandicap;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toWelcome(json: string): Welcome {
        return cast(JSON.parse(json), r("Welcome"));
    }

    public static welcomeToJson(value: Welcome): string {
        return JSON.stringify(uncast(value, r("Welcome")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Welcome": o([
        { json: "success", js: "success", typ: 0 },
        { json: "results", js: "results", typ: a(r("Result")) },
    ], false),
    "Result": o([
        { json: "FI", js: "FI", typ: "" },
        { json: "event_id", js: "event_id", typ: "" },
        { json: "asian_lines", js: "asian_lines", typ: r("AsianLines") },
        { json: "goals", js: "goals", typ: r("Goals") },
        { json: "half", js: "half", typ: r("Goals") },
        { json: "main", js: "main", typ: r("Goals") },
        { json: "minutes", js: "minutes", typ: r("Minutes") },
        { json: "others", js: "others", typ: a(r("Other")) },
        { json: "schedule", js: "schedule", typ: r("Schedule") },
        { json: "specials", js: "specials", typ: r("Specials") },
    ], false),
    "AsianLines": o([
        { json: "updated_at", js: "updated_at", typ: "" },
        { json: "key", js: "key", typ: "" },
        { json: "sp", js: "sp", typ: r("AsianLinesSP") },
    ], false),
    "AsianLinesSP": o([
        { json: "asian_handicap", js: "asian_handicap", typ: r("The1_StHalfAsianHandicap") },
        { json: "goal_line", js: "goal_line", typ: r("The1_StHalfAsianHandicap") },
        { json: "alternative_asian_handicap", js: "alternative_asian_handicap", typ: r("The1_StHalfAsianHandicap") },
        { json: "alternative_goal_line", js: "alternative_goal_line", typ: r("The1_StHalfAsianHandicap") },
        { json: "1st_half_asian_handicap", js: "1st_half_asian_handicap", typ: r("The1_StHalfAsianHandicap") },
        { json: "1st_half_goal_line", js: "1st_half_goal_line", typ: r("The1_StHalfAsianHandicap") },
        { json: "alternative_1st_half_asian_handicap", js: "alternative_1st_half_asian_handicap", typ: r("The1_StHalfAsianHandicap") },
        { json: "alternative_1st_half_goal_line", js: "alternative_1st_half_goal_line", typ: r("The1_StHalfAsianHandicap") },
    ], false),
    "The1_StHalfAsianHandicap": o([
        { json: "id", js: "id", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "odds", js: "odds", typ: a(r("Main")) },
    ], false),
    "Main": o([
        { json: "id", js: "id", typ: "" },
        { json: "odds", js: "odds", typ: "" },
        { json: "header", js: "header", typ: u(undefined, "") },
        { json: "handicap", js: "handicap", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "team", js: "team", typ: u(undefined, "") },
    ], false),
    "Goals": o([
        { json: "updated_at", js: "updated_at", typ: "" },
        { json: "key", js: "key", typ: "" },
        { json: "sp", js: "sp", typ: m(r("The1_StHalfAsianHandicap")) },
    ], false),
    "Minutes": o([
        { json: "updated_at", js: "updated_at", typ: "" },
        { json: "key", js: "key", typ: "" },
        { json: "sp", js: "sp", typ: r("MinutesSP") },
    ], false),
    "MinutesSP": o([
        { json: "10_minute_result", js: "10_minute_result", typ: r("The1_StHalfAsianHandicap") },
        { json: "first_10_minutes_(00:00_09:59)", js: "first_10_minutes_(00:00_09:59)", typ: r("The1_StHalfAsianHandicap") },
    ], false),
    "Other": o([
        { json: "updated_at", js: "updated_at", typ: "" },
        { json: "sp", js: "sp", typ: m(r("The1_StHalfAsianHandicap")) },
    ], false),
    "Schedule": o([
        { json: "updated_at", js: "updated_at", typ: "" },
        { json: "key", js: "key", typ: "" },
        { json: "sp", js: "sp", typ: r("ScheduleSP") },
    ], false),
    "ScheduleSP": o([
        { json: "main", js: "main", typ: a(r("Main")) },
    ], false),
    "Specials": o([
        { json: "updated_at", js: "updated_at", typ: "" },
        { json: "key", js: "key", typ: "" },
        { json: "sp", js: "sp", typ: r("SpecialsSP") },
    ], false),
    "SpecialsSP": o([
        { json: "specials", js: "specials", typ: r("The1_StHalfAsianHandicap") },
        { json: "to_score_in_half", js: "to_score_in_half", typ: r("The1_StHalfAsianHandicap") },
        { json: "to_score_a_penalty", js: "to_score_a_penalty", typ: r("The1_StHalfAsianHandicap") },
        { json: "to_miss_a_penalty", js: "to_miss_a_penalty", typ: r("The1_StHalfAsianHandicap") },
    ], false),
};

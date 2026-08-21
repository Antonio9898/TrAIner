globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { p as pipelineSymbol, s as shouldAppendForwardSlash, r as removeTrailingForwardSlash, A as ActionNotFoundError, R as REDIRECT_STATUS_CODES, a as AstroError, b as ActionsReturnedInvalidDataError, d as distExports, c as ResponseSentError, e as defineMiddleware, N as NOOP_MIDDLEWARE_HEADER, f as s, E as EndpointDidNotReturnAResponse, g as REROUTABLE_STATUS_CODES, h as REROUTE_DIRECTIVE_HEADER, i as isPropagatingHint, j as getPropagationHint$1, M as MissingMediaQueryDirective, k as NoMatchingImport, l as escapeHTML, m as bufferPropagatedHead, n as isHeadAndContent, o as isRenderTemplateResult, O as OnlyResponseCanBeReturned, q as isPromise, t as promiseWithResolvers, u as encoder, v as chunkToByteArray, w as chunkToString, x as chunkToByteArrayOrString, y as toAttributeString, z as markHTMLString, B as renderSlotToString, C as maybeRenderHead, D as containsServerDirective, F as Fragment, G as renderSlot, H as clsx, I as renderSlots, S as ServerIslandComponent, J as createAstroComponentInstance, K as Renderer, L as NoMatchingRenderer, P as formatList, Q as NoClientOnlyHint, T as internalSpreadAttributes, U as voidElementNames, V as renderTemplate, W as createRenderInstruction, X as renderElement$1, Y as SlotString, Z as mergeSlotInstructions, _ as HTMLString, $ as isHTMLString, a0 as isRenderInstruction, a1 as isAstroComponentInstance, a2 as isRenderInstance, a3 as renderCspContent, a4 as isNode, a5 as isDeno, a6 as addAttribute, a7 as decryptString, a8 as createSlotValueFromString, a9 as DEFAULT_404_COMPONENT, aa as DEFAULT_404_ROUTE, ab as default404Instance, ac as getParams, ad as prependForwardSlash, ae as decodeKey, af as UnableToLoadLogger, ag as RouteCache, ah as sequence, ai as ReservedSlotName, aj as ROUTE_TYPE_HEADER, ak as appendForwardSlash, al as i18nNoLocaleFoundInPath, am as MiddlewareNoDataOrNextCalled, an as MiddlewareNotAResponse, ao as CacheNotEnabled, ap as ASTRO_ERROR_HEADER, aq as REWRITE_DIRECTIVE_HEADER_KEY, ar as REWRITE_DIRECTIVE_HEADER_VALUE, as as collapseDuplicateSlashes, at as ForbiddenRewrite, au as copyRequest, av as setOriginPathname, aw as isRoute404, ax as isRoute500, ay as originPathnameSymbol, az as generateCspDigest, aA as ASTRO_GENERATOR, aB as PrerenderClientAddressNotAvailable, aC as ClientAddressNotAvailable, aD as StaticClientAddressNotAvailable, aE as routeHasHtmlExtension, aF as collapseDuplicateLeadingSlashes, aG as getProps, aH as fetchStateSymbol, aI as AstroResponseHeadersReassigned, aJ as responseSentSymbol$1, aK as getOriginPathname, aL as LocalsReassigned, aM as INTERNAL_RESPONSE_HEADERS, aN as escape, aO as isInternalPath, aP as collapseDuplicateTrailingSlashes, aQ as hasFileExtension, aR as removeLeadingForwardSlash, aS as getRouteGenerator, aT as SessionStorageInitError, aU as SessionStorageSaveError, aV as appSymbol, aW as joinPaths, aX as LocalsNotAnObject, aY as clientAddressSymbol, aZ as fileExtension, a_ as slash, a$ as routeIsRedirect, b0 as routeIsFallback, b1 as getFallbackRoute, b2 as findRouteToRewrite, b3 as setGetEnv } from "./runtime_GlVtDbC7.mjs";
function _mergeNamespaces(n, m) {
  for (var i = 0; i < m.length; i++) {
    const e = m[i];
    if (typeof e !== "string" && !Array.isArray(e)) {
      for (const k in e) {
        if (k !== "default" && !(k in n)) {
          const d = Object.getOwnPropertyDescriptor(e, k);
          if (d) {
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: () => e[k]
            });
          }
        }
      }
    }
  }
  return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }));
}
const sessionKVBindingName = "SESSION";
const UNDEFINED = -1;
const HOLE = -2;
const NAN = -3;
const POSITIVE_INFINITY = -4;
const NEGATIVE_INFINITY = -5;
const NEGATIVE_ZERO = -6;
const SPARSE = -7;
const MAX_ARRAY_LEN = 2 ** 32 - 1;
const MAX_ARRAY_INDEX = MAX_ARRAY_LEN - 1;
class DevalueError extends Error {
  /**
   * @param {string} message
   * @param {string[]} keys
   * @param {any} [value] - The value that failed to be serialized
   * @param {any} [root] - The root value being serialized
   */
  constructor(message, keys, value, root) {
    super(message);
    this.name = "DevalueError";
    this.path = keys.join("");
    this.value = value;
    this.root = root;
  }
}
function is_primitive(thing) {
  return thing === null || typeof thing !== "object" && typeof thing !== "function";
}
const object_proto_names = /* @__PURE__ */ Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function is_plain_object(thing) {
  const proto = Object.getPrototypeOf(thing);
  return proto === Object.prototype || proto === null || Object.getPrototypeOf(proto) === null || Object.getOwnPropertyNames(proto).sort().join("\0") === object_proto_names;
}
function get_type(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function get_escaped_char(char) {
  switch (char) {
    case '"':
      return '\\"';
    case "<":
      return "\\u003C";
    case "\\":
      return "\\\\";
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "	":
      return "\\t";
    case "\b":
      return "\\b";
    case "\f":
      return "\\f";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return char < " " ? `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}` : "";
  }
}
function stringify_string(str) {
  let result = "";
  let last_pos = 0;
  const len = str.length;
  for (let i = 0; i < len; i += 1) {
    const char = str[i];
    const replacement = get_escaped_char(char);
    if (replacement) {
      result += str.slice(last_pos, i) + replacement;
      last_pos = i + 1;
    }
  }
  return `"${last_pos === 0 ? str : result + str.slice(last_pos)}"`;
}
function enumerable_symbols(object) {
  return Object.getOwnPropertySymbols(object).filter(
    (symbol) => Object.getOwnPropertyDescriptor(object, symbol).enumerable
  );
}
const is_identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
function stringify_key(key) {
  return is_identifier.test(key) ? "." + key : "[" + JSON.stringify(key) + "]";
}
function is_valid_array_index(n) {
  if (!Number.isInteger(n)) return false;
  if (n < 0) return false;
  if (n > MAX_ARRAY_INDEX) return false;
  return true;
}
function is_valid_array_len(n) {
  if (!Number.isInteger(n)) return false;
  if (n < 0) return false;
  if (n > MAX_ARRAY_LEN) return false;
  return true;
}
function is_valid_array_index_string(s2) {
  if (s2.length === 0) return false;
  if (s2.length > 1 && s2.charCodeAt(0) === 48) return false;
  for (let i = 0; i < s2.length; i++) {
    const c = s2.charCodeAt(i);
    if (c < 48 || c > 57) return false;
  }
  return is_valid_array_index(+s2);
}
function valid_array_indices(array) {
  const keys = Object.keys(array);
  for (var i = keys.length - 1; i >= 0; i--) {
    if (is_valid_array_index_string(keys[i])) {
      break;
    }
  }
  keys.length = i + 1;
  return keys;
}
function encode_native(array_buffer) {
  return new Uint8Array(array_buffer).toBase64();
}
function decode_native(base64) {
  return Uint8Array.fromBase64(base64).buffer;
}
function encode_buffer(array_buffer) {
  return Buffer.from(array_buffer).toString("base64");
}
function decode_buffer(base64) {
  return Uint8Array.from(Buffer.from(base64, "base64")).buffer;
}
function encode_legacy(array_buffer) {
  const array = new Uint8Array(array_buffer);
  let binary2 = "";
  const chunk_size = 32768;
  for (let i = 0; i < array.length; i += chunk_size) {
    const chunk = array.subarray(i, i + chunk_size);
    binary2 += String.fromCharCode.apply(null, chunk);
  }
  return btoa(binary2);
}
function decode_legacy(base64) {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const array = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    array[i] = binary_string.charCodeAt(i);
  }
  return array.buffer;
}
const native = typeof Uint8Array.fromBase64 === "function";
const buffer = typeof process === "object" && process.versions?.node !== void 0;
const encode64 = native ? encode_native : buffer ? encode_buffer : encode_legacy;
const decode64 = native ? decode_native : buffer ? decode_buffer : decode_legacy;
function parse(serialized, revivers) {
  return unflatten$1(JSON.parse(serialized), revivers);
}
function unflatten$1(parsed, revivers) {
  if (typeof parsed === "number") return hydrate(parsed, true);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Invalid input");
  }
  const values = (
    /** @type {any[]} */
    parsed
  );
  const hydrated = Array(values.length);
  let hydrating = null;
  function hydrate(index, standalone = false) {
    if (index === UNDEFINED) return void 0;
    if (index === NAN) return NaN;
    if (index === POSITIVE_INFINITY) return Infinity;
    if (index === NEGATIVE_INFINITY) return -Infinity;
    if (index === NEGATIVE_ZERO) return -0;
    if (standalone || typeof index !== "number") {
      throw new Error(`Invalid input`);
    }
    if (index in hydrated) return hydrated[index];
    const value = values[index];
    if (!value || typeof value !== "object") {
      hydrated[index] = value;
    } else if (Array.isArray(value)) {
      if (typeof value[0] === "string") {
        const type = value[0];
        const reviver = revivers && Object.hasOwn(revivers, type) ? revivers[type] : void 0;
        if (reviver) {
          let i = value[1];
          if (typeof i !== "number") {
            i = values.push(value[1]) - 1;
          }
          hydrating ??= /* @__PURE__ */ new Set();
          if (hydrating.has(i)) {
            throw new Error("Invalid circular reference");
          }
          hydrating.add(i);
          hydrated[index] = reviver(hydrate(i));
          hydrating.delete(i);
          return hydrated[index];
        }
        switch (type) {
          case "Date":
            hydrated[index] = new Date(value[1]);
            break;
          case "Set":
            const set = /* @__PURE__ */ new Set();
            hydrated[index] = set;
            for (let i = 1; i < value.length; i += 1) {
              set.add(hydrate(value[i]));
            }
            break;
          case "Map":
            const map = /* @__PURE__ */ new Map();
            hydrated[index] = map;
            for (let i = 1; i < value.length; i += 2) {
              map.set(hydrate(value[i]), hydrate(value[i + 1]));
            }
            break;
          case "RegExp":
            hydrated[index] = new RegExp(value[1], value[2]);
            break;
          case "Object": {
            const wrapped_index = value[1];
            if (typeof values[wrapped_index] === "object" && values[wrapped_index][0] !== "BigInt") {
              throw new Error("Invalid input");
            }
            hydrated[index] = Object(hydrate(wrapped_index));
            break;
          }
          case "BigInt":
            hydrated[index] = BigInt(value[1]);
            break;
          case "null":
            const obj = /* @__PURE__ */ Object.create(null);
            hydrated[index] = obj;
            for (let i = 1; i < value.length; i += 2) {
              if (value[i] === "__proto__") {
                throw new Error("Cannot parse an object with a `__proto__` property");
              }
              obj[value[i]] = hydrate(value[i + 1]);
            }
            break;
          case "Int8Array":
          case "Uint8Array":
          case "Uint8ClampedArray":
          case "Int16Array":
          case "Uint16Array":
          case "Float16Array":
          case "Int32Array":
          case "Uint32Array":
          case "Float32Array":
          case "Float64Array":
          case "BigInt64Array":
          case "BigUint64Array":
          case "DataView": {
            if (values[value[1]][0] !== "ArrayBuffer") {
              throw new Error("Invalid data");
            }
            const TypedArrayConstructor = globalThis[type];
            const buffer2 = hydrate(value[1]);
            hydrated[index] = value[2] !== void 0 ? new TypedArrayConstructor(buffer2, value[2], value[3]) : new TypedArrayConstructor(buffer2);
            break;
          }
          case "ArrayBuffer": {
            const base64 = value[1];
            if (typeof base64 !== "string") {
              throw new Error("Invalid ArrayBuffer encoding");
            }
            const arraybuffer = decode64(base64);
            hydrated[index] = arraybuffer;
            break;
          }
          case "Temporal.Duration":
          case "Temporal.Instant":
          case "Temporal.PlainDate":
          case "Temporal.PlainTime":
          case "Temporal.PlainDateTime":
          case "Temporal.PlainMonthDay":
          case "Temporal.PlainYearMonth":
          case "Temporal.ZonedDateTime": {
            const temporalName = type.slice(9);
            hydrated[index] = Temporal[temporalName].from(value[1]);
            break;
          }
          case "URL": {
            const url = new URL(value[1]);
            hydrated[index] = url;
            break;
          }
          case "URLSearchParams": {
            const url = new URLSearchParams(value[1]);
            hydrated[index] = url;
            break;
          }
          default:
            throw new Error(`Unknown type ${type}`);
        }
      } else if (value[0] === SPARSE) {
        const len = value[1];
        if (!is_valid_array_len(len)) {
          throw new Error("Invalid input");
        }
        const array = [];
        hydrated[index] = array;
        array[MAX_ARRAY_INDEX] = void 0;
        delete array[MAX_ARRAY_INDEX];
        for (let i = 2; i < value.length; i += 2) {
          const idx = value[i];
          if (!is_valid_array_index(idx) || idx >= len) {
            throw new Error("Invalid input");
          }
          array[idx] = hydrate(value[i + 1]);
        }
        array.length = len;
      } else {
        const array = new Array(value.length);
        hydrated[index] = array;
        for (let i = 0; i < value.length; i += 1) {
          const n = value[i];
          if (n === HOLE) continue;
          array[i] = hydrate(n);
        }
      }
    } else {
      const object = {};
      hydrated[index] = object;
      for (const key of Object.keys(value)) {
        if (key === "__proto__") {
          throw new Error("Cannot parse an object with a `__proto__` property");
        }
        const n = value[key];
        object[key] = hydrate(n);
      }
    }
    return hydrated[index];
  }
  return hydrate(0);
}
function stringify$2(value, reducers) {
  const stringified = run(false, value, reducers);
  return typeof stringified === "string" ? stringified : `[${stringified.join(",")}]`;
}
function run(async, value, reducers) {
  const stringified = [];
  const indexes = /* @__PURE__ */ new Map();
  const custom = [];
  if (reducers) {
    for (const key of Object.getOwnPropertyNames(reducers)) {
      custom.push({ key, fn: reducers[key] });
    }
  }
  const keys = [];
  let p = 0;
  function flatten(thing, index2) {
    if (thing === void 0) return UNDEFINED;
    if (Number.isNaN(thing)) return NAN;
    if (thing === Infinity) return POSITIVE_INFINITY;
    if (thing === -Infinity) return NEGATIVE_INFINITY;
    if (thing === 0 && 1 / thing < 0) return NEGATIVE_ZERO;
    if (indexes.has(thing)) return (
      /** @type {number} */
      indexes.get(thing)
    );
    index2 ??= p++;
    indexes.set(thing, index2);
    for (const { key, fn } of custom) {
      const value2 = fn(thing);
      if (value2) {
        stringified[index2] = `["${key}",${flatten(value2)}]`;
        return index2;
      }
    }
    if (typeof thing === "function") {
      throw new DevalueError(`Cannot stringify a function`, keys, thing, value);
    } else if (typeof thing === "symbol") {
      throw new DevalueError(`Cannot stringify a Symbol primitive`, keys, thing, value);
    }
    let str = "";
    if (is_primitive(thing)) {
      str = stringify_primitive(thing);
    } else if (typeof thing.then === "function") {
      {
        throw new DevalueError(
          `Cannot stringify a Promise or thenable — use stringifyAsync instead`,
          keys,
          thing,
          value
        );
      }
    } else {
      const type = get_type(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "BigInt":
          str = `["Object",${flatten(thing.valueOf())}]`;
          break;
        case "Date":
          const valid = !isNaN(thing.getDate());
          str = `["Date","${valid ? thing.toISOString() : ""}"]`;
          break;
        case "URL":
          str = `["URL",${stringify_string(thing.toString())}]`;
          break;
        case "URLSearchParams":
          str = `["URLSearchParams",${stringify_string(thing.toString())}]`;
          break;
        case "RegExp":
          const { source, flags } = thing;
          str = flags ? `["RegExp",${stringify_string(source)},"${flags}"]` : `["RegExp",${stringify_string(source)}]`;
          break;
        case "Array": {
          let mostly_dense = false;
          str = "[";
          for (let i = 0; i < thing.length; i += 1) {
            if (i > 0) str += ",";
            if (Object.hasOwn(thing, i)) {
              keys.push(`[${i}]`);
              str += flatten(thing[i]);
              keys.pop();
            } else if (mostly_dense) {
              str += HOLE;
            } else {
              const populated_keys = valid_array_indices(
                /** @type {any[]} */
                thing
              );
              const population = populated_keys.length;
              const d = String(thing.length).length;
              const hole_cost = (thing.length - population) * 3;
              const sparse_cost = 4 + d + population * (d + 1);
              if (hole_cost > sparse_cost) {
                str = "[" + SPARSE + "," + thing.length;
                for (let j = 0; j < populated_keys.length; j++) {
                  const key = populated_keys[j];
                  keys.push(`[${key}]`);
                  str += "," + key + "," + flatten(thing[key]);
                  keys.pop();
                }
                break;
              } else {
                mostly_dense = true;
                str += HOLE;
              }
            }
          }
          str += "]";
          break;
        }
        case "Set":
          str = '["Set"';
          for (const value2 of thing) {
            str += `,${flatten(value2)}`;
          }
          str += "]";
          break;
        case "Map":
          str = '["Map"';
          for (const [key, value2] of thing) {
            keys.push(`.get(${is_primitive(key) ? stringify_primitive(key) : "..."})`);
            str += `,${flatten(key)},${flatten(value2)}`;
            keys.pop();
          }
          str += "]";
          break;
        case "Int8Array":
        case "Uint8Array":
        case "Uint8ClampedArray":
        case "Int16Array":
        case "Uint16Array":
        case "Float16Array":
        case "Int32Array":
        case "Uint32Array":
        case "Float32Array":
        case "Float64Array":
        case "BigInt64Array":
        case "BigUint64Array":
        case "DataView": {
          const typedArray = thing;
          str = '["' + type + '",' + flatten(typedArray.buffer);
          if (typedArray.byteLength !== typedArray.buffer.byteLength) {
            str += `,${typedArray.byteOffset},${typedArray.length}`;
          }
          str += "]";
          break;
        }
        case "ArrayBuffer": {
          const arraybuffer = thing;
          const base64 = encode64(arraybuffer);
          str = `["ArrayBuffer","${base64}"]`;
          break;
        }
        case "Temporal.Duration":
        case "Temporal.Instant":
        case "Temporal.PlainDate":
        case "Temporal.PlainTime":
        case "Temporal.PlainDateTime":
        case "Temporal.PlainMonthDay":
        case "Temporal.PlainYearMonth":
        case "Temporal.ZonedDateTime":
          str = `["${type}",${stringify_string(thing.toString())}]`;
          break;
        default:
          if (!is_plain_object(thing)) {
            throw new DevalueError(`Cannot stringify arbitrary non-POJOs`, keys, thing, value);
          }
          if (enumerable_symbols(thing).length > 0) {
            throw new DevalueError(`Cannot stringify POJOs with symbolic keys`, keys, thing, value);
          }
          if (Object.getPrototypeOf(thing) === null) {
            str = '["null"';
            for (const key of Object.keys(thing)) {
              if (key === "__proto__") {
                throw new DevalueError(
                  `Cannot stringify objects with __proto__ keys`,
                  keys,
                  thing,
                  value
                );
              }
              keys.push(stringify_key(key));
              str += `,${stringify_string(key)},${flatten(thing[key])}`;
              keys.pop();
            }
            str += "]";
          } else {
            str = "{";
            let started = false;
            for (const key of Object.keys(thing)) {
              if (key === "__proto__") {
                throw new DevalueError(
                  `Cannot stringify objects with __proto__ keys`,
                  keys,
                  thing,
                  value
                );
              }
              if (started) str += ",";
              started = true;
              keys.push(stringify_key(key));
              str += `${stringify_string(key)}:${flatten(thing[key])}`;
              keys.pop();
            }
            str += "}";
          }
      }
    }
    stringified[index2] = str;
    return index2;
  }
  const index = flatten(value);
  if (index < 0) return `${index}`;
  return stringified;
}
function stringify_primitive(thing) {
  const type = typeof thing;
  if (type === "string") return stringify_string(thing);
  if (thing === void 0) return UNDEFINED.toString();
  if (thing === 0 && 1 / thing < 0) return NEGATIVE_ZERO.toString();
  if (type === "bigint") return `["BigInt","${thing}"]`;
  return String(thing);
}
const ACTION_QUERY_PARAMS = {
  actionName: "_action"
};
const ACTION_RPC_ROUTE_PATTERN = "/_actions/[...path]";
const __vite_import_meta_env__$1 = { "ASSETS_PREFIX": void 0, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": void 0, "SSR": true };
const codeToStatusMap = {
  // Implemented from IANA HTTP Status Code Registry
  // https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  CONTENT_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_CONTENT: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NETWORK_AUTHENTICATION_REQUIRED: 511
};
const statusToCodeMap = Object.fromEntries(
  Object.entries(codeToStatusMap).map(([key, value]) => [value, key])
);
class ActionError extends Error {
  type = "AstroActionError";
  code = "INTERNAL_SERVER_ERROR";
  status = 500;
  constructor(params) {
    super(params.message);
    this.code = params.code;
    this.status = ActionError.codeToStatus(params.code);
    if (params.stack) {
      this.stack = params.stack;
    }
  }
  static codeToStatus(code) {
    return codeToStatusMap[code];
  }
  static statusToCode(status) {
    return statusToCodeMap[status] ?? "INTERNAL_SERVER_ERROR";
  }
  static fromJson(body) {
    if (isInputError(body)) {
      return new ActionInputError(body.issues);
    }
    if (isActionError(body)) {
      return new ActionError(body);
    }
    return new ActionError({
      code: "INTERNAL_SERVER_ERROR"
    });
  }
}
function isActionError(error2) {
  return typeof error2 === "object" && error2 != null && "type" in error2 && error2.type === "AstroActionError";
}
function isInputError(error2) {
  return typeof error2 === "object" && error2 != null && "type" in error2 && error2.type === "AstroActionInputError" && "issues" in error2 && Array.isArray(error2.issues);
}
class ActionInputError extends ActionError {
  type = "AstroActionInputError";
  // We don't expose all ZodError properties.
  // Not all properties will serialize from server to client,
  // and we don't want to import the full ZodError object into the client.
  issues;
  fields;
  constructor(issues) {
    super({
      message: `Failed to validate: ${JSON.stringify(issues, null, 2)}`,
      code: "BAD_REQUEST"
    });
    this.issues = issues;
    this.fields = {};
    for (const issue of issues) {
      if (issue.path.length > 0) {
        const key = issue.path[0].toString();
        this.fields[key] ??= [];
        this.fields[key]?.push(issue.message);
      }
    }
  }
}
function deserializeActionResult(res) {
  if (res.type === "error") {
    let json;
    try {
      json = JSON.parse(res.body);
    } catch {
      return {
        data: void 0,
        error: new ActionError({
          message: res.body,
          code: "INTERNAL_SERVER_ERROR"
        })
      };
    }
    if (Object.assign(__vite_import_meta_env__$1, { _: "/Users/antek/projekty/TrAIner/node_modules/.bin/astro" })?.PROD) {
      return { error: ActionError.fromJson(json), data: void 0 };
    } else {
      const error2 = ActionError.fromJson(json);
      error2.stack = actionResultErrorStack.get();
      return {
        error: error2,
        data: void 0
      };
    }
  }
  if (res.type === "empty") {
    return { data: void 0, error: void 0 };
  }
  return {
    data: parse(res.body, {
      URL: (href) => new URL(href)
    }),
    error: void 0
  };
}
const actionResultErrorStack = /* @__PURE__ */ (function actionResultErrorStackFn() {
  let errorStack;
  return {
    set(stack) {
      errorStack = stack;
    },
    get() {
      return errorStack;
    }
  };
})();
function getActionQueryString(name) {
  const searchParams = new URLSearchParams({ [ACTION_QUERY_PARAMS.actionName]: name });
  return `?${searchParams.toString()}`;
}
var ImportType;
!(function(A) {
  A[A.Static = 1] = "Static", A[A.Dynamic = 2] = "Dynamic", A[A.ImportMeta = 3] = "ImportMeta", A[A.StaticSourcePhase = 4] = "StaticSourcePhase", A[A.DynamicSourcePhase = 5] = "DynamicSourcePhase", A[A.StaticDeferPhase = 6] = "StaticDeferPhase", A[A.DynamicDeferPhase = 7] = "DynamicDeferPhase";
})(ImportType || (ImportType = {}));
1 === new Uint8Array(new Uint16Array([1]).buffer)[0];
const E = () => {
  return A = "AGFzbQEAAAABKwhgAX8Bf2AEf39/fwBgAAF/YAAAYAF/AGADf39/AX9gAn9/AX9gA39/fwADODcAAQECAgICAgICAgICAgICAgICAgICAgICAwIAAwMDBAAEAAAABQAAAAAAAwMDAAAGAAcABgIFBAUBcAEBAQUDAQABBg8CfwFBsPIAC38AQbDyAAsHnQEbBm1lbW9yeQIAAnNhAAABZQADAmlzAAQCaWUABQJzcwAGAnNlAAcCaXQACAJhaQAJAmlkAAoCaXAACwJlcwAMAmVlAA0DZWxzAA4DZWxlAA8CcmkAEAJyZQARAWYAEgJtcwATAnJhABQDYWtzABUDYWtlABYDYXZzABcDYXZlABgDcnNhABkFcGFyc2UAGgtfX2hlYXBfYmFzZQMBCrxJN2gBAX9BACAANgL0CUEAKALQCSIBIABBAXRqIgBBADsBAEEAIABBAmoiADYC+AlBACAANgL8CUEAQQA2AtQJQQBBADYC5AlBAEEANgLcCUEAQQA2AtgJQQBBADYC7AlBAEEANgLgCSABC9MBAQN/QQAoAuQJIQRBAEEAKAL8CSIFNgLkCUEAIAQ2AugJQQAgBUEoajYC/AkgBEEkakHUCSAEGyAFNgIAQQAoAsgJIQRBACgCxAkhBiAFIAE2AgAgBSAANgIIIAUgAiACQQJqQQAgBiADRiIAGyAEIANGIgQbNgIMIAUgAzYCFCAFQQA2AhAgBSACNgIEIAVCADcCICAFQQNBAUECIAAbIAQbNgIcIAVBACgCxAkgA0YiAjoAGAJAAkAgAg0AQQAoAsgJIANHDQELQQBBAToAgAoLC14BAX9BACgC7AkiBEEQakHYCSAEG0EAKAL8CSIENgIAQQAgBDYC7AlBACAEQRRqNgL8CUEAQQE6AIAKIARBADYCECAEIAM2AgwgBCACNgIIIAQgATYCBCAEIAA2AgALCABBACgChAoLFQBBACgC3AkoAgBBACgC0AlrQQF1Cx4BAX9BACgC3AkoAgQiAEEAKALQCWtBAXVBfyAAGwsVAEEAKALcCSgCCEEAKALQCWtBAXULHgEBf0EAKALcCSgCDCIAQQAoAtAJa0EBdUF/IAAbCwsAQQAoAtwJKAIcCx4BAX9BACgC3AkoAhAiAEEAKALQCWtBAXVBfyAAGws7AQF/AkBBACgC3AkoAhQiAEEAKALECUcNAEF/DwsCQCAAQQAoAsgJRw0AQX4PCyAAQQAoAtAJa0EBdQsLAEEAKALcCS0AGAsVAEEAKALgCSgCAEEAKALQCWtBAXULFQBBACgC4AkoAgRBACgC0AlrQQF1Cx4BAX9BACgC4AkoAggiAEEAKALQCWtBAXVBfyAAGwseAQF/QQAoAuAJKAIMIgBBACgC0AlrQQF1QX8gABsLJQEBf0EAQQAoAtwJIgBBJGpB1AkgABsoAgAiADYC3AkgAEEARwslAQF/QQBBACgC4AkiAEEQakHYCSAAGygCACIANgLgCSAAQQBHCwgAQQAtAIgKCwgAQQAtAIAKCysBAX9BAEEAKAKMCiIAQRBqQQAoAtwJQSBqIAAbKAIAIgA2AowKIABBAEcLFQBBACgCjAooAgBBACgC0AlrQQF1CxUAQQAoAowKKAIEQQAoAtAJa0EBdQsVAEEAKAKMCigCCEEAKALQCWtBAXULFQBBACgCjAooAgxBACgC0AlrQQF1CwoAQQBBADYCjAoLuw8BBX8jAEGA0ABrIgAkAEEAQQE6AIgKQQBBACgCzAk2ApQKQQBBACgC0AlBfmoiATYCqApBACABQQAoAvQJQQF0aiICNgKsCkEAQQA6AIAKQQBBADsBkApBAEEAOwGSCkEAQQA6AJgKQQBBADYChApBAEEAOgDwCUEAIABBgBBqNgKcCkEAIAA2AqAKQQBBADoApAoCQAJAAkACQANAQQAgAUECaiIDNgKoCiABIAJPDQECQCADLwEAIgJBd2pBBUkNAAJAAkACQAJAAkAgAkGbf2oOBQEICAgCAAsgAkEgRg0EIAJBL0YNAyACQTtGDQIMBwtBAC8BkgoNASADEBtFDQEgAUEEakGCCEEKEDYNARAcQQAtAIgKDQFBAEEAKAKoCiIBNgKUCgwHCyADEBtFDQAgAUEEakGMCEEKEDYNABAdC0EAQQAoAqgKNgKUCgwBCwJAIAEvAQQiA0EqRg0AIANBL0cNBBAeDAELQQEQHwtBACgCrAohAkEAKAKoCiEBDAALC0EAIQIgAyEBQQAtAPAJDQIMAQtBACABNgKoCkEAQQA6AIgKCwNAQQAgAUECaiIDNgKoCgJAAkACQAJAAkACQAJAIAFBACgCrApPDQACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCADLwEAIgJBYGoOEBMSCRISEhIIAQUSEgQSEgoACwJAAkACQAJAIAJBpX9qDg8FFQYVFQ4VFQMVARUVFQIACyACQXdqQQVJDRUgAkGFf2oOAwgUCRQLQQAvAZIKDRMgAxAbRQ0TIAFBBGpBgghBChA2DRMQHAwTCyADEBtFDRIgAUEEakGMCEEKEDYNEhAdDBILIAMQG0UNESABKQAEQuyAhIOwjsA5Ug0RIAEvAQwiA0F3aiIBQRdLDQ9BASABdEGfgIAEcUUNDwwQC0EAQQAvAZIKIgFBAWo7AZIKQQAoApwKIAFBA3RqIgFBATYCACABQQAoApQKNgIEDBALQQBBAC8BkgoiAUEBajsBkgpBACgCnAogAUEDdGoiAUEINgIAIAFBACgClAo2AgQMDwtBAC8BkgoiAUUNC0EAIAFBf2o7AZIKDA4LQQAvAZAKIgNFDQ1BAC8BkgoiAkUNDSACQQN0QQAoApwKakF4aigCAEEFRw0NIANBAnRBACgCoApqQXxqKAIAIgMoAgQNDUEAIAFBBGo2AqgKIANBACgClApBAmo2AgRBARAgGiADQQAoAqgKIgE2AhBBACABQX5qNgKoCgwNC0EALwGSCiIDRQ0JQQAgA0F/aiIDOwGSCkEALwGQCiICRQ0MQQAoApwKIANB//8DcUEDdGooAgBBBUcNDAJAIAJBAnRBACgCoApqQXxqKAIAIgMoAgQNACADQQAoApQKQQJqNgIEC0EAIAJBf2o7AZAKIAMgAUEEajYCDAwMCwJAQQAoApQKIgEvAQBBKUcNAEEAKALkCSIDRQ0AIAMoAgQgAUcNAEEAQQAoAugJIgM2AuQJAkAgA0UNACADQQA2AiQMAQtBAEEANgLUCQtBAEEALwGSCiIDQQFqOwGSCkEAKAKcCiADQQN0aiIDQQZBAkEALQCkChs2AgAgAyABNgIEQQBBADoApAoMCwtBAC8BkgoiAUUNB0EAIAFBf2oiATsBkgpBACgCnAogAUH//wNxQQN0aigCAEEERg0EDAoLQScQIQwJC0EiECEMCAsCQAJAIAEvAQQiAUEqRg0AIAFBL0cNARAeDAoLQQEQHwwJCwJAAkACQAJAQQAoApQKIgEvAQAiAxAiRQ0AAkACQCADQVVqDgQACQEDCQsgAUF+ai8BAEErRg0DDAgLIAFBfmovAQBBLUYNAgwHCyADQSlHDQFBACgCnApBAC8BkgoiAkEDdGooAgQQI0UNAgwGCyABQX5qLwEAQVBqQf//A3FBCk8NBQtBAC8BkgohAgsCQAJAIAJB//8DcSICRQ0AIANB5gBHDQBBACgCnAogAkF/akEDdGoiBCgCAEEBRw0AIAFBfmovAQBB7wBHDQEgAUF8ahAkRQ0BIAQoAgRBlghBAxAlRQ0BDAULIANB/QBHDQBBACgCnAogAkEDdGoiAigCBBAmDQQgAigCAEEGRg0ECyABECcNAyADRQ0DIANBL0ZBAC0AmApBAEdxDQMCQEEAKALsCSICRQ0AIAEgAigCAEkNACABIAIoAgRNDQQLIAFBfmohAUEAKALQCSECAkADQCABQQJqIgQgAk0NAUEAIAE2ApQKIAEvAQAhAyABQX5qIgQhASADEChFDQALIARBAmohBAsCQCADQf//A3EQKUUNACAEQX5qIQECQANAIAFBAmoiAyACTQ0BQQAgATYClAogAS8BACEDIAFBfmoiBCEBIAMQKQ0ACyAEQQJqIQMLIAMQKg0EC0EAQQE6AJgKDAcLQQAoApwKQQAvAZIKIgFBA3QiA2pBACgClAo2AgRBACABQQFqOwGSCkEAKAKcCiADakEDNgIACxArDAULQQAtAPAJQQAvAZAKQQAvAZIKcnJFIQIMBwsQLEEAQQA6AJgKDAMLEC1BACECDAULIANBoAFHDQELQQBBAToApAoLQQBBACgCqAo2ApQKC0EAKAKoCiEBDAALCyAAQYDQAGokACACCxoAAkBBACgC0AkgAEcNAEEBDwsgAEF+ahAuC/4KAQZ/QQBBACgCqAoiAEEMaiIBNgKoCkEAKALsCSECQQEQICEDAkACQAJAAkACQAJAAkACQAJAQQAoAqgKIgQgAUcNACADEC9FDQELAkACQAJAAkACQAJAAkAgA0EqRg0AIANB+wBHDQFBACAEQQJqNgKoCkEBECAhA0EAKAKoCiEEA0ACQAJAIANB//8DcSIDQSJGDQAgA0EnRg0AIAMQMxpBACgCqAohAwwBCyADECFBAEEAKAKoCkECaiIDNgKoCgtBARAgGgJAIAQgAxA0IgNBLEcNAEEAQQAoAqgKQQJqNgKoCkEBECAhAwsgA0H9AEYNA0EAKAKoCiIFIARGDQ8gBSEEIAVBACgCrApNDQAMDwsLQQAgBEECajYCqApBARAgGkEAKAKoCiIDIAMQNBoMAgtBAEEAOgCICgJAAkACQAJAAkACQCADQZ9/ag4MAgsEAQsDCwsLCwsFAAsgA0H2AEYNBAwKC0EAIARBDmoiAzYCqAoCQAJAAkBBARAgQZ9/ag4GABICEhIBEgtBACgCqAoiBSkAAkLzgOSD4I3AMVINESAFLwEKEClFDRFBACAFQQpqNgKoCkEAECAaC0EAKAKoCiIFQQJqQbIIQQ4QNg0QIAUvARAiAkF3aiIBQRdLDQ1BASABdEGfgIAEcUUNDQwOC0EAKAKoCiIFKQACQuyAhIOwjsA5Ug0PIAUvAQoiAkF3aiIBQRdNDQYMCgtBACAEQQpqNgKoCkEAECAaQQAoAqgKIQQLQQAgBEEQajYCqAoCQEEBECAiBEEqRw0AQQBBACgCqApBAmo2AqgKQQEQICEEC0EAKAKoCiEDIAQQMxogA0EAKAKoCiIEIAMgBBACQQBBACgCqApBfmo2AqgKDwsCQCAEKQACQuyAhIOwjsA5Ug0AIAQvAQoQKEUNAEEAIARBCmo2AqgKQQEQICEEQQAoAqgKIQMgBBAzGiADQQAoAqgKIgQgAyAEEAJBAEEAKAKoCkF+ajYCqAoPC0EAIARBBGoiBDYCqAoLQQAgBEEGajYCqApBAEEAOgCICkEBECAhBEEAKAKoCiEDIAQQMyEEQQAoAqgKIQIgBEHf/wNxIgFB2wBHDQNBACACQQJqNgKoCkEBECAhBUEAKAKoCiEDQQAhBAwEC0EAQQE6AIAKQQBBACgCqApBAmo2AqgKC0EBECAhBEEAKAKoCiEDAkAgBEHmAEcNACADQQJqQawIQQYQNg0AQQAgA0EIajYCqAogAEEBECBBABAyIAJBEGpB2AkgAhshAwNAIAMoAgAiA0UNBSADQgA3AgggA0EQaiEDDAALC0EAIANBfmo2AqgKDAMLQQEgAXRBn4CABHFFDQMMBAtBASEECwNAAkACQCAEDgIAAQELIAVB//8DcRAzGkEBIQQMAQsCQAJAQQAoAqgKIgQgA0YNACADIAQgAyAEEAJBARAgIQQCQCABQdsARw0AIARBIHJB/QBGDQQLQQAoAqgKIQMCQCAEQSxHDQBBACADQQJqNgKoCkEBECAhBUEAKAKoCiEDIAVBIHJB+wBHDQILQQAgA0F+ajYCqAoLIAFB2wBHDQJBACACQX5qNgKoCg8LQQAhBAwACwsPCyACQaABRg0AIAJB+wBHDQQLQQAgBUEKajYCqApBARAgIgVB+wBGDQMMAgsCQCACQVhqDgMBAwEACyACQaABRw0CC0EAIAVBEGo2AqgKAkBBARAgIgVBKkcNAEEAQQAoAqgKQQJqNgKoCkEBECAhBQsgBUEoRg0BC0EAKAKoCiEBIAUQMxpBACgCqAoiBSABTQ0AIAQgAyABIAUQAkEAQQAoAqgKQX5qNgKoCg8LIAQgA0EAQQAQAkEAIARBDGo2AqgKDwsQLQuFDAEKf0EAQQAoAqgKIgBBDGoiATYCqApBARAgIQJBACgCqAohAwJAAkACQAJAAkACQAJAAkAgAkEuRw0AQQAgA0ECajYCqAoCQEEBECAiAkHkAEYNAAJAIAJB8wBGDQAgAkHtAEcNB0EAKAKoCiICQQJqQZwIQQYQNg0HAkBBACgClAoiAxAxDQAgAy8BAEEuRg0ICyAAIAAgAkEIakEAKALICRABDwtBACgCqAoiAkECakGiCEEKEDYNBgJAQQAoApQKIgMQMQ0AIAMvAQBBLkYNBwtBACEEQQAgAkEMajYCqApBASEFQQUhBkEBECAhAkEAIQdBASEIDAILQQAoAqgKIgIpAAJC5YCYg9CMgDlSDQUCQEEAKAKUCiIDEDENACADLwEAQS5GDQYLQQAhBEEAIAJBCmo2AqgKQQIhCEEHIQZBASEHQQEQICECQQEhBQwBCwJAAkACQAJAIAJB8wBHDQAgAyABTQ0AIANBAmpBoghBChA2DQACQCADLwEMIgRBd2oiB0EXSw0AQQEgB3RBn4CABHENAgsgBEGgAUYNAQtBACEHQQchBkEBIQQgAkHkAEYNAQwCC0EAIQRBACADQQxqIgI2AqgKQQEhBUEBECAhCQJAQQAoAqgKIgYgAkYNAEHmACECAkAgCUHmAEYNAEEFIQZBACEHQQEhCCAJIQIMBAtBACEHQQEhCCAGQQJqQawIQQYQNg0EIAYvAQgQKEUNBAtBACEHQQAgAzYCqApBByEGQQEhBEEAIQVBACEIIAkhAgwCCyADIABBCmpNDQBBACEIQeQAIQICQCADKQACQuWAmIPQjIA5Ug0AAkACQCADLwEKIgRBd2oiB0EXSw0AQQEgB3RBn4CABHENAQtBACEIIARBoAFHDQELQQAhBUEAIANBCmo2AqgKQSohAkEBIQdBAiEIQQEQICIJQSpGDQRBACADNgKoCkEBIQRBACEHQQAhCCAJIQIMAgsgAyEGQQAhBwwCC0EAIQVBACEICwJAIAJBKEcNAEEAKAKcCkEALwGSCiICQQN0aiIDQQAoAqgKNgIEQQAgAkEBajsBkgogA0EFNgIAQQAoApQKLwEAQS5GDQRBAEEAKAKoCiIDQQJqNgKoCkEBECAhAiAAQQAoAqgKQQAgAxABAkACQCAFDQBBACgC5AkhAQwBC0EAKALkCSIBIAY2AhwLQQBBAC8BkAoiA0EBajsBkApBACgCoAogA0ECdGogATYCAAJAIAJBIkYNACACQSdGDQBBAEEAKAKoCkF+ajYCqAoPCyACECFBAEEAKAKoCkECaiICNgKoCgJAAkACQEEBECBBV2oOBAECAgACC0EAQQAoAqgKQQJqNgKoCkEBECAaQQAoAuQJIgMgAjYCBCADQQE6ABggA0EAKAKoCiICNgIQQQAgAkF+ajYCqAoPC0EAKALkCSIDIAI2AgQgA0EBOgAYQQBBAC8BkgpBf2o7AZIKIANBACgCqApBAmo2AgxBAEEALwGQCkF/ajsBkAoPC0EAQQAoAqgKQX5qNgKoCg8LAkAgBEEBcyACQfsAR3INAEEAKAKoCiECQQAvAZIKDQUDQAJAAkACQCACQQAoAqwKTw0AQQEQICICQSJGDQEgAkEnRg0BIAJB/QBHDQJBAEEAKAKoCkECajYCqAoLQQEQICEDQQAoAqgKIQICQCADQeYARw0AIAJBAmpBrAhBBhA2DQcLQQAgAkEIajYCqAoCQEEBECAiAkEiRg0AIAJBJ0cNBwsgACACQQAQMg8LIAIQIQtBAEEAKAKoCkECaiICNgKoCgwACwsCQAJAIAJBWWoOBAMBAQMACyACQSJGDQILQQAoAqgKIQYLIAYgAUcNAEEAIABBCmo2AqgKDwsgAkEqRyAHcQ0DQQAvAZIKQf//A3ENA0EAKAKoCiECQQAoAqwKIQEDQCACIAFPDQECQAJAIAIvAQAiA0EnRg0AIANBIkcNAQsgACADIAgQMg8LQQAgAkECaiICNgKoCgwACwsQLQsPC0EAIAJBfmo2AqgKDwtBAEEAKAKoCkF+ajYCqAoLRwEDf0EAKAKoCkECaiEAQQAoAqwKIQECQANAIAAiAkF+aiABTw0BIAJBAmohACACLwEAQXZqDgQBAAABAAsLQQAgAjYCqAoLmAEBA39BAEEAKAKoCiIBQQJqNgKoCiABQQZqIQFBACgCrAohAgNAAkACQAJAIAFBfGogAk8NACABQX5qLwEAIQMCQAJAIAANACADQSpGDQEgA0F2ag4EAgQEAgQLIANBKkcNAwsgAS8BAEEvRw0CQQAgAUF+ajYCqAoMAQsgAUF+aiEBC0EAIAE2AqgKDwsgAUECaiEBDAALC5wBAQN/QQAoAqgKIQECQANAAkACQCABLwEAIgJBL0cNAAJAIAEvAQIiAUEqRg0AIAFBL0cNBBAeDAILIAAQHwwBCwJAAkAgAEUNACACQXdqIgFBF0sNAUEBIAF0QZ+AgARxRQ0BDAILIAIQKUUNAwwBCyACQaABRw0CC0EAQQAoAqgKIgNBAmoiATYCqAogA0EAKAKsCkkNAAsLIAILiAEBBH9BACgCqAohAUEAKAKsCiECAkACQANAIAEiA0ECaiEBIAMgAk8NASABLwEAIgQgAEYNAgJAIARB3ABGDQAgBEF2ag4EAgEBAgELIANBBGohASADLwEEQQ1HDQAgA0EGaiABIAMvAQZBCkYbIQEMAAsLQQAgATYCqAoQLQ8LQQAgATYCqAoLbAEBfwJAAkAgAEFfaiIBQQVLDQBBASABdEExcQ0BCyAAQUZqQf//A3FBBkkNACAAQSlHIABBWGpB//8DcUEHSXENAAJAIABBpX9qDgQBAAABAAsgAEH9AEcgAEGFf2pB//8DcUEESXEPC0EBCy4BAX9BASEBAkAgAEGcCUEFECUNACAAQZYIQQMQJQ0AIABBpglBAhAlIQELIAELygEBAn8CQAJAIAAvAQAiAUF3akEFSQ0AIAFBIEYNACABQSlGDQAgAUHdAEYNACABQaABRg0AQQAhAiABQf0ARw0BC0EAKALQCSECAkACQANAIAAvAQAhASAAIAJNDQECQCABQXdqQQVJDQAgAUEgRg0AIAFBoAFGDQACQCABQSlGDQAgAUHdAEYNACABQf0ARw0EC0EBDwsgAEF+aiEADAALC0EBIQIgAUEpRg0BIAFB3QBGDQEgAUH9AEYNAQsgARAvQQFzIQILIAILRgEDf0EAIQMCQCAAIAJBAXQiAmsiBEECaiIAQQAoAtAJIgVJDQAgACABIAIQNg0AAkAgACAFRw0AQQEPCyAEEC4hAwsgAwuDAQECf0EBIQECQAJAAkACQAJAAkAgAC8BACICQUVqDgQFBAQBAAsCQCACQZt/ag4EAwQEAgALIAJBKUYNBCACQfkARw0DIABBfmpBsglBBhAlDwsgAEF+ai8BAEE9Rg8LIABBfmpBqglBBBAlDwsgAEF+akG+CUEDECUPC0EAIQELIAELtAMBAn9BACEBAkACQAJAAkACQAJAAkACQAJAAkAgAC8BAEGcf2oOFAABAgkJCQkDCQkEBQkJBgkHCQkICQsCQAJAIABBfmovAQBBl39qDgQACgoBCgsgAEF8akHACEECECUPCyAAQXxqQcQIQQMQJQ8LAkACQAJAIABBfmovAQBBjX9qDgMAAQIKCwJAIABBfGovAQAiAkHhAEYNACACQewARw0KIABBempB5QAQMA8LIABBempB4wAQMA8LIABBfGpByghBBBAlDwsgAEF8akHSCEEGECUPCyAAQX5qLwEAQe8ARw0GIABBfGovAQBB5QBHDQYCQCAAQXpqLwEAIgJB8ABGDQAgAkHjAEcNByAAQXhqQd4IQQYQJQ8LIABBeGpB6ghBAhAlDwsgAEF+akHuCEEEECUPC0EBIQEgAEF+aiIAQekAEDANBCAAQfYIQQUQJQ8LIABBfmpB5AAQMA8LIABBfmpBgAlBBxAlDwsgAEF+akGOCUEEECUPCwJAIABBfmovAQAiAkHvAEYNACACQeUARw0BIABBfGpB7gAQMA8LIABBfGpBlglBAxAlIQELIAELNAEBf0EBIQECQCAAQXdqQf//A3FBBUkNACAAQYABckGgAUYNACAAQS5HIAAQL3EhAQsgAQswAQF/AkACQCAAQXdqIgFBF0sNAEEBIAF0QY2AgARxDQELIABBoAFGDQBBAA8LQQELTgECf0EAIQECQAJAIAAvAQAiAkHlAEYNACACQesARw0BIABBfmpB7ghBBBAlDwsgAEF+ai8BAEH1AEcNACAAQXxqQdIIQQYQJSEBCyABC94BAQR/QQAoAqgKIQBBACgCrAohAQJAAkACQANAIAAiAkECaiEAIAIgAU8NAQJAAkACQCAALwEAIgNBpH9qDgUCAwMDAQALIANBJEcNAiACLwEEQfsARw0CQQAgAkEEaiIANgKoCkEAQQAvAZIKIgJBAWo7AZIKQQAoApwKIAJBA3RqIgJBBDYCACACIAA2AgQPC0EAIAA2AqgKQQBBAC8BkgpBf2oiADsBkgpBACgCnAogAEH//wNxQQN0aigCAEEDRw0DDAQLIAJBBGohAAwACwtBACAANgKoCgsQLQsLcAECfwJAAkADQEEAQQAoAqgKIgBBAmoiATYCqAogAEEAKAKsCk8NAQJAAkACQCABLwEAIgFBpX9qDgIBAgALAkAgAUF2ag4EBAMDBAALIAFBL0cNAgwECxA1GgwBC0EAIABBBGo2AqgKDAALCxAtCws1AQF/QQBBAToA8AlBACgCqAohAEEAQQAoAqwKQQJqNgKoCkEAIABBACgC0AlrQQF1NgKECgtDAQJ/QQEhAQJAIAAvAQAiAkF3akH//wNxQQVJDQAgAkGAAXJBoAFGDQBBACEBIAIQL0UNACACQS5HIAAQMXIPCyABC2gBAn9BASEBAkACQCAAQV9qIgJBBUsNAEEBIAJ0QTFxDQELIABB+P8DcUEoRg0AIABBRmpB//8DcUEGSQ0AAkAgAEGlf2oiAkEDSw0AIAJBAUcNAQsgAEGFf2pB//8DcUEESSEBCyABCz0BAn9BACECAkBBACgC0AkiAyAASw0AIAAvAQAgAUcNAAJAIAMgAEcNAEEBDwsgAEF+ai8BABAoIQILIAILMQEBf0EAIQECQCAALwEAQS5HDQAgAEF+ai8BAEEuRw0AIABBfGovAQBBLkYhAQsgAQvbBAEFfwJAIAFBIkYNACABQSdGDQAQLQ8LQQAoAqgKIQMgARAhIAAgA0ECakEAKAKoCkEAKALECRABAkAgAkEBSA0AQQAoAuQJQQRBBiACQQFGGzYCHAtBAEEAKAKoCkECajYCqApBABAgIQJBACgCqAohAQJAAkAgAkH3AEcNACABLwECQekARw0AIAEvAQRB9ABHDQAgAS8BBkHoAEYNAQtBACABQX5qNgKoCg8LQQAgAUEIajYCqAoCQEEBECBB+wBGDQBBACABNgKoCg8LQQAoAqgKIgQhA0EAIQADQEEAIANBAmo2AqgKAkACQAJAAkBBARAgIgJBJ0cNAEEAKAKoCiEFQScQIUEAKAKoCkECaiEDDAELQQAoAqgKIQUgAkEiRw0BQSIQIUEAKAKoCkECaiEDC0EAIAM2AqgKQQEQICECDAELIAIQMyECQQAoAqgKIQMLAkAgAkE6Rg0AQQAgATYCqAoPC0EAQQAoAqgKQQJqNgKoCgJAQQEQICICQSJGDQAgAkEnRg0AQQAgATYCqAoPC0EAKAKoCiEGIAIQIUEAQQAoAvwJIgJBFGo2AvwJQQAoAqgKIQcgAiAFNgIAIAJBADYCECACIAY2AgggAiADNgIEIAIgB0ECajYCDEEAQQAoAqgKQQJqNgKoCiAAQRBqQQAoAuQJQSBqIAAbIAI2AgACQAJAQQEQICIAQSxGDQAgAEH9AEYNAUEAIAE2AqgKDwtBAEEAKAKoCkECaiIDNgKoCiACIQAMAQsLQQAoAuQJIgEgBDYCECABQQAoAqgKQQJqNgIMC20BAn8CQAJAA0ACQCAAQf//A3EiAUF3aiICQRdLDQBBASACdEGfgIAEcQ0CCyABQaABRg0BIAAhAiABEC8NAkEAIQJBAEEAKAKoCiIAQQJqNgKoCiAALwECIgANAAwCCwsgACECCyACQf//A3ELqwEBBH8CQAJAQQAoAqgKIgIvAQAiA0HhAEYNACABIQQgACEFDAELQQAgAkEEajYCqApBARAgIQJBACgCqAohBQJAAkAgAkEiRg0AIAJBJ0YNACACEDMaQQAoAqgKIQQMAQsgAhAhQQBBACgCqApBAmoiBDYCqAoLQQEQICEDQQAoAqgKIQILAkAgAiAFRg0AIAUgBEEAIAAgACABRiICG0EAIAEgAhsQAgsgAwtyAQR/QQAoAqgKIQBBACgCrAohAQJAAkADQCAAQQJqIQIgACABTw0BAkACQCACLwEAIgNBpH9qDgIBBAALIAIhACADQXZqDgQCAQECAQsgAEEEaiEADAALC0EAIAI2AqgKEC1BAA8LQQAgAjYCqApB3QALSQEDf0EAIQMCQCACRQ0AAkADQCAALQAAIgQgAS0AACIFRw0BIAFBAWohASAAQQFqIQAgAkF/aiICDQAMAgsLIAQgBWshAwsgAwsL4gECAEGACAvEAQAAeABwAG8AcgB0AG0AcABvAHIAdABmAG8AcgBlAHQAYQBvAHUAcgBjAGUAcgBvAG0AdQBuAGMAdABpAG8AbgB2AG8AeQBpAGUAZABlAGwAZQBjAG8AbgB0AGkAbgBpAG4AcwB0AGEAbgB0AHkAYgByAGUAYQByAGUAdAB1AHIAZABlAGIAdQBnAGcAZQBhAHcAYQBpAHQAaAByAHcAaABpAGwAZQBpAGYAYwBhAHQAYwBmAGkAbgBhAGwAbABlAGwAcwAAQcQJCxABAAAAAgAAAAAEAAAwOQAA", "undefined" != typeof Buffer ? Buffer.from(A, "base64") : Uint8Array.from(atob(A), ((A2) => A2.charCodeAt(0)));
  var A;
};
WebAssembly.compile(E()).then(WebAssembly.instantiate).then((({ exports: A }) => {
}));
async function readBodyWithLimit(request, limit) {
  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader) {
    const contentLength = Number.parseInt(contentLengthHeader, 10);
    if (Number.isFinite(contentLength) && contentLength > limit) {
      throw new BodySizeLimitError(limit);
    }
  }
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks = [];
  let received = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      received += value.byteLength;
      if (received > limit) {
        throw new BodySizeLimitError(limit);
      }
      chunks.push(value);
    }
  }
  const buffer2 = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    buffer2.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return buffer2;
}
class BodySizeLimitError extends Error {
  limit;
  constructor(limit) {
    super(`Request body exceeds the configured limit of ${limit} bytes`);
    this.name = "BodySizeLimitError";
    this.limit = limit;
  }
}
const __vite_import_meta_env__ = { "ASSETS_PREFIX": void 0, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": void 0, "SSR": true };
function getActionContext(context) {
  const callerInfo = getCallerInfo(context);
  const actionResultAlreadySet = Boolean(context.locals._actionPayload);
  let action = void 0;
  if (callerInfo && context.request.method === "POST" && !actionResultAlreadySet) {
    action = {
      calledFrom: callerInfo.from,
      name: callerInfo.name,
      handler: async () => {
        const pipeline = Reflect.get(context, pipelineSymbol);
        const callerInfoName = shouldAppendForwardSlash(
          pipeline.manifest.trailingSlash,
          pipeline.manifest.buildFormat
        ) ? removeTrailingForwardSlash(callerInfo.name) : callerInfo.name;
        let baseAction;
        try {
          baseAction = await pipeline.getAction(callerInfoName);
        } catch (error2) {
          if (error2 instanceof Error && "name" in error2 && typeof error2.name === "string" && error2.name === ActionNotFoundError.name) {
            return { data: void 0, error: new ActionError({ code: "NOT_FOUND" }) };
          }
          throw error2;
        }
        const bodySizeLimit = pipeline.manifest.actionBodySizeLimit;
        let input;
        try {
          input = await parseRequestBody(context.request, bodySizeLimit);
        } catch (e) {
          if (e instanceof ActionError) {
            return { data: void 0, error: e };
          }
          if (e instanceof TypeError) {
            return { data: void 0, error: new ActionError({ code: "UNSUPPORTED_MEDIA_TYPE" }) };
          }
          throw e;
        }
        const omitKeys = ["props", "getActionResult", "callAction", "redirect"];
        const actionAPIContext = Object.create(
          Object.getPrototypeOf(context),
          Object.fromEntries(
            Object.entries(Object.getOwnPropertyDescriptors(context)).filter(
              ([key]) => !omitKeys.includes(key)
            )
          )
        );
        Reflect.set(actionAPIContext, ACTION_API_CONTEXT_SYMBOL, true);
        const handler = baseAction.bind(actionAPIContext);
        return handler(input);
      }
    };
  }
  function setActionResult(actionName, actionResult) {
    context.locals._actionPayload = {
      actionResult,
      actionName
    };
  }
  return {
    action,
    setActionResult,
    serializeActionResult,
    deserializeActionResult
  };
}
function getCallerInfo(ctx) {
  if (ctx.routePattern === ACTION_RPC_ROUTE_PATTERN) {
    return { from: "rpc", name: ctx.url.pathname.replace(/^.*\/_actions\//, "") };
  }
  const queryParam = ctx.url.searchParams.get(ACTION_QUERY_PARAMS.actionName);
  if (queryParam) {
    return { from: "form", name: queryParam };
  }
  return void 0;
}
async function parseRequestBody(request, bodySizeLimit) {
  const contentType = request.headers.get("content-type");
  const contentLengthHeader = request.headers.get("content-length");
  const contentLength = contentLengthHeader ? Number.parseInt(contentLengthHeader, 10) : void 0;
  const hasContentLength = typeof contentLength === "number" && Number.isFinite(contentLength);
  if (!contentType) return void 0;
  if (hasContentLength && contentLength > bodySizeLimit) {
    throw new ActionError({
      code: "CONTENT_TOO_LARGE",
      message: `Request body exceeds ${bodySizeLimit} bytes`
    });
  }
  try {
    if (hasContentType(contentType, formContentTypes$1)) {
      if (!hasContentLength) {
        const body = await readBodyWithLimit(request.clone(), bodySizeLimit);
        const formRequest = new Request(request.url, {
          method: request.method,
          headers: request.headers,
          body: toArrayBuffer(body)
        });
        return await formRequest.formData();
      }
      return await request.clone().formData();
    }
    if (hasContentType(contentType, ["application/json"])) {
      if (contentLength === 0) return void 0;
      if (!hasContentLength) {
        const body = await readBodyWithLimit(request.clone(), bodySizeLimit);
        if (body.byteLength === 0) return void 0;
        return JSON.parse(new TextDecoder().decode(body));
      }
      return await request.clone().json();
    }
  } catch (e) {
    if (e instanceof BodySizeLimitError) {
      throw new ActionError({
        code: "CONTENT_TOO_LARGE",
        message: `Request body exceeds ${bodySizeLimit} bytes`
      });
    }
    throw e;
  }
  throw new TypeError("Unsupported content type");
}
const ACTION_API_CONTEXT_SYMBOL = /* @__PURE__ */ Symbol.for("astro.actionAPIContext");
const formContentTypes$1 = ["application/x-www-form-urlencoded", "multipart/form-data"];
function hasContentType(contentType, expected) {
  const type = contentType.split(";")[0].toLowerCase();
  return expected.some((t) => type === t);
}
function serializeActionResult(res) {
  if (res.error) {
    if (Object.assign(__vite_import_meta_env__, { _: "/Users/antek/projekty/TrAIner/node_modules/.bin/astro" })?.DEV) {
      actionResultErrorStack.set(res.error.stack);
    }
    let body2;
    if (res.error instanceof ActionInputError) {
      body2 = {
        type: res.error.type,
        issues: res.error.issues,
        fields: res.error.fields
      };
    } else {
      body2 = {
        ...res.error,
        message: res.error.message
      };
    }
    return {
      type: "error",
      status: res.error.status,
      contentType: "application/json",
      body: JSON.stringify(body2)
    };
  }
  if (res.data === void 0) {
    return {
      type: "empty",
      status: 204
    };
  }
  let body;
  try {
    body = stringify$2(res.data, {
      // Add support for URL objects
      URL: (value) => value instanceof URL && value.href
    });
  } catch (e) {
    let hint = ActionsReturnedInvalidDataError.hint;
    if (res.data instanceof Response) {
      hint = REDIRECT_STATUS_CODES.includes(res.data.status) ? "If you need to redirect when the action succeeds, trigger a redirect where the action is called. See the Actions guide for server and client redirect examples: https://docs.astro.build/en/guides/actions." : "If you need to return a Response object, try using a server endpoint instead. See https://docs.astro.build/en/guides/endpoints/#server-endpoints-api-routes";
    }
    throw new AstroError({
      ...ActionsReturnedInvalidDataError,
      message: ActionsReturnedInvalidDataError.message(String(e)),
      hint
    });
  }
  return {
    type: "data",
    status: 200,
    contentType: "application/json+devalue",
    body
  };
}
function toArrayBuffer(buffer2) {
  const copy = new Uint8Array(buffer2.byteLength);
  copy.set(buffer2);
  return copy.buffer;
}
function hasActionPayload(locals) {
  return "_actionPayload" in locals;
}
function createGetActionResult(locals) {
  return (actionFn) => {
    if (!hasActionPayload(locals) || actionFn.toString() !== getActionQueryString(locals._actionPayload.actionName)) {
      return void 0;
    }
    return deserializeActionResult(locals._actionPayload.actionResult);
  };
}
function createCallAction(context) {
  return (baseAction, input) => {
    Reflect.set(context, ACTION_API_CONTEXT_SYMBOL, true);
    const action = baseAction.bind(context);
    return action(input);
  };
}
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
const DELETED_EXPIRATION = /* @__PURE__ */ new Date(0);
const DELETED_VALUE = "deleted";
const responseSentSymbol = /* @__PURE__ */ Symbol.for("astro.responseSent");
const identity = (value) => value;
class AstroCookie {
  value;
  constructor(value) {
    this.value = value;
  }
  json() {
    if (this.value === void 0) {
      throw new Error(`Cannot convert undefined to an object.`);
    }
    return JSON.parse(this.value);
  }
  number() {
    return Number(this.value);
  }
  boolean() {
    if (this.value === "false") return false;
    if (this.value === "0") return false;
    return Boolean(this.value);
  }
}
class AstroCookies {
  #request;
  #requestValues;
  #outgoing;
  #consumed;
  constructor(request) {
    this.#request = request;
    this.#requestValues = null;
    this.#outgoing = null;
    this.#consumed = false;
  }
  /**
   * Astro.cookies.delete(key) is used to delete a cookie. Using this method will result
   * in a Set-Cookie header added to the response.
   * @param key The cookie to delete
   * @param options Options related to this deletion, such as the path of the cookie.
   */
  delete(key, options) {
    const {
      // @ts-expect-error
      maxAge: _ignoredMaxAge,
      // @ts-expect-error
      expires: _ignoredExpires,
      ...sanitizedOptions
    } = options || {};
    const serializeOptions = {
      expires: DELETED_EXPIRATION,
      ...sanitizedOptions
    };
    this.#ensureOutgoingMap().set(key, [
      DELETED_VALUE,
      distExports.serialize(key, DELETED_VALUE, serializeOptions),
      false
    ]);
  }
  /**
   * Astro.cookies.get(key) is used to get a cookie value. The cookie value is read from the
   * request. If you have set a cookie via Astro.cookies.set(key, value), the value will be taken
   * from that set call, overriding any values already part of the request.
   * @param key The cookie to get.
   * @returns An object containing the cookie value as well as convenience methods for converting its value.
   */
  get(key, options = void 0) {
    if (this.#outgoing?.has(key)) {
      let [serializedValue, , isSetValue] = this.#outgoing.get(key);
      if (isSetValue) {
        return new AstroCookie(serializedValue);
      } else {
        return void 0;
      }
    }
    const decode = options?.decode ?? decodeURIComponent;
    const values = this.#ensureParsed();
    if (key in values) {
      const value = values[key];
      if (value) {
        let decodedValue;
        try {
          decodedValue = decode(value);
        } catch (_error) {
          decodedValue = value;
        }
        return new AstroCookie(decodedValue);
      }
    }
  }
  /**
   * Astro.cookies.has(key) returns a boolean indicating whether this cookie is either
   * part of the initial request or set via Astro.cookies.set(key)
   * @param key The cookie to check for.
   * @param _options This parameter is no longer used.
   * @returns
   */
  has(key, _options) {
    if (this.#outgoing?.has(key)) {
      let [, , isSetValue] = this.#outgoing.get(key);
      return isSetValue;
    }
    const values = this.#ensureParsed();
    return values[key] !== void 0;
  }
  /**
   * Astro.cookies.set(key, value) is used to set a cookie's value. If provided
   * an object it will be stringified via JSON.stringify(value). Additionally you
   * can provide options customizing how this cookie will be set, such as setting httpOnly
   * in order to prevent the cookie from being read in client-side JavaScript.
   * @param key The name of the cookie to set.
   * @param value A value, either a string or other primitive or an object.
   * @param options Options for the cookie, such as the path and security settings.
   */
  set(key, value, options) {
    if (this.#consumed) {
      const warning = new Error(
        "Astro.cookies.set() was called after the cookies had already been sent to the browser.\nThis may have happened if this method was called in an imported component.\nPlease make sure that Astro.cookies.set() is only called in the frontmatter of the main page."
      );
      warning.name = "Warning";
      console.warn(warning);
    }
    let serializedValue;
    if (typeof value === "string") {
      serializedValue = value;
    } else {
      let toStringValue = value.toString();
      if (toStringValue === Object.prototype.toString.call(value)) {
        serializedValue = JSON.stringify(value);
      } else {
        serializedValue = toStringValue;
      }
    }
    const serializeOptions = {};
    if (options) {
      Object.assign(serializeOptions, options);
    }
    this.#ensureOutgoingMap().set(key, [
      serializedValue,
      distExports.serialize(key, serializedValue, serializeOptions),
      true
    ]);
    if (this.#request[responseSentSymbol]) {
      throw new AstroError({
        ...ResponseSentError
      });
    }
  }
  /**
   * Merges a new AstroCookies instance into the current instance. Any new cookies
   * will be added to the current instance, overwriting any existing cookies with the same name.
   */
  merge(cookies) {
    const outgoing = cookies.#outgoing;
    if (outgoing) {
      for (const [key, value] of outgoing) {
        this.#ensureOutgoingMap().set(key, value);
      }
    }
  }
  /**
   * Astro.cookies.header() returns an iterator for the cookies that have previously
   * been set by either Astro.cookies.set() or Astro.cookies.delete().
   * This method is primarily used by adapters to set the header on outgoing responses.
   * @returns
   */
  *headers() {
    if (this.#outgoing == null) return;
    for (const [, value] of this.#outgoing) {
      yield value[1];
    }
  }
  /**
   * Marks the cookies as consumed and returns the header values.
   * After consumption, any subsequent `set()` calls will warn.
   */
  consume() {
    this.#consumed = true;
    return this.headers();
  }
  /**
   * @deprecated Use the instance method `cookies.consume()` instead.
   * Kept for backward compatibility with adapters.
   */
  static consume(cookies) {
    return cookies.consume();
  }
  #ensureParsed() {
    if (!this.#requestValues) {
      this.#parse();
    }
    if (!this.#requestValues) {
      this.#requestValues = /* @__PURE__ */ Object.create(null);
    }
    return this.#requestValues;
  }
  #ensureOutgoingMap() {
    if (!this.#outgoing) {
      this.#outgoing = /* @__PURE__ */ new Map();
    }
    return this.#outgoing;
  }
  #parse() {
    const raw = this.#request.headers.get("cookie");
    if (!raw) {
      return;
    }
    this.#requestValues = distExports.parse(raw, { decode: identity });
  }
}
const astroCookiesSymbol = /* @__PURE__ */ Symbol.for("astro.cookies");
function attachCookiesToResponse(response, cookies) {
  Reflect.set(response, astroCookiesSymbol, cookies);
}
function getCookiesFromResponse(response) {
  let cookies = Reflect.get(response, astroCookiesSymbol);
  if (cookies != null) {
    return cookies;
  } else {
    return void 0;
  }
}
function* getSetCookiesFromResponse(response) {
  const cookies = getCookiesFromResponse(response);
  if (!cookies) {
    return [];
  }
  for (const headerValue of cookies.consume()) {
    yield headerValue;
  }
  return [];
}
const NOOP_ACTIONS_MOD = {
  server: {}
};
const FORM_CONTENT_TYPES = [
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
];
const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];
function createOriginCheckMiddleware() {
  return defineMiddleware((context, next) => {
    const { request, url, isPrerendered } = context;
    if (isPrerendered) {
      return next();
    }
    if (SAFE_METHODS.includes(request.method)) {
      return next();
    }
    const isSameOrigin = request.headers.get("origin") === url.origin;
    const hasContentType2 = request.headers.has("content-type");
    if (hasContentType2) {
      const formLikeHeader = hasFormLikeHeader(request.headers.get("content-type"));
      if (formLikeHeader && !isSameOrigin) {
        return new Response(`Cross-site ${request.method} form submissions are forbidden`, {
          status: 403
        });
      }
    } else {
      if (!isSameOrigin) {
        return new Response(`Cross-site ${request.method} form submissions are forbidden`, {
          status: 403
        });
      }
    }
    return next();
  });
}
function hasFormLikeHeader(contentType) {
  if (contentType) {
    for (const FORM_CONTENT_TYPE of FORM_CONTENT_TYPES) {
      if (contentType.toLowerCase().includes(FORM_CONTENT_TYPE)) {
        return true;
      }
    }
  }
  return false;
}
const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};
const RedirectComponentInstance = {
  default() {
    return new Response(null, {
      status: 301
    });
  }
};
const RedirectSinglePageBuiltModule = {
  page: () => Promise.resolve(RedirectComponentInstance),
  onRequest: (_, next) => next()
};
async function renderEndpoint(mod, context, isPrerendered, logger) {
  const { request, url } = context;
  const method = request.method.toUpperCase();
  let handler = mod[method] ?? mod["ALL"];
  if (!handler && method === "HEAD" && mod["GET"]) {
    handler = mod["GET"];
  }
  if (isPrerendered && !["GET", "HEAD"].includes(method)) {
    logger.warn(
      "router",
      `${url.pathname} ${s.bold(
        method
      )} requests are not available in static endpoints. Mark this page as server-rendered (\`export const prerender = false;\`) or update your config to \`output: 'server'\` to make all your pages server-rendered by default.`
    );
  }
  if (handler === void 0) {
    logger.warn(
      "router",
      `No API Route handler exists for the method "${method}" for the route "${url.pathname}".
Found handlers: ${Object.keys(mod).map((exp) => JSON.stringify(exp)).join(", ")}
` + ("all" in mod ? `One of the exported handlers is "all" (lowercase), did you mean to export 'ALL'?
` : "")
    );
    return new Response(null, { status: 404 });
  }
  if (typeof handler !== "function") {
    logger.error(
      "router",
      `The route "${url.pathname}" exports a value for the method "${method}", but it is of the type ${typeof handler} instead of a function.`
    );
    return new Response(null, { status: 500 });
  }
  let response = await handler.call(mod, context);
  if (!response || response instanceof Response === false) {
    throw new AstroError(EndpointDidNotReturnAResponse);
  }
  if (REROUTABLE_STATUS_CODES.includes(response.status)) {
    try {
      response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
    } catch (err) {
      if (err.message?.includes("immutable")) {
        response = new Response(response.body, response);
        response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
      } else {
        throw err;
      }
    }
  }
  if (method === "HEAD") {
    return new Response(null, response);
  }
  return response;
}
const AstroJSX = "astro:jsx";
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function isAstroComponentFactory(obj) {
  return obj == null ? false : obj.isAstroComponentFactory === true;
}
function isAPropagatingComponent(result, factory) {
  return isPropagatingHint(getPropagationHint(result, factory));
}
function getPropagationHint(result, factory) {
  return getPropagationHint$1(result, factory);
}
const PROP_TYPE = {
  Value: 0,
  JSON: 1,
  // Actually means Array
  RegExp: 2,
  Date: 3,
  Map: 4,
  Set: 5,
  BigInt: 6,
  URL: 7,
  Uint8Array: 8,
  Uint16Array: 9,
  Uint32Array: 10,
  Infinity: 11
};
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = value.map((v) => {
    return convertToSerializedForm(v, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v, metadata, parents)];
    })
  );
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [PROP_TYPE.Map, serializeArray(Array.from(value), metadata, parents)];
    }
    case "[object Set]": {
      return [PROP_TYPE.Set, serializeArray(Array.from(value), metadata, parents)];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, serializeArray(value, metadata, parents)];
    }
    case "[object Uint8Array]": {
      return [PROP_TYPE.Uint8Array, Array.from(value)];
    }
    case "[object Uint16Array]": {
      return [PROP_TYPE.Uint16Array, Array.from(value)];
    }
    case "[object Uint32Array]": {
      return [PROP_TYPE.Uint32Array, Array.from(value)];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      }
      if (value === Number.POSITIVE_INFINITY) {
        return [PROP_TYPE.Infinity, 1];
      }
      if (value === Number.NEGATIVE_INFINITY) {
        return [PROP_TYPE.Infinity, -1];
      }
      if (value === void 0) {
        return [PROP_TYPE.Value];
      }
      return [PROP_TYPE.Value, value];
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}
const transitionDirectivesToCopyOnIsland = Object.freeze([
  "data-astro-transition-scope",
  "data-astro-transition-persist",
  "data-astro-transition-persist-props"
]);
function extractDirectives(inputProps, clientDirectives) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {},
    propsWithoutTransitionAttributes: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        // This is a special prop added to prove that the client hydration method
        // was added statically.
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!clientDirectives.has(extracted.hydration.directive)) {
            const hydrationMethods = Array.from(clientDirectives.keys()).map((d) => `client:${d}`).join(", ");
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${hydrationMethods}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new AstroError(MissingMediaQueryDirective);
          }
          break;
        }
      }
    } else {
      extracted.props[key] = value;
      if (!transitionDirectivesToCopyOnIsland.includes(key)) {
        extracted.propsWithoutTransitionAttributes[key] = value;
      }
    }
  }
  for (const sym of Object.getOwnPropertySymbols(inputProps)) {
    extracted.props[sym] = inputProps[sym];
    extracted.propsWithoutTransitionAttributes[sym] = inputProps[sym];
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer: renderer2, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new AstroError({
      ...NoMatchingImport,
      message: NoMatchingImport.message(metadata.displayName)
    });
  }
  const island = {
    children: "",
    props: {
      // This is for HMR, probably can avoid it in prod
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = escapeHTML(value);
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer2.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(
      decodeURI(renderer2.clientEntrypoint.toString())
    );
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  let beforeHydrationUrl = await result.resolve("astro:scripts/before-hydration.js");
  if (beforeHydrationUrl.length) {
    island.props["before-hydration-url"] = beforeHydrationUrl;
  }
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  transitionDirectivesToCopyOnIsland.forEach((name) => {
    if (typeof props[name] !== "undefined") {
      island.props[name] = props[name];
    }
  });
  return island;
}
const dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const binary = dictionary.length;
function bitwise(str) {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}
const DOCTYPE_EXP = /<!doctype html/i;
async function renderToString(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response) return templateResult;
  let str = "";
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  const destination = {
    write(chunk) {
      if (isPage && !renderedFirstPageChunk) {
        renderedFirstPageChunk = true;
        if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
          const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
          str += doctype;
        }
      }
      if (chunk instanceof Response) return;
      str += chunkToString(result, chunk);
    }
  };
  await templateResult.render(destination);
  return str;
}
async function renderToReadableStream(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response) return templateResult;
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  return new ReadableStream({
    start(controller) {
      const destination = {
        write(chunk) {
          if (isPage && !renderedFirstPageChunk) {
            renderedFirstPageChunk = true;
            if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
              const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
              controller.enqueue(encoder.encode(doctype));
            }
          }
          if (chunk instanceof Response) {
            throw new AstroError({
              ...ResponseSentError
            });
          }
          const bytes = chunkToByteArray(result, chunk);
          controller.enqueue(bytes);
        }
      };
      (async () => {
        try {
          await templateResult.render(destination);
          controller.close();
        } catch (e) {
          if (AstroError.is(e) && !e.loc) {
            e.setLocation({
              file: route?.component
            });
          }
          setTimeout(() => controller.error(e), 0);
        }
      })();
    },
    cancel() {
      result.cancelled = true;
    }
  });
}
async function callComponentAsTemplateResultOrResponse(result, componentFactory, props, children, route) {
  const factoryResult = await componentFactory(result, props, children);
  if (factoryResult instanceof Response) {
    return factoryResult;
  } else if (isHeadAndContent(factoryResult)) {
    if (!isRenderTemplateResult(factoryResult.content)) {
      throw new AstroError({
        ...OnlyResponseCanBeReturned,
        message: OnlyResponseCanBeReturned.message(
          route?.route,
          typeof factoryResult
        ),
        location: {
          file: route?.component
        }
      });
    }
    return factoryResult.content;
  } else if (!isRenderTemplateResult(factoryResult)) {
    throw new AstroError({
      ...OnlyResponseCanBeReturned,
      message: OnlyResponseCanBeReturned.message(route?.route, typeof factoryResult),
      location: {
        file: route?.component
      }
    });
  }
  return factoryResult;
}
async function bufferHeadContent(result) {
  await bufferPropagatedHead(result);
}
async function renderToAsyncIterable(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response) return templateResult;
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  let error2 = null;
  let next = null;
  const buffer2 = [];
  let renderingComplete = false;
  const iterator = {
    async next() {
      if (result.cancelled) return { done: true, value: void 0 };
      if (next !== null) {
        await next.promise;
      } else if (!renderingComplete && !buffer2.length) {
        next = promiseWithResolvers();
        await next.promise;
      }
      if (!renderingComplete) {
        next = promiseWithResolvers();
      }
      if (error2) {
        throw error2;
      }
      let length = 0;
      let stringToEncode = "";
      for (let i = 0, len = buffer2.length; i < len; i++) {
        const bufferEntry = buffer2[i];
        if (typeof bufferEntry === "string") {
          const nextIsString = i + 1 < len && typeof buffer2[i + 1] === "string";
          stringToEncode += bufferEntry;
          if (!nextIsString) {
            const encoded = encoder.encode(stringToEncode);
            length += encoded.length;
            stringToEncode = "";
            buffer2[i] = encoded;
          } else {
            buffer2[i] = "";
          }
        } else {
          length += bufferEntry.length;
        }
      }
      let mergedArray = new Uint8Array(length);
      let offset = 0;
      for (let i = 0, len = buffer2.length; i < len; i++) {
        const item = buffer2[i];
        if (item === "") {
          continue;
        }
        mergedArray.set(item, offset);
        offset += item.length;
      }
      buffer2.length = 0;
      const returnValue = {
        // The iterator is done when rendering has finished
        // and there are no more chunks to return.
        done: length === 0 && renderingComplete,
        value: mergedArray
      };
      return returnValue;
    },
    async return() {
      result.cancelled = true;
      return { done: true, value: void 0 };
    }
  };
  const destination = {
    write(chunk) {
      if (isPage && !renderedFirstPageChunk) {
        renderedFirstPageChunk = true;
        if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
          const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
          buffer2.push(encoder.encode(doctype));
        }
      }
      if (chunk instanceof Response) {
        throw new AstroError(ResponseSentError);
      }
      const bytes = chunkToByteArrayOrString(result, chunk);
      if (bytes.length > 0) {
        buffer2.push(bytes);
        next?.resolve();
      } else if (buffer2.length > 0) {
        next?.resolve();
      }
    }
  };
  const renderResult = toPromise(() => templateResult.render(destination));
  renderResult.catch((err) => {
    error2 = err;
  }).finally(() => {
    renderingComplete = true;
    next?.resolve();
  });
  return {
    [Symbol.asyncIterator]() {
      return iterator;
    }
  };
}
function toPromise(fn) {
  try {
    const result = fn();
    return isPromise(result) ? result : Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
}
function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement$1(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlotToString(result, slots?.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName) return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}
const needsHeadRenderingSymbol = /* @__PURE__ */ Symbol.for("astro.needsHeadRendering");
const rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
const clientOnlyValues = /* @__PURE__ */ new Set(["solid-js", "react", "preact", "vue", "svelte"]);
function guessRenderers(componentUrl) {
  const extname = componentUrl?.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/solid-js", "@astrojs/vue (jsx)"];
    case void 0:
    default:
      return [
        "@astrojs/react",
        "@astrojs/preact",
        "@astrojs/solid-js",
        "@astrojs/vue",
        "@astrojs/svelte"
      ];
  }
}
function isFragmentComponent(Component) {
  return Component === Fragment;
}
function isHTMLComponent(Component) {
  return Component && Component["astro:html"] === true;
}
const ASTRO_SLOT_EXP = /<\/?astro-slot\b[^>]*>/g;
const ASTRO_STATIC_SLOT_EXP = /<\/?astro-static-slot\b[^>]*>/g;
function removeStaticAstroSlot(html, supportsAstroStaticSlot = true) {
  const exp = supportsAstroStaticSlot ? ASTRO_STATIC_SLOT_EXP : ASTRO_SLOT_EXP;
  return html.replace(exp, "");
}
async function renderFrameworkComponent(result, displayName, Component, _props, slots = {}) {
  if (!Component && "client:only" in _props === false) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers: renderers2, clientDirectives } = result;
  const metadata = {
    astroStaticSlot: true,
    displayName
  };
  const { hydration, isPage, props, propsWithoutTransitionAttributes } = extractDirectives(
    _props,
    clientDirectives
  );
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  const validRenderers = renderers2.filter((r) => r.name !== "astro:jsx");
  const { children, slotInstructions } = await renderSlots(result, slots);
  let renderer2;
  if (metadata.hydrate !== "only") {
    let isTagged = false;
    try {
      isTagged = Component && Component[Renderer];
    } catch {
    }
    if (isTagged) {
      const rendererName = Component[Renderer];
      renderer2 = renderers2.find(({ name }) => name === rendererName);
    }
    if (!renderer2) {
      let error2;
      for (const r of renderers2) {
        try {
          if (await r.ssr.check.call({ result }, Component, props, children, metadata)) {
            renderer2 = r;
            break;
          }
        } catch (e) {
          error2 ??= e;
        }
      }
      if (!renderer2 && error2) {
        throw error2;
      }
    }
    if (!renderer2 && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = await renderHTMLElement$1(
        result,
        Component,
        _props,
        slots
      );
      return {
        render(destination) {
          destination.write(output);
        }
      };
    }
  } else {
    if (metadata.hydrateArgs) {
      const rendererName = rendererAliases.has(metadata.hydrateArgs) ? rendererAliases.get(metadata.hydrateArgs) : metadata.hydrateArgs;
      if (clientOnlyValues.has(rendererName)) {
        renderer2 = renderers2.find(
          ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
        );
      }
    }
    if (!renderer2 && validRenderers.length === 1) {
      renderer2 = validRenderers[0];
    }
    if (!renderer2) {
      const extname = metadata.componentUrl?.split(".").pop();
      renderer2 = renderers2.find(({ name }) => name === `@astrojs/${extname}` || name === extname);
    }
    if (!renderer2 && metadata.hydrateArgs) {
      const rendererName = metadata.hydrateArgs;
      if (typeof rendererName === "string") {
        renderer2 = renderers2.find(({ name }) => name === rendererName);
      }
    }
  }
  if (!renderer2) {
    if (metadata.hydrate === "only") {
      const rendererName = rendererAliases.has(metadata.hydrateArgs) ? rendererAliases.get(metadata.hydrateArgs) : metadata.hydrateArgs;
      if (clientOnlyValues.has(rendererName)) {
        const plural = validRenderers.length > 1;
        throw new AstroError({
          ...NoMatchingRenderer,
          message: NoMatchingRenderer.message(
            metadata.displayName,
            metadata?.componentUrl?.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r) => "`" + r + "`"))
          )
        });
      } else {
        throw new AstroError({
          ...NoClientOnlyHint,
          message: NoClientOnlyHint.message(metadata.displayName),
          hint: NoClientOnlyHint.hint(
            probableRendererNames.map((r) => r.replace("@astrojs/", "")).join("|")
          )
        });
      }
    } else if (typeof Component !== "string") {
      const matchingRenderers = validRenderers.filter(
        (r) => probableRendererNames.includes(r.name)
      );
      const plural = validRenderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new AstroError({
          ...NoMatchingRenderer,
          message: NoMatchingRenderer.message(
            metadata.displayName,
            metadata?.componentUrl?.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r) => "`" + r + "`"))
          )
        });
      } else if (matchingRenderers.length === 1) {
        renderer2 = matchingRenderers[0];
        ({ html, attrs } = await renderer2.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          propsWithoutTransitionAttributes,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.
3. If using multiple JSX frameworks at the same time (e.g. React + Preact), pass the correct \`include\`/\`exclude\` options to integrations.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlotToString(result, slots?.fallback);
    } else {
      performance.now();
      ({ html, attrs } = await renderer2.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        propsWithoutTransitionAttributes,
        children,
        metadata
      ));
    }
  }
  if (!html && typeof Component === "string") {
    const Tag = sanitizeElementName(Component);
    const childSlots = Object.values(children).join("");
    const renderTemplateResult = renderTemplate`<${Tag}${internalSpreadAttributes(
      props,
      true,
      Tag
    )}${markHTMLString(
      childSlots === "" && voidElementNames.test(Tag) ? `/>` : `>${childSlots}</${Tag}>`
    )}`;
    html = "";
    const destination = {
      write(chunk) {
        if (chunk instanceof Response) return;
        html += chunkToString(result, chunk);
      }
    };
    await renderTemplateResult.render(destination);
  }
  if (!hydration) {
    return {
      render(destination) {
        if (slotInstructions) {
          for (const instruction of slotInstructions) {
            destination.write(instruction);
          }
        }
        if (isPage || renderer2?.name === "astro:jsx") {
          destination.write(html);
        } else if (html && html.length > 0) {
          destination.write(
            markHTMLString(removeStaticAstroSlot(html, renderer2?.ssr?.supportsAstroStaticSlot))
          );
        }
      }
    };
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props,
      metadata
    )}`
  );
  const island = await generateHydrateScript(
    { renderer: renderer2, result, astroId, props, attrs },
    metadata
  );
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        let tagName = renderer2?.ssr?.supportsAstroStaticSlot ? !!metadata.hydrate ? "astro-slot" : "astro-static-slot" : "astro-slot";
        let expectedHTML = key === "default" ? `<${tagName}>` : `<${tagName} name="${key}">`;
        if (!html.includes(expectedHTML)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${key}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template}`;
  if (island.children) {
    island.props["await-children"] = "";
    island.children += `<!--astro:end-->`;
  }
  return {
    render(destination) {
      if (slotInstructions) {
        for (const instruction of slotInstructions) {
          destination.write(instruction);
        }
      }
      destination.write(createRenderInstruction({ type: "directive", hydration }));
      if (hydration.directive !== "only" && renderer2?.ssr.renderHydrationScript) {
        destination.write(
          createRenderInstruction({
            type: "renderer-hydration-script",
            rendererName: renderer2.name,
            render: renderer2.ssr.renderHydrationScript
          })
        );
      }
      const renderedElement = renderElement$1("astro-island", island, false);
      destination.write(markHTMLString(renderedElement));
    }
  };
}
function sanitizeElementName(tag) {
  const unsafe = /[&<>'"\s]+/;
  if (!unsafe.test(tag)) return tag;
  return tag.trim().split(unsafe)[0].trim();
}
function renderFragmentComponent(result, slots = {}) {
  const slot = slots?.default;
  return {
    render(destination) {
      if (slot == null) return;
      return renderSlot(result, slot).render(destination);
    }
  };
}
async function renderHTMLComponent(result, Component, _props, slots = {}) {
  const { slotInstructions, children } = await renderSlots(result, slots);
  const html = Component({ slots: children });
  const hydrationHtml = slotInstructions ? slotInstructions.map((instr) => chunkToString(result, instr)).join("") : "";
  return {
    render(destination) {
      destination.write(markHTMLString(hydrationHtml + html));
    }
  };
}
function renderAstroComponent(result, displayName, Component, props, slots = {}) {
  if (containsServerDirective(props)) {
    const serverIslandComponent = new ServerIslandComponent(result, props, slots, displayName);
    result._metadata.propagators.add(serverIslandComponent);
    return serverIslandComponent;
  }
  const instance = createAstroComponentInstance(result, displayName, Component, props, slots);
  return {
    render(destination) {
      return instance.render(destination);
    }
  };
}
function renderComponent(result, displayName, Component, props, slots = {}) {
  if (isPromise(Component)) {
    return Component.catch(handleCancellation).then((x) => {
      return renderComponent(result, displayName, x, props, slots);
    });
  }
  if (isFragmentComponent(Component)) {
    return renderFragmentComponent(result, slots);
  }
  props = normalizeProps(props);
  if (isHTMLComponent(Component)) {
    return renderHTMLComponent(result, Component, props, slots).catch(handleCancellation);
  }
  if (isAstroComponentFactory(Component)) {
    return renderAstroComponent(result, displayName, Component, props, slots);
  }
  return renderFrameworkComponent(result, displayName, Component, props, slots).catch(
    handleCancellation
  );
  function handleCancellation(e) {
    if (result.cancelled)
      return {
        render() {
        }
      };
    throw e;
  }
}
function normalizeProps(props) {
  if (props["class:list"] !== void 0) {
    const value = props["class:list"];
    delete props["class:list"];
    props["class"] = clsx(props["class"], value);
    if (props["class"] === "") {
      delete props["class"];
    }
  }
  return props;
}
async function renderComponentToString(result, displayName, Component, props, slots = {}, isPage = false, route) {
  let str = "";
  let renderedFirstPageChunk = false;
  let head = "";
  if (isPage && !result.partial && nonAstroPageNeedsHeadInjection(Component)) {
    head += chunkToString(result, maybeRenderHead());
  }
  try {
    const destination = {
      write(chunk) {
        if (isPage && !result.partial && !renderedFirstPageChunk) {
          renderedFirstPageChunk = true;
          if (!/<!doctype html/i.test(String(chunk))) {
            const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
            str += doctype + head;
          }
        }
        if (chunk instanceof Response) return;
        str += chunkToString(result, chunk);
      }
    };
    const renderInstance = await renderComponent(result, displayName, Component, props, slots);
    if (containsServerDirective(props)) {
      await bufferHeadContent(result);
    }
    await renderInstance.render(destination);
  } catch (e) {
    if (AstroError.is(e) && !e.loc) {
      e.setLocation({
        file: route?.component
      });
    }
    throw e;
  }
  return str;
}
function nonAstroPageNeedsHeadInjection(pageComponent) {
  return !!pageComponent?.[needsHeadRenderingSymbol];
}
const ClientOnlyPlaceholder$1 = "astro-client-only";
const hasTriedRenderComponentSymbol = /* @__PURE__ */ Symbol("hasTriedRenderComponent");
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case typeof vnode === "function":
      return vnode;
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode): {
      const renderedItems = await Promise.all(vnode.map((v) => renderJSX(result, v)));
      let instructions = null;
      let content = "";
      for (const item of renderedItems) {
        if (item instanceof SlotString) {
          content += item;
          instructions = mergeSlotInstructions(instructions, item);
        } else {
          content += item;
        }
      }
      if (instructions) {
        return markHTMLString(new SlotString(content, instructions));
      }
      return markHTMLString(content);
    }
  }
  return renderJSXVNode(result, vnode);
}
async function renderJSXVNode(result, vnode) {
  if (isVNode(vnode)) {
    switch (true) {
      case !vnode.type: {
        throw new Error(`Unable to render ${result.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`);
      }
      case vnode.type === /* @__PURE__ */ Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case isAstroComponentFactory(vnode.type): {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        const str = await renderComponentToString(
          result,
          vnode.type.name,
          vnode.type,
          props,
          slots
        );
        const html = markHTMLString(str);
        return html;
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder$1):
        return markHTMLString(await renderElement(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = function(child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      };
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function") {
        if (vnode.props[hasTriedRenderComponentSymbol]) {
          delete vnode.props[hasTriedRenderComponentSymbol];
          const output2 = await vnode.type(vnode.props ?? {});
          if (output2?.[AstroJSX] || !output2) {
            return await renderJSXVNode(result, output2);
          } else {
            return;
          }
        } else {
          vnode.props[hasTriedRenderComponentSymbol] = true;
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value?.["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0) return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      let output;
      if (vnode.type === ClientOnlyPlaceholder$1 && vnode.props["client:only"]) {
        output = await renderComponentToString(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponentToString(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      return markHTMLString(output);
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children === "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, prerenderElementChildren$1(tag, children))}</${tag}>`
    )}`
  );
}
function prerenderElementChildren$1(tag, children) {
  if (typeof children === "string" && (tag === "style" || tag === "script")) {
    return markHTMLString(children);
  } else {
    return children;
  }
}
const ClientOnlyPlaceholder = "astro-client-only";
function renderJSXToQueue(vnode, result, queue, pool, stack, parent, metadata) {
  if (vnode instanceof HTMLString) {
    const html = vnode.toString();
    if (html.trim() === "") return;
    const node = pool.acquire("html-string", html);
    node.html = html;
    queue.nodes.push(node);
    return;
  }
  if (typeof vnode === "string") {
    const node = pool.acquire("text", vnode);
    node.content = vnode;
    queue.nodes.push(node);
    return;
  }
  if (typeof vnode === "number" || typeof vnode === "boolean") {
    const str = String(vnode);
    const node = pool.acquire("text", str);
    node.content = str;
    queue.nodes.push(node);
    return;
  }
  if (vnode == null || vnode === false) {
    return;
  }
  if (Array.isArray(vnode)) {
    for (let i = vnode.length - 1; i >= 0; i = i - 1) {
      stack.push({ node: vnode[i], parent, metadata });
    }
    return;
  }
  if (!isVNode(vnode)) {
    const str = String(vnode);
    const node = pool.acquire("text", str);
    node.content = str;
    queue.nodes.push(node);
    return;
  }
  handleVNode(vnode, result, queue, pool, stack, parent, metadata);
}
function handleVNode(vnode, result, queue, pool, stack, parent, metadata) {
  if (!vnode.type) {
    throw new Error(
      `Unable to render ${result.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  if (vnode.type === /* @__PURE__ */ Symbol.for("astro:fragment")) {
    stack.push({ node: vnode.props?.children, parent, metadata });
    return;
  }
  if (isAstroComponentFactory(vnode.type)) {
    const factory = vnode.type;
    let props = {};
    let slots = {};
    for (const [key, value] of Object.entries(vnode.props ?? {})) {
      if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
        slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
      } else {
        props[key] = value;
      }
    }
    const displayName = metadata?.displayName || factory.name || "Anonymous";
    const instance = createAstroComponentInstance(result, displayName, factory, props, slots);
    const queueNode = pool.acquire("component");
    queueNode.instance = instance;
    queue.nodes.push(queueNode);
    return;
  }
  if (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder) {
    renderHTMLElement(vnode, result, queue, pool, stack, parent, metadata);
    return;
  }
  if (typeof vnode.type === "function") {
    if (vnode.props?.["server:root"]) {
      const output3 = vnode.type(vnode.props ?? {});
      stack.push({ node: output3, parent, metadata });
      return;
    }
    const output2 = vnode.type(vnode.props ?? {});
    stack.push({ node: output2, parent, metadata });
    return;
  }
  const output = renderJSX(result, vnode);
  stack.push({ node: output, parent, metadata });
}
function renderHTMLElement(vnode, _result, queue, pool, stack, parent, metadata) {
  const tag = vnode.type;
  const { children, ...props } = vnode.props ?? {};
  const attrs = spreadAttributes(props);
  const isVoidElement = (children == null || children === "") && voidElementNames.test(tag);
  if (isVoidElement) {
    const html = `<${tag}${attrs}/>`;
    const node = pool.acquire("html-string", html);
    node.html = html;
    queue.nodes.push(node);
    return;
  }
  const openTag = `<${tag}${attrs}>`;
  const openTagHtml = queue.htmlStringCache ? queue.htmlStringCache.getOrCreate(openTag) : markHTMLString(openTag);
  stack.push({ node: openTagHtml, parent, metadata });
  if (children != null && children !== "") {
    const processedChildren = prerenderElementChildren(tag, children, queue.htmlStringCache);
    stack.push({ node: processedChildren, parent, metadata });
  }
  const closeTag = `</${tag}>`;
  const closeTagHtml = queue.htmlStringCache ? queue.htmlStringCache.getOrCreate(closeTag) : markHTMLString(closeTag);
  stack.push({ node: closeTagHtml, parent, metadata });
}
function prerenderElementChildren(tag, children, htmlStringCache) {
  if (typeof children === "string" && (tag === "style" || tag === "script")) {
    return htmlStringCache ? htmlStringCache.getOrCreate(children) : markHTMLString(children);
  }
  return children;
}
async function buildRenderQueue(root, result, pool) {
  const queue = {
    nodes: [],
    result,
    pool,
    htmlStringCache: result._experimentalQueuedRendering?.htmlStringCache
  };
  const stack = [{ node: root, parent: null }];
  while (stack.length > 0) {
    const item = stack.pop();
    if (!item) {
      continue;
    }
    let { node, parent } = item;
    if (isPromise(node)) {
      try {
        const resolved = await node;
        stack.push({ node: resolved, parent, metadata: item.metadata });
      } catch (error2) {
        throw error2;
      }
      continue;
    }
    if (node == null || node === false) {
      continue;
    }
    if (typeof node === "string") {
      const queueNode = pool.acquire("text", node);
      queueNode.content = node;
      queue.nodes.push(queueNode);
      continue;
    }
    if (typeof node === "number" || typeof node === "boolean") {
      const str = String(node);
      const queueNode = pool.acquire("text", str);
      queueNode.content = str;
      queue.nodes.push(queueNode);
      continue;
    }
    if (isHTMLString(node)) {
      const html = node.toString();
      const queueNode = pool.acquire("html-string", html);
      queueNode.html = html;
      queue.nodes.push(queueNode);
      continue;
    }
    if (node instanceof SlotString) {
      const html = node.toString();
      const queueNode = pool.acquire("html-string", html);
      queueNode.html = html;
      queue.nodes.push(queueNode);
      continue;
    }
    if (isVNode(node)) {
      renderJSXToQueue(node, result, queue, pool, stack, parent, item.metadata);
      continue;
    }
    if (Array.isArray(node)) {
      for (const n of node) {
        stack.push({ node: n, parent, metadata: item.metadata });
      }
      continue;
    }
    if (isRenderInstruction(node)) {
      const queueNode = pool.acquire("instruction");
      queueNode.instruction = node;
      queue.nodes.push(queueNode);
      continue;
    }
    if (isRenderTemplateResult(node)) {
      const htmlParts = node["htmlParts"];
      const expressions = node["expressions"];
      if (htmlParts[0]) {
        const htmlString = queue.htmlStringCache ? queue.htmlStringCache.getOrCreate(htmlParts[0]) : markHTMLString(htmlParts[0]);
        stack.push({
          node: htmlString,
          parent,
          metadata: item.metadata
        });
      }
      for (let i = 0; i < expressions.length; i = i + 1) {
        stack.push({ node: expressions[i], parent, metadata: item.metadata });
        if (htmlParts[i + 1]) {
          const htmlString = queue.htmlStringCache ? queue.htmlStringCache.getOrCreate(htmlParts[i + 1]) : markHTMLString(htmlParts[i + 1]);
          stack.push({
            node: htmlString,
            parent,
            metadata: item.metadata
          });
        }
      }
      continue;
    }
    if (isAstroComponentInstance(node)) {
      const queueNode = pool.acquire("component");
      queueNode.instance = node;
      queue.nodes.push(queueNode);
      continue;
    }
    if (isAstroComponentFactory(node)) {
      const factory = node;
      const props = item.metadata?.props || {};
      const slots = item.metadata?.slots || {};
      const displayName = item.metadata?.displayName || factory.name || "Anonymous";
      const instance = createAstroComponentInstance(result, displayName, factory, props, slots);
      const queueNode = pool.acquire("component");
      queueNode.instance = instance;
      if (isAPropagatingComponent(result, factory)) {
        try {
          const returnValue = await instance.init(result);
          if (isHeadAndContent(returnValue) && returnValue.head) {
            result._metadata.extraHead.push(returnValue.head);
          }
        } catch (error2) {
          throw error2;
        }
      }
      queue.nodes.push(queueNode);
      continue;
    }
    if (isRenderInstance(node)) {
      const queueNode = pool.acquire("component");
      queueNode.instance = node;
      queue.nodes.push(queueNode);
      continue;
    }
    if (typeof node === "object" && Symbol.iterator in node) {
      const items = Array.from(node);
      for (const iterItem of items) {
        stack.push({ node: iterItem, parent, metadata: item.metadata });
      }
      continue;
    }
    if (typeof node === "object" && Symbol.asyncIterator in node) {
      try {
        const items = [];
        for await (const asyncItem of node) {
          items.push(asyncItem);
        }
        for (const iterItem of items) {
          stack.push({ node: iterItem, parent, metadata: item.metadata });
        }
      } catch (error2) {
        throw error2;
      }
      continue;
    }
    if (node instanceof Response) {
      const queueNode = pool.acquire("html-string", "");
      queueNode.html = "";
      queue.nodes.push(queueNode);
      continue;
    }
    if (isHTMLString(node)) {
      const html = String(node);
      const queueNode = pool.acquire("html-string", html);
      queueNode.html = html;
      queue.nodes.push(queueNode);
    } else {
      const str = String(node);
      const queueNode = pool.acquire("text", str);
      queueNode.content = str;
      queue.nodes.push(queueNode);
    }
  }
  queue.nodes.reverse();
  return queue;
}
async function renderQueue(queue, destination) {
  const result = queue.result;
  const pool = queue.pool;
  const cache = queue.htmlStringCache;
  let batchBuffer = "";
  let i = 0;
  while (i < queue.nodes.length) {
    const node = queue.nodes[i];
    try {
      if (canBatch(node)) {
        const batchStart = i;
        while (i < queue.nodes.length && canBatch(queue.nodes[i])) {
          batchBuffer += renderNodeToString(queue.nodes[i]);
          i = i + 1;
        }
        if (batchBuffer) {
          const htmlString = cache ? cache.getOrCreate(batchBuffer) : markHTMLString(batchBuffer);
          destination.write(htmlString);
          batchBuffer = "";
        }
        if (pool) {
          for (let j = batchStart; j < i; j++) {
            pool.release(queue.nodes[j]);
          }
        }
      } else {
        await renderNode(node, destination, result);
        if (pool) {
          pool.release(node);
        }
        i = i + 1;
      }
    } catch (error2) {
      throw error2;
    }
  }
  if (batchBuffer) {
    const htmlString = cache ? cache.getOrCreate(batchBuffer) : markHTMLString(batchBuffer);
    destination.write(htmlString);
  }
}
function canBatch(node) {
  return node.type === "text" || node.type === "html-string";
}
function renderNodeToString(node) {
  switch (node.type) {
    case "text":
      return node.content ? escapeHTML(node.content) : "";
    case "html-string":
      return node.html || "";
    case "component":
    case "instruction": {
      return "";
    }
  }
}
async function renderNode(node, destination, result) {
  const cache = result._experimentalQueuedRendering?.htmlStringCache;
  switch (node.type) {
    case "text": {
      if (node.content) {
        const escaped = escapeHTML(node.content);
        const htmlString = cache ? cache.getOrCreate(escaped) : markHTMLString(escaped);
        destination.write(htmlString);
      }
      break;
    }
    case "html-string": {
      if (node.html) {
        const htmlString = cache ? cache.getOrCreate(node.html) : markHTMLString(node.html);
        destination.write(htmlString);
      }
      break;
    }
    case "instruction": {
      if (node.instruction) {
        destination.write(node.instruction);
      }
      break;
    }
    case "component": {
      if (node.instance) {
        let componentHtml = "";
        const componentDestination = {
          write(chunk) {
            if (chunk instanceof Response) return;
            componentHtml += chunkToString(result, chunk);
          }
        };
        await node.instance.render(componentDestination);
        if (componentHtml) {
          destination.write(componentHtml);
        }
      }
      break;
    }
  }
}
async function renderPage(result, componentFactory, props, children, streaming, route) {
  if (!isAstroComponentFactory(componentFactory)) {
    result._metadata.headInTree = result.componentMetadata.get(componentFactory.moduleId)?.containsHead ?? false;
    const pageProps = { ...props ?? {}, "server:root": true };
    let str;
    if (result._experimentalQueuedRendering && result._experimentalQueuedRendering.enabled) {
      let vnode = await componentFactory(pageProps);
      if (componentFactory["astro:html"] && typeof vnode === "string") {
        vnode = markHTMLString(vnode);
      }
      const queue = await buildRenderQueue(
        vnode,
        result,
        result._experimentalQueuedRendering.pool
      );
      let html = "";
      let renderedFirst = false;
      const destination = {
        write(chunk) {
          if (chunk instanceof Response) return;
          if (!renderedFirst && !result.partial) {
            renderedFirst = true;
            const chunkStr = String(chunk);
            if (!/<!doctype html/i.test(chunkStr)) {
              const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
              html += doctype;
            }
          }
          html += chunkToString(result, chunk);
        }
      };
      await renderQueue(queue, destination);
      str = html;
    } else {
      str = await renderComponentToString(
        result,
        componentFactory.name,
        componentFactory,
        pageProps,
        {},
        true,
        route
      );
    }
    const bytes = encoder.encode(str);
    const headers2 = new Headers([
      ["Content-Type", "text/html"],
      ["Content-Length", bytes.byteLength.toString()]
    ]);
    if (result.shouldInjectCspMetaTags && (result.cspDestination === "header" || result.cspDestination === "adapter")) {
      headers2.set("content-security-policy", renderCspContent(result));
    }
    return new Response(bytes, {
      headers: headers2,
      status: result.response.status
    });
  }
  result._metadata.headInTree = result.componentMetadata.get(componentFactory.moduleId)?.containsHead ?? false;
  let body;
  if (streaming) {
    if (isNode && !isDeno) {
      const nodeBody = await renderToAsyncIterable(
        result,
        componentFactory,
        props,
        children,
        true,
        route
      );
      body = nodeBody;
    } else {
      body = await renderToReadableStream(result, componentFactory, props, children, true, route);
    }
  } else {
    body = await renderToString(result, componentFactory, props, children, true, route);
  }
  if (body instanceof Response) return body;
  const init = result.response;
  const headers = new Headers(init.headers);
  if (result.shouldInjectCspMetaTags && result.cspDestination === "header" || result.cspDestination === "adapter") {
    headers.set("content-security-policy", renderCspContent(result));
  }
  if (!streaming && typeof body === "string") {
    body = encoder.encode(body);
    headers.set("Content-Length", body.byteLength.toString());
  }
  let status = init.status;
  let statusText = init.statusText;
  if (route?.route === "/404") {
    status = 404;
    if (statusText === "OK") {
      statusText = "Not Found";
    }
  } else if (route?.route === "/500") {
    status = 500;
    if (statusText === "OK") {
      statusText = "Internal Server Error";
    }
  }
  if (status) {
    return new Response(body, { ...init, headers, status, statusText });
  } else {
    return new Response(body, { ...init, headers });
  }
}
function spreadAttributes(values = {}, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true, _name);
  }
  return markHTMLString(output);
}
function getPattern(segments, base, addTrailingSlash) {
  const pathname = segments.map((segment) => {
    if (segment.length === 1 && segment[0].spread) {
      return "(?:\\/(.*?))?";
    } else {
      return "\\/" + segment.map((part) => {
        if (part.spread) {
          return "(.*?)";
        } else if (part.dynamic) {
          return "([^/]+?)";
        } else {
          return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }
      }).join("");
    }
  }).join("");
  const trailing = addTrailingSlash && segments.length ? getTrailingSlashPattern(addTrailingSlash) : "$";
  let initial = "\\/";
  if (addTrailingSlash === "never" && base !== "/" && pathname !== "") {
    initial = "";
  }
  return new RegExp(`^${pathname || initial}${trailing}`);
}
function getTrailingSlashPattern(addTrailingSlash) {
  if (addTrailingSlash === "always") {
    return "\\/$";
  }
  if (addTrailingSlash === "never") {
    return "$";
  }
  return "\\/?$";
}
const SERVER_ISLAND_ROUTE = "/_server-islands/[name]";
const SERVER_ISLAND_COMPONENT = "_server-islands.astro";
function badRequest(reason) {
  return new Response(null, {
    status: 400,
    statusText: "Bad request: " + reason
  });
}
const DEFAULT_BODY_SIZE_LIMIT = 1024 * 1024;
async function getRequestData(request, bodySizeLimit = DEFAULT_BODY_SIZE_LIMIT) {
  switch (request.method) {
    case "GET": {
      const url = new URL(request.url);
      const params = url.searchParams;
      if (!params.has("s") || !params.has("e") || !params.has("p")) {
        return badRequest("Missing required query parameters.");
      }
      const encryptedSlots = params.get("s");
      return {
        encryptedComponentExport: params.get("e"),
        encryptedProps: params.get("p"),
        encryptedSlots
      };
    }
    case "POST": {
      try {
        const body = await readBodyWithLimit(request, bodySizeLimit);
        const raw = new TextDecoder().decode(body);
        const data = JSON.parse(raw);
        if (Object.hasOwn(data, "slots") && typeof data.slots === "object") {
          return badRequest("Plaintext slots are not allowed. Slots must be encrypted.");
        }
        if (Object.hasOwn(data, "componentExport") && typeof data.componentExport === "string") {
          return badRequest(
            "Plaintext componentExport is not allowed. componentExport must be encrypted."
          );
        }
        return data;
      } catch (e) {
        if (e instanceof BodySizeLimitError) {
          return new Response(null, {
            status: 413,
            statusText: e.message
          });
        }
        if (e instanceof SyntaxError) {
          return badRequest("Request format is invalid.");
        }
        throw e;
      }
    }
    default: {
      return new Response(null, { status: 405 });
    }
  }
}
function createEndpoint(manifest2) {
  const page = async (result) => {
    const params = result.params;
    if (!params.name) {
      return new Response(null, {
        status: 400,
        statusText: "Bad request"
      });
    }
    const componentId = params.name;
    const data = await getRequestData(result.request, manifest2.serverIslandBodySizeLimit);
    if (data instanceof Response) {
      return data;
    }
    const serverIslandMappings = await manifest2.serverIslandMappings?.();
    const serverIslandMap = await serverIslandMappings?.serverIslandMap;
    let imp = serverIslandMap?.get(componentId);
    if (!imp) {
      return new Response(null, {
        status: 404,
        statusText: "Not found"
      });
    }
    const key = await manifest2.key;
    let componentExport;
    try {
      componentExport = await decryptString(
        key,
        data.encryptedComponentExport,
        `export:${componentId}`
      );
    } catch (_e) {
      return badRequest("Encrypted componentExport value is invalid.");
    }
    const encryptedProps = data.encryptedProps;
    let props = {};
    if (encryptedProps !== "") {
      try {
        const propString = await decryptString(key, encryptedProps, `props:${componentId}`);
        props = JSON.parse(propString);
      } catch (_e) {
        return badRequest("Encrypted props value is invalid.");
      }
    }
    let decryptedSlots = {};
    const encryptedSlots = data.encryptedSlots;
    if (encryptedSlots !== "") {
      try {
        const slotsString = await decryptString(key, encryptedSlots, `slots:${componentId}`);
        decryptedSlots = JSON.parse(slotsString);
      } catch (_e) {
        return badRequest("Encrypted slots value is invalid.");
      }
    }
    const componentModule = await imp();
    let Component = componentModule[componentExport];
    const slots = {};
    for (const prop in decryptedSlots) {
      slots[prop] = createSlotValueFromString(decryptedSlots[prop]);
    }
    result.response.headers.set("X-Robots-Tag", "noindex");
    if (isAstroComponentFactory(Component)) {
      const ServerIsland = Component;
      Component = function(...args) {
        return ServerIsland.apply(this, args);
      };
      Object.assign(Component, ServerIsland);
      Component.propagation = "self";
    }
    return renderTemplate`${renderComponent(result, "Component", Component, props, slots)}`;
  };
  page.isAstroComponentFactory = true;
  const instance = {
    default: page,
    partial: true
  };
  return instance;
}
function createDefaultRoutes(manifest2) {
  const root = new URL(manifest2.rootDir);
  return [
    {
      instance: default404Instance,
      matchesComponent: (filePath) => filePath.href === new URL(DEFAULT_404_COMPONENT, root).href,
      route: DEFAULT_404_ROUTE.route,
      component: DEFAULT_404_COMPONENT
    },
    {
      instance: createEndpoint(manifest2),
      matchesComponent: (filePath) => filePath.href === new URL(SERVER_ISLAND_COMPONENT, root).href,
      route: SERVER_ISLAND_ROUTE,
      component: SERVER_ISLAND_COMPONENT
    }
  ];
}
function ensure404Route(manifest2) {
  if (!manifest2.routes.some((route) => route.route === "/404")) {
    manifest2.routes.push(DEFAULT_404_ROUTE);
  }
  return manifest2;
}
function routeComparator(a, b) {
  const commonLength = Math.min(a.segments.length, b.segments.length);
  for (let index = 0; index < commonLength; index++) {
    const aSegment = a.segments[index];
    const bSegment = b.segments[index];
    const aIsStatic = aSegment.every((part) => !part.dynamic && !part.spread);
    const bIsStatic = bSegment.every((part) => !part.dynamic && !part.spread);
    if (aIsStatic && bIsStatic) {
      const aContent = aSegment.map((part) => part.content).join("");
      const bContent = bSegment.map((part) => part.content).join("");
      if (aContent !== bContent) {
        return aContent.localeCompare(bContent);
      }
    }
    if (aIsStatic !== bIsStatic) {
      return aIsStatic ? -1 : 1;
    }
    const aAllDynamic = aSegment.every((part) => part.dynamic);
    const bAllDynamic = bSegment.every((part) => part.dynamic);
    if (aAllDynamic !== bAllDynamic) {
      return aAllDynamic ? 1 : -1;
    }
    const aHasSpread = aSegment.some((part) => part.spread);
    const bHasSpread = bSegment.some((part) => part.spread);
    if (aHasSpread !== bHasSpread) {
      return aHasSpread ? 1 : -1;
    }
  }
  const aLength = a.segments.length;
  const bLength = b.segments.length;
  if (aLength !== bLength) {
    const aEndsInRest = a.segments.at(-1)?.some((part) => part.spread);
    const bEndsInRest = b.segments.at(-1)?.some((part) => part.spread);
    if (aEndsInRest !== bEndsInRest && Math.abs(aLength - bLength) === 1) {
      if (aLength > bLength && aEndsInRest) {
        return 1;
      }
      if (bLength > aLength && bEndsInRest) {
        return -1;
      }
    }
    return aLength > bLength ? -1 : 1;
  }
  if (a.type === "endpoint" !== (b.type === "endpoint")) {
    return a.type === "endpoint" ? -1 : 1;
  }
  return a.route.localeCompare(b.route);
}
class Router {
  #routes;
  #base;
  #baseWithoutTrailingSlash;
  #buildFormat;
  #trailingSlash;
  constructor(routes, options) {
    this.#routes = [...routes].sort(routeComparator);
    this.#base = normalizeBase(options.base);
    this.#baseWithoutTrailingSlash = removeTrailingForwardSlash(this.#base);
    this.#buildFormat = options.buildFormat;
    this.#trailingSlash = options.trailingSlash;
  }
  /**
   * Match an input pathname against the route list.
   * If allowWithoutBase is true, a non-base-prefixed path is still considered.
   */
  match(inputPathname, { allowWithoutBase = false } = {}) {
    const normalized = getRedirectForPathname(inputPathname);
    if (normalized.redirect) {
      return { type: "redirect", location: normalized.redirect, status: 301 };
    }
    if (this.#base !== "/") {
      const baseWithSlash = `${this.#baseWithoutTrailingSlash}/`;
      if (this.#trailingSlash === "always" && (normalized.pathname === this.#baseWithoutTrailingSlash || normalized.pathname === this.#base)) {
        return { type: "redirect", location: baseWithSlash, status: 301 };
      }
      if (this.#trailingSlash === "never" && normalized.pathname === baseWithSlash) {
        return { type: "redirect", location: this.#baseWithoutTrailingSlash, status: 301 };
      }
    }
    const baseResult = stripBase(
      normalized.pathname,
      this.#base,
      this.#baseWithoutTrailingSlash,
      this.#trailingSlash
    );
    if (!baseResult) {
      if (!allowWithoutBase) {
        return { type: "none", reason: "outside-base" };
      }
    }
    let pathname = baseResult ?? normalized.pathname;
    if (this.#buildFormat === "file") {
      pathname = normalizeFileFormatPathname(pathname);
    }
    const route = this.#routes.find((candidate) => {
      if (candidate.pattern.test(pathname)) return true;
      return candidate.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
    });
    if (!route) {
      return { type: "none", reason: "no-match" };
    }
    const params = getParams(route, pathname);
    return { type: "match", route, params, pathname };
  }
}
function normalizeBase(base) {
  if (!base) return "/";
  if (base === "/") return base;
  return prependForwardSlash(base);
}
function getRedirectForPathname(pathname) {
  let value = prependForwardSlash(pathname);
  if (value.startsWith("//")) {
    const collapsed = `/${value.replace(/^\/+/, "")}`;
    return { pathname: value, redirect: collapsed };
  }
  return { pathname: value };
}
function stripBase(pathname, base, baseWithoutTrailingSlash, trailingSlash) {
  if (base === "/") return pathname;
  const baseWithSlash = `${baseWithoutTrailingSlash}/`;
  if (pathname === baseWithoutTrailingSlash || pathname === base) {
    return trailingSlash === "always" ? null : "/";
  }
  if (pathname === baseWithSlash) {
    return trailingSlash === "never" ? null : "/";
  }
  if (pathname.startsWith(baseWithSlash)) {
    return pathname.slice(baseWithoutTrailingSlash.length);
  }
  return null;
}
function normalizeFileFormatPathname(pathname) {
  if (pathname.endsWith("/index.html")) {
    const trimmed = pathname.slice(0, -"/index.html".length);
    return trimmed === "" ? "/" : trimmed;
  }
  if (pathname.endsWith(".html")) {
    const trimmed = pathname.slice(0, -".html".length);
    return trimmed === "" ? "/" : trimmed;
  }
  return pathname;
}
function deserializeManifest(serializedManifest, routesList) {
  const routes = [];
  if (serializedManifest.routes) {
    for (const serializedRoute of serializedManifest.routes) {
      routes.push({
        ...serializedRoute,
        routeData: deserializeRouteData(serializedRoute.routeData)
      });
      const route = serializedRoute;
      route.routeData = deserializeRouteData(serializedRoute.routeData);
    }
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    rootDir: new URL(serializedManifest.rootDir),
    srcDir: new URL(serializedManifest.srcDir),
    publicDir: new URL(serializedManifest.publicDir),
    outDir: new URL(serializedManifest.outDir),
    cacheDir: new URL(serializedManifest.cacheDir),
    buildClientDir: new URL(serializedManifest.buildClientDir),
    buildServerDir: new URL(serializedManifest.buildServerDir),
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    key
  };
}
function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    // nosemgrep: javascript.lang.security.audit.detect-non-literal-regexp.detect-non-literal-regexp
    // This pattern is serialized from Astro's own route manifest.
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin,
    distURL: rawRouteData.distURL
  };
}
function deserializeRouteInfo(rawRouteInfo) {
  return {
    styles: rawRouteInfo.styles,
    file: rawRouteInfo.file,
    links: rawRouteInfo.links,
    scripts: rawRouteInfo.scripts,
    routeData: deserializeRouteData(rawRouteInfo.routeData)
  };
}
class NodePool {
  textPool = [];
  htmlStringPool = [];
  componentPool = [];
  instructionPool = [];
  maxSize;
  enableStats;
  stats = {
    acquireFromPool: 0,
    acquireNew: 0,
    released: 0,
    releasedDropped: 0
  };
  /**
   * Creates a new object pool for queue nodes.
   *
   * @param maxSize - Maximum number of nodes to keep in the pool (default: 1000).
   *   The cap is shared across all typed sub-pools.
   * @param enableStats - Enable statistics tracking (default: false for performance)
   */
  constructor(maxSize = 1e3, enableStats = false) {
    this.maxSize = maxSize;
    this.enableStats = enableStats;
  }
  /**
   * Acquires a queue node from the pool or creates a new one if the pool is empty.
   * Pops from the type-specific sub-pool to reuse an existing object when available.
   *
   * @param type - The type of queue node to acquire
   * @param content - Optional content to set on the node (for text or html-string types)
   * @returns A queue node ready to be populated with data
   */
  acquire(type, content) {
    const pooledNode = this.popFromTypedPool(type);
    if (pooledNode) {
      if (this.enableStats) {
        this.stats.acquireFromPool = this.stats.acquireFromPool + 1;
      }
      this.resetNodeContent(pooledNode, type, content);
      return pooledNode;
    }
    if (this.enableStats) {
      this.stats.acquireNew = this.stats.acquireNew + 1;
    }
    return this.createNode(type, content);
  }
  /**
   * Creates a new node of the specified type with the given content.
   * Helper method to reduce branching in acquire().
   */
  createNode(type, content = "") {
    switch (type) {
      case "text":
        return { type: "text", content };
      case "html-string":
        return { type: "html-string", html: content };
      case "component":
        return { type: "component", instance: void 0 };
      case "instruction":
        return { type: "instruction", instruction: void 0 };
    }
  }
  /**
   * Pops a node from the type-specific sub-pool.
   * Returns undefined if the sub-pool for the requested type is empty.
   */
  popFromTypedPool(type) {
    switch (type) {
      case "text":
        return this.textPool.pop();
      case "html-string":
        return this.htmlStringPool.pop();
      case "component":
        return this.componentPool.pop();
      case "instruction":
        return this.instructionPool.pop();
    }
  }
  /**
   * Resets the content/value field on a reused pooled node.
   * The type discriminant is already correct since we pop from the matching sub-pool.
   */
  resetNodeContent(node, type, content) {
    switch (type) {
      case "text":
        node.content = content ?? "";
        break;
      case "html-string":
        node.html = content ?? "";
        break;
      case "component":
        node.instance = void 0;
        break;
      case "instruction":
        node.instruction = void 0;
        break;
    }
  }
  /**
   * Returns the total number of nodes across all typed sub-pools.
   */
  totalPoolSize() {
    return this.textPool.length + this.htmlStringPool.length + this.componentPool.length + this.instructionPool.length;
  }
  /**
   * Releases a queue node back to the pool for reuse.
   * If the pool is at max capacity, the node is discarded (will be GC'd).
   *
   * @param node - The node to release back to the pool
   */
  release(node) {
    if (this.totalPoolSize() >= this.maxSize) {
      if (this.enableStats) {
        this.stats.releasedDropped = this.stats.releasedDropped + 1;
      }
      return;
    }
    switch (node.type) {
      case "text":
        node.content = "";
        this.textPool.push(node);
        break;
      case "html-string":
        node.html = "";
        this.htmlStringPool.push(node);
        break;
      case "component":
        node.instance = void 0;
        this.componentPool.push(node);
        break;
      case "instruction":
        node.instruction = void 0;
        this.instructionPool.push(node);
        break;
    }
    if (this.enableStats) {
      this.stats.released = this.stats.released + 1;
    }
  }
  /**
   * Releases all nodes in an array back to the pool.
   * This is a convenience method for releasing multiple nodes at once.
   *
   * @param nodes - Array of nodes to release
   */
  releaseAll(nodes) {
    for (const node of nodes) {
      this.release(node);
    }
  }
  /**
   * Clears all typed sub-pools, discarding all cached nodes.
   * This can be useful if you want to free memory after a large render.
   */
  clear() {
    this.textPool.length = 0;
    this.htmlStringPool.length = 0;
    this.componentPool.length = 0;
    this.instructionPool.length = 0;
  }
  /**
   * Gets the current total number of nodes across all typed sub-pools.
   * Useful for monitoring pool usage and tuning maxSize.
   *
   * @returns Number of nodes currently available in the pool
   */
  size() {
    return this.totalPoolSize();
  }
  /**
   * Gets pool statistics for debugging.
   *
   * @returns Pool usage statistics including computed metrics
   */
  getStats() {
    return {
      ...this.stats,
      poolSize: this.totalPoolSize(),
      maxSize: this.maxSize,
      hitRate: this.stats.acquireFromPool + this.stats.acquireNew > 0 ? this.stats.acquireFromPool / (this.stats.acquireFromPool + this.stats.acquireNew) * 100 : 0
    };
  }
  /**
   * Resets pool statistics.
   */
  resetStats() {
    this.stats = {
      acquireFromPool: 0,
      acquireNew: 0,
      released: 0,
      releasedDropped: 0
    };
  }
}
class HTMLStringCache {
  cache = /* @__PURE__ */ new Map();
  maxSize;
  constructor(maxSize = 1e3) {
    this.maxSize = maxSize;
    this.warm(COMMON_HTML_PATTERNS);
  }
  /**
   * Get or create an HTMLString for the given content.
   * If cached, the existing object is returned and moved to end (most recently used).
   * If not cached, a new HTMLString is created, cached, and returned.
   *
   * @param content - The HTML string content
   * @returns HTMLString object (cached or newly created)
   */
  getOrCreate(content) {
    const cached = this.cache.get(content);
    if (cached) {
      this.cache.delete(content);
      this.cache.set(content, cached);
      return cached;
    }
    const htmlString = new HTMLString(content);
    this.cache.set(content, htmlString);
    if (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== void 0) {
        this.cache.delete(firstKey);
      }
    }
    return htmlString;
  }
  /**
   * Get current cache size
   */
  size() {
    return this.cache.size;
  }
  /**
   * Pre-warms the cache with common HTML patterns.
   * This ensures first-render cache hits for frequently used tags.
   *
   * @param patterns - Array of HTML strings to pre-cache
   */
  warm(patterns) {
    for (const pattern of patterns) {
      if (!this.cache.has(pattern)) {
        this.cache.set(pattern, new HTMLString(pattern));
      }
    }
  }
  /**
   * Clear the entire cache
   */
  clear() {
    this.cache.clear();
  }
}
const COMMON_HTML_PATTERNS = [
  // Structural elements
  "<div>",
  "</div>",
  "<span>",
  "</span>",
  "<p>",
  "</p>",
  "<section>",
  "</section>",
  "<article>",
  "</article>",
  "<header>",
  "</header>",
  "<footer>",
  "</footer>",
  "<nav>",
  "</nav>",
  "<main>",
  "</main>",
  "<aside>",
  "</aside>",
  // List elements
  "<ul>",
  "</ul>",
  "<ol>",
  "</ol>",
  "<li>",
  "</li>",
  // Void/self-closing elements
  "<br>",
  "<hr>",
  "<br/>",
  "<hr/>",
  // Heading elements
  "<h1>",
  "</h1>",
  "<h2>",
  "</h2>",
  "<h3>",
  "</h3>",
  "<h4>",
  "</h4>",
  // Inline elements
  "<a>",
  "</a>",
  "<strong>",
  "</strong>",
  "<em>",
  "</em>",
  "<code>",
  "</code>",
  // Common whitespace
  " ",
  "\n"
];
const FORBIDDEN_PATH_KEYS = /* @__PURE__ */ new Set(["__proto__", "constructor", "prototype"]);
const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.destination;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
function error(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(s.bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return s.red(prefix.join(" "));
  }
  if (level === "warn") {
    return s.yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return s.dim(prefix[0]);
  }
  return s.dim(prefix[0]) + " " + s.blue(prefix.splice(1).join(" "));
}
class AstroLogger {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  setDestination(destination) {
    this.options.destination = destination;
  }
  /**
   * It calls the `close` function of the provided destination, if it exists.
   */
  close() {
    if (this.options.destination.close) {
      this.options.destination.close();
    }
  }
  /**
   * It calls the `flush` function of the provided destinatin, if it exists.
   */
  flush() {
    if (this.options.destination.flush) {
      this.options.destination.flush();
    }
  }
}
class AstroIntegrationLogger {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
  /**
   * It calls the `flush` function of the provided destination, if it exists.
   */
  flush() {
    if (this.options.destination.flush) {
      this.options.destination.flush();
    }
  }
  /**
   * It calls the `close` function of the provided destination, if it exists.
   */
  close() {
    if (this.options.destination.close) {
      this.options.destination.close();
    }
  }
}
function matchesLevel(messageLevel, configuredLevel) {
  return levels[messageLevel] >= levels[configuredLevel];
}
function nodeLogDestination(config = {}) {
  const { level = "info" } = config;
  return {
    write(event) {
      let dest = process.stderr;
      if (levels[event.level] < levels["error"]) {
        dest = process.stdout;
      }
      if (!matchesLevel(event.level, level)) {
        return;
      }
      let trailingLine = event.newLine ? "\n" : "";
      if (event.label === "SKIP_FORMAT") {
        dest.write(event.message + trailingLine);
      } else {
        dest.write(getEventPrefix(event) + " " + event.message + trailingLine);
      }
    }
  };
}
function node_default(options) {
  return nodeLogDestination(options);
}
function consoleLogDestination(config = {}) {
  const { level = "info" } = config;
  return {
    write(event) {
      let dest = console.error;
      if (levels[event.level] < levels["error"]) {
        dest = console.info;
      }
      if (!matchesLevel(event.level, level)) {
        return;
      }
      if (event.label === "SKIP_FORMAT") {
        dest(event.message);
      } else {
        dest(getEventPrefix(event) + " " + event.message);
      }
    }
  };
}
function createConsoleLogger({ level }) {
  return new AstroLogger({
    level,
    destination: consoleLogDestination()
  });
}
function console_default(options) {
  return consoleLogDestination(options);
}
const SGR_REGEX = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, "g");
function jsonLoggerDestination(config = {}) {
  const { pretty = false, level = "info" } = config;
  return {
    write(event) {
      let dest = process.stderr;
      if (levels[event.level] < levels["error"]) {
        dest = process.stdout;
      }
      if (!matchesLevel(event.level, level)) {
        return;
      }
      let trailingLine = event.newLine ? "\n" : "";
      const message = event.message.replace(SGR_REGEX, "");
      if (pretty) {
        dest.write(
          JSON.stringify({ message, label: event.label, level: event.level }, null, 2) + trailingLine
        );
      } else {
        dest.write(
          JSON.stringify({ message, label: event.label, level: event.level }) + trailingLine
        );
      }
    }
  };
}
function compose(destinations) {
  return {
    write(chunk) {
      for (const logger of destinations) {
        logger.write(chunk);
      }
    },
    flush() {
      for (const logger of destinations) {
        if (logger.flush) {
          logger.flush();
        }
      }
    },
    close() {
      for (const logger of destinations) {
        if (logger.close) {
          logger.close();
        }
      }
    }
  };
}
async function loadLogger(config, level = "info") {
  let cause = void 0;
  try {
    switch (config.entrypoint) {
      case "astro/logger/node": {
        return new AstroLogger({
          destination: node_default(config.config),
          level
        });
      }
      case "astro/logger/console": {
        return new AstroLogger({
          destination: console_default(config.config),
          level
        });
      }
      case "astro/logger/json": {
        return new AstroLogger({
          destination: jsonLoggerDestination(config.config),
          level
        });
      }
      case "astro/logger/compose": {
        let destinations = [];
        if (config.config?.loggers) {
          const loggers = config.config?.loggers;
          destinations = await Promise.all(
            loggers.map(async (loggerConfig) => {
              const logger = await import(
                /* @vite-ignore */
                loggerConfig.entrypoint
              );
              return logger.default(loggerConfig.config);
            })
          );
        }
        return new AstroLogger({
          destination: compose(destinations),
          level
        });
      }
      default: {
        const nodeLogger = await import(
          /* @vite-ignore */
          config.entrypoint
        );
        return new AstroLogger({
          destination: nodeLogger.default(config.config),
          level
        });
      }
    }
  } catch (e) {
    if (e instanceof Error) {
      cause = e;
    }
  }
  const error2 = new AstroError({
    ...UnableToLoadLogger,
    message: UnableToLoadLogger.message(config.entrypoint)
  });
  if (cause) {
    error2.cause = cause;
  }
  throw error2;
}
const PipelineFeatures = {
  redirects: 1 << 0,
  sessions: 1 << 1,
  actions: 1 << 2,
  middleware: 1 << 3,
  i18n: 1 << 4,
  cache: 1 << 5
};
class Pipeline {
  internalMiddleware;
  resolvedMiddleware = void 0;
  resolvedLogger = false;
  resolvedActions = void 0;
  resolvedSessionDriver = void 0;
  resolvedCacheProvider = void 0;
  compiledCacheRoutes = void 0;
  nodePool;
  htmlStringCache;
  /**
   * Bit mask of pipeline features activated by handler classes.
   * Each handler sets its bit via `|=`. Only meaningful when a
   * custom `src/app.ts` fetch handler is in use.
   */
  usedFeatures = 0;
  logger;
  manifest;
  /**
   * "development" or "production" only
   */
  runtimeMode;
  renderers;
  resolve;
  streaming;
  /**
   * Used to provide better error messages for `Astro.clientAddress`
   */
  adapterName;
  clientDirectives;
  inlinedScripts;
  compressHTML;
  i18n;
  middleware;
  routeCache;
  /**
   * Used for `Astro.site`.
   */
  site;
  /**
   * Array of built-in, internal, routes.
   * Used to find the route module
   */
  defaultRoutes;
  actions;
  sessionDriver;
  cacheProvider;
  cacheConfig;
  serverIslands;
  /** Route data derived from the manifest, used for route matching. */
  manifestData;
  /** Pattern-matching router built from manifestData. */
  #router;
  constructor(logger, manifest2, runtimeMode, renderers2, resolve, streaming, adapterName = manifest2.adapterName, clientDirectives = manifest2.clientDirectives, inlinedScripts = manifest2.inlinedScripts, compressHTML = manifest2.compressHTML, i18n = manifest2.i18n, middleware = manifest2.middleware, routeCache = new RouteCache(logger, runtimeMode), site = manifest2.site ? new URL(manifest2.site) : void 0, defaultRoutes = createDefaultRoutes(manifest2), actions = manifest2.actions, sessionDriver = manifest2.sessionDriver, cacheProvider = manifest2.cacheProvider, cacheConfig = manifest2.cacheConfig, serverIslands = manifest2.serverIslandMappings) {
    this.logger = logger;
    this.manifest = manifest2;
    this.runtimeMode = runtimeMode;
    this.renderers = renderers2;
    this.resolve = resolve;
    this.streaming = streaming;
    this.adapterName = adapterName;
    this.clientDirectives = clientDirectives;
    this.inlinedScripts = inlinedScripts;
    this.compressHTML = compressHTML;
    this.i18n = i18n;
    this.middleware = middleware;
    this.routeCache = routeCache;
    this.site = site;
    this.defaultRoutes = defaultRoutes;
    this.actions = actions;
    this.sessionDriver = sessionDriver;
    this.cacheProvider = cacheProvider;
    this.cacheConfig = cacheConfig;
    this.serverIslands = serverIslands;
    this.manifestData = { routes: (manifest2.routes ?? []).map((route) => route.routeData) };
    ensure404Route(this.manifestData);
    this.#router = new Router(this.manifestData.routes, {
      base: manifest2.base,
      trailingSlash: manifest2.trailingSlash,
      buildFormat: manifest2.buildFormat
    });
    this.internalMiddleware = [];
    if (manifest2.experimentalQueuedRendering.enabled) {
      this.nodePool = this.createNodePool(
        manifest2.experimentalQueuedRendering.poolSize ?? 1e3,
        false
      );
      if (manifest2.experimentalQueuedRendering.contentCache) {
        this.htmlStringCache = this.createStringCache();
      }
    }
  }
  /**
   * Low-level route matching against the manifest routes. Returns the
   * matched `RouteData` or `undefined`. Does not filter prerendered
   * routes or check public assets — use `BaseApp.match()` for that.
   */
  matchRoute(pathname) {
    const match = this.#router.match(pathname, { allowWithoutBase: true });
    if (match.type !== "match") return void 0;
    return match.route;
  }
  /**
   * Rebuilds the internal router after routes have been added or
   * removed (e.g. by the dev server on HMR).
   */
  rebuildRouter() {
    this.#router = new Router(this.manifestData.routes, {
      base: this.manifest.base,
      trailingSlash: this.manifest.trailingSlash,
      buildFormat: this.manifest.buildFormat
    });
  }
  /**
   * Resolves the middleware from the manifest, and returns the `onRequest` function. If `onRequest` isn't there,
   * it returns a no-op function
   */
  async getMiddleware() {
    if (this.resolvedMiddleware) {
      return this.resolvedMiddleware;
    }
    if (this.middleware) {
      const middlewareInstance = await this.middleware();
      const onRequest = middlewareInstance.onRequest ?? NOOP_MIDDLEWARE_FN;
      const internalMiddlewares = [onRequest];
      if (this.manifest.checkOrigin) {
        internalMiddlewares.unshift(createOriginCheckMiddleware());
      }
      this.resolvedMiddleware = sequence(...internalMiddlewares);
      return this.resolvedMiddleware;
    } else {
      this.resolvedMiddleware = NOOP_MIDDLEWARE_FN;
      return this.resolvedMiddleware;
    }
  }
  /**
   * Clears the cached middleware so it is re-resolved on the next request.
   * Called via HMR when middleware files change during development.
   */
  clearMiddleware() {
    this.resolvedMiddleware = void 0;
  }
  /**
   * Resolves the logger destination from the manifest and updates the pipeline logger.
   * If the user configured `experimental.logger`, the bundled logger factory is loaded
   * and replaces the default console destination. This is lazy and only resolves once.
   */
  async getLogger() {
    if (this.resolvedLogger) {
      return this.logger;
    }
    this.resolvedLogger = true;
    if (this.manifest.experimentalLogger) {
      this.logger = await loadLogger(this.manifest.experimentalLogger);
    }
    return this.logger;
  }
  async getActions() {
    if (this.resolvedActions) {
      return this.resolvedActions;
    } else if (this.actions) {
      return this.actions();
    }
    return NOOP_ACTIONS_MOD;
  }
  async getSessionDriver() {
    if (this.resolvedSessionDriver !== void 0) {
      return this.resolvedSessionDriver;
    }
    if (this.sessionDriver) {
      const driverModule = await this.sessionDriver();
      this.resolvedSessionDriver = driverModule?.default || null;
      return this.resolvedSessionDriver;
    }
    this.resolvedSessionDriver = null;
    return null;
  }
  async getCacheProvider() {
    if (this.resolvedCacheProvider !== void 0) {
      return this.resolvedCacheProvider;
    }
    if (this.cacheProvider) {
      const mod = await this.cacheProvider();
      const factory = mod?.default || null;
      this.resolvedCacheProvider = factory ? factory(this.cacheConfig?.options) : null;
      return this.resolvedCacheProvider;
    }
    this.resolvedCacheProvider = null;
    return null;
  }
  async getServerIslands() {
    if (this.serverIslands) {
      return this.serverIslands();
    }
    return {
      serverIslandMap: /* @__PURE__ */ new Map(),
      serverIslandNameMap: /* @__PURE__ */ new Map()
    };
  }
  async getAction(path) {
    const pathKeys = path.split(".").map((key) => decodeURIComponent(key));
    let { server } = await this.getActions();
    if (!server || !(typeof server === "object")) {
      throw new TypeError(
        `Expected \`server\` export in actions file to be an object. Received ${typeof server}.`
      );
    }
    for (const key of pathKeys) {
      if (FORBIDDEN_PATH_KEYS.has(key)) {
        throw new AstroError({
          ...ActionNotFoundError,
          message: ActionNotFoundError.message(pathKeys.join("."))
        });
      }
      if (!Object.hasOwn(server, key)) {
        throw new AstroError({
          ...ActionNotFoundError,
          message: ActionNotFoundError.message(pathKeys.join("."))
        });
      }
      server = server[key];
    }
    if (typeof server !== "function") {
      throw new TypeError(
        `Expected handler for action ${pathKeys.join(".")} to be a function. Received ${typeof server}.`
      );
    }
    return server;
  }
  async getModuleForRoute(route) {
    for (const defaultRoute of this.defaultRoutes) {
      if (route.component === defaultRoute.component) {
        return {
          page: () => Promise.resolve(defaultRoute.instance)
        };
      }
    }
    if (route.type === "redirect") {
      return RedirectSinglePageBuiltModule;
    } else {
      if (this.manifest.pageMap) {
        const importComponentInstance = this.manifest.pageMap.get(route.component);
        if (!importComponentInstance) {
          throw new Error(
            `Unexpectedly unable to find a component instance for route ${route.route}`
          );
        }
        return await importComponentInstance();
      } else if (this.manifest.pageModule) {
        return this.manifest.pageModule;
      }
      throw new Error(
        "Astro couldn't find the correct page to render, probably because it wasn't correctly mapped for SSR usage. This is an internal error, please file an issue."
      );
    }
  }
  createNodePool(poolSize, stats) {
    return new NodePool(poolSize, stats);
  }
  createStringCache() {
    return new HTMLStringCache(1e3);
  }
}
function getFunctionExpression(slot) {
  if (!slot) return;
  const expressions = slot?.expressions?.filter(
    (e) => isRenderInstruction(e) === false || isRenderTemplateResult(e)
  );
  if (expressions?.length !== 1) return;
  const expression = expressions[0];
  if (isRenderTemplateResult(expression)) {
    return getFunctionExpression(expression);
  }
  return expression;
}
class Slots {
  #result;
  #slots;
  #logger;
  constructor(result, slots, logger) {
    this.#result = result;
    this.#slots = slots;
    this.#logger = logger;
    if (slots) {
      for (const key of Object.keys(slots)) {
        if (this[key] !== void 0) {
          throw new AstroError({
            ...ReservedSlotName,
            message: ReservedSlotName.message(key)
          });
        }
        Object.defineProperty(this, key, {
          get() {
            return true;
          },
          enumerable: true
        });
      }
    }
  }
  has(name) {
    if (!this.#slots) return false;
    return Boolean(this.#slots[name]);
  }
  async render(name, args = []) {
    if (!this.#slots || !this.has(name)) return;
    const result = this.#result;
    if (!Array.isArray(args)) {
      this.#logger.warn(
        null,
        `Expected second parameter to be an array, received a ${typeof args}. If you're trying to pass an array as a single argument and getting unexpected results, make sure you're passing your array as an item of an array. Ex: Astro.slots.render('default', [["Hello", "World"]])`
      );
    } else if (args.length > 0) {
      const slotValue = this.#slots[name];
      const component = typeof slotValue === "function" ? await slotValue(result) : await slotValue;
      const expression = getFunctionExpression(component);
      if (expression) {
        const slot = async () => typeof expression === "function" ? expression(...args) : expression;
        return await renderSlotToString(result, slot).then((res) => {
          return res;
        });
      }
      if (typeof component === "function") {
        return await renderJSX(result, component(...args)).then(
          (res) => res != null ? String(res) : res
        );
      }
    }
    const content = await renderSlotToString(result, this.#slots[name]);
    const outHTML = chunkToString(result, content);
    return outHTML;
  }
}
function deduplicateDirectiveValues(existingDirective, newDirective) {
  const [directiveName, ...existingValues] = existingDirective.split(/\s+/).filter(Boolean);
  const [newDirectiveName, ...newValues] = newDirective.split(/\s+/).filter(Boolean);
  if (directiveName !== newDirectiveName) {
    return void 0;
  }
  const finalDirectives = Array.from(/* @__PURE__ */ new Set([...existingValues, ...newValues]));
  return `${directiveName} ${finalDirectives.join(" ")}`;
}
function pushDirective(directives, newDirective) {
  if (directives.length === 0) {
    return [newDirective];
  }
  const finalDirectives = [];
  let matched = false;
  for (const directive of directives) {
    if (matched) {
      finalDirectives.push(directive);
      continue;
    }
    const result = deduplicateDirectiveValues(directive, newDirective);
    if (result) {
      finalDirectives.push(result);
      matched = true;
    } else {
      finalDirectives.push(directive);
    }
  }
  if (!matched) {
    finalDirectives.push(newDirective);
  }
  return finalDirectives;
}
function computeFallbackRoute(options) {
  const {
    pathname,
    responseStatus,
    fallback,
    fallbackType,
    locales,
    defaultLocale,
    strategy,
    base
  } = options;
  if (responseStatus !== 404) {
    return { type: "none" };
  }
  if (!fallback || Object.keys(fallback).length === 0) {
    return { type: "none" };
  }
  const segments = pathname.split("/");
  const urlLocale = segments.find((segment) => {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (locale === segment) {
          return true;
        }
      } else if (locale.path === segment) {
        return true;
      }
    }
    return false;
  });
  if (!urlLocale) {
    return { type: "none" };
  }
  const fallbackKeys = Object.keys(fallback);
  if (!fallbackKeys.includes(urlLocale)) {
    return { type: "none" };
  }
  const fallbackLocale = fallback[urlLocale];
  const pathFallbackLocale = getPathByLocale(fallbackLocale, locales);
  let newPathname;
  if (pathFallbackLocale === defaultLocale && strategy === "pathname-prefix-other-locales") {
    if (pathname.includes(`${base}`)) {
      newPathname = pathname.replace(`/${urlLocale}`, ``);
    } else {
      newPathname = pathname.replace(`/${urlLocale}`, `/`);
    }
  } else {
    newPathname = pathname.replace(`/${urlLocale}`, `/${pathFallbackLocale}`);
  }
  return {
    type: fallbackType,
    pathname: newPathname
  };
}
class I18nRouter {
  #strategy;
  #defaultLocale;
  #locales;
  #base;
  #domains;
  constructor(options) {
    this.#strategy = options.strategy;
    this.#defaultLocale = options.defaultLocale;
    this.#locales = options.locales;
    this.#base = options.base === "/" ? "/" : removeTrailingForwardSlash(options.base || "");
    this.#domains = options.domains;
  }
  /**
   * Evaluate routing strategy for a pathname.
   * Returns decision object (not HTTP Response).
   */
  match(pathname, context) {
    if (this.shouldSkipProcessing(pathname, context)) {
      return { type: "continue" };
    }
    switch (this.#strategy) {
      case "manual":
        return { type: "continue" };
      case "pathname-prefix-always":
        return this.matchPrefixAlways(pathname, context);
      case "domains-prefix-always":
        if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) {
          return { type: "continue" };
        }
        return this.matchPrefixAlways(pathname, context);
      case "pathname-prefix-other-locales":
        return this.matchPrefixOtherLocales(pathname, context);
      case "domains-prefix-other-locales":
        if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) {
          return { type: "continue" };
        }
        return this.matchPrefixOtherLocales(pathname, context);
      case "pathname-prefix-always-no-redirect":
        return this.matchPrefixAlwaysNoRedirect(pathname, context);
      case "domains-prefix-always-no-redirect":
        if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) {
          return { type: "continue" };
        }
        return this.matchPrefixAlwaysNoRedirect(pathname, context);
      default:
        return { type: "continue" };
    }
  }
  /**
   * Check if i18n processing should be skipped for this request
   */
  shouldSkipProcessing(pathname, context) {
    if (pathname.includes("/404") || pathname.includes("/500")) {
      return true;
    }
    if (pathname.includes("/_server-islands/")) {
      return true;
    }
    if (context.isReroute) {
      return true;
    }
    if (context.routeType && context.routeType !== "page" && context.routeType !== "fallback") {
      return true;
    }
    return false;
  }
  /**
   * Strategy: pathname-prefix-always
   * All locales must have a prefix, including the default locale.
   */
  matchPrefixAlways(pathname, _context) {
    const isRoot = pathname === this.#base + "/" || pathname === this.#base;
    if (isRoot) {
      const basePrefix = this.#base === "/" ? "" : this.#base;
      return {
        type: "redirect",
        location: `${basePrefix}/${this.#defaultLocale}`
      };
    }
    if (!pathHasLocale(pathname, this.#locales)) {
      return { type: "notFound" };
    }
    return { type: "continue" };
  }
  /**
   * Strategy: pathname-prefix-other-locales
   * Default locale has no prefix, other locales must have a prefix.
   */
  matchPrefixOtherLocales(pathname, _context) {
    let pathnameContainsDefaultLocale = false;
    for (const segment of pathname.split("/")) {
      if (normalizeTheLocale(segment) === normalizeTheLocale(this.#defaultLocale)) {
        pathnameContainsDefaultLocale = true;
        break;
      }
    }
    if (pathnameContainsDefaultLocale) {
      const newLocation = pathname.replace(`/${this.#defaultLocale}`, "");
      return {
        type: "notFound",
        location: newLocation
      };
    }
    return { type: "continue" };
  }
  /**
   * Strategy: pathname-prefix-always-no-redirect
   * Like prefix-always but allows root to serve instead of redirecting
   */
  matchPrefixAlwaysNoRedirect(pathname, _context) {
    const isRoot = pathname === this.#base + "/" || pathname === this.#base;
    if (isRoot) {
      return { type: "continue" };
    }
    if (!pathHasLocale(pathname, this.#locales)) {
      return { type: "notFound" };
    }
    return { type: "continue" };
  }
  /**
   * Check if the current locale doesn't belong to the configured domain.
   * Used for domain-based routing strategies.
   */
  localeHasntDomain(currentLocale, currentDomain) {
    if (!this.#domains || !currentDomain) {
      return false;
    }
    if (!currentLocale) {
      return false;
    }
    const localesForDomain = this.#domains[currentDomain];
    if (!localesForDomain) {
      return true;
    }
    return !localesForDomain.includes(currentLocale);
  }
}
class I18n {
  #i18n;
  #base;
  #trailingSlash;
  #format;
  #router;
  constructor(i18n, base, trailingSlash, format) {
    this.#i18n = i18n;
    this.#base = base;
    this.#trailingSlash = trailingSlash;
    this.#format = format;
    this.#router = new I18nRouter({
      strategy: i18n.strategy,
      defaultLocale: i18n.defaultLocale,
      locales: i18n.locales,
      base,
      domains: i18n.domainLookupTable ? Object.keys(i18n.domainLookupTable).reduce(
        (acc, domain) => {
          const locale = i18n.domainLookupTable[domain];
          if (!acc[domain]) {
            acc[domain] = [];
          }
          acc[domain].push(locale);
          return acc;
        },
        {}
      ) : void 0
    });
  }
  async finalize(state, response) {
    state.pipeline.usedFeatures |= PipelineFeatures.i18n;
    const i18n = this.#i18n;
    const typeHeader = response.headers.get(ROUTE_TYPE_HEADER);
    const isReroute = response.headers.get(REROUTE_DIRECTIVE_HEADER);
    if (isReroute === "no" && typeof i18n.fallback === "undefined") {
      return response;
    }
    if (typeHeader !== "page" && typeHeader !== "fallback") {
      return response;
    }
    const url = new URL(state.request.url);
    const currentLocale = state.computeCurrentLocale();
    const isPrerendered = state.routeData.prerender;
    const routerContext = {
      currentLocale,
      currentDomain: url.hostname,
      routeType: typeHeader,
      isReroute: isReroute === "yes"
    };
    const routeDecision = this.#router.match(url.pathname, routerContext);
    switch (routeDecision.type) {
      case "redirect": {
        let location = routeDecision.location;
        if (shouldAppendForwardSlash(this.#trailingSlash, this.#format)) {
          location = appendForwardSlash(location);
        }
        return new Response(null, {
          status: routeDecision.status ?? 302,
          headers: { Location: location }
        });
      }
      case "notFound": {
        if (isPrerendered) {
          const prerenderedRes = new Response(response.body, {
            status: 404,
            headers: response.headers
          });
          prerenderedRes.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
          if (routeDecision.location) {
            prerenderedRes.headers.set("Location", routeDecision.location);
          }
          return prerenderedRes;
        }
        const headers = new Headers();
        if (routeDecision.location) {
          headers.set("Location", routeDecision.location);
        }
        return new Response(null, { status: 404, headers });
      }
    }
    if (i18n.fallback && i18n.fallbackType) {
      const effectiveStatus = typeHeader === "fallback" ? 404 : response.status;
      const fallbackDecision = computeFallbackRoute({
        pathname: url.pathname,
        responseStatus: effectiveStatus,
        fallback: i18n.fallback,
        fallbackType: i18n.fallbackType,
        locales: i18n.locales,
        defaultLocale: i18n.defaultLocale,
        strategy: i18n.strategy,
        base: this.#base
      });
      switch (fallbackDecision.type) {
        case "redirect":
          return new Response(null, {
            status: 302,
            headers: { Location: fallbackDecision.pathname + url.search }
          });
        case "rewrite":
          return await state.rewrite(fallbackDecision.pathname + url.search);
      }
    }
    return response;
  }
}
function pathHasLocale(path, locales) {
  const segments = path.split("/").map(normalizeThePath);
  for (const segment of segments) {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (normalizeTheLocale(segment) === normalizeTheLocale(locale)) {
          return true;
        }
      } else if (segment === locale.path) {
        return true;
      }
    }
  }
  return false;
}
function getPathByLocale(locale, locales) {
  for (const loopLocale of locales) {
    if (typeof loopLocale === "string") {
      if (loopLocale === locale) {
        return loopLocale;
      }
    } else {
      for (const code of loopLocale.codes) {
        if (code === locale) {
          return loopLocale.path;
        }
      }
    }
  }
  throw new AstroError(i18nNoLocaleFoundInPath);
}
function normalizeTheLocale(locale) {
  return locale.replaceAll("_", "-").toLowerCase();
}
function normalizeThePath(path) {
  return path.endsWith(".html") ? path.slice(0, -5) : path;
}
function getAllCodes(locales) {
  const result = [];
  for (const loopLocale of locales) {
    if (typeof loopLocale === "string") {
      result.push(loopLocale);
    } else {
      result.push(...loopLocale.codes);
    }
  }
  return result;
}
function parseLocale(header) {
  if (header === "*") {
    return [{ locale: header, qualityValue: void 0 }];
  }
  const result = [];
  const localeValues = header.split(",").map((str) => str.trim());
  for (const localeValue of localeValues) {
    const split = localeValue.split(";").map((str) => str.trim());
    const localeName = split[0];
    const qualityValue = split[1];
    if (!split) {
      continue;
    }
    if (qualityValue && qualityValue.startsWith("q=")) {
      const qualityValueAsFloat = Number.parseFloat(qualityValue.slice("q=".length));
      if (Number.isNaN(qualityValueAsFloat) || qualityValueAsFloat > 1) {
        result.push({
          locale: localeName,
          qualityValue: void 0
        });
      } else {
        result.push({
          locale: localeName,
          qualityValue: qualityValueAsFloat
        });
      }
    } else {
      result.push({
        locale: localeName,
        qualityValue: void 0
      });
    }
  }
  return result;
}
function sortAndFilterLocales(browserLocaleList, locales) {
  const normalizedLocales = getAllCodes(locales).map(normalizeTheLocale);
  return browserLocaleList.filter((browserLocale) => {
    if (browserLocale.locale !== "*") {
      return normalizedLocales.includes(normalizeTheLocale(browserLocale.locale));
    }
    return true;
  }).sort((a, b) => {
    if (a.qualityValue && b.qualityValue) {
      return Math.sign(b.qualityValue - a.qualityValue);
    }
    return 0;
  });
}
function computePreferredLocale(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = void 0;
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    const firstResult = browserLocaleList.at(0);
    if (firstResult && firstResult.locale !== "*") {
      outer: for (const currentLocale of locales) {
        if (typeof currentLocale === "string") {
          if (normalizeTheLocale(currentLocale) === normalizeTheLocale(firstResult.locale)) {
            result = currentLocale;
            break;
          }
        } else {
          for (const currentCode of currentLocale.codes) {
            if (normalizeTheLocale(currentCode) === normalizeTheLocale(firstResult.locale)) {
              result = currentCode;
              break outer;
            }
          }
        }
      }
    }
  }
  return result;
}
function computePreferredLocaleList(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = [];
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    if (browserLocaleList.length === 1 && browserLocaleList.at(0).locale === "*") {
      return getAllCodes(locales);
    } else if (browserLocaleList.length > 0) {
      for (const browserLocale of browserLocaleList) {
        for (const loopLocale of locales) {
          if (typeof loopLocale === "string") {
            if (normalizeTheLocale(loopLocale) === normalizeTheLocale(browserLocale.locale)) {
              result.push(loopLocale);
            }
          } else {
            for (const code of loopLocale.codes) {
              if (code === browserLocale.locale) {
                result.push(code);
              }
            }
          }
        }
      }
    }
  }
  return result;
}
function computeCurrentLocale(pathname, locales, defaultLocale) {
  for (const segment of pathname.split("/").map(normalizeThePath)) {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (!segment.includes(locale)) continue;
        if (normalizeTheLocale(locale) === normalizeTheLocale(segment)) {
          return locale;
        }
      } else {
        if (locale.path === segment) {
          return locale.codes.at(0);
        } else {
          for (const code of locale.codes) {
            if (normalizeTheLocale(code) === normalizeTheLocale(segment)) {
              return code;
            }
          }
        }
      }
    }
  }
  for (const locale of locales) {
    if (typeof locale === "string") {
      if (locale === defaultLocale) {
        return locale;
      }
    } else {
      if (locale.path === defaultLocale) {
        return locale.codes.at(0);
      }
    }
  }
}
function computeCurrentLocaleFromParams(params, locales) {
  const byNormalizedCode = /* @__PURE__ */ new Map();
  const byPath = /* @__PURE__ */ new Map();
  for (const locale of locales) {
    if (typeof locale === "string") {
      byNormalizedCode.set(normalizeTheLocale(locale), locale);
    } else {
      byPath.set(locale.path, locale.codes[0]);
      for (const code of locale.codes) {
        byNormalizedCode.set(normalizeTheLocale(code), code);
      }
    }
  }
  for (const value of Object.values(params)) {
    if (!value) continue;
    const pathMatch = byPath.get(value);
    if (pathMatch) return pathMatch;
    const codeMatch = byNormalizedCode.get(normalizeTheLocale(value));
    if (codeMatch) return codeMatch;
  }
}
async function callMiddleware(onRequest, apiContext, responseFunction) {
  let nextCalled = false;
  let responseFunctionPromise = void 0;
  const next = async (payload) => {
    nextCalled = true;
    responseFunctionPromise = responseFunction(apiContext, payload);
    return responseFunctionPromise;
  };
  const middlewarePromise = onRequest(apiContext, next);
  return await Promise.resolve(middlewarePromise).then(async (value) => {
    if (nextCalled) {
      if (typeof value !== "undefined") {
        if (value instanceof Response === false) {
          throw new AstroError(MiddlewareNotAResponse);
        }
        return value;
      } else {
        if (responseFunctionPromise) {
          return responseFunctionPromise;
        } else {
          throw new AstroError(MiddlewareNotAResponse);
        }
      }
    } else if (typeof value === "undefined") {
      throw new AstroError(MiddlewareNoDataOrNextCalled);
    } else if (value instanceof Response === false) {
      throw new AstroError(MiddlewareNotAResponse);
    } else {
      return value;
    }
  });
}
const EMPTY_OPTIONS = Object.freeze({ tags: [] });
class NoopAstroCache {
  enabled = false;
  set() {
  }
  get tags() {
    return [];
  }
  get options() {
    return EMPTY_OPTIONS;
  }
  async invalidate() {
  }
}
let hasWarned = false;
class DisabledAstroCache {
  enabled = false;
  #logger;
  constructor(logger) {
    this.#logger = logger;
  }
  #warn() {
    if (!hasWarned) {
      hasWarned = true;
      this.#logger?.warn(
        "cache",
        "`cache.set()` was called but caching is not enabled. Configure a cache provider in your Astro config under `experimental.cache` to enable caching."
      );
    }
  }
  set() {
    this.#warn();
  }
  get tags() {
    return [];
  }
  get options() {
    return EMPTY_OPTIONS;
  }
  async invalidate() {
    throw new AstroError(CacheNotEnabled);
  }
}
class AstroMiddleware {
  #pipeline;
  constructor(pipeline) {
    this.#pipeline = pipeline;
  }
  async handle(state, renderRouteCallback) {
    state.pipeline.usedFeatures |= PipelineFeatures.middleware;
    const pipeline = this.#pipeline;
    await state.getProps();
    const apiContext = state.getAPIContext();
    state.counter++;
    if (state.counter === 4) {
      return new Response("Loop Detected", {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/508
        status: 508,
        statusText: "Astro detected a loop where you tried to call the rewriting logic more than four times."
      });
    }
    const next = async (ctx, payload) => {
      if (payload) {
        pipeline.logger.debug("router", "Called rewriting to:", payload);
        const result = await pipeline.tryRewrite(payload, state.request);
        applyRewriteToState(state, payload, result);
      }
      return renderRouteCallback(state, ctx);
    };
    let response;
    if (state.skipMiddleware) {
      response = await next(apiContext);
    } else {
      const pipelineMiddleware = await pipeline.getMiddleware();
      const composed = sequence(...pipeline.internalMiddleware, pipelineMiddleware);
      response = await callMiddleware(composed, apiContext, next);
    }
    return this.#finalize(state, response);
  }
  #finalize(state, response) {
    if (response.headers.get(ROUTE_TYPE_HEADER)) {
      response.headers.delete(ROUTE_TYPE_HEADER);
    }
    attachCookiesToResponse(response, state.cookies);
    return response;
  }
}
const EMPTY_SLOTS = Object.freeze({});
class PagesHandler {
  #pipeline;
  constructor(pipeline) {
    this.#pipeline = pipeline;
  }
  async handle(state, ctx) {
    const pipeline = this.#pipeline;
    const { logger, streaming } = pipeline;
    let response;
    const componentInstance = await state.loadComponentInstance();
    switch (state.routeData.type) {
      case "endpoint": {
        response = await renderEndpoint(
          componentInstance,
          ctx,
          state.routeData.prerender,
          logger
        );
        break;
      }
      case "page": {
        const props = await state.getProps();
        const actionApiContext = state.getActionAPIContext();
        const result = await state.createResult(componentInstance, actionApiContext);
        try {
          response = await renderPage(
            result,
            componentInstance?.default,
            props,
            state.slots ?? EMPTY_SLOTS,
            streaming,
            state.routeData
          );
        } catch (e) {
          result.cancelled = true;
          throw e;
        }
        response.headers.set(ROUTE_TYPE_HEADER, "page");
        if (state.routeData.route === "/404" || state.routeData.route === "/500") {
          response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
        }
        if (state.isRewriting) {
          response.headers.set(REWRITE_DIRECTIVE_HEADER_KEY, REWRITE_DIRECTIVE_HEADER_VALUE);
        }
        break;
      }
      case "redirect": {
        return new Response(null, { status: 404, headers: { [ASTRO_ERROR_HEADER]: "true" } });
      }
      case "fallback": {
        return new Response(null, { status: 500, headers: { [ROUTE_TYPE_HEADER]: "fallback" } });
      }
    }
    const responseCookies = getCookiesFromResponse(response);
    if (responseCookies) {
      state.cookies.merge(responseCookies);
    }
    return response;
  }
}
function validateAndDecodePathname(pathname) {
  let decoded;
  try {
    decoded = decodeURI(pathname);
  } catch (_e) {
    throw new Error("Invalid URL encoding");
  }
  const hasDecoding = decoded !== pathname;
  const decodedStillHasEncoding = /%[0-9a-fA-F]{2}/.test(decoded);
  if (hasDecoding && decodedStillHasEncoding) {
    throw new Error("Multi-level URL encoding is not allowed");
  }
  return decoded;
}
function createNormalizedUrl(requestUrl) {
  return normalizeUrl(new URL(requestUrl));
}
function normalizeUrl(url) {
  try {
    url.pathname = validateAndDecodePathname(url.pathname);
  } catch {
    try {
      url.pathname = decodeURI(url.pathname);
    } catch {
    }
  }
  url.pathname = collapseDuplicateSlashes(url.pathname);
  return url;
}
function applyRewriteToState(state, payload, { routeData, componentInstance, newUrl, pathname }, { mergeCookies = false } = {}) {
  const pipeline = state.pipeline;
  const oldPathname = state.pathname;
  const isI18nFallback = routeData.fallbackRoutes && routeData.fallbackRoutes.length > 0;
  if (pipeline.manifest.serverLike && !state.routeData.prerender && routeData.prerender && !isI18nFallback) {
    throw new AstroError({
      ...ForbiddenRewrite,
      message: ForbiddenRewrite.message(state.pathname, pathname, routeData.component),
      hint: ForbiddenRewrite.hint(routeData.component)
    });
  }
  state.routeData = routeData;
  state.componentInstance = componentInstance;
  if (payload instanceof Request) {
    state.request = payload;
  } else {
    state.request = copyRequest(
      newUrl,
      state.request,
      routeData.prerender,
      pipeline.logger,
      state.routeData.route
    );
  }
  state.url = createNormalizedUrl(state.request.url);
  if (mergeCookies) {
    const newCookies = new AstroCookies(state.request);
    if (state.cookies) {
      newCookies.merge(state.cookies);
    }
    state.cookies = newCookies;
  }
  state.params = getParams(routeData, pathname);
  state.pathname = pathname;
  state.isRewriting = true;
  state.status = 200;
  setOriginPathname(
    state.request,
    oldPathname,
    pipeline.manifest.trailingSlash,
    pipeline.manifest.buildFormat
  );
  state.invalidateContexts();
}
class Rewrites {
  async execute(state, payload) {
    const pipeline = state.pipeline;
    pipeline.logger.debug("router", "Calling rewrite: ", payload);
    const result = await pipeline.tryRewrite(payload, state.request);
    applyRewriteToState(state, payload, result, { mergeCookies: true });
    const middleware = new AstroMiddleware(pipeline);
    const pagesHandler = new PagesHandler(pipeline);
    return middleware.handle(state, pagesHandler.handle.bind(pagesHandler));
  }
}
function matchRoute(pathname, manifest2) {
  if (isRoute404(pathname)) {
    const errorRoute = manifest2.routes.find((route) => isRoute404(route.route));
    if (errorRoute) return errorRoute;
  }
  if (isRoute500(pathname)) {
    const errorRoute = manifest2.routes.find((route) => isRoute500(route.route));
    if (errorRoute) return errorRoute;
  }
  return manifest2.routes.find((route) => {
    return route.pattern.test(pathname) || route.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
  });
}
function isRoute404or500(route) {
  return isRoute404(route.route) || isRoute500(route.route);
}
function isRouteServerIsland(route) {
  return route.component === SERVER_ISLAND_COMPONENT;
}
const renderOptionsSymbol = /* @__PURE__ */ Symbol.for("astro.renderOptions");
function getRenderOptions(request) {
  return Reflect.get(request, renderOptionsSymbol);
}
function setRenderOptions(request, options) {
  Reflect.set(request, renderOptionsSymbol, options);
}
class FetchState {
  pipeline;
  /**
   * The request to render. Mutated during rewrites so subsequent renders
   * see the rewritten URL.
   */
  request;
  routeData;
  /**
   * The pathname to use for routing and rendering. Starts out as the raw,
   * base-stripped, decoded pathname from the request. May be further
   * normalized by `AstroHandler` after routeData is known (in dev, when
   * the matched route has no `.html` extension, `.html` / `/index.html`
   * suffixes are stripped).
   */
  pathname;
  /** Resolved render options (addCookieHeader, clientAddress, locals, etc.). */
  renderOptions;
  /** When the request started, used to log duration. */
  timeStart;
  /**
   * The route's loaded component module. Set before middleware runs; may
   * be swapped during in-flight rewrites from inside the middleware chain.
   */
  componentInstance;
  /**
   * Slot overrides supplied by the container API. `undefined` for HTTP
   * requests — `PagesHandler` coalesces to `{}` on read so we don't
   * allocate an empty object per request.
   */
  slots;
  /**
   * Default HTTP status for the rendered response. Callers override
   * before rendering runs (e.g. `AstroHandler` sets this from
   * `BaseApp.getDefaultStatusCode`; error handlers set `404` / `500`).
   */
  status = 200;
  /** Whether user middleware should be skipped for this request. */
  skipMiddleware = false;
  /** A flag that tells the render content if the rewriting was triggered. */
  isRewriting = false;
  /** A safety net in case of loops (rewrite counter). */
  counter = 0;
  /** Cookies for this request. Created lazily on first access. */
  cookies;
  /** Route params derived from routeData + pathname. Computed lazily. */
  #params;
  get params() {
    if (!this.#params && this.routeData) {
      this.#params = getParams(this.routeData, this.pathname);
    }
    return this.#params;
  }
  set params(value) {
    this.#params = value;
  }
  /** Normalized URL for this request. */
  url;
  /** Client address for this request. */
  clientAddress;
  /** Whether this is a partial render (container API). */
  partial;
  /** Whether to inject CSP meta tags. */
  shouldInjectCspMetaTags;
  /** Request-scoped locals object, shared with user middleware. */
  locals = {};
  /**
   * Memoized `props` (see `getProps`). `null` means "not yet computed"
   * — using `null` (rather than `undefined`) keeps the hidden class
   * stable and distinct from a valid-but-empty result.
   */
  props = null;
  /** Memoized `ActionAPIContext` (see `getActionAPIContext`). */
  actionApiContext = null;
  /** Memoized `APIContext` (see `getAPIContext`). */
  apiContext = null;
  /** Registered context providers keyed by name. Lazy-initialized on first provide(). */
  #providers;
  /** Cached values from resolved providers. Lazy-initialized on first resolve(). */
  #providersResolvedValues;
  /** Cached promise for lazy component instance loading. */
  #componentInstancePromise;
  /** SSR result for the current page render. */
  result;
  /** Initial props (from container/error handler). */
  initialProps = {};
  /** Rewrites handler instance. Lazy-initialized on first rewrite(). */
  #rewrites;
  /** Memoized Astro page partial. */
  #astroPagePartial;
  /** Memoized current locale. */
  #currentLocale;
  /** Memoized preferred locale. */
  #preferredLocale;
  /** Memoized preferred locale list. */
  #preferredLocaleList;
  constructor(pipeline, request, options) {
    this.pipeline = pipeline;
    this.request = request;
    options ??= getRenderOptions(request);
    this.routeData = options?.routeData;
    this.renderOptions = options ?? {
      addCookieHeader: false,
      clientAddress: void 0,
      locals: void 0,
      prerenderedErrorPageFetch: fetch,
      routeData: void 0,
      waitUntil: void 0
    };
    this.componentInstance = void 0;
    this.slots = void 0;
    const url = new URL(request.url);
    this.pathname = this.#computePathname(url);
    this.timeStart = performance.now();
    this.clientAddress = options?.clientAddress;
    this.locals = options?.locals ?? {};
    this.url = normalizeUrl(url);
    this.cookies = new AstroCookies(request);
    if (!Reflect.get(request, originPathnameSymbol)) {
      setOriginPathname(
        request,
        this.pathname,
        pipeline.manifest.trailingSlash,
        pipeline.manifest.buildFormat
      );
    }
    this.#resolveRouteData();
  }
  /**
   * Triggers a rewrite. Delegates to the Rewrites handler.
   */
  rewrite(payload) {
    return (this.#rewrites ??= new Rewrites()).execute(this, payload);
  }
  /**
   * Creates the SSR result for the current page render.
   */
  async createResult(mod, ctx) {
    const pipeline = this.pipeline;
    const { clientDirectives, inlinedScripts, compressHTML, manifest: manifest2, renderers: renderers2, resolve } = pipeline;
    const routeData = this.routeData;
    const { links, scripts, styles } = await pipeline.headElements(routeData);
    const extraStyleHashes = [];
    const extraScriptHashes = [];
    const shouldInjectCspMetaTags = this.shouldInjectCspMetaTags ?? manifest2.shouldInjectCspMetaTags;
    const cspAlgorithm = manifest2.csp?.algorithm ?? "SHA-256";
    if (shouldInjectCspMetaTags) {
      for (const style of styles) {
        extraStyleHashes.push(await generateCspDigest(style.children, cspAlgorithm));
      }
      for (const script of scripts) {
        extraScriptHashes.push(await generateCspDigest(script.children, cspAlgorithm));
      }
    }
    const componentMetadata = await pipeline.componentMetadata(routeData) ?? manifest2.componentMetadata;
    const headers = new Headers({ "Content-Type": "text/html" });
    const partial = typeof this.partial === "boolean" ? this.partial : Boolean(mod.partial);
    const actionResult = hasActionPayload(this.locals) ? deserializeActionResult(this.locals._actionPayload.actionResult) : void 0;
    const status = this.status;
    const response = {
      status: actionResult?.error ? actionResult?.error.status : status,
      statusText: actionResult?.error ? actionResult?.error.type : "OK",
      get headers() {
        return headers;
      },
      set headers(_) {
        throw new AstroError(AstroResponseHeadersReassigned);
      }
    };
    const state = this;
    const result = {
      base: manifest2.base,
      userAssetsBase: manifest2.userAssetsBase,
      cancelled: false,
      clientDirectives,
      inlinedScripts,
      componentMetadata,
      compressHTML,
      cookies: this.cookies,
      createAstro: (props, slots) => state.createAstro(result, props, slots, ctx),
      links,
      // SAFETY: createResult is only called after route resolution, so routeData
      // is always set and the params getter always returns a value.
      params: this.params,
      partial,
      pathname: this.pathname,
      renderers: renderers2,
      resolve,
      response,
      request: this.request,
      scripts,
      styles,
      actionResult,
      async getServerIslandNameMap() {
        const serverIslands = await pipeline.getServerIslands();
        return serverIslands.serverIslandNameMap ?? /* @__PURE__ */ new Map();
      },
      key: manifest2.key,
      trailingSlash: manifest2.trailingSlash,
      _experimentalQueuedRendering: {
        pool: pipeline.nodePool,
        htmlStringCache: pipeline.htmlStringCache,
        enabled: manifest2.experimentalQueuedRendering?.enabled,
        poolSize: manifest2.experimentalQueuedRendering?.poolSize,
        contentCache: manifest2.experimentalQueuedRendering?.contentCache
      },
      _metadata: {
        hasHydrationScript: false,
        rendererSpecificHydrationScripts: /* @__PURE__ */ new Set(),
        hasRenderedHead: false,
        renderedScripts: /* @__PURE__ */ new Set(),
        hasDirectives: /* @__PURE__ */ new Set(),
        hasRenderedServerIslandRuntime: false,
        headInTree: false,
        extraHead: [],
        extraStyleHashes,
        extraScriptHashes,
        propagators: /* @__PURE__ */ new Set(),
        templateDepth: 0
      },
      cspDestination: manifest2.csp?.cspDestination ?? (routeData.prerender ? "meta" : "header"),
      shouldInjectCspMetaTags,
      cspAlgorithm,
      scriptHashes: manifest2.csp?.scriptHashes ? [...manifest2.csp.scriptHashes] : [],
      scriptResources: manifest2.csp?.scriptResources ? [...manifest2.csp.scriptResources] : [],
      styleHashes: manifest2.csp?.styleHashes ? [...manifest2.csp.styleHashes] : [],
      styleResources: manifest2.csp?.styleResources ? [...manifest2.csp.styleResources] : [],
      directives: manifest2.csp?.directives ? [...manifest2.csp.directives] : [],
      isStrictDynamic: manifest2.csp?.isStrictDynamic ?? false,
      internalFetchHeaders: manifest2.internalFetchHeaders
    };
    this.result = result;
    return result;
  }
  /**
   * Creates the Astro global object for a component render.
   */
  createAstro(result, props, slotValues, apiContext) {
    let astroPagePartial;
    if (this.isRewriting) {
      this.#astroPagePartial = this.createAstroPagePartial(result, apiContext);
    }
    this.#astroPagePartial ??= this.createAstroPagePartial(result, apiContext);
    astroPagePartial = this.#astroPagePartial;
    const astroComponentPartial = { props, self: null };
    const Astro = Object.assign(
      Object.create(astroPagePartial),
      astroComponentPartial
    );
    let _slots;
    Object.defineProperty(Astro, "slots", {
      get: () => {
        if (!_slots) {
          _slots = new Slots(
            result,
            slotValues,
            this.pipeline.logger
          );
        }
        return _slots;
      }
    });
    return Astro;
  }
  /**
   * Creates the Astro page-level partial (prototype for Astro global).
   */
  createAstroPagePartial(result, apiContext) {
    const state = this;
    const { cookies, locals, params, pipeline, url } = this;
    const { response } = result;
    const redirect = (path, status = 302) => {
      if (state.request[responseSentSymbol$1]) {
        throw new AstroError({
          ...ResponseSentError
        });
      }
      return new Response(null, { status, headers: { Location: path } });
    };
    const rewrite = async (reroutePayload) => {
      return await state.rewrite(reroutePayload);
    };
    const callAction = createCallAction(apiContext);
    const partial = {
      generator: ASTRO_GENERATOR,
      routePattern: this.routeData.route,
      isPrerendered: this.routeData.prerender,
      cookies,
      get clientAddress() {
        return state.getClientAddress();
      },
      get currentLocale() {
        return state.computeCurrentLocale();
      },
      params,
      get preferredLocale() {
        return state.computePreferredLocale();
      },
      get preferredLocaleList() {
        return state.computePreferredLocaleList();
      },
      locals,
      redirect,
      rewrite,
      request: this.request,
      response,
      site: pipeline.site,
      getActionResult: createGetActionResult(locals),
      get callAction() {
        return callAction;
      },
      url,
      get originPathname() {
        return getOriginPathname(state.request);
      },
      get csp() {
        return state.getCsp();
      },
      get logger() {
        return {
          info(msg) {
            pipeline.logger.info(null, msg);
          },
          warn(msg) {
            pipeline.logger.warn(null, msg);
          },
          error(msg) {
            pipeline.logger.error(null, msg);
          }
        };
      }
    };
    this.defineProviderGetters(partial);
    return partial;
  }
  getClientAddress() {
    const { pipeline, clientAddress } = this;
    const routeData = this.routeData;
    if (routeData.prerender) {
      throw new AstroError({
        ...PrerenderClientAddressNotAvailable,
        message: PrerenderClientAddressNotAvailable.message(routeData.component)
      });
    }
    if (clientAddress) {
      return clientAddress;
    }
    if (pipeline.adapterName) {
      throw new AstroError({
        ...ClientAddressNotAvailable,
        message: ClientAddressNotAvailable.message(pipeline.adapterName)
      });
    }
    throw new AstroError(StaticClientAddressNotAvailable);
  }
  getCookies() {
    return this.cookies;
  }
  getCsp() {
    const state = this;
    const { pipeline } = this;
    if (!pipeline.manifest.csp) {
      if (pipeline.runtimeMode === "production") {
        pipeline.logger.warn(
          "csp",
          `context.csp was used when rendering the route ${s.green(state.routeData.route)}, but CSP was not configured. For more information, see https://docs.astro.build/en/reference/configuration-reference/#securitycsp`
        );
      }
      return void 0;
    }
    return {
      insertDirective(payload) {
        if (state?.result?.directives) {
          state.result.directives = pushDirective(state.result.directives, payload);
        } else {
          state?.result?.directives.push(payload);
        }
      },
      insertScriptResource(resource) {
        state.result?.scriptResources.push(resource);
      },
      insertStyleResource(resource) {
        state.result?.styleResources.push(resource);
      },
      insertStyleHash(hash) {
        state.result?.styleHashes.push(hash);
      },
      insertScriptHash(hash) {
        state.result?.scriptHashes.push(hash);
      }
    };
  }
  computeCurrentLocale() {
    const {
      url,
      pipeline: { i18n },
      routeData
    } = this;
    if (!i18n || !routeData) return;
    const { defaultLocale, locales, strategy } = i18n;
    const fallbackTo = strategy === "pathname-prefix-other-locales" || strategy === "domains-prefix-other-locales" ? defaultLocale : void 0;
    if (this.#currentLocale) {
      return this.#currentLocale;
    }
    let computedLocale;
    if (isRouteServerIsland(routeData)) {
      let referer = this.request.headers.get("referer");
      if (referer) {
        if (URL.canParse(referer)) {
          referer = new URL(referer).pathname;
        }
        computedLocale = computeCurrentLocale(referer, locales, defaultLocale);
      }
    } else {
      let pathname = routeData.pathname;
      if (url && !routeData.pattern.test(url.pathname)) {
        for (const fallbackRoute of routeData.fallbackRoutes) {
          if (fallbackRoute.pattern.test(url.pathname)) {
            pathname = fallbackRoute.pathname;
            break;
          }
        }
      }
      pathname = pathname && !isRoute404or500(routeData) ? pathname : url.pathname ?? this.pathname;
      computedLocale = computeCurrentLocale(pathname, locales, defaultLocale);
      if (routeData.params.length > 0) {
        const localeFromParams = computeCurrentLocaleFromParams(this.params, locales);
        if (localeFromParams) {
          computedLocale = localeFromParams;
        }
      }
    }
    this.#currentLocale = computedLocale ?? fallbackTo;
    return this.#currentLocale;
  }
  computePreferredLocale() {
    const {
      pipeline: { i18n },
      request
    } = this;
    if (!i18n) return;
    return this.#preferredLocale ??= computePreferredLocale(request, i18n.locales);
  }
  computePreferredLocaleList() {
    const {
      pipeline: { i18n },
      request
    } = this;
    if (!i18n) return;
    return this.#preferredLocaleList ??= computePreferredLocaleList(request, i18n.locales);
  }
  /**
   * Lazily loads the route's component module. Returns the cached
   * instance if already loaded. The promise is cached so concurrent
   * callers share the same load.
   */
  async loadComponentInstance() {
    if (this.componentInstance) return this.componentInstance;
    if (this.#componentInstancePromise) return this.#componentInstancePromise;
    this.#componentInstancePromise = this.pipeline.getComponentByRoute(this.routeData).then((mod) => {
      this.componentInstance = mod;
      return mod;
    });
    return this.#componentInstancePromise;
  }
  /**
   * Registers a context provider under the given key. Handlers call
   * this to contribute values to the request context (e.g. sessions).
   * The `create` factory is called lazily on the first `resolve(key)`.
   */
  provide(key, provider) {
    (this.#providers ??= /* @__PURE__ */ new Map()).set(key, provider);
  }
  /**
   * Lazily resolves a provider registered under `key`. Calls
   * `provider.create()` on first access and caches the result.
   * Returns `undefined` if no provider was registered for the key.
   */
  resolve(key) {
    if (this.#providersResolvedValues?.has(key)) {
      return this.#providersResolvedValues.get(key);
    }
    const provider = this.#providers?.get(key);
    if (!provider) return void 0;
    const value = provider.create();
    (this.#providersResolvedValues ??= /* @__PURE__ */ new Map()).set(key, value);
    return value;
  }
  /**
   * Runs all registered `finalize` callbacks. Should be called after
   * the response is produced, typically in a `finally` block.
   *
   * Returns synchronously (no promise allocation) when nothing needs
   * finalizing — important for the hot path where sessions are not used.
   */
  finalizeAll() {
    if (!this.#providersResolvedValues || this.#providersResolvedValues.size === 0) return;
    let chain;
    for (const [key, provider] of this.#providers) {
      if (provider.finalize && this.#providersResolvedValues.has(key)) {
        const result = provider.finalize(this.#providersResolvedValues.get(key));
        if (result) {
          chain = chain ? chain.then(() => result) : result;
        }
      }
    }
    return chain;
  }
  /**
   * Adds lazy getters to `target` for each registered provider key.
   * Used by context creation (APIContext, Astro global) so that
   * provider values like `session` and `cache` appear as properties
   * without hard-coding the keys.
   */
  defineProviderGetters(target) {
    if (!this.#providers) return;
    const state = this;
    for (const key of this.#providers.keys()) {
      Object.defineProperty(target, key, {
        get: () => state.resolve(key),
        enumerable: true,
        configurable: true
      });
    }
  }
  /**
   * Resolves the route to use for this request and stores it on
   * `this.routeData`. If the adapter (or the dev server) provided a
   * `routeData` via render options it's already set and this is a
   * no-op. Otherwise we use the app's synchronous route matcher and
   * fall back to a `404.astro` route so middleware can still run.
   *
   * Called eagerly from the constructor so individual handlers
   * (actions, pages, middleware, etc.) always see a resolved route
   * without the caller needing an extra setup step.
   *
   * Once routeData is known, finalizes `this.pathname`: in dev, if the
   * matched route has no `.html` extension, strip `.html` / `/index.html`
   * suffixes so the rendering pipeline sees the canonical pathname.
   */
  /**
   * Strip `.html` / `/index.html` suffixes from the pathname so the
   * rendering pipeline sees the canonical route path. Skipped when the
   * matched route itself has an `.html` extension in its definition.
   */
  #stripHtmlExtension() {
    if (this.routeData && !routeHasHtmlExtension(this.routeData)) {
      this.pathname = this.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
    }
  }
  #resolveRouteData() {
    const pipeline = this.pipeline;
    if (this.routeData) {
      this.#stripHtmlExtension();
      return;
    }
    const matched = pipeline.matchRoute(this.pathname);
    if (matched && matched.prerender && pipeline.manifest.serverLike) {
      this.routeData = void 0;
    } else {
      this.routeData = matched;
    }
    pipeline.logger.debug("router", "Astro matched the following route for " + this.request.url);
    pipeline.logger.debug("router", "RouteData:\n" + this.routeData);
    if (!this.routeData) {
      this.routeData = pipeline.manifestData.routes.find(
        (route) => route.component === "404.astro" || route.component === DEFAULT_404_COMPONENT
      );
    }
    if (!this.routeData) {
      pipeline.logger.debug("router", "Astro hasn't found routes that match " + this.request.url);
      pipeline.logger.debug("router", "Here's the available routes:\n", pipeline.manifestData);
      return;
    }
    this.#stripHtmlExtension();
  }
  /**
   * Strips the pipeline's base from the request URL, prepends a forward
   * slash, and decodes the pathname. Falls back to the raw (not decoded)
   * pathname if `decodeURI` throws.
   *
   * Mirrors `BaseApp.removeBase`, including the
   * `collapseDuplicateLeadingSlashes` fix that prevents middleware
   * authorization bypass when the URL starts with `//`.
   */
  #computePathname(url) {
    let pathname = collapseDuplicateLeadingSlashes(url.pathname);
    const base = this.pipeline.manifest.base;
    if (pathname.startsWith(base)) {
      const baseWithoutTrailingSlash = removeTrailingForwardSlash(base);
      pathname = pathname.slice(baseWithoutTrailingSlash.length + 1);
    }
    pathname = prependForwardSlash(pathname);
    try {
      return decodeURI(pathname);
    } catch (e) {
      this.pipeline.logger.error(null, e.toString());
      return pathname;
    }
  }
  /**
   * Returns the resolved `props` for this render, computing them lazily
   * from the route + component module on first access. If the
   * `initialProps` already carries user-supplied props (e.g. the
   * container API) those are used verbatim.
   */
  async getProps() {
    if (this.props !== null) return this.props;
    if (Object.keys(this.initialProps).length > 0) {
      this.props = this.initialProps;
      return this.props;
    }
    const pipeline = this.pipeline;
    const mod = await this.loadComponentInstance();
    this.props = await getProps({
      mod,
      routeData: this.routeData,
      routeCache: pipeline.routeCache,
      pathname: this.pathname,
      logger: pipeline.logger,
      serverLike: pipeline.manifest.serverLike,
      base: pipeline.manifest.base,
      trailingSlash: pipeline.manifest.trailingSlash
    });
    return this.props;
  }
  /**
   * Returns the `ActionAPIContext` for this render, creating it lazily.
   * Used by middleware, actions, and page dispatch.
   */
  getActionAPIContext() {
    if (this.actionApiContext !== null) return this.actionApiContext;
    const state = this;
    const ctx = {
      get cookies() {
        return state.cookies;
      },
      routePattern: this.routeData.route,
      isPrerendered: this.routeData.prerender,
      get clientAddress() {
        return state.getClientAddress();
      },
      get currentLocale() {
        return state.computeCurrentLocale();
      },
      generator: ASTRO_GENERATOR,
      get locals() {
        return state.locals;
      },
      set locals(_) {
        throw new AstroError(LocalsReassigned);
      },
      // SAFETY: getActionAPIContext is only called after route resolution,
      // so routeData is always set and the params getter always returns a value.
      params: this.params,
      get preferredLocale() {
        return state.computePreferredLocale();
      },
      get preferredLocaleList() {
        return state.computePreferredLocaleList();
      },
      request: this.request,
      site: this.pipeline.site,
      url: this.url,
      get originPathname() {
        return getOriginPathname(state.request);
      },
      get csp() {
        return state.getCsp();
      },
      get logger() {
        if (!state.pipeline.manifest.experimentalLogger) {
          state.pipeline.logger.warn(
            null,
            "The Astro.logger is available only when experimental.logger is defined."
          );
          return void 0;
        }
        return {
          info(msg) {
            state.pipeline.logger.info(null, msg);
          },
          warn(msg) {
            state.pipeline.logger.warn(null, msg);
          },
          error(msg) {
            state.pipeline.logger.error(null, msg);
          }
        };
      }
    };
    this.defineProviderGetters(ctx);
    this.actionApiContext = ctx;
    return this.actionApiContext;
  }
  /**
   * Returns the `APIContext` for this render, creating it lazily from
   * the memoized props + action context.
   *
   * Callers must ensure `getProps()` has resolved at least once before
   * calling this.
   */
  getAPIContext() {
    if (this.apiContext !== null) return this.apiContext;
    const actionApiContext = this.getActionAPIContext();
    const state = this;
    const redirect = (path, status = 302) => new Response(null, { status, headers: { Location: path } });
    const rewrite = async (reroutePayload) => {
      return await state.rewrite(reroutePayload);
    };
    Reflect.set(actionApiContext, pipelineSymbol, this.pipeline);
    actionApiContext[fetchStateSymbol] = this;
    this.apiContext = Object.assign(actionApiContext, {
      props: this.props,
      redirect,
      rewrite,
      getActionResult: createGetActionResult(actionApiContext.locals),
      callAction: createCallAction(actionApiContext)
    });
    return this.apiContext;
  }
  /**
   * Invalidates the cached `APIContext` so the next `getAPIContext()`
   * call re-derives it from the (possibly mutated) state. Used
   * after an in-flight rewrite swaps the route / request / params.
   */
  invalidateContexts() {
    this.props = null;
    this.actionApiContext = null;
    this.apiContext = null;
  }
}
class ActionHandler {
  /**
   * Run action handling for the current request. Expects the APIContext
   * that is already being used by the render pipeline.
   *
   * Returns a `Response` when the action fully handles the request (RPC),
   * or `undefined` when the caller should continue processing the
   * request (form actions or non-action requests).
   */
  handle(apiContext, state) {
    state.pipeline.usedFeatures |= PipelineFeatures.actions;
    if (apiContext.isPrerendered) {
      return void 0;
    }
    const { action, setActionResult } = getActionContext(apiContext);
    if (!action) {
      return void 0;
    }
    return this.#executeAction(action, setActionResult);
  }
  async #executeAction(action, setActionResult) {
    const actionResult = await action.handler();
    const serialized = serializeActionResult(actionResult);
    if (action.calledFrom === "rpc") {
      if (serialized.type === "empty") {
        return new Response(null, {
          status: serialized.status
        });
      }
      return new Response(serialized.body, {
        status: serialized.status,
        headers: {
          "Content-Type": serialized.contentType
        }
      });
    }
    setActionResult(action.name, serialized);
    return void 0;
  }
}
function prepareResponse(response, { addCookieHeader }) {
  for (const headerName of INTERNAL_RESPONSE_HEADERS) {
    if (response.headers.has(headerName)) {
      response.headers.delete(headerName);
    }
  }
  if (addCookieHeader) {
    for (const setCookieHeaderValue of getSetCookiesFromResponse(response)) {
      response.headers.append("set-cookie", setCookieHeaderValue);
    }
  }
  Reflect.set(response, responseSentSymbol$1, true);
}
function redirectTemplate({
  status,
  absoluteLocation,
  relativeLocation,
  from
}) {
  const delay = status === 302 ? 2 : 0;
  const rel = escape(String(relativeLocation));
  const abs = escape(String(absoluteLocation));
  const fromHtml = from ? `from <code>${escape(from)}</code> ` : "";
  return `<!doctype html>
<title>Redirecting to: ${rel}</title>
<meta http-equiv="refresh" content="${delay};url=${rel}">
<meta name="robots" content="noindex">
<link rel="canonical" href="${abs}">
<body>
	<a href="${rel}">Redirecting ${fromHtml}to <code>${rel}</code></a>
</body>`;
}
class TrailingSlashHandler {
  #app;
  constructor(app2) {
    this.#app = app2;
  }
  /**
   * Returns a redirect `Response` if the request pathname needs
   * normalization, or `undefined` if no redirect is required.
   */
  handle(state) {
    const url = new URL(state.request.url);
    const redirect = this.#redirectTrailingSlash(url.pathname);
    if (redirect === url.pathname) {
      return void 0;
    }
    const addCookieHeader = state.renderOptions.addCookieHeader;
    const status = state.request.method === "GET" ? 301 : 308;
    const response = new Response(
      redirectTemplate({
        status,
        relativeLocation: url.pathname,
        absoluteLocation: redirect,
        from: state.request.url
      }),
      {
        status,
        headers: {
          location: redirect + url.search
        }
      }
    );
    prepareResponse(response, { addCookieHeader });
    return response;
  }
  #redirectTrailingSlash(pathname) {
    const { trailingSlash } = this.#app.manifest;
    if (pathname === "/" || isInternalPath(pathname)) {
      return pathname;
    }
    const path = collapseDuplicateTrailingSlashes(pathname, trailingSlash !== "never");
    if (path !== pathname) {
      return path;
    }
    if (trailingSlash === "ignore") {
      return pathname;
    }
    if (trailingSlash === "always" && !hasFileExtension(pathname)) {
      return appendForwardSlash(pathname);
    }
    if (trailingSlash === "never") {
      return removeTrailingForwardSlash(pathname);
    }
    return pathname;
  }
}
function defaultSetHeaders(options) {
  const headers = new Headers();
  const directives = [];
  if (options.maxAge !== void 0) {
    directives.push(`max-age=${options.maxAge}`);
  }
  if (options.swr !== void 0) {
    directives.push(`stale-while-revalidate=${options.swr}`);
  }
  if (directives.length > 0) {
    headers.set("CDN-Cache-Control", directives.join(", "));
  }
  if (options.tags && options.tags.length > 0) {
    headers.set("Cache-Tag", options.tags.join(", "));
  }
  if (options.lastModified) {
    headers.set("Last-Modified", options.lastModified.toUTCString());
  }
  if (options.etag) {
    headers.set("ETag", options.etag);
  }
  return headers;
}
function isLiveDataEntry(value) {
  return value != null && typeof value === "object" && "id" in value && "data" in value && "cacheHint" in value;
}
const APPLY_HEADERS = /* @__PURE__ */ Symbol.for("astro:cache:apply");
const IS_ACTIVE = /* @__PURE__ */ Symbol.for("astro:cache:active");
class AstroCache {
  #options = {};
  #tags = /* @__PURE__ */ new Set();
  #disabled = false;
  #provider;
  enabled = true;
  constructor(provider) {
    this.#provider = provider;
  }
  set(input) {
    if (input === false) {
      this.#disabled = true;
      this.#tags.clear();
      this.#options = {};
      return;
    }
    this.#disabled = false;
    let options;
    if (isLiveDataEntry(input)) {
      if (!input.cacheHint) return;
      options = input.cacheHint;
    } else {
      options = input;
    }
    if ("maxAge" in options && options.maxAge !== void 0) this.#options.maxAge = options.maxAge;
    if ("swr" in options && options.swr !== void 0)
      this.#options.swr = options.swr;
    if ("etag" in options && options.etag !== void 0)
      this.#options.etag = options.etag;
    if (options.lastModified !== void 0) {
      if (!this.#options.lastModified || options.lastModified > this.#options.lastModified) {
        this.#options.lastModified = options.lastModified;
      }
    }
    if (options.tags) {
      for (const tag of options.tags) this.#tags.add(tag);
    }
  }
  get tags() {
    return [...this.#tags];
  }
  /**
   * Get the current cache options (read-only snapshot).
   * Includes all accumulated options: maxAge, swr, tags, etag, lastModified.
   */
  get options() {
    return {
      ...this.#options,
      tags: this.tags
    };
  }
  async invalidate(input) {
    if (!this.#provider) {
      throw new AstroError(CacheNotEnabled);
    }
    let options;
    if (isLiveDataEntry(input)) {
      options = { tags: input.cacheHint?.tags ?? [] };
    } else {
      options = input;
    }
    return this.#provider.invalidate(options);
  }
  /** @internal */
  [APPLY_HEADERS](response) {
    if (this.#disabled) return;
    const finalOptions = { ...this.#options, tags: this.tags };
    if (finalOptions.maxAge === void 0 && !finalOptions.tags?.length) return;
    const headers = this.#provider?.setHeaders?.(finalOptions) ?? defaultSetHeaders(finalOptions);
    for (const [key, value] of headers) {
      response.headers.set(key, value);
    }
  }
  /** @internal */
  get [IS_ACTIVE]() {
    return !this.#disabled && (this.#options.maxAge !== void 0 || this.#tags.size > 0);
  }
}
function applyCacheHeaders(cache, response) {
  if (APPLY_HEADERS in cache) {
    cache[APPLY_HEADERS](response);
  }
}
const ROUTE_DYNAMIC_SPLIT = /\[(.+?\(.+?\)|.+?)\]/;
const ROUTE_SPREAD = /^\.{3}.+$/;
function getParts(part, file) {
  const result = [];
  part.split(ROUTE_DYNAMIC_SPLIT).map((str, i) => {
    if (!str) return;
    const dynamic = i % 2 === 1;
    const [, content] = dynamic ? /([^(]+)$/.exec(str) || [null, null] : [null, str];
    if (!content || dynamic && !/^(?:\.\.\.)?[\w$]+$/.test(content)) {
      throw new Error(`Invalid route ${file} — parameter name must match /^[a-zA-Z0-9_$]+$/`);
    }
    result.push({
      content,
      dynamic,
      spread: dynamic && ROUTE_SPREAD.test(content)
    });
  });
  return result;
}
function compileCacheRoutes(routes, base, trailingSlash) {
  const compiled = Object.entries(routes).map(([path, options]) => {
    const segments = removeLeadingForwardSlash(path).split("/").filter(Boolean).map((s2) => getParts(s2, path));
    const pattern = getPattern(segments, base, trailingSlash);
    return { pattern, options, segments, route: path };
  });
  compiled.sort(
    (a, b) => routeComparator(
      { segments: a.segments, route: a.route, type: "page" },
      { segments: b.segments, route: b.route, type: "page" }
    )
  );
  return compiled;
}
function matchCacheRoute(pathname, compiledRoutes) {
  for (const route of compiledRoutes) {
    if (route.pattern.test(pathname)) return route.options;
  }
  return null;
}
const CACHE_KEY = "cache";
function provideCache(state) {
  const pipeline = state.pipeline;
  if (!pipeline.cacheConfig) {
    state.provide(CACHE_KEY, {
      create: () => new DisabledAstroCache(pipeline.logger)
    });
    return;
  }
  if (pipeline.runtimeMode === "development") {
    state.provide(CACHE_KEY, {
      create: () => new NoopAstroCache()
    });
    return;
  }
  return provideCacheAsync(state, pipeline);
}
async function provideCacheAsync(state, pipeline) {
  const cacheProvider = await pipeline.getCacheProvider();
  state.provide(CACHE_KEY, {
    create() {
      const cache = new AstroCache(cacheProvider);
      if (pipeline.cacheConfig?.routes) {
        if (!pipeline.compiledCacheRoutes) {
          pipeline.compiledCacheRoutes = compileCacheRoutes(
            pipeline.cacheConfig.routes,
            pipeline.manifest.base,
            pipeline.manifest.trailingSlash
          );
        }
        const matched = matchCacheRoute(state.pathname, pipeline.compiledCacheRoutes);
        if (matched) {
          cache.set(matched);
        }
      }
      return cache;
    }
  });
}
class CacheHandler {
  #app;
  constructor(app2) {
    this.#app = app2;
  }
  async handle(state, next) {
    this.#app.pipeline.usedFeatures |= PipelineFeatures.cache;
    if (!this.#app.pipeline.cacheProvider) {
      return next();
    }
    const cache = state.resolve(CACHE_KEY);
    const cacheProvider = await this.#app.pipeline.getCacheProvider();
    if (cacheProvider?.onRequest) {
      const response2 = await cacheProvider.onRequest(
        {
          request: state.request,
          url: new URL(state.request.url),
          waitUntil: state.renderOptions.waitUntil
        },
        async () => {
          const res = await next();
          applyCacheHeaders(cache, res);
          return res;
        }
      );
      response2.headers.delete("CDN-Cache-Control");
      response2.headers.delete("Cache-Tag");
      return response2;
    }
    const response = await next();
    applyCacheHeaders(cache, response);
    return response;
  }
}
function isExternalURL(url) {
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//");
}
function redirectIsExternal(redirect) {
  if (typeof redirect === "string") {
    return isExternalURL(redirect);
  } else {
    return isExternalURL(redirect.destination);
  }
}
function computeRedirectStatus(method, redirect, redirectRoute) {
  return redirectRoute && typeof redirect === "object" ? redirect.status : method === "GET" ? 301 : 308;
}
function resolveRedirectTarget(params, redirect, redirectRoute, trailingSlash) {
  if (typeof redirectRoute !== "undefined") {
    const generate = getRouteGenerator(redirectRoute.segments, trailingSlash);
    return generate(params);
  } else if (typeof redirect === "string") {
    if (redirectIsExternal(redirect)) {
      return redirect;
    } else {
      let target = redirect;
      for (const param of Object.keys(params)) {
        const paramValue = params[param];
        target = target.replace(`[${param}]`, paramValue).replace(`[...${param}]`, paramValue);
      }
      return target;
    }
  } else if (typeof redirect === "undefined") {
    return "/";
  }
  return redirect.destination;
}
async function renderRedirect(state) {
  state.pipeline.usedFeatures |= PipelineFeatures.redirects;
  const routeData = state.routeData;
  const { redirect, redirectRoute } = routeData;
  const status = computeRedirectStatus(state.request.method, redirect, redirectRoute);
  const headers = {
    location: encodeURI(
      resolveRedirectTarget(
        state.params,
        redirect,
        redirectRoute,
        state.pipeline.manifest.trailingSlash
      )
    )
  };
  if (redirect && redirectIsExternal(redirect)) {
    if (typeof redirect === "string") {
      return Response.redirect(redirect, status);
    } else {
      return Response.redirect(redirect.destination, status);
    }
  }
  return new Response(null, { status, headers });
}
const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error2) {
    if (options.strict) {
      throw error2;
    }
    return value;
  }
}
function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error2) {
    return Promise.reject(error2);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify$1(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify$1(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}
function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}
function defineDriver(factory) {
  return factory;
}
const DRIVER_NAME = "memory";
const memory = defineDriver(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});
function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify$1(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify$1(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify$1(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}
const PERSIST_SYMBOL = /* @__PURE__ */ Symbol();
const DEFAULT_COOKIE_NAME = "astro-session";
const VALID_COOKIE_REGEX = /^[\w-]+$/;
const unflatten = (parsed, _) => {
  return unflatten$1(parsed, {
    URL: (href) => new URL(href)
  });
};
const stringify = (data, _) => {
  return stringify$2(data, {
    // Support URL objects
    URL: (val) => val instanceof URL && val.href
  });
};
class AstroSession {
  // The cookies object.
  #cookies;
  // The session configuration.
  #config;
  // The cookie config
  #cookieConfig;
  // The cookie name
  #cookieName;
  // The unstorage object for the session driver.
  #storage;
  #data;
  // The session ID. A v4 UUID.
  #sessionID;
  // Sessions to destroy. Needed because we won't have the old session ID after it's destroyed locally.
  #toDestroy = /* @__PURE__ */ new Set();
  // Session keys to delete. Used for partial data sets to avoid overwriting the deleted value.
  #toDelete = /* @__PURE__ */ new Set();
  // Whether the session is dirty and needs to be saved.
  #dirty = false;
  // Whether the session cookie has been set.
  #cookieSet = false;
  // Whether the session ID was sourced from a client cookie rather than freshly generated.
  #sessionIDFromCookie = false;
  // The local data is "partial" if it has not been loaded from storage yet and only
  // contains values that have been set or deleted in-memory locally.
  // We do this to avoid the need to block on loading data when it is only being set.
  // When we load the data from storage, we need to merge it with the local partial data,
  // preserving in-memory changes and deletions.
  #partial = true;
  // The driver factory function provided by the pipeline
  #driverFactory;
  static #sharedStorage = /* @__PURE__ */ new Map();
  constructor({
    cookies,
    config,
    runtimeMode,
    driverFactory,
    mockStorage
  }) {
    if (!config) {
      throw new AstroError({
        ...SessionStorageInitError,
        message: SessionStorageInitError.message(
          "No driver was defined in the session configuration and the adapter did not provide a default driver."
        )
      });
    }
    this.#cookies = cookies;
    this.#driverFactory = driverFactory;
    const { cookie: cookieConfig = DEFAULT_COOKIE_NAME, ...configRest } = config;
    let cookieConfigObject;
    if (typeof cookieConfig === "object") {
      const { name = DEFAULT_COOKIE_NAME, ...rest } = cookieConfig;
      this.#cookieName = name;
      cookieConfigObject = rest;
    } else {
      this.#cookieName = cookieConfig || DEFAULT_COOKIE_NAME;
    }
    this.#cookieConfig = {
      sameSite: "lax",
      secure: runtimeMode === "production",
      path: "/",
      ...cookieConfigObject,
      httpOnly: true
    };
    this.#config = configRest;
    if (mockStorage) {
      this.#storage = mockStorage;
    }
  }
  /**
   * Gets a session value. Returns `undefined` if the session or value does not exist.
   */
  async get(key) {
    return (await this.#ensureData()).get(key)?.data;
  }
  /**
   * Checks if a session value exists.
   */
  async has(key) {
    return (await this.#ensureData()).has(key);
  }
  /**
   * Gets all session values.
   */
  async keys() {
    return (await this.#ensureData()).keys();
  }
  /**
   * Gets all session values.
   */
  async values() {
    return [...(await this.#ensureData()).values()].map((entry) => entry.data);
  }
  /**
   * Gets all session entries.
   */
  async entries() {
    return [...(await this.#ensureData()).entries()].map(([key, entry]) => [key, entry.data]);
  }
  /**
   * Deletes a session value.
   */
  delete(key) {
    this.#data ??= /* @__PURE__ */ new Map();
    this.#data.delete(key);
    if (this.#partial) {
      this.#toDelete.add(key);
    }
    this.#dirty = true;
  }
  /**
   * Sets a session value. The session is created if it does not exist.
   */
  set(key, value, { ttl } = {}) {
    if (!key) {
      throw new AstroError({
        ...SessionStorageSaveError,
        message: "The session key was not provided."
      });
    }
    let cloned;
    try {
      cloned = unflatten(JSON.parse(stringify(value)));
    } catch (err) {
      throw new AstroError(
        {
          ...SessionStorageSaveError,
          message: `The session data for ${key} could not be serialized.`,
          hint: "See the devalue library for all supported types: https://github.com/rich-harris/devalue"
        },
        { cause: err }
      );
    }
    if (!this.#cookieSet) {
      this.#setCookie();
      this.#cookieSet = true;
    }
    this.#data ??= /* @__PURE__ */ new Map();
    const lifetime = ttl ?? this.#config.ttl;
    const expires = typeof lifetime === "number" ? Date.now() + lifetime * 1e3 : lifetime;
    this.#data.set(key, {
      data: cloned,
      expires
    });
    this.#dirty = true;
  }
  /**
   * Destroys the session, clearing the cookie and storage if it exists.
   */
  destroy() {
    const sessionId = this.#sessionID ?? this.#cookies.get(this.#cookieName)?.value;
    if (sessionId) {
      this.#toDestroy.add(sessionId);
    }
    this.#cookies.delete(this.#cookieName, this.#cookieConfig);
    this.#sessionID = void 0;
    this.#data = void 0;
    this.#dirty = true;
  }
  /**
   * Regenerates the session, creating a new session ID. The existing session data is preserved.
   */
  async regenerate() {
    let data = /* @__PURE__ */ new Map();
    try {
      data = await this.#ensureData();
    } catch (err) {
      console.error("Failed to load session data during regeneration:", err);
    }
    const oldSessionId = this.#sessionID;
    this.#sessionID = crypto.randomUUID();
    this.#sessionIDFromCookie = false;
    this.#data = data;
    this.#dirty = true;
    await this.#setCookie();
    if (oldSessionId && this.#storage) {
      this.#storage.removeItem(oldSessionId).catch((err) => {
        console.error("Failed to remove old session data:", err);
      });
    }
  }
  // Persists the session data to storage.
  // This is called automatically at the end of the request.
  // Uses a symbol to prevent users from calling it directly.
  async [PERSIST_SYMBOL]() {
    if (!this.#dirty && !this.#toDestroy.size) {
      return;
    }
    const storage = await this.#ensureStorage();
    if (this.#dirty && this.#data) {
      const data = await this.#ensureData();
      this.#toDelete.forEach((key2) => data.delete(key2));
      const key = this.#ensureSessionID();
      let serialized;
      try {
        serialized = stringify(data);
      } catch (err) {
        throw new AstroError(
          {
            ...SessionStorageSaveError,
            message: SessionStorageSaveError.message(
              "The session data could not be serialized.",
              this.#config.driver
            )
          },
          { cause: err }
        );
      }
      await storage.setItem(key, serialized);
      this.#dirty = false;
    }
    if (this.#toDestroy.size > 0) {
      const cleanupPromises = [...this.#toDestroy].map(
        (sessionId) => storage.removeItem(sessionId).catch((err) => {
          console.error("Failed to clean up session %s:", sessionId, err);
        })
      );
      await Promise.all(cleanupPromises);
      this.#toDestroy.clear();
    }
  }
  get sessionID() {
    return this.#sessionID;
  }
  /**
   * Loads a session from storage with the given ID, and replaces the current session.
   * Any changes made to the current session will be lost.
   * This is not normally needed, as the session is automatically loaded using the cookie.
   * However it can be used to restore a session where the ID has been recorded somewhere
   * else (e.g. in a database).
   */
  async load(sessionID) {
    this.#sessionID = sessionID;
    this.#data = void 0;
    await this.#setCookie();
    await this.#ensureData();
  }
  /**
   * Sets the session cookie.
   */
  async #setCookie() {
    if (!VALID_COOKIE_REGEX.test(this.#cookieName)) {
      throw new AstroError({
        ...SessionStorageSaveError,
        message: "Invalid cookie name. Cookie names can only contain letters, numbers, and dashes."
      });
    }
    const value = this.#ensureSessionID();
    this.#cookies.set(this.#cookieName, value, this.#cookieConfig);
  }
  /**
   * Attempts to load the session data from storage, or creates a new data object if none exists.
   * If there is existing partial data, it will be merged into the new data object.
   */
  async #ensureData() {
    if (this.#data && !this.#partial) {
      return this.#data;
    }
    this.#data ??= /* @__PURE__ */ new Map();
    if (!this.#sessionID && !this.#cookies.get(this.#cookieName)?.value) {
      this.#partial = false;
      return this.#data;
    }
    const storage = await this.#ensureStorage();
    const raw = await storage.get(this.#ensureSessionID());
    if (!raw) {
      if (this.#sessionIDFromCookie) {
        this.#sessionID = crypto.randomUUID();
        this.#sessionIDFromCookie = false;
        if (this.#cookieSet) {
          await this.#setCookie();
        }
      }
      return this.#data;
    }
    try {
      const storedMap = unflatten(raw);
      if (!(storedMap instanceof Map)) {
        await this.destroy();
        throw new AstroError({
          ...SessionStorageInitError,
          message: SessionStorageInitError.message(
            "The session data was an invalid type.",
            this.#config.driver
          )
        });
      }
      const now = Date.now();
      for (const [key, value] of storedMap) {
        const expired = typeof value.expires === "number" && value.expires < now;
        if (!this.#data.has(key) && !this.#toDelete.has(key) && !expired) {
          this.#data.set(key, value);
        }
      }
      this.#partial = false;
      return this.#data;
    } catch (err) {
      await this.destroy();
      if (err instanceof AstroError) {
        throw err;
      }
      throw new AstroError(
        {
          ...SessionStorageInitError,
          message: SessionStorageInitError.message(
            "The session data could not be parsed.",
            this.#config.driver
          )
        },
        { cause: err }
      );
    }
  }
  /**
   * Returns the session ID, generating a new one if it does not exist.
   */
  #ensureSessionID() {
    if (!this.#sessionID) {
      const cookieValue = this.#cookies.get(this.#cookieName)?.value;
      if (cookieValue) {
        this.#sessionID = cookieValue;
        this.#sessionIDFromCookie = true;
      } else {
        this.#sessionID = crypto.randomUUID();
      }
    }
    return this.#sessionID;
  }
  /**
   * Ensures the storage is initialized.
   * This is called automatically when a storage operation is needed.
   */
  async #ensureStorage() {
    if (this.#storage) {
      return this.#storage;
    }
    if (AstroSession.#sharedStorage.has(this.#config.driver)) {
      this.#storage = AstroSession.#sharedStorage.get(this.#config.driver);
      return this.#storage;
    }
    if (!this.#driverFactory) {
      throw new AstroError({
        ...SessionStorageInitError,
        message: SessionStorageInitError.message(
          "Astro could not load the driver correctly. Does it exist?",
          this.#config.driver
        )
      });
    }
    const driver = this.#driverFactory;
    try {
      this.#storage = createStorage({
        driver: {
          ...driver(this.#config.options),
          // Unused methods
          hasItem() {
            return false;
          },
          getKeys() {
            return [];
          }
        }
      });
      AstroSession.#sharedStorage.set(this.#config.driver, this.#storage);
      return this.#storage;
    } catch (err) {
      throw new AstroError(
        {
          ...SessionStorageInitError,
          message: SessionStorageInitError.message("Unknown error", this.#config.driver)
        },
        { cause: err }
      );
    }
  }
}
const SESSION_KEY = "session";
function provideSession(state) {
  state.pipeline.usedFeatures |= PipelineFeatures.sessions;
  const pipeline = state.pipeline;
  const config = pipeline.manifest.sessionConfig;
  if (!config) return;
  return provideSessionAsync(state, config);
}
async function provideSessionAsync(state, config) {
  const pipeline = state.pipeline;
  const driverFactory = await pipeline.getSessionDriver();
  if (!driverFactory) return;
  state.provide(SESSION_KEY, {
    create() {
      const cookies = state.cookies;
      return new AstroSession({
        cookies,
        config,
        runtimeMode: pipeline.runtimeMode,
        driverFactory,
        mockStorage: null
      });
    },
    finalize(session) {
      return session[PERSIST_SYMBOL]();
    }
  });
}
class AstroHandler {
  #app;
  #trailingSlashHandler;
  #actionHandler;
  #astroMiddleware;
  #pagesHandler;
  #cacheHandler;
  /** Bound callback for the middleware chain — created once, reused per request. */
  #renderRouteCallback;
  /**
   * i18n post-processor. Only set when the app has i18n configured and
   * the strategy is not `manual` — for the manual strategy users wire
   * `astro:i18n.middleware(...)` into their own `onRequest`.
   */
  #i18n;
  /** Whether sessions are configured on the manifest. */
  #hasSession;
  constructor(app2) {
    this.#app = app2;
    this.#trailingSlashHandler = new TrailingSlashHandler(app2);
    this.#actionHandler = new ActionHandler();
    this.#astroMiddleware = new AstroMiddleware(app2.pipeline);
    this.#pagesHandler = new PagesHandler(app2.pipeline);
    this.#cacheHandler = new CacheHandler(app2);
    this.#renderRouteCallback = this.#actionsAndPages.bind(this);
    this.#hasSession = !!app2.manifest.sessionConfig;
    const i18n = app2.manifest.i18n;
    if (i18n && i18n.strategy !== "manual") {
      this.#i18n = new I18n(
        i18n,
        app2.manifest.base,
        app2.manifest.trailingSlash,
        app2.manifest.buildFormat
      );
    }
  }
  /**
   * Runs actions then pages — the callback at the bottom of the
   * middleware chain. Bound once in the constructor to avoid
   * per-request closure allocation.
   */
  #actionsAndPages(state, ctx) {
    if (!state.skipMiddleware) {
      const actionResult = this.#actionHandler.handle(ctx, state);
      if (actionResult) {
        return actionResult.then((response) => response ?? this.#pagesHandler.handle(state, ctx));
      }
    }
    return this.#pagesHandler.handle(state, ctx);
  }
  async handle(state) {
    const trailingSlashRedirect = this.#trailingSlashHandler.handle(state);
    if (trailingSlashRedirect) {
      return trailingSlashRedirect;
    }
    if (!state.routeData) {
      return this.#app.renderError(state.request, {
        ...state.renderOptions,
        status: 404,
        pathname: state.pathname
      });
    }
    return this.render(state);
  }
  /**
   * Renders a response for the given `FetchState`. Assumes
   * trailing-slash redirects and routeData resolution have already run.
   *
   * User-triggered rewrites (`Astro.rewrite` / `ctx.rewrite`) go through
   * `Rewrites.execute` on the current `FetchState` — they mutate the
   * existing state in place and re-run middleware + page dispatch.
   */
  async render(state) {
    const routeData = state.routeData;
    const pathname = state.pathname;
    const request = state.request;
    const { addCookieHeader } = state.renderOptions;
    const defaultStatus = this.#app.getDefaultStatusCode(routeData, pathname);
    state.status = defaultStatus;
    let response;
    try {
      if (this.#hasSession || this.#app.pipeline.cacheConfig) {
        const sessionP = this.#hasSession ? provideSession(state) : void 0;
        const cacheP = this.#app.pipeline.cacheConfig ? provideCache(state) : void 0;
        if (sessionP || cacheP) await Promise.all([sessionP, cacheP]);
      }
      state.pipeline.usedFeatures |= PipelineFeatures.sessions;
      if (routeData.type === "redirect") {
        const redirectResponse = await renderRedirect(state);
        this.#app.logThisRequest({
          pathname,
          method: request.method,
          statusCode: redirectResponse.status,
          isRewrite: false,
          timeStart: state.timeStart
        });
        prepareResponse(redirectResponse, { addCookieHeader });
        this.#app.pipeline.logger.flush();
        return redirectResponse;
      }
      if (!this.#app.pipeline.cacheProvider) {
        this.#app.pipeline.usedFeatures |= PipelineFeatures.cache;
        response = await this.#astroMiddleware.handle(state, this.#renderRouteCallback);
        if (this.#i18n) {
          response = await this.#i18n.finalize(state, response);
        }
      } else {
        const runPipeline = async () => {
          let res = await this.#astroMiddleware.handle(state, this.#renderRouteCallback);
          if (this.#i18n) {
            res = await this.#i18n.finalize(state, res);
          }
          return res;
        };
        response = await this.#cacheHandler.handle(state, runPipeline);
      }
      const isRewrite = response.headers.has(REWRITE_DIRECTIVE_HEADER_KEY);
      this.#app.logThisRequest({
        pathname,
        method: request.method,
        statusCode: response.status,
        isRewrite,
        timeStart: state.timeStart
      });
    } catch (err) {
      this.#app.logger.error(null, err.stack || err.message || String(err));
      return this.#app.renderError(request, {
        ...state.renderOptions,
        status: 500,
        error: err,
        pathname: state.pathname
      });
    } finally {
      const finalize = state.finalizeAll();
      if (finalize) await finalize;
    }
    if (REROUTABLE_STATUS_CODES.includes(response.status) && // If the body isn't null, that means the user sets the 404 status
    // but uses the current route to handle the 404
    response.body === null && response.headers.get(REROUTE_DIRECTIVE_HEADER) !== "no") {
      return this.#app.renderError(request, {
        ...state.renderOptions,
        response,
        status: response.status,
        // We don't have an error to report here. Passing null means we pass nothing intentionally
        // while undefined means there's no error
        error: response.status === 500 ? null : void 0,
        pathname: state.pathname
      });
    }
    prepareResponse(response, { addCookieHeader });
    this.#app.pipeline.logger.flush();
    return response;
  }
}
class DefaultFetchHandler {
  #app;
  #handler;
  constructor(app2) {
    this.#app = app2 ?? null;
    this.#handler = app2 ? new AstroHandler(app2) : null;
  }
  /**
   * Fast path: called directly by `BaseApp.render()` with pre-resolved
   * options, avoiding the `Reflect.set/get` round-trip through the request.
   */
  renderWithOptions(request, options) {
    if (!this.#app) {
      const app2 = Reflect.get(request, appSymbol);
      if (!app2) {
        throw new Error("No fetch handler provided.");
      }
      this.#app = app2;
      this.#handler = new AstroHandler(app2);
    }
    const state = new FetchState(this.#app.pipeline, request, options);
    return this.#handler.handle(state);
  }
  fetch = (request) => {
    if (!this.#app) {
      const app2 = Reflect.get(request, appSymbol);
      if (!app2) {
        throw new Error("No fetch handler provided.");
      }
      this.#app = app2;
      this.#handler = new AstroHandler(app2);
    }
    const state = new FetchState(this.#app.pipeline, request);
    if (!this.#handler) {
      throw new Error("No fetch handler provided.");
    }
    return this.#handler.handle(state);
  };
}
const fetchable = new DefaultFetchHandler();
function matchPattern(url, remotePattern) {
  return matchProtocol(url, remotePattern.protocol) && matchHostname(url, remotePattern.hostname, true) && matchPort(url, remotePattern.port) && matchPathname(url, remotePattern.pathname, true);
}
function matchPort(url, port) {
  return !port || port === url.port;
}
function matchProtocol(url, protocol) {
  return !protocol || protocol === url.protocol.slice(0, -1);
}
function matchHostname(url, hostname, allowWildcard = false) {
  if (!hostname) {
    return true;
  } else if (!allowWildcard || !hostname.startsWith("*")) {
    return hostname === url.hostname;
  } else if (hostname.startsWith("**.")) {
    const slicedHostname = hostname.slice(2);
    return slicedHostname !== url.hostname && url.hostname.endsWith(slicedHostname);
  } else if (hostname.startsWith("*.")) {
    const slicedHostname = hostname.slice(1);
    if (!url.hostname.endsWith(slicedHostname)) {
      return false;
    }
    const subdomainWithDot = url.hostname.slice(0, -(slicedHostname.length - 1));
    return subdomainWithDot.endsWith(".") && !subdomainWithDot.slice(0, -1).includes(".");
  }
  return false;
}
function matchPathname(url, pathname, allowWildcard = false) {
  if (!pathname) {
    return true;
  } else if (!allowWildcard || !pathname.endsWith("*")) {
    return pathname === url.pathname;
  } else if (pathname.endsWith("/**")) {
    const slicedPathname = pathname.slice(0, -2);
    return slicedPathname !== url.pathname && url.pathname.startsWith(slicedPathname);
  } else if (pathname.endsWith("/*")) {
    const slicedPathname = pathname.slice(0, -1);
    if (!url.pathname.startsWith(slicedPathname)) {
      return false;
    }
    const additionalPathChunks = url.pathname.slice(slicedPathname.length).split("/").filter(Boolean);
    return additionalPathChunks.length === 1;
  }
  return false;
}
function isRemoteAllowed(src, {
  domains,
  remotePatterns
}) {
  if (!URL.canParse(src)) {
    return false;
  }
  const url = new URL(src);
  if (!["http:", "https:", "data:"].includes(url.protocol)) {
    return false;
  }
  return domains.some((domain) => matchHostname(url, domain)) || remotePatterns.some((remotePattern) => matchPattern(url, remotePattern));
}
class DefaultErrorHandler {
  #app;
  #astroMiddleware;
  #pagesHandler;
  constructor(app2) {
    this.#app = app2;
    this.#astroMiddleware = new AstroMiddleware(app2.pipeline);
    this.#pagesHandler = new PagesHandler(app2.pipeline);
  }
  async renderError(request, {
    status,
    response: originalResponse,
    skipMiddleware = false,
    error: error2,
    pathname,
    ...resolvedRenderOptions
  }) {
    const app2 = this.#app;
    const resolvedPathname = pathname ?? new FetchState(app2.pipeline, request).pathname;
    const errorRoutePath = `/${status}${app2.manifest.trailingSlash === "always" ? "/" : ""}`;
    const errorRouteData = matchRoute(errorRoutePath, app2.manifestData);
    const url = new URL(request.url);
    if (errorRouteData) {
      if (errorRouteData.prerender) {
        const maybeDotHtml = errorRouteData.route.endsWith(`/${status}`) ? ".html" : "";
        const statusURL = new URL(`${app2.baseWithoutTrailingSlash}/${status}${maybeDotHtml}`, url);
        if (statusURL.toString() !== request.url && resolvedRenderOptions.prerenderedErrorPageFetch) {
          const response2 = await resolvedRenderOptions.prerenderedErrorPageFetch(
            statusURL.toString()
          );
          const override = { status, removeContentEncodingHeaders: true };
          const newResponse = mergeResponses(response2, originalResponse, override);
          prepareResponse(newResponse, resolvedRenderOptions);
          return newResponse;
        }
      }
      const mod = await app2.pipeline.getComponentByRoute(errorRouteData);
      const errorState = new FetchState(app2.pipeline, request);
      errorState.skipMiddleware = skipMiddleware;
      errorState.clientAddress = resolvedRenderOptions.clientAddress;
      errorState.routeData = errorRouteData;
      errorState.pathname = resolvedPathname;
      errorState.status = status;
      errorState.componentInstance = mod;
      errorState.locals = resolvedRenderOptions.locals ?? {};
      errorState.initialProps = { error: error2 };
      try {
        await provideSession(errorState);
        const response2 = await this.#astroMiddleware.handle(
          errorState,
          this.#pagesHandler.handle.bind(this.#pagesHandler)
        );
        const newResponse = mergeResponses(response2, originalResponse);
        prepareResponse(newResponse, resolvedRenderOptions);
        return newResponse;
      } catch {
        if (skipMiddleware === false) {
          return this.renderError(request, {
            ...resolvedRenderOptions,
            status,
            response: originalResponse,
            skipMiddleware: true,
            pathname: resolvedPathname
          });
        }
      } finally {
        await errorState.finalizeAll();
      }
    }
    const response = mergeResponses(new Response(null, { status }), originalResponse);
    prepareResponse(response, resolvedRenderOptions);
    return response;
  }
}
function mergeResponses(newResponse, originalResponse, override) {
  let newResponseHeaders = newResponse.headers;
  if (override?.removeContentEncodingHeaders) {
    newResponseHeaders = new Headers(newResponseHeaders);
    newResponseHeaders.delete("Content-Encoding");
    newResponseHeaders.delete("Content-Length");
  }
  if (!originalResponse) {
    if (override !== void 0) {
      return new Response(newResponse.body, {
        status: override.status,
        statusText: newResponse.statusText,
        headers: newResponseHeaders
      });
    }
    return newResponse;
  }
  const status = override?.status ? override.status : originalResponse.status === 200 ? newResponse.status : originalResponse.status;
  try {
    originalResponse.headers.delete("Content-type");
    originalResponse.headers.delete("Content-Length");
    originalResponse.headers.delete("Transfer-Encoding");
  } catch {
  }
  const newHeaders = new Headers();
  const seen = /* @__PURE__ */ new Set();
  for (const [name, value] of originalResponse.headers) {
    newHeaders.append(name, value);
    seen.add(name.toLowerCase());
  }
  for (const [name, value] of newResponseHeaders) {
    if (!seen.has(name.toLowerCase())) {
      newHeaders.append(name, value);
    }
  }
  const mergedResponse = new Response(newResponse.body, {
    status,
    statusText: status === 200 ? newResponse.statusText : originalResponse.statusText,
    // If you're looking at here for possible bugs, it means that it's not a bug.
    // With the middleware, users can meddle with headers, and we should pass to the 404/500.
    // If users see something weird, it's because they are setting some headers they should not.
    //
    // Although, we don't want it to replace the content-type, because the error page must return `text/html`
    headers: newHeaders
  });
  const originalCookies = getCookiesFromResponse(originalResponse);
  const newCookies = getCookiesFromResponse(newResponse);
  if (originalCookies) {
    if (newCookies) {
      for (const cookieValue of newCookies.consume()) {
        originalResponse.headers.append("set-cookie", cookieValue);
      }
    }
    attachCookiesToResponse(mergedResponse, originalCookies);
  } else if (newCookies) {
    attachCookiesToResponse(mergedResponse, newCookies);
  }
  return mergedResponse;
}
class BaseApp {
  manifest;
  manifestData;
  pipeline;
  #adapterLogger;
  baseWithoutTrailingSlash;
  /**
   * The handler that turns incoming `Request` objects into `Response`s.
   * Defaults to a `DefaultFetchHandler` pinned to this app and can be
   * overridden via `setFetchHandler` — typically by the bundled
   * entrypoint after importing `virtual:astro:fetchable`.
   */
  #fetchHandler;
  #errorHandler;
  /**
   * Whether a custom fetch handler (from `src/app.ts`) has been set
   * via `setFetchHandler`. When false, the `DefaultFetchHandler` is
   * in use and all features are implicitly active.
   */
  #hasCustomFetchHandler = false;
  /**
   * Whether the missing-feature check has already run. We only want
   * to warn once — after the first request in dev, or at build end.
   */
  #featureCheckDone = false;
  get logger() {
    return this.pipeline.logger;
  }
  get adapterLogger() {
    if (!this.#adapterLogger) {
      this.#adapterLogger = new AstroIntegrationLogger(
        this.logger.options,
        this.manifest.adapterName
      );
    }
    return this.#adapterLogger;
  }
  constructor(manifest2, streaming = true, ...args) {
    this.manifest = manifest2;
    this.baseWithoutTrailingSlash = removeTrailingForwardSlash(manifest2.base);
    this.pipeline = this.createPipeline(streaming, manifest2, ...args);
    this.manifestData = this.pipeline.manifestData;
    this.#fetchHandler = new DefaultFetchHandler(this);
    this.#errorHandler = this.createErrorHandler();
  }
  /**
   * Override the fetch handler used to dispatch requests. Entrypoints
   * call this with the default export of `virtual:astro:fetchable` to
   * plug in a user-authored handler from `src/app.ts`.
   */
  setFetchHandler(handler) {
    this.#fetchHandler = handler;
    this.#hasCustomFetchHandler = !(handler instanceof DefaultFetchHandler);
  }
  /**
   * Returns the error handler strategy used by this app. Override to
   * provide environment-specific behavior (dev overlay, build-time throws, etc.).
   */
  createErrorHandler() {
    return new DefaultErrorHandler(this);
  }
  /**
   * Resets the cached adapter logger so it picks up a new logger instance.
   * Used by BuildApp when the logger is replaced via setOptions().
   */
  resetAdapterLogger() {
    this.#adapterLogger = void 0;
  }
  getAllowedDomains() {
    return this.manifest.allowedDomains;
  }
  matchesAllowedDomains(forwardedHost, protocol) {
    return BaseApp.validateForwardedHost(forwardedHost, this.manifest.allowedDomains, protocol);
  }
  static validateForwardedHost(forwardedHost, allowedDomains, protocol) {
    if (!allowedDomains || allowedDomains.length === 0) {
      return false;
    }
    try {
      const testUrl = new URL(`${protocol || "https"}://${forwardedHost}`);
      return allowedDomains.some((pattern) => {
        return matchPattern(testUrl, pattern);
      });
    } catch {
      return false;
    }
  }
  set setManifestData(newManifestData) {
    this.manifestData = newManifestData;
    this.pipeline.manifestData = newManifestData;
    this.pipeline.rebuildRouter();
  }
  removeBase(pathname) {
    pathname = collapseDuplicateLeadingSlashes(pathname);
    if (pathname.startsWith(this.manifest.base)) {
      return pathname.slice(this.baseWithoutTrailingSlash.length + 1);
    }
    return pathname;
  }
  /**
   * Extracts the base-stripped, decoded pathname from a request.
   * Used by adapters to compute the pathname for dev-mode route matching.
   */
  getPathnameFromRequest(request) {
    const url = new URL(request.url);
    const pathname = prependForwardSlash(this.removeBase(url.pathname));
    try {
      return decodeURI(pathname);
    } catch (e) {
      this.adapterLogger.error(e.toString());
      return pathname;
    }
  }
  /**
   * Given a `Request`, it returns the `RouteData` that matches its `pathname`. By default, prerendered
   * routes aren't returned, even if they are matched.
   *
   * When `allowPrerenderedRoutes` is `true`, the function returns matched prerendered routes too.
   * @param request
   * @param allowPrerenderedRoutes
   */
  match(request, allowPrerenderedRoutes = false) {
    const url = new URL(request.url);
    if (this.manifest.assets.has(url.pathname)) return void 0;
    let pathname = this.computePathnameFromDomain(request);
    if (!pathname) {
      pathname = prependForwardSlash(this.removeBase(url.pathname));
    }
    const routeData = this.pipeline.matchRoute(decodeURI(pathname));
    if (!routeData) return void 0;
    if (allowPrerenderedRoutes) {
      return routeData;
    }
    if (routeData.prerender) {
      return void 0;
    }
    return routeData;
  }
  /**
   * A matching route function to use in the development server.
   * Contrary to the `.match` function, this function resolves props and params, returning the correct
   * route based on the priority, segments. It also returns the correct, resolved pathname.
   * @param pathname
   */
  devMatch(pathname) {
    return void 0;
  }
  computePathnameFromDomain(request) {
    let pathname = void 0;
    const url = new URL(request.url);
    if (this.manifest.i18n && (this.manifest.i18n.strategy === "domains-prefix-always" || this.manifest.i18n.strategy === "domains-prefix-other-locales" || this.manifest.i18n.strategy === "domains-prefix-always-no-redirect")) {
      let host = request.headers.get("X-Forwarded-Host");
      let protocol = request.headers.get("X-Forwarded-Proto");
      if (protocol) {
        protocol = protocol + ":";
      } else {
        protocol = url.protocol;
      }
      if (!host) {
        host = request.headers.get("Host");
      }
      if (host && protocol) {
        host = host.split(":")[0];
        try {
          let locale;
          const hostAsUrl = new URL(`${protocol}//${host}`);
          for (const [domainKey, localeValue] of Object.entries(
            this.manifest.i18n.domainLookupTable
          )) {
            const domainKeyAsUrl = new URL(domainKey);
            if (hostAsUrl.host === domainKeyAsUrl.host && hostAsUrl.protocol === domainKeyAsUrl.protocol) {
              locale = localeValue;
              break;
            }
          }
          if (locale) {
            pathname = prependForwardSlash(
              joinPaths(normalizeTheLocale(locale), this.removeBase(url.pathname))
            );
            if (this.manifest.trailingSlash === "always") {
              pathname = appendForwardSlash(pathname);
            } else if (this.manifest.trailingSlash === "never") {
              pathname = removeTrailingForwardSlash(pathname);
            } else if (url.pathname.endsWith("/")) {
              pathname = appendForwardSlash(pathname);
            }
          }
        } catch (e) {
          this.logger.error(
            "router",
            `Astro tried to parse ${protocol}//${host} as an URL, but it threw a parsing error. Check the X-Forwarded-Host and X-Forwarded-Proto headers.`
          );
          this.logger.error("router", `Error: ${e}`);
        }
      }
    }
    return pathname;
  }
  async render(request, {
    addCookieHeader = false,
    clientAddress = Reflect.get(request, clientAddressSymbol),
    locals,
    prerenderedErrorPageFetch = fetch,
    routeData,
    waitUntil
  } = {}) {
    await this.pipeline.getLogger();
    if (routeData) {
      this.logger.debug(
        "router",
        "The adapter " + this.manifest.adapterName + " provided a custom RouteData for ",
        request.url
      );
      this.logger.debug("router", "RouteData");
      this.logger.debug("router", routeData);
    }
    if (locals) {
      if (typeof locals !== "object") {
        const error2 = new AstroError(LocalsNotAnObject);
        this.logger.error(null, error2.stack);
        return this.renderError(request, {
          addCookieHeader,
          clientAddress,
          prerenderedErrorPageFetch,
          // If locals are invalid, we don't want to include them when
          // rendering the error page
          locals: void 0,
          routeData,
          waitUntil,
          status: 500,
          error: error2
        });
      }
    }
    if (!routeData) {
      const domainPathname = this.computePathnameFromDomain(request);
      if (domainPathname) {
        routeData = this.pipeline.matchRoute(decodeURI(domainPathname));
      }
    }
    const resolvedOptions = {
      addCookieHeader,
      clientAddress,
      prerenderedErrorPageFetch,
      locals,
      routeData,
      waitUntil
    };
    let response;
    if (this.#fetchHandler instanceof DefaultFetchHandler) {
      Reflect.set(request, appSymbol, this);
      response = await this.#fetchHandler.renderWithOptions(request, resolvedOptions);
    } else {
      setRenderOptions(request, resolvedOptions);
      Reflect.set(request, appSymbol, this);
      response = await this.#fetchHandler.fetch(request);
    }
    this.#warnMissingFeatures();
    if (response.headers.get(ASTRO_ERROR_HEADER)) {
      response.headers.delete(ASTRO_ERROR_HEADER);
      return this.renderError(request, {
        addCookieHeader,
        clientAddress,
        prerenderedErrorPageFetch,
        locals,
        routeData,
        waitUntil,
        response,
        status: response.status,
        error: response.status === 500 ? null : void 0
      });
    }
    return response;
  }
  setCookieHeaders(response) {
    return getSetCookiesFromResponse(response);
  }
  /**
   * Reads all the cookies written by `Astro.cookie.set()` onto the passed response.
   * For example,
   * ```ts
   * for (const cookie_ of App.getSetCookieFromResponse(response)) {
   *     const cookie: string = cookie_
   * }
   * ```
   * @param response The response to read cookies from.
   * @returns An iterator that yields key-value pairs as equal-sign-separated strings.
   */
  static getSetCookieFromResponse = getSetCookiesFromResponse;
  /**
   * If it is a known error code, try sending the according page (e.g. 404.astro / 500.astro).
   * This also handles pre-rendered /404 or /500 routes.
   *
   * Delegates to the app's configured `ErrorHandler`. To customize behavior
   * for a specific environment, override `createErrorHandler()` rather than
   * this method.
   */
  async renderError(request, options) {
    return this.#errorHandler.renderError(request, options);
  }
  /**
   * One-shot check: after the first request with a custom `src/app.ts`,
   * compare `usedFeatures` against the manifest and warn about any
   * configured features the user's pipeline doesn't call.
   */
  #warnMissingFeatures() {
    if (this.#featureCheckDone || !this.#hasCustomFetchHandler) return;
    this.#featureCheckDone = true;
    const manifest2 = this.manifest;
    const missing = [];
    const used = this.pipeline.usedFeatures;
    if (manifest2.routes.some((r) => r.routeData.type === "redirect") && !(used & PipelineFeatures.redirects)) {
      missing.push("redirects");
    }
    if (manifest2.sessionConfig && !(used & PipelineFeatures.sessions)) {
      missing.push("sessions");
    }
    if (manifest2.actions && !(used & PipelineFeatures.actions)) {
      missing.push("actions");
    }
    if (manifest2.middleware && !(used & PipelineFeatures.middleware)) {
      missing.push("middleware");
    }
    if (manifest2.i18n && manifest2.i18n.strategy !== "manual" && !(used & PipelineFeatures.i18n)) {
      missing.push("i18n");
    }
    if (manifest2.cacheConfig && !(used & PipelineFeatures.cache)) {
      missing.push("cache");
    }
    for (const feature of missing) {
      this.logger.warn(
        "router",
        `Your project uses ${feature}, but your custom src/app.ts does not call the ${feature}() handler. This feature will not work unless you add it to your app.ts pipeline.`
      );
    }
  }
  getDefaultStatusCode(routeData, pathname) {
    if (!routeData.pattern.test(pathname)) {
      for (const fallbackRoute of routeData.fallbackRoutes) {
        if (fallbackRoute.pattern.test(pathname)) {
          return 302;
        }
      }
    }
    const route = removeTrailingForwardSlash(routeData.route);
    if (route.endsWith("/404")) return 404;
    if (route.endsWith("/500")) return 500;
    return 200;
  }
  getManifest() {
    return this.pipeline.manifest;
  }
  logThisRequest({
    pathname,
    method,
    statusCode,
    isRewrite,
    timeStart
  }) {
    const timeEnd = performance.now();
    this.logRequest({
      pathname,
      method,
      statusCode,
      isRewrite,
      reqTime: timeEnd - timeStart
    });
  }
}
function getAssetsPrefix(fileExtension2, assetsPrefix) {
  let prefix = "";
  if (!assetsPrefix) {
    prefix = "";
  } else if (typeof assetsPrefix === "string") {
    prefix = assetsPrefix;
  } else {
    const dotLessFileExtension = fileExtension2.slice(1);
    prefix = assetsPrefix[dotLessFileExtension] || assetsPrefix.fallback;
  }
  return prefix;
}
const URL_PARSE_BASE = "https://astro.build";
function splitAssetPath(path) {
  const parsed = new URL(path, URL_PARSE_BASE);
  const isAbsolute = URL.canParse(path);
  const pathname = !isAbsolute && !path.startsWith("/") ? parsed.pathname.slice(1) : parsed.pathname;
  return {
    pathname,
    suffix: `${parsed.search}${parsed.hash}`
  };
}
function createAssetLink(href, base, assetsPrefix, queryParams) {
  const { pathname, suffix } = splitAssetPath(href);
  let url = "";
  if (assetsPrefix) {
    const pf = getAssetsPrefix(fileExtension(pathname), assetsPrefix);
    url = joinPaths(pf, slash(pathname)) + suffix;
  } else if (base) {
    url = prependForwardSlash(joinPaths(base, slash(pathname))) + suffix;
  } else {
    url = href;
  }
  return url;
}
function createStylesheetElement(stylesheet, base, assetsPrefix, queryParams) {
  if (stylesheet.type === "inline") {
    return {
      props: {},
      children: stylesheet.content
    };
  } else {
    return {
      props: {
        rel: "stylesheet",
        href: createAssetLink(stylesheet.src, base, assetsPrefix)
      },
      children: ""
    };
  }
}
function createStylesheetElementSet(stylesheets, base, assetsPrefix, queryParams) {
  return new Set(
    stylesheets.map((s2) => createStylesheetElement(s2, base, assetsPrefix))
  );
}
function createModuleScriptElement(script, base, assetsPrefix, queryParams) {
  if (script.type === "external") {
    return createModuleScriptElementWithSrc(script.value, base, assetsPrefix);
  } else {
    return {
      props: {
        type: "module"
      },
      children: script.value
    };
  }
}
function createModuleScriptElementWithSrc(src, base, assetsPrefix, queryParams) {
  return {
    props: {
      type: "module",
      src: createAssetLink(src, base, assetsPrefix)
    },
    children: ""
  };
}
class AppPipeline extends Pipeline {
  getName() {
    return "AppPipeline";
  }
  static create({ manifest: manifest2, streaming }) {
    const resolve = async function resolve2(specifier) {
      if (!(specifier in manifest2.entryModules)) {
        throw new Error(`Unable to resolve [${specifier}]`);
      }
      const bundlePath = manifest2.entryModules[specifier];
      if (bundlePath.startsWith("data:") || bundlePath.length === 0) {
        return bundlePath;
      } else {
        return createAssetLink(bundlePath, manifest2.base, manifest2.assetsPrefix);
      }
    };
    const logger = createConsoleLogger({ level: manifest2.logLevel });
    const pipeline = new AppPipeline(
      logger,
      manifest2,
      "production",
      manifest2.renderers,
      resolve,
      streaming,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0
    );
    return pipeline;
  }
  async headElements(routeData) {
    const { assetsPrefix, base } = this.manifest;
    const routeInfo = this.manifest.routes.find(
      (route) => route.routeData.route === routeData.route
    );
    const links = /* @__PURE__ */ new Set();
    const scripts = /* @__PURE__ */ new Set();
    const styles = createStylesheetElementSet(routeInfo?.styles ?? [], base, assetsPrefix);
    for (const script of routeInfo?.scripts ?? []) {
      if ("stage" in script) {
        if (script.stage === "head-inline") {
          scripts.add({
            props: {},
            children: script.children
          });
        }
      } else {
        scripts.add(createModuleScriptElement(script, base, assetsPrefix));
      }
    }
    return { links, styles, scripts };
  }
  componentMetadata() {
  }
  async getComponentByRoute(routeData) {
    const module = await this.getModuleForRoute(routeData);
    return module.page();
  }
  async getModuleForRoute(route) {
    for (const defaultRoute of this.defaultRoutes) {
      if (route.component === defaultRoute.component) {
        return {
          page: () => Promise.resolve(defaultRoute.instance)
        };
      }
    }
    let routeToProcess = route;
    if (routeIsRedirect(route)) {
      if (route.redirectRoute) {
        routeToProcess = route.redirectRoute;
      } else {
        return RedirectSinglePageBuiltModule;
      }
    } else if (routeIsFallback(route)) {
      routeToProcess = getFallbackRoute(route, this.manifest.routes);
    }
    if (this.manifest.pageMap) {
      const importComponentInstance = this.manifest.pageMap.get(routeToProcess.component);
      if (!importComponentInstance) {
        throw new Error(
          `Unexpectedly unable to find a component instance for route ${route.route}`
        );
      }
      return await importComponentInstance();
    } else if (this.manifest.pageModule) {
      return this.manifest.pageModule;
    }
    throw new Error(
      "Astro couldn't find the correct page to render, probably because it wasn't correctly mapped for SSR usage. This is an internal error, please file an issue."
    );
  }
  async tryRewrite(payload, request) {
    const { newUrl, pathname, routeData } = findRouteToRewrite({
      payload,
      request,
      routes: this.manifest?.routes.map((r) => r.routeData),
      trailingSlash: this.manifest.trailingSlash,
      buildFormat: this.manifest.buildFormat,
      base: this.manifest.base,
      outDir: this.manifest?.serverLike ? this.manifest.buildClientDir : this.manifest.outDir
    });
    const componentInstance = await this.getComponentByRoute(routeData);
    return { newUrl, pathname, componentInstance, routeData };
  }
}
class App extends BaseApp {
  createPipeline(streaming) {
    return AppPipeline.create({
      manifest: this.manifest,
      streaming
    });
  }
  isDev() {
    return false;
  }
  // Should we log something for our users?
  logRequest(_options) {
  }
}
var react = { exports: {} };
var react_production = {};
var hasRequiredReact_production;
function requireReact_production() {
  if (hasRequiredReact_production) return react_production;
  hasRequiredReact_production = 1;
  var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
  function getIteratorFn(maybeIterable) {
    if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
    maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
    return "function" === typeof maybeIterable ? maybeIterable : null;
  }
  var ReactNoopUpdateQueue = {
    isMounted: function() {
      return false;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, assign = Object.assign, emptyObject = {};
  function Component(props, context, updater) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
  }
  Component.prototype.isReactComponent = {};
  Component.prototype.setState = function(partialState, callback) {
    if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, partialState, callback, "setState");
  };
  Component.prototype.forceUpdate = function(callback) {
    this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
  };
  function ComponentDummy() {
  }
  ComponentDummy.prototype = Component.prototype;
  function PureComponent(props, context, updater) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
  }
  var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
  pureComponentPrototype.constructor = PureComponent;
  assign(pureComponentPrototype, Component.prototype);
  pureComponentPrototype.isPureReactComponent = true;
  var isArrayImpl = Array.isArray;
  function noop() {
  }
  var ReactSharedInternals = { H: null, A: null, T: null, S: null }, hasOwnProperty = Object.prototype.hasOwnProperty;
  function ReactElement(type, key, props) {
    var refProp = props.ref;
    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type,
      key,
      ref: void 0 !== refProp ? refProp : null,
      props
    };
  }
  function cloneAndReplaceKey(oldElement, newKey) {
    return ReactElement(oldElement.type, newKey, oldElement.props);
  }
  function isValidElement(object) {
    return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
  }
  function escape2(key) {
    var escaperLookup = { "=": "=0", ":": "=2" };
    return "$" + key.replace(/[=:]/g, function(match) {
      return escaperLookup[match];
    });
  }
  var userProvidedKeyEscapeRegex = /\/+/g;
  function getElementKey(element, index) {
    return "object" === typeof element && null !== element && null != element.key ? escape2("" + element.key) : index.toString(36);
  }
  function resolveThenable(thenable) {
    switch (thenable.status) {
      case "fulfilled":
        return thenable.value;
      case "rejected":
        throw thenable.reason;
      default:
        switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
          function(fulfilledValue) {
            "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
          },
          function(error2) {
            "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error2);
          }
        )), thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
        }
    }
    throw thenable;
  }
  function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
    var type = typeof children;
    if ("undefined" === type || "boolean" === type) children = null;
    var invokeCallback = false;
    if (null === children) invokeCallback = true;
    else
      switch (type) {
        case "bigint":
        case "string":
        case "number":
          invokeCallback = true;
          break;
        case "object":
          switch (children.$$typeof) {
            case REACT_ELEMENT_TYPE:
            case REACT_PORTAL_TYPE:
              invokeCallback = true;
              break;
            case REACT_LAZY_TYPE:
              return invokeCallback = children._init, mapIntoArray(
                invokeCallback(children._payload),
                array,
                escapedPrefix,
                nameSoFar,
                callback
              );
          }
      }
    if (invokeCallback)
      return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
        return c;
      })) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(
        callback,
        escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(
          userProvidedKeyEscapeRegex,
          "$&/"
        ) + "/") + invokeCallback
      )), array.push(callback)), 1;
    invokeCallback = 0;
    var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
    if (isArrayImpl(children))
      for (var i = 0; i < children.length; i++)
        nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
          nameSoFar,
          array,
          escapedPrefix,
          type,
          callback
        );
    else if (i = getIteratorFn(children), "function" === typeof i)
      for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
        nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
          nameSoFar,
          array,
          escapedPrefix,
          type,
          callback
        );
    else if ("object" === type) {
      if ("function" === typeof children.then)
        return mapIntoArray(
          resolveThenable(children),
          array,
          escapedPrefix,
          nameSoFar,
          callback
        );
      array = String(children);
      throw Error(
        "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return invokeCallback;
  }
  function mapChildren(children, func, context) {
    if (null == children) return children;
    var result = [], count = 0;
    mapIntoArray(children, result, "", "", function(child) {
      return func.call(context, child, count++);
    });
    return result;
  }
  function lazyInitializer(payload) {
    if (-1 === payload._status) {
      var ctor = payload._result;
      ctor = ctor();
      ctor.then(
        function(moduleObject) {
          if (0 === payload._status || -1 === payload._status)
            payload._status = 1, payload._result = moduleObject;
        },
        function(error2) {
          if (0 === payload._status || -1 === payload._status)
            payload._status = 2, payload._result = error2;
        }
      );
      -1 === payload._status && (payload._status = 0, payload._result = ctor);
    }
    if (1 === payload._status) return payload._result.default;
    throw payload._result;
  }
  var reportGlobalError = "function" === typeof reportError ? reportError : function(error2) {
    if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
      var event = new window.ErrorEvent("error", {
        bubbles: true,
        cancelable: true,
        message: "object" === typeof error2 && null !== error2 && "string" === typeof error2.message ? String(error2.message) : String(error2),
        error: error2
      });
      if (!window.dispatchEvent(event)) return;
    } else if ("object" === typeof process && "function" === typeof process.emit) {
      process.emit("uncaughtException", error2);
      return;
    }
    console.error(error2);
  }, Children = {
    map: mapChildren,
    forEach: function(children, forEachFunc, forEachContext) {
      mapChildren(
        children,
        function() {
          forEachFunc.apply(this, arguments);
        },
        forEachContext
      );
    },
    count: function(children) {
      var n = 0;
      mapChildren(children, function() {
        n++;
      });
      return n;
    },
    toArray: function(children) {
      return mapChildren(children, function(child) {
        return child;
      }) || [];
    },
    only: function(children) {
      if (!isValidElement(children))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return children;
    }
  };
  react_production.Activity = REACT_ACTIVITY_TYPE;
  react_production.Children = Children;
  react_production.Component = Component;
  react_production.Fragment = REACT_FRAGMENT_TYPE;
  react_production.Profiler = REACT_PROFILER_TYPE;
  react_production.PureComponent = PureComponent;
  react_production.StrictMode = REACT_STRICT_MODE_TYPE;
  react_production.Suspense = REACT_SUSPENSE_TYPE;
  react_production.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
  react_production.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(size) {
      return ReactSharedInternals.H.useMemoCache(size);
    }
  };
  react_production.cache = function(fn) {
    return function() {
      return fn.apply(null, arguments);
    };
  };
  react_production.cacheSignal = function() {
    return null;
  };
  react_production.cloneElement = function(element, config, children) {
    if (null === element || void 0 === element)
      throw Error(
        "The argument must be a React element, but you passed " + element + "."
      );
    var props = assign({}, element.props), key = element.key;
    if (null != config)
      for (propName in void 0 !== config.key && (key = "" + config.key), config)
        !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
    var propName = arguments.length - 2;
    if (1 === propName) props.children = children;
    else if (1 < propName) {
      for (var childArray = Array(propName), i = 0; i < propName; i++)
        childArray[i] = arguments[i + 2];
      props.children = childArray;
    }
    return ReactElement(element.type, key, props);
  };
  react_production.createContext = function(defaultValue) {
    defaultValue = {
      $$typeof: REACT_CONTEXT_TYPE,
      _currentValue: defaultValue,
      _currentValue2: defaultValue,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    };
    defaultValue.Provider = defaultValue;
    defaultValue.Consumer = {
      $$typeof: REACT_CONSUMER_TYPE,
      _context: defaultValue
    };
    return defaultValue;
  };
  react_production.createElement = function(type, config, children) {
    var propName, props = {}, key = null;
    if (null != config)
      for (propName in void 0 !== config.key && (key = "" + config.key), config)
        hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
    var childrenLength = arguments.length - 2;
    if (1 === childrenLength) props.children = children;
    else if (1 < childrenLength) {
      for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
        childArray[i] = arguments[i + 2];
      props.children = childArray;
    }
    if (type && type.defaultProps)
      for (propName in childrenLength = type.defaultProps, childrenLength)
        void 0 === props[propName] && (props[propName] = childrenLength[propName]);
    return ReactElement(type, key, props);
  };
  react_production.createRef = function() {
    return { current: null };
  };
  react_production.forwardRef = function(render) {
    return { $$typeof: REACT_FORWARD_REF_TYPE, render };
  };
  react_production.isValidElement = isValidElement;
  react_production.lazy = function(ctor) {
    return {
      $$typeof: REACT_LAZY_TYPE,
      _payload: { _status: -1, _result: ctor },
      _init: lazyInitializer
    };
  };
  react_production.memo = function(type, compare) {
    return {
      $$typeof: REACT_MEMO_TYPE,
      type,
      compare: void 0 === compare ? null : compare
    };
  };
  react_production.startTransition = function(scope) {
    var prevTransition = ReactSharedInternals.T, currentTransition = {};
    ReactSharedInternals.T = currentTransition;
    try {
      var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
      null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
      "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
    } catch (error2) {
      reportGlobalError(error2);
    } finally {
      null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
    }
  };
  react_production.unstable_useCacheRefresh = function() {
    return ReactSharedInternals.H.useCacheRefresh();
  };
  react_production.use = function(usable) {
    return ReactSharedInternals.H.use(usable);
  };
  react_production.useActionState = function(action, initialState, permalink) {
    return ReactSharedInternals.H.useActionState(action, initialState, permalink);
  };
  react_production.useCallback = function(callback, deps) {
    return ReactSharedInternals.H.useCallback(callback, deps);
  };
  react_production.useContext = function(Context) {
    return ReactSharedInternals.H.useContext(Context);
  };
  react_production.useDebugValue = function() {
  };
  react_production.useDeferredValue = function(value, initialValue) {
    return ReactSharedInternals.H.useDeferredValue(value, initialValue);
  };
  react_production.useEffect = function(create, deps) {
    return ReactSharedInternals.H.useEffect(create, deps);
  };
  react_production.useEffectEvent = function(callback) {
    return ReactSharedInternals.H.useEffectEvent(callback);
  };
  react_production.useId = function() {
    return ReactSharedInternals.H.useId();
  };
  react_production.useImperativeHandle = function(ref, create, deps) {
    return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
  };
  react_production.useInsertionEffect = function(create, deps) {
    return ReactSharedInternals.H.useInsertionEffect(create, deps);
  };
  react_production.useLayoutEffect = function(create, deps) {
    return ReactSharedInternals.H.useLayoutEffect(create, deps);
  };
  react_production.useMemo = function(create, deps) {
    return ReactSharedInternals.H.useMemo(create, deps);
  };
  react_production.useOptimistic = function(passthrough, reducer) {
    return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
  };
  react_production.useReducer = function(reducer, initialArg, init) {
    return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
  };
  react_production.useRef = function(initialValue) {
    return ReactSharedInternals.H.useRef(initialValue);
  };
  react_production.useState = function(initialState) {
    return ReactSharedInternals.H.useState(initialState);
  };
  react_production.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
    return ReactSharedInternals.H.useSyncExternalStore(
      subscribe,
      getSnapshot,
      getServerSnapshot
    );
  };
  react_production.useTransition = function() {
    return ReactSharedInternals.H.useTransition();
  };
  react_production.version = "19.2.6";
  return react_production;
}
var hasRequiredReact;
function requireReact() {
  if (hasRequiredReact) return react.exports;
  hasRequiredReact = 1;
  {
    react.exports = requireReact_production();
  }
  return react.exports;
}
var reactExports = requireReact();
const React = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
const React$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: React
}, [reactExports]);
var server_edge = {};
var reactDomServer_edge_production = {};
var reactDom = { exports: {} };
var reactDom_production = {};
var hasRequiredReactDom_production;
function requireReactDom_production() {
  if (hasRequiredReactDom_production) return reactDom_production;
  hasRequiredReactDom_production = 1;
  var React2 = requireReact();
  function formatProdErrorMessage(code) {
    var url = "https://react.dev/errors/" + code;
    if (1 < arguments.length) {
      url += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var i = 2; i < arguments.length; i++)
        url += "&args[]=" + encodeURIComponent(arguments[i]);
    }
    return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function noop() {
  }
  var Internals = {
    d: {
      f: noop,
      r: function() {
        throw Error(formatProdErrorMessage(522));
      },
      D: noop,
      C: noop,
      L: noop,
      m: noop,
      X: noop,
      S: noop,
      M: noop
    },
    p: 0,
    findDOMNode: null
  }, REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
  function createPortal$1(children, containerInfo, implementation) {
    var key = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
    return {
      $$typeof: REACT_PORTAL_TYPE,
      key: null == key ? null : "" + key,
      children,
      containerInfo,
      implementation
    };
  }
  var ReactSharedInternals = React2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function getCrossOriginStringAs(as, input) {
    if ("font" === as) return "";
    if ("string" === typeof input)
      return "use-credentials" === input ? input : "";
  }
  reactDom_production.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals;
  reactDom_production.createPortal = function(children, container) {
    var key = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
    if (!container || 1 !== container.nodeType && 9 !== container.nodeType && 11 !== container.nodeType)
      throw Error(formatProdErrorMessage(299));
    return createPortal$1(children, container, null, key);
  };
  reactDom_production.flushSync = function(fn) {
    var previousTransition = ReactSharedInternals.T, previousUpdatePriority = Internals.p;
    try {
      if (ReactSharedInternals.T = null, Internals.p = 2, fn) return fn();
    } finally {
      ReactSharedInternals.T = previousTransition, Internals.p = previousUpdatePriority, Internals.d.f();
    }
  };
  reactDom_production.preconnect = function(href, options) {
    "string" === typeof href && (options ? (options = options.crossOrigin, options = "string" === typeof options ? "use-credentials" === options ? options : "" : void 0) : options = null, Internals.d.C(href, options));
  };
  reactDom_production.prefetchDNS = function(href) {
    "string" === typeof href && Internals.d.D(href);
  };
  reactDom_production.preinit = function(href, options) {
    if ("string" === typeof href && options && "string" === typeof options.as) {
      var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = "string" === typeof options.integrity ? options.integrity : void 0, fetchPriority = "string" === typeof options.fetchPriority ? options.fetchPriority : void 0;
      "style" === as ? Internals.d.S(
        href,
        "string" === typeof options.precedence ? options.precedence : void 0,
        {
          crossOrigin,
          integrity,
          fetchPriority
        }
      ) : "script" === as && Internals.d.X(href, {
        crossOrigin,
        integrity,
        fetchPriority,
        nonce: "string" === typeof options.nonce ? options.nonce : void 0
      });
    }
  };
  reactDom_production.preinitModule = function(href, options) {
    if ("string" === typeof href)
      if ("object" === typeof options && null !== options) {
        if (null == options.as || "script" === options.as) {
          var crossOrigin = getCrossOriginStringAs(
            options.as,
            options.crossOrigin
          );
          Internals.d.M(href, {
            crossOrigin,
            integrity: "string" === typeof options.integrity ? options.integrity : void 0,
            nonce: "string" === typeof options.nonce ? options.nonce : void 0
          });
        }
      } else null == options && Internals.d.M(href);
  };
  reactDom_production.preload = function(href, options) {
    if ("string" === typeof href && "object" === typeof options && null !== options && "string" === typeof options.as) {
      var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
      Internals.d.L(href, as, {
        crossOrigin,
        integrity: "string" === typeof options.integrity ? options.integrity : void 0,
        nonce: "string" === typeof options.nonce ? options.nonce : void 0,
        type: "string" === typeof options.type ? options.type : void 0,
        fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0,
        referrerPolicy: "string" === typeof options.referrerPolicy ? options.referrerPolicy : void 0,
        imageSrcSet: "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
        imageSizes: "string" === typeof options.imageSizes ? options.imageSizes : void 0,
        media: "string" === typeof options.media ? options.media : void 0
      });
    }
  };
  reactDom_production.preloadModule = function(href, options) {
    if ("string" === typeof href)
      if (options) {
        var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
        Internals.d.m(href, {
          as: "string" === typeof options.as && "script" !== options.as ? options.as : void 0,
          crossOrigin,
          integrity: "string" === typeof options.integrity ? options.integrity : void 0
        });
      } else Internals.d.m(href);
  };
  reactDom_production.requestFormReset = function(form) {
    Internals.d.r(form);
  };
  reactDom_production.unstable_batchedUpdates = function(fn, a) {
    return fn(a);
  };
  reactDom_production.useFormState = function(action, initialState, permalink) {
    return ReactSharedInternals.H.useFormState(action, initialState, permalink);
  };
  reactDom_production.useFormStatus = function() {
    return ReactSharedInternals.H.useHostTransitionStatus();
  };
  reactDom_production.version = "19.2.6";
  return reactDom_production;
}
var hasRequiredReactDom;
function requireReactDom() {
  if (hasRequiredReactDom) return reactDom.exports;
  hasRequiredReactDom = 1;
  function checkDCE() {
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
      return;
    }
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
    } catch (err) {
      console.error(err);
    }
  }
  {
    checkDCE();
    reactDom.exports = requireReactDom_production();
  }
  return reactDom.exports;
}
var hasRequiredReactDomServer_edge_production;
function requireReactDomServer_edge_production() {
  if (hasRequiredReactDomServer_edge_production) return reactDomServer_edge_production;
  hasRequiredReactDomServer_edge_production = 1;
  var React2 = requireReact(), ReactDOM2 = requireReactDom(), REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_SCOPE_TYPE = /* @__PURE__ */ Symbol.for("react.scope"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), REACT_LEGACY_HIDDEN_TYPE = /* @__PURE__ */ Symbol.for("react.legacy_hidden"), REACT_MEMO_CACHE_SENTINEL = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel"), REACT_VIEW_TRANSITION_TYPE = /* @__PURE__ */ Symbol.for("react.view_transition"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
  function getIteratorFn(maybeIterable) {
    if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
    maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
    return "function" === typeof maybeIterable ? maybeIterable : null;
  }
  var isArrayImpl = Array.isArray;
  function murmurhash3_32_gc(key, seed) {
    var remainder = key.length & 3;
    var bytes = key.length - remainder;
    var h1 = seed;
    for (seed = 0; seed < bytes; ) {
      var k1 = key.charCodeAt(seed) & 255 | (key.charCodeAt(++seed) & 255) << 8 | (key.charCodeAt(++seed) & 255) << 16 | (key.charCodeAt(++seed) & 255) << 24;
      ++seed;
      k1 = 3432918353 * (k1 & 65535) + ((3432918353 * (k1 >>> 16) & 65535) << 16) & 4294967295;
      k1 = k1 << 15 | k1 >>> 17;
      k1 = 461845907 * (k1 & 65535) + ((461845907 * (k1 >>> 16) & 65535) << 16) & 4294967295;
      h1 ^= k1;
      h1 = h1 << 13 | h1 >>> 19;
      h1 = 5 * (h1 & 65535) + ((5 * (h1 >>> 16) & 65535) << 16) & 4294967295;
      h1 = (h1 & 65535) + 27492 + (((h1 >>> 16) + 58964 & 65535) << 16);
    }
    k1 = 0;
    switch (remainder) {
      case 3:
        k1 ^= (key.charCodeAt(seed + 2) & 255) << 16;
      case 2:
        k1 ^= (key.charCodeAt(seed + 1) & 255) << 8;
      case 1:
        k1 ^= key.charCodeAt(seed) & 255, k1 = 3432918353 * (k1 & 65535) + ((3432918353 * (k1 >>> 16) & 65535) << 16) & 4294967295, k1 = k1 << 15 | k1 >>> 17, h1 ^= 461845907 * (k1 & 65535) + ((461845907 * (k1 >>> 16) & 65535) << 16) & 4294967295;
    }
    h1 ^= key.length;
    h1 ^= h1 >>> 16;
    h1 = 2246822507 * (h1 & 65535) + ((2246822507 * (h1 >>> 16) & 65535) << 16) & 4294967295;
    h1 ^= h1 >>> 13;
    h1 = 3266489909 * (h1 & 65535) + ((3266489909 * (h1 >>> 16) & 65535) << 16) & 4294967295;
    return (h1 ^ h1 >>> 16) >>> 0;
  }
  function handleErrorInNextTick(error2) {
    setTimeout(function() {
      throw error2;
    });
  }
  var LocalPromise = Promise, scheduleMicrotask = "function" === typeof queueMicrotask ? queueMicrotask : function(callback) {
    LocalPromise.resolve(null).then(callback).catch(handleErrorInNextTick);
  }, currentView = null, writtenBytes = 0;
  function writeChunk(destination, chunk) {
    if (0 !== chunk.byteLength)
      if (2048 < chunk.byteLength)
        0 < writtenBytes && (destination.enqueue(
          new Uint8Array(currentView.buffer, 0, writtenBytes)
        ), currentView = new Uint8Array(2048), writtenBytes = 0), destination.enqueue(chunk);
      else {
        var allowableBytes = currentView.length - writtenBytes;
        allowableBytes < chunk.byteLength && (0 === allowableBytes ? destination.enqueue(currentView) : (currentView.set(chunk.subarray(0, allowableBytes), writtenBytes), destination.enqueue(currentView), chunk = chunk.subarray(allowableBytes)), currentView = new Uint8Array(2048), writtenBytes = 0);
        currentView.set(chunk, writtenBytes);
        writtenBytes += chunk.byteLength;
      }
  }
  function writeChunkAndReturn(destination, chunk) {
    writeChunk(destination, chunk);
    return true;
  }
  function completeWriting(destination) {
    currentView && 0 < writtenBytes && (destination.enqueue(new Uint8Array(currentView.buffer, 0, writtenBytes)), currentView = null, writtenBytes = 0);
  }
  var textEncoder = new TextEncoder();
  function stringToChunk(content) {
    return textEncoder.encode(content);
  }
  function stringToPrecomputedChunk(content) {
    return textEncoder.encode(content);
  }
  function byteLengthOfChunk(chunk) {
    return chunk.byteLength;
  }
  function closeWithError(destination, error2) {
    "function" === typeof destination.error ? destination.error(error2) : destination.close();
  }
  var assign = Object.assign, hasOwnProperty = Object.prototype.hasOwnProperty, VALID_ATTRIBUTE_NAME_REGEX = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), illegalAttributeNameCache = {}, validatedAttributeNameCache = {};
  function isAttributeNameSafe(attributeName) {
    if (hasOwnProperty.call(validatedAttributeNameCache, attributeName))
      return true;
    if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) return false;
    if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName))
      return validatedAttributeNameCache[attributeName] = true;
    illegalAttributeNameCache[attributeName] = true;
    return false;
  }
  var unitlessNumbers = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  ), aliases = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), matchHtmlRegExp = /["'&<>]/;
  function escapeTextForBrowser(text) {
    if ("boolean" === typeof text || "number" === typeof text || "bigint" === typeof text)
      return "" + text;
    text = "" + text;
    var match = matchHtmlRegExp.exec(text);
    if (match) {
      var html = "", index, lastIndex = 0;
      for (index = match.index; index < text.length; index++) {
        switch (text.charCodeAt(index)) {
          case 34:
            match = "&quot;";
            break;
          case 38:
            match = "&amp;";
            break;
          case 39:
            match = "&#x27;";
            break;
          case 60:
            match = "&lt;";
            break;
          case 62:
            match = "&gt;";
            break;
          default:
            continue;
        }
        lastIndex !== index && (html += text.slice(lastIndex, index));
        lastIndex = index + 1;
        html += match;
      }
      text = lastIndex !== index ? html + text.slice(lastIndex, index) : html;
    }
    return text;
  }
  var uppercasePattern = /([A-Z])/g, msPattern = /^ms-/, isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function sanitizeURL(url) {
    return isJavaScriptProtocol.test("" + url) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : url;
  }
  var ReactSharedInternals = React2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ReactDOMSharedInternals = ReactDOM2.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, sharedNotPendingObject = {
    pending: false,
    data: null,
    method: null,
    action: null
  }, previousDispatcher = ReactDOMSharedInternals.d;
  ReactDOMSharedInternals.d = {
    f: previousDispatcher.f,
    r: previousDispatcher.r,
    D: prefetchDNS,
    C: preconnect,
    L: preload,
    m: preloadModule,
    X: preinitScript,
    S: preinitStyle,
    M: preinitModuleScript
  };
  var PRELOAD_NO_CREDS = [], currentlyFlushingRenderState = null;
  stringToPrecomputedChunk('"></template>');
  var startInlineScript = stringToPrecomputedChunk("<script"), endInlineScript = stringToPrecomputedChunk("<\/script>"), startScriptSrc = stringToPrecomputedChunk('<script src="'), startModuleSrc = stringToPrecomputedChunk('<script type="module" src="'), scriptNonce = stringToPrecomputedChunk(' nonce="'), scriptIntegirty = stringToPrecomputedChunk(' integrity="'), scriptCrossOrigin = stringToPrecomputedChunk(' crossorigin="'), endAsyncScript = stringToPrecomputedChunk(' async=""><\/script>'), startInlineStyle = stringToPrecomputedChunk("<style"), scriptRegex = /(<\/|<)(s)(cript)/gi;
  function scriptReplacer(match, prefix2, s2, suffix2) {
    return "" + prefix2 + ("s" === s2 ? "\\u0073" : "\\u0053") + suffix2;
  }
  var importMapScriptStart = stringToPrecomputedChunk(
    '<script type="importmap">'
  ), importMapScriptEnd = stringToPrecomputedChunk("<\/script>");
  function createRenderState(resumableState, nonce, externalRuntimeConfig, importMap, onHeaders, maxHeadersLength) {
    externalRuntimeConfig = "string" === typeof nonce ? nonce : nonce && nonce.script;
    var inlineScriptWithNonce = void 0 === externalRuntimeConfig ? startInlineScript : stringToPrecomputedChunk(
      '<script nonce="' + escapeTextForBrowser(externalRuntimeConfig) + '"'
    ), nonceStyle = "string" === typeof nonce ? void 0 : nonce && nonce.style, inlineStyleWithNonce = void 0 === nonceStyle ? startInlineStyle : stringToPrecomputedChunk(
      '<style nonce="' + escapeTextForBrowser(nonceStyle) + '"'
    ), idPrefix = resumableState.idPrefix, bootstrapChunks = [], bootstrapScriptContent = resumableState.bootstrapScriptContent, bootstrapScripts = resumableState.bootstrapScripts, bootstrapModules = resumableState.bootstrapModules;
    void 0 !== bootstrapScriptContent && (bootstrapChunks.push(inlineScriptWithNonce), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(
      endOfStartTag,
      stringToChunk(
        ("" + bootstrapScriptContent).replace(scriptRegex, scriptReplacer)
      ),
      endInlineScript
    ));
    bootstrapScriptContent = [];
    void 0 !== importMap && (bootstrapScriptContent.push(importMapScriptStart), bootstrapScriptContent.push(
      stringToChunk(
        ("" + JSON.stringify(importMap)).replace(scriptRegex, scriptReplacer)
      )
    ), bootstrapScriptContent.push(importMapScriptEnd));
    importMap = onHeaders ? {
      preconnects: "",
      fontPreloads: "",
      highImagePreloads: "",
      remainingCapacity: 2 + ("number" === typeof maxHeadersLength ? maxHeadersLength : 2e3)
    } : null;
    onHeaders = {
      placeholderPrefix: stringToPrecomputedChunk(idPrefix + "P:"),
      segmentPrefix: stringToPrecomputedChunk(idPrefix + "S:"),
      boundaryPrefix: stringToPrecomputedChunk(idPrefix + "B:"),
      startInlineScript: inlineScriptWithNonce,
      startInlineStyle: inlineStyleWithNonce,
      preamble: createPreambleState(),
      externalRuntimeScript: null,
      bootstrapChunks,
      importMapChunks: bootstrapScriptContent,
      onHeaders,
      headers: importMap,
      resets: {
        font: {},
        dns: {},
        connect: { default: {}, anonymous: {}, credentials: {} },
        image: {},
        style: {}
      },
      charsetChunks: [],
      viewportChunks: [],
      hoistableChunks: [],
      preconnects: /* @__PURE__ */ new Set(),
      fontPreloads: /* @__PURE__ */ new Set(),
      highImagePreloads: /* @__PURE__ */ new Set(),
      styles: /* @__PURE__ */ new Map(),
      bootstrapScripts: /* @__PURE__ */ new Set(),
      scripts: /* @__PURE__ */ new Set(),
      bulkPreloads: /* @__PURE__ */ new Set(),
      preloads: {
        images: /* @__PURE__ */ new Map(),
        stylesheets: /* @__PURE__ */ new Map(),
        scripts: /* @__PURE__ */ new Map(),
        moduleScripts: /* @__PURE__ */ new Map()
      },
      nonce: { script: externalRuntimeConfig, style: nonceStyle },
      hoistableState: null,
      stylesToHoist: false
    };
    if (void 0 !== bootstrapScripts)
      for (importMap = 0; importMap < bootstrapScripts.length; importMap++)
        idPrefix = bootstrapScripts[importMap], nonceStyle = inlineScriptWithNonce = void 0, inlineStyleWithNonce = {
          rel: "preload",
          as: "script",
          fetchPriority: "low",
          nonce
        }, "string" === typeof idPrefix ? inlineStyleWithNonce.href = maxHeadersLength = idPrefix : (inlineStyleWithNonce.href = maxHeadersLength = idPrefix.src, inlineStyleWithNonce.integrity = nonceStyle = "string" === typeof idPrefix.integrity ? idPrefix.integrity : void 0, inlineStyleWithNonce.crossOrigin = inlineScriptWithNonce = "string" === typeof idPrefix || null == idPrefix.crossOrigin ? void 0 : "use-credentials" === idPrefix.crossOrigin ? "use-credentials" : ""), idPrefix = resumableState, bootstrapScriptContent = maxHeadersLength, idPrefix.scriptResources[bootstrapScriptContent] = null, idPrefix.moduleScriptResources[bootstrapScriptContent] = null, idPrefix = [], pushLinkImpl(idPrefix, inlineStyleWithNonce), onHeaders.bootstrapScripts.add(idPrefix), bootstrapChunks.push(
          startScriptSrc,
          stringToChunk(escapeTextForBrowser(maxHeadersLength)),
          attributeEnd
        ), externalRuntimeConfig && bootstrapChunks.push(
          scriptNonce,
          stringToChunk(escapeTextForBrowser(externalRuntimeConfig)),
          attributeEnd
        ), "string" === typeof nonceStyle && bootstrapChunks.push(
          scriptIntegirty,
          stringToChunk(escapeTextForBrowser(nonceStyle)),
          attributeEnd
        ), "string" === typeof inlineScriptWithNonce && bootstrapChunks.push(
          scriptCrossOrigin,
          stringToChunk(escapeTextForBrowser(inlineScriptWithNonce)),
          attributeEnd
        ), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(endAsyncScript);
    if (void 0 !== bootstrapModules)
      for (nonce = 0; nonce < bootstrapModules.length; nonce++)
        nonceStyle = bootstrapModules[nonce], maxHeadersLength = importMap = void 0, inlineScriptWithNonce = {
          rel: "modulepreload",
          fetchPriority: "low",
          nonce: externalRuntimeConfig
        }, "string" === typeof nonceStyle ? inlineScriptWithNonce.href = bootstrapScripts = nonceStyle : (inlineScriptWithNonce.href = bootstrapScripts = nonceStyle.src, inlineScriptWithNonce.integrity = maxHeadersLength = "string" === typeof nonceStyle.integrity ? nonceStyle.integrity : void 0, inlineScriptWithNonce.crossOrigin = importMap = "string" === typeof nonceStyle || null == nonceStyle.crossOrigin ? void 0 : "use-credentials" === nonceStyle.crossOrigin ? "use-credentials" : ""), nonceStyle = resumableState, inlineStyleWithNonce = bootstrapScripts, nonceStyle.scriptResources[inlineStyleWithNonce] = null, nonceStyle.moduleScriptResources[inlineStyleWithNonce] = null, nonceStyle = [], pushLinkImpl(nonceStyle, inlineScriptWithNonce), onHeaders.bootstrapScripts.add(nonceStyle), bootstrapChunks.push(
          startModuleSrc,
          stringToChunk(escapeTextForBrowser(bootstrapScripts)),
          attributeEnd
        ), externalRuntimeConfig && bootstrapChunks.push(
          scriptNonce,
          stringToChunk(escapeTextForBrowser(externalRuntimeConfig)),
          attributeEnd
        ), "string" === typeof maxHeadersLength && bootstrapChunks.push(
          scriptIntegirty,
          stringToChunk(escapeTextForBrowser(maxHeadersLength)),
          attributeEnd
        ), "string" === typeof importMap && bootstrapChunks.push(
          scriptCrossOrigin,
          stringToChunk(escapeTextForBrowser(importMap)),
          attributeEnd
        ), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(endAsyncScript);
    return onHeaders;
  }
  function createResumableState(identifierPrefix, externalRuntimeConfig, bootstrapScriptContent, bootstrapScripts, bootstrapModules) {
    return {
      idPrefix: void 0 === identifierPrefix ? "" : identifierPrefix,
      nextFormID: 0,
      streamingFormat: 0,
      bootstrapScriptContent,
      bootstrapScripts,
      bootstrapModules,
      instructions: 0,
      hasBody: false,
      hasHtml: false,
      unknownResources: {},
      dnsResources: {},
      connectResources: { default: {}, anonymous: {}, credentials: {} },
      imageResources: {},
      styleResources: {},
      scriptResources: {},
      moduleUnknownResources: {},
      moduleScriptResources: {}
    };
  }
  function createPreambleState() {
    return { htmlChunks: null, headChunks: null, bodyChunks: null };
  }
  function createFormatContext(insertionMode, selectedValue, tagScope, viewTransition) {
    return {
      insertionMode,
      selectedValue,
      tagScope,
      viewTransition
    };
  }
  function createRootFormatContext(namespaceURI) {
    return createFormatContext(
      "http://www.w3.org/2000/svg" === namespaceURI ? 4 : "http://www.w3.org/1998/Math/MathML" === namespaceURI ? 5 : 0,
      null,
      0,
      null
    );
  }
  function getChildFormatContext(parentContext, type, props) {
    var subtreeScope = parentContext.tagScope & -25;
    switch (type) {
      case "noscript":
        return createFormatContext(2, null, subtreeScope | 1, null);
      case "select":
        return createFormatContext(
          2,
          null != props.value ? props.value : props.defaultValue,
          subtreeScope,
          null
        );
      case "svg":
        return createFormatContext(4, null, subtreeScope, null);
      case "picture":
        return createFormatContext(2, null, subtreeScope | 2, null);
      case "math":
        return createFormatContext(5, null, subtreeScope, null);
      case "foreignObject":
        return createFormatContext(2, null, subtreeScope, null);
      case "table":
        return createFormatContext(6, null, subtreeScope, null);
      case "thead":
      case "tbody":
      case "tfoot":
        return createFormatContext(7, null, subtreeScope, null);
      case "colgroup":
        return createFormatContext(9, null, subtreeScope, null);
      case "tr":
        return createFormatContext(8, null, subtreeScope, null);
      case "head":
        if (2 > parentContext.insertionMode)
          return createFormatContext(3, null, subtreeScope, null);
        break;
      case "html":
        if (0 === parentContext.insertionMode)
          return createFormatContext(1, null, subtreeScope, null);
    }
    return 6 <= parentContext.insertionMode || 2 > parentContext.insertionMode ? createFormatContext(2, null, subtreeScope, null) : parentContext.tagScope !== subtreeScope ? createFormatContext(
      parentContext.insertionMode,
      parentContext.selectedValue,
      subtreeScope,
      null
    ) : parentContext;
  }
  function getSuspenseViewTransition(parentViewTransition) {
    return null === parentViewTransition ? null : {
      update: parentViewTransition.update,
      enter: "none",
      exit: "none",
      share: parentViewTransition.update,
      name: parentViewTransition.autoName,
      autoName: parentViewTransition.autoName,
      nameIdx: 0
    };
  }
  function getSuspenseFallbackFormatContext(resumableState, parentContext) {
    parentContext.tagScope & 32 && (resumableState.instructions |= 128);
    return createFormatContext(
      parentContext.insertionMode,
      parentContext.selectedValue,
      parentContext.tagScope | 12,
      getSuspenseViewTransition(parentContext.viewTransition)
    );
  }
  function getSuspenseContentFormatContext(resumableState, parentContext) {
    resumableState = getSuspenseViewTransition(parentContext.viewTransition);
    var subtreeScope = parentContext.tagScope | 16;
    null !== resumableState && "none" !== resumableState.share && (subtreeScope |= 64);
    return createFormatContext(
      parentContext.insertionMode,
      parentContext.selectedValue,
      subtreeScope,
      resumableState
    );
  }
  var textSeparator = stringToPrecomputedChunk("<!-- -->");
  function pushTextInstance(target, text, renderState, textEmbedded) {
    if ("" === text) return textEmbedded;
    textEmbedded && target.push(textSeparator);
    target.push(stringToChunk(escapeTextForBrowser(text)));
    return true;
  }
  var styleNameCache = /* @__PURE__ */ new Map(), styleAttributeStart = stringToPrecomputedChunk(' style="'), styleAssign = stringToPrecomputedChunk(":"), styleSeparator = stringToPrecomputedChunk(";");
  function pushStyleAttribute(target, style) {
    if ("object" !== typeof style)
      throw Error(
        "The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX."
      );
    var isFirst = true, styleName;
    for (styleName in style)
      if (hasOwnProperty.call(style, styleName)) {
        var styleValue = style[styleName];
        if (null != styleValue && "boolean" !== typeof styleValue && "" !== styleValue) {
          if (0 === styleName.indexOf("--")) {
            var nameChunk = stringToChunk(escapeTextForBrowser(styleName));
            styleValue = stringToChunk(
              escapeTextForBrowser(("" + styleValue).trim())
            );
          } else
            nameChunk = styleNameCache.get(styleName), void 0 === nameChunk && (nameChunk = stringToPrecomputedChunk(
              escapeTextForBrowser(
                styleName.replace(uppercasePattern, "-$1").toLowerCase().replace(msPattern, "-ms-")
              )
            ), styleNameCache.set(styleName, nameChunk)), styleValue = "number" === typeof styleValue ? 0 === styleValue || unitlessNumbers.has(styleName) ? stringToChunk("" + styleValue) : stringToChunk(styleValue + "px") : stringToChunk(
              escapeTextForBrowser(("" + styleValue).trim())
            );
          isFirst ? (isFirst = false, target.push(
            styleAttributeStart,
            nameChunk,
            styleAssign,
            styleValue
          )) : target.push(styleSeparator, nameChunk, styleAssign, styleValue);
        }
      }
    isFirst || target.push(attributeEnd);
  }
  var attributeSeparator = stringToPrecomputedChunk(" "), attributeAssign = stringToPrecomputedChunk('="'), attributeEnd = stringToPrecomputedChunk('"'), attributeEmptyString = stringToPrecomputedChunk('=""');
  function pushBooleanAttribute(target, name, value) {
    value && "function" !== typeof value && "symbol" !== typeof value && target.push(attributeSeparator, stringToChunk(name), attributeEmptyString);
  }
  function pushStringAttribute(target, name, value) {
    "function" !== typeof value && "symbol" !== typeof value && "boolean" !== typeof value && target.push(
      attributeSeparator,
      stringToChunk(name),
      attributeAssign,
      stringToChunk(escapeTextForBrowser(value)),
      attributeEnd
    );
  }
  var actionJavaScriptURL = stringToPrecomputedChunk(
    escapeTextForBrowser(
      "javascript:throw new Error('React form unexpectedly submitted.')"
    )
  ), startHiddenInputChunk = stringToPrecomputedChunk('<input type="hidden"');
  function pushAdditionalFormField(value, key) {
    this.push(startHiddenInputChunk);
    validateAdditionalFormField(value);
    pushStringAttribute(this, "name", key);
    pushStringAttribute(this, "value", value);
    this.push(endOfStartTagSelfClosing);
  }
  function validateAdditionalFormField(value) {
    if ("string" !== typeof value)
      throw Error(
        "File/Blob fields are not yet supported in progressive forms. Will fallback to client hydration."
      );
  }
  function getCustomFormFields(resumableState, formAction) {
    if ("function" === typeof formAction.$$FORM_ACTION) {
      var id = resumableState.nextFormID++;
      resumableState = resumableState.idPrefix + id;
      try {
        var customFields = formAction.$$FORM_ACTION(resumableState);
        if (customFields) {
          var formData = customFields.data;
          null != formData && formData.forEach(validateAdditionalFormField);
        }
        return customFields;
      } catch (x) {
        if ("object" === typeof x && null !== x && "function" === typeof x.then)
          throw x;
      }
    }
    return null;
  }
  function pushFormActionAttribute(target, resumableState, renderState, formAction, formEncType, formMethod, formTarget, name) {
    var formData = null;
    if ("function" === typeof formAction) {
      var customFields = getCustomFormFields(resumableState, formAction);
      null !== customFields ? (name = customFields.name, formAction = customFields.action || "", formEncType = customFields.encType, formMethod = customFields.method, formTarget = customFields.target, formData = customFields.data) : (target.push(
        attributeSeparator,
        stringToChunk("formAction"),
        attributeAssign,
        actionJavaScriptURL,
        attributeEnd
      ), formTarget = formMethod = formEncType = formAction = name = null, injectFormReplayingRuntime(resumableState, renderState));
    }
    null != name && pushAttribute(target, "name", name);
    null != formAction && pushAttribute(target, "formAction", formAction);
    null != formEncType && pushAttribute(target, "formEncType", formEncType);
    null != formMethod && pushAttribute(target, "formMethod", formMethod);
    null != formTarget && pushAttribute(target, "formTarget", formTarget);
    return formData;
  }
  function pushAttribute(target, name, value) {
    switch (name) {
      case "className":
        pushStringAttribute(target, "class", value);
        break;
      case "tabIndex":
        pushStringAttribute(target, "tabindex", value);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        pushStringAttribute(target, name, value);
        break;
      case "style":
        pushStyleAttribute(target, value);
        break;
      case "src":
      case "href":
        if ("" === value) break;
      case "action":
      case "formAction":
        if (null == value || "function" === typeof value || "symbol" === typeof value || "boolean" === typeof value)
          break;
        value = sanitizeURL("" + value);
        target.push(
          attributeSeparator,
          stringToChunk(name),
          attributeAssign,
          stringToChunk(escapeTextForBrowser(value)),
          attributeEnd
        );
        break;
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "ref":
        break;
      case "autoFocus":
      case "multiple":
      case "muted":
        pushBooleanAttribute(target, name.toLowerCase(), value);
        break;
      case "xlinkHref":
        if ("function" === typeof value || "symbol" === typeof value || "boolean" === typeof value)
          break;
        value = sanitizeURL("" + value);
        target.push(
          attributeSeparator,
          stringToChunk("xlink:href"),
          attributeAssign,
          stringToChunk(escapeTextForBrowser(value)),
          attributeEnd
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        "function" !== typeof value && "symbol" !== typeof value && target.push(
          attributeSeparator,
          stringToChunk(name),
          attributeAssign,
          stringToChunk(escapeTextForBrowser(value)),
          attributeEnd
        );
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        value && "function" !== typeof value && "symbol" !== typeof value && target.push(
          attributeSeparator,
          stringToChunk(name),
          attributeEmptyString
        );
        break;
      case "capture":
      case "download":
        true === value ? target.push(
          attributeSeparator,
          stringToChunk(name),
          attributeEmptyString
        ) : false !== value && "function" !== typeof value && "symbol" !== typeof value && target.push(
          attributeSeparator,
          stringToChunk(name),
          attributeAssign,
          stringToChunk(escapeTextForBrowser(value)),
          attributeEnd
        );
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        "function" !== typeof value && "symbol" !== typeof value && !isNaN(value) && 1 <= value && target.push(
          attributeSeparator,
          stringToChunk(name),
          attributeAssign,
          stringToChunk(escapeTextForBrowser(value)),
          attributeEnd
        );
        break;
      case "rowSpan":
      case "start":
        "function" === typeof value || "symbol" === typeof value || isNaN(value) || target.push(
          attributeSeparator,
          stringToChunk(name),
          attributeAssign,
          stringToChunk(escapeTextForBrowser(value)),
          attributeEnd
        );
        break;
      case "xlinkActuate":
        pushStringAttribute(target, "xlink:actuate", value);
        break;
      case "xlinkArcrole":
        pushStringAttribute(target, "xlink:arcrole", value);
        break;
      case "xlinkRole":
        pushStringAttribute(target, "xlink:role", value);
        break;
      case "xlinkShow":
        pushStringAttribute(target, "xlink:show", value);
        break;
      case "xlinkTitle":
        pushStringAttribute(target, "xlink:title", value);
        break;
      case "xlinkType":
        pushStringAttribute(target, "xlink:type", value);
        break;
      case "xmlBase":
        pushStringAttribute(target, "xml:base", value);
        break;
      case "xmlLang":
        pushStringAttribute(target, "xml:lang", value);
        break;
      case "xmlSpace":
        pushStringAttribute(target, "xml:space", value);
        break;
      default:
        if (!(2 < name.length) || "o" !== name[0] && "O" !== name[0] || "n" !== name[1] && "N" !== name[1]) {
          if (name = aliases.get(name) || name, isAttributeNameSafe(name)) {
            switch (typeof value) {
              case "function":
              case "symbol":
                return;
              case "boolean":
                var prefix$8 = name.toLowerCase().slice(0, 5);
                if ("data-" !== prefix$8 && "aria-" !== prefix$8) return;
            }
            target.push(
              attributeSeparator,
              stringToChunk(name),
              attributeAssign,
              stringToChunk(escapeTextForBrowser(value)),
              attributeEnd
            );
          }
        }
    }
  }
  var endOfStartTag = stringToPrecomputedChunk(">"), endOfStartTagSelfClosing = stringToPrecomputedChunk("/>");
  function pushInnerHTML(target, innerHTML, children) {
    if (null != innerHTML) {
      if (null != children)
        throw Error(
          "Can only set one of `children` or `props.dangerouslySetInnerHTML`."
        );
      if ("object" !== typeof innerHTML || !("__html" in innerHTML))
        throw Error(
          "`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information."
        );
      innerHTML = innerHTML.__html;
      null !== innerHTML && void 0 !== innerHTML && target.push(stringToChunk("" + innerHTML));
    }
  }
  function flattenOptionChildren(children) {
    var content = "";
    React2.Children.forEach(children, function(child) {
      null != child && (content += child);
    });
    return content;
  }
  var selectedMarkerAttribute = stringToPrecomputedChunk(' selected=""'), formReplayingRuntimeScript = stringToPrecomputedChunk(
    `addEventListener("submit",function(a){if(!a.defaultPrevented){var c=a.target,d=a.submitter,e=c.action,b=d;if(d){var f=d.getAttribute("formAction");null!=f&&(e=f,b=null)}"javascript:throw new Error('React form unexpectedly submitted.')"===e&&(a.preventDefault(),b?(a=document.createElement("input"),a.name=b.name,a.value=b.value,b.parentNode.insertBefore(a,b),b=new FormData(c),a.parentNode.removeChild(a)):b=new FormData(c),a=c.ownerDocument||c,(a.$$reactFormReplay=a.$$reactFormReplay||[]).push(c,d,b))}});`
  );
  function injectFormReplayingRuntime(resumableState, renderState) {
    if (0 === (resumableState.instructions & 16)) {
      resumableState.instructions |= 16;
      var preamble = renderState.preamble, bootstrapChunks = renderState.bootstrapChunks;
      (preamble.htmlChunks || preamble.headChunks) && 0 === bootstrapChunks.length ? (bootstrapChunks.push(renderState.startInlineScript), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(
        endOfStartTag,
        formReplayingRuntimeScript,
        endInlineScript
      )) : bootstrapChunks.unshift(
        renderState.startInlineScript,
        endOfStartTag,
        formReplayingRuntimeScript,
        endInlineScript
      );
    }
  }
  var formStateMarkerIsMatching = stringToPrecomputedChunk("<!--F!-->"), formStateMarkerIsNotMatching = stringToPrecomputedChunk("<!--F-->");
  function pushLinkImpl(target, props) {
    target.push(startChunkForTag("link"));
    for (var propKey in props)
      if (hasOwnProperty.call(props, propKey)) {
        var propValue = props[propKey];
        if (null != propValue)
          switch (propKey) {
            case "children":
            case "dangerouslySetInnerHTML":
              throw Error(
                "link is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
              );
            default:
              pushAttribute(target, propKey, propValue);
          }
      }
    target.push(endOfStartTagSelfClosing);
    return null;
  }
  var styleRegex = /(<\/|<)(s)(tyle)/gi;
  function styleReplacer(match, prefix2, s2, suffix2) {
    return "" + prefix2 + ("s" === s2 ? "\\73 " : "\\53 ") + suffix2;
  }
  function pushSelfClosing(target, props, tag) {
    target.push(startChunkForTag(tag));
    for (var propKey in props)
      if (hasOwnProperty.call(props, propKey)) {
        var propValue = props[propKey];
        if (null != propValue)
          switch (propKey) {
            case "children":
            case "dangerouslySetInnerHTML":
              throw Error(
                tag + " is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
              );
            default:
              pushAttribute(target, propKey, propValue);
          }
      }
    target.push(endOfStartTagSelfClosing);
    return null;
  }
  function pushTitleImpl(target, props) {
    target.push(startChunkForTag("title"));
    var children = null, innerHTML = null, propKey;
    for (propKey in props)
      if (hasOwnProperty.call(props, propKey)) {
        var propValue = props[propKey];
        if (null != propValue)
          switch (propKey) {
            case "children":
              children = propValue;
              break;
            case "dangerouslySetInnerHTML":
              innerHTML = propValue;
              break;
            default:
              pushAttribute(target, propKey, propValue);
          }
      }
    target.push(endOfStartTag);
    props = Array.isArray(children) ? 2 > children.length ? children[0] : null : children;
    "function" !== typeof props && "symbol" !== typeof props && null !== props && void 0 !== props && target.push(stringToChunk(escapeTextForBrowser("" + props)));
    pushInnerHTML(target, innerHTML, children);
    target.push(endChunkForTag("title"));
    return null;
  }
  var headPreambleContributionChunk = stringToPrecomputedChunk("<!--head-->"), bodyPreambleContributionChunk = stringToPrecomputedChunk("<!--body-->"), htmlPreambleContributionChunk = stringToPrecomputedChunk("<!--html-->");
  function pushScriptImpl(target, props) {
    target.push(startChunkForTag("script"));
    var children = null, innerHTML = null, propKey;
    for (propKey in props)
      if (hasOwnProperty.call(props, propKey)) {
        var propValue = props[propKey];
        if (null != propValue)
          switch (propKey) {
            case "children":
              children = propValue;
              break;
            case "dangerouslySetInnerHTML":
              innerHTML = propValue;
              break;
            default:
              pushAttribute(target, propKey, propValue);
          }
      }
    target.push(endOfStartTag);
    pushInnerHTML(target, innerHTML, children);
    "string" === typeof children && target.push(
      stringToChunk(("" + children).replace(scriptRegex, scriptReplacer))
    );
    target.push(endChunkForTag("script"));
    return null;
  }
  function pushStartSingletonElement(target, props, tag) {
    target.push(startChunkForTag(tag));
    var innerHTML = tag = null, propKey;
    for (propKey in props)
      if (hasOwnProperty.call(props, propKey)) {
        var propValue = props[propKey];
        if (null != propValue)
          switch (propKey) {
            case "children":
              tag = propValue;
              break;
            case "dangerouslySetInnerHTML":
              innerHTML = propValue;
              break;
            default:
              pushAttribute(target, propKey, propValue);
          }
      }
    target.push(endOfStartTag);
    pushInnerHTML(target, innerHTML, tag);
    return tag;
  }
  function pushStartGenericElement(target, props, tag) {
    target.push(startChunkForTag(tag));
    var innerHTML = tag = null, propKey;
    for (propKey in props)
      if (hasOwnProperty.call(props, propKey)) {
        var propValue = props[propKey];
        if (null != propValue)
          switch (propKey) {
            case "children":
              tag = propValue;
              break;
            case "dangerouslySetInnerHTML":
              innerHTML = propValue;
              break;
            default:
              pushAttribute(target, propKey, propValue);
          }
      }
    target.push(endOfStartTag);
    pushInnerHTML(target, innerHTML, tag);
    return "string" === typeof tag ? (target.push(stringToChunk(escapeTextForBrowser(tag))), null) : tag;
  }
  var leadingNewline = stringToPrecomputedChunk("\n"), VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/, validatedTagCache = /* @__PURE__ */ new Map();
  function startChunkForTag(tag) {
    var tagStartChunk = validatedTagCache.get(tag);
    if (void 0 === tagStartChunk) {
      if (!VALID_TAG_REGEX.test(tag)) throw Error("Invalid tag: " + tag);
      tagStartChunk = stringToPrecomputedChunk("<" + tag);
      validatedTagCache.set(tag, tagStartChunk);
    }
    return tagStartChunk;
  }
  var doctypeChunk = stringToPrecomputedChunk("<!DOCTYPE html>");
  function pushStartInstance(target$jscomp$0, type, props, resumableState, renderState, preambleState, hoistableState, formatContext, textEmbedded) {
    switch (type) {
      case "div":
      case "span":
      case "svg":
      case "path":
        break;
      case "a":
        target$jscomp$0.push(startChunkForTag("a"));
        var children = null, innerHTML = null, propKey;
        for (propKey in props)
          if (hasOwnProperty.call(props, propKey)) {
            var propValue = props[propKey];
            if (null != propValue)
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML = propValue;
                  break;
                case "href":
                  "" === propValue ? pushStringAttribute(target$jscomp$0, "href", "") : pushAttribute(target$jscomp$0, propKey, propValue);
                  break;
                default:
                  pushAttribute(target$jscomp$0, propKey, propValue);
              }
          }
        target$jscomp$0.push(endOfStartTag);
        pushInnerHTML(target$jscomp$0, innerHTML, children);
        if ("string" === typeof children) {
          target$jscomp$0.push(stringToChunk(escapeTextForBrowser(children)));
          var JSCompiler_inline_result = null;
        } else JSCompiler_inline_result = children;
        return JSCompiler_inline_result;
      case "g":
      case "p":
      case "li":
        break;
      case "select":
        target$jscomp$0.push(startChunkForTag("select"));
        var children$jscomp$0 = null, innerHTML$jscomp$0 = null, propKey$jscomp$0;
        for (propKey$jscomp$0 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$0)) {
            var propValue$jscomp$0 = props[propKey$jscomp$0];
            if (null != propValue$jscomp$0)
              switch (propKey$jscomp$0) {
                case "children":
                  children$jscomp$0 = propValue$jscomp$0;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML$jscomp$0 = propValue$jscomp$0;
                  break;
                case "defaultValue":
                case "value":
                  break;
                default:
                  pushAttribute(
                    target$jscomp$0,
                    propKey$jscomp$0,
                    propValue$jscomp$0
                  );
              }
          }
        target$jscomp$0.push(endOfStartTag);
        pushInnerHTML(target$jscomp$0, innerHTML$jscomp$0, children$jscomp$0);
        return children$jscomp$0;
      case "option":
        var selectedValue = formatContext.selectedValue;
        target$jscomp$0.push(startChunkForTag("option"));
        var children$jscomp$1 = null, value = null, selected = null, innerHTML$jscomp$1 = null, propKey$jscomp$1;
        for (propKey$jscomp$1 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$1)) {
            var propValue$jscomp$1 = props[propKey$jscomp$1];
            if (null != propValue$jscomp$1)
              switch (propKey$jscomp$1) {
                case "children":
                  children$jscomp$1 = propValue$jscomp$1;
                  break;
                case "selected":
                  selected = propValue$jscomp$1;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML$jscomp$1 = propValue$jscomp$1;
                  break;
                case "value":
                  value = propValue$jscomp$1;
                default:
                  pushAttribute(
                    target$jscomp$0,
                    propKey$jscomp$1,
                    propValue$jscomp$1
                  );
              }
          }
        if (null != selectedValue) {
          var stringValue = null !== value ? "" + value : flattenOptionChildren(children$jscomp$1);
          if (isArrayImpl(selectedValue))
            for (var i = 0; i < selectedValue.length; i++) {
              if ("" + selectedValue[i] === stringValue) {
                target$jscomp$0.push(selectedMarkerAttribute);
                break;
              }
            }
          else
            "" + selectedValue === stringValue && target$jscomp$0.push(selectedMarkerAttribute);
        } else selected && target$jscomp$0.push(selectedMarkerAttribute);
        target$jscomp$0.push(endOfStartTag);
        pushInnerHTML(target$jscomp$0, innerHTML$jscomp$1, children$jscomp$1);
        return children$jscomp$1;
      case "textarea":
        target$jscomp$0.push(startChunkForTag("textarea"));
        var value$jscomp$0 = null, defaultValue = null, children$jscomp$2 = null, propKey$jscomp$2;
        for (propKey$jscomp$2 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$2)) {
            var propValue$jscomp$2 = props[propKey$jscomp$2];
            if (null != propValue$jscomp$2)
              switch (propKey$jscomp$2) {
                case "children":
                  children$jscomp$2 = propValue$jscomp$2;
                  break;
                case "value":
                  value$jscomp$0 = propValue$jscomp$2;
                  break;
                case "defaultValue":
                  defaultValue = propValue$jscomp$2;
                  break;
                case "dangerouslySetInnerHTML":
                  throw Error(
                    "`dangerouslySetInnerHTML` does not make sense on <textarea>."
                  );
                default:
                  pushAttribute(
                    target$jscomp$0,
                    propKey$jscomp$2,
                    propValue$jscomp$2
                  );
              }
          }
        null === value$jscomp$0 && null !== defaultValue && (value$jscomp$0 = defaultValue);
        target$jscomp$0.push(endOfStartTag);
        if (null != children$jscomp$2) {
          if (null != value$jscomp$0)
            throw Error(
              "If you supply `defaultValue` on a <textarea>, do not pass children."
            );
          if (isArrayImpl(children$jscomp$2)) {
            if (1 < children$jscomp$2.length)
              throw Error("<textarea> can only have at most one child.");
            value$jscomp$0 = "" + children$jscomp$2[0];
          }
          value$jscomp$0 = "" + children$jscomp$2;
        }
        "string" === typeof value$jscomp$0 && "\n" === value$jscomp$0[0] && target$jscomp$0.push(leadingNewline);
        null !== value$jscomp$0 && target$jscomp$0.push(
          stringToChunk(escapeTextForBrowser("" + value$jscomp$0))
        );
        return null;
      case "input":
        target$jscomp$0.push(startChunkForTag("input"));
        var name = null, formAction = null, formEncType = null, formMethod = null, formTarget = null, value$jscomp$1 = null, defaultValue$jscomp$0 = null, checked = null, defaultChecked = null, propKey$jscomp$3;
        for (propKey$jscomp$3 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$3)) {
            var propValue$jscomp$3 = props[propKey$jscomp$3];
            if (null != propValue$jscomp$3)
              switch (propKey$jscomp$3) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(
                    "input is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
                  );
                case "name":
                  name = propValue$jscomp$3;
                  break;
                case "formAction":
                  formAction = propValue$jscomp$3;
                  break;
                case "formEncType":
                  formEncType = propValue$jscomp$3;
                  break;
                case "formMethod":
                  formMethod = propValue$jscomp$3;
                  break;
                case "formTarget":
                  formTarget = propValue$jscomp$3;
                  break;
                case "defaultChecked":
                  defaultChecked = propValue$jscomp$3;
                  break;
                case "defaultValue":
                  defaultValue$jscomp$0 = propValue$jscomp$3;
                  break;
                case "checked":
                  checked = propValue$jscomp$3;
                  break;
                case "value":
                  value$jscomp$1 = propValue$jscomp$3;
                  break;
                default:
                  pushAttribute(
                    target$jscomp$0,
                    propKey$jscomp$3,
                    propValue$jscomp$3
                  );
              }
          }
        var formData = pushFormActionAttribute(
          target$jscomp$0,
          resumableState,
          renderState,
          formAction,
          formEncType,
          formMethod,
          formTarget,
          name
        );
        null !== checked ? pushBooleanAttribute(target$jscomp$0, "checked", checked) : null !== defaultChecked && pushBooleanAttribute(target$jscomp$0, "checked", defaultChecked);
        null !== value$jscomp$1 ? pushAttribute(target$jscomp$0, "value", value$jscomp$1) : null !== defaultValue$jscomp$0 && pushAttribute(target$jscomp$0, "value", defaultValue$jscomp$0);
        target$jscomp$0.push(endOfStartTagSelfClosing);
        null != formData && formData.forEach(pushAdditionalFormField, target$jscomp$0);
        return null;
      case "button":
        target$jscomp$0.push(startChunkForTag("button"));
        var children$jscomp$3 = null, innerHTML$jscomp$2 = null, name$jscomp$0 = null, formAction$jscomp$0 = null, formEncType$jscomp$0 = null, formMethod$jscomp$0 = null, formTarget$jscomp$0 = null, propKey$jscomp$4;
        for (propKey$jscomp$4 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$4)) {
            var propValue$jscomp$4 = props[propKey$jscomp$4];
            if (null != propValue$jscomp$4)
              switch (propKey$jscomp$4) {
                case "children":
                  children$jscomp$3 = propValue$jscomp$4;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML$jscomp$2 = propValue$jscomp$4;
                  break;
                case "name":
                  name$jscomp$0 = propValue$jscomp$4;
                  break;
                case "formAction":
                  formAction$jscomp$0 = propValue$jscomp$4;
                  break;
                case "formEncType":
                  formEncType$jscomp$0 = propValue$jscomp$4;
                  break;
                case "formMethod":
                  formMethod$jscomp$0 = propValue$jscomp$4;
                  break;
                case "formTarget":
                  formTarget$jscomp$0 = propValue$jscomp$4;
                  break;
                default:
                  pushAttribute(
                    target$jscomp$0,
                    propKey$jscomp$4,
                    propValue$jscomp$4
                  );
              }
          }
        var formData$jscomp$0 = pushFormActionAttribute(
          target$jscomp$0,
          resumableState,
          renderState,
          formAction$jscomp$0,
          formEncType$jscomp$0,
          formMethod$jscomp$0,
          formTarget$jscomp$0,
          name$jscomp$0
        );
        target$jscomp$0.push(endOfStartTag);
        null != formData$jscomp$0 && formData$jscomp$0.forEach(pushAdditionalFormField, target$jscomp$0);
        pushInnerHTML(target$jscomp$0, innerHTML$jscomp$2, children$jscomp$3);
        if ("string" === typeof children$jscomp$3) {
          target$jscomp$0.push(
            stringToChunk(escapeTextForBrowser(children$jscomp$3))
          );
          var JSCompiler_inline_result$jscomp$0 = null;
        } else JSCompiler_inline_result$jscomp$0 = children$jscomp$3;
        return JSCompiler_inline_result$jscomp$0;
      case "form":
        target$jscomp$0.push(startChunkForTag("form"));
        var children$jscomp$4 = null, innerHTML$jscomp$3 = null, formAction$jscomp$1 = null, formEncType$jscomp$1 = null, formMethod$jscomp$1 = null, formTarget$jscomp$1 = null, propKey$jscomp$5;
        for (propKey$jscomp$5 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$5)) {
            var propValue$jscomp$5 = props[propKey$jscomp$5];
            if (null != propValue$jscomp$5)
              switch (propKey$jscomp$5) {
                case "children":
                  children$jscomp$4 = propValue$jscomp$5;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML$jscomp$3 = propValue$jscomp$5;
                  break;
                case "action":
                  formAction$jscomp$1 = propValue$jscomp$5;
                  break;
                case "encType":
                  formEncType$jscomp$1 = propValue$jscomp$5;
                  break;
                case "method":
                  formMethod$jscomp$1 = propValue$jscomp$5;
                  break;
                case "target":
                  formTarget$jscomp$1 = propValue$jscomp$5;
                  break;
                default:
                  pushAttribute(
                    target$jscomp$0,
                    propKey$jscomp$5,
                    propValue$jscomp$5
                  );
              }
          }
        var formData$jscomp$1 = null, formActionName = null;
        if ("function" === typeof formAction$jscomp$1) {
          var customFields = getCustomFormFields(
            resumableState,
            formAction$jscomp$1
          );
          null !== customFields ? (formAction$jscomp$1 = customFields.action || "", formEncType$jscomp$1 = customFields.encType, formMethod$jscomp$1 = customFields.method, formTarget$jscomp$1 = customFields.target, formData$jscomp$1 = customFields.data, formActionName = customFields.name) : (target$jscomp$0.push(
            attributeSeparator,
            stringToChunk("action"),
            attributeAssign,
            actionJavaScriptURL,
            attributeEnd
          ), formTarget$jscomp$1 = formMethod$jscomp$1 = formEncType$jscomp$1 = formAction$jscomp$1 = null, injectFormReplayingRuntime(resumableState, renderState));
        }
        null != formAction$jscomp$1 && pushAttribute(target$jscomp$0, "action", formAction$jscomp$1);
        null != formEncType$jscomp$1 && pushAttribute(target$jscomp$0, "encType", formEncType$jscomp$1);
        null != formMethod$jscomp$1 && pushAttribute(target$jscomp$0, "method", formMethod$jscomp$1);
        null != formTarget$jscomp$1 && pushAttribute(target$jscomp$0, "target", formTarget$jscomp$1);
        target$jscomp$0.push(endOfStartTag);
        null !== formActionName && (target$jscomp$0.push(startHiddenInputChunk), pushStringAttribute(target$jscomp$0, "name", formActionName), target$jscomp$0.push(endOfStartTagSelfClosing), null != formData$jscomp$1 && formData$jscomp$1.forEach(pushAdditionalFormField, target$jscomp$0));
        pushInnerHTML(target$jscomp$0, innerHTML$jscomp$3, children$jscomp$4);
        if ("string" === typeof children$jscomp$4) {
          target$jscomp$0.push(
            stringToChunk(escapeTextForBrowser(children$jscomp$4))
          );
          var JSCompiler_inline_result$jscomp$1 = null;
        } else JSCompiler_inline_result$jscomp$1 = children$jscomp$4;
        return JSCompiler_inline_result$jscomp$1;
      case "menuitem":
        target$jscomp$0.push(startChunkForTag("menuitem"));
        for (var propKey$jscomp$6 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$6)) {
            var propValue$jscomp$6 = props[propKey$jscomp$6];
            if (null != propValue$jscomp$6)
              switch (propKey$jscomp$6) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(
                    "menuitems cannot have `children` nor `dangerouslySetInnerHTML`."
                  );
                default:
                  pushAttribute(
                    target$jscomp$0,
                    propKey$jscomp$6,
                    propValue$jscomp$6
                  );
              }
          }
        target$jscomp$0.push(endOfStartTag);
        return null;
      case "object":
        target$jscomp$0.push(startChunkForTag("object"));
        var children$jscomp$5 = null, innerHTML$jscomp$4 = null, propKey$jscomp$7;
        for (propKey$jscomp$7 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$7)) {
            var propValue$jscomp$7 = props[propKey$jscomp$7];
            if (null != propValue$jscomp$7)
              switch (propKey$jscomp$7) {
                case "children":
                  children$jscomp$5 = propValue$jscomp$7;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML$jscomp$4 = propValue$jscomp$7;
                  break;
                case "data":
                  var sanitizedValue = sanitizeURL("" + propValue$jscomp$7);
                  if ("" === sanitizedValue) break;
                  target$jscomp$0.push(
                    attributeSeparator,
                    stringToChunk("data"),
                    attributeAssign,
                    stringToChunk(escapeTextForBrowser(sanitizedValue)),
                    attributeEnd
                  );
                  break;
                default:
                  pushAttribute(
                    target$jscomp$0,
                    propKey$jscomp$7,
                    propValue$jscomp$7
                  );
              }
          }
        target$jscomp$0.push(endOfStartTag);
        pushInnerHTML(target$jscomp$0, innerHTML$jscomp$4, children$jscomp$5);
        if ("string" === typeof children$jscomp$5) {
          target$jscomp$0.push(
            stringToChunk(escapeTextForBrowser(children$jscomp$5))
          );
          var JSCompiler_inline_result$jscomp$2 = null;
        } else JSCompiler_inline_result$jscomp$2 = children$jscomp$5;
        return JSCompiler_inline_result$jscomp$2;
      case "title":
        var noscriptTagInScope = formatContext.tagScope & 1, isFallback = formatContext.tagScope & 4;
        if (4 === formatContext.insertionMode || noscriptTagInScope || null != props.itemProp)
          var JSCompiler_inline_result$jscomp$3 = pushTitleImpl(
            target$jscomp$0,
            props
          );
        else
          isFallback ? JSCompiler_inline_result$jscomp$3 = null : (pushTitleImpl(renderState.hoistableChunks, props), JSCompiler_inline_result$jscomp$3 = void 0);
        return JSCompiler_inline_result$jscomp$3;
      case "link":
        var noscriptTagInScope$jscomp$0 = formatContext.tagScope & 1, isFallback$jscomp$0 = formatContext.tagScope & 4, rel = props.rel, href = props.href, precedence = props.precedence;
        if (4 === formatContext.insertionMode || noscriptTagInScope$jscomp$0 || null != props.itemProp || "string" !== typeof rel || "string" !== typeof href || "" === href) {
          pushLinkImpl(target$jscomp$0, props);
          var JSCompiler_inline_result$jscomp$4 = null;
        } else if ("stylesheet" === props.rel)
          if ("string" !== typeof precedence || null != props.disabled || props.onLoad || props.onError)
            JSCompiler_inline_result$jscomp$4 = pushLinkImpl(
              target$jscomp$0,
              props
            );
          else {
            var styleQueue = renderState.styles.get(precedence), resourceState = resumableState.styleResources.hasOwnProperty(href) ? resumableState.styleResources[href] : void 0;
            if (null !== resourceState) {
              resumableState.styleResources[href] = null;
              styleQueue || (styleQueue = {
                precedence: stringToChunk(escapeTextForBrowser(precedence)),
                rules: [],
                hrefs: [],
                sheets: /* @__PURE__ */ new Map()
              }, renderState.styles.set(precedence, styleQueue));
              var resource = {
                state: 0,
                props: assign({}, props, {
                  "data-precedence": props.precedence,
                  precedence: null
                })
              };
              if (resourceState) {
                2 === resourceState.length && adoptPreloadCredentials(resource.props, resourceState);
                var preloadResource = renderState.preloads.stylesheets.get(href);
                preloadResource && 0 < preloadResource.length ? preloadResource.length = 0 : resource.state = 1;
              }
              styleQueue.sheets.set(href, resource);
              hoistableState && hoistableState.stylesheets.add(resource);
            } else if (styleQueue) {
              var resource$9 = styleQueue.sheets.get(href);
              resource$9 && hoistableState && hoistableState.stylesheets.add(resource$9);
            }
            textEmbedded && target$jscomp$0.push(textSeparator);
            JSCompiler_inline_result$jscomp$4 = null;
          }
        else
          props.onLoad || props.onError ? JSCompiler_inline_result$jscomp$4 = pushLinkImpl(
            target$jscomp$0,
            props
          ) : (textEmbedded && target$jscomp$0.push(textSeparator), JSCompiler_inline_result$jscomp$4 = isFallback$jscomp$0 ? null : pushLinkImpl(renderState.hoistableChunks, props));
        return JSCompiler_inline_result$jscomp$4;
      case "script":
        var noscriptTagInScope$jscomp$1 = formatContext.tagScope & 1, asyncProp = props.async;
        if ("string" !== typeof props.src || !props.src || !asyncProp || "function" === typeof asyncProp || "symbol" === typeof asyncProp || props.onLoad || props.onError || 4 === formatContext.insertionMode || noscriptTagInScope$jscomp$1 || null != props.itemProp)
          var JSCompiler_inline_result$jscomp$5 = pushScriptImpl(
            target$jscomp$0,
            props
          );
        else {
          var key = props.src;
          if ("module" === props.type) {
            var resources = resumableState.moduleScriptResources;
            var preloads = renderState.preloads.moduleScripts;
          } else
            resources = resumableState.scriptResources, preloads = renderState.preloads.scripts;
          var resourceState$jscomp$0 = resources.hasOwnProperty(key) ? resources[key] : void 0;
          if (null !== resourceState$jscomp$0) {
            resources[key] = null;
            var scriptProps = props;
            if (resourceState$jscomp$0) {
              2 === resourceState$jscomp$0.length && (scriptProps = assign({}, props), adoptPreloadCredentials(scriptProps, resourceState$jscomp$0));
              var preloadResource$jscomp$0 = preloads.get(key);
              preloadResource$jscomp$0 && (preloadResource$jscomp$0.length = 0);
            }
            var resource$jscomp$0 = [];
            renderState.scripts.add(resource$jscomp$0);
            pushScriptImpl(resource$jscomp$0, scriptProps);
          }
          textEmbedded && target$jscomp$0.push(textSeparator);
          JSCompiler_inline_result$jscomp$5 = null;
        }
        return JSCompiler_inline_result$jscomp$5;
      case "style":
        var noscriptTagInScope$jscomp$2 = formatContext.tagScope & 1, precedence$jscomp$0 = props.precedence, href$jscomp$0 = props.href, nonce = props.nonce;
        if (4 === formatContext.insertionMode || noscriptTagInScope$jscomp$2 || null != props.itemProp || "string" !== typeof precedence$jscomp$0 || "string" !== typeof href$jscomp$0 || "" === href$jscomp$0) {
          target$jscomp$0.push(startChunkForTag("style"));
          var children$jscomp$6 = null, innerHTML$jscomp$5 = null, propKey$jscomp$8;
          for (propKey$jscomp$8 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$8)) {
              var propValue$jscomp$8 = props[propKey$jscomp$8];
              if (null != propValue$jscomp$8)
                switch (propKey$jscomp$8) {
                  case "children":
                    children$jscomp$6 = propValue$jscomp$8;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$5 = propValue$jscomp$8;
                    break;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$8,
                      propValue$jscomp$8
                    );
                }
            }
          target$jscomp$0.push(endOfStartTag);
          var child = Array.isArray(children$jscomp$6) ? 2 > children$jscomp$6.length ? children$jscomp$6[0] : null : children$jscomp$6;
          "function" !== typeof child && "symbol" !== typeof child && null !== child && void 0 !== child && target$jscomp$0.push(
            stringToChunk(("" + child).replace(styleRegex, styleReplacer))
          );
          pushInnerHTML(target$jscomp$0, innerHTML$jscomp$5, children$jscomp$6);
          target$jscomp$0.push(endChunkForTag("style"));
          var JSCompiler_inline_result$jscomp$6 = null;
        } else {
          var styleQueue$jscomp$0 = renderState.styles.get(precedence$jscomp$0);
          if (null !== (resumableState.styleResources.hasOwnProperty(href$jscomp$0) ? resumableState.styleResources[href$jscomp$0] : void 0)) {
            resumableState.styleResources[href$jscomp$0] = null;
            styleQueue$jscomp$0 || (styleQueue$jscomp$0 = {
              precedence: stringToChunk(
                escapeTextForBrowser(precedence$jscomp$0)
              ),
              rules: [],
              hrefs: [],
              sheets: /* @__PURE__ */ new Map()
            }, renderState.styles.set(precedence$jscomp$0, styleQueue$jscomp$0));
            var nonceStyle = renderState.nonce.style;
            if (!nonceStyle || nonceStyle === nonce) {
              styleQueue$jscomp$0.hrefs.push(
                stringToChunk(escapeTextForBrowser(href$jscomp$0))
              );
              var target = styleQueue$jscomp$0.rules, children$jscomp$7 = null, innerHTML$jscomp$6 = null, propKey$jscomp$9;
              for (propKey$jscomp$9 in props)
                if (hasOwnProperty.call(props, propKey$jscomp$9)) {
                  var propValue$jscomp$9 = props[propKey$jscomp$9];
                  if (null != propValue$jscomp$9)
                    switch (propKey$jscomp$9) {
                      case "children":
                        children$jscomp$7 = propValue$jscomp$9;
                        break;
                      case "dangerouslySetInnerHTML":
                        innerHTML$jscomp$6 = propValue$jscomp$9;
                    }
                }
              var child$jscomp$0 = Array.isArray(children$jscomp$7) ? 2 > children$jscomp$7.length ? children$jscomp$7[0] : null : children$jscomp$7;
              "function" !== typeof child$jscomp$0 && "symbol" !== typeof child$jscomp$0 && null !== child$jscomp$0 && void 0 !== child$jscomp$0 && target.push(
                stringToChunk(
                  ("" + child$jscomp$0).replace(styleRegex, styleReplacer)
                )
              );
              pushInnerHTML(target, innerHTML$jscomp$6, children$jscomp$7);
            }
          }
          styleQueue$jscomp$0 && hoistableState && hoistableState.styles.add(styleQueue$jscomp$0);
          textEmbedded && target$jscomp$0.push(textSeparator);
          JSCompiler_inline_result$jscomp$6 = void 0;
        }
        return JSCompiler_inline_result$jscomp$6;
      case "meta":
        var noscriptTagInScope$jscomp$3 = formatContext.tagScope & 1, isFallback$jscomp$1 = formatContext.tagScope & 4;
        if (4 === formatContext.insertionMode || noscriptTagInScope$jscomp$3 || null != props.itemProp)
          var JSCompiler_inline_result$jscomp$7 = pushSelfClosing(
            target$jscomp$0,
            props,
            "meta"
          );
        else
          textEmbedded && target$jscomp$0.push(textSeparator), JSCompiler_inline_result$jscomp$7 = isFallback$jscomp$1 ? null : "string" === typeof props.charSet ? pushSelfClosing(renderState.charsetChunks, props, "meta") : "viewport" === props.name ? pushSelfClosing(renderState.viewportChunks, props, "meta") : pushSelfClosing(renderState.hoistableChunks, props, "meta");
        return JSCompiler_inline_result$jscomp$7;
      case "listing":
      case "pre":
        target$jscomp$0.push(startChunkForTag(type));
        var children$jscomp$8 = null, innerHTML$jscomp$7 = null, propKey$jscomp$10;
        for (propKey$jscomp$10 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$10)) {
            var propValue$jscomp$10 = props[propKey$jscomp$10];
            if (null != propValue$jscomp$10)
              switch (propKey$jscomp$10) {
                case "children":
                  children$jscomp$8 = propValue$jscomp$10;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML$jscomp$7 = propValue$jscomp$10;
                  break;
                default:
                  pushAttribute(
                    target$jscomp$0,
                    propKey$jscomp$10,
                    propValue$jscomp$10
                  );
              }
          }
        target$jscomp$0.push(endOfStartTag);
        if (null != innerHTML$jscomp$7) {
          if (null != children$jscomp$8)
            throw Error(
              "Can only set one of `children` or `props.dangerouslySetInnerHTML`."
            );
          if ("object" !== typeof innerHTML$jscomp$7 || !("__html" in innerHTML$jscomp$7))
            throw Error(
              "`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information."
            );
          var html = innerHTML$jscomp$7.__html;
          null !== html && void 0 !== html && ("string" === typeof html && 0 < html.length && "\n" === html[0] ? target$jscomp$0.push(leadingNewline, stringToChunk(html)) : target$jscomp$0.push(stringToChunk("" + html)));
        }
        "string" === typeof children$jscomp$8 && "\n" === children$jscomp$8[0] && target$jscomp$0.push(leadingNewline);
        return children$jscomp$8;
      case "img":
        var pictureOrNoScriptTagInScope = formatContext.tagScope & 3, src = props.src, srcSet = props.srcSet;
        if (!("lazy" === props.loading || !src && !srcSet || "string" !== typeof src && null != src || "string" !== typeof srcSet && null != srcSet || "low" === props.fetchPriority || pictureOrNoScriptTagInScope) && ("string" !== typeof src || ":" !== src[4] || "d" !== src[0] && "D" !== src[0] || "a" !== src[1] && "A" !== src[1] || "t" !== src[2] && "T" !== src[2] || "a" !== src[3] && "A" !== src[3]) && ("string" !== typeof srcSet || ":" !== srcSet[4] || "d" !== srcSet[0] && "D" !== srcSet[0] || "a" !== srcSet[1] && "A" !== srcSet[1] || "t" !== srcSet[2] && "T" !== srcSet[2] || "a" !== srcSet[3] && "A" !== srcSet[3])) {
          null !== hoistableState && formatContext.tagScope & 64 && (hoistableState.suspenseyImages = true);
          var sizes = "string" === typeof props.sizes ? props.sizes : void 0, key$jscomp$0 = srcSet ? srcSet + "\n" + (sizes || "") : src, promotablePreloads = renderState.preloads.images, resource$jscomp$1 = promotablePreloads.get(key$jscomp$0);
          if (resource$jscomp$1) {
            if ("high" === props.fetchPriority || 10 > renderState.highImagePreloads.size)
              promotablePreloads.delete(key$jscomp$0), renderState.highImagePreloads.add(resource$jscomp$1);
          } else if (!resumableState.imageResources.hasOwnProperty(key$jscomp$0)) {
            resumableState.imageResources[key$jscomp$0] = PRELOAD_NO_CREDS;
            var input = props.crossOrigin;
            var JSCompiler_inline_result$jscomp$8 = "string" === typeof input ? "use-credentials" === input ? input : "" : void 0;
            var headers = renderState.headers, header;
            headers && 0 < headers.remainingCapacity && "string" !== typeof props.srcSet && ("high" === props.fetchPriority || 500 > headers.highImagePreloads.length) && (header = getPreloadAsHeader(src, "image", {
              imageSrcSet: props.srcSet,
              imageSizes: props.sizes,
              crossOrigin: JSCompiler_inline_result$jscomp$8,
              integrity: props.integrity,
              nonce: props.nonce,
              type: props.type,
              fetchPriority: props.fetchPriority,
              referrerPolicy: props.refererPolicy
            }), 0 <= (headers.remainingCapacity -= header.length + 2)) ? (renderState.resets.image[key$jscomp$0] = PRELOAD_NO_CREDS, headers.highImagePreloads && (headers.highImagePreloads += ", "), headers.highImagePreloads += header) : (resource$jscomp$1 = [], pushLinkImpl(resource$jscomp$1, {
              rel: "preload",
              as: "image",
              href: srcSet ? void 0 : src,
              imageSrcSet: srcSet,
              imageSizes: sizes,
              crossOrigin: JSCompiler_inline_result$jscomp$8,
              integrity: props.integrity,
              type: props.type,
              fetchPriority: props.fetchPriority,
              referrerPolicy: props.referrerPolicy
            }), "high" === props.fetchPriority || 10 > renderState.highImagePreloads.size ? renderState.highImagePreloads.add(resource$jscomp$1) : (renderState.bulkPreloads.add(resource$jscomp$1), promotablePreloads.set(key$jscomp$0, resource$jscomp$1)));
          }
        }
        return pushSelfClosing(target$jscomp$0, props, "img");
      case "base":
      case "area":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "param":
      case "source":
      case "track":
      case "wbr":
        return pushSelfClosing(target$jscomp$0, props, type);
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        break;
      case "head":
        if (2 > formatContext.insertionMode) {
          var preamble = preambleState || renderState.preamble;
          if (preamble.headChunks)
            throw Error("The `<head>` tag may only be rendered once.");
          null !== preambleState && target$jscomp$0.push(headPreambleContributionChunk);
          preamble.headChunks = [];
          var JSCompiler_inline_result$jscomp$9 = pushStartSingletonElement(
            preamble.headChunks,
            props,
            "head"
          );
        } else
          JSCompiler_inline_result$jscomp$9 = pushStartGenericElement(
            target$jscomp$0,
            props,
            "head"
          );
        return JSCompiler_inline_result$jscomp$9;
      case "body":
        if (2 > formatContext.insertionMode) {
          var preamble$jscomp$0 = preambleState || renderState.preamble;
          if (preamble$jscomp$0.bodyChunks)
            throw Error("The `<body>` tag may only be rendered once.");
          null !== preambleState && target$jscomp$0.push(bodyPreambleContributionChunk);
          preamble$jscomp$0.bodyChunks = [];
          var JSCompiler_inline_result$jscomp$10 = pushStartSingletonElement(
            preamble$jscomp$0.bodyChunks,
            props,
            "body"
          );
        } else
          JSCompiler_inline_result$jscomp$10 = pushStartGenericElement(
            target$jscomp$0,
            props,
            "body"
          );
        return JSCompiler_inline_result$jscomp$10;
      case "html":
        if (0 === formatContext.insertionMode) {
          var preamble$jscomp$1 = preambleState || renderState.preamble;
          if (preamble$jscomp$1.htmlChunks)
            throw Error("The `<html>` tag may only be rendered once.");
          null !== preambleState && target$jscomp$0.push(htmlPreambleContributionChunk);
          preamble$jscomp$1.htmlChunks = [doctypeChunk];
          var JSCompiler_inline_result$jscomp$11 = pushStartSingletonElement(
            preamble$jscomp$1.htmlChunks,
            props,
            "html"
          );
        } else
          JSCompiler_inline_result$jscomp$11 = pushStartGenericElement(
            target$jscomp$0,
            props,
            "html"
          );
        return JSCompiler_inline_result$jscomp$11;
      default:
        if (-1 !== type.indexOf("-")) {
          target$jscomp$0.push(startChunkForTag(type));
          var children$jscomp$9 = null, innerHTML$jscomp$8 = null, propKey$jscomp$11;
          for (propKey$jscomp$11 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$11)) {
              var propValue$jscomp$11 = props[propKey$jscomp$11];
              if (null != propValue$jscomp$11) {
                var attributeName = propKey$jscomp$11;
                switch (propKey$jscomp$11) {
                  case "children":
                    children$jscomp$9 = propValue$jscomp$11;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$8 = propValue$jscomp$11;
                    break;
                  case "style":
                    pushStyleAttribute(target$jscomp$0, propValue$jscomp$11);
                    break;
                  case "suppressContentEditableWarning":
                  case "suppressHydrationWarning":
                  case "ref":
                    break;
                  case "className":
                    attributeName = "class";
                  default:
                    if (isAttributeNameSafe(propKey$jscomp$11) && "function" !== typeof propValue$jscomp$11 && "symbol" !== typeof propValue$jscomp$11 && false !== propValue$jscomp$11) {
                      if (true === propValue$jscomp$11) propValue$jscomp$11 = "";
                      else if ("object" === typeof propValue$jscomp$11) continue;
                      target$jscomp$0.push(
                        attributeSeparator,
                        stringToChunk(attributeName),
                        attributeAssign,
                        stringToChunk(escapeTextForBrowser(propValue$jscomp$11)),
                        attributeEnd
                      );
                    }
                }
              }
            }
          target$jscomp$0.push(endOfStartTag);
          pushInnerHTML(target$jscomp$0, innerHTML$jscomp$8, children$jscomp$9);
          return children$jscomp$9;
        }
    }
    return pushStartGenericElement(target$jscomp$0, props, type);
  }
  var endTagCache = /* @__PURE__ */ new Map();
  function endChunkForTag(tag) {
    var chunk = endTagCache.get(tag);
    void 0 === chunk && (chunk = stringToPrecomputedChunk("</" + tag + ">"), endTagCache.set(tag, chunk));
    return chunk;
  }
  function hoistPreambleState(renderState, preambleState) {
    renderState = renderState.preamble;
    null === renderState.htmlChunks && preambleState.htmlChunks && (renderState.htmlChunks = preambleState.htmlChunks);
    null === renderState.headChunks && preambleState.headChunks && (renderState.headChunks = preambleState.headChunks);
    null === renderState.bodyChunks && preambleState.bodyChunks && (renderState.bodyChunks = preambleState.bodyChunks);
  }
  function writeBootstrap(destination, renderState) {
    renderState = renderState.bootstrapChunks;
    for (var i = 0; i < renderState.length - 1; i++)
      writeChunk(destination, renderState[i]);
    return i < renderState.length ? (i = renderState[i], renderState.length = 0, writeChunkAndReturn(destination, i)) : true;
  }
  var shellTimeRuntimeScript = stringToPrecomputedChunk(
    "requestAnimationFrame(function(){$RT=performance.now()});"
  ), placeholder1 = stringToPrecomputedChunk('<template id="'), placeholder2 = stringToPrecomputedChunk('"></template>'), startActivityBoundary = stringToPrecomputedChunk("<!--&-->"), endActivityBoundary = stringToPrecomputedChunk("<!--/&-->"), startCompletedSuspenseBoundary = stringToPrecomputedChunk("<!--$-->"), startPendingSuspenseBoundary1 = stringToPrecomputedChunk(
    '<!--$?--><template id="'
  ), startPendingSuspenseBoundary2 = stringToPrecomputedChunk('"></template>'), startClientRenderedSuspenseBoundary = stringToPrecomputedChunk("<!--$!-->"), endSuspenseBoundary = stringToPrecomputedChunk("<!--/$-->"), clientRenderedSuspenseBoundaryError1 = stringToPrecomputedChunk("<template"), clientRenderedSuspenseBoundaryErrorAttrInterstitial = stringToPrecomputedChunk('"'), clientRenderedSuspenseBoundaryError1A = stringToPrecomputedChunk(' data-dgst="');
  stringToPrecomputedChunk(' data-msg="');
  stringToPrecomputedChunk(' data-stck="');
  stringToPrecomputedChunk(' data-cstck="');
  var clientRenderedSuspenseBoundaryError2 = stringToPrecomputedChunk("></template>");
  function writeStartPendingSuspenseBoundary(destination, renderState, id) {
    writeChunk(destination, startPendingSuspenseBoundary1);
    if (null === id)
      throw Error(
        "An ID must have been assigned before we can complete the boundary."
      );
    writeChunk(destination, renderState.boundaryPrefix);
    writeChunk(destination, stringToChunk(id.toString(16)));
    return writeChunkAndReturn(destination, startPendingSuspenseBoundary2);
  }
  var startSegmentHTML = stringToPrecomputedChunk('<div hidden id="'), startSegmentHTML2 = stringToPrecomputedChunk('">'), endSegmentHTML = stringToPrecomputedChunk("</div>"), startSegmentSVG = stringToPrecomputedChunk(
    '<svg aria-hidden="true" style="display:none" id="'
  ), startSegmentSVG2 = stringToPrecomputedChunk('">'), endSegmentSVG = stringToPrecomputedChunk("</svg>"), startSegmentMathML = stringToPrecomputedChunk(
    '<math aria-hidden="true" style="display:none" id="'
  ), startSegmentMathML2 = stringToPrecomputedChunk('">'), endSegmentMathML = stringToPrecomputedChunk("</math>"), startSegmentTable = stringToPrecomputedChunk('<table hidden id="'), startSegmentTable2 = stringToPrecomputedChunk('">'), endSegmentTable = stringToPrecomputedChunk("</table>"), startSegmentTableBody = stringToPrecomputedChunk('<table hidden><tbody id="'), startSegmentTableBody2 = stringToPrecomputedChunk('">'), endSegmentTableBody = stringToPrecomputedChunk("</tbody></table>"), startSegmentTableRow = stringToPrecomputedChunk('<table hidden><tr id="'), startSegmentTableRow2 = stringToPrecomputedChunk('">'), endSegmentTableRow = stringToPrecomputedChunk("</tr></table>"), startSegmentColGroup = stringToPrecomputedChunk(
    '<table hidden><colgroup id="'
  ), startSegmentColGroup2 = stringToPrecomputedChunk('">'), endSegmentColGroup = stringToPrecomputedChunk("</colgroup></table>");
  function writeStartSegment(destination, renderState, formatContext, id) {
    switch (formatContext.insertionMode) {
      case 0:
      case 1:
      case 3:
      case 2:
        return writeChunk(destination, startSegmentHTML), writeChunk(destination, renderState.segmentPrefix), writeChunk(destination, stringToChunk(id.toString(16))), writeChunkAndReturn(destination, startSegmentHTML2);
      case 4:
        return writeChunk(destination, startSegmentSVG), writeChunk(destination, renderState.segmentPrefix), writeChunk(destination, stringToChunk(id.toString(16))), writeChunkAndReturn(destination, startSegmentSVG2);
      case 5:
        return writeChunk(destination, startSegmentMathML), writeChunk(destination, renderState.segmentPrefix), writeChunk(destination, stringToChunk(id.toString(16))), writeChunkAndReturn(destination, startSegmentMathML2);
      case 6:
        return writeChunk(destination, startSegmentTable), writeChunk(destination, renderState.segmentPrefix), writeChunk(destination, stringToChunk(id.toString(16))), writeChunkAndReturn(destination, startSegmentTable2);
      case 7:
        return writeChunk(destination, startSegmentTableBody), writeChunk(destination, renderState.segmentPrefix), writeChunk(destination, stringToChunk(id.toString(16))), writeChunkAndReturn(destination, startSegmentTableBody2);
      case 8:
        return writeChunk(destination, startSegmentTableRow), writeChunk(destination, renderState.segmentPrefix), writeChunk(destination, stringToChunk(id.toString(16))), writeChunkAndReturn(destination, startSegmentTableRow2);
      case 9:
        return writeChunk(destination, startSegmentColGroup), writeChunk(destination, renderState.segmentPrefix), writeChunk(destination, stringToChunk(id.toString(16))), writeChunkAndReturn(destination, startSegmentColGroup2);
      default:
        throw Error("Unknown insertion mode. This is a bug in React.");
    }
  }
  function writeEndSegment(destination, formatContext) {
    switch (formatContext.insertionMode) {
      case 0:
      case 1:
      case 3:
      case 2:
        return writeChunkAndReturn(destination, endSegmentHTML);
      case 4:
        return writeChunkAndReturn(destination, endSegmentSVG);
      case 5:
        return writeChunkAndReturn(destination, endSegmentMathML);
      case 6:
        return writeChunkAndReturn(destination, endSegmentTable);
      case 7:
        return writeChunkAndReturn(destination, endSegmentTableBody);
      case 8:
        return writeChunkAndReturn(destination, endSegmentTableRow);
      case 9:
        return writeChunkAndReturn(destination, endSegmentColGroup);
      default:
        throw Error("Unknown insertion mode. This is a bug in React.");
    }
  }
  var completeSegmentScript1Full = stringToPrecomputedChunk(
    '$RS=function(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS("'
  ), completeSegmentScript1Partial = stringToPrecomputedChunk('$RS("'), completeSegmentScript2 = stringToPrecomputedChunk('","'), completeSegmentScriptEnd = stringToPrecomputedChunk('")<\/script>');
  stringToPrecomputedChunk('<template data-rsi="" data-sid="');
  stringToPrecomputedChunk('" data-pid="');
  var completeBoundaryScriptFunctionOnly = stringToPrecomputedChunk(
    '$RB=[];$RV=function(a){$RT=performance.now();for(var b=0;b<a.length;b+=2){var c=a[b],e=a[b+1];null!==e.parentNode&&e.parentNode.removeChild(e);var f=c.parentNode;if(f){var g=c.previousSibling,h=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d||"/&"===d)if(0===h)break;else h--;else"$"!==d&&"$?"!==d&&"$~"!==d&&"$!"!==d&&"&"!==d||h++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;e.firstChild;)f.insertBefore(e.firstChild,c);g.data="$";g._reactRetry&&requestAnimationFrame(g._reactRetry)}}a.length=0};\n$RC=function(a,b){if(b=document.getElementById(b))(a=document.getElementById(a))?(a.previousSibling.data="$~",$RB.push(a,b),2===$RB.length&&("number"!==typeof $RT?requestAnimationFrame($RV.bind(null,$RB)):(a=performance.now(),setTimeout($RV.bind(null,$RB),2300>a&&2E3<a?2300-a:$RT+300-a)))):b.parentNode.removeChild(b)};'
  );
  stringToChunk(
    `$RV=function(A,g){function k(a,b){var e=a.getAttribute(b);e&&(b=a.style,l.push(a,b.viewTransitionName,b.viewTransitionClass),"auto"!==e&&(b.viewTransitionClass=e),(a=a.getAttribute("vt-name"))||(a="_T_"+K++ +"_"),b.viewTransitionName=a,B=!0)}var B=!1,K=0,l=[];try{var f=document.__reactViewTransition;if(f){f.finished.finally($RV.bind(null,g));return}var m=new Map;for(f=1;f<g.length;f+=2)for(var h=g[f].querySelectorAll("[vt-share]"),d=0;d<h.length;d++){var c=h[d];m.set(c.getAttribute("vt-name"),c)}var u=[];for(h=0;h<g.length;h+=2){var C=g[h],x=C.parentNode;if(x){var v=x.getBoundingClientRect();if(v.left||v.top||v.width||v.height){c=C;for(f=0;c;){if(8===c.nodeType){var r=c.data;if("/$"===r)if(0===f)break;else f--;else"$"!==r&&"$?"!==r&&"$~"!==r&&"$!"!==r||f++}else if(1===c.nodeType){d=c;var D=d.getAttribute("vt-name"),y=m.get(D);k(d,y?"vt-share":"vt-exit");y&&(k(y,"vt-share"),m.set(D,null));var E=d.querySelectorAll("[vt-share]");for(d=0;d<E.length;d++){var F=E[d],G=F.getAttribute("vt-name"),
H=m.get(G);H&&(k(F,"vt-share"),k(H,"vt-share"),m.set(G,null))}}c=c.nextSibling}for(var I=g[h+1],t=I.firstElementChild;t;)null!==m.get(t.getAttribute("vt-name"))&&k(t,"vt-enter"),t=t.nextElementSibling;c=x;do for(var n=c.firstElementChild;n;){var J=n.getAttribute("vt-update");J&&"none"!==J&&!l.includes(n)&&k(n,"vt-update");n=n.nextElementSibling}while((c=c.parentNode)&&1===c.nodeType&&"none"!==c.getAttribute("vt-update"));u.push.apply(u,I.querySelectorAll('img[src]:not([loading="lazy"])'))}}}if(B){var z=
document.__reactViewTransition=document.startViewTransition({update:function(){A(g);for(var a=[document.documentElement.clientHeight,document.fonts.ready],b={},e=0;e<u.length;b={g:b.g},e++)if(b.g=u[e],!b.g.complete){var p=b.g.getBoundingClientRect();0<p.bottom&&0<p.right&&p.top<window.innerHeight&&p.left<window.innerWidth&&(p=new Promise(function(w){return function(q){w.g.addEventListener("load",q);w.g.addEventListener("error",q)}}(b)),a.push(p))}return Promise.race([Promise.all(a),new Promise(function(w){var q=
performance.now();setTimeout(w,2300>q&&2E3<q?2300-q:500)})])},types:[]});z.ready.finally(function(){for(var a=l.length-3;0<=a;a-=3){var b=l[a],e=b.style;e.viewTransitionName=l[a+1];e.viewTransitionClass=l[a+1];""===b.getAttribute("style")&&b.removeAttribute("style")}});z.finished.finally(function(){document.__reactViewTransition===z&&(document.__reactViewTransition=null)});$RB=[];return}}catch(a){}A(g)}.bind(null,$RV);`
  );
  var completeBoundaryScript1Partial = stringToPrecomputedChunk('$RC("'), completeBoundaryWithStylesScript1FullPartial = stringToPrecomputedChunk(
    '$RM=new Map;$RR=function(n,w,p){function u(q){this._p=null;q()}for(var r=new Map,t=document,h,b,e=t.querySelectorAll("link[data-precedence],style[data-precedence]"),v=[],k=0;b=e[k++];)"not all"===b.getAttribute("media")?v.push(b):("LINK"===b.tagName&&$RM.set(b.getAttribute("href"),b),r.set(b.dataset.precedence,h=b));e=0;b=[];var l,a;for(k=!0;;){if(k){var f=p[e++];if(!f){k=!1;e=0;continue}var c=!1,m=0;var d=f[m++];if(a=$RM.get(d)){var g=a._p;c=!0}else{a=t.createElement("link");a.href=d;a.rel=\n"stylesheet";for(a.dataset.precedence=l=f[m++];g=f[m++];)a.setAttribute(g,f[m++]);g=a._p=new Promise(function(q,x){a.onload=u.bind(a,q);a.onerror=u.bind(a,x)});$RM.set(d,a)}d=a.getAttribute("media");!g||d&&!matchMedia(d).matches||b.push(g);if(c)continue}else{a=v[e++];if(!a)break;l=a.getAttribute("data-precedence");a.removeAttribute("media")}c=r.get(l)||h;c===h&&(h=a);r.set(l,a);c?c.parentNode.insertBefore(a,c.nextSibling):(c=t.head,c.insertBefore(a,c.firstChild))}if(p=document.getElementById(n))p.previousSibling.data=\n"$~";Promise.all(b).then($RC.bind(null,n,w),$RX.bind(null,n,"CSS failed to load"))};$RR("'
  ), completeBoundaryWithStylesScript1Partial = stringToPrecomputedChunk('$RR("'), completeBoundaryScript2 = stringToPrecomputedChunk('","'), completeBoundaryScript3a = stringToPrecomputedChunk('",'), completeBoundaryScript3b = stringToPrecomputedChunk('"'), completeBoundaryScriptEnd = stringToPrecomputedChunk(")<\/script>");
  stringToPrecomputedChunk('<template data-rci="" data-bid="');
  stringToPrecomputedChunk('<template data-rri="" data-bid="');
  stringToPrecomputedChunk('" data-sid="');
  stringToPrecomputedChunk('" data-sty="');
  var clientRenderScriptFunctionOnly = stringToPrecomputedChunk(
    '$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};'
  ), clientRenderScript1Full = stringToPrecomputedChunk(
    '$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};;$RX("'
  ), clientRenderScript1Partial = stringToPrecomputedChunk('$RX("'), clientRenderScript1A = stringToPrecomputedChunk('"'), clientRenderErrorScriptArgInterstitial = stringToPrecomputedChunk(","), clientRenderScriptEnd = stringToPrecomputedChunk(")<\/script>");
  stringToPrecomputedChunk('<template data-rxi="" data-bid="');
  stringToPrecomputedChunk('" data-dgst="');
  stringToPrecomputedChunk('" data-msg="');
  stringToPrecomputedChunk('" data-stck="');
  stringToPrecomputedChunk('" data-cstck="');
  var regexForJSStringsInInstructionScripts = /[<\u2028\u2029]/g;
  function escapeJSStringsForInstructionScripts(input) {
    return JSON.stringify(input).replace(
      regexForJSStringsInInstructionScripts,
      function(match) {
        switch (match) {
          case "<":
            return "\\u003c";
          case "\u2028":
            return "\\u2028";
          case "\u2029":
            return "\\u2029";
          default:
            throw Error(
              "escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
            );
        }
      }
    );
  }
  var regexForJSStringsInScripts = /[&><\u2028\u2029]/g;
  function escapeJSObjectForInstructionScripts(input) {
    return JSON.stringify(input).replace(
      regexForJSStringsInScripts,
      function(match) {
        switch (match) {
          case "&":
            return "\\u0026";
          case ">":
            return "\\u003e";
          case "<":
            return "\\u003c";
          case "\u2028":
            return "\\u2028";
          case "\u2029":
            return "\\u2029";
          default:
            throw Error(
              "escapeJSObjectForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
            );
        }
      }
    );
  }
  var lateStyleTagResourceOpen1 = stringToPrecomputedChunk(
    ' media="not all" data-precedence="'
  ), lateStyleTagResourceOpen2 = stringToPrecomputedChunk('" data-href="'), lateStyleTagResourceOpen3 = stringToPrecomputedChunk('">'), lateStyleTagTemplateClose = stringToPrecomputedChunk("</style>"), currentlyRenderingBoundaryHasStylesToHoist = false, destinationHasCapacity = true;
  function flushStyleTagsLateForBoundary(styleQueue) {
    var rules = styleQueue.rules, hrefs = styleQueue.hrefs, i = 0;
    if (hrefs.length) {
      writeChunk(this, currentlyFlushingRenderState.startInlineStyle);
      writeChunk(this, lateStyleTagResourceOpen1);
      writeChunk(this, styleQueue.precedence);
      for (writeChunk(this, lateStyleTagResourceOpen2); i < hrefs.length - 1; i++)
        writeChunk(this, hrefs[i]), writeChunk(this, spaceSeparator);
      writeChunk(this, hrefs[i]);
      writeChunk(this, lateStyleTagResourceOpen3);
      for (i = 0; i < rules.length; i++) writeChunk(this, rules[i]);
      destinationHasCapacity = writeChunkAndReturn(
        this,
        lateStyleTagTemplateClose
      );
      currentlyRenderingBoundaryHasStylesToHoist = true;
      rules.length = 0;
      hrefs.length = 0;
    }
  }
  function hasStylesToHoist(stylesheet) {
    return 2 !== stylesheet.state ? currentlyRenderingBoundaryHasStylesToHoist = true : false;
  }
  function writeHoistablesForBoundary(destination, hoistableState, renderState) {
    currentlyRenderingBoundaryHasStylesToHoist = false;
    destinationHasCapacity = true;
    currentlyFlushingRenderState = renderState;
    hoistableState.styles.forEach(flushStyleTagsLateForBoundary, destination);
    currentlyFlushingRenderState = null;
    hoistableState.stylesheets.forEach(hasStylesToHoist);
    currentlyRenderingBoundaryHasStylesToHoist && (renderState.stylesToHoist = true);
    return destinationHasCapacity;
  }
  function flushResource(resource) {
    for (var i = 0; i < resource.length; i++) writeChunk(this, resource[i]);
    resource.length = 0;
  }
  var stylesheetFlushingQueue = [];
  function flushStyleInPreamble(stylesheet) {
    pushLinkImpl(stylesheetFlushingQueue, stylesheet.props);
    for (var i = 0; i < stylesheetFlushingQueue.length; i++)
      writeChunk(this, stylesheetFlushingQueue[i]);
    stylesheetFlushingQueue.length = 0;
    stylesheet.state = 2;
  }
  var styleTagResourceOpen1 = stringToPrecomputedChunk(' data-precedence="'), styleTagResourceOpen2 = stringToPrecomputedChunk('" data-href="'), spaceSeparator = stringToPrecomputedChunk(" "), styleTagResourceOpen3 = stringToPrecomputedChunk('">'), styleTagResourceClose = stringToPrecomputedChunk("</style>");
  function flushStylesInPreamble(styleQueue) {
    var hasStylesheets = 0 < styleQueue.sheets.size;
    styleQueue.sheets.forEach(flushStyleInPreamble, this);
    styleQueue.sheets.clear();
    var rules = styleQueue.rules, hrefs = styleQueue.hrefs;
    if (!hasStylesheets || hrefs.length) {
      writeChunk(this, currentlyFlushingRenderState.startInlineStyle);
      writeChunk(this, styleTagResourceOpen1);
      writeChunk(this, styleQueue.precedence);
      styleQueue = 0;
      if (hrefs.length) {
        for (writeChunk(this, styleTagResourceOpen2); styleQueue < hrefs.length - 1; styleQueue++)
          writeChunk(this, hrefs[styleQueue]), writeChunk(this, spaceSeparator);
        writeChunk(this, hrefs[styleQueue]);
      }
      writeChunk(this, styleTagResourceOpen3);
      for (styleQueue = 0; styleQueue < rules.length; styleQueue++)
        writeChunk(this, rules[styleQueue]);
      writeChunk(this, styleTagResourceClose);
      rules.length = 0;
      hrefs.length = 0;
    }
  }
  function preloadLateStyle(stylesheet) {
    if (0 === stylesheet.state) {
      stylesheet.state = 1;
      var props = stylesheet.props;
      pushLinkImpl(stylesheetFlushingQueue, {
        rel: "preload",
        as: "style",
        href: stylesheet.props.href,
        crossOrigin: props.crossOrigin,
        fetchPriority: props.fetchPriority,
        integrity: props.integrity,
        media: props.media,
        hrefLang: props.hrefLang,
        referrerPolicy: props.referrerPolicy
      });
      for (stylesheet = 0; stylesheet < stylesheetFlushingQueue.length; stylesheet++)
        writeChunk(this, stylesheetFlushingQueue[stylesheet]);
      stylesheetFlushingQueue.length = 0;
    }
  }
  function preloadLateStyles(styleQueue) {
    styleQueue.sheets.forEach(preloadLateStyle, this);
    styleQueue.sheets.clear();
  }
  stringToPrecomputedChunk('<link rel="expect" href="#');
  stringToPrecomputedChunk('" blocking="render"/>');
  var completedShellIdAttributeStart = stringToPrecomputedChunk(' id="');
  function pushCompletedShellIdAttribute(target, resumableState) {
    0 === (resumableState.instructions & 32) && (resumableState.instructions |= 32, target.push(
      completedShellIdAttributeStart,
      stringToChunk(escapeTextForBrowser("_" + resumableState.idPrefix + "R_")),
      attributeEnd
    ));
  }
  var arrayFirstOpenBracket = stringToPrecomputedChunk("["), arraySubsequentOpenBracket = stringToPrecomputedChunk(",["), arrayInterstitial = stringToPrecomputedChunk(","), arrayCloseBracket = stringToPrecomputedChunk("]");
  function writeStyleResourceDependenciesInJS(destination, hoistableState) {
    writeChunk(destination, arrayFirstOpenBracket);
    var nextArrayOpenBrackChunk = arrayFirstOpenBracket;
    hoistableState.stylesheets.forEach(function(resource) {
      if (2 !== resource.state)
        if (3 === resource.state)
          writeChunk(destination, nextArrayOpenBrackChunk), writeChunk(
            destination,
            stringToChunk(
              escapeJSObjectForInstructionScripts("" + resource.props.href)
            )
          ), writeChunk(destination, arrayCloseBracket), nextArrayOpenBrackChunk = arraySubsequentOpenBracket;
        else {
          writeChunk(destination, nextArrayOpenBrackChunk);
          var precedence = resource.props["data-precedence"], props = resource.props, coercedHref = sanitizeURL("" + resource.props.href);
          writeChunk(
            destination,
            stringToChunk(escapeJSObjectForInstructionScripts(coercedHref))
          );
          precedence = "" + precedence;
          writeChunk(destination, arrayInterstitial);
          writeChunk(
            destination,
            stringToChunk(escapeJSObjectForInstructionScripts(precedence))
          );
          for (var propKey in props)
            if (hasOwnProperty.call(props, propKey) && (precedence = props[propKey], null != precedence))
              switch (propKey) {
                case "href":
                case "rel":
                case "precedence":
                case "data-precedence":
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(
                    "link is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
                  );
                default:
                  writeStyleResourceAttributeInJS(
                    destination,
                    propKey,
                    precedence
                  );
              }
          writeChunk(destination, arrayCloseBracket);
          nextArrayOpenBrackChunk = arraySubsequentOpenBracket;
          resource.state = 3;
        }
    });
    writeChunk(destination, arrayCloseBracket);
  }
  function writeStyleResourceAttributeInJS(destination, name, value) {
    var attributeName = name.toLowerCase();
    switch (typeof value) {
      case "function":
      case "symbol":
        return;
    }
    switch (name) {
      case "innerHTML":
      case "dangerouslySetInnerHTML":
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "style":
      case "ref":
        return;
      case "className":
        attributeName = "class";
        name = "" + value;
        break;
      case "hidden":
        if (false === value) return;
        name = "";
        break;
      case "src":
      case "href":
        value = sanitizeURL(value);
        name = "" + value;
        break;
      default:
        if (2 < name.length && ("o" === name[0] || "O" === name[0]) && ("n" === name[1] || "N" === name[1]) || !isAttributeNameSafe(name))
          return;
        name = "" + value;
    }
    writeChunk(destination, arrayInterstitial);
    writeChunk(
      destination,
      stringToChunk(escapeJSObjectForInstructionScripts(attributeName))
    );
    writeChunk(destination, arrayInterstitial);
    writeChunk(
      destination,
      stringToChunk(escapeJSObjectForInstructionScripts(name))
    );
  }
  function createHoistableState() {
    return { styles: /* @__PURE__ */ new Set(), stylesheets: /* @__PURE__ */ new Set(), suspenseyImages: false };
  }
  function prefetchDNS(href) {
    var request = resolveRequest();
    if (request) {
      var resumableState = request.resumableState, renderState = request.renderState;
      if ("string" === typeof href && href) {
        if (!resumableState.dnsResources.hasOwnProperty(href)) {
          resumableState.dnsResources[href] = null;
          resumableState = renderState.headers;
          var header, JSCompiler_temp;
          if (JSCompiler_temp = resumableState && 0 < resumableState.remainingCapacity)
            JSCompiler_temp = (header = "<" + ("" + href).replace(
              regexForHrefInLinkHeaderURLContext,
              escapeHrefForLinkHeaderURLContextReplacer
            ) + ">; rel=dns-prefetch", 0 <= (resumableState.remainingCapacity -= header.length + 2));
          JSCompiler_temp ? (renderState.resets.dns[href] = null, resumableState.preconnects && (resumableState.preconnects += ", "), resumableState.preconnects += header) : (header = [], pushLinkImpl(header, { href, rel: "dns-prefetch" }), renderState.preconnects.add(header));
        }
        enqueueFlush(request);
      }
    } else previousDispatcher.D(href);
  }
  function preconnect(href, crossOrigin) {
    var request = resolveRequest();
    if (request) {
      var resumableState = request.resumableState, renderState = request.renderState;
      if ("string" === typeof href && href) {
        var bucket = "use-credentials" === crossOrigin ? "credentials" : "string" === typeof crossOrigin ? "anonymous" : "default";
        if (!resumableState.connectResources[bucket].hasOwnProperty(href)) {
          resumableState.connectResources[bucket][href] = null;
          resumableState = renderState.headers;
          var header, JSCompiler_temp;
          if (JSCompiler_temp = resumableState && 0 < resumableState.remainingCapacity) {
            JSCompiler_temp = "<" + ("" + href).replace(
              regexForHrefInLinkHeaderURLContext,
              escapeHrefForLinkHeaderURLContextReplacer
            ) + ">; rel=preconnect";
            if ("string" === typeof crossOrigin) {
              var escapedCrossOrigin = ("" + crossOrigin).replace(
                regexForLinkHeaderQuotedParamValueContext,
                escapeStringForLinkHeaderQuotedParamValueContextReplacer
              );
              JSCompiler_temp += '; crossorigin="' + escapedCrossOrigin + '"';
            }
            JSCompiler_temp = (header = JSCompiler_temp, 0 <= (resumableState.remainingCapacity -= header.length + 2));
          }
          JSCompiler_temp ? (renderState.resets.connect[bucket][href] = null, resumableState.preconnects && (resumableState.preconnects += ", "), resumableState.preconnects += header) : (bucket = [], pushLinkImpl(bucket, {
            rel: "preconnect",
            href,
            crossOrigin
          }), renderState.preconnects.add(bucket));
        }
        enqueueFlush(request);
      }
    } else previousDispatcher.C(href, crossOrigin);
  }
  function preload(href, as, options) {
    var request = resolveRequest();
    if (request) {
      var resumableState = request.resumableState, renderState = request.renderState;
      if (as && href) {
        switch (as) {
          case "image":
            if (options) {
              var imageSrcSet = options.imageSrcSet;
              var imageSizes = options.imageSizes;
              var fetchPriority = options.fetchPriority;
            }
            var key = imageSrcSet ? imageSrcSet + "\n" + (imageSizes || "") : href;
            if (resumableState.imageResources.hasOwnProperty(key)) return;
            resumableState.imageResources[key] = PRELOAD_NO_CREDS;
            resumableState = renderState.headers;
            var header;
            resumableState && 0 < resumableState.remainingCapacity && "string" !== typeof imageSrcSet && "high" === fetchPriority && (header = getPreloadAsHeader(href, as, options), 0 <= (resumableState.remainingCapacity -= header.length + 2)) ? (renderState.resets.image[key] = PRELOAD_NO_CREDS, resumableState.highImagePreloads && (resumableState.highImagePreloads += ", "), resumableState.highImagePreloads += header) : (resumableState = [], pushLinkImpl(
              resumableState,
              assign(
                { rel: "preload", href: imageSrcSet ? void 0 : href, as },
                options
              )
            ), "high" === fetchPriority ? renderState.highImagePreloads.add(resumableState) : (renderState.bulkPreloads.add(resumableState), renderState.preloads.images.set(key, resumableState)));
            break;
          case "style":
            if (resumableState.styleResources.hasOwnProperty(href)) return;
            imageSrcSet = [];
            pushLinkImpl(
              imageSrcSet,
              assign({ rel: "preload", href, as }, options)
            );
            resumableState.styleResources[href] = !options || "string" !== typeof options.crossOrigin && "string" !== typeof options.integrity ? PRELOAD_NO_CREDS : [options.crossOrigin, options.integrity];
            renderState.preloads.stylesheets.set(href, imageSrcSet);
            renderState.bulkPreloads.add(imageSrcSet);
            break;
          case "script":
            if (resumableState.scriptResources.hasOwnProperty(href)) return;
            imageSrcSet = [];
            renderState.preloads.scripts.set(href, imageSrcSet);
            renderState.bulkPreloads.add(imageSrcSet);
            pushLinkImpl(
              imageSrcSet,
              assign({ rel: "preload", href, as }, options)
            );
            resumableState.scriptResources[href] = !options || "string" !== typeof options.crossOrigin && "string" !== typeof options.integrity ? PRELOAD_NO_CREDS : [options.crossOrigin, options.integrity];
            break;
          default:
            if (resumableState.unknownResources.hasOwnProperty(as)) {
              if (imageSrcSet = resumableState.unknownResources[as], imageSrcSet.hasOwnProperty(href))
                return;
            } else
              imageSrcSet = {}, resumableState.unknownResources[as] = imageSrcSet;
            imageSrcSet[href] = PRELOAD_NO_CREDS;
            if ((resumableState = renderState.headers) && 0 < resumableState.remainingCapacity && "font" === as && (key = getPreloadAsHeader(href, as, options), 0 <= (resumableState.remainingCapacity -= key.length + 2)))
              renderState.resets.font[href] = PRELOAD_NO_CREDS, resumableState.fontPreloads && (resumableState.fontPreloads += ", "), resumableState.fontPreloads += key;
            else
              switch (resumableState = [], href = assign({ rel: "preload", href, as }, options), pushLinkImpl(resumableState, href), as) {
                case "font":
                  renderState.fontPreloads.add(resumableState);
                  break;
                default:
                  renderState.bulkPreloads.add(resumableState);
              }
        }
        enqueueFlush(request);
      }
    } else previousDispatcher.L(href, as, options);
  }
  function preloadModule(href, options) {
    var request = resolveRequest();
    if (request) {
      var resumableState = request.resumableState, renderState = request.renderState;
      if (href) {
        var as = options && "string" === typeof options.as ? options.as : "script";
        switch (as) {
          case "script":
            if (resumableState.moduleScriptResources.hasOwnProperty(href)) return;
            as = [];
            resumableState.moduleScriptResources[href] = !options || "string" !== typeof options.crossOrigin && "string" !== typeof options.integrity ? PRELOAD_NO_CREDS : [options.crossOrigin, options.integrity];
            renderState.preloads.moduleScripts.set(href, as);
            break;
          default:
            if (resumableState.moduleUnknownResources.hasOwnProperty(as)) {
              var resources = resumableState.unknownResources[as];
              if (resources.hasOwnProperty(href)) return;
            } else
              resources = {}, resumableState.moduleUnknownResources[as] = resources;
            as = [];
            resources[href] = PRELOAD_NO_CREDS;
        }
        pushLinkImpl(as, assign({ rel: "modulepreload", href }, options));
        renderState.bulkPreloads.add(as);
        enqueueFlush(request);
      }
    } else previousDispatcher.m(href, options);
  }
  function preinitStyle(href, precedence, options) {
    var request = resolveRequest();
    if (request) {
      var resumableState = request.resumableState, renderState = request.renderState;
      if (href) {
        precedence = precedence || "default";
        var styleQueue = renderState.styles.get(precedence), resourceState = resumableState.styleResources.hasOwnProperty(href) ? resumableState.styleResources[href] : void 0;
        null !== resourceState && (resumableState.styleResources[href] = null, styleQueue || (styleQueue = {
          precedence: stringToChunk(escapeTextForBrowser(precedence)),
          rules: [],
          hrefs: [],
          sheets: /* @__PURE__ */ new Map()
        }, renderState.styles.set(precedence, styleQueue)), precedence = {
          state: 0,
          props: assign(
            { rel: "stylesheet", href, "data-precedence": precedence },
            options
          )
        }, resourceState && (2 === resourceState.length && adoptPreloadCredentials(precedence.props, resourceState), (renderState = renderState.preloads.stylesheets.get(href)) && 0 < renderState.length ? renderState.length = 0 : precedence.state = 1), styleQueue.sheets.set(href, precedence), enqueueFlush(request));
      }
    } else previousDispatcher.S(href, precedence, options);
  }
  function preinitScript(src, options) {
    var request = resolveRequest();
    if (request) {
      var resumableState = request.resumableState, renderState = request.renderState;
      if (src) {
        var resourceState = resumableState.scriptResources.hasOwnProperty(src) ? resumableState.scriptResources[src] : void 0;
        null !== resourceState && (resumableState.scriptResources[src] = null, options = assign({ src, async: true }, options), resourceState && (2 === resourceState.length && adoptPreloadCredentials(options, resourceState), src = renderState.preloads.scripts.get(src)) && (src.length = 0), src = [], renderState.scripts.add(src), pushScriptImpl(src, options), enqueueFlush(request));
      }
    } else previousDispatcher.X(src, options);
  }
  function preinitModuleScript(src, options) {
    var request = resolveRequest();
    if (request) {
      var resumableState = request.resumableState, renderState = request.renderState;
      if (src) {
        var resourceState = resumableState.moduleScriptResources.hasOwnProperty(
          src
        ) ? resumableState.moduleScriptResources[src] : void 0;
        null !== resourceState && (resumableState.moduleScriptResources[src] = null, options = assign({ src, type: "module", async: true }, options), resourceState && (2 === resourceState.length && adoptPreloadCredentials(options, resourceState), src = renderState.preloads.moduleScripts.get(src)) && (src.length = 0), src = [], renderState.scripts.add(src), pushScriptImpl(src, options), enqueueFlush(request));
      }
    } else previousDispatcher.M(src, options);
  }
  function adoptPreloadCredentials(target, preloadState) {
    null == target.crossOrigin && (target.crossOrigin = preloadState[0]);
    null == target.integrity && (target.integrity = preloadState[1]);
  }
  function getPreloadAsHeader(href, as, params) {
    href = ("" + href).replace(
      regexForHrefInLinkHeaderURLContext,
      escapeHrefForLinkHeaderURLContextReplacer
    );
    as = ("" + as).replace(
      regexForLinkHeaderQuotedParamValueContext,
      escapeStringForLinkHeaderQuotedParamValueContextReplacer
    );
    as = "<" + href + '>; rel=preload; as="' + as + '"';
    for (var paramName in params)
      hasOwnProperty.call(params, paramName) && (href = params[paramName], "string" === typeof href && (as += "; " + paramName.toLowerCase() + '="' + ("" + href).replace(
        regexForLinkHeaderQuotedParamValueContext,
        escapeStringForLinkHeaderQuotedParamValueContextReplacer
      ) + '"'));
    return as;
  }
  var regexForHrefInLinkHeaderURLContext = /[<>\r\n]/g;
  function escapeHrefForLinkHeaderURLContextReplacer(match) {
    switch (match) {
      case "<":
        return "%3C";
      case ">":
        return "%3E";
      case "\n":
        return "%0A";
      case "\r":
        return "%0D";
      default:
        throw Error(
          "escapeLinkHrefForHeaderContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
        );
    }
  }
  var regexForLinkHeaderQuotedParamValueContext = /["';,\r\n]/g;
  function escapeStringForLinkHeaderQuotedParamValueContextReplacer(match) {
    switch (match) {
      case '"':
        return "%22";
      case "'":
        return "%27";
      case ";":
        return "%3B";
      case ",":
        return "%2C";
      case "\n":
        return "%0A";
      case "\r":
        return "%0D";
      default:
        throw Error(
          "escapeStringForLinkHeaderQuotedParamValueContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
        );
    }
  }
  function hoistStyleQueueDependency(styleQueue) {
    this.styles.add(styleQueue);
  }
  function hoistStylesheetDependency(stylesheet) {
    this.stylesheets.add(stylesheet);
  }
  function hoistHoistables(parentState, childState) {
    childState.styles.forEach(hoistStyleQueueDependency, parentState);
    childState.stylesheets.forEach(hoistStylesheetDependency, parentState);
    childState.suspenseyImages && (parentState.suspenseyImages = true);
  }
  function hasSuspenseyContent(hoistableState) {
    return 0 < hoistableState.stylesheets.size || hoistableState.suspenseyImages;
  }
  var bind = Function.prototype.bind, supportsRequestStorage = "function" === typeof AsyncLocalStorage, requestStorage = supportsRequestStorage ? new AsyncLocalStorage() : null, REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference");
  function getComponentNameFromType(type) {
    if (null == type) return null;
    if ("function" === typeof type)
      return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
    if ("string" === typeof type) return type;
    switch (type) {
      case REACT_FRAGMENT_TYPE:
        return "Fragment";
      case REACT_PROFILER_TYPE:
        return "Profiler";
      case REACT_STRICT_MODE_TYPE:
        return "StrictMode";
      case REACT_SUSPENSE_TYPE:
        return "Suspense";
      case REACT_SUSPENSE_LIST_TYPE:
        return "SuspenseList";
      case REACT_ACTIVITY_TYPE:
        return "Activity";
    }
    if ("object" === typeof type)
      switch (type.$$typeof) {
        case REACT_PORTAL_TYPE:
          return "Portal";
        case REACT_CONTEXT_TYPE:
          return type.displayName || "Context";
        case REACT_CONSUMER_TYPE:
          return (type._context.displayName || "Context") + ".Consumer";
        case REACT_FORWARD_REF_TYPE:
          var innerType = type.render;
          type = type.displayName;
          type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
          return type;
        case REACT_MEMO_TYPE:
          return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
        case REACT_LAZY_TYPE:
          innerType = type._payload;
          type = type._init;
          try {
            return getComponentNameFromType(type(innerType));
          } catch (x) {
          }
      }
    return null;
  }
  var emptyContextObject = {}, currentActiveSnapshot = null;
  function popToNearestCommonAncestor(prev, next) {
    if (prev !== next) {
      prev.context._currentValue = prev.parentValue;
      prev = prev.parent;
      var parentNext = next.parent;
      if (null === prev) {
        if (null !== parentNext)
          throw Error(
            "The stacks must reach the root at the same time. This is a bug in React."
          );
      } else {
        if (null === parentNext)
          throw Error(
            "The stacks must reach the root at the same time. This is a bug in React."
          );
        popToNearestCommonAncestor(prev, parentNext);
      }
      next.context._currentValue = next.value;
    }
  }
  function popAllPrevious(prev) {
    prev.context._currentValue = prev.parentValue;
    prev = prev.parent;
    null !== prev && popAllPrevious(prev);
  }
  function pushAllNext(next) {
    var parentNext = next.parent;
    null !== parentNext && pushAllNext(parentNext);
    next.context._currentValue = next.value;
  }
  function popPreviousToCommonLevel(prev, next) {
    prev.context._currentValue = prev.parentValue;
    prev = prev.parent;
    if (null === prev)
      throw Error(
        "The depth must equal at least at zero before reaching the root. This is a bug in React."
      );
    prev.depth === next.depth ? popToNearestCommonAncestor(prev, next) : popPreviousToCommonLevel(prev, next);
  }
  function popNextToCommonLevel(prev, next) {
    var parentNext = next.parent;
    if (null === parentNext)
      throw Error(
        "The depth must equal at least at zero before reaching the root. This is a bug in React."
      );
    prev.depth === parentNext.depth ? popToNearestCommonAncestor(prev, parentNext) : popNextToCommonLevel(prev, parentNext);
    next.context._currentValue = next.value;
  }
  function switchContext(newSnapshot) {
    var prev = currentActiveSnapshot;
    prev !== newSnapshot && (null === prev ? pushAllNext(newSnapshot) : null === newSnapshot ? popAllPrevious(prev) : prev.depth === newSnapshot.depth ? popToNearestCommonAncestor(prev, newSnapshot) : prev.depth > newSnapshot.depth ? popPreviousToCommonLevel(prev, newSnapshot) : popNextToCommonLevel(prev, newSnapshot), currentActiveSnapshot = newSnapshot);
  }
  var classComponentUpdater = {
    enqueueSetState: function(inst, payload) {
      inst = inst._reactInternals;
      null !== inst.queue && inst.queue.push(payload);
    },
    enqueueReplaceState: function(inst, payload) {
      inst = inst._reactInternals;
      inst.replace = true;
      inst.queue = [payload];
    },
    enqueueForceUpdate: function() {
    }
  }, emptyTreeContext = { id: 1, overflow: "" };
  function pushTreeContext(baseContext, totalChildren, index) {
    var baseIdWithLeadingBit = baseContext.id;
    baseContext = baseContext.overflow;
    var baseLength = 32 - clz32(baseIdWithLeadingBit) - 1;
    baseIdWithLeadingBit &= ~(1 << baseLength);
    index += 1;
    var length = 32 - clz32(totalChildren) + baseLength;
    if (30 < length) {
      var numberOfOverflowBits = baseLength - baseLength % 5;
      length = (baseIdWithLeadingBit & (1 << numberOfOverflowBits) - 1).toString(32);
      baseIdWithLeadingBit >>= numberOfOverflowBits;
      baseLength -= numberOfOverflowBits;
      return {
        id: 1 << 32 - clz32(totalChildren) + baseLength | index << baseLength | baseIdWithLeadingBit,
        overflow: length + baseContext
      };
    }
    return {
      id: 1 << length | index << baseLength | baseIdWithLeadingBit,
      overflow: baseContext
    };
  }
  var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback, log2 = Math.log, LN2 = Math.LN2;
  function clz32Fallback(x) {
    x >>>= 0;
    return 0 === x ? 32 : 31 - (log2(x) / LN2 | 0) | 0;
  }
  function noop() {
  }
  var SuspenseException = Error(
    "Suspense Exception: This is not a real error! It's an implementation detail of `use` to interrupt the current render. You must either rethrow it immediately, or move the `use` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary, or call the promise's `.catch` method and pass the result to `use`."
  );
  function trackUsedThenable(thenableState2, thenable, index) {
    index = thenableState2[index];
    void 0 === index ? thenableState2.push(thenable) : index !== thenable && (thenable.then(noop, noop), thenable = index);
    switch (thenable.status) {
      case "fulfilled":
        return thenable.value;
      case "rejected":
        throw thenable.reason;
      default:
        "string" === typeof thenable.status ? thenable.then(noop, noop) : (thenableState2 = thenable, thenableState2.status = "pending", thenableState2.then(
          function(fulfilledValue) {
            if ("pending" === thenable.status) {
              var fulfilledThenable = thenable;
              fulfilledThenable.status = "fulfilled";
              fulfilledThenable.value = fulfilledValue;
            }
          },
          function(error2) {
            if ("pending" === thenable.status) {
              var rejectedThenable = thenable;
              rejectedThenable.status = "rejected";
              rejectedThenable.reason = error2;
            }
          }
        ));
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
        }
        suspendedThenable = thenable;
        throw SuspenseException;
    }
  }
  var suspendedThenable = null;
  function getSuspendedThenable() {
    if (null === suspendedThenable)
      throw Error(
        "Expected a suspended thenable. This is a bug in React. Please file an issue."
      );
    var thenable = suspendedThenable;
    suspendedThenable = null;
    return thenable;
  }
  function is(x, y) {
    return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
  }
  var objectIs = "function" === typeof Object.is ? Object.is : is, currentlyRenderingComponent = null, currentlyRenderingTask = null, currentlyRenderingRequest = null, currentlyRenderingKeyPath = null, firstWorkInProgressHook = null, workInProgressHook = null, isReRender = false, didScheduleRenderPhaseUpdate = false, localIdCounter = 0, actionStateCounter = 0, actionStateMatchingIndex = -1, thenableIndexCounter = 0, thenableState = null, renderPhaseUpdates = null, numberOfReRenders = 0;
  function resolveCurrentlyRenderingComponent() {
    if (null === currentlyRenderingComponent)
      throw Error(
        "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
      );
    return currentlyRenderingComponent;
  }
  function createHook() {
    if (0 < numberOfReRenders)
      throw Error("Rendered more hooks than during the previous render");
    return { memoizedState: null, queue: null, next: null };
  }
  function createWorkInProgressHook() {
    null === workInProgressHook ? null === firstWorkInProgressHook ? (isReRender = false, firstWorkInProgressHook = workInProgressHook = createHook()) : (isReRender = true, workInProgressHook = firstWorkInProgressHook) : null === workInProgressHook.next ? (isReRender = false, workInProgressHook = workInProgressHook.next = createHook()) : (isReRender = true, workInProgressHook = workInProgressHook.next);
    return workInProgressHook;
  }
  function getThenableStateAfterSuspending() {
    var state = thenableState;
    thenableState = null;
    return state;
  }
  function resetHooksState() {
    currentlyRenderingKeyPath = currentlyRenderingRequest = currentlyRenderingTask = currentlyRenderingComponent = null;
    didScheduleRenderPhaseUpdate = false;
    firstWorkInProgressHook = null;
    numberOfReRenders = 0;
    workInProgressHook = renderPhaseUpdates = null;
  }
  function basicStateReducer(state, action) {
    return "function" === typeof action ? action(state) : action;
  }
  function useReducer(reducer, initialArg, init) {
    currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
    workInProgressHook = createWorkInProgressHook();
    if (isReRender) {
      var queue = workInProgressHook.queue;
      initialArg = queue.dispatch;
      if (null !== renderPhaseUpdates && (init = renderPhaseUpdates.get(queue), void 0 !== init)) {
        renderPhaseUpdates.delete(queue);
        queue = workInProgressHook.memoizedState;
        do
          queue = reducer(queue, init.action), init = init.next;
        while (null !== init);
        workInProgressHook.memoizedState = queue;
        return [queue, initialArg];
      }
      return [workInProgressHook.memoizedState, initialArg];
    }
    reducer = reducer === basicStateReducer ? "function" === typeof initialArg ? initialArg() : initialArg : void 0 !== init ? init(initialArg) : initialArg;
    workInProgressHook.memoizedState = reducer;
    reducer = workInProgressHook.queue = { last: null, dispatch: null };
    reducer = reducer.dispatch = dispatchAction.bind(
      null,
      currentlyRenderingComponent,
      reducer
    );
    return [workInProgressHook.memoizedState, reducer];
  }
  function useMemo(nextCreate, deps) {
    currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
    workInProgressHook = createWorkInProgressHook();
    deps = void 0 === deps ? null : deps;
    if (null !== workInProgressHook) {
      var prevState = workInProgressHook.memoizedState;
      if (null !== prevState && null !== deps) {
        var prevDeps = prevState[1];
        a: if (null === prevDeps) prevDeps = false;
        else {
          for (var i = 0; i < prevDeps.length && i < deps.length; i++)
            if (!objectIs(deps[i], prevDeps[i])) {
              prevDeps = false;
              break a;
            }
          prevDeps = true;
        }
        if (prevDeps) return prevState[0];
      }
    }
    nextCreate = nextCreate();
    workInProgressHook.memoizedState = [nextCreate, deps];
    return nextCreate;
  }
  function dispatchAction(componentIdentity, queue, action) {
    if (25 <= numberOfReRenders)
      throw Error(
        "Too many re-renders. React limits the number of renders to prevent an infinite loop."
      );
    if (componentIdentity === currentlyRenderingComponent)
      if (didScheduleRenderPhaseUpdate = true, componentIdentity = { action, next: null }, null === renderPhaseUpdates && (renderPhaseUpdates = /* @__PURE__ */ new Map()), action = renderPhaseUpdates.get(queue), void 0 === action)
        renderPhaseUpdates.set(queue, componentIdentity);
      else {
        for (queue = action; null !== queue.next; ) queue = queue.next;
        queue.next = componentIdentity;
      }
  }
  function throwOnUseEffectEventCall() {
    throw Error(
      "A function wrapped in useEffectEvent can't be called during rendering."
    );
  }
  function unsupportedStartTransition() {
    throw Error("startTransition cannot be called during server rendering.");
  }
  function unsupportedSetOptimisticState() {
    throw Error("Cannot update optimistic state while rendering.");
  }
  function useActionState(action, initialState, permalink) {
    resolveCurrentlyRenderingComponent();
    var actionStateHookIndex = actionStateCounter++, request = currentlyRenderingRequest;
    if ("function" === typeof action.$$FORM_ACTION) {
      var nextPostbackStateKey = null, componentKeyPath = currentlyRenderingKeyPath;
      request = request.formState;
      var isSignatureEqual = action.$$IS_SIGNATURE_EQUAL;
      if (null !== request && "function" === typeof isSignatureEqual) {
        var postbackKey = request[1];
        isSignatureEqual.call(action, request[2], request[3]) && (nextPostbackStateKey = void 0 !== permalink ? "p" + permalink : "k" + murmurhash3_32_gc(
          JSON.stringify([componentKeyPath, null, actionStateHookIndex]),
          0
        ), postbackKey === nextPostbackStateKey && (actionStateMatchingIndex = actionStateHookIndex, initialState = request[0]));
      }
      var boundAction = action.bind(null, initialState);
      action = function(payload) {
        boundAction(payload);
      };
      "function" === typeof boundAction.$$FORM_ACTION && (action.$$FORM_ACTION = function(prefix2) {
        prefix2 = boundAction.$$FORM_ACTION(prefix2);
        void 0 !== permalink && (permalink += "", prefix2.action = permalink);
        var formData = prefix2.data;
        formData && (null === nextPostbackStateKey && (nextPostbackStateKey = void 0 !== permalink ? "p" + permalink : "k" + murmurhash3_32_gc(
          JSON.stringify([
            componentKeyPath,
            null,
            actionStateHookIndex
          ]),
          0
        )), formData.append("$ACTION_KEY", nextPostbackStateKey));
        return prefix2;
      });
      return [initialState, action, false];
    }
    var boundAction$22 = action.bind(null, initialState);
    return [
      initialState,
      function(payload) {
        boundAction$22(payload);
      },
      false
    ];
  }
  function unwrapThenable(thenable) {
    var index = thenableIndexCounter;
    thenableIndexCounter += 1;
    null === thenableState && (thenableState = []);
    return trackUsedThenable(thenableState, thenable, index);
  }
  function unsupportedRefresh() {
    throw Error("Cache cannot be refreshed during server rendering.");
  }
  var HooksDispatcher = {
    readContext: function(context) {
      return context._currentValue;
    },
    use: function(usable) {
      if (null !== usable && "object" === typeof usable) {
        if ("function" === typeof usable.then) return unwrapThenable(usable);
        if (usable.$$typeof === REACT_CONTEXT_TYPE) return usable._currentValue;
      }
      throw Error("An unsupported type was passed to use(): " + String(usable));
    },
    useContext: function(context) {
      resolveCurrentlyRenderingComponent();
      return context._currentValue;
    },
    useMemo,
    useReducer,
    useRef: function(initialValue) {
      currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
      workInProgressHook = createWorkInProgressHook();
      var previousRef = workInProgressHook.memoizedState;
      return null === previousRef ? (initialValue = { current: initialValue }, workInProgressHook.memoizedState = initialValue) : previousRef;
    },
    useState: function(initialState) {
      return useReducer(basicStateReducer, initialState);
    },
    useInsertionEffect: noop,
    useLayoutEffect: noop,
    useCallback: function(callback, deps) {
      return useMemo(function() {
        return callback;
      }, deps);
    },
    useImperativeHandle: noop,
    useEffect: noop,
    useDebugValue: noop,
    useDeferredValue: function(value, initialValue) {
      resolveCurrentlyRenderingComponent();
      return void 0 !== initialValue ? initialValue : value;
    },
    useTransition: function() {
      resolveCurrentlyRenderingComponent();
      return [false, unsupportedStartTransition];
    },
    useId: function() {
      var JSCompiler_inline_result = currentlyRenderingTask.treeContext;
      var overflow = JSCompiler_inline_result.overflow;
      JSCompiler_inline_result = JSCompiler_inline_result.id;
      JSCompiler_inline_result = (JSCompiler_inline_result & ~(1 << 32 - clz32(JSCompiler_inline_result) - 1)).toString(32) + overflow;
      var resumableState = currentResumableState;
      if (null === resumableState)
        throw Error(
          "Invalid hook call. Hooks can only be called inside of the body of a function component."
        );
      overflow = localIdCounter++;
      JSCompiler_inline_result = "_" + resumableState.idPrefix + "R_" + JSCompiler_inline_result;
      0 < overflow && (JSCompiler_inline_result += "H" + overflow.toString(32));
      return JSCompiler_inline_result + "_";
    },
    useSyncExternalStore: function(subscribe, getSnapshot, getServerSnapshot) {
      if (void 0 === getServerSnapshot)
        throw Error(
          "Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering."
        );
      return getServerSnapshot();
    },
    useOptimistic: function(passthrough) {
      resolveCurrentlyRenderingComponent();
      return [passthrough, unsupportedSetOptimisticState];
    },
    useActionState,
    useFormState: useActionState,
    useHostTransitionStatus: function() {
      resolveCurrentlyRenderingComponent();
      return sharedNotPendingObject;
    },
    useMemoCache: function(size) {
      for (var data = Array(size), i = 0; i < size; i++)
        data[i] = REACT_MEMO_CACHE_SENTINEL;
      return data;
    },
    useCacheRefresh: function() {
      return unsupportedRefresh;
    },
    useEffectEvent: function() {
      return throwOnUseEffectEventCall;
    }
  }, currentResumableState = null, DefaultAsyncDispatcher = {
    getCacheForType: function() {
      throw Error("Not implemented.");
    },
    cacheSignal: function() {
      throw Error("Not implemented.");
    }
  };
  function prepareStackTrace(error2, structuredStackTrace) {
    error2 = (error2.name || "Error") + ": " + (error2.message || "");
    for (var i = 0; i < structuredStackTrace.length; i++)
      error2 += "\n    at " + structuredStackTrace[i].toString();
    return error2;
  }
  var prefix, suffix;
  function describeBuiltInComponentFrame(name) {
    if (void 0 === prefix)
      try {
        throw Error();
      } catch (x) {
        var match = x.stack.trim().match(/\n( *(at )?)/);
        prefix = match && match[1] || "";
        suffix = -1 < x.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < x.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return "\n" + prefix + name + suffix;
  }
  var reentry = false;
  function describeNativeComponentFrame(fn, construct) {
    if (!fn || reentry) return "";
    reentry = true;
    var previousPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = prepareStackTrace;
    try {
      var RunInRootFrame = {
        DetermineComponentFrameRoot: function() {
          try {
            if (construct) {
              var Fake = function() {
                throw Error();
              };
              Object.defineProperty(Fake.prototype, "props", {
                set: function() {
                  throw Error();
                }
              });
              if ("object" === typeof Reflect && Reflect.construct) {
                try {
                  Reflect.construct(Fake, []);
                } catch (x) {
                  var control = x;
                }
                Reflect.construct(fn, [], Fake);
              } else {
                try {
                  Fake.call();
                } catch (x$24) {
                  control = x$24;
                }
                fn.call(Fake.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (x$25) {
                control = x$25;
              }
              (Fake = fn()) && "function" === typeof Fake.catch && Fake.catch(function() {
              });
            }
          } catch (sample) {
            if (sample && control && "string" === typeof sample.stack)
              return [sample.stack, control.stack];
          }
          return [null, null];
        }
      };
      RunInRootFrame.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var namePropDescriptor = Object.getOwnPropertyDescriptor(
        RunInRootFrame.DetermineComponentFrameRoot,
        "name"
      );
      namePropDescriptor && namePropDescriptor.configurable && Object.defineProperty(
        RunInRootFrame.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(), sampleStack = _RunInRootFrame$Deter[0], controlStack = _RunInRootFrame$Deter[1];
      if (sampleStack && controlStack) {
        var sampleLines = sampleStack.split("\n"), controlLines = controlStack.split("\n");
        for (namePropDescriptor = RunInRootFrame = 0; RunInRootFrame < sampleLines.length && !sampleLines[RunInRootFrame].includes("DetermineComponentFrameRoot"); )
          RunInRootFrame++;
        for (; namePropDescriptor < controlLines.length && !controlLines[namePropDescriptor].includes(
          "DetermineComponentFrameRoot"
        ); )
          namePropDescriptor++;
        if (RunInRootFrame === sampleLines.length || namePropDescriptor === controlLines.length)
          for (RunInRootFrame = sampleLines.length - 1, namePropDescriptor = controlLines.length - 1; 1 <= RunInRootFrame && 0 <= namePropDescriptor && sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]; )
            namePropDescriptor--;
        for (; 1 <= RunInRootFrame && 0 <= namePropDescriptor; RunInRootFrame--, namePropDescriptor--)
          if (sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
            if (1 !== RunInRootFrame || 1 !== namePropDescriptor) {
              do
                if (RunInRootFrame--, namePropDescriptor--, 0 > namePropDescriptor || sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
                  var frame = "\n" + sampleLines[RunInRootFrame].replace(" at new ", " at ");
                  fn.displayName && frame.includes("<anonymous>") && (frame = frame.replace("<anonymous>", fn.displayName));
                  return frame;
                }
              while (1 <= RunInRootFrame && 0 <= namePropDescriptor);
            }
            break;
          }
      }
    } finally {
      reentry = false, Error.prepareStackTrace = previousPrepareStackTrace;
    }
    return (previousPrepareStackTrace = fn ? fn.displayName || fn.name : "") ? describeBuiltInComponentFrame(previousPrepareStackTrace) : "";
  }
  function describeComponentStackByType(type) {
    if ("string" === typeof type) return describeBuiltInComponentFrame(type);
    if ("function" === typeof type)
      return type.prototype && type.prototype.isReactComponent ? describeNativeComponentFrame(type, true) : describeNativeComponentFrame(type, false);
    if ("object" === typeof type && null !== type) {
      switch (type.$$typeof) {
        case REACT_FORWARD_REF_TYPE:
          return describeNativeComponentFrame(type.render, false);
        case REACT_MEMO_TYPE:
          return describeNativeComponentFrame(type.type, false);
        case REACT_LAZY_TYPE:
          var lazyComponent = type, payload = lazyComponent._payload;
          lazyComponent = lazyComponent._init;
          try {
            type = lazyComponent(payload);
          } catch (x) {
            return describeBuiltInComponentFrame("Lazy");
          }
          return describeComponentStackByType(type);
      }
      if ("string" === typeof type.name) {
        a: {
          payload = type.name;
          lazyComponent = type.env;
          var location = type.debugLocation;
          if (null != location && (type = Error.prepareStackTrace, Error.prepareStackTrace = prepareStackTrace, location = location.stack, Error.prepareStackTrace = type, location.startsWith("Error: react-stack-top-frame\n") && (location = location.slice(29)), type = location.indexOf("\n"), -1 !== type && (location = location.slice(type + 1)), type = location.indexOf("react_stack_bottom_frame"), -1 !== type && (type = location.lastIndexOf("\n", type)), type = -1 !== type ? location = location.slice(0, type) : "", location = type.lastIndexOf("\n"), type = -1 === location ? type : type.slice(location + 1), -1 !== type.indexOf(payload))) {
            payload = "\n" + type;
            break a;
          }
          payload = describeBuiltInComponentFrame(
            payload + (lazyComponent ? " [" + lazyComponent + "]" : "")
          );
        }
        return payload;
      }
    }
    switch (type) {
      case REACT_SUSPENSE_LIST_TYPE:
        return describeBuiltInComponentFrame("SuspenseList");
      case REACT_SUSPENSE_TYPE:
        return describeBuiltInComponentFrame("Suspense");
    }
    return "";
  }
  function isEligibleForOutlining(request, boundary) {
    return (500 < boundary.byteSize || hasSuspenseyContent(boundary.contentState)) && null === boundary.contentPreamble;
  }
  function defaultErrorHandler(error2) {
    if ("object" === typeof error2 && null !== error2 && "string" === typeof error2.environmentName) {
      var JSCompiler_inline_result = error2.environmentName;
      error2 = [error2].slice(0);
      "string" === typeof error2[0] ? error2.splice(
        0,
        1,
        "\x1B[0m\x1B[7m%c%s\x1B[0m%c " + error2[0],
        "background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px",
        " " + JSCompiler_inline_result + " ",
        ""
      ) : error2.splice(
        0,
        0,
        "\x1B[0m\x1B[7m%c%s\x1B[0m%c",
        "background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px",
        " " + JSCompiler_inline_result + " ",
        ""
      );
      error2.unshift(console);
      JSCompiler_inline_result = bind.apply(console.error, error2);
      JSCompiler_inline_result();
    } else console.error(error2);
    return null;
  }
  function RequestInstance(resumableState, renderState, rootFormatContext, progressiveChunkSize, onError, onAllReady, onShellReady, onShellError, onFatalError, onPostpone, formState) {
    var abortSet = /* @__PURE__ */ new Set();
    this.destination = null;
    this.flushScheduled = false;
    this.resumableState = resumableState;
    this.renderState = renderState;
    this.rootFormatContext = rootFormatContext;
    this.progressiveChunkSize = void 0 === progressiveChunkSize ? 12800 : progressiveChunkSize;
    this.status = 10;
    this.fatalError = null;
    this.pendingRootTasks = this.allPendingTasks = this.nextSegmentId = 0;
    this.completedPreambleSegments = this.completedRootSegment = null;
    this.byteSize = 0;
    this.abortableTasks = abortSet;
    this.pingedTasks = [];
    this.clientRenderedBoundaries = [];
    this.completedBoundaries = [];
    this.partialBoundaries = [];
    this.trackedPostpones = null;
    this.onError = void 0 === onError ? defaultErrorHandler : onError;
    this.onPostpone = void 0 === onPostpone ? noop : onPostpone;
    this.onAllReady = void 0 === onAllReady ? noop : onAllReady;
    this.onShellReady = void 0 === onShellReady ? noop : onShellReady;
    this.onShellError = void 0 === onShellError ? noop : onShellError;
    this.onFatalError = void 0 === onFatalError ? noop : onFatalError;
    this.formState = void 0 === formState ? null : formState;
  }
  function createRequest(children, resumableState, renderState, rootFormatContext, progressiveChunkSize, onError, onAllReady, onShellReady, onShellError, onFatalError, onPostpone, formState) {
    resumableState = new RequestInstance(
      resumableState,
      renderState,
      rootFormatContext,
      progressiveChunkSize,
      onError,
      onAllReady,
      onShellReady,
      onShellError,
      onFatalError,
      onPostpone,
      formState
    );
    renderState = createPendingSegment(
      resumableState,
      0,
      null,
      rootFormatContext,
      false,
      false
    );
    renderState.parentFlushed = true;
    children = createRenderTask(
      resumableState,
      null,
      children,
      -1,
      null,
      renderState,
      null,
      null,
      resumableState.abortableTasks,
      null,
      rootFormatContext,
      null,
      emptyTreeContext,
      null,
      null
    );
    pushComponentStack(children);
    resumableState.pingedTasks.push(children);
    return resumableState;
  }
  function createPrerenderRequest(children, resumableState, renderState, rootFormatContext, progressiveChunkSize, onError, onAllReady, onShellReady, onShellError, onFatalError, onPostpone) {
    children = createRequest(
      children,
      resumableState,
      renderState,
      rootFormatContext,
      progressiveChunkSize,
      onError,
      onAllReady,
      onShellReady,
      onShellError,
      onFatalError,
      onPostpone,
      void 0
    );
    children.trackedPostpones = {
      workingMap: /* @__PURE__ */ new Map(),
      rootNodes: [],
      rootSlots: null
    };
    return children;
  }
  function resumeRequest(children, postponedState, renderState, onError, onAllReady, onShellReady, onShellError, onFatalError, onPostpone) {
    renderState = new RequestInstance(
      postponedState.resumableState,
      renderState,
      postponedState.rootFormatContext,
      postponedState.progressiveChunkSize,
      onError,
      onAllReady,
      onShellReady,
      onShellError,
      onFatalError,
      onPostpone,
      null
    );
    renderState.nextSegmentId = postponedState.nextSegmentId;
    if ("number" === typeof postponedState.replaySlots)
      return onError = createPendingSegment(
        renderState,
        0,
        null,
        postponedState.rootFormatContext,
        false,
        false
      ), onError.parentFlushed = true, children = createRenderTask(
        renderState,
        null,
        children,
        -1,
        null,
        onError,
        null,
        null,
        renderState.abortableTasks,
        null,
        postponedState.rootFormatContext,
        null,
        emptyTreeContext,
        null,
        null
      ), pushComponentStack(children), renderState.pingedTasks.push(children), renderState;
    children = createReplayTask(
      renderState,
      null,
      {
        nodes: postponedState.replayNodes,
        slots: postponedState.replaySlots,
        pendingTasks: 0
      },
      children,
      -1,
      null,
      null,
      renderState.abortableTasks,
      null,
      postponedState.rootFormatContext,
      null,
      emptyTreeContext,
      null,
      null
    );
    pushComponentStack(children);
    renderState.pingedTasks.push(children);
    return renderState;
  }
  function resumeAndPrerenderRequest(children, postponedState, renderState, onError, onAllReady, onShellReady, onShellError, onFatalError, onPostpone) {
    children = resumeRequest(
      children,
      postponedState,
      renderState,
      onError,
      onAllReady,
      onShellReady,
      onShellError,
      onFatalError,
      onPostpone
    );
    children.trackedPostpones = {
      workingMap: /* @__PURE__ */ new Map(),
      rootNodes: [],
      rootSlots: null
    };
    return children;
  }
  var currentRequest = null;
  function resolveRequest() {
    if (currentRequest) return currentRequest;
    if (supportsRequestStorage) {
      var store = requestStorage.getStore();
      if (store) return store;
    }
    return null;
  }
  function pingTask(request, task) {
    request.pingedTasks.push(task);
    1 === request.pingedTasks.length && (request.flushScheduled = null !== request.destination, null !== request.trackedPostpones || 10 === request.status ? scheduleMicrotask(function() {
      return performWork(request);
    }) : setTimeout(function() {
      return performWork(request);
    }, 0));
  }
  function createSuspenseBoundary(request, row, fallbackAbortableTasks, contentPreamble, fallbackPreamble) {
    fallbackAbortableTasks = {
      status: 0,
      rootSegmentID: -1,
      parentFlushed: false,
      pendingTasks: 0,
      row,
      completedSegments: [],
      byteSize: 0,
      fallbackAbortableTasks,
      errorDigest: null,
      contentState: createHoistableState(),
      fallbackState: createHoistableState(),
      contentPreamble,
      fallbackPreamble,
      trackedContentKeyPath: null,
      trackedFallbackNode: null
    };
    null !== row && (row.pendingTasks++, contentPreamble = row.boundaries, null !== contentPreamble && (request.allPendingTasks++, fallbackAbortableTasks.pendingTasks++, contentPreamble.push(fallbackAbortableTasks)), request = row.inheritedHoistables, null !== request && hoistHoistables(fallbackAbortableTasks.contentState, request));
    return fallbackAbortableTasks;
  }
  function createRenderTask(request, thenableState2, node, childIndex, blockedBoundary, blockedSegment, blockedPreamble, hoistableState, abortSet, keyPath, formatContext, context, treeContext, row, componentStack) {
    request.allPendingTasks++;
    null === blockedBoundary ? request.pendingRootTasks++ : blockedBoundary.pendingTasks++;
    null !== row && row.pendingTasks++;
    var task = {
      replay: null,
      node,
      childIndex,
      ping: function() {
        return pingTask(request, task);
      },
      blockedBoundary,
      blockedSegment,
      blockedPreamble,
      hoistableState,
      abortSet,
      keyPath,
      formatContext,
      context,
      treeContext,
      row,
      componentStack,
      thenableState: thenableState2
    };
    abortSet.add(task);
    return task;
  }
  function createReplayTask(request, thenableState2, replay, node, childIndex, blockedBoundary, hoistableState, abortSet, keyPath, formatContext, context, treeContext, row, componentStack) {
    request.allPendingTasks++;
    null === blockedBoundary ? request.pendingRootTasks++ : blockedBoundary.pendingTasks++;
    null !== row && row.pendingTasks++;
    replay.pendingTasks++;
    var task = {
      replay,
      node,
      childIndex,
      ping: function() {
        return pingTask(request, task);
      },
      blockedBoundary,
      blockedSegment: null,
      blockedPreamble: null,
      hoistableState,
      abortSet,
      keyPath,
      formatContext,
      context,
      treeContext,
      row,
      componentStack,
      thenableState: thenableState2
    };
    abortSet.add(task);
    return task;
  }
  function createPendingSegment(request, index, boundary, parentFormatContext, lastPushedText, textEmbedded) {
    return {
      status: 0,
      parentFlushed: false,
      id: -1,
      index,
      chunks: [],
      children: [],
      preambleChildren: [],
      parentFormatContext,
      boundary,
      lastPushedText,
      textEmbedded
    };
  }
  function pushComponentStack(task) {
    var node = task.node;
    if ("object" === typeof node && null !== node)
      switch (node.$$typeof) {
        case REACT_ELEMENT_TYPE:
          task.componentStack = { parent: task.componentStack, type: node.type };
      }
  }
  function replaceSuspenseComponentStackWithSuspenseFallbackStack(componentStack) {
    return null === componentStack ? null : { parent: componentStack.parent, type: "Suspense Fallback" };
  }
  function getThrownInfo(node$jscomp$0) {
    var errorInfo = {};
    node$jscomp$0 && Object.defineProperty(errorInfo, "componentStack", {
      configurable: true,
      enumerable: true,
      get: function() {
        try {
          var info2 = "", node = node$jscomp$0;
          do
            info2 += describeComponentStackByType(node.type), node = node.parent;
          while (node);
          var JSCompiler_inline_result = info2;
        } catch (x) {
          JSCompiler_inline_result = "\nError generating stack: " + x.message + "\n" + x.stack;
        }
        Object.defineProperty(errorInfo, "componentStack", {
          value: JSCompiler_inline_result
        });
        return JSCompiler_inline_result;
      }
    });
    return errorInfo;
  }
  function logRecoverableError(request, error2, errorInfo) {
    request = request.onError;
    error2 = request(error2, errorInfo);
    if (null == error2 || "string" === typeof error2) return error2;
  }
  function fatalError(request, error2) {
    var onShellError = request.onShellError, onFatalError = request.onFatalError;
    onShellError(error2);
    onFatalError(error2);
    null !== request.destination ? (request.status = 14, closeWithError(request.destination, error2)) : (request.status = 13, request.fatalError = error2);
  }
  function finishSuspenseListRow(request, row) {
    unblockSuspenseListRow(request, row.next, row.hoistables);
  }
  function unblockSuspenseListRow(request, unblockedRow, inheritedHoistables) {
    for (; null !== unblockedRow; ) {
      null !== inheritedHoistables && (hoistHoistables(unblockedRow.hoistables, inheritedHoistables), unblockedRow.inheritedHoistables = inheritedHoistables);
      var unblockedBoundaries = unblockedRow.boundaries;
      if (null !== unblockedBoundaries) {
        unblockedRow.boundaries = null;
        for (var i = 0; i < unblockedBoundaries.length; i++) {
          var unblockedBoundary = unblockedBoundaries[i];
          null !== inheritedHoistables && hoistHoistables(unblockedBoundary.contentState, inheritedHoistables);
          finishedTask(request, unblockedBoundary, null, null);
        }
      }
      unblockedRow.pendingTasks--;
      if (0 < unblockedRow.pendingTasks) break;
      inheritedHoistables = unblockedRow.hoistables;
      unblockedRow = unblockedRow.next;
    }
  }
  function tryToResolveTogetherRow(request, togetherRow) {
    var boundaries = togetherRow.boundaries;
    if (null !== boundaries && togetherRow.pendingTasks === boundaries.length) {
      for (var allCompleteAndInlinable = true, i = 0; i < boundaries.length; i++) {
        var rowBoundary = boundaries[i];
        if (1 !== rowBoundary.pendingTasks || rowBoundary.parentFlushed || isEligibleForOutlining(request, rowBoundary)) {
          allCompleteAndInlinable = false;
          break;
        }
      }
      allCompleteAndInlinable && unblockSuspenseListRow(request, togetherRow, togetherRow.hoistables);
    }
  }
  function createSuspenseListRow(previousRow) {
    var newRow = {
      pendingTasks: 1,
      boundaries: null,
      hoistables: createHoistableState(),
      inheritedHoistables: null,
      together: false,
      next: null
    };
    null !== previousRow && 0 < previousRow.pendingTasks && (newRow.pendingTasks++, newRow.boundaries = [], previousRow.next = newRow);
    return newRow;
  }
  function renderSuspenseListRows(request, task, keyPath, rows, revealOrder) {
    var prevKeyPath = task.keyPath, prevTreeContext = task.treeContext, prevRow = task.row;
    task.keyPath = keyPath;
    keyPath = rows.length;
    var previousSuspenseListRow = null;
    if (null !== task.replay) {
      var resumeSlots = task.replay.slots;
      if (null !== resumeSlots && "object" === typeof resumeSlots)
        for (var n = 0; n < keyPath; n++) {
          var i = "backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder ? n : keyPath - 1 - n, node = rows[i];
          task.row = previousSuspenseListRow = createSuspenseListRow(
            previousSuspenseListRow
          );
          task.treeContext = pushTreeContext(prevTreeContext, keyPath, i);
          var resumeSegmentID = resumeSlots[i];
          "number" === typeof resumeSegmentID ? (resumeNode(request, task, resumeSegmentID, node, i), delete resumeSlots[i]) : renderNode2(request, task, node, i);
          0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
        }
      else
        for (resumeSlots = 0; resumeSlots < keyPath; resumeSlots++)
          n = "backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder ? resumeSlots : keyPath - 1 - resumeSlots, i = rows[n], task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow), task.treeContext = pushTreeContext(prevTreeContext, keyPath, n), renderNode2(request, task, i, n), 0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
    } else if ("backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder)
      for (revealOrder = 0; revealOrder < keyPath; revealOrder++)
        resumeSlots = rows[revealOrder], task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow), task.treeContext = pushTreeContext(
          prevTreeContext,
          keyPath,
          revealOrder
        ), renderNode2(request, task, resumeSlots, revealOrder), 0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
    else {
      revealOrder = task.blockedSegment;
      resumeSlots = revealOrder.children.length;
      n = revealOrder.chunks.length;
      for (i = keyPath - 1; 0 <= i; i--) {
        node = rows[i];
        task.row = previousSuspenseListRow = createSuspenseListRow(
          previousSuspenseListRow
        );
        task.treeContext = pushTreeContext(prevTreeContext, keyPath, i);
        resumeSegmentID = createPendingSegment(
          request,
          n,
          null,
          task.formatContext,
          0 === i ? revealOrder.lastPushedText : true,
          true
        );
        revealOrder.children.splice(resumeSlots, 0, resumeSegmentID);
        task.blockedSegment = resumeSegmentID;
        try {
          renderNode2(request, task, node, i), resumeSegmentID.lastPushedText && resumeSegmentID.textEmbedded && resumeSegmentID.chunks.push(textSeparator), resumeSegmentID.status = 1, finishedSegment(request, task.blockedBoundary, resumeSegmentID), 0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
        } catch (thrownValue) {
          throw resumeSegmentID.status = 12 === request.status ? 3 : 4, thrownValue;
        }
      }
      task.blockedSegment = revealOrder;
      revealOrder.lastPushedText = false;
    }
    null !== prevRow && null !== previousSuspenseListRow && 0 < previousSuspenseListRow.pendingTasks && (prevRow.pendingTasks++, previousSuspenseListRow.next = prevRow);
    task.treeContext = prevTreeContext;
    task.row = prevRow;
    task.keyPath = prevKeyPath;
  }
  function renderWithHooks(request, task, keyPath, Component, props, secondArg) {
    var prevThenableState = task.thenableState;
    task.thenableState = null;
    currentlyRenderingComponent = {};
    currentlyRenderingTask = task;
    currentlyRenderingRequest = request;
    currentlyRenderingKeyPath = keyPath;
    actionStateCounter = localIdCounter = 0;
    actionStateMatchingIndex = -1;
    thenableIndexCounter = 0;
    thenableState = prevThenableState;
    for (request = Component(props, secondArg); didScheduleRenderPhaseUpdate; )
      didScheduleRenderPhaseUpdate = false, actionStateCounter = localIdCounter = 0, actionStateMatchingIndex = -1, thenableIndexCounter = 0, numberOfReRenders += 1, workInProgressHook = null, request = Component(props, secondArg);
    resetHooksState();
    return request;
  }
  function finishFunctionComponent(request, task, keyPath, children, hasId, actionStateCount, actionStateMatchingIndex2) {
    var didEmitActionStateMarkers = false;
    if (0 !== actionStateCount && null !== request.formState) {
      var segment = task.blockedSegment;
      if (null !== segment) {
        didEmitActionStateMarkers = true;
        segment = segment.chunks;
        for (var i = 0; i < actionStateCount; i++)
          i === actionStateMatchingIndex2 ? segment.push(formStateMarkerIsMatching) : segment.push(formStateMarkerIsNotMatching);
      }
    }
    actionStateCount = task.keyPath;
    task.keyPath = keyPath;
    hasId ? (keyPath = task.treeContext, task.treeContext = pushTreeContext(keyPath, 1, 0), renderNode2(request, task, children, -1), task.treeContext = keyPath) : didEmitActionStateMarkers ? renderNode2(request, task, children, -1) : renderNodeDestructive(request, task, children, -1);
    task.keyPath = actionStateCount;
  }
  function renderElement2(request, task, keyPath, type, props, ref) {
    if ("function" === typeof type)
      if (type.prototype && type.prototype.isReactComponent) {
        var newProps = props;
        if ("ref" in props) {
          newProps = {};
          for (var propName in props)
            "ref" !== propName && (newProps[propName] = props[propName]);
        }
        var defaultProps = type.defaultProps;
        if (defaultProps) {
          newProps === props && (newProps = assign({}, newProps, props));
          for (var propName$44 in defaultProps)
            void 0 === newProps[propName$44] && (newProps[propName$44] = defaultProps[propName$44]);
        }
        props = newProps;
        newProps = emptyContextObject;
        defaultProps = type.contextType;
        "object" === typeof defaultProps && null !== defaultProps && (newProps = defaultProps._currentValue);
        newProps = new type(props, newProps);
        var initialState = void 0 !== newProps.state ? newProps.state : null;
        newProps.updater = classComponentUpdater;
        newProps.props = props;
        newProps.state = initialState;
        defaultProps = { queue: [], replace: false };
        newProps._reactInternals = defaultProps;
        ref = type.contextType;
        newProps.context = "object" === typeof ref && null !== ref ? ref._currentValue : emptyContextObject;
        ref = type.getDerivedStateFromProps;
        "function" === typeof ref && (ref = ref(props, initialState), initialState = null === ref || void 0 === ref ? initialState : assign({}, initialState, ref), newProps.state = initialState);
        if ("function" !== typeof type.getDerivedStateFromProps && "function" !== typeof newProps.getSnapshotBeforeUpdate && ("function" === typeof newProps.UNSAFE_componentWillMount || "function" === typeof newProps.componentWillMount))
          if (type = newProps.state, "function" === typeof newProps.componentWillMount && newProps.componentWillMount(), "function" === typeof newProps.UNSAFE_componentWillMount && newProps.UNSAFE_componentWillMount(), type !== newProps.state && classComponentUpdater.enqueueReplaceState(
            newProps,
            newProps.state,
            null
          ), null !== defaultProps.queue && 0 < defaultProps.queue.length)
            if (type = defaultProps.queue, ref = defaultProps.replace, defaultProps.queue = null, defaultProps.replace = false, ref && 1 === type.length)
              newProps.state = type[0];
            else {
              defaultProps = ref ? type[0] : newProps.state;
              initialState = true;
              for (ref = ref ? 1 : 0; ref < type.length; ref++)
                propName$44 = type[ref], propName$44 = "function" === typeof propName$44 ? propName$44.call(newProps, defaultProps, props, void 0) : propName$44, null != propName$44 && (initialState ? (initialState = false, defaultProps = assign({}, defaultProps, propName$44)) : assign(defaultProps, propName$44));
              newProps.state = defaultProps;
            }
          else defaultProps.queue = null;
        type = newProps.render();
        if (12 === request.status) throw null;
        props = task.keyPath;
        task.keyPath = keyPath;
        renderNodeDestructive(request, task, type, -1);
        task.keyPath = props;
      } else {
        type = renderWithHooks(request, task, keyPath, type, props, void 0);
        if (12 === request.status) throw null;
        finishFunctionComponent(
          request,
          task,
          keyPath,
          type,
          0 !== localIdCounter,
          actionStateCounter,
          actionStateMatchingIndex
        );
      }
    else if ("string" === typeof type)
      if (newProps = task.blockedSegment, null === newProps)
        newProps = props.children, defaultProps = task.formatContext, initialState = task.keyPath, task.formatContext = getChildFormatContext(defaultProps, type, props), task.keyPath = keyPath, renderNode2(request, task, newProps, -1), task.formatContext = defaultProps, task.keyPath = initialState;
      else {
        initialState = pushStartInstance(
          newProps.chunks,
          type,
          props,
          request.resumableState,
          request.renderState,
          task.blockedPreamble,
          task.hoistableState,
          task.formatContext,
          newProps.lastPushedText
        );
        newProps.lastPushedText = false;
        defaultProps = task.formatContext;
        ref = task.keyPath;
        task.keyPath = keyPath;
        if (3 === (task.formatContext = getChildFormatContext(defaultProps, type, props)).insertionMode) {
          keyPath = createPendingSegment(
            request,
            0,
            null,
            task.formatContext,
            false,
            false
          );
          newProps.preambleChildren.push(keyPath);
          task.blockedSegment = keyPath;
          try {
            keyPath.status = 6, renderNode2(request, task, initialState, -1), keyPath.lastPushedText && keyPath.textEmbedded && keyPath.chunks.push(textSeparator), keyPath.status = 1, finishedSegment(request, task.blockedBoundary, keyPath);
          } finally {
            task.blockedSegment = newProps;
          }
        } else renderNode2(request, task, initialState, -1);
        task.formatContext = defaultProps;
        task.keyPath = ref;
        a: {
          task = newProps.chunks;
          request = request.resumableState;
          switch (type) {
            case "title":
            case "style":
            case "script":
            case "area":
            case "base":
            case "br":
            case "col":
            case "embed":
            case "hr":
            case "img":
            case "input":
            case "keygen":
            case "link":
            case "meta":
            case "param":
            case "source":
            case "track":
            case "wbr":
              break a;
            case "body":
              if (1 >= defaultProps.insertionMode) {
                request.hasBody = true;
                break a;
              }
              break;
            case "html":
              if (0 === defaultProps.insertionMode) {
                request.hasHtml = true;
                break a;
              }
              break;
            case "head":
              if (1 >= defaultProps.insertionMode) break a;
          }
          task.push(endChunkForTag(type));
        }
        newProps.lastPushedText = false;
      }
    else {
      switch (type) {
        case REACT_LEGACY_HIDDEN_TYPE:
        case REACT_STRICT_MODE_TYPE:
        case REACT_PROFILER_TYPE:
        case REACT_FRAGMENT_TYPE:
          type = task.keyPath;
          task.keyPath = keyPath;
          renderNodeDestructive(request, task, props.children, -1);
          task.keyPath = type;
          return;
        case REACT_ACTIVITY_TYPE:
          type = task.blockedSegment;
          null === type ? "hidden" !== props.mode && (type = task.keyPath, task.keyPath = keyPath, renderNode2(request, task, props.children, -1), task.keyPath = type) : "hidden" !== props.mode && (type.chunks.push(startActivityBoundary), type.lastPushedText = false, newProps = task.keyPath, task.keyPath = keyPath, renderNode2(request, task, props.children, -1), task.keyPath = newProps, type.chunks.push(endActivityBoundary), type.lastPushedText = false);
          return;
        case REACT_SUSPENSE_LIST_TYPE:
          a: {
            type = props.children;
            props = props.revealOrder;
            if ("forwards" === props || "backwards" === props || "unstable_legacy-backwards" === props) {
              if (isArrayImpl(type)) {
                renderSuspenseListRows(request, task, keyPath, type, props);
                break a;
              }
              if (newProps = getIteratorFn(type)) {
                if (newProps = newProps.call(type)) {
                  defaultProps = newProps.next();
                  if (!defaultProps.done) {
                    do
                      defaultProps = newProps.next();
                    while (!defaultProps.done);
                    renderSuspenseListRows(request, task, keyPath, type, props);
                  }
                  break a;
                }
              }
            }
            "together" === props ? (props = task.keyPath, newProps = task.row, defaultProps = task.row = createSuspenseListRow(null), defaultProps.boundaries = [], defaultProps.together = true, task.keyPath = keyPath, renderNodeDestructive(request, task, type, -1), 0 === --defaultProps.pendingTasks && finishSuspenseListRow(request, defaultProps), task.keyPath = props, task.row = newProps, null !== newProps && 0 < defaultProps.pendingTasks && (newProps.pendingTasks++, defaultProps.next = newProps)) : (props = task.keyPath, task.keyPath = keyPath, renderNodeDestructive(request, task, type, -1), task.keyPath = props);
          }
          return;
        case REACT_VIEW_TRANSITION_TYPE:
        case REACT_SCOPE_TYPE:
          throw Error("ReactDOMServer does not yet support scope components.");
        case REACT_SUSPENSE_TYPE:
          a: if (null !== task.replay) {
            type = task.keyPath;
            newProps = task.formatContext;
            defaultProps = task.row;
            task.keyPath = keyPath;
            task.formatContext = getSuspenseContentFormatContext(
              request.resumableState,
              newProps
            );
            task.row = null;
            keyPath = props.children;
            try {
              renderNode2(request, task, keyPath, -1);
            } finally {
              task.keyPath = type, task.formatContext = newProps, task.row = defaultProps;
            }
          } else {
            type = task.keyPath;
            ref = task.formatContext;
            var prevRow = task.row;
            propName$44 = task.blockedBoundary;
            propName = task.blockedPreamble;
            var parentHoistableState = task.hoistableState, parentSegment = task.blockedSegment, fallback = props.fallback;
            props = props.children;
            var fallbackAbortSet = /* @__PURE__ */ new Set();
            var newBoundary = 2 > task.formatContext.insertionMode ? createSuspenseBoundary(
              request,
              task.row,
              fallbackAbortSet,
              createPreambleState(),
              createPreambleState()
            ) : createSuspenseBoundary(
              request,
              task.row,
              fallbackAbortSet,
              null,
              null
            );
            null !== request.trackedPostpones && (newBoundary.trackedContentKeyPath = keyPath);
            var boundarySegment = createPendingSegment(
              request,
              parentSegment.chunks.length,
              newBoundary,
              task.formatContext,
              false,
              false
            );
            parentSegment.children.push(boundarySegment);
            parentSegment.lastPushedText = false;
            var contentRootSegment = createPendingSegment(
              request,
              0,
              null,
              task.formatContext,
              false,
              false
            );
            contentRootSegment.parentFlushed = true;
            if (null !== request.trackedPostpones) {
              newProps = task.componentStack;
              defaultProps = [keyPath[0], "Suspense Fallback", keyPath[2]];
              initialState = [defaultProps[1], defaultProps[2], [], null];
              request.trackedPostpones.workingMap.set(defaultProps, initialState);
              newBoundary.trackedFallbackNode = initialState;
              task.blockedSegment = boundarySegment;
              task.blockedPreamble = newBoundary.fallbackPreamble;
              task.keyPath = defaultProps;
              task.formatContext = getSuspenseFallbackFormatContext(
                request.resumableState,
                ref
              );
              task.componentStack = replaceSuspenseComponentStackWithSuspenseFallbackStack(newProps);
              boundarySegment.status = 6;
              try {
                renderNode2(request, task, fallback, -1), boundarySegment.lastPushedText && boundarySegment.textEmbedded && boundarySegment.chunks.push(textSeparator), boundarySegment.status = 1, finishedSegment(request, propName$44, boundarySegment);
              } catch (thrownValue) {
                throw boundarySegment.status = 12 === request.status ? 3 : 4, thrownValue;
              } finally {
                task.blockedSegment = parentSegment, task.blockedPreamble = propName, task.keyPath = type, task.formatContext = ref;
              }
              task = createRenderTask(
                request,
                null,
                props,
                -1,
                newBoundary,
                contentRootSegment,
                newBoundary.contentPreamble,
                newBoundary.contentState,
                task.abortSet,
                keyPath,
                getSuspenseContentFormatContext(
                  request.resumableState,
                  task.formatContext
                ),
                task.context,
                task.treeContext,
                null,
                newProps
              );
              pushComponentStack(task);
              request.pingedTasks.push(task);
            } else {
              task.blockedBoundary = newBoundary;
              task.blockedPreamble = newBoundary.contentPreamble;
              task.hoistableState = newBoundary.contentState;
              task.blockedSegment = contentRootSegment;
              task.keyPath = keyPath;
              task.formatContext = getSuspenseContentFormatContext(
                request.resumableState,
                ref
              );
              task.row = null;
              contentRootSegment.status = 6;
              try {
                if (renderNode2(request, task, props, -1), contentRootSegment.lastPushedText && contentRootSegment.textEmbedded && contentRootSegment.chunks.push(textSeparator), contentRootSegment.status = 1, finishedSegment(request, newBoundary, contentRootSegment), queueCompletedSegment(newBoundary, contentRootSegment), 0 === newBoundary.pendingTasks && 0 === newBoundary.status) {
                  if (newBoundary.status = 1, !isEligibleForOutlining(request, newBoundary)) {
                    null !== prevRow && 0 === --prevRow.pendingTasks && finishSuspenseListRow(request, prevRow);
                    0 === request.pendingRootTasks && task.blockedPreamble && preparePreamble(request);
                    break a;
                  }
                } else
                  null !== prevRow && prevRow.together && tryToResolveTogetherRow(request, prevRow);
              } catch (thrownValue$31) {
                newBoundary.status = 4, 12 === request.status ? (contentRootSegment.status = 3, newProps = request.fatalError) : (contentRootSegment.status = 4, newProps = thrownValue$31), defaultProps = getThrownInfo(task.componentStack), initialState = logRecoverableError(
                  request,
                  newProps,
                  defaultProps
                ), newBoundary.errorDigest = initialState, untrackBoundary(request, newBoundary);
              } finally {
                task.blockedBoundary = propName$44, task.blockedPreamble = propName, task.hoistableState = parentHoistableState, task.blockedSegment = parentSegment, task.keyPath = type, task.formatContext = ref, task.row = prevRow;
              }
              task = createRenderTask(
                request,
                null,
                fallback,
                -1,
                propName$44,
                boundarySegment,
                newBoundary.fallbackPreamble,
                newBoundary.fallbackState,
                fallbackAbortSet,
                [keyPath[0], "Suspense Fallback", keyPath[2]],
                getSuspenseFallbackFormatContext(
                  request.resumableState,
                  task.formatContext
                ),
                task.context,
                task.treeContext,
                task.row,
                replaceSuspenseComponentStackWithSuspenseFallbackStack(
                  task.componentStack
                )
              );
              pushComponentStack(task);
              request.pingedTasks.push(task);
            }
          }
          return;
      }
      if ("object" === typeof type && null !== type)
        switch (type.$$typeof) {
          case REACT_FORWARD_REF_TYPE:
            if ("ref" in props)
              for (parentSegment in newProps = {}, props)
                "ref" !== parentSegment && (newProps[parentSegment] = props[parentSegment]);
            else newProps = props;
            type = renderWithHooks(
              request,
              task,
              keyPath,
              type.render,
              newProps,
              ref
            );
            finishFunctionComponent(
              request,
              task,
              keyPath,
              type,
              0 !== localIdCounter,
              actionStateCounter,
              actionStateMatchingIndex
            );
            return;
          case REACT_MEMO_TYPE:
            renderElement2(request, task, keyPath, type.type, props, ref);
            return;
          case REACT_CONTEXT_TYPE:
            defaultProps = props.children;
            newProps = task.keyPath;
            props = props.value;
            initialState = type._currentValue;
            type._currentValue = props;
            ref = currentActiveSnapshot;
            currentActiveSnapshot = type = {
              parent: ref,
              depth: null === ref ? 0 : ref.depth + 1,
              context: type,
              parentValue: initialState,
              value: props
            };
            task.context = type;
            task.keyPath = keyPath;
            renderNodeDestructive(request, task, defaultProps, -1);
            request = currentActiveSnapshot;
            if (null === request)
              throw Error(
                "Tried to pop a Context at the root of the app. This is a bug in React."
              );
            request.context._currentValue = request.parentValue;
            request = currentActiveSnapshot = request.parent;
            task.context = request;
            task.keyPath = newProps;
            return;
          case REACT_CONSUMER_TYPE:
            props = props.children;
            type = props(type._context._currentValue);
            props = task.keyPath;
            task.keyPath = keyPath;
            renderNodeDestructive(request, task, type, -1);
            task.keyPath = props;
            return;
          case REACT_LAZY_TYPE:
            newProps = type._init;
            type = newProps(type._payload);
            if (12 === request.status) throw null;
            renderElement2(request, task, keyPath, type, props, ref);
            return;
        }
      throw Error(
        "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: " + ((null == type ? type : typeof type) + ".")
      );
    }
  }
  function resumeNode(request, task, segmentId, node, childIndex) {
    var prevReplay = task.replay, blockedBoundary = task.blockedBoundary, resumedSegment = createPendingSegment(
      request,
      0,
      null,
      task.formatContext,
      false,
      false
    );
    resumedSegment.id = segmentId;
    resumedSegment.parentFlushed = true;
    try {
      task.replay = null, task.blockedSegment = resumedSegment, renderNode2(request, task, node, childIndex), resumedSegment.status = 1, finishedSegment(request, blockedBoundary, resumedSegment), null === blockedBoundary ? request.completedRootSegment = resumedSegment : (queueCompletedSegment(blockedBoundary, resumedSegment), blockedBoundary.parentFlushed && request.partialBoundaries.push(blockedBoundary));
    } finally {
      task.replay = prevReplay, task.blockedSegment = null;
    }
  }
  function renderNodeDestructive(request, task, node, childIndex) {
    null !== task.replay && "number" === typeof task.replay.slots ? resumeNode(request, task, task.replay.slots, node, childIndex) : (task.node = node, task.childIndex = childIndex, node = task.componentStack, pushComponentStack(task), retryNode(request, task), task.componentStack = node);
  }
  function retryNode(request, task) {
    var node = task.node, childIndex = task.childIndex;
    if (null !== node) {
      if ("object" === typeof node) {
        switch (node.$$typeof) {
          case REACT_ELEMENT_TYPE:
            var type = node.type, key = node.key, props = node.props;
            node = props.ref;
            var ref = void 0 !== node ? node : null, name = getComponentNameFromType(type), keyOrIndex = null == key ? -1 === childIndex ? 0 : childIndex : key;
            key = [task.keyPath, name, keyOrIndex];
            if (null !== task.replay)
              a: {
                var replay = task.replay;
                childIndex = replay.nodes;
                for (node = 0; node < childIndex.length; node++) {
                  var node$jscomp$0 = childIndex[node];
                  if (keyOrIndex === node$jscomp$0[1]) {
                    if (4 === node$jscomp$0.length) {
                      if (null !== name && name !== node$jscomp$0[0])
                        throw Error(
                          "Expected the resume to render <" + node$jscomp$0[0] + "> in this slot but instead it rendered <" + name + ">. The tree doesn't match so React will fallback to client rendering."
                        );
                      var childNodes = node$jscomp$0[2];
                      name = node$jscomp$0[3];
                      keyOrIndex = task.node;
                      task.replay = {
                        nodes: childNodes,
                        slots: name,
                        pendingTasks: 1
                      };
                      try {
                        renderElement2(request, task, key, type, props, ref);
                        if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
                          throw Error(
                            "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
                          );
                        task.replay.pendingTasks--;
                      } catch (x) {
                        if ("object" === typeof x && null !== x && (x === SuspenseException || "function" === typeof x.then))
                          throw task.node === keyOrIndex ? task.replay = replay : childIndex.splice(node, 1), x;
                        task.replay.pendingTasks--;
                        props = getThrownInfo(task.componentStack);
                        key = request;
                        request = task.blockedBoundary;
                        type = x;
                        props = logRecoverableError(key, type, props);
                        abortRemainingReplayNodes(
                          key,
                          request,
                          childNodes,
                          name,
                          type,
                          props
                        );
                      }
                      task.replay = replay;
                    } else {
                      if (type !== REACT_SUSPENSE_TYPE)
                        throw Error(
                          "Expected the resume to render <Suspense> in this slot but instead it rendered <" + (getComponentNameFromType(type) || "Unknown") + ">. The tree doesn't match so React will fallback to client rendering."
                        );
                      b: {
                        replay = void 0;
                        type = node$jscomp$0[5];
                        ref = node$jscomp$0[2];
                        name = node$jscomp$0[3];
                        keyOrIndex = null === node$jscomp$0[4] ? [] : node$jscomp$0[4][2];
                        node$jscomp$0 = null === node$jscomp$0[4] ? null : node$jscomp$0[4][3];
                        var prevKeyPath = task.keyPath, prevContext = task.formatContext, prevRow = task.row, previousReplaySet = task.replay, parentBoundary = task.blockedBoundary, parentHoistableState = task.hoistableState, content = props.children, fallback = props.fallback, fallbackAbortSet = /* @__PURE__ */ new Set();
                        props = 2 > task.formatContext.insertionMode ? createSuspenseBoundary(
                          request,
                          task.row,
                          fallbackAbortSet,
                          createPreambleState(),
                          createPreambleState()
                        ) : createSuspenseBoundary(
                          request,
                          task.row,
                          fallbackAbortSet,
                          null,
                          null
                        );
                        props.parentFlushed = true;
                        props.rootSegmentID = type;
                        task.blockedBoundary = props;
                        task.hoistableState = props.contentState;
                        task.keyPath = key;
                        task.formatContext = getSuspenseContentFormatContext(
                          request.resumableState,
                          prevContext
                        );
                        task.row = null;
                        task.replay = {
                          nodes: ref,
                          slots: name,
                          pendingTasks: 1
                        };
                        try {
                          renderNode2(request, task, content, -1);
                          if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
                            throw Error(
                              "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
                            );
                          task.replay.pendingTasks--;
                          if (0 === props.pendingTasks && 0 === props.status) {
                            props.status = 1;
                            request.completedBoundaries.push(props);
                            break b;
                          }
                        } catch (error2) {
                          props.status = 4, childNodes = getThrownInfo(task.componentStack), replay = logRecoverableError(
                            request,
                            error2,
                            childNodes
                          ), props.errorDigest = replay, task.replay.pendingTasks--, request.clientRenderedBoundaries.push(props);
                        } finally {
                          task.blockedBoundary = parentBoundary, task.hoistableState = parentHoistableState, task.replay = previousReplaySet, task.keyPath = prevKeyPath, task.formatContext = prevContext, task.row = prevRow;
                        }
                        childNodes = createReplayTask(
                          request,
                          null,
                          {
                            nodes: keyOrIndex,
                            slots: node$jscomp$0,
                            pendingTasks: 0
                          },
                          fallback,
                          -1,
                          parentBoundary,
                          props.fallbackState,
                          fallbackAbortSet,
                          [key[0], "Suspense Fallback", key[2]],
                          getSuspenseFallbackFormatContext(
                            request.resumableState,
                            task.formatContext
                          ),
                          task.context,
                          task.treeContext,
                          task.row,
                          replaceSuspenseComponentStackWithSuspenseFallbackStack(
                            task.componentStack
                          )
                        );
                        pushComponentStack(childNodes);
                        request.pingedTasks.push(childNodes);
                      }
                    }
                    childIndex.splice(node, 1);
                    break a;
                  }
                }
              }
            else renderElement2(request, task, key, type, props, ref);
            return;
          case REACT_PORTAL_TYPE:
            throw Error(
              "Portals are not currently supported by the server renderer. Render them conditionally so that they only appear on the client render."
            );
          case REACT_LAZY_TYPE:
            childNodes = node._init;
            node = childNodes(node._payload);
            if (12 === request.status) throw null;
            renderNodeDestructive(request, task, node, childIndex);
            return;
        }
        if (isArrayImpl(node)) {
          renderChildrenArray(request, task, node, childIndex);
          return;
        }
        if (childNodes = getIteratorFn(node)) {
          if (childNodes = childNodes.call(node)) {
            node = childNodes.next();
            if (!node.done) {
              props = [];
              do
                props.push(node.value), node = childNodes.next();
              while (!node.done);
              renderChildrenArray(request, task, props, childIndex);
            }
            return;
          }
        }
        if ("function" === typeof node.then)
          return task.thenableState = null, renderNodeDestructive(request, task, unwrapThenable(node), childIndex);
        if (node.$$typeof === REACT_CONTEXT_TYPE)
          return renderNodeDestructive(
            request,
            task,
            node._currentValue,
            childIndex
          );
        childIndex = Object.prototype.toString.call(node);
        throw Error(
          "Objects are not valid as a React child (found: " + ("[object Object]" === childIndex ? "object with keys {" + Object.keys(node).join(", ") + "}" : childIndex) + "). If you meant to render a collection of children, use an array instead."
        );
      }
      if ("string" === typeof node)
        childIndex = task.blockedSegment, null !== childIndex && (childIndex.lastPushedText = pushTextInstance(
          childIndex.chunks,
          node,
          request.renderState,
          childIndex.lastPushedText
        ));
      else if ("number" === typeof node || "bigint" === typeof node)
        childIndex = task.blockedSegment, null !== childIndex && (childIndex.lastPushedText = pushTextInstance(
          childIndex.chunks,
          "" + node,
          request.renderState,
          childIndex.lastPushedText
        ));
    }
  }
  function renderChildrenArray(request, task, children, childIndex) {
    var prevKeyPath = task.keyPath;
    if (-1 !== childIndex && (task.keyPath = [task.keyPath, "Fragment", childIndex], null !== task.replay)) {
      for (var replay = task.replay, replayNodes = replay.nodes, j = 0; j < replayNodes.length; j++) {
        var node = replayNodes[j];
        if (node[1] === childIndex) {
          childIndex = node[2];
          node = node[3];
          task.replay = { nodes: childIndex, slots: node, pendingTasks: 1 };
          try {
            renderChildrenArray(request, task, children, -1);
            if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
              throw Error(
                "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
              );
            task.replay.pendingTasks--;
          } catch (x) {
            if ("object" === typeof x && null !== x && (x === SuspenseException || "function" === typeof x.then))
              throw x;
            task.replay.pendingTasks--;
            children = getThrownInfo(task.componentStack);
            var boundary = task.blockedBoundary, error2 = x;
            children = logRecoverableError(request, error2, children);
            abortRemainingReplayNodes(
              request,
              boundary,
              childIndex,
              node,
              error2,
              children
            );
          }
          task.replay = replay;
          replayNodes.splice(j, 1);
          break;
        }
      }
      task.keyPath = prevKeyPath;
      return;
    }
    replay = task.treeContext;
    replayNodes = children.length;
    if (null !== task.replay && (j = task.replay.slots, null !== j && "object" === typeof j)) {
      for (childIndex = 0; childIndex < replayNodes; childIndex++)
        node = children[childIndex], task.treeContext = pushTreeContext(replay, replayNodes, childIndex), boundary = j[childIndex], "number" === typeof boundary ? (resumeNode(request, task, boundary, node, childIndex), delete j[childIndex]) : renderNode2(request, task, node, childIndex);
      task.treeContext = replay;
      task.keyPath = prevKeyPath;
      return;
    }
    for (j = 0; j < replayNodes; j++)
      childIndex = children[j], task.treeContext = pushTreeContext(replay, replayNodes, j), renderNode2(request, task, childIndex, j);
    task.treeContext = replay;
    task.keyPath = prevKeyPath;
  }
  function trackPostponedBoundary(request, trackedPostpones, boundary) {
    boundary.status = 5;
    boundary.rootSegmentID = request.nextSegmentId++;
    request = boundary.trackedContentKeyPath;
    if (null === request)
      throw Error(
        "It should not be possible to postpone at the root. This is a bug in React."
      );
    var fallbackReplayNode = boundary.trackedFallbackNode, children = [], boundaryNode = trackedPostpones.workingMap.get(request);
    if (void 0 === boundaryNode)
      return boundary = [
        request[1],
        request[2],
        children,
        null,
        fallbackReplayNode,
        boundary.rootSegmentID
      ], trackedPostpones.workingMap.set(request, boundary), addToReplayParent(boundary, request[0], trackedPostpones), boundary;
    boundaryNode[4] = fallbackReplayNode;
    boundaryNode[5] = boundary.rootSegmentID;
    return boundaryNode;
  }
  function trackPostpone(request, trackedPostpones, task, segment) {
    segment.status = 5;
    var keyPath = task.keyPath, boundary = task.blockedBoundary;
    if (null === boundary)
      segment.id = request.nextSegmentId++, trackedPostpones.rootSlots = segment.id, null !== request.completedRootSegment && (request.completedRootSegment.status = 5);
    else {
      if (null !== boundary && 0 === boundary.status) {
        var boundaryNode = trackPostponedBoundary(
          request,
          trackedPostpones,
          boundary
        );
        if (boundary.trackedContentKeyPath === keyPath && -1 === task.childIndex) {
          -1 === segment.id && (segment.id = segment.parentFlushed ? boundary.rootSegmentID : request.nextSegmentId++);
          boundaryNode[3] = segment.id;
          return;
        }
      }
      -1 === segment.id && (segment.id = segment.parentFlushed && null !== boundary ? boundary.rootSegmentID : request.nextSegmentId++);
      if (-1 === task.childIndex)
        null === keyPath ? trackedPostpones.rootSlots = segment.id : (task = trackedPostpones.workingMap.get(keyPath), void 0 === task ? (task = [keyPath[1], keyPath[2], [], segment.id], addToReplayParent(task, keyPath[0], trackedPostpones)) : task[3] = segment.id);
      else {
        if (null === keyPath)
          if (request = trackedPostpones.rootSlots, null === request)
            request = trackedPostpones.rootSlots = {};
          else {
            if ("number" === typeof request)
              throw Error(
                "It should not be possible to postpone both at the root of an element as well as a slot below. This is a bug in React."
              );
          }
        else if (boundary = trackedPostpones.workingMap, boundaryNode = boundary.get(keyPath), void 0 === boundaryNode)
          request = {}, boundaryNode = [keyPath[1], keyPath[2], [], request], boundary.set(keyPath, boundaryNode), addToReplayParent(boundaryNode, keyPath[0], trackedPostpones);
        else if (request = boundaryNode[3], null === request)
          request = boundaryNode[3] = {};
        else if ("number" === typeof request)
          throw Error(
            "It should not be possible to postpone both at the root of an element as well as a slot below. This is a bug in React."
          );
        request[task.childIndex] = segment.id;
      }
    }
  }
  function untrackBoundary(request, boundary) {
    request = request.trackedPostpones;
    null !== request && (boundary = boundary.trackedContentKeyPath, null !== boundary && (boundary = request.workingMap.get(boundary), void 0 !== boundary && (boundary.length = 4, boundary[2] = [], boundary[3] = null)));
  }
  function spawnNewSuspendedReplayTask(request, task, thenableState2) {
    return createReplayTask(
      request,
      thenableState2,
      task.replay,
      task.node,
      task.childIndex,
      task.blockedBoundary,
      task.hoistableState,
      task.abortSet,
      task.keyPath,
      task.formatContext,
      task.context,
      task.treeContext,
      task.row,
      task.componentStack
    );
  }
  function spawnNewSuspendedRenderTask(request, task, thenableState2) {
    var segment = task.blockedSegment, newSegment = createPendingSegment(
      request,
      segment.chunks.length,
      null,
      task.formatContext,
      segment.lastPushedText,
      true
    );
    segment.children.push(newSegment);
    segment.lastPushedText = false;
    return createRenderTask(
      request,
      thenableState2,
      task.node,
      task.childIndex,
      task.blockedBoundary,
      newSegment,
      task.blockedPreamble,
      task.hoistableState,
      task.abortSet,
      task.keyPath,
      task.formatContext,
      task.context,
      task.treeContext,
      task.row,
      task.componentStack
    );
  }
  function renderNode2(request, task, node, childIndex) {
    var previousFormatContext = task.formatContext, previousContext = task.context, previousKeyPath = task.keyPath, previousTreeContext = task.treeContext, previousComponentStack = task.componentStack, segment = task.blockedSegment;
    if (null === segment) {
      segment = task.replay;
      try {
        return renderNodeDestructive(request, task, node, childIndex);
      } catch (thrownValue) {
        if (resetHooksState(), node = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue, 12 !== request.status && "object" === typeof node && null !== node) {
          if ("function" === typeof node.then) {
            childIndex = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
            request = spawnNewSuspendedReplayTask(request, task, childIndex).ping;
            node.then(request, request);
            task.formatContext = previousFormatContext;
            task.context = previousContext;
            task.keyPath = previousKeyPath;
            task.treeContext = previousTreeContext;
            task.componentStack = previousComponentStack;
            task.replay = segment;
            switchContext(previousContext);
            return;
          }
          if ("Maximum call stack size exceeded" === node.message) {
            node = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
            node = spawnNewSuspendedReplayTask(request, task, node);
            request.pingedTasks.push(node);
            task.formatContext = previousFormatContext;
            task.context = previousContext;
            task.keyPath = previousKeyPath;
            task.treeContext = previousTreeContext;
            task.componentStack = previousComponentStack;
            task.replay = segment;
            switchContext(previousContext);
            return;
          }
        }
      }
    } else {
      var childrenLength = segment.children.length, chunkLength = segment.chunks.length;
      try {
        return renderNodeDestructive(request, task, node, childIndex);
      } catch (thrownValue$63) {
        if (resetHooksState(), segment.children.length = childrenLength, segment.chunks.length = chunkLength, node = thrownValue$63 === SuspenseException ? getSuspendedThenable() : thrownValue$63, 12 !== request.status && "object" === typeof node && null !== node) {
          if ("function" === typeof node.then) {
            segment = node;
            node = thrownValue$63 === SuspenseException ? getThenableStateAfterSuspending() : null;
            request = spawnNewSuspendedRenderTask(request, task, node).ping;
            segment.then(request, request);
            task.formatContext = previousFormatContext;
            task.context = previousContext;
            task.keyPath = previousKeyPath;
            task.treeContext = previousTreeContext;
            task.componentStack = previousComponentStack;
            switchContext(previousContext);
            return;
          }
          if ("Maximum call stack size exceeded" === node.message) {
            segment = thrownValue$63 === SuspenseException ? getThenableStateAfterSuspending() : null;
            segment = spawnNewSuspendedRenderTask(request, task, segment);
            request.pingedTasks.push(segment);
            task.formatContext = previousFormatContext;
            task.context = previousContext;
            task.keyPath = previousKeyPath;
            task.treeContext = previousTreeContext;
            task.componentStack = previousComponentStack;
            switchContext(previousContext);
            return;
          }
        }
      }
    }
    task.formatContext = previousFormatContext;
    task.context = previousContext;
    task.keyPath = previousKeyPath;
    task.treeContext = previousTreeContext;
    switchContext(previousContext);
    throw node;
  }
  function abortTaskSoft(task) {
    var boundary = task.blockedBoundary, segment = task.blockedSegment;
    null !== segment && (segment.status = 3, finishedTask(this, boundary, task.row, segment));
  }
  function abortRemainingReplayNodes(request$jscomp$0, boundary, nodes, slots, error2, errorDigest$jscomp$0) {
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (4 === node.length)
        abortRemainingReplayNodes(
          request$jscomp$0,
          boundary,
          node[2],
          node[3],
          error2,
          errorDigest$jscomp$0
        );
      else {
        node = node[5];
        var request = request$jscomp$0, errorDigest = errorDigest$jscomp$0, resumedBoundary = createSuspenseBoundary(
          request,
          null,
          /* @__PURE__ */ new Set(),
          null,
          null
        );
        resumedBoundary.parentFlushed = true;
        resumedBoundary.rootSegmentID = node;
        resumedBoundary.status = 4;
        resumedBoundary.errorDigest = errorDigest;
        resumedBoundary.parentFlushed && request.clientRenderedBoundaries.push(resumedBoundary);
      }
    }
    nodes.length = 0;
    if (null !== slots) {
      if (null === boundary)
        throw Error(
          "We should not have any resumable nodes in the shell. This is a bug in React."
        );
      4 !== boundary.status && (boundary.status = 4, boundary.errorDigest = errorDigest$jscomp$0, boundary.parentFlushed && request$jscomp$0.clientRenderedBoundaries.push(boundary));
      if ("object" === typeof slots) for (var index in slots) delete slots[index];
    }
  }
  function abortTask(task, request, error2) {
    var boundary = task.blockedBoundary, segment = task.blockedSegment;
    if (null !== segment) {
      if (6 === segment.status) return;
      segment.status = 3;
    }
    var errorInfo = getThrownInfo(task.componentStack);
    if (null === boundary) {
      if (13 !== request.status && 14 !== request.status) {
        boundary = task.replay;
        if (null === boundary) {
          null !== request.trackedPostpones && null !== segment ? (boundary = request.trackedPostpones, logRecoverableError(request, error2, errorInfo), trackPostpone(request, boundary, task, segment), finishedTask(request, null, task.row, segment)) : (logRecoverableError(request, error2, errorInfo), fatalError(request, error2));
          return;
        }
        boundary.pendingTasks--;
        0 === boundary.pendingTasks && 0 < boundary.nodes.length && (segment = logRecoverableError(request, error2, errorInfo), abortRemainingReplayNodes(
          request,
          null,
          boundary.nodes,
          boundary.slots,
          error2,
          segment
        ));
        request.pendingRootTasks--;
        0 === request.pendingRootTasks && completeShell(request);
      }
    } else {
      var trackedPostpones$64 = request.trackedPostpones;
      if (4 !== boundary.status) {
        if (null !== trackedPostpones$64 && null !== segment)
          return logRecoverableError(request, error2, errorInfo), trackPostpone(request, trackedPostpones$64, task, segment), boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
            return abortTask(fallbackTask, request, error2);
          }), boundary.fallbackAbortableTasks.clear(), finishedTask(request, boundary, task.row, segment);
        boundary.status = 4;
        segment = logRecoverableError(request, error2, errorInfo);
        boundary.status = 4;
        boundary.errorDigest = segment;
        untrackBoundary(request, boundary);
        boundary.parentFlushed && request.clientRenderedBoundaries.push(boundary);
      }
      boundary.pendingTasks--;
      segment = boundary.row;
      null !== segment && 0 === --segment.pendingTasks && finishSuspenseListRow(request, segment);
      boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
        return abortTask(fallbackTask, request, error2);
      });
      boundary.fallbackAbortableTasks.clear();
    }
    task = task.row;
    null !== task && 0 === --task.pendingTasks && finishSuspenseListRow(request, task);
    request.allPendingTasks--;
    0 === request.allPendingTasks && completeAll(request);
  }
  function safelyEmitEarlyPreloads(request, shellComplete) {
    try {
      var renderState = request.renderState, onHeaders = renderState.onHeaders;
      if (onHeaders) {
        var headers = renderState.headers;
        if (headers) {
          renderState.headers = null;
          var linkHeader = headers.preconnects;
          headers.fontPreloads && (linkHeader && (linkHeader += ", "), linkHeader += headers.fontPreloads);
          headers.highImagePreloads && (linkHeader && (linkHeader += ", "), linkHeader += headers.highImagePreloads);
          if (!shellComplete) {
            var queueIter = renderState.styles.values(), queueStep = queueIter.next();
            b: for (; 0 < headers.remainingCapacity && !queueStep.done; queueStep = queueIter.next())
              for (var sheetIter = queueStep.value.sheets.values(), sheetStep = sheetIter.next(); 0 < headers.remainingCapacity && !sheetStep.done; sheetStep = sheetIter.next()) {
                var sheet = sheetStep.value, props = sheet.props, key = props.href, props$jscomp$0 = sheet.props, header = getPreloadAsHeader(props$jscomp$0.href, "style", {
                  crossOrigin: props$jscomp$0.crossOrigin,
                  integrity: props$jscomp$0.integrity,
                  nonce: props$jscomp$0.nonce,
                  type: props$jscomp$0.type,
                  fetchPriority: props$jscomp$0.fetchPriority,
                  referrerPolicy: props$jscomp$0.referrerPolicy,
                  media: props$jscomp$0.media
                });
                if (0 <= (headers.remainingCapacity -= header.length + 2))
                  renderState.resets.style[key] = PRELOAD_NO_CREDS, linkHeader && (linkHeader += ", "), linkHeader += header, renderState.resets.style[key] = "string" === typeof props.crossOrigin || "string" === typeof props.integrity ? [props.crossOrigin, props.integrity] : PRELOAD_NO_CREDS;
                else break b;
              }
          }
          linkHeader ? onHeaders({ Link: linkHeader }) : onHeaders({});
        }
      }
    } catch (error2) {
      logRecoverableError(request, error2, {});
    }
  }
  function completeShell(request) {
    null === request.trackedPostpones && safelyEmitEarlyPreloads(request, true);
    null === request.trackedPostpones && preparePreamble(request);
    request.onShellError = noop;
    request = request.onShellReady;
    request();
  }
  function completeAll(request) {
    safelyEmitEarlyPreloads(
      request,
      null === request.trackedPostpones ? true : null === request.completedRootSegment || 5 !== request.completedRootSegment.status
    );
    preparePreamble(request);
    request = request.onAllReady;
    request();
  }
  function queueCompletedSegment(boundary, segment) {
    if (0 === segment.chunks.length && 1 === segment.children.length && null === segment.children[0].boundary && -1 === segment.children[0].id) {
      var childSegment = segment.children[0];
      childSegment.id = segment.id;
      childSegment.parentFlushed = true;
      1 !== childSegment.status && 3 !== childSegment.status && 4 !== childSegment.status || queueCompletedSegment(boundary, childSegment);
    } else boundary.completedSegments.push(segment);
  }
  function finishedSegment(request, boundary, segment) {
    if (null !== byteLengthOfChunk) {
      segment = segment.chunks;
      for (var segmentByteSize = 0, i = 0; i < segment.length; i++)
        segmentByteSize += segment[i].byteLength;
      null === boundary ? request.byteSize += segmentByteSize : boundary.byteSize += segmentByteSize;
    }
  }
  function finishedTask(request, boundary, row, segment) {
    null !== row && (0 === --row.pendingTasks ? finishSuspenseListRow(request, row) : row.together && tryToResolveTogetherRow(request, row));
    request.allPendingTasks--;
    if (null === boundary) {
      if (null !== segment && segment.parentFlushed) {
        if (null !== request.completedRootSegment)
          throw Error(
            "There can only be one root segment. This is a bug in React."
          );
        request.completedRootSegment = segment;
      }
      request.pendingRootTasks--;
      0 === request.pendingRootTasks && completeShell(request);
    } else if (boundary.pendingTasks--, 4 !== boundary.status)
      if (0 === boundary.pendingTasks)
        if (0 === boundary.status && (boundary.status = 1), null !== segment && segment.parentFlushed && (1 === segment.status || 3 === segment.status) && queueCompletedSegment(boundary, segment), boundary.parentFlushed && request.completedBoundaries.push(boundary), 1 === boundary.status)
          row = boundary.row, null !== row && hoistHoistables(row.hoistables, boundary.contentState), isEligibleForOutlining(request, boundary) || (boundary.fallbackAbortableTasks.forEach(abortTaskSoft, request), boundary.fallbackAbortableTasks.clear(), null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row)), 0 === request.pendingRootTasks && null === request.trackedPostpones && null !== boundary.contentPreamble && preparePreamble(request);
        else {
          if (5 === boundary.status && (boundary = boundary.row, null !== boundary)) {
            if (null !== request.trackedPostpones) {
              row = request.trackedPostpones;
              var postponedRow = boundary.next;
              if (null !== postponedRow && (segment = postponedRow.boundaries, null !== segment))
                for (postponedRow.boundaries = null, postponedRow = 0; postponedRow < segment.length; postponedRow++) {
                  var postponedBoundary = segment[postponedRow];
                  trackPostponedBoundary(request, row, postponedBoundary);
                  finishedTask(request, postponedBoundary, null, null);
                }
            }
            0 === --boundary.pendingTasks && finishSuspenseListRow(request, boundary);
          }
        }
      else
        null === segment || !segment.parentFlushed || 1 !== segment.status && 3 !== segment.status || (queueCompletedSegment(boundary, segment), 1 === boundary.completedSegments.length && boundary.parentFlushed && request.partialBoundaries.push(boundary)), boundary = boundary.row, null !== boundary && boundary.together && tryToResolveTogetherRow(request, boundary);
    0 === request.allPendingTasks && completeAll(request);
  }
  function performWork(request$jscomp$2) {
    if (14 !== request$jscomp$2.status && 13 !== request$jscomp$2.status) {
      var prevContext = currentActiveSnapshot, prevDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = HooksDispatcher;
      var prevAsyncDispatcher = ReactSharedInternals.A;
      ReactSharedInternals.A = DefaultAsyncDispatcher;
      var prevRequest = currentRequest;
      currentRequest = request$jscomp$2;
      var prevResumableState = currentResumableState;
      currentResumableState = request$jscomp$2.resumableState;
      try {
        var pingedTasks = request$jscomp$2.pingedTasks, i;
        for (i = 0; i < pingedTasks.length; i++) {
          var task = pingedTasks[i], request = request$jscomp$2, segment = task.blockedSegment;
          if (null === segment) {
            var request$jscomp$0 = request;
            if (0 !== task.replay.pendingTasks) {
              switchContext(task.context);
              try {
                "number" === typeof task.replay.slots ? resumeNode(
                  request$jscomp$0,
                  task,
                  task.replay.slots,
                  task.node,
                  task.childIndex
                ) : retryNode(request$jscomp$0, task);
                if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
                  throw Error(
                    "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
                  );
                task.replay.pendingTasks--;
                task.abortSet.delete(task);
                finishedTask(
                  request$jscomp$0,
                  task.blockedBoundary,
                  task.row,
                  null
                );
              } catch (thrownValue) {
                resetHooksState();
                var x = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue;
                if ("object" === typeof x && null !== x && "function" === typeof x.then) {
                  var ping = task.ping;
                  x.then(ping, ping);
                  task.thenableState = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
                } else {
                  task.replay.pendingTasks--;
                  task.abortSet.delete(task);
                  var errorInfo = getThrownInfo(task.componentStack);
                  request = void 0;
                  var request$jscomp$1 = request$jscomp$0, boundary = task.blockedBoundary, error$jscomp$0 = 12 === request$jscomp$0.status ? request$jscomp$0.fatalError : x, replayNodes = task.replay.nodes, resumeSlots = task.replay.slots;
                  request = logRecoverableError(
                    request$jscomp$1,
                    error$jscomp$0,
                    errorInfo
                  );
                  abortRemainingReplayNodes(
                    request$jscomp$1,
                    boundary,
                    replayNodes,
                    resumeSlots,
                    error$jscomp$0,
                    request
                  );
                  request$jscomp$0.pendingRootTasks--;
                  0 === request$jscomp$0.pendingRootTasks && completeShell(request$jscomp$0);
                  request$jscomp$0.allPendingTasks--;
                  0 === request$jscomp$0.allPendingTasks && completeAll(request$jscomp$0);
                }
              } finally {
              }
            }
          } else if (request$jscomp$0 = void 0, request$jscomp$1 = segment, 0 === request$jscomp$1.status) {
            request$jscomp$1.status = 6;
            switchContext(task.context);
            var childrenLength = request$jscomp$1.children.length, chunkLength = request$jscomp$1.chunks.length;
            try {
              retryNode(request, task), request$jscomp$1.lastPushedText && request$jscomp$1.textEmbedded && request$jscomp$1.chunks.push(textSeparator), task.abortSet.delete(task), request$jscomp$1.status = 1, finishedSegment(request, task.blockedBoundary, request$jscomp$1), finishedTask(
                request,
                task.blockedBoundary,
                task.row,
                request$jscomp$1
              );
            } catch (thrownValue) {
              resetHooksState();
              request$jscomp$1.children.length = childrenLength;
              request$jscomp$1.chunks.length = chunkLength;
              var x$jscomp$0 = thrownValue === SuspenseException ? getSuspendedThenable() : 12 === request.status ? request.fatalError : thrownValue;
              if (12 === request.status && null !== request.trackedPostpones) {
                var trackedPostpones = request.trackedPostpones, thrownInfo = getThrownInfo(task.componentStack);
                task.abortSet.delete(task);
                logRecoverableError(request, x$jscomp$0, thrownInfo);
                trackPostpone(request, trackedPostpones, task, request$jscomp$1);
                finishedTask(
                  request,
                  task.blockedBoundary,
                  task.row,
                  request$jscomp$1
                );
              } else if ("object" === typeof x$jscomp$0 && null !== x$jscomp$0 && "function" === typeof x$jscomp$0.then) {
                request$jscomp$1.status = 0;
                task.thenableState = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
                var ping$jscomp$0 = task.ping;
                x$jscomp$0.then(ping$jscomp$0, ping$jscomp$0);
              } else {
                var errorInfo$jscomp$0 = getThrownInfo(task.componentStack);
                task.abortSet.delete(task);
                request$jscomp$1.status = 4;
                var boundary$jscomp$0 = task.blockedBoundary, row = task.row;
                null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row);
                request.allPendingTasks--;
                request$jscomp$0 = logRecoverableError(
                  request,
                  x$jscomp$0,
                  errorInfo$jscomp$0
                );
                if (null === boundary$jscomp$0) fatalError(request, x$jscomp$0);
                else if (boundary$jscomp$0.pendingTasks--, 4 !== boundary$jscomp$0.status) {
                  boundary$jscomp$0.status = 4;
                  boundary$jscomp$0.errorDigest = request$jscomp$0;
                  untrackBoundary(request, boundary$jscomp$0);
                  var boundaryRow = boundary$jscomp$0.row;
                  null !== boundaryRow && 0 === --boundaryRow.pendingTasks && finishSuspenseListRow(request, boundaryRow);
                  boundary$jscomp$0.parentFlushed && request.clientRenderedBoundaries.push(boundary$jscomp$0);
                  0 === request.pendingRootTasks && null === request.trackedPostpones && null !== boundary$jscomp$0.contentPreamble && preparePreamble(request);
                }
                0 === request.allPendingTasks && completeAll(request);
              }
            } finally {
            }
          }
        }
        pingedTasks.splice(0, i);
        null !== request$jscomp$2.destination && flushCompletedQueues(request$jscomp$2, request$jscomp$2.destination);
      } catch (error2) {
        logRecoverableError(request$jscomp$2, error2, {}), fatalError(request$jscomp$2, error2);
      } finally {
        currentResumableState = prevResumableState, ReactSharedInternals.H = prevDispatcher, ReactSharedInternals.A = prevAsyncDispatcher, prevDispatcher === HooksDispatcher && switchContext(prevContext), currentRequest = prevRequest;
      }
    }
  }
  function preparePreambleFromSubtree(request, segment, collectedPreambleSegments) {
    segment.preambleChildren.length && collectedPreambleSegments.push(segment.preambleChildren);
    for (var pendingPreambles = false, i = 0; i < segment.children.length; i++)
      pendingPreambles = preparePreambleFromSegment(
        request,
        segment.children[i],
        collectedPreambleSegments
      ) || pendingPreambles;
    return pendingPreambles;
  }
  function preparePreambleFromSegment(request, segment, collectedPreambleSegments) {
    var boundary = segment.boundary;
    if (null === boundary)
      return preparePreambleFromSubtree(
        request,
        segment,
        collectedPreambleSegments
      );
    var preamble = boundary.contentPreamble, fallbackPreamble = boundary.fallbackPreamble;
    if (null === preamble || null === fallbackPreamble) return false;
    switch (boundary.status) {
      case 1:
        hoistPreambleState(request.renderState, preamble);
        request.byteSize += boundary.byteSize;
        segment = boundary.completedSegments[0];
        if (!segment)
          throw Error(
            "A previously unvisited boundary must have exactly one root segment. This is a bug in React."
          );
        return preparePreambleFromSubtree(
          request,
          segment,
          collectedPreambleSegments
        );
      case 5:
        if (null !== request.trackedPostpones) return true;
      case 4:
        if (1 === segment.status)
          return hoistPreambleState(request.renderState, fallbackPreamble), preparePreambleFromSubtree(
            request,
            segment,
            collectedPreambleSegments
          );
      default:
        return true;
    }
  }
  function preparePreamble(request) {
    if (request.completedRootSegment && null === request.completedPreambleSegments) {
      var collectedPreambleSegments = [], originalRequestByteSize = request.byteSize, hasPendingPreambles = preparePreambleFromSegment(
        request,
        request.completedRootSegment,
        collectedPreambleSegments
      ), preamble = request.renderState.preamble;
      false === hasPendingPreambles || preamble.headChunks && preamble.bodyChunks ? request.completedPreambleSegments = collectedPreambleSegments : request.byteSize = originalRequestByteSize;
    }
  }
  function flushSubtree(request, destination, segment, hoistableState) {
    segment.parentFlushed = true;
    switch (segment.status) {
      case 0:
        segment.id = request.nextSegmentId++;
      case 5:
        return hoistableState = segment.id, segment.lastPushedText = false, segment.textEmbedded = false, request = request.renderState, writeChunk(destination, placeholder1), writeChunk(destination, request.placeholderPrefix), request = stringToChunk(hoistableState.toString(16)), writeChunk(destination, request), writeChunkAndReturn(destination, placeholder2);
      case 1:
        segment.status = 2;
        var r = true, chunks = segment.chunks, chunkIdx = 0;
        segment = segment.children;
        for (var childIdx = 0; childIdx < segment.length; childIdx++) {
          for (r = segment[childIdx]; chunkIdx < r.index; chunkIdx++)
            writeChunk(destination, chunks[chunkIdx]);
          r = flushSegment(request, destination, r, hoistableState);
        }
        for (; chunkIdx < chunks.length - 1; chunkIdx++)
          writeChunk(destination, chunks[chunkIdx]);
        chunkIdx < chunks.length && (r = writeChunkAndReturn(destination, chunks[chunkIdx]));
        return r;
      case 3:
        return true;
      default:
        throw Error(
          "Aborted, errored or already flushed boundaries should not be flushed again. This is a bug in React."
        );
    }
  }
  var flushedByteSize = 0;
  function flushSegment(request, destination, segment, hoistableState) {
    var boundary = segment.boundary;
    if (null === boundary)
      return flushSubtree(request, destination, segment, hoistableState);
    boundary.parentFlushed = true;
    if (4 === boundary.status) {
      var row = boundary.row;
      null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row);
      boundary = boundary.errorDigest;
      writeChunkAndReturn(destination, startClientRenderedSuspenseBoundary);
      writeChunk(destination, clientRenderedSuspenseBoundaryError1);
      boundary && (writeChunk(destination, clientRenderedSuspenseBoundaryError1A), writeChunk(destination, stringToChunk(escapeTextForBrowser(boundary))), writeChunk(
        destination,
        clientRenderedSuspenseBoundaryErrorAttrInterstitial
      ));
      writeChunkAndReturn(destination, clientRenderedSuspenseBoundaryError2);
      flushSubtree(request, destination, segment, hoistableState);
    } else if (1 !== boundary.status)
      0 === boundary.status && (boundary.rootSegmentID = request.nextSegmentId++), 0 < boundary.completedSegments.length && request.partialBoundaries.push(boundary), writeStartPendingSuspenseBoundary(
        destination,
        request.renderState,
        boundary.rootSegmentID
      ), hoistableState && hoistHoistables(hoistableState, boundary.fallbackState), flushSubtree(request, destination, segment, hoistableState);
    else if (!flushingPartialBoundaries && isEligibleForOutlining(request, boundary) && (flushedByteSize + boundary.byteSize > request.progressiveChunkSize || hasSuspenseyContent(boundary.contentState)))
      boundary.rootSegmentID = request.nextSegmentId++, request.completedBoundaries.push(boundary), writeStartPendingSuspenseBoundary(
        destination,
        request.renderState,
        boundary.rootSegmentID
      ), flushSubtree(request, destination, segment, hoistableState);
    else {
      flushedByteSize += boundary.byteSize;
      hoistableState && hoistHoistables(hoistableState, boundary.contentState);
      segment = boundary.row;
      null !== segment && isEligibleForOutlining(request, boundary) && 0 === --segment.pendingTasks && finishSuspenseListRow(request, segment);
      writeChunkAndReturn(destination, startCompletedSuspenseBoundary);
      segment = boundary.completedSegments;
      if (1 !== segment.length)
        throw Error(
          "A previously unvisited boundary must have exactly one root segment. This is a bug in React."
        );
      flushSegment(request, destination, segment[0], hoistableState);
    }
    return writeChunkAndReturn(destination, endSuspenseBoundary);
  }
  function flushSegmentContainer(request, destination, segment, hoistableState) {
    writeStartSegment(
      destination,
      request.renderState,
      segment.parentFormatContext,
      segment.id
    );
    flushSegment(request, destination, segment, hoistableState);
    return writeEndSegment(destination, segment.parentFormatContext);
  }
  function flushCompletedBoundary(request, destination, boundary) {
    flushedByteSize = boundary.byteSize;
    for (var completedSegments = boundary.completedSegments, i = 0; i < completedSegments.length; i++)
      flushPartiallyCompletedSegment(
        request,
        destination,
        boundary,
        completedSegments[i]
      );
    completedSegments.length = 0;
    completedSegments = boundary.row;
    null !== completedSegments && isEligibleForOutlining(request, boundary) && 0 === --completedSegments.pendingTasks && finishSuspenseListRow(request, completedSegments);
    writeHoistablesForBoundary(
      destination,
      boundary.contentState,
      request.renderState
    );
    completedSegments = request.resumableState;
    request = request.renderState;
    i = boundary.rootSegmentID;
    boundary = boundary.contentState;
    var requiresStyleInsertion = request.stylesToHoist;
    request.stylesToHoist = false;
    writeChunk(destination, request.startInlineScript);
    writeChunk(destination, endOfStartTag);
    requiresStyleInsertion ? (0 === (completedSegments.instructions & 4) && (completedSegments.instructions |= 4, writeChunk(destination, clientRenderScriptFunctionOnly)), 0 === (completedSegments.instructions & 2) && (completedSegments.instructions |= 2, writeChunk(destination, completeBoundaryScriptFunctionOnly)), 0 === (completedSegments.instructions & 8) ? (completedSegments.instructions |= 8, writeChunk(destination, completeBoundaryWithStylesScript1FullPartial)) : writeChunk(destination, completeBoundaryWithStylesScript1Partial)) : (0 === (completedSegments.instructions & 2) && (completedSegments.instructions |= 2, writeChunk(destination, completeBoundaryScriptFunctionOnly)), writeChunk(destination, completeBoundaryScript1Partial));
    completedSegments = stringToChunk(i.toString(16));
    writeChunk(destination, request.boundaryPrefix);
    writeChunk(destination, completedSegments);
    writeChunk(destination, completeBoundaryScript2);
    writeChunk(destination, request.segmentPrefix);
    writeChunk(destination, completedSegments);
    requiresStyleInsertion ? (writeChunk(destination, completeBoundaryScript3a), writeStyleResourceDependenciesInJS(destination, boundary)) : writeChunk(destination, completeBoundaryScript3b);
    boundary = writeChunkAndReturn(destination, completeBoundaryScriptEnd);
    return writeBootstrap(destination, request) && boundary;
  }
  function flushPartiallyCompletedSegment(request, destination, boundary, segment) {
    if (2 === segment.status) return true;
    var hoistableState = boundary.contentState, segmentID = segment.id;
    if (-1 === segmentID) {
      if (-1 === (segment.id = boundary.rootSegmentID))
        throw Error(
          "A root segment ID must have been assigned by now. This is a bug in React."
        );
      return flushSegmentContainer(request, destination, segment, hoistableState);
    }
    if (segmentID === boundary.rootSegmentID)
      return flushSegmentContainer(request, destination, segment, hoistableState);
    flushSegmentContainer(request, destination, segment, hoistableState);
    boundary = request.resumableState;
    request = request.renderState;
    writeChunk(destination, request.startInlineScript);
    writeChunk(destination, endOfStartTag);
    0 === (boundary.instructions & 1) ? (boundary.instructions |= 1, writeChunk(destination, completeSegmentScript1Full)) : writeChunk(destination, completeSegmentScript1Partial);
    writeChunk(destination, request.segmentPrefix);
    segmentID = stringToChunk(segmentID.toString(16));
    writeChunk(destination, segmentID);
    writeChunk(destination, completeSegmentScript2);
    writeChunk(destination, request.placeholderPrefix);
    writeChunk(destination, segmentID);
    destination = writeChunkAndReturn(destination, completeSegmentScriptEnd);
    return destination;
  }
  var flushingPartialBoundaries = false;
  function flushCompletedQueues(request, destination) {
    currentView = new Uint8Array(2048);
    writtenBytes = 0;
    try {
      if (!(0 < request.pendingRootTasks)) {
        var i, completedRootSegment = request.completedRootSegment;
        if (null !== completedRootSegment) {
          if (5 === completedRootSegment.status) return;
          var completedPreambleSegments = request.completedPreambleSegments;
          if (null === completedPreambleSegments) return;
          flushedByteSize = request.byteSize;
          var resumableState = request.resumableState, renderState = request.renderState, preamble = renderState.preamble, htmlChunks = preamble.htmlChunks, headChunks = preamble.headChunks, i$jscomp$0;
          if (htmlChunks) {
            for (i$jscomp$0 = 0; i$jscomp$0 < htmlChunks.length; i$jscomp$0++)
              writeChunk(destination, htmlChunks[i$jscomp$0]);
            if (headChunks)
              for (i$jscomp$0 = 0; i$jscomp$0 < headChunks.length; i$jscomp$0++)
                writeChunk(destination, headChunks[i$jscomp$0]);
            else
              writeChunk(destination, startChunkForTag("head")), writeChunk(destination, endOfStartTag);
          } else if (headChunks)
            for (i$jscomp$0 = 0; i$jscomp$0 < headChunks.length; i$jscomp$0++)
              writeChunk(destination, headChunks[i$jscomp$0]);
          var charsetChunks = renderState.charsetChunks;
          for (i$jscomp$0 = 0; i$jscomp$0 < charsetChunks.length; i$jscomp$0++)
            writeChunk(destination, charsetChunks[i$jscomp$0]);
          charsetChunks.length = 0;
          renderState.preconnects.forEach(flushResource, destination);
          renderState.preconnects.clear();
          var viewportChunks = renderState.viewportChunks;
          for (i$jscomp$0 = 0; i$jscomp$0 < viewportChunks.length; i$jscomp$0++)
            writeChunk(destination, viewportChunks[i$jscomp$0]);
          viewportChunks.length = 0;
          renderState.fontPreloads.forEach(flushResource, destination);
          renderState.fontPreloads.clear();
          renderState.highImagePreloads.forEach(flushResource, destination);
          renderState.highImagePreloads.clear();
          currentlyFlushingRenderState = renderState;
          renderState.styles.forEach(flushStylesInPreamble, destination);
          currentlyFlushingRenderState = null;
          var importMapChunks = renderState.importMapChunks;
          for (i$jscomp$0 = 0; i$jscomp$0 < importMapChunks.length; i$jscomp$0++)
            writeChunk(destination, importMapChunks[i$jscomp$0]);
          importMapChunks.length = 0;
          renderState.bootstrapScripts.forEach(flushResource, destination);
          renderState.scripts.forEach(flushResource, destination);
          renderState.scripts.clear();
          renderState.bulkPreloads.forEach(flushResource, destination);
          renderState.bulkPreloads.clear();
          htmlChunks || headChunks || (resumableState.instructions |= 32);
          var hoistableChunks = renderState.hoistableChunks;
          for (i$jscomp$0 = 0; i$jscomp$0 < hoistableChunks.length; i$jscomp$0++)
            writeChunk(destination, hoistableChunks[i$jscomp$0]);
          for (resumableState = hoistableChunks.length = 0; resumableState < completedPreambleSegments.length; resumableState++) {
            var segments = completedPreambleSegments[resumableState];
            for (renderState = 0; renderState < segments.length; renderState++)
              flushSegment(request, destination, segments[renderState], null);
          }
          var preamble$jscomp$0 = request.renderState.preamble, headChunks$jscomp$0 = preamble$jscomp$0.headChunks;
          (preamble$jscomp$0.htmlChunks || headChunks$jscomp$0) && writeChunk(destination, endChunkForTag("head"));
          var bodyChunks = preamble$jscomp$0.bodyChunks;
          if (bodyChunks)
            for (completedPreambleSegments = 0; completedPreambleSegments < bodyChunks.length; completedPreambleSegments++)
              writeChunk(destination, bodyChunks[completedPreambleSegments]);
          flushSegment(request, destination, completedRootSegment, null);
          request.completedRootSegment = null;
          var renderState$jscomp$0 = request.renderState;
          if (0 !== request.allPendingTasks || 0 !== request.clientRenderedBoundaries.length || 0 !== request.completedBoundaries.length || null !== request.trackedPostpones && (0 !== request.trackedPostpones.rootNodes.length || null !== request.trackedPostpones.rootSlots)) {
            var resumableState$jscomp$0 = request.resumableState;
            if (0 === (resumableState$jscomp$0.instructions & 64)) {
              resumableState$jscomp$0.instructions |= 64;
              writeChunk(destination, renderState$jscomp$0.startInlineScript);
              if (0 === (resumableState$jscomp$0.instructions & 32)) {
                resumableState$jscomp$0.instructions |= 32;
                var shellId = "_" + resumableState$jscomp$0.idPrefix + "R_";
                writeChunk(destination, completedShellIdAttributeStart);
                writeChunk(
                  destination,
                  stringToChunk(escapeTextForBrowser(shellId))
                );
                writeChunk(destination, attributeEnd);
              }
              writeChunk(destination, endOfStartTag);
              writeChunk(destination, shellTimeRuntimeScript);
              writeChunkAndReturn(destination, endInlineScript);
            }
          }
          writeBootstrap(destination, renderState$jscomp$0);
        }
        var renderState$jscomp$1 = request.renderState;
        completedRootSegment = 0;
        var viewportChunks$jscomp$0 = renderState$jscomp$1.viewportChunks;
        for (completedRootSegment = 0; completedRootSegment < viewportChunks$jscomp$0.length; completedRootSegment++)
          writeChunk(destination, viewportChunks$jscomp$0[completedRootSegment]);
        viewportChunks$jscomp$0.length = 0;
        renderState$jscomp$1.preconnects.forEach(flushResource, destination);
        renderState$jscomp$1.preconnects.clear();
        renderState$jscomp$1.fontPreloads.forEach(flushResource, destination);
        renderState$jscomp$1.fontPreloads.clear();
        renderState$jscomp$1.highImagePreloads.forEach(
          flushResource,
          destination
        );
        renderState$jscomp$1.highImagePreloads.clear();
        renderState$jscomp$1.styles.forEach(preloadLateStyles, destination);
        renderState$jscomp$1.scripts.forEach(flushResource, destination);
        renderState$jscomp$1.scripts.clear();
        renderState$jscomp$1.bulkPreloads.forEach(flushResource, destination);
        renderState$jscomp$1.bulkPreloads.clear();
        var hoistableChunks$jscomp$0 = renderState$jscomp$1.hoistableChunks;
        for (completedRootSegment = 0; completedRootSegment < hoistableChunks$jscomp$0.length; completedRootSegment++)
          writeChunk(destination, hoistableChunks$jscomp$0[completedRootSegment]);
        hoistableChunks$jscomp$0.length = 0;
        var clientRenderedBoundaries = request.clientRenderedBoundaries;
        for (i = 0; i < clientRenderedBoundaries.length; i++) {
          var boundary = clientRenderedBoundaries[i];
          renderState$jscomp$1 = destination;
          var resumableState$jscomp$1 = request.resumableState, renderState$jscomp$2 = request.renderState, id = boundary.rootSegmentID, errorDigest = boundary.errorDigest;
          writeChunk(
            renderState$jscomp$1,
            renderState$jscomp$2.startInlineScript
          );
          writeChunk(renderState$jscomp$1, endOfStartTag);
          0 === (resumableState$jscomp$1.instructions & 4) ? (resumableState$jscomp$1.instructions |= 4, writeChunk(renderState$jscomp$1, clientRenderScript1Full)) : writeChunk(renderState$jscomp$1, clientRenderScript1Partial);
          writeChunk(renderState$jscomp$1, renderState$jscomp$2.boundaryPrefix);
          writeChunk(renderState$jscomp$1, stringToChunk(id.toString(16)));
          writeChunk(renderState$jscomp$1, clientRenderScript1A);
          errorDigest && (writeChunk(
            renderState$jscomp$1,
            clientRenderErrorScriptArgInterstitial
          ), writeChunk(
            renderState$jscomp$1,
            stringToChunk(
              escapeJSStringsForInstructionScripts(errorDigest || "")
            )
          ));
          var JSCompiler_inline_result = writeChunkAndReturn(
            renderState$jscomp$1,
            clientRenderScriptEnd
          );
          if (!JSCompiler_inline_result) {
            request.destination = null;
            i++;
            clientRenderedBoundaries.splice(0, i);
            return;
          }
        }
        clientRenderedBoundaries.splice(0, i);
        var completedBoundaries = request.completedBoundaries;
        for (i = 0; i < completedBoundaries.length; i++)
          if (!flushCompletedBoundary(request, destination, completedBoundaries[i])) {
            request.destination = null;
            i++;
            completedBoundaries.splice(0, i);
            return;
          }
        completedBoundaries.splice(0, i);
        completeWriting(destination);
        currentView = new Uint8Array(2048);
        writtenBytes = 0;
        flushingPartialBoundaries = true;
        var partialBoundaries = request.partialBoundaries;
        for (i = 0; i < partialBoundaries.length; i++) {
          var boundary$70 = partialBoundaries[i];
          a: {
            clientRenderedBoundaries = request;
            boundary = destination;
            flushedByteSize = boundary$70.byteSize;
            var completedSegments = boundary$70.completedSegments;
            for (JSCompiler_inline_result = 0; JSCompiler_inline_result < completedSegments.length; JSCompiler_inline_result++)
              if (!flushPartiallyCompletedSegment(
                clientRenderedBoundaries,
                boundary,
                boundary$70,
                completedSegments[JSCompiler_inline_result]
              )) {
                JSCompiler_inline_result++;
                completedSegments.splice(0, JSCompiler_inline_result);
                var JSCompiler_inline_result$jscomp$0 = false;
                break a;
              }
            completedSegments.splice(0, JSCompiler_inline_result);
            var row = boundary$70.row;
            null !== row && row.together && 1 === boundary$70.pendingTasks && (1 === row.pendingTasks ? unblockSuspenseListRow(
              clientRenderedBoundaries,
              row,
              row.hoistables
            ) : row.pendingTasks--);
            JSCompiler_inline_result$jscomp$0 = writeHoistablesForBoundary(
              boundary,
              boundary$70.contentState,
              clientRenderedBoundaries.renderState
            );
          }
          if (!JSCompiler_inline_result$jscomp$0) {
            request.destination = null;
            i++;
            partialBoundaries.splice(0, i);
            return;
          }
        }
        partialBoundaries.splice(0, i);
        flushingPartialBoundaries = false;
        var largeBoundaries = request.completedBoundaries;
        for (i = 0; i < largeBoundaries.length; i++)
          if (!flushCompletedBoundary(request, destination, largeBoundaries[i])) {
            request.destination = null;
            i++;
            largeBoundaries.splice(0, i);
            return;
          }
        largeBoundaries.splice(0, i);
      }
    } finally {
      flushingPartialBoundaries = false, 0 === request.allPendingTasks && 0 === request.clientRenderedBoundaries.length && 0 === request.completedBoundaries.length ? (request.flushScheduled = false, i = request.resumableState, i.hasBody && writeChunk(destination, endChunkForTag("body")), i.hasHtml && writeChunk(destination, endChunkForTag("html")), completeWriting(destination), request.status = 14, destination.close(), request.destination = null) : completeWriting(destination);
    }
  }
  function startWork(request) {
    request.flushScheduled = null !== request.destination;
    supportsRequestStorage ? scheduleMicrotask(function() {
      return requestStorage.run(request, performWork, request);
    }) : scheduleMicrotask(function() {
      return performWork(request);
    });
    setTimeout(function() {
      10 === request.status && (request.status = 11);
      null === request.trackedPostpones && (supportsRequestStorage ? requestStorage.run(
        request,
        enqueueEarlyPreloadsAfterInitialWork,
        request
      ) : enqueueEarlyPreloadsAfterInitialWork(request));
    }, 0);
  }
  function enqueueEarlyPreloadsAfterInitialWork(request) {
    safelyEmitEarlyPreloads(request, 0 === request.pendingRootTasks);
  }
  function enqueueFlush(request) {
    false === request.flushScheduled && 0 === request.pingedTasks.length && null !== request.destination && (request.flushScheduled = true, setTimeout(function() {
      var destination = request.destination;
      destination ? flushCompletedQueues(request, destination) : request.flushScheduled = false;
    }, 0));
  }
  function startFlowing(request, destination) {
    if (13 === request.status)
      request.status = 14, closeWithError(destination, request.fatalError);
    else if (14 !== request.status && null === request.destination) {
      request.destination = destination;
      try {
        flushCompletedQueues(request, destination);
      } catch (error2) {
        logRecoverableError(request, error2, {}), fatalError(request, error2);
      }
    }
  }
  function abort(request, reason) {
    if (11 === request.status || 10 === request.status) request.status = 12;
    try {
      var abortableTasks = request.abortableTasks;
      if (0 < abortableTasks.size) {
        var error2 = void 0 === reason ? Error("The render was aborted by the server without a reason.") : "object" === typeof reason && null !== reason && "function" === typeof reason.then ? Error("The render was aborted by the server with a promise.") : reason;
        request.fatalError = error2;
        abortableTasks.forEach(function(task) {
          return abortTask(task, request, error2);
        });
        abortableTasks.clear();
      }
      null !== request.destination && flushCompletedQueues(request, request.destination);
    } catch (error$72) {
      logRecoverableError(request, error$72, {}), fatalError(request, error$72);
    }
  }
  function addToReplayParent(node, parentKeyPath, trackedPostpones) {
    if (null === parentKeyPath) trackedPostpones.rootNodes.push(node);
    else {
      var workingMap = trackedPostpones.workingMap, parentNode = workingMap.get(parentKeyPath);
      void 0 === parentNode && (parentNode = [parentKeyPath[1], parentKeyPath[2], [], null], workingMap.set(parentKeyPath, parentNode), addToReplayParent(parentNode, parentKeyPath[0], trackedPostpones));
      parentNode[2].push(node);
    }
  }
  function getPostponedState(request) {
    var trackedPostpones = request.trackedPostpones;
    if (null === trackedPostpones || 0 === trackedPostpones.rootNodes.length && null === trackedPostpones.rootSlots)
      return request.trackedPostpones = null;
    if (null === request.completedRootSegment || 5 !== request.completedRootSegment.status && null !== request.completedPreambleSegments) {
      var nextSegmentId = request.nextSegmentId;
      var replaySlots = trackedPostpones.rootSlots;
      var resumableState = request.resumableState;
      resumableState.bootstrapScriptContent = void 0;
      resumableState.bootstrapScripts = void 0;
      resumableState.bootstrapModules = void 0;
    } else {
      nextSegmentId = 0;
      replaySlots = -1;
      resumableState = request.resumableState;
      var renderState = request.renderState;
      resumableState.nextFormID = 0;
      resumableState.hasBody = false;
      resumableState.hasHtml = false;
      resumableState.unknownResources = { font: renderState.resets.font };
      resumableState.dnsResources = renderState.resets.dns;
      resumableState.connectResources = renderState.resets.connect;
      resumableState.imageResources = renderState.resets.image;
      resumableState.styleResources = renderState.resets.style;
      resumableState.scriptResources = {};
      resumableState.moduleUnknownResources = {};
      resumableState.moduleScriptResources = {};
      resumableState.instructions = 0;
    }
    return {
      nextSegmentId,
      rootFormatContext: request.rootFormatContext,
      progressiveChunkSize: request.progressiveChunkSize,
      resumableState: request.resumableState,
      replayNodes: trackedPostpones.rootNodes,
      replaySlots
    };
  }
  function ensureCorrectIsomorphicReactVersion() {
    var isomorphicReactPackageVersion = React2.version;
    if ("19.2.6" !== isomorphicReactPackageVersion)
      throw Error(
        'Incompatible React versions: The "react" and "react-dom" packages must have the exact same version. Instead got:\n  - react:      ' + (isomorphicReactPackageVersion + "\n  - react-dom:  19.2.6\nLearn more: https://react.dev/warnings/version-mismatch")
      );
  }
  ensureCorrectIsomorphicReactVersion();
  ensureCorrectIsomorphicReactVersion();
  reactDomServer_edge_production.prerender = function(children, options) {
    return new Promise(function(resolve, reject) {
      var onHeaders = options ? options.onHeaders : void 0, onHeadersImpl;
      onHeaders && (onHeadersImpl = function(headersDescriptor) {
        onHeaders(new Headers(headersDescriptor));
      });
      var resources = createResumableState(
        options ? options.identifierPrefix : void 0,
        options ? options.unstable_externalRuntimeSrc : void 0,
        options ? options.bootstrapScriptContent : void 0,
        options ? options.bootstrapScripts : void 0,
        options ? options.bootstrapModules : void 0
      ), request = createPrerenderRequest(
        children,
        resources,
        createRenderState(
          resources,
          void 0,
          options ? options.unstable_externalRuntimeSrc : void 0,
          options ? options.importMap : void 0,
          onHeadersImpl,
          options ? options.maxHeadersLength : void 0
        ),
        createRootFormatContext(options ? options.namespaceURI : void 0),
        options ? options.progressiveChunkSize : void 0,
        options ? options.onError : void 0,
        function() {
          var stream = new ReadableStream(
            {
              type: "bytes",
              pull: function(controller) {
                startFlowing(request, controller);
              },
              cancel: function(reason) {
                request.destination = null;
                abort(request, reason);
              }
            },
            { highWaterMark: 0 }
          );
          stream = { postponed: getPostponedState(request), prelude: stream };
          resolve(stream);
        },
        void 0,
        void 0,
        reject,
        options ? options.onPostpone : void 0
      );
      if (options && options.signal) {
        var signal = options.signal;
        if (signal.aborted) abort(request, signal.reason);
        else {
          var listener = function() {
            abort(request, signal.reason);
            signal.removeEventListener("abort", listener);
          };
          signal.addEventListener("abort", listener);
        }
      }
      startWork(request);
    });
  };
  reactDomServer_edge_production.renderToReadableStream = function(children, options) {
    return new Promise(function(resolve, reject) {
      var onFatalError, onAllReady, allReady = new Promise(function(res, rej) {
        onAllReady = res;
        onFatalError = rej;
      }), onHeaders = options ? options.onHeaders : void 0, onHeadersImpl;
      onHeaders && (onHeadersImpl = function(headersDescriptor) {
        onHeaders(new Headers(headersDescriptor));
      });
      var resumableState = createResumableState(
        options ? options.identifierPrefix : void 0,
        options ? options.unstable_externalRuntimeSrc : void 0,
        options ? options.bootstrapScriptContent : void 0,
        options ? options.bootstrapScripts : void 0,
        options ? options.bootstrapModules : void 0
      ), request = createRequest(
        children,
        resumableState,
        createRenderState(
          resumableState,
          options ? options.nonce : void 0,
          options ? options.unstable_externalRuntimeSrc : void 0,
          options ? options.importMap : void 0,
          onHeadersImpl,
          options ? options.maxHeadersLength : void 0
        ),
        createRootFormatContext(options ? options.namespaceURI : void 0),
        options ? options.progressiveChunkSize : void 0,
        options ? options.onError : void 0,
        onAllReady,
        function() {
          var stream = new ReadableStream(
            {
              type: "bytes",
              pull: function(controller) {
                startFlowing(request, controller);
              },
              cancel: function(reason) {
                request.destination = null;
                abort(request, reason);
              }
            },
            { highWaterMark: 0 }
          );
          stream.allReady = allReady;
          resolve(stream);
        },
        function(error2) {
          allReady.catch(function() {
          });
          reject(error2);
        },
        onFatalError,
        options ? options.onPostpone : void 0,
        options ? options.formState : void 0
      );
      if (options && options.signal) {
        var signal = options.signal;
        if (signal.aborted) abort(request, signal.reason);
        else {
          var listener = function() {
            abort(request, signal.reason);
            signal.removeEventListener("abort", listener);
          };
          signal.addEventListener("abort", listener);
        }
      }
      startWork(request);
    });
  };
  reactDomServer_edge_production.resume = function(children, postponedState, options) {
    return new Promise(function(resolve, reject) {
      var onFatalError, onAllReady, allReady = new Promise(function(res, rej) {
        onAllReady = res;
        onFatalError = rej;
      }), request = resumeRequest(
        children,
        postponedState,
        createRenderState(
          postponedState.resumableState,
          options ? options.nonce : void 0,
          void 0,
          void 0,
          void 0,
          void 0
        ),
        options ? options.onError : void 0,
        onAllReady,
        function() {
          var stream = new ReadableStream(
            {
              type: "bytes",
              pull: function(controller) {
                startFlowing(request, controller);
              },
              cancel: function(reason) {
                request.destination = null;
                abort(request, reason);
              }
            },
            { highWaterMark: 0 }
          );
          stream.allReady = allReady;
          resolve(stream);
        },
        function(error2) {
          allReady.catch(function() {
          });
          reject(error2);
        },
        onFatalError,
        options ? options.onPostpone : void 0
      );
      if (options && options.signal) {
        var signal = options.signal;
        if (signal.aborted) abort(request, signal.reason);
        else {
          var listener = function() {
            abort(request, signal.reason);
            signal.removeEventListener("abort", listener);
          };
          signal.addEventListener("abort", listener);
        }
      }
      startWork(request);
    });
  };
  reactDomServer_edge_production.resumeAndPrerender = function(children, postponedState, options) {
    return new Promise(function(resolve, reject) {
      var request = resumeAndPrerenderRequest(
        children,
        postponedState,
        createRenderState(
          postponedState.resumableState,
          void 0,
          void 0,
          void 0,
          void 0,
          void 0
        ),
        options ? options.onError : void 0,
        function() {
          var stream = new ReadableStream(
            {
              type: "bytes",
              pull: function(controller) {
                startFlowing(request, controller);
              },
              cancel: function(reason) {
                request.destination = null;
                abort(request, reason);
              }
            },
            { highWaterMark: 0 }
          );
          stream = { postponed: getPostponedState(request), prelude: stream };
          resolve(stream);
        },
        void 0,
        void 0,
        reject,
        options ? options.onPostpone : void 0
      );
      if (options && options.signal) {
        var signal = options.signal;
        if (signal.aborted) abort(request, signal.reason);
        else {
          var listener = function() {
            abort(request, signal.reason);
            signal.removeEventListener("abort", listener);
          };
          signal.addEventListener("abort", listener);
        }
      }
      startWork(request);
    });
  };
  reactDomServer_edge_production.version = "19.2.6";
  return reactDomServer_edge_production;
}
var reactDomServerLegacy_browser_production = {};
var hasRequiredReactDomServerLegacy_browser_production;
function requireReactDomServerLegacy_browser_production() {
  if (hasRequiredReactDomServerLegacy_browser_production) return reactDomServerLegacy_browser_production;
  hasRequiredReactDomServerLegacy_browser_production = 1;
  var React2 = requireReact(), ReactDOM2 = requireReactDom();
  function formatProdErrorMessage(code) {
    var url = "https://react.dev/errors/" + code;
    if (1 < arguments.length) {
      url += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var i = 2; i < arguments.length; i++)
        url += "&args[]=" + encodeURIComponent(arguments[i]);
    }
    return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_SCOPE_TYPE = /* @__PURE__ */ Symbol.for("react.scope"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), REACT_LEGACY_HIDDEN_TYPE = /* @__PURE__ */ Symbol.for("react.legacy_hidden"), REACT_MEMO_CACHE_SENTINEL = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel"), REACT_VIEW_TRANSITION_TYPE = /* @__PURE__ */ Symbol.for("react.view_transition"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
  function getIteratorFn(maybeIterable) {
    if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
    maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
    return "function" === typeof maybeIterable ? maybeIterable : null;
  }
  var isArrayImpl = Array.isArray;
  function murmurhash3_32_gc(key, seed) {
    var remainder = key.length & 3;
    var bytes = key.length - remainder;
    var h1 = seed;
    for (seed = 0; seed < bytes; ) {
      var k1 = key.charCodeAt(seed) & 255 | (key.charCodeAt(++seed) & 255) << 8 | (key.charCodeAt(++seed) & 255) << 16 | (key.charCodeAt(++seed) & 255) << 24;
      ++seed;
      k1 = 3432918353 * (k1 & 65535) + ((3432918353 * (k1 >>> 16) & 65535) << 16) & 4294967295;
      k1 = k1 << 15 | k1 >>> 17;
      k1 = 461845907 * (k1 & 65535) + ((461845907 * (k1 >>> 16) & 65535) << 16) & 4294967295;
      h1 ^= k1;
      h1 = h1 << 13 | h1 >>> 19;
      h1 = 5 * (h1 & 65535) + ((5 * (h1 >>> 16) & 65535) << 16) & 4294967295;
      h1 = (h1 & 65535) + 27492 + (((h1 >>> 16) + 58964 & 65535) << 16);
    }
    k1 = 0;
    switch (remainder) {
      case 3:
        k1 ^= (key.charCodeAt(seed + 2) & 255) << 16;
      case 2:
        k1 ^= (key.charCodeAt(seed + 1) & 255) << 8;
      case 1:
        k1 ^= key.charCodeAt(seed) & 255, k1 = 3432918353 * (k1 & 65535) + ((3432918353 * (k1 >>> 16) & 65535) << 16) & 4294967295, k1 = k1 << 15 | k1 >>> 17, h1 ^= 461845907 * (k1 & 65535) + ((461845907 * (k1 >>> 16) & 65535) << 16) & 4294967295;
    }
    h1 ^= key.length;
    h1 ^= h1 >>> 16;
    h1 = 2246822507 * (h1 & 65535) + ((2246822507 * (h1 >>> 16) & 65535) << 16) & 4294967295;
    h1 ^= h1 >>> 13;
    h1 = 3266489909 * (h1 & 65535) + ((3266489909 * (h1 >>> 16) & 65535) << 16) & 4294967295;
    return (h1 ^ h1 >>> 16) >>> 0;
  }
  var assign = Object.assign, hasOwnProperty = Object.prototype.hasOwnProperty, VALID_ATTRIBUTE_NAME_REGEX = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), illegalAttributeNameCache = {}, validatedAttributeNameCache = {};
  function isAttributeNameSafe(attributeName) {
    if (hasOwnProperty.call(validatedAttributeNameCache, attributeName))
      return true;
    if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) return false;
    if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName))
      return validatedAttributeNameCache[attributeName] = true;
    illegalAttributeNameCache[attributeName] = true;
    return false;
  }
  var unitlessNumbers = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  ), aliases = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), matchHtmlRegExp = /["'&<>]/;
  function escapeTextForBrowser(text) {
    if ("boolean" === typeof text || "number" === typeof text || "bigint" === typeof text)
      return "" + text;
    text = "" + text;
    var match = matchHtmlRegExp.exec(text);
    if (match) {
      var html = "", index, lastIndex = 0;
      for (index = match.index; index < text.length; index++) {
        switch (text.charCodeAt(index)) {
          case 34:
            match = "&quot;";
            break;
          case 38:
            match = "&amp;";
            break;
          case 39:
            match = "&#x27;";
            break;
          case 60:
            match = "&lt;";
            break;
          case 62:
            match = "&gt;";
            break;
          default:
            continue;
        }
        lastIndex !== index && (html += text.slice(lastIndex, index));
        lastIndex = index + 1;
        html += match;
      }
      text = lastIndex !== index ? html + text.slice(lastIndex, index) : html;
    }
    return text;
  }
  var uppercasePattern = /([A-Z])/g, msPattern = /^ms-/, isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function sanitizeURL(url) {
    return isJavaScriptProtocol.test("" + url) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : url;
  }
  var ReactSharedInternals = React2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ReactDOMSharedInternals = ReactDOM2.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, sharedNotPendingObject = {
    pending: false,
    data: null,
    method: null,
    action: null
  }, previousDispatcher = ReactDOMSharedInternals.d;
  ReactDOMSharedInternals.d = {
    f: previousDispatcher.f,
    r: previousDispatcher.r,
    D: prefetchDNS,
    C: preconnect,
    L: preload,
    m: preloadModule,
    X: preinitScript,
    S: preinitStyle,
    M: preinitModuleScript
  };
  var PRELOAD_NO_CREDS = [], currentlyFlushingRenderState = null, scriptRegex = /(<\/|<)(s)(cript)/gi;
  function scriptReplacer(match, prefix2, s2, suffix2) {
    return "" + prefix2 + ("s" === s2 ? "\\u0073" : "\\u0053") + suffix2;
  }
  function createResumableState(identifierPrefix, externalRuntimeConfig, bootstrapScriptContent, bootstrapScripts, bootstrapModules) {
    return {
      idPrefix: void 0 === identifierPrefix ? "" : identifierPrefix,
      nextFormID: 0,
      streamingFormat: 0,
      bootstrapScriptContent,
      bootstrapScripts,
      bootstrapModules,
      instructions: 0,
      hasBody: false,
      hasHtml: false,
      unknownResources: {},
      dnsResources: {},
      connectResources: { default: {}, anonymous: {}, credentials: {} },
      imageResources: {},
      styleResources: {},
      scriptResources: {},
      moduleUnknownResources: {},
      moduleScriptResources: {}
    };
  }
  function createFormatContext(insertionMode, selectedValue, tagScope, viewTransition) {
    return {
      insertionMode,
      selectedValue,
      tagScope,
      viewTransition
    };
  }
  function getChildFormatContext(parentContext, type, props) {
    var subtreeScope = parentContext.tagScope & -25;
    switch (type) {
      case "noscript":
        return createFormatContext(2, null, subtreeScope | 1, null);
      case "select":
        return createFormatContext(
          2,
          null != props.value ? props.value : props.defaultValue,
          subtreeScope,
          null
        );
      case "svg":
        return createFormatContext(4, null, subtreeScope, null);
      case "picture":
        return createFormatContext(2, null, subtreeScope | 2, null);
      case "math":
        return createFormatContext(5, null, subtreeScope, null);
      case "foreignObject":
        return createFormatContext(2, null, subtreeScope, null);
      case "table":
        return createFormatContext(6, null, subtreeScope, null);
      case "thead":
      case "tbody":
      case "tfoot":
        return createFormatContext(7, null, subtreeScope, null);
      case "colgroup":
        return createFormatContext(9, null, subtreeScope, null);
      case "tr":
        return createFormatContext(8, null, subtreeScope, null);
      case "head":
        if (2 > parentContext.insertionMode)
          return createFormatContext(3, null, subtreeScope, null);
        break;
      case "html":
        if (0 === parentContext.insertionMode)
          return createFormatContext(1, null, subtreeScope, null);
    }
    return 6 <= parentContext.insertionMode || 2 > parentContext.insertionMode ? createFormatContext(2, null, subtreeScope, null) : parentContext.tagScope !== subtreeScope ? createFormatContext(
      parentContext.insertionMode,
      parentContext.selectedValue,
      subtreeScope,
      null
    ) : parentContext;
  }
  function getSuspenseViewTransition(parentViewTransition) {
    return null === parentViewTransition ? null : {
      update: parentViewTransition.update,
      enter: "none",
      exit: "none",
      share: parentViewTransition.update,
      name: parentViewTransition.autoName,
      autoName: parentViewTransition.autoName,
      nameIdx: 0
    };
  }
  function getSuspenseFallbackFormatContext(resumableState, parentContext) {
    parentContext.tagScope & 32 && (resumableState.instructions |= 128);
    return createFormatContext(
      parentContext.insertionMode,
      parentContext.selectedValue,
      parentContext.tagScope | 12,
      getSuspenseViewTransition(parentContext.viewTransition)
    );
  }
  function getSuspenseContentFormatContext(resumableState, parentContext) {
    resumableState = getSuspenseViewTransition(parentContext.viewTransition);
    var subtreeScope = parentContext.tagScope | 16;
    null !== resumableState && "none" !== resumableState.share && (subtreeScope |= 64);
    return createFormatContext(
      parentContext.insertionMode,
      parentContext.selectedValue,
      subtreeScope,
      resumableState
    );
  }
  var styleNameCache = /* @__PURE__ */ new Map();
  function pushStyleAttribute(target, style) {
    if ("object" !== typeof style) throw Error(formatProdErrorMessage(62));
    var isFirst = true, styleName;
    for (styleName in style)
      if (hasOwnProperty.call(style, styleName)) {
        var styleValue = style[styleName];
        if (null != styleValue && "boolean" !== typeof styleValue && "" !== styleValue) {
          if (0 === styleName.indexOf("--")) {
            var nameChunk = escapeTextForBrowser(styleName);
            styleValue = escapeTextForBrowser(("" + styleValue).trim());
          } else
            nameChunk = styleNameCache.get(styleName), void 0 === nameChunk && (nameChunk = escapeTextForBrowser(
              styleName.replace(uppercasePattern, "-$1").toLowerCase().replace(msPattern, "-ms-")
            ), styleNameCache.set(styleName, nameChunk)), styleValue = "number" === typeof styleValue ? 0 === styleValue || unitlessNumbers.has(styleName) ? "" + styleValue : styleValue + "px" : escapeTextForBrowser(("" + styleValue).trim());
          isFirst ? (isFirst = false, target.push(' style="', nameChunk, ":", styleValue)) : target.push(";", nameChunk, ":", styleValue);
        }
      }
    isFirst || target.push('"');
  }
  function pushBooleanAttribute(target, name, value) {
    value && "function" !== typeof value && "symbol" !== typeof value && target.push(" ", name, '=""');
  }
  function pushStringAttribute(target, name, value) {
    "function" !== typeof value && "symbol" !== typeof value && "boolean" !== typeof value && target.push(" ", name, '="', escapeTextForBrowser(value), '"');
  }
  var actionJavaScriptURL = escapeTextForBrowser(
    "javascript:throw new Error('React form unexpectedly submitted.')"
  );
  function pushAdditionalFormField(value, key) {
    this.push('<input type="hidden"');
    validateAdditionalFormField(value);
    pushStringAttribute(this, "name", key);
    pushStringAttribute(this, "value", value);
    this.push("/>");
  }
  function validateAdditionalFormField(value) {
    if ("string" !== typeof value) throw Error(formatProdErrorMessage(480));
  }
  function getCustomFormFields(resumableState, formAction) {
    if ("function" === typeof formAction.$$FORM_ACTION) {
      var id = resumableState.nextFormID++;
      resumableState = resumableState.idPrefix + id;
      try {
        var customFields = formAction.$$FORM_ACTION(resumableState);
        if (customFields) {
          var formData = customFields.data;
          null != formData && formData.forEach(validateAdditionalFormField);
        }
        return customFields;
      } catch (x) {
        if ("object" === typeof x && null !== x && "function" === typeof x.then)
          throw x;
      }
    }
    return null;
  }
  function pushFormActionAttribute(target, resumableState, renderState, formAction, formEncType, formMethod, formTarget, name) {
    var formData = null;
    if ("function" === typeof formAction) {
      var customFields = getCustomFormFields(resumableState, formAction);
      null !== customFields ? (name = customFields.name, formAction = customFields.action || "", formEncType = customFields.encType, formMethod = customFields.method, formTarget = customFields.target, formData = customFields.data) : (target.push(" ", "formAction", '="', actionJavaScriptURL, '"'), formTarget = formMethod = formEncType = formAction = name = null, injectFormReplayingRuntime(resumableState, renderState));
    }
    null != name && pushAttribute(target, "name", name);
    null != formAction && pushAttribute(target, "formAction", formAction);
    null != formEncType && pushAttribute(target, "formEncType", formEncType);
    null != formMethod && pushAttribute(target, "formMethod", formMethod);
    null != formTarget && pushAttribute(target, "formTarget", formTarget);
    return formData;
  }
  function pushAttribute(target, name, value) {
    switch (name) {
      case "className":
        pushStringAttribute(target, "class", value);
        break;
      case "tabIndex":
        pushStringAttribute(target, "tabindex", value);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        pushStringAttribute(target, name, value);
        break;
      case "style":
        pushStyleAttribute(target, value);
        break;
      case "src":
      case "href":
        if ("" === value) break;
      case "action":
      case "formAction":
        if (null == value || "function" === typeof value || "symbol" === typeof value || "boolean" === typeof value)
          break;
        value = sanitizeURL("" + value);
        target.push(" ", name, '="', escapeTextForBrowser(value), '"');
        break;
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "ref":
        break;
      case "autoFocus":
      case "multiple":
      case "muted":
        pushBooleanAttribute(target, name.toLowerCase(), value);
        break;
      case "xlinkHref":
        if ("function" === typeof value || "symbol" === typeof value || "boolean" === typeof value)
          break;
        value = sanitizeURL("" + value);
        target.push(" ", "xlink:href", '="', escapeTextForBrowser(value), '"');
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        "function" !== typeof value && "symbol" !== typeof value && target.push(" ", name, '="', escapeTextForBrowser(value), '"');
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        value && "function" !== typeof value && "symbol" !== typeof value && target.push(" ", name, '=""');
        break;
      case "capture":
      case "download":
        true === value ? target.push(" ", name, '=""') : false !== value && "function" !== typeof value && "symbol" !== typeof value && target.push(" ", name, '="', escapeTextForBrowser(value), '"');
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        "function" !== typeof value && "symbol" !== typeof value && !isNaN(value) && 1 <= value && target.push(" ", name, '="', escapeTextForBrowser(value), '"');
        break;
      case "rowSpan":
      case "start":
        "function" === typeof value || "symbol" === typeof value || isNaN(value) || target.push(" ", name, '="', escapeTextForBrowser(value), '"');
        break;
      case "xlinkActuate":
        pushStringAttribute(target, "xlink:actuate", value);
        break;
      case "xlinkArcrole":
        pushStringAttribute(target, "xlink:arcrole", value);
        break;
      case "xlinkRole":
        pushStringAttribute(target, "xlink:role", value);
        break;
      case "xlinkShow":
        pushStringAttribute(target, "xlink:show", value);
        break;
      case "xlinkTitle":
        pushStringAttribute(target, "xlink:title", value);
        break;
      case "xlinkType":
        pushStringAttribute(target, "xlink:type", value);
        break;
      case "xmlBase":
        pushStringAttribute(target, "xml:base", value);
        break;
      case "xmlLang":
        pushStringAttribute(target, "xml:lang", value);
        break;
      case "xmlSpace":
        pushStringAttribute(target, "xml:space", value);
        break;
      default:
        if (!(2 < name.length) || "o" !== name[0] && "O" !== name[0] || "n" !== name[1] && "N" !== name[1]) {
          if (name = aliases.get(name) || name, isAttributeNameSafe(name)) {
            switch (typeof value) {
              case "function":
              case "symbol":
                return;
              case "boolean":
                var prefix$8 = name.toLowerCase().slice(0, 5);
                if ("data-" !== prefix$8 && "aria-" !== prefix$8) return;
            }
            target.push(" ", name, '="', escapeTextForBrowser(value), '"');
          }
        }
    }
  }
  function pushInnerHTML(target, innerHTML, children) {
    if (null != innerHTML) {
      if (null != children) throw Error(formatProdErrorMessage(60));
      if ("object" !== typeof innerHTML || !("__html" in innerHTML))
        throw Error(formatProdErrorMessage(61));
      innerHTML = innerHTML.__html;
      null !== innerHTML && void 0 !== innerHTML && target.push("" + innerHTML);
    }
  }
  function flattenOptionChildren(children) {
    var content = "";
    React2.Children.forEach(children, function(child) {
      null != child && (content += child);
    });
    return content;
  }
  function injectFormReplayingRuntime(resumableState, renderState) {
    if (0 === (resumableState.instructions & 16)) {
      resumableState.instructions |= 16;
      var preamble = renderState.preamble, bootstrapChunks = renderState.bootstrapChunks;
      (preamble.htmlChunks || preamble.headChunks) && 0 === bootstrapChunks.length ? (bootstrapChunks.push(renderState.startInlineScript), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(
        ">",
        `addEventListener("submit",function(a){if(!a.defaultPrevented){var c=a.target,d=a.submitter,e=c.action,b=d;if(d){var f=d.getAttribute("formAction");null!=f&&(e=f,b=null)}"javascript:throw new Error('React form unexpectedly submitted.')"===e&&(a.preventDefault(),b?(a=document.createElement("input"),a.name=b.name,a.value=b.value,b.parentNode.insertBefore(a,b),b=new FormData(c),a.parentNode.removeChild(a)):b=new FormData(c),a=c.ownerDocument||c,(a.$$reactFormReplay=a.$$reactFormReplay||[]).push(c,d,b))}});`,
        "<\/script>"
      )) : bootstrapChunks.unshift(
        renderState.startInlineScript,
        ">",
        `addEventListener("submit",function(a){if(!a.defaultPrevented){var c=a.target,d=a.submitter,e=c.action,b=d;if(d){var f=d.getAttribute("formAction");null!=f&&(e=f,b=null)}"javascript:throw new Error('React form unexpectedly submitted.')"===e&&(a.preventDefault(),b?(a=document.createElement("input"),a.name=b.name,a.value=b.value,b.parentNode.insertBefore(a,b),b=new FormData(c),a.parentNode.removeChild(a)):b=new FormData(c),a=c.ownerDocument||c,(a.$$reactFormReplay=a.$$reactFormReplay||[]).push(c,d,b))}});`,
        "<\/script>"
      );
    }
  }
  function pushLinkImpl(target, props) {
    target.push(startChunkForTag("link"));
    for (var propKey in props)
      if (hasOwnProperty.call(props, propKey)) {
        var propValue = props[propKey];
        if (null != propValue)
          switch (propKey) {
            case "children":
            case "dangerouslySetInnerHTML":
              throw Error(formatProdErrorMessage(399, "link"));
            default:
              pushAttribute(target, propKey, propValue);
          }
      }
    target.push("/>");
    return null;
  }
  var styleRegex = /(<\/|<)(s)(tyle)/gi;
  function styleReplacer(match, prefix2, s2, suffix2) {
    return "" + prefix2 + ("s" === s2 ? "\\73 " : "\\53 ") + suffix2;
  }
  function pushSelfClosing(target, props, tag) {
    target.push(startChunkForTag(tag));
    for (var propKey in props)
      if (hasOwnProperty.call(props, propKey)) {
        var propValue = props[propKey];
        if (null != propValue)
          switch (propKey) {
            case "children":
            case "dangerouslySetInnerHTML":
              throw Error(formatProdErrorMessage(399, tag));
            default:
              pushAttribute(target, propKey, propValue);
          }
      }
    target.push("/>");
    return null;
  }
  function pushTitleImpl(target, props) {
    target.push(startChunkForTag("title"));
    var children = null, innerHTML = null, propKey;
    for (propKey in props)
      if (hasOwnProperty.call(props, propKey)) {
        var propValue = props[propKey];
        if (null != propValue)
          switch (propKey) {
            case "children":
              children = propValue;
              break;
            case "dangerouslySetInnerHTML":
              innerHTML = propValue;
              break;
            default:
              pushAttribute(target, propKey, propValue);
          }
      }
    target.push(">");
    props = Array.isArray(children) ? 2 > children.length ? children[0] : null : children;
    "function" !== typeof props && "symbol" !== typeof props && null !== props && void 0 !== props && target.push(escapeTextForBrowser("" + props));
    pushInnerHTML(target, innerHTML, children);
    target.push(endChunkForTag("title"));
    return null;
  }
  function pushScriptImpl(target, props) {
    target.push(startChunkForTag("script"));
    var children = null, innerHTML = null, propKey;
    for (propKey in props)
      if (hasOwnProperty.call(props, propKey)) {
        var propValue = props[propKey];
        if (null != propValue)
          switch (propKey) {
            case "children":
              children = propValue;
              break;
            case "dangerouslySetInnerHTML":
              innerHTML = propValue;
              break;
            default:
              pushAttribute(target, propKey, propValue);
          }
      }
    target.push(">");
    pushInnerHTML(target, innerHTML, children);
    "string" === typeof children && target.push(("" + children).replace(scriptRegex, scriptReplacer));
    target.push(endChunkForTag("script"));
    return null;
  }
  function pushStartSingletonElement(target, props, tag) {
    target.push(startChunkForTag(tag));
    var innerHTML = tag = null, propKey;
    for (propKey in props)
      if (hasOwnProperty.call(props, propKey)) {
        var propValue = props[propKey];
        if (null != propValue)
          switch (propKey) {
            case "children":
              tag = propValue;
              break;
            case "dangerouslySetInnerHTML":
              innerHTML = propValue;
              break;
            default:
              pushAttribute(target, propKey, propValue);
          }
      }
    target.push(">");
    pushInnerHTML(target, innerHTML, tag);
    return tag;
  }
  function pushStartGenericElement(target, props, tag) {
    target.push(startChunkForTag(tag));
    var innerHTML = tag = null, propKey;
    for (propKey in props)
      if (hasOwnProperty.call(props, propKey)) {
        var propValue = props[propKey];
        if (null != propValue)
          switch (propKey) {
            case "children":
              tag = propValue;
              break;
            case "dangerouslySetInnerHTML":
              innerHTML = propValue;
              break;
            default:
              pushAttribute(target, propKey, propValue);
          }
      }
    target.push(">");
    pushInnerHTML(target, innerHTML, tag);
    return "string" === typeof tag ? (target.push(escapeTextForBrowser(tag)), null) : tag;
  }
  var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/, validatedTagCache = /* @__PURE__ */ new Map();
  function startChunkForTag(tag) {
    var tagStartChunk = validatedTagCache.get(tag);
    if (void 0 === tagStartChunk) {
      if (!VALID_TAG_REGEX.test(tag))
        throw Error(formatProdErrorMessage(65, tag));
      tagStartChunk = "<" + tag;
      validatedTagCache.set(tag, tagStartChunk);
    }
    return tagStartChunk;
  }
  function pushStartInstance(target$jscomp$0, type, props, resumableState, renderState, preambleState, hoistableState, formatContext, textEmbedded) {
    switch (type) {
      case "div":
      case "span":
      case "svg":
      case "path":
        break;
      case "a":
        target$jscomp$0.push(startChunkForTag("a"));
        var children = null, innerHTML = null, propKey;
        for (propKey in props)
          if (hasOwnProperty.call(props, propKey)) {
            var propValue = props[propKey];
            if (null != propValue)
              switch (propKey) {
                case "children":
                  children = propValue;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML = propValue;
                  break;
                case "href":
                  "" === propValue ? pushStringAttribute(target$jscomp$0, "href", "") : pushAttribute(target$jscomp$0, propKey, propValue);
                  break;
                default:
                  pushAttribute(target$jscomp$0, propKey, propValue);
              }
          }
        target$jscomp$0.push(">");
        pushInnerHTML(target$jscomp$0, innerHTML, children);
        if ("string" === typeof children) {
          target$jscomp$0.push(escapeTextForBrowser(children));
          var JSCompiler_inline_result = null;
        } else JSCompiler_inline_result = children;
        return JSCompiler_inline_result;
      case "g":
      case "p":
      case "li":
        break;
      case "select":
        target$jscomp$0.push(startChunkForTag("select"));
        var children$jscomp$0 = null, innerHTML$jscomp$0 = null, propKey$jscomp$0;
        for (propKey$jscomp$0 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$0)) {
            var propValue$jscomp$0 = props[propKey$jscomp$0];
            if (null != propValue$jscomp$0)
              switch (propKey$jscomp$0) {
                case "children":
                  children$jscomp$0 = propValue$jscomp$0;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML$jscomp$0 = propValue$jscomp$0;
                  break;
                case "defaultValue":
                case "value":
                  break;
                default:
                  pushAttribute(
                    target$jscomp$0,
                    propKey$jscomp$0,
                    propValue$jscomp$0
                  );
              }
          }
        target$jscomp$0.push(">");
        pushInnerHTML(target$jscomp$0, innerHTML$jscomp$0, children$jscomp$0);
        return children$jscomp$0;
      case "option":
        var selectedValue = formatContext.selectedValue;
        target$jscomp$0.push(startChunkForTag("option"));
        var children$jscomp$1 = null, value = null, selected = null, innerHTML$jscomp$1 = null, propKey$jscomp$1;
        for (propKey$jscomp$1 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$1)) {
            var propValue$jscomp$1 = props[propKey$jscomp$1];
            if (null != propValue$jscomp$1)
              switch (propKey$jscomp$1) {
                case "children":
                  children$jscomp$1 = propValue$jscomp$1;
                  break;
                case "selected":
                  selected = propValue$jscomp$1;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML$jscomp$1 = propValue$jscomp$1;
                  break;
                case "value":
                  value = propValue$jscomp$1;
                default:
                  pushAttribute(
                    target$jscomp$0,
                    propKey$jscomp$1,
                    propValue$jscomp$1
                  );
              }
          }
        if (null != selectedValue) {
          var stringValue = null !== value ? "" + value : flattenOptionChildren(children$jscomp$1);
          if (isArrayImpl(selectedValue))
            for (var i = 0; i < selectedValue.length; i++) {
              if ("" + selectedValue[i] === stringValue) {
                target$jscomp$0.push(' selected=""');
                break;
              }
            }
          else
            "" + selectedValue === stringValue && target$jscomp$0.push(' selected=""');
        } else selected && target$jscomp$0.push(' selected=""');
        target$jscomp$0.push(">");
        pushInnerHTML(target$jscomp$0, innerHTML$jscomp$1, children$jscomp$1);
        return children$jscomp$1;
      case "textarea":
        target$jscomp$0.push(startChunkForTag("textarea"));
        var value$jscomp$0 = null, defaultValue = null, children$jscomp$2 = null, propKey$jscomp$2;
        for (propKey$jscomp$2 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$2)) {
            var propValue$jscomp$2 = props[propKey$jscomp$2];
            if (null != propValue$jscomp$2)
              switch (propKey$jscomp$2) {
                case "children":
                  children$jscomp$2 = propValue$jscomp$2;
                  break;
                case "value":
                  value$jscomp$0 = propValue$jscomp$2;
                  break;
                case "defaultValue":
                  defaultValue = propValue$jscomp$2;
                  break;
                case "dangerouslySetInnerHTML":
                  throw Error(formatProdErrorMessage(91));
                default:
                  pushAttribute(
                    target$jscomp$0,
                    propKey$jscomp$2,
                    propValue$jscomp$2
                  );
              }
          }
        null === value$jscomp$0 && null !== defaultValue && (value$jscomp$0 = defaultValue);
        target$jscomp$0.push(">");
        if (null != children$jscomp$2) {
          if (null != value$jscomp$0) throw Error(formatProdErrorMessage(92));
          if (isArrayImpl(children$jscomp$2)) {
            if (1 < children$jscomp$2.length)
              throw Error(formatProdErrorMessage(93));
            value$jscomp$0 = "" + children$jscomp$2[0];
          }
          value$jscomp$0 = "" + children$jscomp$2;
        }
        "string" === typeof value$jscomp$0 && "\n" === value$jscomp$0[0] && target$jscomp$0.push("\n");
        null !== value$jscomp$0 && target$jscomp$0.push(escapeTextForBrowser("" + value$jscomp$0));
        return null;
      case "input":
        target$jscomp$0.push(startChunkForTag("input"));
        var name = null, formAction = null, formEncType = null, formMethod = null, formTarget = null, value$jscomp$1 = null, defaultValue$jscomp$0 = null, checked = null, defaultChecked = null, propKey$jscomp$3;
        for (propKey$jscomp$3 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$3)) {
            var propValue$jscomp$3 = props[propKey$jscomp$3];
            if (null != propValue$jscomp$3)
              switch (propKey$jscomp$3) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(formatProdErrorMessage(399, "input"));
                case "name":
                  name = propValue$jscomp$3;
                  break;
                case "formAction":
                  formAction = propValue$jscomp$3;
                  break;
                case "formEncType":
                  formEncType = propValue$jscomp$3;
                  break;
                case "formMethod":
                  formMethod = propValue$jscomp$3;
                  break;
                case "formTarget":
                  formTarget = propValue$jscomp$3;
                  break;
                case "defaultChecked":
                  defaultChecked = propValue$jscomp$3;
                  break;
                case "defaultValue":
                  defaultValue$jscomp$0 = propValue$jscomp$3;
                  break;
                case "checked":
                  checked = propValue$jscomp$3;
                  break;
                case "value":
                  value$jscomp$1 = propValue$jscomp$3;
                  break;
                default:
                  pushAttribute(
                    target$jscomp$0,
                    propKey$jscomp$3,
                    propValue$jscomp$3
                  );
              }
          }
        var formData = pushFormActionAttribute(
          target$jscomp$0,
          resumableState,
          renderState,
          formAction,
          formEncType,
          formMethod,
          formTarget,
          name
        );
        null !== checked ? pushBooleanAttribute(target$jscomp$0, "checked", checked) : null !== defaultChecked && pushBooleanAttribute(target$jscomp$0, "checked", defaultChecked);
        null !== value$jscomp$1 ? pushAttribute(target$jscomp$0, "value", value$jscomp$1) : null !== defaultValue$jscomp$0 && pushAttribute(target$jscomp$0, "value", defaultValue$jscomp$0);
        target$jscomp$0.push("/>");
        null != formData && formData.forEach(pushAdditionalFormField, target$jscomp$0);
        return null;
      case "button":
        target$jscomp$0.push(startChunkForTag("button"));
        var children$jscomp$3 = null, innerHTML$jscomp$2 = null, name$jscomp$0 = null, formAction$jscomp$0 = null, formEncType$jscomp$0 = null, formMethod$jscomp$0 = null, formTarget$jscomp$0 = null, propKey$jscomp$4;
        for (propKey$jscomp$4 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$4)) {
            var propValue$jscomp$4 = props[propKey$jscomp$4];
            if (null != propValue$jscomp$4)
              switch (propKey$jscomp$4) {
                case "children":
                  children$jscomp$3 = propValue$jscomp$4;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML$jscomp$2 = propValue$jscomp$4;
                  break;
                case "name":
                  name$jscomp$0 = propValue$jscomp$4;
                  break;
                case "formAction":
                  formAction$jscomp$0 = propValue$jscomp$4;
                  break;
                case "formEncType":
                  formEncType$jscomp$0 = propValue$jscomp$4;
                  break;
                case "formMethod":
                  formMethod$jscomp$0 = propValue$jscomp$4;
                  break;
                case "formTarget":
                  formTarget$jscomp$0 = propValue$jscomp$4;
                  break;
                default:
                  pushAttribute(
                    target$jscomp$0,
                    propKey$jscomp$4,
                    propValue$jscomp$4
                  );
              }
          }
        var formData$jscomp$0 = pushFormActionAttribute(
          target$jscomp$0,
          resumableState,
          renderState,
          formAction$jscomp$0,
          formEncType$jscomp$0,
          formMethod$jscomp$0,
          formTarget$jscomp$0,
          name$jscomp$0
        );
        target$jscomp$0.push(">");
        null != formData$jscomp$0 && formData$jscomp$0.forEach(pushAdditionalFormField, target$jscomp$0);
        pushInnerHTML(target$jscomp$0, innerHTML$jscomp$2, children$jscomp$3);
        if ("string" === typeof children$jscomp$3) {
          target$jscomp$0.push(escapeTextForBrowser(children$jscomp$3));
          var JSCompiler_inline_result$jscomp$0 = null;
        } else JSCompiler_inline_result$jscomp$0 = children$jscomp$3;
        return JSCompiler_inline_result$jscomp$0;
      case "form":
        target$jscomp$0.push(startChunkForTag("form"));
        var children$jscomp$4 = null, innerHTML$jscomp$3 = null, formAction$jscomp$1 = null, formEncType$jscomp$1 = null, formMethod$jscomp$1 = null, formTarget$jscomp$1 = null, propKey$jscomp$5;
        for (propKey$jscomp$5 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$5)) {
            var propValue$jscomp$5 = props[propKey$jscomp$5];
            if (null != propValue$jscomp$5)
              switch (propKey$jscomp$5) {
                case "children":
                  children$jscomp$4 = propValue$jscomp$5;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML$jscomp$3 = propValue$jscomp$5;
                  break;
                case "action":
                  formAction$jscomp$1 = propValue$jscomp$5;
                  break;
                case "encType":
                  formEncType$jscomp$1 = propValue$jscomp$5;
                  break;
                case "method":
                  formMethod$jscomp$1 = propValue$jscomp$5;
                  break;
                case "target":
                  formTarget$jscomp$1 = propValue$jscomp$5;
                  break;
                default:
                  pushAttribute(
                    target$jscomp$0,
                    propKey$jscomp$5,
                    propValue$jscomp$5
                  );
              }
          }
        var formData$jscomp$1 = null, formActionName = null;
        if ("function" === typeof formAction$jscomp$1) {
          var customFields = getCustomFormFields(
            resumableState,
            formAction$jscomp$1
          );
          null !== customFields ? (formAction$jscomp$1 = customFields.action || "", formEncType$jscomp$1 = customFields.encType, formMethod$jscomp$1 = customFields.method, formTarget$jscomp$1 = customFields.target, formData$jscomp$1 = customFields.data, formActionName = customFields.name) : (target$jscomp$0.push(
            " ",
            "action",
            '="',
            actionJavaScriptURL,
            '"'
          ), formTarget$jscomp$1 = formMethod$jscomp$1 = formEncType$jscomp$1 = formAction$jscomp$1 = null, injectFormReplayingRuntime(resumableState, renderState));
        }
        null != formAction$jscomp$1 && pushAttribute(target$jscomp$0, "action", formAction$jscomp$1);
        null != formEncType$jscomp$1 && pushAttribute(target$jscomp$0, "encType", formEncType$jscomp$1);
        null != formMethod$jscomp$1 && pushAttribute(target$jscomp$0, "method", formMethod$jscomp$1);
        null != formTarget$jscomp$1 && pushAttribute(target$jscomp$0, "target", formTarget$jscomp$1);
        target$jscomp$0.push(">");
        null !== formActionName && (target$jscomp$0.push('<input type="hidden"'), pushStringAttribute(target$jscomp$0, "name", formActionName), target$jscomp$0.push("/>"), null != formData$jscomp$1 && formData$jscomp$1.forEach(pushAdditionalFormField, target$jscomp$0));
        pushInnerHTML(target$jscomp$0, innerHTML$jscomp$3, children$jscomp$4);
        if ("string" === typeof children$jscomp$4) {
          target$jscomp$0.push(escapeTextForBrowser(children$jscomp$4));
          var JSCompiler_inline_result$jscomp$1 = null;
        } else JSCompiler_inline_result$jscomp$1 = children$jscomp$4;
        return JSCompiler_inline_result$jscomp$1;
      case "menuitem":
        target$jscomp$0.push(startChunkForTag("menuitem"));
        for (var propKey$jscomp$6 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$6)) {
            var propValue$jscomp$6 = props[propKey$jscomp$6];
            if (null != propValue$jscomp$6)
              switch (propKey$jscomp$6) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(formatProdErrorMessage(400));
                default:
                  pushAttribute(
                    target$jscomp$0,
                    propKey$jscomp$6,
                    propValue$jscomp$6
                  );
              }
          }
        target$jscomp$0.push(">");
        return null;
      case "object":
        target$jscomp$0.push(startChunkForTag("object"));
        var children$jscomp$5 = null, innerHTML$jscomp$4 = null, propKey$jscomp$7;
        for (propKey$jscomp$7 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$7)) {
            var propValue$jscomp$7 = props[propKey$jscomp$7];
            if (null != propValue$jscomp$7)
              switch (propKey$jscomp$7) {
                case "children":
                  children$jscomp$5 = propValue$jscomp$7;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML$jscomp$4 = propValue$jscomp$7;
                  break;
                case "data":
                  var sanitizedValue = sanitizeURL("" + propValue$jscomp$7);
                  if ("" === sanitizedValue) break;
                  target$jscomp$0.push(
                    " ",
                    "data",
                    '="',
                    escapeTextForBrowser(sanitizedValue),
                    '"'
                  );
                  break;
                default:
                  pushAttribute(
                    target$jscomp$0,
                    propKey$jscomp$7,
                    propValue$jscomp$7
                  );
              }
          }
        target$jscomp$0.push(">");
        pushInnerHTML(target$jscomp$0, innerHTML$jscomp$4, children$jscomp$5);
        if ("string" === typeof children$jscomp$5) {
          target$jscomp$0.push(escapeTextForBrowser(children$jscomp$5));
          var JSCompiler_inline_result$jscomp$2 = null;
        } else JSCompiler_inline_result$jscomp$2 = children$jscomp$5;
        return JSCompiler_inline_result$jscomp$2;
      case "title":
        var noscriptTagInScope = formatContext.tagScope & 1, isFallback = formatContext.tagScope & 4;
        if (4 === formatContext.insertionMode || noscriptTagInScope || null != props.itemProp)
          var JSCompiler_inline_result$jscomp$3 = pushTitleImpl(
            target$jscomp$0,
            props
          );
        else
          isFallback ? JSCompiler_inline_result$jscomp$3 = null : (pushTitleImpl(renderState.hoistableChunks, props), JSCompiler_inline_result$jscomp$3 = void 0);
        return JSCompiler_inline_result$jscomp$3;
      case "link":
        var noscriptTagInScope$jscomp$0 = formatContext.tagScope & 1, isFallback$jscomp$0 = formatContext.tagScope & 4, rel = props.rel, href = props.href, precedence = props.precedence;
        if (4 === formatContext.insertionMode || noscriptTagInScope$jscomp$0 || null != props.itemProp || "string" !== typeof rel || "string" !== typeof href || "" === href) {
          pushLinkImpl(target$jscomp$0, props);
          var JSCompiler_inline_result$jscomp$4 = null;
        } else if ("stylesheet" === props.rel)
          if ("string" !== typeof precedence || null != props.disabled || props.onLoad || props.onError)
            JSCompiler_inline_result$jscomp$4 = pushLinkImpl(
              target$jscomp$0,
              props
            );
          else {
            var styleQueue = renderState.styles.get(precedence), resourceState = resumableState.styleResources.hasOwnProperty(href) ? resumableState.styleResources[href] : void 0;
            if (null !== resourceState) {
              resumableState.styleResources[href] = null;
              styleQueue || (styleQueue = {
                precedence: escapeTextForBrowser(precedence),
                rules: [],
                hrefs: [],
                sheets: /* @__PURE__ */ new Map()
              }, renderState.styles.set(precedence, styleQueue));
              var resource = {
                state: 0,
                props: assign({}, props, {
                  "data-precedence": props.precedence,
                  precedence: null
                })
              };
              if (resourceState) {
                2 === resourceState.length && adoptPreloadCredentials(resource.props, resourceState);
                var preloadResource = renderState.preloads.stylesheets.get(href);
                preloadResource && 0 < preloadResource.length ? preloadResource.length = 0 : resource.state = 1;
              }
              styleQueue.sheets.set(href, resource);
              hoistableState && hoistableState.stylesheets.add(resource);
            } else if (styleQueue) {
              var resource$9 = styleQueue.sheets.get(href);
              resource$9 && hoistableState && hoistableState.stylesheets.add(resource$9);
            }
            textEmbedded && target$jscomp$0.push("<!-- -->");
            JSCompiler_inline_result$jscomp$4 = null;
          }
        else
          props.onLoad || props.onError ? JSCompiler_inline_result$jscomp$4 = pushLinkImpl(
            target$jscomp$0,
            props
          ) : (textEmbedded && target$jscomp$0.push("<!-- -->"), JSCompiler_inline_result$jscomp$4 = isFallback$jscomp$0 ? null : pushLinkImpl(renderState.hoistableChunks, props));
        return JSCompiler_inline_result$jscomp$4;
      case "script":
        var noscriptTagInScope$jscomp$1 = formatContext.tagScope & 1, asyncProp = props.async;
        if ("string" !== typeof props.src || !props.src || !asyncProp || "function" === typeof asyncProp || "symbol" === typeof asyncProp || props.onLoad || props.onError || 4 === formatContext.insertionMode || noscriptTagInScope$jscomp$1 || null != props.itemProp)
          var JSCompiler_inline_result$jscomp$5 = pushScriptImpl(
            target$jscomp$0,
            props
          );
        else {
          var key = props.src;
          if ("module" === props.type) {
            var resources = resumableState.moduleScriptResources;
            var preloads = renderState.preloads.moduleScripts;
          } else
            resources = resumableState.scriptResources, preloads = renderState.preloads.scripts;
          var resourceState$jscomp$0 = resources.hasOwnProperty(key) ? resources[key] : void 0;
          if (null !== resourceState$jscomp$0) {
            resources[key] = null;
            var scriptProps = props;
            if (resourceState$jscomp$0) {
              2 === resourceState$jscomp$0.length && (scriptProps = assign({}, props), adoptPreloadCredentials(scriptProps, resourceState$jscomp$0));
              var preloadResource$jscomp$0 = preloads.get(key);
              preloadResource$jscomp$0 && (preloadResource$jscomp$0.length = 0);
            }
            var resource$jscomp$0 = [];
            renderState.scripts.add(resource$jscomp$0);
            pushScriptImpl(resource$jscomp$0, scriptProps);
          }
          textEmbedded && target$jscomp$0.push("<!-- -->");
          JSCompiler_inline_result$jscomp$5 = null;
        }
        return JSCompiler_inline_result$jscomp$5;
      case "style":
        var noscriptTagInScope$jscomp$2 = formatContext.tagScope & 1, precedence$jscomp$0 = props.precedence, href$jscomp$0 = props.href, nonce = props.nonce;
        if (4 === formatContext.insertionMode || noscriptTagInScope$jscomp$2 || null != props.itemProp || "string" !== typeof precedence$jscomp$0 || "string" !== typeof href$jscomp$0 || "" === href$jscomp$0) {
          target$jscomp$0.push(startChunkForTag("style"));
          var children$jscomp$6 = null, innerHTML$jscomp$5 = null, propKey$jscomp$8;
          for (propKey$jscomp$8 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$8)) {
              var propValue$jscomp$8 = props[propKey$jscomp$8];
              if (null != propValue$jscomp$8)
                switch (propKey$jscomp$8) {
                  case "children":
                    children$jscomp$6 = propValue$jscomp$8;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$5 = propValue$jscomp$8;
                    break;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$8,
                      propValue$jscomp$8
                    );
                }
            }
          target$jscomp$0.push(">");
          var child = Array.isArray(children$jscomp$6) ? 2 > children$jscomp$6.length ? children$jscomp$6[0] : null : children$jscomp$6;
          "function" !== typeof child && "symbol" !== typeof child && null !== child && void 0 !== child && target$jscomp$0.push(("" + child).replace(styleRegex, styleReplacer));
          pushInnerHTML(target$jscomp$0, innerHTML$jscomp$5, children$jscomp$6);
          target$jscomp$0.push(endChunkForTag("style"));
          var JSCompiler_inline_result$jscomp$6 = null;
        } else {
          var styleQueue$jscomp$0 = renderState.styles.get(precedence$jscomp$0);
          if (null !== (resumableState.styleResources.hasOwnProperty(href$jscomp$0) ? resumableState.styleResources[href$jscomp$0] : void 0)) {
            resumableState.styleResources[href$jscomp$0] = null;
            styleQueue$jscomp$0 || (styleQueue$jscomp$0 = {
              precedence: escapeTextForBrowser(precedence$jscomp$0),
              rules: [],
              hrefs: [],
              sheets: /* @__PURE__ */ new Map()
            }, renderState.styles.set(precedence$jscomp$0, styleQueue$jscomp$0));
            var nonceStyle = renderState.nonce.style;
            if (!nonceStyle || nonceStyle === nonce) {
              styleQueue$jscomp$0.hrefs.push(escapeTextForBrowser(href$jscomp$0));
              var target = styleQueue$jscomp$0.rules, children$jscomp$7 = null, innerHTML$jscomp$6 = null, propKey$jscomp$9;
              for (propKey$jscomp$9 in props)
                if (hasOwnProperty.call(props, propKey$jscomp$9)) {
                  var propValue$jscomp$9 = props[propKey$jscomp$9];
                  if (null != propValue$jscomp$9)
                    switch (propKey$jscomp$9) {
                      case "children":
                        children$jscomp$7 = propValue$jscomp$9;
                        break;
                      case "dangerouslySetInnerHTML":
                        innerHTML$jscomp$6 = propValue$jscomp$9;
                    }
                }
              var child$jscomp$0 = Array.isArray(children$jscomp$7) ? 2 > children$jscomp$7.length ? children$jscomp$7[0] : null : children$jscomp$7;
              "function" !== typeof child$jscomp$0 && "symbol" !== typeof child$jscomp$0 && null !== child$jscomp$0 && void 0 !== child$jscomp$0 && target.push(
                ("" + child$jscomp$0).replace(styleRegex, styleReplacer)
              );
              pushInnerHTML(target, innerHTML$jscomp$6, children$jscomp$7);
            }
          }
          styleQueue$jscomp$0 && hoistableState && hoistableState.styles.add(styleQueue$jscomp$0);
          textEmbedded && target$jscomp$0.push("<!-- -->");
          JSCompiler_inline_result$jscomp$6 = void 0;
        }
        return JSCompiler_inline_result$jscomp$6;
      case "meta":
        var noscriptTagInScope$jscomp$3 = formatContext.tagScope & 1, isFallback$jscomp$1 = formatContext.tagScope & 4;
        if (4 === formatContext.insertionMode || noscriptTagInScope$jscomp$3 || null != props.itemProp)
          var JSCompiler_inline_result$jscomp$7 = pushSelfClosing(
            target$jscomp$0,
            props,
            "meta"
          );
        else
          textEmbedded && target$jscomp$0.push("<!-- -->"), JSCompiler_inline_result$jscomp$7 = isFallback$jscomp$1 ? null : "string" === typeof props.charSet ? pushSelfClosing(renderState.charsetChunks, props, "meta") : "viewport" === props.name ? pushSelfClosing(renderState.viewportChunks, props, "meta") : pushSelfClosing(renderState.hoistableChunks, props, "meta");
        return JSCompiler_inline_result$jscomp$7;
      case "listing":
      case "pre":
        target$jscomp$0.push(startChunkForTag(type));
        var children$jscomp$8 = null, innerHTML$jscomp$7 = null, propKey$jscomp$10;
        for (propKey$jscomp$10 in props)
          if (hasOwnProperty.call(props, propKey$jscomp$10)) {
            var propValue$jscomp$10 = props[propKey$jscomp$10];
            if (null != propValue$jscomp$10)
              switch (propKey$jscomp$10) {
                case "children":
                  children$jscomp$8 = propValue$jscomp$10;
                  break;
                case "dangerouslySetInnerHTML":
                  innerHTML$jscomp$7 = propValue$jscomp$10;
                  break;
                default:
                  pushAttribute(
                    target$jscomp$0,
                    propKey$jscomp$10,
                    propValue$jscomp$10
                  );
              }
          }
        target$jscomp$0.push(">");
        if (null != innerHTML$jscomp$7) {
          if (null != children$jscomp$8) throw Error(formatProdErrorMessage(60));
          if ("object" !== typeof innerHTML$jscomp$7 || !("__html" in innerHTML$jscomp$7))
            throw Error(formatProdErrorMessage(61));
          var html = innerHTML$jscomp$7.__html;
          null !== html && void 0 !== html && ("string" === typeof html && 0 < html.length && "\n" === html[0] ? target$jscomp$0.push("\n", html) : target$jscomp$0.push("" + html));
        }
        "string" === typeof children$jscomp$8 && "\n" === children$jscomp$8[0] && target$jscomp$0.push("\n");
        return children$jscomp$8;
      case "img":
        var pictureOrNoScriptTagInScope = formatContext.tagScope & 3, src = props.src, srcSet = props.srcSet;
        if (!("lazy" === props.loading || !src && !srcSet || "string" !== typeof src && null != src || "string" !== typeof srcSet && null != srcSet || "low" === props.fetchPriority || pictureOrNoScriptTagInScope) && ("string" !== typeof src || ":" !== src[4] || "d" !== src[0] && "D" !== src[0] || "a" !== src[1] && "A" !== src[1] || "t" !== src[2] && "T" !== src[2] || "a" !== src[3] && "A" !== src[3]) && ("string" !== typeof srcSet || ":" !== srcSet[4] || "d" !== srcSet[0] && "D" !== srcSet[0] || "a" !== srcSet[1] && "A" !== srcSet[1] || "t" !== srcSet[2] && "T" !== srcSet[2] || "a" !== srcSet[3] && "A" !== srcSet[3])) {
          null !== hoistableState && formatContext.tagScope & 64 && (hoistableState.suspenseyImages = true);
          var sizes = "string" === typeof props.sizes ? props.sizes : void 0, key$jscomp$0 = srcSet ? srcSet + "\n" + (sizes || "") : src, promotablePreloads = renderState.preloads.images, resource$jscomp$1 = promotablePreloads.get(key$jscomp$0);
          if (resource$jscomp$1) {
            if ("high" === props.fetchPriority || 10 > renderState.highImagePreloads.size)
              promotablePreloads.delete(key$jscomp$0), renderState.highImagePreloads.add(resource$jscomp$1);
          } else if (!resumableState.imageResources.hasOwnProperty(key$jscomp$0)) {
            resumableState.imageResources[key$jscomp$0] = PRELOAD_NO_CREDS;
            var input = props.crossOrigin;
            var JSCompiler_inline_result$jscomp$8 = "string" === typeof input ? "use-credentials" === input ? input : "" : void 0;
            var headers = renderState.headers, header;
            headers && 0 < headers.remainingCapacity && "string" !== typeof props.srcSet && ("high" === props.fetchPriority || 500 > headers.highImagePreloads.length) && (header = getPreloadAsHeader(src, "image", {
              imageSrcSet: props.srcSet,
              imageSizes: props.sizes,
              crossOrigin: JSCompiler_inline_result$jscomp$8,
              integrity: props.integrity,
              nonce: props.nonce,
              type: props.type,
              fetchPriority: props.fetchPriority,
              referrerPolicy: props.refererPolicy
            }), 0 <= (headers.remainingCapacity -= header.length + 2)) ? (renderState.resets.image[key$jscomp$0] = PRELOAD_NO_CREDS, headers.highImagePreloads && (headers.highImagePreloads += ", "), headers.highImagePreloads += header) : (resource$jscomp$1 = [], pushLinkImpl(resource$jscomp$1, {
              rel: "preload",
              as: "image",
              href: srcSet ? void 0 : src,
              imageSrcSet: srcSet,
              imageSizes: sizes,
              crossOrigin: JSCompiler_inline_result$jscomp$8,
              integrity: props.integrity,
              type: props.type,
              fetchPriority: props.fetchPriority,
              referrerPolicy: props.referrerPolicy
            }), "high" === props.fetchPriority || 10 > renderState.highImagePreloads.size ? renderState.highImagePreloads.add(resource$jscomp$1) : (renderState.bulkPreloads.add(resource$jscomp$1), promotablePreloads.set(key$jscomp$0, resource$jscomp$1)));
          }
        }
        return pushSelfClosing(target$jscomp$0, props, "img");
      case "base":
      case "area":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "param":
      case "source":
      case "track":
      case "wbr":
        return pushSelfClosing(target$jscomp$0, props, type);
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        break;
      case "head":
        if (2 > formatContext.insertionMode) {
          var preamble = preambleState || renderState.preamble;
          if (preamble.headChunks)
            throw Error(formatProdErrorMessage(545, "`<head>`"));
          null !== preambleState && target$jscomp$0.push("<!--head-->");
          preamble.headChunks = [];
          var JSCompiler_inline_result$jscomp$9 = pushStartSingletonElement(
            preamble.headChunks,
            props,
            "head"
          );
        } else
          JSCompiler_inline_result$jscomp$9 = pushStartGenericElement(
            target$jscomp$0,
            props,
            "head"
          );
        return JSCompiler_inline_result$jscomp$9;
      case "body":
        if (2 > formatContext.insertionMode) {
          var preamble$jscomp$0 = preambleState || renderState.preamble;
          if (preamble$jscomp$0.bodyChunks)
            throw Error(formatProdErrorMessage(545, "`<body>`"));
          null !== preambleState && target$jscomp$0.push("<!--body-->");
          preamble$jscomp$0.bodyChunks = [];
          var JSCompiler_inline_result$jscomp$10 = pushStartSingletonElement(
            preamble$jscomp$0.bodyChunks,
            props,
            "body"
          );
        } else
          JSCompiler_inline_result$jscomp$10 = pushStartGenericElement(
            target$jscomp$0,
            props,
            "body"
          );
        return JSCompiler_inline_result$jscomp$10;
      case "html":
        if (0 === formatContext.insertionMode) {
          var preamble$jscomp$1 = preambleState || renderState.preamble;
          if (preamble$jscomp$1.htmlChunks)
            throw Error(formatProdErrorMessage(545, "`<html>`"));
          null !== preambleState && target$jscomp$0.push("<!--html-->");
          preamble$jscomp$1.htmlChunks = [""];
          var JSCompiler_inline_result$jscomp$11 = pushStartSingletonElement(
            preamble$jscomp$1.htmlChunks,
            props,
            "html"
          );
        } else
          JSCompiler_inline_result$jscomp$11 = pushStartGenericElement(
            target$jscomp$0,
            props,
            "html"
          );
        return JSCompiler_inline_result$jscomp$11;
      default:
        if (-1 !== type.indexOf("-")) {
          target$jscomp$0.push(startChunkForTag(type));
          var children$jscomp$9 = null, innerHTML$jscomp$8 = null, propKey$jscomp$11;
          for (propKey$jscomp$11 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$11)) {
              var propValue$jscomp$11 = props[propKey$jscomp$11];
              if (null != propValue$jscomp$11) {
                var attributeName = propKey$jscomp$11;
                switch (propKey$jscomp$11) {
                  case "children":
                    children$jscomp$9 = propValue$jscomp$11;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$8 = propValue$jscomp$11;
                    break;
                  case "style":
                    pushStyleAttribute(target$jscomp$0, propValue$jscomp$11);
                    break;
                  case "suppressContentEditableWarning":
                  case "suppressHydrationWarning":
                  case "ref":
                    break;
                  case "className":
                    attributeName = "class";
                  default:
                    if (isAttributeNameSafe(propKey$jscomp$11) && "function" !== typeof propValue$jscomp$11 && "symbol" !== typeof propValue$jscomp$11 && false !== propValue$jscomp$11) {
                      if (true === propValue$jscomp$11) propValue$jscomp$11 = "";
                      else if ("object" === typeof propValue$jscomp$11) continue;
                      target$jscomp$0.push(
                        " ",
                        attributeName,
                        '="',
                        escapeTextForBrowser(propValue$jscomp$11),
                        '"'
                      );
                    }
                }
              }
            }
          target$jscomp$0.push(">");
          pushInnerHTML(target$jscomp$0, innerHTML$jscomp$8, children$jscomp$9);
          return children$jscomp$9;
        }
    }
    return pushStartGenericElement(target$jscomp$0, props, type);
  }
  var endTagCache = /* @__PURE__ */ new Map();
  function endChunkForTag(tag) {
    var chunk = endTagCache.get(tag);
    void 0 === chunk && (chunk = "</" + tag + ">", endTagCache.set(tag, chunk));
    return chunk;
  }
  function hoistPreambleState(renderState, preambleState) {
    renderState = renderState.preamble;
    null === renderState.htmlChunks && preambleState.htmlChunks && (renderState.htmlChunks = preambleState.htmlChunks);
    null === renderState.headChunks && preambleState.headChunks && (renderState.headChunks = preambleState.headChunks);
    null === renderState.bodyChunks && preambleState.bodyChunks && (renderState.bodyChunks = preambleState.bodyChunks);
  }
  function writeBootstrap(destination, renderState) {
    renderState = renderState.bootstrapChunks;
    for (var i = 0; i < renderState.length - 1; i++)
      destination.push(renderState[i]);
    return i < renderState.length ? (i = renderState[i], renderState.length = 0, destination.push(i)) : true;
  }
  function writeStartPendingSuspenseBoundary(destination, renderState, id) {
    destination.push('<!--$?--><template id="');
    if (null === id) throw Error(formatProdErrorMessage(395));
    destination.push(renderState.boundaryPrefix);
    renderState = id.toString(16);
    destination.push(renderState);
    return destination.push('"></template>');
  }
  function writeStartSegment(destination, renderState, formatContext, id) {
    switch (formatContext.insertionMode) {
      case 0:
      case 1:
      case 3:
      case 2:
        return destination.push('<div hidden id="'), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push('">');
      case 4:
        return destination.push('<svg aria-hidden="true" style="display:none" id="'), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push('">');
      case 5:
        return destination.push('<math aria-hidden="true" style="display:none" id="'), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push('">');
      case 6:
        return destination.push('<table hidden id="'), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push('">');
      case 7:
        return destination.push('<table hidden><tbody id="'), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push('">');
      case 8:
        return destination.push('<table hidden><tr id="'), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push('">');
      case 9:
        return destination.push('<table hidden><colgroup id="'), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push('">');
      default:
        throw Error(formatProdErrorMessage(397));
    }
  }
  function writeEndSegment(destination, formatContext) {
    switch (formatContext.insertionMode) {
      case 0:
      case 1:
      case 3:
      case 2:
        return destination.push("</div>");
      case 4:
        return destination.push("</svg>");
      case 5:
        return destination.push("</math>");
      case 6:
        return destination.push("</table>");
      case 7:
        return destination.push("</tbody></table>");
      case 8:
        return destination.push("</tr></table>");
      case 9:
        return destination.push("</colgroup></table>");
      default:
        throw Error(formatProdErrorMessage(397));
    }
  }
  var regexForJSStringsInInstructionScripts = /[<\u2028\u2029]/g;
  function escapeJSStringsForInstructionScripts(input) {
    return JSON.stringify(input).replace(
      regexForJSStringsInInstructionScripts,
      function(match) {
        switch (match) {
          case "<":
            return "\\u003c";
          case "\u2028":
            return "\\u2028";
          case "\u2029":
            return "\\u2029";
          default:
            throw Error(
              "escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
            );
        }
      }
    );
  }
  var regexForJSStringsInScripts = /[&><\u2028\u2029]/g;
  function escapeJSObjectForInstructionScripts(input) {
    return JSON.stringify(input).replace(
      regexForJSStringsInScripts,
      function(match) {
        switch (match) {
          case "&":
            return "\\u0026";
          case ">":
            return "\\u003e";
          case "<":
            return "\\u003c";
          case "\u2028":
            return "\\u2028";
          case "\u2029":
            return "\\u2029";
          default:
            throw Error(
              "escapeJSObjectForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
            );
        }
      }
    );
  }
  var currentlyRenderingBoundaryHasStylesToHoist = false, destinationHasCapacity = true;
  function flushStyleTagsLateForBoundary(styleQueue) {
    var rules = styleQueue.rules, hrefs = styleQueue.hrefs, i = 0;
    if (hrefs.length) {
      this.push(currentlyFlushingRenderState.startInlineStyle);
      this.push(' media="not all" data-precedence="');
      this.push(styleQueue.precedence);
      for (this.push('" data-href="'); i < hrefs.length - 1; i++)
        this.push(hrefs[i]), this.push(" ");
      this.push(hrefs[i]);
      this.push('">');
      for (i = 0; i < rules.length; i++) this.push(rules[i]);
      destinationHasCapacity = this.push("</style>");
      currentlyRenderingBoundaryHasStylesToHoist = true;
      rules.length = 0;
      hrefs.length = 0;
    }
  }
  function hasStylesToHoist(stylesheet) {
    return 2 !== stylesheet.state ? currentlyRenderingBoundaryHasStylesToHoist = true : false;
  }
  function writeHoistablesForBoundary(destination, hoistableState, renderState) {
    currentlyRenderingBoundaryHasStylesToHoist = false;
    destinationHasCapacity = true;
    currentlyFlushingRenderState = renderState;
    hoistableState.styles.forEach(flushStyleTagsLateForBoundary, destination);
    currentlyFlushingRenderState = null;
    hoistableState.stylesheets.forEach(hasStylesToHoist);
    currentlyRenderingBoundaryHasStylesToHoist && (renderState.stylesToHoist = true);
    return destinationHasCapacity;
  }
  function flushResource(resource) {
    for (var i = 0; i < resource.length; i++) this.push(resource[i]);
    resource.length = 0;
  }
  var stylesheetFlushingQueue = [];
  function flushStyleInPreamble(stylesheet) {
    pushLinkImpl(stylesheetFlushingQueue, stylesheet.props);
    for (var i = 0; i < stylesheetFlushingQueue.length; i++)
      this.push(stylesheetFlushingQueue[i]);
    stylesheetFlushingQueue.length = 0;
    stylesheet.state = 2;
  }
  function flushStylesInPreamble(styleQueue) {
    var hasStylesheets = 0 < styleQueue.sheets.size;
    styleQueue.sheets.forEach(flushStyleInPreamble, this);
    styleQueue.sheets.clear();
    var rules = styleQueue.rules, hrefs = styleQueue.hrefs;
    if (!hasStylesheets || hrefs.length) {
      this.push(currentlyFlushingRenderState.startInlineStyle);
      this.push(' data-precedence="');
      this.push(styleQueue.precedence);
      styleQueue = 0;
      if (hrefs.length) {
        for (this.push('" data-href="'); styleQueue < hrefs.length - 1; styleQueue++)
          this.push(hrefs[styleQueue]), this.push(" ");
        this.push(hrefs[styleQueue]);
      }
      this.push('">');
      for (styleQueue = 0; styleQueue < rules.length; styleQueue++)
        this.push(rules[styleQueue]);
      this.push("</style>");
      rules.length = 0;
      hrefs.length = 0;
    }
  }
  function preloadLateStyle(stylesheet) {
    if (0 === stylesheet.state) {
      stylesheet.state = 1;
      var props = stylesheet.props;
      pushLinkImpl(stylesheetFlushingQueue, {
        rel: "preload",
        as: "style",
        href: stylesheet.props.href,
        crossOrigin: props.crossOrigin,
        fetchPriority: props.fetchPriority,
        integrity: props.integrity,
        media: props.media,
        hrefLang: props.hrefLang,
        referrerPolicy: props.referrerPolicy
      });
      for (stylesheet = 0; stylesheet < stylesheetFlushingQueue.length; stylesheet++)
        this.push(stylesheetFlushingQueue[stylesheet]);
      stylesheetFlushingQueue.length = 0;
    }
  }
  function preloadLateStyles(styleQueue) {
    styleQueue.sheets.forEach(preloadLateStyle, this);
    styleQueue.sheets.clear();
  }
  function pushCompletedShellIdAttribute(target, resumableState) {
    0 === (resumableState.instructions & 32) && (resumableState.instructions |= 32, target.push(
      ' id="',
      escapeTextForBrowser("_" + resumableState.idPrefix + "R_"),
      '"'
    ));
  }
  function writeStyleResourceDependenciesInJS(destination, hoistableState) {
    destination.push("[");
    var nextArrayOpenBrackChunk = "[";
    hoistableState.stylesheets.forEach(function(resource) {
      if (2 !== resource.state)
        if (3 === resource.state)
          destination.push(nextArrayOpenBrackChunk), resource = escapeJSObjectForInstructionScripts(
            "" + resource.props.href
          ), destination.push(resource), destination.push("]"), nextArrayOpenBrackChunk = ",[";
        else {
          destination.push(nextArrayOpenBrackChunk);
          var precedence = resource.props["data-precedence"], props = resource.props, coercedHref = sanitizeURL("" + resource.props.href);
          coercedHref = escapeJSObjectForInstructionScripts(coercedHref);
          destination.push(coercedHref);
          precedence = "" + precedence;
          destination.push(",");
          precedence = escapeJSObjectForInstructionScripts(precedence);
          destination.push(precedence);
          for (var propKey in props)
            if (hasOwnProperty.call(props, propKey) && (precedence = props[propKey], null != precedence))
              switch (propKey) {
                case "href":
                case "rel":
                case "precedence":
                case "data-precedence":
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(formatProdErrorMessage(399, "link"));
                default:
                  writeStyleResourceAttributeInJS(
                    destination,
                    propKey,
                    precedence
                  );
              }
          destination.push("]");
          nextArrayOpenBrackChunk = ",[";
          resource.state = 3;
        }
    });
    destination.push("]");
  }
  function writeStyleResourceAttributeInJS(destination, name, value) {
    var attributeName = name.toLowerCase();
    switch (typeof value) {
      case "function":
      case "symbol":
        return;
    }
    switch (name) {
      case "innerHTML":
      case "dangerouslySetInnerHTML":
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "style":
      case "ref":
        return;
      case "className":
        attributeName = "class";
        name = "" + value;
        break;
      case "hidden":
        if (false === value) return;
        name = "";
        break;
      case "src":
      case "href":
        value = sanitizeURL(value);
        name = "" + value;
        break;
      default:
        if (2 < name.length && ("o" === name[0] || "O" === name[0]) && ("n" === name[1] || "N" === name[1]) || !isAttributeNameSafe(name))
          return;
        name = "" + value;
    }
    destination.push(",");
    attributeName = escapeJSObjectForInstructionScripts(attributeName);
    destination.push(attributeName);
    destination.push(",");
    attributeName = escapeJSObjectForInstructionScripts(name);
    destination.push(attributeName);
  }
  function createHoistableState() {
    return { styles: /* @__PURE__ */ new Set(), stylesheets: /* @__PURE__ */ new Set(), suspenseyImages: false };
  }
  function prefetchDNS(href) {
    var request = currentRequest ? currentRequest : null;
    if (request) {
      var resumableState = request.resumableState, renderState = request.renderState;
      if ("string" === typeof href && href) {
        if (!resumableState.dnsResources.hasOwnProperty(href)) {
          resumableState.dnsResources[href] = null;
          resumableState = renderState.headers;
          var header, JSCompiler_temp;
          if (JSCompiler_temp = resumableState && 0 < resumableState.remainingCapacity)
            JSCompiler_temp = (header = "<" + ("" + href).replace(
              regexForHrefInLinkHeaderURLContext,
              escapeHrefForLinkHeaderURLContextReplacer
            ) + ">; rel=dns-prefetch", 0 <= (resumableState.remainingCapacity -= header.length + 2));
          JSCompiler_temp ? (renderState.resets.dns[href] = null, resumableState.preconnects && (resumableState.preconnects += ", "), resumableState.preconnects += header) : (header = [], pushLinkImpl(header, { href, rel: "dns-prefetch" }), renderState.preconnects.add(header));
        }
        enqueueFlush(request);
      }
    } else previousDispatcher.D(href);
  }
  function preconnect(href, crossOrigin) {
    var request = currentRequest ? currentRequest : null;
    if (request) {
      var resumableState = request.resumableState, renderState = request.renderState;
      if ("string" === typeof href && href) {
        var bucket = "use-credentials" === crossOrigin ? "credentials" : "string" === typeof crossOrigin ? "anonymous" : "default";
        if (!resumableState.connectResources[bucket].hasOwnProperty(href)) {
          resumableState.connectResources[bucket][href] = null;
          resumableState = renderState.headers;
          var header, JSCompiler_temp;
          if (JSCompiler_temp = resumableState && 0 < resumableState.remainingCapacity) {
            JSCompiler_temp = "<" + ("" + href).replace(
              regexForHrefInLinkHeaderURLContext,
              escapeHrefForLinkHeaderURLContextReplacer
            ) + ">; rel=preconnect";
            if ("string" === typeof crossOrigin) {
              var escapedCrossOrigin = ("" + crossOrigin).replace(
                regexForLinkHeaderQuotedParamValueContext,
                escapeStringForLinkHeaderQuotedParamValueContextReplacer
              );
              JSCompiler_temp += '; crossorigin="' + escapedCrossOrigin + '"';
            }
            JSCompiler_temp = (header = JSCompiler_temp, 0 <= (resumableState.remainingCapacity -= header.length + 2));
          }
          JSCompiler_temp ? (renderState.resets.connect[bucket][href] = null, resumableState.preconnects && (resumableState.preconnects += ", "), resumableState.preconnects += header) : (bucket = [], pushLinkImpl(bucket, {
            rel: "preconnect",
            href,
            crossOrigin
          }), renderState.preconnects.add(bucket));
        }
        enqueueFlush(request);
      }
    } else previousDispatcher.C(href, crossOrigin);
  }
  function preload(href, as, options) {
    var request = currentRequest ? currentRequest : null;
    if (request) {
      var resumableState = request.resumableState, renderState = request.renderState;
      if (as && href) {
        switch (as) {
          case "image":
            if (options) {
              var imageSrcSet = options.imageSrcSet;
              var imageSizes = options.imageSizes;
              var fetchPriority = options.fetchPriority;
            }
            var key = imageSrcSet ? imageSrcSet + "\n" + (imageSizes || "") : href;
            if (resumableState.imageResources.hasOwnProperty(key)) return;
            resumableState.imageResources[key] = PRELOAD_NO_CREDS;
            resumableState = renderState.headers;
            var header;
            resumableState && 0 < resumableState.remainingCapacity && "string" !== typeof imageSrcSet && "high" === fetchPriority && (header = getPreloadAsHeader(href, as, options), 0 <= (resumableState.remainingCapacity -= header.length + 2)) ? (renderState.resets.image[key] = PRELOAD_NO_CREDS, resumableState.highImagePreloads && (resumableState.highImagePreloads += ", "), resumableState.highImagePreloads += header) : (resumableState = [], pushLinkImpl(
              resumableState,
              assign(
                { rel: "preload", href: imageSrcSet ? void 0 : href, as },
                options
              )
            ), "high" === fetchPriority ? renderState.highImagePreloads.add(resumableState) : (renderState.bulkPreloads.add(resumableState), renderState.preloads.images.set(key, resumableState)));
            break;
          case "style":
            if (resumableState.styleResources.hasOwnProperty(href)) return;
            imageSrcSet = [];
            pushLinkImpl(
              imageSrcSet,
              assign({ rel: "preload", href, as }, options)
            );
            resumableState.styleResources[href] = !options || "string" !== typeof options.crossOrigin && "string" !== typeof options.integrity ? PRELOAD_NO_CREDS : [options.crossOrigin, options.integrity];
            renderState.preloads.stylesheets.set(href, imageSrcSet);
            renderState.bulkPreloads.add(imageSrcSet);
            break;
          case "script":
            if (resumableState.scriptResources.hasOwnProperty(href)) return;
            imageSrcSet = [];
            renderState.preloads.scripts.set(href, imageSrcSet);
            renderState.bulkPreloads.add(imageSrcSet);
            pushLinkImpl(
              imageSrcSet,
              assign({ rel: "preload", href, as }, options)
            );
            resumableState.scriptResources[href] = !options || "string" !== typeof options.crossOrigin && "string" !== typeof options.integrity ? PRELOAD_NO_CREDS : [options.crossOrigin, options.integrity];
            break;
          default:
            if (resumableState.unknownResources.hasOwnProperty(as)) {
              if (imageSrcSet = resumableState.unknownResources[as], imageSrcSet.hasOwnProperty(href))
                return;
            } else
              imageSrcSet = {}, resumableState.unknownResources[as] = imageSrcSet;
            imageSrcSet[href] = PRELOAD_NO_CREDS;
            if ((resumableState = renderState.headers) && 0 < resumableState.remainingCapacity && "font" === as && (key = getPreloadAsHeader(href, as, options), 0 <= (resumableState.remainingCapacity -= key.length + 2)))
              renderState.resets.font[href] = PRELOAD_NO_CREDS, resumableState.fontPreloads && (resumableState.fontPreloads += ", "), resumableState.fontPreloads += key;
            else
              switch (resumableState = [], href = assign({ rel: "preload", href, as }, options), pushLinkImpl(resumableState, href), as) {
                case "font":
                  renderState.fontPreloads.add(resumableState);
                  break;
                default:
                  renderState.bulkPreloads.add(resumableState);
              }
        }
        enqueueFlush(request);
      }
    } else previousDispatcher.L(href, as, options);
  }
  function preloadModule(href, options) {
    var request = currentRequest ? currentRequest : null;
    if (request) {
      var resumableState = request.resumableState, renderState = request.renderState;
      if (href) {
        var as = options && "string" === typeof options.as ? options.as : "script";
        switch (as) {
          case "script":
            if (resumableState.moduleScriptResources.hasOwnProperty(href)) return;
            as = [];
            resumableState.moduleScriptResources[href] = !options || "string" !== typeof options.crossOrigin && "string" !== typeof options.integrity ? PRELOAD_NO_CREDS : [options.crossOrigin, options.integrity];
            renderState.preloads.moduleScripts.set(href, as);
            break;
          default:
            if (resumableState.moduleUnknownResources.hasOwnProperty(as)) {
              var resources = resumableState.unknownResources[as];
              if (resources.hasOwnProperty(href)) return;
            } else
              resources = {}, resumableState.moduleUnknownResources[as] = resources;
            as = [];
            resources[href] = PRELOAD_NO_CREDS;
        }
        pushLinkImpl(as, assign({ rel: "modulepreload", href }, options));
        renderState.bulkPreloads.add(as);
        enqueueFlush(request);
      }
    } else previousDispatcher.m(href, options);
  }
  function preinitStyle(href, precedence, options) {
    var request = currentRequest ? currentRequest : null;
    if (request) {
      var resumableState = request.resumableState, renderState = request.renderState;
      if (href) {
        precedence = precedence || "default";
        var styleQueue = renderState.styles.get(precedence), resourceState = resumableState.styleResources.hasOwnProperty(href) ? resumableState.styleResources[href] : void 0;
        null !== resourceState && (resumableState.styleResources[href] = null, styleQueue || (styleQueue = {
          precedence: escapeTextForBrowser(precedence),
          rules: [],
          hrefs: [],
          sheets: /* @__PURE__ */ new Map()
        }, renderState.styles.set(precedence, styleQueue)), precedence = {
          state: 0,
          props: assign(
            { rel: "stylesheet", href, "data-precedence": precedence },
            options
          )
        }, resourceState && (2 === resourceState.length && adoptPreloadCredentials(precedence.props, resourceState), (renderState = renderState.preloads.stylesheets.get(href)) && 0 < renderState.length ? renderState.length = 0 : precedence.state = 1), styleQueue.sheets.set(href, precedence), enqueueFlush(request));
      }
    } else previousDispatcher.S(href, precedence, options);
  }
  function preinitScript(src, options) {
    var request = currentRequest ? currentRequest : null;
    if (request) {
      var resumableState = request.resumableState, renderState = request.renderState;
      if (src) {
        var resourceState = resumableState.scriptResources.hasOwnProperty(src) ? resumableState.scriptResources[src] : void 0;
        null !== resourceState && (resumableState.scriptResources[src] = null, options = assign({ src, async: true }, options), resourceState && (2 === resourceState.length && adoptPreloadCredentials(options, resourceState), src = renderState.preloads.scripts.get(src)) && (src.length = 0), src = [], renderState.scripts.add(src), pushScriptImpl(src, options), enqueueFlush(request));
      }
    } else previousDispatcher.X(src, options);
  }
  function preinitModuleScript(src, options) {
    var request = currentRequest ? currentRequest : null;
    if (request) {
      var resumableState = request.resumableState, renderState = request.renderState;
      if (src) {
        var resourceState = resumableState.moduleScriptResources.hasOwnProperty(
          src
        ) ? resumableState.moduleScriptResources[src] : void 0;
        null !== resourceState && (resumableState.moduleScriptResources[src] = null, options = assign({ src, type: "module", async: true }, options), resourceState && (2 === resourceState.length && adoptPreloadCredentials(options, resourceState), src = renderState.preloads.moduleScripts.get(src)) && (src.length = 0), src = [], renderState.scripts.add(src), pushScriptImpl(src, options), enqueueFlush(request));
      }
    } else previousDispatcher.M(src, options);
  }
  function adoptPreloadCredentials(target, preloadState) {
    null == target.crossOrigin && (target.crossOrigin = preloadState[0]);
    null == target.integrity && (target.integrity = preloadState[1]);
  }
  function getPreloadAsHeader(href, as, params) {
    href = ("" + href).replace(
      regexForHrefInLinkHeaderURLContext,
      escapeHrefForLinkHeaderURLContextReplacer
    );
    as = ("" + as).replace(
      regexForLinkHeaderQuotedParamValueContext,
      escapeStringForLinkHeaderQuotedParamValueContextReplacer
    );
    as = "<" + href + '>; rel=preload; as="' + as + '"';
    for (var paramName in params)
      hasOwnProperty.call(params, paramName) && (href = params[paramName], "string" === typeof href && (as += "; " + paramName.toLowerCase() + '="' + ("" + href).replace(
        regexForLinkHeaderQuotedParamValueContext,
        escapeStringForLinkHeaderQuotedParamValueContextReplacer
      ) + '"'));
    return as;
  }
  var regexForHrefInLinkHeaderURLContext = /[<>\r\n]/g;
  function escapeHrefForLinkHeaderURLContextReplacer(match) {
    switch (match) {
      case "<":
        return "%3C";
      case ">":
        return "%3E";
      case "\n":
        return "%0A";
      case "\r":
        return "%0D";
      default:
        throw Error(
          "escapeLinkHrefForHeaderContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
        );
    }
  }
  var regexForLinkHeaderQuotedParamValueContext = /["';,\r\n]/g;
  function escapeStringForLinkHeaderQuotedParamValueContextReplacer(match) {
    switch (match) {
      case '"':
        return "%22";
      case "'":
        return "%27";
      case ";":
        return "%3B";
      case ",":
        return "%2C";
      case "\n":
        return "%0A";
      case "\r":
        return "%0D";
      default:
        throw Error(
          "escapeStringForLinkHeaderQuotedParamValueContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
        );
    }
  }
  function hoistStyleQueueDependency(styleQueue) {
    this.styles.add(styleQueue);
  }
  function hoistStylesheetDependency(stylesheet) {
    this.stylesheets.add(stylesheet);
  }
  function hoistHoistables(parentState, childState) {
    childState.styles.forEach(hoistStyleQueueDependency, parentState);
    childState.stylesheets.forEach(hoistStylesheetDependency, parentState);
    childState.suspenseyImages && (parentState.suspenseyImages = true);
  }
  function createRenderState(resumableState, generateStaticMarkup) {
    var idPrefix = resumableState.idPrefix, bootstrapChunks = [], bootstrapScriptContent = resumableState.bootstrapScriptContent, bootstrapScripts = resumableState.bootstrapScripts, bootstrapModules = resumableState.bootstrapModules;
    void 0 !== bootstrapScriptContent && (bootstrapChunks.push("<script"), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(
      ">",
      ("" + bootstrapScriptContent).replace(scriptRegex, scriptReplacer),
      "<\/script>"
    ));
    bootstrapScriptContent = idPrefix + "P:";
    var JSCompiler_object_inline_segmentPrefix_1673 = idPrefix + "S:";
    idPrefix += "B:";
    var JSCompiler_object_inline_preconnects_1687 = /* @__PURE__ */ new Set(), JSCompiler_object_inline_fontPreloads_1688 = /* @__PURE__ */ new Set(), JSCompiler_object_inline_highImagePreloads_1689 = /* @__PURE__ */ new Set(), JSCompiler_object_inline_styles_1690 = /* @__PURE__ */ new Map(), JSCompiler_object_inline_bootstrapScripts_1691 = /* @__PURE__ */ new Set(), JSCompiler_object_inline_scripts_1692 = /* @__PURE__ */ new Set(), JSCompiler_object_inline_bulkPreloads_1693 = /* @__PURE__ */ new Set(), JSCompiler_object_inline_preloads_1694 = {
      images: /* @__PURE__ */ new Map(),
      stylesheets: /* @__PURE__ */ new Map(),
      scripts: /* @__PURE__ */ new Map(),
      moduleScripts: /* @__PURE__ */ new Map()
    };
    if (void 0 !== bootstrapScripts)
      for (var i = 0; i < bootstrapScripts.length; i++) {
        var scriptConfig = bootstrapScripts[i], src, crossOrigin = void 0, integrity = void 0, props = {
          rel: "preload",
          as: "script",
          fetchPriority: "low",
          nonce: void 0
        };
        "string" === typeof scriptConfig ? props.href = src = scriptConfig : (props.href = src = scriptConfig.src, props.integrity = integrity = "string" === typeof scriptConfig.integrity ? scriptConfig.integrity : void 0, props.crossOrigin = crossOrigin = "string" === typeof scriptConfig || null == scriptConfig.crossOrigin ? void 0 : "use-credentials" === scriptConfig.crossOrigin ? "use-credentials" : "");
        scriptConfig = resumableState;
        var href = src;
        scriptConfig.scriptResources[href] = null;
        scriptConfig.moduleScriptResources[href] = null;
        scriptConfig = [];
        pushLinkImpl(scriptConfig, props);
        JSCompiler_object_inline_bootstrapScripts_1691.add(scriptConfig);
        bootstrapChunks.push('<script src="', escapeTextForBrowser(src), '"');
        "string" === typeof integrity && bootstrapChunks.push(
          ' integrity="',
          escapeTextForBrowser(integrity),
          '"'
        );
        "string" === typeof crossOrigin && bootstrapChunks.push(
          ' crossorigin="',
          escapeTextForBrowser(crossOrigin),
          '"'
        );
        pushCompletedShellIdAttribute(bootstrapChunks, resumableState);
        bootstrapChunks.push(' async=""><\/script>');
      }
    if (void 0 !== bootstrapModules)
      for (bootstrapScripts = 0; bootstrapScripts < bootstrapModules.length; bootstrapScripts++)
        props = bootstrapModules[bootstrapScripts], crossOrigin = src = void 0, integrity = {
          rel: "modulepreload",
          fetchPriority: "low",
          nonce: void 0
        }, "string" === typeof props ? integrity.href = i = props : (integrity.href = i = props.src, integrity.integrity = crossOrigin = "string" === typeof props.integrity ? props.integrity : void 0, integrity.crossOrigin = src = "string" === typeof props || null == props.crossOrigin ? void 0 : "use-credentials" === props.crossOrigin ? "use-credentials" : ""), props = resumableState, scriptConfig = i, props.scriptResources[scriptConfig] = null, props.moduleScriptResources[scriptConfig] = null, props = [], pushLinkImpl(props, integrity), JSCompiler_object_inline_bootstrapScripts_1691.add(props), bootstrapChunks.push(
          '<script type="module" src="',
          escapeTextForBrowser(i),
          '"'
        ), "string" === typeof crossOrigin && bootstrapChunks.push(
          ' integrity="',
          escapeTextForBrowser(crossOrigin),
          '"'
        ), "string" === typeof src && bootstrapChunks.push(
          ' crossorigin="',
          escapeTextForBrowser(src),
          '"'
        ), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(' async=""><\/script>');
    return {
      placeholderPrefix: bootstrapScriptContent,
      segmentPrefix: JSCompiler_object_inline_segmentPrefix_1673,
      boundaryPrefix: idPrefix,
      startInlineScript: "<script",
      startInlineStyle: "<style",
      preamble: { htmlChunks: null, headChunks: null, bodyChunks: null },
      externalRuntimeScript: null,
      bootstrapChunks,
      importMapChunks: [],
      onHeaders: void 0,
      headers: null,
      resets: {
        font: {},
        dns: {},
        connect: { default: {}, anonymous: {}, credentials: {} },
        image: {},
        style: {}
      },
      charsetChunks: [],
      viewportChunks: [],
      hoistableChunks: [],
      preconnects: JSCompiler_object_inline_preconnects_1687,
      fontPreloads: JSCompiler_object_inline_fontPreloads_1688,
      highImagePreloads: JSCompiler_object_inline_highImagePreloads_1689,
      styles: JSCompiler_object_inline_styles_1690,
      bootstrapScripts: JSCompiler_object_inline_bootstrapScripts_1691,
      scripts: JSCompiler_object_inline_scripts_1692,
      bulkPreloads: JSCompiler_object_inline_bulkPreloads_1693,
      preloads: JSCompiler_object_inline_preloads_1694,
      nonce: { script: void 0, style: void 0 },
      stylesToHoist: false,
      generateStaticMarkup
    };
  }
  function pushTextInstance(target, text, renderState, textEmbedded) {
    if (renderState.generateStaticMarkup)
      return target.push(escapeTextForBrowser(text)), false;
    "" === text ? target = textEmbedded : (textEmbedded && target.push("<!-- -->"), target.push(escapeTextForBrowser(text)), target = true);
    return target;
  }
  function pushSegmentFinale(target, renderState, lastPushedText, textEmbedded) {
    renderState.generateStaticMarkup || lastPushedText && textEmbedded && target.push("<!-- -->");
  }
  var bind = Function.prototype.bind, REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference");
  function getComponentNameFromType(type) {
    if (null == type) return null;
    if ("function" === typeof type)
      return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
    if ("string" === typeof type) return type;
    switch (type) {
      case REACT_FRAGMENT_TYPE:
        return "Fragment";
      case REACT_PROFILER_TYPE:
        return "Profiler";
      case REACT_STRICT_MODE_TYPE:
        return "StrictMode";
      case REACT_SUSPENSE_TYPE:
        return "Suspense";
      case REACT_SUSPENSE_LIST_TYPE:
        return "SuspenseList";
      case REACT_ACTIVITY_TYPE:
        return "Activity";
    }
    if ("object" === typeof type)
      switch (type.$$typeof) {
        case REACT_PORTAL_TYPE:
          return "Portal";
        case REACT_CONTEXT_TYPE:
          return type.displayName || "Context";
        case REACT_CONSUMER_TYPE:
          return (type._context.displayName || "Context") + ".Consumer";
        case REACT_FORWARD_REF_TYPE:
          var innerType = type.render;
          type = type.displayName;
          type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
          return type;
        case REACT_MEMO_TYPE:
          return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
        case REACT_LAZY_TYPE:
          innerType = type._payload;
          type = type._init;
          try {
            return getComponentNameFromType(type(innerType));
          } catch (x) {
          }
      }
    return null;
  }
  var emptyContextObject = {}, currentActiveSnapshot = null;
  function popToNearestCommonAncestor(prev, next) {
    if (prev !== next) {
      prev.context._currentValue2 = prev.parentValue;
      prev = prev.parent;
      var parentNext = next.parent;
      if (null === prev) {
        if (null !== parentNext) throw Error(formatProdErrorMessage(401));
      } else {
        if (null === parentNext) throw Error(formatProdErrorMessage(401));
        popToNearestCommonAncestor(prev, parentNext);
      }
      next.context._currentValue2 = next.value;
    }
  }
  function popAllPrevious(prev) {
    prev.context._currentValue2 = prev.parentValue;
    prev = prev.parent;
    null !== prev && popAllPrevious(prev);
  }
  function pushAllNext(next) {
    var parentNext = next.parent;
    null !== parentNext && pushAllNext(parentNext);
    next.context._currentValue2 = next.value;
  }
  function popPreviousToCommonLevel(prev, next) {
    prev.context._currentValue2 = prev.parentValue;
    prev = prev.parent;
    if (null === prev) throw Error(formatProdErrorMessage(402));
    prev.depth === next.depth ? popToNearestCommonAncestor(prev, next) : popPreviousToCommonLevel(prev, next);
  }
  function popNextToCommonLevel(prev, next) {
    var parentNext = next.parent;
    if (null === parentNext) throw Error(formatProdErrorMessage(402));
    prev.depth === parentNext.depth ? popToNearestCommonAncestor(prev, parentNext) : popNextToCommonLevel(prev, parentNext);
    next.context._currentValue2 = next.value;
  }
  function switchContext(newSnapshot) {
    var prev = currentActiveSnapshot;
    prev !== newSnapshot && (null === prev ? pushAllNext(newSnapshot) : null === newSnapshot ? popAllPrevious(prev) : prev.depth === newSnapshot.depth ? popToNearestCommonAncestor(prev, newSnapshot) : prev.depth > newSnapshot.depth ? popPreviousToCommonLevel(prev, newSnapshot) : popNextToCommonLevel(prev, newSnapshot), currentActiveSnapshot = newSnapshot);
  }
  var classComponentUpdater = {
    enqueueSetState: function(inst, payload) {
      inst = inst._reactInternals;
      null !== inst.queue && inst.queue.push(payload);
    },
    enqueueReplaceState: function(inst, payload) {
      inst = inst._reactInternals;
      inst.replace = true;
      inst.queue = [payload];
    },
    enqueueForceUpdate: function() {
    }
  }, emptyTreeContext = { id: 1, overflow: "" };
  function pushTreeContext(baseContext, totalChildren, index) {
    var baseIdWithLeadingBit = baseContext.id;
    baseContext = baseContext.overflow;
    var baseLength = 32 - clz32(baseIdWithLeadingBit) - 1;
    baseIdWithLeadingBit &= ~(1 << baseLength);
    index += 1;
    var length = 32 - clz32(totalChildren) + baseLength;
    if (30 < length) {
      var numberOfOverflowBits = baseLength - baseLength % 5;
      length = (baseIdWithLeadingBit & (1 << numberOfOverflowBits) - 1).toString(32);
      baseIdWithLeadingBit >>= numberOfOverflowBits;
      baseLength -= numberOfOverflowBits;
      return {
        id: 1 << 32 - clz32(totalChildren) + baseLength | index << baseLength | baseIdWithLeadingBit,
        overflow: length + baseContext
      };
    }
    return {
      id: 1 << length | index << baseLength | baseIdWithLeadingBit,
      overflow: baseContext
    };
  }
  var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback, log2 = Math.log, LN2 = Math.LN2;
  function clz32Fallback(x) {
    x >>>= 0;
    return 0 === x ? 32 : 31 - (log2(x) / LN2 | 0) | 0;
  }
  function noop() {
  }
  var SuspenseException = Error(formatProdErrorMessage(460));
  function trackUsedThenable(thenableState2, thenable, index) {
    index = thenableState2[index];
    void 0 === index ? thenableState2.push(thenable) : index !== thenable && (thenable.then(noop, noop), thenable = index);
    switch (thenable.status) {
      case "fulfilled":
        return thenable.value;
      case "rejected":
        throw thenable.reason;
      default:
        "string" === typeof thenable.status ? thenable.then(noop, noop) : (thenableState2 = thenable, thenableState2.status = "pending", thenableState2.then(
          function(fulfilledValue) {
            if ("pending" === thenable.status) {
              var fulfilledThenable = thenable;
              fulfilledThenable.status = "fulfilled";
              fulfilledThenable.value = fulfilledValue;
            }
          },
          function(error2) {
            if ("pending" === thenable.status) {
              var rejectedThenable = thenable;
              rejectedThenable.status = "rejected";
              rejectedThenable.reason = error2;
            }
          }
        ));
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
        }
        suspendedThenable = thenable;
        throw SuspenseException;
    }
  }
  var suspendedThenable = null;
  function getSuspendedThenable() {
    if (null === suspendedThenable) throw Error(formatProdErrorMessage(459));
    var thenable = suspendedThenable;
    suspendedThenable = null;
    return thenable;
  }
  function is(x, y) {
    return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
  }
  var objectIs = "function" === typeof Object.is ? Object.is : is, currentlyRenderingComponent = null, currentlyRenderingTask = null, currentlyRenderingRequest = null, currentlyRenderingKeyPath = null, firstWorkInProgressHook = null, workInProgressHook = null, isReRender = false, didScheduleRenderPhaseUpdate = false, localIdCounter = 0, actionStateCounter = 0, actionStateMatchingIndex = -1, thenableIndexCounter = 0, thenableState = null, renderPhaseUpdates = null, numberOfReRenders = 0;
  function resolveCurrentlyRenderingComponent() {
    if (null === currentlyRenderingComponent)
      throw Error(formatProdErrorMessage(321));
    return currentlyRenderingComponent;
  }
  function createHook() {
    if (0 < numberOfReRenders) throw Error(formatProdErrorMessage(312));
    return { memoizedState: null, queue: null, next: null };
  }
  function createWorkInProgressHook() {
    null === workInProgressHook ? null === firstWorkInProgressHook ? (isReRender = false, firstWorkInProgressHook = workInProgressHook = createHook()) : (isReRender = true, workInProgressHook = firstWorkInProgressHook) : null === workInProgressHook.next ? (isReRender = false, workInProgressHook = workInProgressHook.next = createHook()) : (isReRender = true, workInProgressHook = workInProgressHook.next);
    return workInProgressHook;
  }
  function getThenableStateAfterSuspending() {
    var state = thenableState;
    thenableState = null;
    return state;
  }
  function resetHooksState() {
    currentlyRenderingKeyPath = currentlyRenderingRequest = currentlyRenderingTask = currentlyRenderingComponent = null;
    didScheduleRenderPhaseUpdate = false;
    firstWorkInProgressHook = null;
    numberOfReRenders = 0;
    workInProgressHook = renderPhaseUpdates = null;
  }
  function basicStateReducer(state, action) {
    return "function" === typeof action ? action(state) : action;
  }
  function useReducer(reducer, initialArg, init) {
    currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
    workInProgressHook = createWorkInProgressHook();
    if (isReRender) {
      var queue = workInProgressHook.queue;
      initialArg = queue.dispatch;
      if (null !== renderPhaseUpdates && (init = renderPhaseUpdates.get(queue), void 0 !== init)) {
        renderPhaseUpdates.delete(queue);
        queue = workInProgressHook.memoizedState;
        do
          queue = reducer(queue, init.action), init = init.next;
        while (null !== init);
        workInProgressHook.memoizedState = queue;
        return [queue, initialArg];
      }
      return [workInProgressHook.memoizedState, initialArg];
    }
    reducer = reducer === basicStateReducer ? "function" === typeof initialArg ? initialArg() : initialArg : void 0 !== init ? init(initialArg) : initialArg;
    workInProgressHook.memoizedState = reducer;
    reducer = workInProgressHook.queue = { last: null, dispatch: null };
    reducer = reducer.dispatch = dispatchAction.bind(
      null,
      currentlyRenderingComponent,
      reducer
    );
    return [workInProgressHook.memoizedState, reducer];
  }
  function useMemo(nextCreate, deps) {
    currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
    workInProgressHook = createWorkInProgressHook();
    deps = void 0 === deps ? null : deps;
    if (null !== workInProgressHook) {
      var prevState = workInProgressHook.memoizedState;
      if (null !== prevState && null !== deps) {
        var prevDeps = prevState[1];
        a: if (null === prevDeps) prevDeps = false;
        else {
          for (var i = 0; i < prevDeps.length && i < deps.length; i++)
            if (!objectIs(deps[i], prevDeps[i])) {
              prevDeps = false;
              break a;
            }
          prevDeps = true;
        }
        if (prevDeps) return prevState[0];
      }
    }
    nextCreate = nextCreate();
    workInProgressHook.memoizedState = [nextCreate, deps];
    return nextCreate;
  }
  function dispatchAction(componentIdentity, queue, action) {
    if (25 <= numberOfReRenders) throw Error(formatProdErrorMessage(301));
    if (componentIdentity === currentlyRenderingComponent)
      if (didScheduleRenderPhaseUpdate = true, componentIdentity = { action, next: null }, null === renderPhaseUpdates && (renderPhaseUpdates = /* @__PURE__ */ new Map()), action = renderPhaseUpdates.get(queue), void 0 === action)
        renderPhaseUpdates.set(queue, componentIdentity);
      else {
        for (queue = action; null !== queue.next; ) queue = queue.next;
        queue.next = componentIdentity;
      }
  }
  function throwOnUseEffectEventCall() {
    throw Error(formatProdErrorMessage(440));
  }
  function unsupportedStartTransition() {
    throw Error(formatProdErrorMessage(394));
  }
  function unsupportedSetOptimisticState() {
    throw Error(formatProdErrorMessage(479));
  }
  function useActionState(action, initialState, permalink) {
    resolveCurrentlyRenderingComponent();
    var actionStateHookIndex = actionStateCounter++, request = currentlyRenderingRequest;
    if ("function" === typeof action.$$FORM_ACTION) {
      var nextPostbackStateKey = null, componentKeyPath = currentlyRenderingKeyPath;
      request = request.formState;
      var isSignatureEqual = action.$$IS_SIGNATURE_EQUAL;
      if (null !== request && "function" === typeof isSignatureEqual) {
        var postbackKey = request[1];
        isSignatureEqual.call(action, request[2], request[3]) && (nextPostbackStateKey = void 0 !== permalink ? "p" + permalink : "k" + murmurhash3_32_gc(
          JSON.stringify([componentKeyPath, null, actionStateHookIndex]),
          0
        ), postbackKey === nextPostbackStateKey && (actionStateMatchingIndex = actionStateHookIndex, initialState = request[0]));
      }
      var boundAction = action.bind(null, initialState);
      action = function(payload) {
        boundAction(payload);
      };
      "function" === typeof boundAction.$$FORM_ACTION && (action.$$FORM_ACTION = function(prefix2) {
        prefix2 = boundAction.$$FORM_ACTION(prefix2);
        void 0 !== permalink && (permalink += "", prefix2.action = permalink);
        var formData = prefix2.data;
        formData && (null === nextPostbackStateKey && (nextPostbackStateKey = void 0 !== permalink ? "p" + permalink : "k" + murmurhash3_32_gc(
          JSON.stringify([
            componentKeyPath,
            null,
            actionStateHookIndex
          ]),
          0
        )), formData.append("$ACTION_KEY", nextPostbackStateKey));
        return prefix2;
      });
      return [initialState, action, false];
    }
    var boundAction$22 = action.bind(null, initialState);
    return [
      initialState,
      function(payload) {
        boundAction$22(payload);
      },
      false
    ];
  }
  function unwrapThenable(thenable) {
    var index = thenableIndexCounter;
    thenableIndexCounter += 1;
    null === thenableState && (thenableState = []);
    return trackUsedThenable(thenableState, thenable, index);
  }
  function unsupportedRefresh() {
    throw Error(formatProdErrorMessage(393));
  }
  var HooksDispatcher = {
    readContext: function(context) {
      return context._currentValue2;
    },
    use: function(usable) {
      if (null !== usable && "object" === typeof usable) {
        if ("function" === typeof usable.then) return unwrapThenable(usable);
        if (usable.$$typeof === REACT_CONTEXT_TYPE)
          return usable._currentValue2;
      }
      throw Error(formatProdErrorMessage(438, String(usable)));
    },
    useContext: function(context) {
      resolveCurrentlyRenderingComponent();
      return context._currentValue2;
    },
    useMemo,
    useReducer,
    useRef: function(initialValue) {
      currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
      workInProgressHook = createWorkInProgressHook();
      var previousRef = workInProgressHook.memoizedState;
      return null === previousRef ? (initialValue = { current: initialValue }, workInProgressHook.memoizedState = initialValue) : previousRef;
    },
    useState: function(initialState) {
      return useReducer(basicStateReducer, initialState);
    },
    useInsertionEffect: noop,
    useLayoutEffect: noop,
    useCallback: function(callback, deps) {
      return useMemo(function() {
        return callback;
      }, deps);
    },
    useImperativeHandle: noop,
    useEffect: noop,
    useDebugValue: noop,
    useDeferredValue: function(value, initialValue) {
      resolveCurrentlyRenderingComponent();
      return void 0 !== initialValue ? initialValue : value;
    },
    useTransition: function() {
      resolveCurrentlyRenderingComponent();
      return [false, unsupportedStartTransition];
    },
    useId: function() {
      var JSCompiler_inline_result = currentlyRenderingTask.treeContext;
      var overflow = JSCompiler_inline_result.overflow;
      JSCompiler_inline_result = JSCompiler_inline_result.id;
      JSCompiler_inline_result = (JSCompiler_inline_result & ~(1 << 32 - clz32(JSCompiler_inline_result) - 1)).toString(32) + overflow;
      var resumableState = currentResumableState;
      if (null === resumableState) throw Error(formatProdErrorMessage(404));
      overflow = localIdCounter++;
      JSCompiler_inline_result = "_" + resumableState.idPrefix + "R_" + JSCompiler_inline_result;
      0 < overflow && (JSCompiler_inline_result += "H" + overflow.toString(32));
      return JSCompiler_inline_result + "_";
    },
    useSyncExternalStore: function(subscribe, getSnapshot, getServerSnapshot) {
      if (void 0 === getServerSnapshot)
        throw Error(formatProdErrorMessage(407));
      return getServerSnapshot();
    },
    useOptimistic: function(passthrough) {
      resolveCurrentlyRenderingComponent();
      return [passthrough, unsupportedSetOptimisticState];
    },
    useActionState,
    useFormState: useActionState,
    useHostTransitionStatus: function() {
      resolveCurrentlyRenderingComponent();
      return sharedNotPendingObject;
    },
    useMemoCache: function(size) {
      for (var data = Array(size), i = 0; i < size; i++)
        data[i] = REACT_MEMO_CACHE_SENTINEL;
      return data;
    },
    useCacheRefresh: function() {
      return unsupportedRefresh;
    },
    useEffectEvent: function() {
      return throwOnUseEffectEventCall;
    }
  }, currentResumableState = null, DefaultAsyncDispatcher = {
    getCacheForType: function() {
      throw Error(formatProdErrorMessage(248));
    },
    cacheSignal: function() {
      throw Error(formatProdErrorMessage(248));
    }
  }, prefix, suffix;
  function describeBuiltInComponentFrame(name) {
    if (void 0 === prefix)
      try {
        throw Error();
      } catch (x) {
        var match = x.stack.trim().match(/\n( *(at )?)/);
        prefix = match && match[1] || "";
        suffix = -1 < x.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < x.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return "\n" + prefix + name + suffix;
  }
  var reentry = false;
  function describeNativeComponentFrame(fn, construct) {
    if (!fn || reentry) return "";
    reentry = true;
    var previousPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var RunInRootFrame = {
        DetermineComponentFrameRoot: function() {
          try {
            if (construct) {
              var Fake = function() {
                throw Error();
              };
              Object.defineProperty(Fake.prototype, "props", {
                set: function() {
                  throw Error();
                }
              });
              if ("object" === typeof Reflect && Reflect.construct) {
                try {
                  Reflect.construct(Fake, []);
                } catch (x) {
                  var control = x;
                }
                Reflect.construct(fn, [], Fake);
              } else {
                try {
                  Fake.call();
                } catch (x$24) {
                  control = x$24;
                }
                fn.call(Fake.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (x$25) {
                control = x$25;
              }
              (Fake = fn()) && "function" === typeof Fake.catch && Fake.catch(function() {
              });
            }
          } catch (sample) {
            if (sample && control && "string" === typeof sample.stack)
              return [sample.stack, control.stack];
          }
          return [null, null];
        }
      };
      RunInRootFrame.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var namePropDescriptor = Object.getOwnPropertyDescriptor(
        RunInRootFrame.DetermineComponentFrameRoot,
        "name"
      );
      namePropDescriptor && namePropDescriptor.configurable && Object.defineProperty(
        RunInRootFrame.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(), sampleStack = _RunInRootFrame$Deter[0], controlStack = _RunInRootFrame$Deter[1];
      if (sampleStack && controlStack) {
        var sampleLines = sampleStack.split("\n"), controlLines = controlStack.split("\n");
        for (namePropDescriptor = RunInRootFrame = 0; RunInRootFrame < sampleLines.length && !sampleLines[RunInRootFrame].includes("DetermineComponentFrameRoot"); )
          RunInRootFrame++;
        for (; namePropDescriptor < controlLines.length && !controlLines[namePropDescriptor].includes(
          "DetermineComponentFrameRoot"
        ); )
          namePropDescriptor++;
        if (RunInRootFrame === sampleLines.length || namePropDescriptor === controlLines.length)
          for (RunInRootFrame = sampleLines.length - 1, namePropDescriptor = controlLines.length - 1; 1 <= RunInRootFrame && 0 <= namePropDescriptor && sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]; )
            namePropDescriptor--;
        for (; 1 <= RunInRootFrame && 0 <= namePropDescriptor; RunInRootFrame--, namePropDescriptor--)
          if (sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
            if (1 !== RunInRootFrame || 1 !== namePropDescriptor) {
              do
                if (RunInRootFrame--, namePropDescriptor--, 0 > namePropDescriptor || sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
                  var frame = "\n" + sampleLines[RunInRootFrame].replace(" at new ", " at ");
                  fn.displayName && frame.includes("<anonymous>") && (frame = frame.replace("<anonymous>", fn.displayName));
                  return frame;
                }
              while (1 <= RunInRootFrame && 0 <= namePropDescriptor);
            }
            break;
          }
      }
    } finally {
      reentry = false, Error.prepareStackTrace = previousPrepareStackTrace;
    }
    return (previousPrepareStackTrace = fn ? fn.displayName || fn.name : "") ? describeBuiltInComponentFrame(previousPrepareStackTrace) : "";
  }
  function describeComponentStackByType(type) {
    if ("string" === typeof type) return describeBuiltInComponentFrame(type);
    if ("function" === typeof type)
      return type.prototype && type.prototype.isReactComponent ? describeNativeComponentFrame(type, true) : describeNativeComponentFrame(type, false);
    if ("object" === typeof type && null !== type) {
      switch (type.$$typeof) {
        case REACT_FORWARD_REF_TYPE:
          return describeNativeComponentFrame(type.render, false);
        case REACT_MEMO_TYPE:
          return describeNativeComponentFrame(type.type, false);
        case REACT_LAZY_TYPE:
          var lazyComponent = type, payload = lazyComponent._payload;
          lazyComponent = lazyComponent._init;
          try {
            type = lazyComponent(payload);
          } catch (x) {
            return describeBuiltInComponentFrame("Lazy");
          }
          return describeComponentStackByType(type);
      }
      if ("string" === typeof type.name) {
        a: {
          payload = type.name;
          lazyComponent = type.env;
          var location = type.debugLocation;
          if (null != location && (type = Error.prepareStackTrace, Error.prepareStackTrace = void 0, location = location.stack, Error.prepareStackTrace = type, location.startsWith("Error: react-stack-top-frame\n") && (location = location.slice(29)), type = location.indexOf("\n"), -1 !== type && (location = location.slice(type + 1)), type = location.indexOf("react_stack_bottom_frame"), -1 !== type && (type = location.lastIndexOf("\n", type)), type = -1 !== type ? location = location.slice(0, type) : "", location = type.lastIndexOf("\n"), type = -1 === location ? type : type.slice(location + 1), -1 !== type.indexOf(payload))) {
            payload = "\n" + type;
            break a;
          }
          payload = describeBuiltInComponentFrame(
            payload + (lazyComponent ? " [" + lazyComponent + "]" : "")
          );
        }
        return payload;
      }
    }
    switch (type) {
      case REACT_SUSPENSE_LIST_TYPE:
        return describeBuiltInComponentFrame("SuspenseList");
      case REACT_SUSPENSE_TYPE:
        return describeBuiltInComponentFrame("Suspense");
    }
    return "";
  }
  function isEligibleForOutlining(request, boundary) {
    return (500 < boundary.byteSize || false) && null === boundary.contentPreamble;
  }
  function defaultErrorHandler(error2) {
    if ("object" === typeof error2 && null !== error2 && "string" === typeof error2.environmentName) {
      var JSCompiler_inline_result = error2.environmentName;
      error2 = [error2].slice(0);
      "string" === typeof error2[0] ? error2.splice(
        0,
        1,
        "[%s] " + error2[0],
        " " + JSCompiler_inline_result + " "
      ) : error2.splice(0, 0, "[%s]", " " + JSCompiler_inline_result + " ");
      error2.unshift(console);
      JSCompiler_inline_result = bind.apply(console.error, error2);
      JSCompiler_inline_result();
    } else console.error(error2);
    return null;
  }
  function RequestInstance(resumableState, renderState, rootFormatContext, progressiveChunkSize, onError2, onAllReady, onShellReady, onShellError, onFatalError, onPostpone, formState) {
    var abortSet = /* @__PURE__ */ new Set();
    this.destination = null;
    this.flushScheduled = false;
    this.resumableState = resumableState;
    this.renderState = renderState;
    this.rootFormatContext = rootFormatContext;
    this.progressiveChunkSize = void 0 === progressiveChunkSize ? 12800 : progressiveChunkSize;
    this.status = 10;
    this.fatalError = null;
    this.pendingRootTasks = this.allPendingTasks = this.nextSegmentId = 0;
    this.completedPreambleSegments = this.completedRootSegment = null;
    this.byteSize = 0;
    this.abortableTasks = abortSet;
    this.pingedTasks = [];
    this.clientRenderedBoundaries = [];
    this.completedBoundaries = [];
    this.partialBoundaries = [];
    this.trackedPostpones = null;
    this.onError = void 0 === onError2 ? defaultErrorHandler : onError2;
    this.onPostpone = void 0 === onPostpone ? noop : onPostpone;
    this.onAllReady = void 0 === onAllReady ? noop : onAllReady;
    this.onShellReady = void 0 === onShellReady ? noop : onShellReady;
    this.onShellError = void 0 === onShellError ? noop : onShellError;
    this.onFatalError = void 0 === onFatalError ? noop : onFatalError;
    this.formState = void 0 === formState ? null : formState;
  }
  function createRequest(children, resumableState, renderState, rootFormatContext, progressiveChunkSize, onError2, onAllReady, onShellReady, onShellError, onFatalError, onPostpone, formState) {
    resumableState = new RequestInstance(
      resumableState,
      renderState,
      rootFormatContext,
      progressiveChunkSize,
      onError2,
      onAllReady,
      onShellReady,
      onShellError,
      onFatalError,
      onPostpone,
      formState
    );
    renderState = createPendingSegment(
      resumableState,
      0,
      null,
      rootFormatContext,
      false,
      false
    );
    renderState.parentFlushed = true;
    children = createRenderTask(
      resumableState,
      null,
      children,
      -1,
      null,
      renderState,
      null,
      null,
      resumableState.abortableTasks,
      null,
      rootFormatContext,
      null,
      emptyTreeContext,
      null,
      null
    );
    pushComponentStack(children);
    resumableState.pingedTasks.push(children);
    return resumableState;
  }
  var currentRequest = null;
  function pingTask(request, task) {
    request.pingedTasks.push(task);
    1 === request.pingedTasks.length && (request.flushScheduled = null !== request.destination, performWork(request));
  }
  function createSuspenseBoundary(request, row, fallbackAbortableTasks, contentPreamble, fallbackPreamble) {
    fallbackAbortableTasks = {
      status: 0,
      rootSegmentID: -1,
      parentFlushed: false,
      pendingTasks: 0,
      row,
      completedSegments: [],
      byteSize: 0,
      fallbackAbortableTasks,
      errorDigest: null,
      contentState: createHoistableState(),
      fallbackState: createHoistableState(),
      contentPreamble,
      fallbackPreamble,
      trackedContentKeyPath: null,
      trackedFallbackNode: null
    };
    null !== row && (row.pendingTasks++, contentPreamble = row.boundaries, null !== contentPreamble && (request.allPendingTasks++, fallbackAbortableTasks.pendingTasks++, contentPreamble.push(fallbackAbortableTasks)), request = row.inheritedHoistables, null !== request && hoistHoistables(fallbackAbortableTasks.contentState, request));
    return fallbackAbortableTasks;
  }
  function createRenderTask(request, thenableState2, node, childIndex, blockedBoundary, blockedSegment, blockedPreamble, hoistableState, abortSet, keyPath, formatContext, context, treeContext, row, componentStack) {
    request.allPendingTasks++;
    null === blockedBoundary ? request.pendingRootTasks++ : blockedBoundary.pendingTasks++;
    null !== row && row.pendingTasks++;
    var task = {
      replay: null,
      node,
      childIndex,
      ping: function() {
        return pingTask(request, task);
      },
      blockedBoundary,
      blockedSegment,
      blockedPreamble,
      hoistableState,
      abortSet,
      keyPath,
      formatContext,
      context,
      treeContext,
      row,
      componentStack,
      thenableState: thenableState2
    };
    abortSet.add(task);
    return task;
  }
  function createReplayTask(request, thenableState2, replay, node, childIndex, blockedBoundary, hoistableState, abortSet, keyPath, formatContext, context, treeContext, row, componentStack) {
    request.allPendingTasks++;
    null === blockedBoundary ? request.pendingRootTasks++ : blockedBoundary.pendingTasks++;
    null !== row && row.pendingTasks++;
    replay.pendingTasks++;
    var task = {
      replay,
      node,
      childIndex,
      ping: function() {
        return pingTask(request, task);
      },
      blockedBoundary,
      blockedSegment: null,
      blockedPreamble: null,
      hoistableState,
      abortSet,
      keyPath,
      formatContext,
      context,
      treeContext,
      row,
      componentStack,
      thenableState: thenableState2
    };
    abortSet.add(task);
    return task;
  }
  function createPendingSegment(request, index, boundary, parentFormatContext, lastPushedText, textEmbedded) {
    return {
      status: 0,
      parentFlushed: false,
      id: -1,
      index,
      chunks: [],
      children: [],
      preambleChildren: [],
      parentFormatContext,
      boundary,
      lastPushedText,
      textEmbedded
    };
  }
  function pushComponentStack(task) {
    var node = task.node;
    if ("object" === typeof node && null !== node)
      switch (node.$$typeof) {
        case REACT_ELEMENT_TYPE:
          task.componentStack = { parent: task.componentStack, type: node.type };
      }
  }
  function replaceSuspenseComponentStackWithSuspenseFallbackStack(componentStack) {
    return null === componentStack ? null : { parent: componentStack.parent, type: "Suspense Fallback" };
  }
  function getThrownInfo(node$jscomp$0) {
    var errorInfo = {};
    node$jscomp$0 && Object.defineProperty(errorInfo, "componentStack", {
      configurable: true,
      enumerable: true,
      get: function() {
        try {
          var info2 = "", node = node$jscomp$0;
          do
            info2 += describeComponentStackByType(node.type), node = node.parent;
          while (node);
          var JSCompiler_inline_result = info2;
        } catch (x) {
          JSCompiler_inline_result = "\nError generating stack: " + x.message + "\n" + x.stack;
        }
        Object.defineProperty(errorInfo, "componentStack", {
          value: JSCompiler_inline_result
        });
        return JSCompiler_inline_result;
      }
    });
    return errorInfo;
  }
  function logRecoverableError(request, error2, errorInfo) {
    request = request.onError;
    error2 = request(error2, errorInfo);
    if (null == error2 || "string" === typeof error2) return error2;
  }
  function fatalError(request, error2) {
    var onShellError = request.onShellError, onFatalError = request.onFatalError;
    onShellError(error2);
    onFatalError(error2);
    null !== request.destination ? (request.status = 14, request.destination.destroy(error2)) : (request.status = 13, request.fatalError = error2);
  }
  function finishSuspenseListRow(request, row) {
    unblockSuspenseListRow(request, row.next, row.hoistables);
  }
  function unblockSuspenseListRow(request, unblockedRow, inheritedHoistables) {
    for (; null !== unblockedRow; ) {
      null !== inheritedHoistables && (hoistHoistables(unblockedRow.hoistables, inheritedHoistables), unblockedRow.inheritedHoistables = inheritedHoistables);
      var unblockedBoundaries = unblockedRow.boundaries;
      if (null !== unblockedBoundaries) {
        unblockedRow.boundaries = null;
        for (var i = 0; i < unblockedBoundaries.length; i++) {
          var unblockedBoundary = unblockedBoundaries[i];
          null !== inheritedHoistables && hoistHoistables(unblockedBoundary.contentState, inheritedHoistables);
          finishedTask(request, unblockedBoundary, null, null);
        }
      }
      unblockedRow.pendingTasks--;
      if (0 < unblockedRow.pendingTasks) break;
      inheritedHoistables = unblockedRow.hoistables;
      unblockedRow = unblockedRow.next;
    }
  }
  function tryToResolveTogetherRow(request, togetherRow) {
    var boundaries = togetherRow.boundaries;
    if (null !== boundaries && togetherRow.pendingTasks === boundaries.length) {
      for (var allCompleteAndInlinable = true, i = 0; i < boundaries.length; i++) {
        var rowBoundary = boundaries[i];
        if (1 !== rowBoundary.pendingTasks || rowBoundary.parentFlushed || isEligibleForOutlining(request, rowBoundary)) {
          allCompleteAndInlinable = false;
          break;
        }
      }
      allCompleteAndInlinable && unblockSuspenseListRow(request, togetherRow, togetherRow.hoistables);
    }
  }
  function createSuspenseListRow(previousRow) {
    var newRow = {
      pendingTasks: 1,
      boundaries: null,
      hoistables: createHoistableState(),
      inheritedHoistables: null,
      together: false,
      next: null
    };
    null !== previousRow && 0 < previousRow.pendingTasks && (newRow.pendingTasks++, newRow.boundaries = [], previousRow.next = newRow);
    return newRow;
  }
  function renderSuspenseListRows(request, task, keyPath, rows, revealOrder) {
    var prevKeyPath = task.keyPath, prevTreeContext = task.treeContext, prevRow = task.row;
    task.keyPath = keyPath;
    keyPath = rows.length;
    var previousSuspenseListRow = null;
    if (null !== task.replay) {
      var resumeSlots = task.replay.slots;
      if (null !== resumeSlots && "object" === typeof resumeSlots)
        for (var n = 0; n < keyPath; n++) {
          var i = "backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder ? n : keyPath - 1 - n, node = rows[i];
          task.row = previousSuspenseListRow = createSuspenseListRow(
            previousSuspenseListRow
          );
          task.treeContext = pushTreeContext(prevTreeContext, keyPath, i);
          var resumeSegmentID = resumeSlots[i];
          "number" === typeof resumeSegmentID ? (resumeNode(request, task, resumeSegmentID, node, i), delete resumeSlots[i]) : renderNode2(request, task, node, i);
          0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
        }
      else
        for (resumeSlots = 0; resumeSlots < keyPath; resumeSlots++)
          n = "backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder ? resumeSlots : keyPath - 1 - resumeSlots, i = rows[n], task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow), task.treeContext = pushTreeContext(prevTreeContext, keyPath, n), renderNode2(request, task, i, n), 0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
    } else if ("backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder)
      for (revealOrder = 0; revealOrder < keyPath; revealOrder++)
        resumeSlots = rows[revealOrder], task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow), task.treeContext = pushTreeContext(
          prevTreeContext,
          keyPath,
          revealOrder
        ), renderNode2(request, task, resumeSlots, revealOrder), 0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
    else {
      revealOrder = task.blockedSegment;
      resumeSlots = revealOrder.children.length;
      n = revealOrder.chunks.length;
      for (i = keyPath - 1; 0 <= i; i--) {
        node = rows[i];
        task.row = previousSuspenseListRow = createSuspenseListRow(
          previousSuspenseListRow
        );
        task.treeContext = pushTreeContext(prevTreeContext, keyPath, i);
        resumeSegmentID = createPendingSegment(
          request,
          n,
          null,
          task.formatContext,
          0 === i ? revealOrder.lastPushedText : true,
          true
        );
        revealOrder.children.splice(resumeSlots, 0, resumeSegmentID);
        task.blockedSegment = resumeSegmentID;
        try {
          renderNode2(request, task, node, i), pushSegmentFinale(
            resumeSegmentID.chunks,
            request.renderState,
            resumeSegmentID.lastPushedText,
            resumeSegmentID.textEmbedded
          ), resumeSegmentID.status = 1, 0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
        } catch (thrownValue) {
          throw resumeSegmentID.status = 12 === request.status ? 3 : 4, thrownValue;
        }
      }
      task.blockedSegment = revealOrder;
      revealOrder.lastPushedText = false;
    }
    null !== prevRow && null !== previousSuspenseListRow && 0 < previousSuspenseListRow.pendingTasks && (prevRow.pendingTasks++, previousSuspenseListRow.next = prevRow);
    task.treeContext = prevTreeContext;
    task.row = prevRow;
    task.keyPath = prevKeyPath;
  }
  function renderWithHooks(request, task, keyPath, Component, props, secondArg) {
    var prevThenableState = task.thenableState;
    task.thenableState = null;
    currentlyRenderingComponent = {};
    currentlyRenderingTask = task;
    currentlyRenderingRequest = request;
    currentlyRenderingKeyPath = keyPath;
    actionStateCounter = localIdCounter = 0;
    actionStateMatchingIndex = -1;
    thenableIndexCounter = 0;
    thenableState = prevThenableState;
    for (request = Component(props, secondArg); didScheduleRenderPhaseUpdate; )
      didScheduleRenderPhaseUpdate = false, actionStateCounter = localIdCounter = 0, actionStateMatchingIndex = -1, thenableIndexCounter = 0, numberOfReRenders += 1, workInProgressHook = null, request = Component(props, secondArg);
    resetHooksState();
    return request;
  }
  function finishFunctionComponent(request, task, keyPath, children, hasId, actionStateCount, actionStateMatchingIndex2) {
    var didEmitActionStateMarkers = false;
    if (0 !== actionStateCount && null !== request.formState) {
      var segment = task.blockedSegment;
      if (null !== segment) {
        didEmitActionStateMarkers = true;
        segment = segment.chunks;
        for (var i = 0; i < actionStateCount; i++)
          i === actionStateMatchingIndex2 ? segment.push("<!--F!-->") : segment.push("<!--F-->");
      }
    }
    actionStateCount = task.keyPath;
    task.keyPath = keyPath;
    hasId ? (keyPath = task.treeContext, task.treeContext = pushTreeContext(keyPath, 1, 0), renderNode2(request, task, children, -1), task.treeContext = keyPath) : didEmitActionStateMarkers ? renderNode2(request, task, children, -1) : renderNodeDestructive(request, task, children, -1);
    task.keyPath = actionStateCount;
  }
  function renderElement2(request, task, keyPath, type, props, ref) {
    if ("function" === typeof type)
      if (type.prototype && type.prototype.isReactComponent) {
        var newProps = props;
        if ("ref" in props) {
          newProps = {};
          for (var propName in props)
            "ref" !== propName && (newProps[propName] = props[propName]);
        }
        var defaultProps = type.defaultProps;
        if (defaultProps) {
          newProps === props && (newProps = assign({}, newProps, props));
          for (var propName$43 in defaultProps)
            void 0 === newProps[propName$43] && (newProps[propName$43] = defaultProps[propName$43]);
        }
        props = newProps;
        newProps = emptyContextObject;
        defaultProps = type.contextType;
        "object" === typeof defaultProps && null !== defaultProps && (newProps = defaultProps._currentValue2);
        newProps = new type(props, newProps);
        var initialState = void 0 !== newProps.state ? newProps.state : null;
        newProps.updater = classComponentUpdater;
        newProps.props = props;
        newProps.state = initialState;
        defaultProps = { queue: [], replace: false };
        newProps._reactInternals = defaultProps;
        ref = type.contextType;
        newProps.context = "object" === typeof ref && null !== ref ? ref._currentValue2 : emptyContextObject;
        ref = type.getDerivedStateFromProps;
        "function" === typeof ref && (ref = ref(props, initialState), initialState = null === ref || void 0 === ref ? initialState : assign({}, initialState, ref), newProps.state = initialState);
        if ("function" !== typeof type.getDerivedStateFromProps && "function" !== typeof newProps.getSnapshotBeforeUpdate && ("function" === typeof newProps.UNSAFE_componentWillMount || "function" === typeof newProps.componentWillMount))
          if (type = newProps.state, "function" === typeof newProps.componentWillMount && newProps.componentWillMount(), "function" === typeof newProps.UNSAFE_componentWillMount && newProps.UNSAFE_componentWillMount(), type !== newProps.state && classComponentUpdater.enqueueReplaceState(
            newProps,
            newProps.state,
            null
          ), null !== defaultProps.queue && 0 < defaultProps.queue.length)
            if (type = defaultProps.queue, ref = defaultProps.replace, defaultProps.queue = null, defaultProps.replace = false, ref && 1 === type.length)
              newProps.state = type[0];
            else {
              defaultProps = ref ? type[0] : newProps.state;
              initialState = true;
              for (ref = ref ? 1 : 0; ref < type.length; ref++)
                propName$43 = type[ref], propName$43 = "function" === typeof propName$43 ? propName$43.call(newProps, defaultProps, props, void 0) : propName$43, null != propName$43 && (initialState ? (initialState = false, defaultProps = assign({}, defaultProps, propName$43)) : assign(defaultProps, propName$43));
              newProps.state = defaultProps;
            }
          else defaultProps.queue = null;
        type = newProps.render();
        if (12 === request.status) throw null;
        props = task.keyPath;
        task.keyPath = keyPath;
        renderNodeDestructive(request, task, type, -1);
        task.keyPath = props;
      } else {
        type = renderWithHooks(request, task, keyPath, type, props, void 0);
        if (12 === request.status) throw null;
        finishFunctionComponent(
          request,
          task,
          keyPath,
          type,
          0 !== localIdCounter,
          actionStateCounter,
          actionStateMatchingIndex
        );
      }
    else if ("string" === typeof type)
      if (newProps = task.blockedSegment, null === newProps)
        newProps = props.children, defaultProps = task.formatContext, initialState = task.keyPath, task.formatContext = getChildFormatContext(defaultProps, type, props), task.keyPath = keyPath, renderNode2(request, task, newProps, -1), task.formatContext = defaultProps, task.keyPath = initialState;
      else {
        initialState = pushStartInstance(
          newProps.chunks,
          type,
          props,
          request.resumableState,
          request.renderState,
          task.blockedPreamble,
          task.hoistableState,
          task.formatContext,
          newProps.lastPushedText
        );
        newProps.lastPushedText = false;
        defaultProps = task.formatContext;
        ref = task.keyPath;
        task.keyPath = keyPath;
        if (3 === (task.formatContext = getChildFormatContext(defaultProps, type, props)).insertionMode) {
          keyPath = createPendingSegment(
            request,
            0,
            null,
            task.formatContext,
            false,
            false
          );
          newProps.preambleChildren.push(keyPath);
          task.blockedSegment = keyPath;
          try {
            keyPath.status = 6, renderNode2(request, task, initialState, -1), pushSegmentFinale(
              keyPath.chunks,
              request.renderState,
              keyPath.lastPushedText,
              keyPath.textEmbedded
            ), keyPath.status = 1;
          } finally {
            task.blockedSegment = newProps;
          }
        } else renderNode2(request, task, initialState, -1);
        task.formatContext = defaultProps;
        task.keyPath = ref;
        a: {
          task = newProps.chunks;
          request = request.resumableState;
          switch (type) {
            case "title":
            case "style":
            case "script":
            case "area":
            case "base":
            case "br":
            case "col":
            case "embed":
            case "hr":
            case "img":
            case "input":
            case "keygen":
            case "link":
            case "meta":
            case "param":
            case "source":
            case "track":
            case "wbr":
              break a;
            case "body":
              if (1 >= defaultProps.insertionMode) {
                request.hasBody = true;
                break a;
              }
              break;
            case "html":
              if (0 === defaultProps.insertionMode) {
                request.hasHtml = true;
                break a;
              }
              break;
            case "head":
              if (1 >= defaultProps.insertionMode) break a;
          }
          task.push(endChunkForTag(type));
        }
        newProps.lastPushedText = false;
      }
    else {
      switch (type) {
        case REACT_LEGACY_HIDDEN_TYPE:
        case REACT_STRICT_MODE_TYPE:
        case REACT_PROFILER_TYPE:
        case REACT_FRAGMENT_TYPE:
          type = task.keyPath;
          task.keyPath = keyPath;
          renderNodeDestructive(request, task, props.children, -1);
          task.keyPath = type;
          return;
        case REACT_ACTIVITY_TYPE:
          type = task.blockedSegment;
          null === type ? "hidden" !== props.mode && (type = task.keyPath, task.keyPath = keyPath, renderNode2(request, task, props.children, -1), task.keyPath = type) : "hidden" !== props.mode && (request.renderState.generateStaticMarkup || type.chunks.push("<!--&-->"), type.lastPushedText = false, newProps = task.keyPath, task.keyPath = keyPath, renderNode2(request, task, props.children, -1), task.keyPath = newProps, request.renderState.generateStaticMarkup || type.chunks.push("<!--/&-->"), type.lastPushedText = false);
          return;
        case REACT_SUSPENSE_LIST_TYPE:
          a: {
            type = props.children;
            props = props.revealOrder;
            if ("forwards" === props || "backwards" === props || "unstable_legacy-backwards" === props) {
              if (isArrayImpl(type)) {
                renderSuspenseListRows(request, task, keyPath, type, props);
                break a;
              }
              if (newProps = getIteratorFn(type)) {
                if (newProps = newProps.call(type)) {
                  defaultProps = newProps.next();
                  if (!defaultProps.done) {
                    do
                      defaultProps = newProps.next();
                    while (!defaultProps.done);
                    renderSuspenseListRows(request, task, keyPath, type, props);
                  }
                  break a;
                }
              }
            }
            "together" === props ? (props = task.keyPath, newProps = task.row, defaultProps = task.row = createSuspenseListRow(null), defaultProps.boundaries = [], defaultProps.together = true, task.keyPath = keyPath, renderNodeDestructive(request, task, type, -1), 0 === --defaultProps.pendingTasks && finishSuspenseListRow(request, defaultProps), task.keyPath = props, task.row = newProps, null !== newProps && 0 < defaultProps.pendingTasks && (newProps.pendingTasks++, defaultProps.next = newProps)) : (props = task.keyPath, task.keyPath = keyPath, renderNodeDestructive(request, task, type, -1), task.keyPath = props);
          }
          return;
        case REACT_VIEW_TRANSITION_TYPE:
        case REACT_SCOPE_TYPE:
          throw Error(formatProdErrorMessage(343));
        case REACT_SUSPENSE_TYPE:
          a: if (null !== task.replay) {
            type = task.keyPath;
            newProps = task.formatContext;
            defaultProps = task.row;
            task.keyPath = keyPath;
            task.formatContext = getSuspenseContentFormatContext(
              request.resumableState,
              newProps
            );
            task.row = null;
            keyPath = props.children;
            try {
              renderNode2(request, task, keyPath, -1);
            } finally {
              task.keyPath = type, task.formatContext = newProps, task.row = defaultProps;
            }
          } else {
            type = task.keyPath;
            ref = task.formatContext;
            var prevRow = task.row, parentBoundary = task.blockedBoundary;
            propName$43 = task.blockedPreamble;
            var parentHoistableState = task.hoistableState;
            propName = task.blockedSegment;
            var fallback = props.fallback;
            props = props.children;
            var fallbackAbortSet = /* @__PURE__ */ new Set();
            var newBoundary = createSuspenseBoundary(
              request,
              task.row,
              fallbackAbortSet,
              null,
              null
            );
            null !== request.trackedPostpones && (newBoundary.trackedContentKeyPath = keyPath);
            var boundarySegment = createPendingSegment(
              request,
              propName.chunks.length,
              newBoundary,
              task.formatContext,
              false,
              false
            );
            propName.children.push(boundarySegment);
            propName.lastPushedText = false;
            var contentRootSegment = createPendingSegment(
              request,
              0,
              null,
              task.formatContext,
              false,
              false
            );
            contentRootSegment.parentFlushed = true;
            if (null !== request.trackedPostpones) {
              newProps = task.componentStack;
              defaultProps = [keyPath[0], "Suspense Fallback", keyPath[2]];
              initialState = [defaultProps[1], defaultProps[2], [], null];
              request.trackedPostpones.workingMap.set(defaultProps, initialState);
              newBoundary.trackedFallbackNode = initialState;
              task.blockedSegment = boundarySegment;
              task.blockedPreamble = newBoundary.fallbackPreamble;
              task.keyPath = defaultProps;
              task.formatContext = getSuspenseFallbackFormatContext(
                request.resumableState,
                ref
              );
              task.componentStack = replaceSuspenseComponentStackWithSuspenseFallbackStack(newProps);
              boundarySegment.status = 6;
              try {
                renderNode2(request, task, fallback, -1), pushSegmentFinale(
                  boundarySegment.chunks,
                  request.renderState,
                  boundarySegment.lastPushedText,
                  boundarySegment.textEmbedded
                ), boundarySegment.status = 1;
              } catch (thrownValue) {
                throw boundarySegment.status = 12 === request.status ? 3 : 4, thrownValue;
              } finally {
                task.blockedSegment = propName, task.blockedPreamble = propName$43, task.keyPath = type, task.formatContext = ref;
              }
              task = createRenderTask(
                request,
                null,
                props,
                -1,
                newBoundary,
                contentRootSegment,
                newBoundary.contentPreamble,
                newBoundary.contentState,
                task.abortSet,
                keyPath,
                getSuspenseContentFormatContext(
                  request.resumableState,
                  task.formatContext
                ),
                task.context,
                task.treeContext,
                null,
                newProps
              );
              pushComponentStack(task);
              request.pingedTasks.push(task);
            } else {
              task.blockedBoundary = newBoundary;
              task.blockedPreamble = newBoundary.contentPreamble;
              task.hoistableState = newBoundary.contentState;
              task.blockedSegment = contentRootSegment;
              task.keyPath = keyPath;
              task.formatContext = getSuspenseContentFormatContext(
                request.resumableState,
                ref
              );
              task.row = null;
              contentRootSegment.status = 6;
              try {
                if (renderNode2(request, task, props, -1), pushSegmentFinale(
                  contentRootSegment.chunks,
                  request.renderState,
                  contentRootSegment.lastPushedText,
                  contentRootSegment.textEmbedded
                ), contentRootSegment.status = 1, queueCompletedSegment(newBoundary, contentRootSegment), 0 === newBoundary.pendingTasks && 0 === newBoundary.status) {
                  if (newBoundary.status = 1, !isEligibleForOutlining(request, newBoundary)) {
                    null !== prevRow && 0 === --prevRow.pendingTasks && finishSuspenseListRow(request, prevRow);
                    0 === request.pendingRootTasks && task.blockedPreamble && preparePreamble(request);
                    break a;
                  }
                } else
                  null !== prevRow && prevRow.together && tryToResolveTogetherRow(request, prevRow);
              } catch (thrownValue$30) {
                newBoundary.status = 4, 12 === request.status ? (contentRootSegment.status = 3, newProps = request.fatalError) : (contentRootSegment.status = 4, newProps = thrownValue$30), defaultProps = getThrownInfo(task.componentStack), initialState = logRecoverableError(
                  request,
                  newProps,
                  defaultProps
                ), newBoundary.errorDigest = initialState, untrackBoundary(request, newBoundary);
              } finally {
                task.blockedBoundary = parentBoundary, task.blockedPreamble = propName$43, task.hoistableState = parentHoistableState, task.blockedSegment = propName, task.keyPath = type, task.formatContext = ref, task.row = prevRow;
              }
              task = createRenderTask(
                request,
                null,
                fallback,
                -1,
                parentBoundary,
                boundarySegment,
                newBoundary.fallbackPreamble,
                newBoundary.fallbackState,
                fallbackAbortSet,
                [keyPath[0], "Suspense Fallback", keyPath[2]],
                getSuspenseFallbackFormatContext(
                  request.resumableState,
                  task.formatContext
                ),
                task.context,
                task.treeContext,
                task.row,
                replaceSuspenseComponentStackWithSuspenseFallbackStack(
                  task.componentStack
                )
              );
              pushComponentStack(task);
              request.pingedTasks.push(task);
            }
          }
          return;
      }
      if ("object" === typeof type && null !== type)
        switch (type.$$typeof) {
          case REACT_FORWARD_REF_TYPE:
            if ("ref" in props)
              for (fallback in newProps = {}, props)
                "ref" !== fallback && (newProps[fallback] = props[fallback]);
            else newProps = props;
            type = renderWithHooks(
              request,
              task,
              keyPath,
              type.render,
              newProps,
              ref
            );
            finishFunctionComponent(
              request,
              task,
              keyPath,
              type,
              0 !== localIdCounter,
              actionStateCounter,
              actionStateMatchingIndex
            );
            return;
          case REACT_MEMO_TYPE:
            renderElement2(request, task, keyPath, type.type, props, ref);
            return;
          case REACT_CONTEXT_TYPE:
            defaultProps = props.children;
            newProps = task.keyPath;
            props = props.value;
            initialState = type._currentValue2;
            type._currentValue2 = props;
            ref = currentActiveSnapshot;
            currentActiveSnapshot = type = {
              parent: ref,
              depth: null === ref ? 0 : ref.depth + 1,
              context: type,
              parentValue: initialState,
              value: props
            };
            task.context = type;
            task.keyPath = keyPath;
            renderNodeDestructive(request, task, defaultProps, -1);
            request = currentActiveSnapshot;
            if (null === request) throw Error(formatProdErrorMessage(403));
            request.context._currentValue2 = request.parentValue;
            request = currentActiveSnapshot = request.parent;
            task.context = request;
            task.keyPath = newProps;
            return;
          case REACT_CONSUMER_TYPE:
            props = props.children;
            type = props(type._context._currentValue2);
            props = task.keyPath;
            task.keyPath = keyPath;
            renderNodeDestructive(request, task, type, -1);
            task.keyPath = props;
            return;
          case REACT_LAZY_TYPE:
            newProps = type._init;
            type = newProps(type._payload);
            if (12 === request.status) throw null;
            renderElement2(request, task, keyPath, type, props, ref);
            return;
        }
      throw Error(
        formatProdErrorMessage(130, null == type ? type : typeof type, "")
      );
    }
  }
  function resumeNode(request, task, segmentId, node, childIndex) {
    var prevReplay = task.replay, blockedBoundary = task.blockedBoundary, resumedSegment = createPendingSegment(
      request,
      0,
      null,
      task.formatContext,
      false,
      false
    );
    resumedSegment.id = segmentId;
    resumedSegment.parentFlushed = true;
    try {
      task.replay = null, task.blockedSegment = resumedSegment, renderNode2(request, task, node, childIndex), resumedSegment.status = 1, null === blockedBoundary ? request.completedRootSegment = resumedSegment : (queueCompletedSegment(blockedBoundary, resumedSegment), blockedBoundary.parentFlushed && request.partialBoundaries.push(blockedBoundary));
    } finally {
      task.replay = prevReplay, task.blockedSegment = null;
    }
  }
  function renderNodeDestructive(request, task, node, childIndex) {
    null !== task.replay && "number" === typeof task.replay.slots ? resumeNode(request, task, task.replay.slots, node, childIndex) : (task.node = node, task.childIndex = childIndex, node = task.componentStack, pushComponentStack(task), retryNode(request, task), task.componentStack = node);
  }
  function retryNode(request, task) {
    var node = task.node, childIndex = task.childIndex;
    if (null !== node) {
      if ("object" === typeof node) {
        switch (node.$$typeof) {
          case REACT_ELEMENT_TYPE:
            var type = node.type, key = node.key, props = node.props;
            node = props.ref;
            var ref = void 0 !== node ? node : null, name = getComponentNameFromType(type), keyOrIndex = null == key ? -1 === childIndex ? 0 : childIndex : key;
            key = [task.keyPath, name, keyOrIndex];
            if (null !== task.replay)
              a: {
                var replay = task.replay;
                childIndex = replay.nodes;
                for (node = 0; node < childIndex.length; node++) {
                  var node$jscomp$0 = childIndex[node];
                  if (keyOrIndex === node$jscomp$0[1]) {
                    if (4 === node$jscomp$0.length) {
                      if (null !== name && name !== node$jscomp$0[0])
                        throw Error(
                          formatProdErrorMessage(490, node$jscomp$0[0], name)
                        );
                      var childNodes = node$jscomp$0[2];
                      name = node$jscomp$0[3];
                      keyOrIndex = task.node;
                      task.replay = {
                        nodes: childNodes,
                        slots: name,
                        pendingTasks: 1
                      };
                      try {
                        renderElement2(request, task, key, type, props, ref);
                        if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
                          throw Error(formatProdErrorMessage(488));
                        task.replay.pendingTasks--;
                      } catch (x) {
                        if ("object" === typeof x && null !== x && (x === SuspenseException || "function" === typeof x.then))
                          throw task.node === keyOrIndex ? task.replay = replay : childIndex.splice(node, 1), x;
                        task.replay.pendingTasks--;
                        props = getThrownInfo(task.componentStack);
                        key = request;
                        request = task.blockedBoundary;
                        type = x;
                        props = logRecoverableError(key, type, props);
                        abortRemainingReplayNodes(
                          key,
                          request,
                          childNodes,
                          name,
                          type,
                          props
                        );
                      }
                      task.replay = replay;
                    } else {
                      if (type !== REACT_SUSPENSE_TYPE)
                        throw Error(
                          formatProdErrorMessage(
                            490,
                            "Suspense",
                            getComponentNameFromType(type) || "Unknown"
                          )
                        );
                      b: {
                        replay = void 0;
                        type = node$jscomp$0[5];
                        ref = node$jscomp$0[2];
                        name = node$jscomp$0[3];
                        keyOrIndex = null === node$jscomp$0[4] ? [] : node$jscomp$0[4][2];
                        node$jscomp$0 = null === node$jscomp$0[4] ? null : node$jscomp$0[4][3];
                        var prevKeyPath = task.keyPath, prevContext = task.formatContext, prevRow = task.row, previousReplaySet = task.replay, parentBoundary = task.blockedBoundary, parentHoistableState = task.hoistableState, content = props.children, fallback = props.fallback, fallbackAbortSet = /* @__PURE__ */ new Set();
                        props = createSuspenseBoundary(
                          request,
                          task.row,
                          fallbackAbortSet,
                          null,
                          null
                        );
                        props.parentFlushed = true;
                        props.rootSegmentID = type;
                        task.blockedBoundary = props;
                        task.hoistableState = props.contentState;
                        task.keyPath = key;
                        task.formatContext = getSuspenseContentFormatContext(
                          request.resumableState,
                          prevContext
                        );
                        task.row = null;
                        task.replay = {
                          nodes: ref,
                          slots: name,
                          pendingTasks: 1
                        };
                        try {
                          renderNode2(request, task, content, -1);
                          if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
                            throw Error(formatProdErrorMessage(488));
                          task.replay.pendingTasks--;
                          if (0 === props.pendingTasks && 0 === props.status) {
                            props.status = 1;
                            request.completedBoundaries.push(props);
                            break b;
                          }
                        } catch (error2) {
                          props.status = 4, childNodes = getThrownInfo(task.componentStack), replay = logRecoverableError(
                            request,
                            error2,
                            childNodes
                          ), props.errorDigest = replay, task.replay.pendingTasks--, request.clientRenderedBoundaries.push(props);
                        } finally {
                          task.blockedBoundary = parentBoundary, task.hoistableState = parentHoistableState, task.replay = previousReplaySet, task.keyPath = prevKeyPath, task.formatContext = prevContext, task.row = prevRow;
                        }
                        childNodes = createReplayTask(
                          request,
                          null,
                          {
                            nodes: keyOrIndex,
                            slots: node$jscomp$0,
                            pendingTasks: 0
                          },
                          fallback,
                          -1,
                          parentBoundary,
                          props.fallbackState,
                          fallbackAbortSet,
                          [key[0], "Suspense Fallback", key[2]],
                          getSuspenseFallbackFormatContext(
                            request.resumableState,
                            task.formatContext
                          ),
                          task.context,
                          task.treeContext,
                          task.row,
                          replaceSuspenseComponentStackWithSuspenseFallbackStack(
                            task.componentStack
                          )
                        );
                        pushComponentStack(childNodes);
                        request.pingedTasks.push(childNodes);
                      }
                    }
                    childIndex.splice(node, 1);
                    break a;
                  }
                }
              }
            else renderElement2(request, task, key, type, props, ref);
            return;
          case REACT_PORTAL_TYPE:
            throw Error(formatProdErrorMessage(257));
          case REACT_LAZY_TYPE:
            childNodes = node._init;
            node = childNodes(node._payload);
            if (12 === request.status) throw null;
            renderNodeDestructive(request, task, node, childIndex);
            return;
        }
        if (isArrayImpl(node)) {
          renderChildrenArray(request, task, node, childIndex);
          return;
        }
        if (childNodes = getIteratorFn(node)) {
          if (childNodes = childNodes.call(node)) {
            node = childNodes.next();
            if (!node.done) {
              props = [];
              do
                props.push(node.value), node = childNodes.next();
              while (!node.done);
              renderChildrenArray(request, task, props, childIndex);
            }
            return;
          }
        }
        if ("function" === typeof node.then)
          return task.thenableState = null, renderNodeDestructive(request, task, unwrapThenable(node), childIndex);
        if (node.$$typeof === REACT_CONTEXT_TYPE)
          return renderNodeDestructive(
            request,
            task,
            node._currentValue2,
            childIndex
          );
        childIndex = Object.prototype.toString.call(node);
        throw Error(
          formatProdErrorMessage(
            31,
            "[object Object]" === childIndex ? "object with keys {" + Object.keys(node).join(", ") + "}" : childIndex
          )
        );
      }
      if ("string" === typeof node)
        childIndex = task.blockedSegment, null !== childIndex && (childIndex.lastPushedText = pushTextInstance(
          childIndex.chunks,
          node,
          request.renderState,
          childIndex.lastPushedText
        ));
      else if ("number" === typeof node || "bigint" === typeof node)
        childIndex = task.blockedSegment, null !== childIndex && (childIndex.lastPushedText = pushTextInstance(
          childIndex.chunks,
          "" + node,
          request.renderState,
          childIndex.lastPushedText
        ));
    }
  }
  function renderChildrenArray(request, task, children, childIndex) {
    var prevKeyPath = task.keyPath;
    if (-1 !== childIndex && (task.keyPath = [task.keyPath, "Fragment", childIndex], null !== task.replay)) {
      for (var replay = task.replay, replayNodes = replay.nodes, j = 0; j < replayNodes.length; j++) {
        var node = replayNodes[j];
        if (node[1] === childIndex) {
          childIndex = node[2];
          node = node[3];
          task.replay = { nodes: childIndex, slots: node, pendingTasks: 1 };
          try {
            renderChildrenArray(request, task, children, -1);
            if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
              throw Error(formatProdErrorMessage(488));
            task.replay.pendingTasks--;
          } catch (x) {
            if ("object" === typeof x && null !== x && (x === SuspenseException || "function" === typeof x.then))
              throw x;
            task.replay.pendingTasks--;
            children = getThrownInfo(task.componentStack);
            var boundary = task.blockedBoundary, error2 = x;
            children = logRecoverableError(request, error2, children);
            abortRemainingReplayNodes(
              request,
              boundary,
              childIndex,
              node,
              error2,
              children
            );
          }
          task.replay = replay;
          replayNodes.splice(j, 1);
          break;
        }
      }
      task.keyPath = prevKeyPath;
      return;
    }
    replay = task.treeContext;
    replayNodes = children.length;
    if (null !== task.replay && (j = task.replay.slots, null !== j && "object" === typeof j)) {
      for (childIndex = 0; childIndex < replayNodes; childIndex++)
        node = children[childIndex], task.treeContext = pushTreeContext(replay, replayNodes, childIndex), boundary = j[childIndex], "number" === typeof boundary ? (resumeNode(request, task, boundary, node, childIndex), delete j[childIndex]) : renderNode2(request, task, node, childIndex);
      task.treeContext = replay;
      task.keyPath = prevKeyPath;
      return;
    }
    for (j = 0; j < replayNodes; j++)
      childIndex = children[j], task.treeContext = pushTreeContext(replay, replayNodes, j), renderNode2(request, task, childIndex, j);
    task.treeContext = replay;
    task.keyPath = prevKeyPath;
  }
  function trackPostponedBoundary(request, trackedPostpones, boundary) {
    boundary.status = 5;
    boundary.rootSegmentID = request.nextSegmentId++;
    request = boundary.trackedContentKeyPath;
    if (null === request) throw Error(formatProdErrorMessage(486));
    var fallbackReplayNode = boundary.trackedFallbackNode, children = [], boundaryNode = trackedPostpones.workingMap.get(request);
    if (void 0 === boundaryNode)
      return boundary = [
        request[1],
        request[2],
        children,
        null,
        fallbackReplayNode,
        boundary.rootSegmentID
      ], trackedPostpones.workingMap.set(request, boundary), addToReplayParent(boundary, request[0], trackedPostpones), boundary;
    boundaryNode[4] = fallbackReplayNode;
    boundaryNode[5] = boundary.rootSegmentID;
    return boundaryNode;
  }
  function trackPostpone(request, trackedPostpones, task, segment) {
    segment.status = 5;
    var keyPath = task.keyPath, boundary = task.blockedBoundary;
    if (null === boundary)
      segment.id = request.nextSegmentId++, trackedPostpones.rootSlots = segment.id, null !== request.completedRootSegment && (request.completedRootSegment.status = 5);
    else {
      if (null !== boundary && 0 === boundary.status) {
        var boundaryNode = trackPostponedBoundary(
          request,
          trackedPostpones,
          boundary
        );
        if (boundary.trackedContentKeyPath === keyPath && -1 === task.childIndex) {
          -1 === segment.id && (segment.id = segment.parentFlushed ? boundary.rootSegmentID : request.nextSegmentId++);
          boundaryNode[3] = segment.id;
          return;
        }
      }
      -1 === segment.id && (segment.id = segment.parentFlushed && null !== boundary ? boundary.rootSegmentID : request.nextSegmentId++);
      if (-1 === task.childIndex)
        null === keyPath ? trackedPostpones.rootSlots = segment.id : (task = trackedPostpones.workingMap.get(keyPath), void 0 === task ? (task = [keyPath[1], keyPath[2], [], segment.id], addToReplayParent(task, keyPath[0], trackedPostpones)) : task[3] = segment.id);
      else {
        if (null === keyPath)
          if (request = trackedPostpones.rootSlots, null === request)
            request = trackedPostpones.rootSlots = {};
          else {
            if ("number" === typeof request)
              throw Error(formatProdErrorMessage(491));
          }
        else if (boundary = trackedPostpones.workingMap, boundaryNode = boundary.get(keyPath), void 0 === boundaryNode)
          request = {}, boundaryNode = [keyPath[1], keyPath[2], [], request], boundary.set(keyPath, boundaryNode), addToReplayParent(boundaryNode, keyPath[0], trackedPostpones);
        else if (request = boundaryNode[3], null === request)
          request = boundaryNode[3] = {};
        else if ("number" === typeof request)
          throw Error(formatProdErrorMessage(491));
        request[task.childIndex] = segment.id;
      }
    }
  }
  function untrackBoundary(request, boundary) {
    request = request.trackedPostpones;
    null !== request && (boundary = boundary.trackedContentKeyPath, null !== boundary && (boundary = request.workingMap.get(boundary), void 0 !== boundary && (boundary.length = 4, boundary[2] = [], boundary[3] = null)));
  }
  function spawnNewSuspendedReplayTask(request, task, thenableState2) {
    return createReplayTask(
      request,
      thenableState2,
      task.replay,
      task.node,
      task.childIndex,
      task.blockedBoundary,
      task.hoistableState,
      task.abortSet,
      task.keyPath,
      task.formatContext,
      task.context,
      task.treeContext,
      task.row,
      task.componentStack
    );
  }
  function spawnNewSuspendedRenderTask(request, task, thenableState2) {
    var segment = task.blockedSegment, newSegment = createPendingSegment(
      request,
      segment.chunks.length,
      null,
      task.formatContext,
      segment.lastPushedText,
      true
    );
    segment.children.push(newSegment);
    segment.lastPushedText = false;
    return createRenderTask(
      request,
      thenableState2,
      task.node,
      task.childIndex,
      task.blockedBoundary,
      newSegment,
      task.blockedPreamble,
      task.hoistableState,
      task.abortSet,
      task.keyPath,
      task.formatContext,
      task.context,
      task.treeContext,
      task.row,
      task.componentStack
    );
  }
  function renderNode2(request, task, node, childIndex) {
    var previousFormatContext = task.formatContext, previousContext = task.context, previousKeyPath = task.keyPath, previousTreeContext = task.treeContext, previousComponentStack = task.componentStack, segment = task.blockedSegment;
    if (null === segment) {
      segment = task.replay;
      try {
        return renderNodeDestructive(request, task, node, childIndex);
      } catch (thrownValue) {
        if (resetHooksState(), node = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue, 12 !== request.status && "object" === typeof node && null !== node) {
          if ("function" === typeof node.then) {
            childIndex = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
            request = spawnNewSuspendedReplayTask(request, task, childIndex).ping;
            node.then(request, request);
            task.formatContext = previousFormatContext;
            task.context = previousContext;
            task.keyPath = previousKeyPath;
            task.treeContext = previousTreeContext;
            task.componentStack = previousComponentStack;
            task.replay = segment;
            switchContext(previousContext);
            return;
          }
          if ("Maximum call stack size exceeded" === node.message) {
            node = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
            node = spawnNewSuspendedReplayTask(request, task, node);
            request.pingedTasks.push(node);
            task.formatContext = previousFormatContext;
            task.context = previousContext;
            task.keyPath = previousKeyPath;
            task.treeContext = previousTreeContext;
            task.componentStack = previousComponentStack;
            task.replay = segment;
            switchContext(previousContext);
            return;
          }
        }
      }
    } else {
      var childrenLength = segment.children.length, chunkLength = segment.chunks.length;
      try {
        return renderNodeDestructive(request, task, node, childIndex);
      } catch (thrownValue$62) {
        if (resetHooksState(), segment.children.length = childrenLength, segment.chunks.length = chunkLength, node = thrownValue$62 === SuspenseException ? getSuspendedThenable() : thrownValue$62, 12 !== request.status && "object" === typeof node && null !== node) {
          if ("function" === typeof node.then) {
            segment = node;
            node = thrownValue$62 === SuspenseException ? getThenableStateAfterSuspending() : null;
            request = spawnNewSuspendedRenderTask(request, task, node).ping;
            segment.then(request, request);
            task.formatContext = previousFormatContext;
            task.context = previousContext;
            task.keyPath = previousKeyPath;
            task.treeContext = previousTreeContext;
            task.componentStack = previousComponentStack;
            switchContext(previousContext);
            return;
          }
          if ("Maximum call stack size exceeded" === node.message) {
            segment = thrownValue$62 === SuspenseException ? getThenableStateAfterSuspending() : null;
            segment = spawnNewSuspendedRenderTask(request, task, segment);
            request.pingedTasks.push(segment);
            task.formatContext = previousFormatContext;
            task.context = previousContext;
            task.keyPath = previousKeyPath;
            task.treeContext = previousTreeContext;
            task.componentStack = previousComponentStack;
            switchContext(previousContext);
            return;
          }
        }
      }
    }
    task.formatContext = previousFormatContext;
    task.context = previousContext;
    task.keyPath = previousKeyPath;
    task.treeContext = previousTreeContext;
    switchContext(previousContext);
    throw node;
  }
  function abortTaskSoft(task) {
    var boundary = task.blockedBoundary, segment = task.blockedSegment;
    null !== segment && (segment.status = 3, finishedTask(this, boundary, task.row, segment));
  }
  function abortRemainingReplayNodes(request$jscomp$0, boundary, nodes, slots, error2, errorDigest$jscomp$0) {
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (4 === node.length)
        abortRemainingReplayNodes(
          request$jscomp$0,
          boundary,
          node[2],
          node[3],
          error2,
          errorDigest$jscomp$0
        );
      else {
        node = node[5];
        var request = request$jscomp$0, errorDigest = errorDigest$jscomp$0, resumedBoundary = createSuspenseBoundary(
          request,
          null,
          /* @__PURE__ */ new Set(),
          null,
          null
        );
        resumedBoundary.parentFlushed = true;
        resumedBoundary.rootSegmentID = node;
        resumedBoundary.status = 4;
        resumedBoundary.errorDigest = errorDigest;
        resumedBoundary.parentFlushed && request.clientRenderedBoundaries.push(resumedBoundary);
      }
    }
    nodes.length = 0;
    if (null !== slots) {
      if (null === boundary) throw Error(formatProdErrorMessage(487));
      4 !== boundary.status && (boundary.status = 4, boundary.errorDigest = errorDigest$jscomp$0, boundary.parentFlushed && request$jscomp$0.clientRenderedBoundaries.push(boundary));
      if ("object" === typeof slots) for (var index in slots) delete slots[index];
    }
  }
  function abortTask(task, request, error2) {
    var boundary = task.blockedBoundary, segment = task.blockedSegment;
    if (null !== segment) {
      if (6 === segment.status) return;
      segment.status = 3;
    }
    var errorInfo = getThrownInfo(task.componentStack);
    if (null === boundary) {
      if (13 !== request.status && 14 !== request.status) {
        boundary = task.replay;
        if (null === boundary) {
          null !== request.trackedPostpones && null !== segment ? (boundary = request.trackedPostpones, logRecoverableError(request, error2, errorInfo), trackPostpone(request, boundary, task, segment), finishedTask(request, null, task.row, segment)) : (logRecoverableError(request, error2, errorInfo), fatalError(request, error2));
          return;
        }
        boundary.pendingTasks--;
        0 === boundary.pendingTasks && 0 < boundary.nodes.length && (segment = logRecoverableError(request, error2, errorInfo), abortRemainingReplayNodes(
          request,
          null,
          boundary.nodes,
          boundary.slots,
          error2,
          segment
        ));
        request.pendingRootTasks--;
        0 === request.pendingRootTasks && completeShell(request);
      }
    } else {
      var trackedPostpones$63 = request.trackedPostpones;
      if (4 !== boundary.status) {
        if (null !== trackedPostpones$63 && null !== segment)
          return logRecoverableError(request, error2, errorInfo), trackPostpone(request, trackedPostpones$63, task, segment), boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
            return abortTask(fallbackTask, request, error2);
          }), boundary.fallbackAbortableTasks.clear(), finishedTask(request, boundary, task.row, segment);
        boundary.status = 4;
        segment = logRecoverableError(request, error2, errorInfo);
        boundary.status = 4;
        boundary.errorDigest = segment;
        untrackBoundary(request, boundary);
        boundary.parentFlushed && request.clientRenderedBoundaries.push(boundary);
      }
      boundary.pendingTasks--;
      segment = boundary.row;
      null !== segment && 0 === --segment.pendingTasks && finishSuspenseListRow(request, segment);
      boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
        return abortTask(fallbackTask, request, error2);
      });
      boundary.fallbackAbortableTasks.clear();
    }
    task = task.row;
    null !== task && 0 === --task.pendingTasks && finishSuspenseListRow(request, task);
    request.allPendingTasks--;
    0 === request.allPendingTasks && completeAll(request);
  }
  function safelyEmitEarlyPreloads(request, shellComplete) {
    try {
      var renderState = request.renderState, onHeaders = renderState.onHeaders;
      if (onHeaders) {
        var headers = renderState.headers;
        if (headers) {
          renderState.headers = null;
          var linkHeader = headers.preconnects;
          headers.fontPreloads && (linkHeader && (linkHeader += ", "), linkHeader += headers.fontPreloads);
          headers.highImagePreloads && (linkHeader && (linkHeader += ", "), linkHeader += headers.highImagePreloads);
          if (!shellComplete) {
            var queueIter = renderState.styles.values(), queueStep = queueIter.next();
            b: for (; 0 < headers.remainingCapacity && !queueStep.done; queueStep = queueIter.next())
              for (var sheetIter = queueStep.value.sheets.values(), sheetStep = sheetIter.next(); 0 < headers.remainingCapacity && !sheetStep.done; sheetStep = sheetIter.next()) {
                var sheet = sheetStep.value, props = sheet.props, key = props.href, props$jscomp$0 = sheet.props, header = getPreloadAsHeader(props$jscomp$0.href, "style", {
                  crossOrigin: props$jscomp$0.crossOrigin,
                  integrity: props$jscomp$0.integrity,
                  nonce: props$jscomp$0.nonce,
                  type: props$jscomp$0.type,
                  fetchPriority: props$jscomp$0.fetchPriority,
                  referrerPolicy: props$jscomp$0.referrerPolicy,
                  media: props$jscomp$0.media
                });
                if (0 <= (headers.remainingCapacity -= header.length + 2))
                  renderState.resets.style[key] = PRELOAD_NO_CREDS, linkHeader && (linkHeader += ", "), linkHeader += header, renderState.resets.style[key] = "string" === typeof props.crossOrigin || "string" === typeof props.integrity ? [props.crossOrigin, props.integrity] : PRELOAD_NO_CREDS;
                else break b;
              }
          }
          linkHeader ? onHeaders({ Link: linkHeader }) : onHeaders({});
        }
      }
    } catch (error2) {
      logRecoverableError(request, error2, {});
    }
  }
  function completeShell(request) {
    null === request.trackedPostpones && safelyEmitEarlyPreloads(request, true);
    null === request.trackedPostpones && preparePreamble(request);
    request.onShellError = noop;
    request = request.onShellReady;
    request();
  }
  function completeAll(request) {
    safelyEmitEarlyPreloads(
      request,
      null === request.trackedPostpones ? true : null === request.completedRootSegment || 5 !== request.completedRootSegment.status
    );
    preparePreamble(request);
    request = request.onAllReady;
    request();
  }
  function queueCompletedSegment(boundary, segment) {
    if (0 === segment.chunks.length && 1 === segment.children.length && null === segment.children[0].boundary && -1 === segment.children[0].id) {
      var childSegment = segment.children[0];
      childSegment.id = segment.id;
      childSegment.parentFlushed = true;
      1 !== childSegment.status && 3 !== childSegment.status && 4 !== childSegment.status || queueCompletedSegment(boundary, childSegment);
    } else boundary.completedSegments.push(segment);
  }
  function finishedTask(request, boundary, row, segment) {
    null !== row && (0 === --row.pendingTasks ? finishSuspenseListRow(request, row) : row.together && tryToResolveTogetherRow(request, row));
    request.allPendingTasks--;
    if (null === boundary) {
      if (null !== segment && segment.parentFlushed) {
        if (null !== request.completedRootSegment)
          throw Error(formatProdErrorMessage(389));
        request.completedRootSegment = segment;
      }
      request.pendingRootTasks--;
      0 === request.pendingRootTasks && completeShell(request);
    } else if (boundary.pendingTasks--, 4 !== boundary.status)
      if (0 === boundary.pendingTasks)
        if (0 === boundary.status && (boundary.status = 1), null !== segment && segment.parentFlushed && (1 === segment.status || 3 === segment.status) && queueCompletedSegment(boundary, segment), boundary.parentFlushed && request.completedBoundaries.push(boundary), 1 === boundary.status)
          row = boundary.row, null !== row && hoistHoistables(row.hoistables, boundary.contentState), isEligibleForOutlining(request, boundary) || (boundary.fallbackAbortableTasks.forEach(abortTaskSoft, request), boundary.fallbackAbortableTasks.clear(), null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row)), 0 === request.pendingRootTasks && null === request.trackedPostpones && null !== boundary.contentPreamble && preparePreamble(request);
        else {
          if (5 === boundary.status && (boundary = boundary.row, null !== boundary)) {
            if (null !== request.trackedPostpones) {
              row = request.trackedPostpones;
              var postponedRow = boundary.next;
              if (null !== postponedRow && (segment = postponedRow.boundaries, null !== segment))
                for (postponedRow.boundaries = null, postponedRow = 0; postponedRow < segment.length; postponedRow++) {
                  var postponedBoundary = segment[postponedRow];
                  trackPostponedBoundary(request, row, postponedBoundary);
                  finishedTask(request, postponedBoundary, null, null);
                }
            }
            0 === --boundary.pendingTasks && finishSuspenseListRow(request, boundary);
          }
        }
      else
        null === segment || !segment.parentFlushed || 1 !== segment.status && 3 !== segment.status || (queueCompletedSegment(boundary, segment), 1 === boundary.completedSegments.length && boundary.parentFlushed && request.partialBoundaries.push(boundary)), boundary = boundary.row, null !== boundary && boundary.together && tryToResolveTogetherRow(request, boundary);
    0 === request.allPendingTasks && completeAll(request);
  }
  function performWork(request$jscomp$2) {
    if (14 !== request$jscomp$2.status && 13 !== request$jscomp$2.status) {
      var prevContext = currentActiveSnapshot, prevDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = HooksDispatcher;
      var prevAsyncDispatcher = ReactSharedInternals.A;
      ReactSharedInternals.A = DefaultAsyncDispatcher;
      var prevRequest = currentRequest;
      currentRequest = request$jscomp$2;
      var prevResumableState = currentResumableState;
      currentResumableState = request$jscomp$2.resumableState;
      try {
        var pingedTasks = request$jscomp$2.pingedTasks, i;
        for (i = 0; i < pingedTasks.length; i++) {
          var task = pingedTasks[i], request = request$jscomp$2, segment = task.blockedSegment;
          if (null === segment) {
            var request$jscomp$0 = request;
            if (0 !== task.replay.pendingTasks) {
              switchContext(task.context);
              try {
                "number" === typeof task.replay.slots ? resumeNode(
                  request$jscomp$0,
                  task,
                  task.replay.slots,
                  task.node,
                  task.childIndex
                ) : retryNode(request$jscomp$0, task);
                if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
                  throw Error(formatProdErrorMessage(488));
                task.replay.pendingTasks--;
                task.abortSet.delete(task);
                finishedTask(
                  request$jscomp$0,
                  task.blockedBoundary,
                  task.row,
                  null
                );
              } catch (thrownValue) {
                resetHooksState();
                var x = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue;
                if ("object" === typeof x && null !== x && "function" === typeof x.then) {
                  var ping = task.ping;
                  x.then(ping, ping);
                  task.thenableState = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
                } else {
                  task.replay.pendingTasks--;
                  task.abortSet.delete(task);
                  var errorInfo = getThrownInfo(task.componentStack);
                  request = void 0;
                  var request$jscomp$1 = request$jscomp$0, boundary = task.blockedBoundary, error$jscomp$0 = 12 === request$jscomp$0.status ? request$jscomp$0.fatalError : x, replayNodes = task.replay.nodes, resumeSlots = task.replay.slots;
                  request = logRecoverableError(
                    request$jscomp$1,
                    error$jscomp$0,
                    errorInfo
                  );
                  abortRemainingReplayNodes(
                    request$jscomp$1,
                    boundary,
                    replayNodes,
                    resumeSlots,
                    error$jscomp$0,
                    request
                  );
                  request$jscomp$0.pendingRootTasks--;
                  0 === request$jscomp$0.pendingRootTasks && completeShell(request$jscomp$0);
                  request$jscomp$0.allPendingTasks--;
                  0 === request$jscomp$0.allPendingTasks && completeAll(request$jscomp$0);
                }
              } finally {
              }
            }
          } else if (request$jscomp$0 = void 0, request$jscomp$1 = segment, 0 === request$jscomp$1.status) {
            request$jscomp$1.status = 6;
            switchContext(task.context);
            var childrenLength = request$jscomp$1.children.length, chunkLength = request$jscomp$1.chunks.length;
            try {
              retryNode(request, task), pushSegmentFinale(
                request$jscomp$1.chunks,
                request.renderState,
                request$jscomp$1.lastPushedText,
                request$jscomp$1.textEmbedded
              ), task.abortSet.delete(task), request$jscomp$1.status = 1, finishedTask(
                request,
                task.blockedBoundary,
                task.row,
                request$jscomp$1
              );
            } catch (thrownValue) {
              resetHooksState();
              request$jscomp$1.children.length = childrenLength;
              request$jscomp$1.chunks.length = chunkLength;
              var x$jscomp$0 = thrownValue === SuspenseException ? getSuspendedThenable() : 12 === request.status ? request.fatalError : thrownValue;
              if (12 === request.status && null !== request.trackedPostpones) {
                var trackedPostpones = request.trackedPostpones, thrownInfo = getThrownInfo(task.componentStack);
                task.abortSet.delete(task);
                logRecoverableError(request, x$jscomp$0, thrownInfo);
                trackPostpone(request, trackedPostpones, task, request$jscomp$1);
                finishedTask(
                  request,
                  task.blockedBoundary,
                  task.row,
                  request$jscomp$1
                );
              } else if ("object" === typeof x$jscomp$0 && null !== x$jscomp$0 && "function" === typeof x$jscomp$0.then) {
                request$jscomp$1.status = 0;
                task.thenableState = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
                var ping$jscomp$0 = task.ping;
                x$jscomp$0.then(ping$jscomp$0, ping$jscomp$0);
              } else {
                var errorInfo$jscomp$0 = getThrownInfo(task.componentStack);
                task.abortSet.delete(task);
                request$jscomp$1.status = 4;
                var boundary$jscomp$0 = task.blockedBoundary, row = task.row;
                null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row);
                request.allPendingTasks--;
                request$jscomp$0 = logRecoverableError(
                  request,
                  x$jscomp$0,
                  errorInfo$jscomp$0
                );
                if (null === boundary$jscomp$0) fatalError(request, x$jscomp$0);
                else if (boundary$jscomp$0.pendingTasks--, 4 !== boundary$jscomp$0.status) {
                  boundary$jscomp$0.status = 4;
                  boundary$jscomp$0.errorDigest = request$jscomp$0;
                  untrackBoundary(request, boundary$jscomp$0);
                  var boundaryRow = boundary$jscomp$0.row;
                  null !== boundaryRow && 0 === --boundaryRow.pendingTasks && finishSuspenseListRow(request, boundaryRow);
                  boundary$jscomp$0.parentFlushed && request.clientRenderedBoundaries.push(boundary$jscomp$0);
                  0 === request.pendingRootTasks && null === request.trackedPostpones && null !== boundary$jscomp$0.contentPreamble && preparePreamble(request);
                }
                0 === request.allPendingTasks && completeAll(request);
              }
            } finally {
            }
          }
        }
        pingedTasks.splice(0, i);
        null !== request$jscomp$2.destination && flushCompletedQueues(request$jscomp$2, request$jscomp$2.destination);
      } catch (error2) {
        logRecoverableError(request$jscomp$2, error2, {}), fatalError(request$jscomp$2, error2);
      } finally {
        currentResumableState = prevResumableState, ReactSharedInternals.H = prevDispatcher, ReactSharedInternals.A = prevAsyncDispatcher, prevDispatcher === HooksDispatcher && switchContext(prevContext), currentRequest = prevRequest;
      }
    }
  }
  function preparePreambleFromSubtree(request, segment, collectedPreambleSegments) {
    segment.preambleChildren.length && collectedPreambleSegments.push(segment.preambleChildren);
    for (var pendingPreambles = false, i = 0; i < segment.children.length; i++)
      pendingPreambles = preparePreambleFromSegment(
        request,
        segment.children[i],
        collectedPreambleSegments
      ) || pendingPreambles;
    return pendingPreambles;
  }
  function preparePreambleFromSegment(request, segment, collectedPreambleSegments) {
    var boundary = segment.boundary;
    if (null === boundary)
      return preparePreambleFromSubtree(
        request,
        segment,
        collectedPreambleSegments
      );
    var preamble = boundary.contentPreamble, fallbackPreamble = boundary.fallbackPreamble;
    if (null === preamble || null === fallbackPreamble) return false;
    switch (boundary.status) {
      case 1:
        hoistPreambleState(request.renderState, preamble);
        request.byteSize += boundary.byteSize;
        segment = boundary.completedSegments[0];
        if (!segment) throw Error(formatProdErrorMessage(391));
        return preparePreambleFromSubtree(
          request,
          segment,
          collectedPreambleSegments
        );
      case 5:
        if (null !== request.trackedPostpones) return true;
      case 4:
        if (1 === segment.status)
          return hoistPreambleState(request.renderState, fallbackPreamble), preparePreambleFromSubtree(
            request,
            segment,
            collectedPreambleSegments
          );
      default:
        return true;
    }
  }
  function preparePreamble(request) {
    if (request.completedRootSegment && null === request.completedPreambleSegments) {
      var collectedPreambleSegments = [], originalRequestByteSize = request.byteSize, hasPendingPreambles = preparePreambleFromSegment(
        request,
        request.completedRootSegment,
        collectedPreambleSegments
      ), preamble = request.renderState.preamble;
      false === hasPendingPreambles || preamble.headChunks && preamble.bodyChunks ? request.completedPreambleSegments = collectedPreambleSegments : request.byteSize = originalRequestByteSize;
    }
  }
  function flushSubtree(request, destination, segment, hoistableState) {
    segment.parentFlushed = true;
    switch (segment.status) {
      case 0:
        segment.id = request.nextSegmentId++;
      case 5:
        return hoistableState = segment.id, segment.lastPushedText = false, segment.textEmbedded = false, request = request.renderState, destination.push('<template id="'), destination.push(request.placeholderPrefix), request = hoistableState.toString(16), destination.push(request), destination.push('"></template>');
      case 1:
        segment.status = 2;
        var r = true, chunks = segment.chunks, chunkIdx = 0;
        segment = segment.children;
        for (var childIdx = 0; childIdx < segment.length; childIdx++) {
          for (r = segment[childIdx]; chunkIdx < r.index; chunkIdx++)
            destination.push(chunks[chunkIdx]);
          r = flushSegment(request, destination, r, hoistableState);
        }
        for (; chunkIdx < chunks.length - 1; chunkIdx++)
          destination.push(chunks[chunkIdx]);
        chunkIdx < chunks.length && (r = destination.push(chunks[chunkIdx]));
        return r;
      case 3:
        return true;
      default:
        throw Error(formatProdErrorMessage(390));
    }
  }
  var flushedByteSize = 0;
  function flushSegment(request, destination, segment, hoistableState) {
    var boundary = segment.boundary;
    if (null === boundary)
      return flushSubtree(request, destination, segment, hoistableState);
    boundary.parentFlushed = true;
    if (4 === boundary.status) {
      var row = boundary.row;
      null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row);
      request.renderState.generateStaticMarkup || (boundary = boundary.errorDigest, destination.push("<!--$!-->"), destination.push("<template"), boundary && (destination.push(' data-dgst="'), boundary = escapeTextForBrowser(boundary), destination.push(boundary), destination.push('"')), destination.push("></template>"));
      flushSubtree(request, destination, segment, hoistableState);
      request = request.renderState.generateStaticMarkup ? true : destination.push("<!--/$-->");
      return request;
    }
    if (1 !== boundary.status)
      return 0 === boundary.status && (boundary.rootSegmentID = request.nextSegmentId++), 0 < boundary.completedSegments.length && request.partialBoundaries.push(boundary), writeStartPendingSuspenseBoundary(
        destination,
        request.renderState,
        boundary.rootSegmentID
      ), hoistableState && hoistHoistables(hoistableState, boundary.fallbackState), flushSubtree(request, destination, segment, hoistableState), destination.push("<!--/$-->");
    if (!flushingPartialBoundaries && isEligibleForOutlining(request, boundary) && flushedByteSize + boundary.byteSize > request.progressiveChunkSize)
      return boundary.rootSegmentID = request.nextSegmentId++, request.completedBoundaries.push(boundary), writeStartPendingSuspenseBoundary(
        destination,
        request.renderState,
        boundary.rootSegmentID
      ), flushSubtree(request, destination, segment, hoistableState), destination.push("<!--/$-->");
    flushedByteSize += boundary.byteSize;
    hoistableState && hoistHoistables(hoistableState, boundary.contentState);
    segment = boundary.row;
    null !== segment && isEligibleForOutlining(request, boundary) && 0 === --segment.pendingTasks && finishSuspenseListRow(request, segment);
    request.renderState.generateStaticMarkup || destination.push("<!--$-->");
    segment = boundary.completedSegments;
    if (1 !== segment.length) throw Error(formatProdErrorMessage(391));
    flushSegment(request, destination, segment[0], hoistableState);
    request = request.renderState.generateStaticMarkup ? true : destination.push("<!--/$-->");
    return request;
  }
  function flushSegmentContainer(request, destination, segment, hoistableState) {
    writeStartSegment(
      destination,
      request.renderState,
      segment.parentFormatContext,
      segment.id
    );
    flushSegment(request, destination, segment, hoistableState);
    return writeEndSegment(destination, segment.parentFormatContext);
  }
  function flushCompletedBoundary(request, destination, boundary) {
    flushedByteSize = boundary.byteSize;
    for (var completedSegments = boundary.completedSegments, i = 0; i < completedSegments.length; i++)
      flushPartiallyCompletedSegment(
        request,
        destination,
        boundary,
        completedSegments[i]
      );
    completedSegments.length = 0;
    completedSegments = boundary.row;
    null !== completedSegments && isEligibleForOutlining(request, boundary) && 0 === --completedSegments.pendingTasks && finishSuspenseListRow(request, completedSegments);
    writeHoistablesForBoundary(
      destination,
      boundary.contentState,
      request.renderState
    );
    completedSegments = request.resumableState;
    request = request.renderState;
    i = boundary.rootSegmentID;
    boundary = boundary.contentState;
    var requiresStyleInsertion = request.stylesToHoist;
    request.stylesToHoist = false;
    destination.push(request.startInlineScript);
    destination.push(">");
    requiresStyleInsertion ? (0 === (completedSegments.instructions & 4) && (completedSegments.instructions |= 4, destination.push(
      '$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};'
    )), 0 === (completedSegments.instructions & 2) && (completedSegments.instructions |= 2, destination.push(
      '$RB=[];$RV=function(a){$RT=performance.now();for(var b=0;b<a.length;b+=2){var c=a[b],e=a[b+1];null!==e.parentNode&&e.parentNode.removeChild(e);var f=c.parentNode;if(f){var g=c.previousSibling,h=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d||"/&"===d)if(0===h)break;else h--;else"$"!==d&&"$?"!==d&&"$~"!==d&&"$!"!==d&&"&"!==d||h++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;e.firstChild;)f.insertBefore(e.firstChild,c);g.data="$";g._reactRetry&&requestAnimationFrame(g._reactRetry)}}a.length=0};\n$RC=function(a,b){if(b=document.getElementById(b))(a=document.getElementById(a))?(a.previousSibling.data="$~",$RB.push(a,b),2===$RB.length&&("number"!==typeof $RT?requestAnimationFrame($RV.bind(null,$RB)):(a=performance.now(),setTimeout($RV.bind(null,$RB),2300>a&&2E3<a?2300-a:$RT+300-a)))):b.parentNode.removeChild(b)};'
    )), 0 === (completedSegments.instructions & 8) ? (completedSegments.instructions |= 8, destination.push(
      '$RM=new Map;$RR=function(n,w,p){function u(q){this._p=null;q()}for(var r=new Map,t=document,h,b,e=t.querySelectorAll("link[data-precedence],style[data-precedence]"),v=[],k=0;b=e[k++];)"not all"===b.getAttribute("media")?v.push(b):("LINK"===b.tagName&&$RM.set(b.getAttribute("href"),b),r.set(b.dataset.precedence,h=b));e=0;b=[];var l,a;for(k=!0;;){if(k){var f=p[e++];if(!f){k=!1;e=0;continue}var c=!1,m=0;var d=f[m++];if(a=$RM.get(d)){var g=a._p;c=!0}else{a=t.createElement("link");a.href=d;a.rel=\n"stylesheet";for(a.dataset.precedence=l=f[m++];g=f[m++];)a.setAttribute(g,f[m++]);g=a._p=new Promise(function(q,x){a.onload=u.bind(a,q);a.onerror=u.bind(a,x)});$RM.set(d,a)}d=a.getAttribute("media");!g||d&&!matchMedia(d).matches||b.push(g);if(c)continue}else{a=v[e++];if(!a)break;l=a.getAttribute("data-precedence");a.removeAttribute("media")}c=r.get(l)||h;c===h&&(h=a);r.set(l,a);c?c.parentNode.insertBefore(a,c.nextSibling):(c=t.head,c.insertBefore(a,c.firstChild))}if(p=document.getElementById(n))p.previousSibling.data=\n"$~";Promise.all(b).then($RC.bind(null,n,w),$RX.bind(null,n,"CSS failed to load"))};$RR("'
    )) : destination.push('$RR("')) : (0 === (completedSegments.instructions & 2) && (completedSegments.instructions |= 2, destination.push(
      '$RB=[];$RV=function(a){$RT=performance.now();for(var b=0;b<a.length;b+=2){var c=a[b],e=a[b+1];null!==e.parentNode&&e.parentNode.removeChild(e);var f=c.parentNode;if(f){var g=c.previousSibling,h=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d||"/&"===d)if(0===h)break;else h--;else"$"!==d&&"$?"!==d&&"$~"!==d&&"$!"!==d&&"&"!==d||h++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;e.firstChild;)f.insertBefore(e.firstChild,c);g.data="$";g._reactRetry&&requestAnimationFrame(g._reactRetry)}}a.length=0};\n$RC=function(a,b){if(b=document.getElementById(b))(a=document.getElementById(a))?(a.previousSibling.data="$~",$RB.push(a,b),2===$RB.length&&("number"!==typeof $RT?requestAnimationFrame($RV.bind(null,$RB)):(a=performance.now(),setTimeout($RV.bind(null,$RB),2300>a&&2E3<a?2300-a:$RT+300-a)))):b.parentNode.removeChild(b)};'
    )), destination.push('$RC("'));
    completedSegments = i.toString(16);
    destination.push(request.boundaryPrefix);
    destination.push(completedSegments);
    destination.push('","');
    destination.push(request.segmentPrefix);
    destination.push(completedSegments);
    requiresStyleInsertion ? (destination.push('",'), writeStyleResourceDependenciesInJS(destination, boundary)) : destination.push('"');
    boundary = destination.push(")<\/script>");
    return writeBootstrap(destination, request) && boundary;
  }
  function flushPartiallyCompletedSegment(request, destination, boundary, segment) {
    if (2 === segment.status) return true;
    var hoistableState = boundary.contentState, segmentID = segment.id;
    if (-1 === segmentID) {
      if (-1 === (segment.id = boundary.rootSegmentID))
        throw Error(formatProdErrorMessage(392));
      return flushSegmentContainer(request, destination, segment, hoistableState);
    }
    if (segmentID === boundary.rootSegmentID)
      return flushSegmentContainer(request, destination, segment, hoistableState);
    flushSegmentContainer(request, destination, segment, hoistableState);
    boundary = request.resumableState;
    request = request.renderState;
    destination.push(request.startInlineScript);
    destination.push(">");
    0 === (boundary.instructions & 1) ? (boundary.instructions |= 1, destination.push(
      '$RS=function(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS("'
    )) : destination.push('$RS("');
    destination.push(request.segmentPrefix);
    segmentID = segmentID.toString(16);
    destination.push(segmentID);
    destination.push('","');
    destination.push(request.placeholderPrefix);
    destination.push(segmentID);
    destination = destination.push('")<\/script>');
    return destination;
  }
  var flushingPartialBoundaries = false;
  function flushCompletedQueues(request, destination) {
    try {
      if (!(0 < request.pendingRootTasks)) {
        var i, completedRootSegment = request.completedRootSegment;
        if (null !== completedRootSegment) {
          if (5 === completedRootSegment.status) return;
          var completedPreambleSegments = request.completedPreambleSegments;
          if (null === completedPreambleSegments) return;
          flushedByteSize = request.byteSize;
          var resumableState = request.resumableState, renderState = request.renderState, preamble = renderState.preamble, htmlChunks = preamble.htmlChunks, headChunks = preamble.headChunks, i$jscomp$0;
          if (htmlChunks) {
            for (i$jscomp$0 = 0; i$jscomp$0 < htmlChunks.length; i$jscomp$0++)
              destination.push(htmlChunks[i$jscomp$0]);
            if (headChunks)
              for (i$jscomp$0 = 0; i$jscomp$0 < headChunks.length; i$jscomp$0++)
                destination.push(headChunks[i$jscomp$0]);
            else {
              var chunk = startChunkForTag("head");
              destination.push(chunk);
              destination.push(">");
            }
          } else if (headChunks)
            for (i$jscomp$0 = 0; i$jscomp$0 < headChunks.length; i$jscomp$0++)
              destination.push(headChunks[i$jscomp$0]);
          var charsetChunks = renderState.charsetChunks;
          for (i$jscomp$0 = 0; i$jscomp$0 < charsetChunks.length; i$jscomp$0++)
            destination.push(charsetChunks[i$jscomp$0]);
          charsetChunks.length = 0;
          renderState.preconnects.forEach(flushResource, destination);
          renderState.preconnects.clear();
          var viewportChunks = renderState.viewportChunks;
          for (i$jscomp$0 = 0; i$jscomp$0 < viewportChunks.length; i$jscomp$0++)
            destination.push(viewportChunks[i$jscomp$0]);
          viewportChunks.length = 0;
          renderState.fontPreloads.forEach(flushResource, destination);
          renderState.fontPreloads.clear();
          renderState.highImagePreloads.forEach(flushResource, destination);
          renderState.highImagePreloads.clear();
          currentlyFlushingRenderState = renderState;
          renderState.styles.forEach(flushStylesInPreamble, destination);
          currentlyFlushingRenderState = null;
          var importMapChunks = renderState.importMapChunks;
          for (i$jscomp$0 = 0; i$jscomp$0 < importMapChunks.length; i$jscomp$0++)
            destination.push(importMapChunks[i$jscomp$0]);
          importMapChunks.length = 0;
          renderState.bootstrapScripts.forEach(flushResource, destination);
          renderState.scripts.forEach(flushResource, destination);
          renderState.scripts.clear();
          renderState.bulkPreloads.forEach(flushResource, destination);
          renderState.bulkPreloads.clear();
          resumableState.instructions |= 32;
          var hoistableChunks = renderState.hoistableChunks;
          for (i$jscomp$0 = 0; i$jscomp$0 < hoistableChunks.length; i$jscomp$0++)
            destination.push(hoistableChunks[i$jscomp$0]);
          for (resumableState = hoistableChunks.length = 0; resumableState < completedPreambleSegments.length; resumableState++) {
            var segments = completedPreambleSegments[resumableState];
            for (renderState = 0; renderState < segments.length; renderState++)
              flushSegment(request, destination, segments[renderState], null);
          }
          var preamble$jscomp$0 = request.renderState.preamble, headChunks$jscomp$0 = preamble$jscomp$0.headChunks;
          if (preamble$jscomp$0.htmlChunks || headChunks$jscomp$0) {
            var chunk$jscomp$0 = endChunkForTag("head");
            destination.push(chunk$jscomp$0);
          }
          var bodyChunks = preamble$jscomp$0.bodyChunks;
          if (bodyChunks)
            for (completedPreambleSegments = 0; completedPreambleSegments < bodyChunks.length; completedPreambleSegments++)
              destination.push(bodyChunks[completedPreambleSegments]);
          flushSegment(request, destination, completedRootSegment, null);
          request.completedRootSegment = null;
          var renderState$jscomp$0 = request.renderState;
          if (0 !== request.allPendingTasks || 0 !== request.clientRenderedBoundaries.length || 0 !== request.completedBoundaries.length || null !== request.trackedPostpones && (0 !== request.trackedPostpones.rootNodes.length || null !== request.trackedPostpones.rootSlots)) {
            var resumableState$jscomp$0 = request.resumableState;
            if (0 === (resumableState$jscomp$0.instructions & 64)) {
              resumableState$jscomp$0.instructions |= 64;
              destination.push(renderState$jscomp$0.startInlineScript);
              if (0 === (resumableState$jscomp$0.instructions & 32)) {
                resumableState$jscomp$0.instructions |= 32;
                var shellId = "_" + resumableState$jscomp$0.idPrefix + "R_";
                destination.push(' id="');
                var chunk$jscomp$1 = escapeTextForBrowser(shellId);
                destination.push(chunk$jscomp$1);
                destination.push('"');
              }
              destination.push(">");
              destination.push(
                "requestAnimationFrame(function(){$RT=performance.now()});"
              );
              destination.push("<\/script>");
            }
          }
          writeBootstrap(destination, renderState$jscomp$0);
        }
        var renderState$jscomp$1 = request.renderState;
        completedRootSegment = 0;
        var viewportChunks$jscomp$0 = renderState$jscomp$1.viewportChunks;
        for (completedRootSegment = 0; completedRootSegment < viewportChunks$jscomp$0.length; completedRootSegment++)
          destination.push(viewportChunks$jscomp$0[completedRootSegment]);
        viewportChunks$jscomp$0.length = 0;
        renderState$jscomp$1.preconnects.forEach(flushResource, destination);
        renderState$jscomp$1.preconnects.clear();
        renderState$jscomp$1.fontPreloads.forEach(flushResource, destination);
        renderState$jscomp$1.fontPreloads.clear();
        renderState$jscomp$1.highImagePreloads.forEach(
          flushResource,
          destination
        );
        renderState$jscomp$1.highImagePreloads.clear();
        renderState$jscomp$1.styles.forEach(preloadLateStyles, destination);
        renderState$jscomp$1.scripts.forEach(flushResource, destination);
        renderState$jscomp$1.scripts.clear();
        renderState$jscomp$1.bulkPreloads.forEach(flushResource, destination);
        renderState$jscomp$1.bulkPreloads.clear();
        var hoistableChunks$jscomp$0 = renderState$jscomp$1.hoistableChunks;
        for (completedRootSegment = 0; completedRootSegment < hoistableChunks$jscomp$0.length; completedRootSegment++)
          destination.push(hoistableChunks$jscomp$0[completedRootSegment]);
        hoistableChunks$jscomp$0.length = 0;
        var clientRenderedBoundaries = request.clientRenderedBoundaries;
        for (i = 0; i < clientRenderedBoundaries.length; i++) {
          var boundary = clientRenderedBoundaries[i];
          renderState$jscomp$1 = destination;
          var resumableState$jscomp$1 = request.resumableState, renderState$jscomp$2 = request.renderState, id = boundary.rootSegmentID, errorDigest = boundary.errorDigest;
          renderState$jscomp$1.push(renderState$jscomp$2.startInlineScript);
          renderState$jscomp$1.push(">");
          0 === (resumableState$jscomp$1.instructions & 4) ? (resumableState$jscomp$1.instructions |= 4, renderState$jscomp$1.push(
            '$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};;$RX("'
          )) : renderState$jscomp$1.push('$RX("');
          renderState$jscomp$1.push(renderState$jscomp$2.boundaryPrefix);
          var chunk$jscomp$2 = id.toString(16);
          renderState$jscomp$1.push(chunk$jscomp$2);
          renderState$jscomp$1.push('"');
          if (errorDigest) {
            renderState$jscomp$1.push(",");
            var chunk$jscomp$3 = escapeJSStringsForInstructionScripts(
              errorDigest || ""
            );
            renderState$jscomp$1.push(chunk$jscomp$3);
          }
          var JSCompiler_inline_result = renderState$jscomp$1.push(")<\/script>");
          if (!JSCompiler_inline_result) {
            request.destination = null;
            i++;
            clientRenderedBoundaries.splice(0, i);
            return;
          }
        }
        clientRenderedBoundaries.splice(0, i);
        var completedBoundaries = request.completedBoundaries;
        for (i = 0; i < completedBoundaries.length; i++)
          if (!flushCompletedBoundary(request, destination, completedBoundaries[i])) {
            request.destination = null;
            i++;
            completedBoundaries.splice(0, i);
            return;
          }
        completedBoundaries.splice(0, i);
        flushingPartialBoundaries = true;
        var partialBoundaries = request.partialBoundaries;
        for (i = 0; i < partialBoundaries.length; i++) {
          var boundary$69 = partialBoundaries[i];
          a: {
            clientRenderedBoundaries = request;
            boundary = destination;
            flushedByteSize = boundary$69.byteSize;
            var completedSegments = boundary$69.completedSegments;
            for (JSCompiler_inline_result = 0; JSCompiler_inline_result < completedSegments.length; JSCompiler_inline_result++)
              if (!flushPartiallyCompletedSegment(
                clientRenderedBoundaries,
                boundary,
                boundary$69,
                completedSegments[JSCompiler_inline_result]
              )) {
                JSCompiler_inline_result++;
                completedSegments.splice(0, JSCompiler_inline_result);
                var JSCompiler_inline_result$jscomp$0 = false;
                break a;
              }
            completedSegments.splice(0, JSCompiler_inline_result);
            var row = boundary$69.row;
            null !== row && row.together && 1 === boundary$69.pendingTasks && (1 === row.pendingTasks ? unblockSuspenseListRow(
              clientRenderedBoundaries,
              row,
              row.hoistables
            ) : row.pendingTasks--);
            JSCompiler_inline_result$jscomp$0 = writeHoistablesForBoundary(
              boundary,
              boundary$69.contentState,
              clientRenderedBoundaries.renderState
            );
          }
          if (!JSCompiler_inline_result$jscomp$0) {
            request.destination = null;
            i++;
            partialBoundaries.splice(0, i);
            return;
          }
        }
        partialBoundaries.splice(0, i);
        flushingPartialBoundaries = false;
        var largeBoundaries = request.completedBoundaries;
        for (i = 0; i < largeBoundaries.length; i++)
          if (!flushCompletedBoundary(request, destination, largeBoundaries[i])) {
            request.destination = null;
            i++;
            largeBoundaries.splice(0, i);
            return;
          }
        largeBoundaries.splice(0, i);
      }
    } finally {
      flushingPartialBoundaries = false, 0 === request.allPendingTasks && 0 === request.clientRenderedBoundaries.length && 0 === request.completedBoundaries.length && (request.flushScheduled = false, i = request.resumableState, i.hasBody && (partialBoundaries = endChunkForTag("body"), destination.push(partialBoundaries)), i.hasHtml && (i = endChunkForTag("html"), destination.push(i)), request.status = 14, destination.push(null), request.destination = null);
    }
  }
  function enqueueFlush(request) {
    if (false === request.flushScheduled && 0 === request.pingedTasks.length && null !== request.destination) {
      request.flushScheduled = true;
      var destination = request.destination;
      destination ? flushCompletedQueues(request, destination) : request.flushScheduled = false;
    }
  }
  function startFlowing(request, destination) {
    if (13 === request.status)
      request.status = 14, destination.destroy(request.fatalError);
    else if (14 !== request.status && null === request.destination) {
      request.destination = destination;
      try {
        flushCompletedQueues(request, destination);
      } catch (error2) {
        logRecoverableError(request, error2, {}), fatalError(request, error2);
      }
    }
  }
  function abort(request, reason) {
    if (11 === request.status || 10 === request.status) request.status = 12;
    try {
      var abortableTasks = request.abortableTasks;
      if (0 < abortableTasks.size) {
        var error2 = void 0 === reason ? Error(formatProdErrorMessage(432)) : "object" === typeof reason && null !== reason && "function" === typeof reason.then ? Error(formatProdErrorMessage(530)) : reason;
        request.fatalError = error2;
        abortableTasks.forEach(function(task) {
          return abortTask(task, request, error2);
        });
        abortableTasks.clear();
      }
      null !== request.destination && flushCompletedQueues(request, request.destination);
    } catch (error$71) {
      logRecoverableError(request, error$71, {}), fatalError(request, error$71);
    }
  }
  function addToReplayParent(node, parentKeyPath, trackedPostpones) {
    if (null === parentKeyPath) trackedPostpones.rootNodes.push(node);
    else {
      var workingMap = trackedPostpones.workingMap, parentNode = workingMap.get(parentKeyPath);
      void 0 === parentNode && (parentNode = [parentKeyPath[1], parentKeyPath[2], [], null], workingMap.set(parentKeyPath, parentNode), addToReplayParent(parentNode, parentKeyPath[0], trackedPostpones));
      parentNode[2].push(node);
    }
  }
  function onError() {
  }
  function renderToStringImpl(children, options, generateStaticMarkup, abortReason) {
    var didFatal = false, fatalError2 = null, result = "", readyToStream = false;
    options = createResumableState(options ? options.identifierPrefix : void 0);
    children = createRequest(
      children,
      options,
      createRenderState(options, generateStaticMarkup),
      createFormatContext(0, null, 0, null),
      Infinity,
      onError,
      void 0,
      function() {
        readyToStream = true;
      },
      void 0,
      void 0,
      void 0
    );
    children.flushScheduled = null !== children.destination;
    performWork(children);
    10 === children.status && (children.status = 11);
    null === children.trackedPostpones && safelyEmitEarlyPreloads(children, 0 === children.pendingRootTasks);
    abort(children, abortReason);
    startFlowing(children, {
      push: function(chunk) {
        null !== chunk && (result += chunk);
        return true;
      },
      destroy: function(error2) {
        didFatal = true;
        fatalError2 = error2;
      }
    });
    if (didFatal && fatalError2 !== abortReason) throw fatalError2;
    if (!readyToStream) throw Error(formatProdErrorMessage(426));
    return result;
  }
  reactDomServerLegacy_browser_production.renderToStaticMarkup = function(children, options) {
    return renderToStringImpl(
      children,
      options,
      true,
      'The server used "renderToStaticMarkup" which does not support Suspense. If you intended to have the server wait for the suspended component please switch to "renderToReadableStream" which supports Suspense on the server'
    );
  };
  reactDomServerLegacy_browser_production.renderToString = function(children, options) {
    return renderToStringImpl(
      children,
      options,
      false,
      'The server used "renderToString" which does not support Suspense. If you intended for this Suspense boundary to render the fallback content on the server consider throwing an Error somewhere within the Suspense boundary. If you intended to have the server wait for the suspended component please switch to "renderToReadableStream" which supports Suspense on the server'
    );
  };
  reactDomServerLegacy_browser_production.version = "19.2.6";
  return reactDomServerLegacy_browser_production;
}
var hasRequiredServer_edge;
function requireServer_edge() {
  if (hasRequiredServer_edge) return server_edge;
  hasRequiredServer_edge = 1;
  var b;
  var l;
  {
    b = requireReactDomServer_edge_production();
    l = requireReactDomServerLegacy_browser_production();
  }
  server_edge.version = b.version;
  server_edge.renderToReadableStream = b.renderToReadableStream;
  server_edge.renderToString = l.renderToString;
  server_edge.renderToStaticMarkup = l.renderToStaticMarkup;
  server_edge.resume = b.resume;
  return server_edge;
}
var server_edgeExports = requireServer_edge();
const ReactDOM = /* @__PURE__ */ getDefaultExportFromCjs(server_edgeExports);
const contexts = /* @__PURE__ */ new WeakMap();
const ID_PREFIX = "r";
function getContext(rendererContextResult) {
  if (contexts.has(rendererContextResult)) {
    return contexts.get(rendererContextResult);
  }
  const ctx = {
    currentIndex: 0,
    get id() {
      return ID_PREFIX + this.currentIndex.toString();
    }
  };
  contexts.set(rendererContextResult, ctx);
  return ctx;
}
function incrementId(rendererContextResult) {
  const ctx = getContext(rendererContextResult);
  const id = ctx.id;
  ctx.currentIndex++;
  return id;
}
const StaticHtml = ({
  value,
  name,
  hydrate = true
}) => {
  if (value == null || value.trim() === "") return null;
  const tagName = hydrate ? "astro-slot" : "astro-static-slot";
  return reactExports.createElement(tagName, {
    name,
    suppressHydrationWarning: true,
    dangerouslySetInnerHTML: { __html: value }
  });
};
var static_html_default = reactExports.memo(StaticHtml, () => true);
const slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
const reactTypeof = /* @__PURE__ */ Symbol.for("react.element");
const reactTransitionalTypeof = /* @__PURE__ */ Symbol.for("react.transitional.element");
async function check(Component, props, children, metadata) {
  if (typeof Component === "object") {
    return Component["$$typeof"].toString().slice("Symbol(".length).startsWith("react");
  }
  if (typeof Component !== "function") return false;
  if (Component.name === "QwikComponent") return false;
  if (typeof Component === "function" && Component["$$typeof"] === /* @__PURE__ */ Symbol.for("react.forward_ref"))
    return false;
  if (Component.prototype != null && typeof Component.prototype.render === "function") {
    return React.Component.isPrototypeOf(Component) || React.PureComponent.isPrototypeOf(Component);
  }
  let isReactComponent = false;
  function Tester(...args) {
    try {
      const vnode = Component(...args);
      if (vnode && (vnode["$$typeof"] === reactTypeof || vnode["$$typeof"] === reactTransitionalTypeof)) {
        isReactComponent = true;
      }
    } catch {
    }
    return React.createElement("div");
  }
  await renderToStaticMarkup.call(this, Tester, props, children);
  return isReactComponent;
}
async function getNodeWritable() {
  let nodeStreamBuiltinModuleName = "node:stream";
  let { Writable } = await import(
    /* @vite-ignore */
    nodeStreamBuiltinModuleName
  );
  return Writable;
}
function needsHydration(metadata) {
  return metadata?.astroStaticSlot ? !!metadata.hydrate : true;
}
async function renderToStaticMarkup(Component, props, { default: children, ...slotted }, metadata) {
  let prefix;
  if (this && this.result) {
    prefix = incrementId(this.result);
  }
  const attrs = { prefix };
  delete props["class"];
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = React.createElement(static_html_default, {
      hydrate: needsHydration(metadata),
      value,
      name
    });
  }
  const newProps = {
    ...props,
    ...slots
  };
  const newChildren = children ?? props.children;
  if (newChildren != null) {
    newProps.children = React.createElement(static_html_default, {
      hydrate: needsHydration(metadata),
      value: newChildren
    });
  }
  const formState = this ? await getFormState(this) : void 0;
  if (formState) {
    attrs["data-action-result"] = JSON.stringify(formState[0]);
    attrs["data-action-key"] = formState[1];
    attrs["data-action-name"] = formState[2];
  }
  const vnode = React.createElement(Component, newProps);
  const renderOptions = {
    identifierPrefix: prefix,
    formState
  };
  let html;
  if ("renderToReadableStream" in ReactDOM) {
    html = await renderToReadableStreamAsync(vnode, renderOptions);
  } else {
    html = await renderToPipeableStreamAsync(vnode, renderOptions);
  }
  html = html.replace(
    /<link\s[^>]*rel="(?:preload|modulepreload|stylesheet|preconnect|dns-prefetch)"[^>]*>/g,
    ""
  );
  return { html, attrs };
}
async function getFormState({
  result
}) {
  const { request, actionResult } = result;
  if (!actionResult) return void 0;
  if (!isFormRequest(request.headers.get("content-type"))) return void 0;
  const { searchParams } = new URL(request.url);
  const formData = await request.clone().formData();
  const actionKey = formData.get("$ACTION_KEY")?.toString();
  const actionName = searchParams.get("_action");
  if (!actionKey || !actionName) return void 0;
  return [actionResult, actionKey, actionName];
}
async function renderToPipeableStreamAsync(vnode, options) {
  const Writable = await getNodeWritable();
  let html = "";
  return new Promise((resolve, reject) => {
    let error2 = void 0;
    let stream = ReactDOM.renderToPipeableStream(vnode, {
      ...options,
      onError(err) {
        error2 = err;
        reject(error2);
      },
      onAllReady() {
        stream.pipe(
          new Writable({
            write(chunk, _encoding, callback) {
              html += chunk.toString("utf-8");
              callback();
            },
            destroy() {
              resolve(html);
            }
          })
        );
      }
    });
  });
}
async function readResult(stream) {
  const reader = stream.getReader();
  let result = "";
  const decoder = new TextDecoder("utf-8");
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      if (value) {
        result += decoder.decode(value);
      } else {
        decoder.decode(new Uint8Array());
      }
      return result;
    }
    result += decoder.decode(value, { stream: true });
  }
}
async function renderToReadableStreamAsync(vnode, options) {
  return await readResult(await ReactDOM.renderToReadableStream(vnode, options));
}
const formContentTypes = ["application/x-www-form-urlencoded", "multipart/form-data"];
function isFormRequest(contentType) {
  const type = contentType?.split(";")[0].toLowerCase();
  return formContentTypes.some((t) => type === t);
}
const renderer = {
  name: "@astrojs/react",
  check,
  renderToStaticMarkup,
  supportsAstroStaticSlot: true
};
var server_default$1 = renderer;
const renderers = [Object.assign({ "name": "@astrojs/react", "clientEntrypoint": "@astrojs/react/client.js", "serverEntrypoint": "@astrojs/react/server.js" }, { ssr: server_default$1 })];
const serializedData = [{ "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "type": "page", "component": "_server-islands.astro", "params": ["name"], "segments": [[{ "content": "_server-islands", "dynamic": false, "spread": false }], [{ "content": "name", "dynamic": true, "spread": false }]], "pattern": "^\\/_server-islands\\/([^/]+?)\\/?$", "prerender": false, "isIndex": false, "fallbackRoutes": [], "route": "/_server-islands/[name]", "origin": "internal", "distURL": [], "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/_image", "component": "node_modules/@astrojs/cloudflare/dist/entrypoints/image-transform-endpoint.js", "params": [], "pathname": "/_image", "pattern": "^\\/_image\\/?$", "segments": [[{ "content": "_image", "dynamic": false, "spread": false }]], "type": "endpoint", "prerender": false, "fallbackRoutes": [], "distURL": [], "isIndex": false, "origin": "internal", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/auth/signin", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/auth\\/signin\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "auth", "dynamic": false, "spread": false }], [{ "content": "signin", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/auth/signin.ts", "pathname": "/api/auth/signin", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/auth/signout", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/auth\\/signout\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "auth", "dynamic": false, "spread": false }], [{ "content": "signout", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/auth/signout.ts", "pathname": "/api/auth/signout", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/auth/signup", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/auth\\/signup\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "auth", "dynamic": false, "spread": false }], [{ "content": "signup", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/auth/signup.ts", "pathname": "/api/auth/signup", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/training-intakes", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/training-intakes\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "training-intakes", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/training-intakes.ts", "pathname": "/api/training-intakes", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/training-plans/accept", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/training-plans\\/accept\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "training-plans", "dynamic": false, "spread": false }], [{ "content": "accept", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/training-plans/accept.ts", "pathname": "/api/training-plans/accept", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/training-plans/generate", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/training-plans\\/generate\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "training-plans", "dynamic": false, "spread": false }], [{ "content": "generate", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/training-plans/generate.ts", "pathname": "/api/training-plans/generate", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/api/training-plans/revise", "isIndex": false, "type": "endpoint", "pattern": "^\\/api\\/training-plans\\/revise\\/?$", "segments": [[{ "content": "api", "dynamic": false, "spread": false }], [{ "content": "training-plans", "dynamic": false, "spread": false }], [{ "content": "revise", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/api/training-plans/revise.ts", "pathname": "/api/training-plans/revise", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/auth/confirm", "isIndex": false, "type": "endpoint", "pattern": "^\\/auth\\/confirm\\/?$", "segments": [[{ "content": "auth", "dynamic": false, "spread": false }], [{ "content": "confirm", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/auth/confirm.ts", "pathname": "/auth/confirm", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/auth/confirm-email", "isIndex": false, "type": "page", "pattern": "^\\/auth\\/confirm-email\\/?$", "segments": [[{ "content": "auth", "dynamic": false, "spread": false }], [{ "content": "confirm-email", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/auth/confirm-email.astro", "pathname": "/auth/confirm-email", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/auth/signin", "isIndex": false, "type": "page", "pattern": "^\\/auth\\/signin\\/?$", "segments": [[{ "content": "auth", "dynamic": false, "spread": false }], [{ "content": "signin", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/auth/signin.astro", "pathname": "/auth/signin", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/auth/signup", "isIndex": false, "type": "page", "pattern": "^\\/auth\\/signup\\/?$", "segments": [[{ "content": "auth", "dynamic": false, "spread": false }], [{ "content": "signup", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/auth/signup.astro", "pathname": "/auth/signup", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/dashboard/intake", "isIndex": false, "type": "page", "pattern": "^\\/dashboard\\/intake\\/?$", "segments": [[{ "content": "dashboard", "dynamic": false, "spread": false }], [{ "content": "intake", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/dashboard/intake.astro", "pathname": "/dashboard/intake", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/dashboard", "isIndex": false, "type": "page", "pattern": "^\\/dashboard\\/?$", "segments": [[{ "content": "dashboard", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/dashboard.astro", "pathname": "/dashboard", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/", "isIndex": true, "type": "page", "pattern": "^\\/$", "segments": [], "params": [], "component": "src/pages/index.astro", "pathname": "/", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }];
serializedData.map(deserializeRouteInfo);
const _page0 = () => import("./image-transform-endpoint_BzwTfwDw.mjs").then((n) => n.i);
const _page1 = () => import("./signin_DCg3vIAI.mjs");
const _page2 = () => import("./signout_C2hh_YVl.mjs");
const _page3 = () => import("./signup_C_xmuMJT.mjs");
const _page4 = () => import("./training-intakes_C8ZT11Tp.mjs");
const _page5 = () => import("./accept_CCcUu6Xa.mjs");
const _page6 = () => import("./generate_Bd8n8ICx.mjs");
const _page7 = () => import("./revise_DRtiBH8n.mjs");
const _page8 = () => import("./confirm_BR3pIVon.mjs");
const _page9 = () => import("./confirm-email_Ba5uz4qo.mjs");
const _page10 = () => import("./signin_DCz5wGJq.mjs");
const _page11 = () => import("./signup_CL5WzpPn.mjs");
const _page12 = () => import("./intake_DbOR6COZ.mjs");
const _page13 = () => import("./dashboard_DggLiJmP.mjs");
const _page14 = () => import("./index_xvMsnzGH.mjs");
const pageMap = /* @__PURE__ */ new Map([
  ["node_modules/@astrojs/cloudflare/dist/entrypoints/image-transform-endpoint.js", _page0],
  ["src/pages/api/auth/signin.ts", _page1],
  ["src/pages/api/auth/signout.ts", _page2],
  ["src/pages/api/auth/signup.ts", _page3],
  ["src/pages/api/training-intakes.ts", _page4],
  ["src/pages/api/training-plans/accept.ts", _page5],
  ["src/pages/api/training-plans/generate.ts", _page6],
  ["src/pages/api/training-plans/revise.ts", _page7],
  ["src/pages/auth/confirm.ts", _page8],
  ["src/pages/auth/confirm-email.astro", _page9],
  ["src/pages/auth/signin.astro", _page10],
  ["src/pages/auth/signup.astro", _page11],
  ["src/pages/dashboard/intake.astro", _page12],
  ["src/pages/dashboard.astro", _page13],
  ["src/pages/index.astro", _page14]
]);
const _manifest = deserializeManifest({"rootDir":"file:///Users/antek/projekty/TrAIner/","cacheDir":"file:///Users/antek/projekty/TrAIner/node_modules/.astro/","outDir":"file:///Users/antek/projekty/TrAIner/dist/","srcDir":"file:///Users/antek/projekty/TrAIner/src/","publicDir":"file:///Users/antek/projekty/TrAIner/public/","buildClientDir":"file:///Users/antek/projekty/TrAIner/dist/client/","buildServerDir":"file:///Users/antek/projekty/TrAIner/dist/server/","adapterName":"@astrojs/cloudflare","assetsDir":"_astro","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","distURL":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/_image","component":"node_modules/@astrojs/cloudflare/dist/entrypoints/image-transform-endpoint.js","params":[],"pathname":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"type":"endpoint","prerender":false,"fallbackRoutes":[],"distURL":[],"isIndex":false,"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/signin","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/signin\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"signin","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/signin.ts","pathname":"/api/auth/signin","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/signout","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/signout\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"signout","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/signout.ts","pathname":"/api/auth/signout","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/signup","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/signup\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"signup","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/signup.ts","pathname":"/api/auth/signup","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/training-intakes","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/training-intakes\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"training-intakes","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/training-intakes.ts","pathname":"/api/training-intakes","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/training-plans/accept","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/training-plans\\/accept\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"training-plans","dynamic":false,"spread":false}],[{"content":"accept","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/training-plans/accept.ts","pathname":"/api/training-plans/accept","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/training-plans/generate","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/training-plans\\/generate\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"training-plans","dynamic":false,"spread":false}],[{"content":"generate","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/training-plans/generate.ts","pathname":"/api/training-plans/generate","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/training-plans/revise","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/training-plans\\/revise\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"training-plans","dynamic":false,"spread":false}],[{"content":"revise","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/training-plans/revise.ts","pathname":"/api/training-plans/revise","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/auth/confirm","isIndex":false,"type":"endpoint","pattern":"^\\/auth\\/confirm\\/?$","segments":[[{"content":"auth","dynamic":false,"spread":false}],[{"content":"confirm","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/auth/confirm.ts","pathname":"/auth/confirm","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.C1E69U30.css"}],"routeData":{"route":"/auth/confirm-email","isIndex":false,"type":"page","pattern":"^\\/auth\\/confirm-email\\/?$","segments":[[{"content":"auth","dynamic":false,"spread":false}],[{"content":"confirm-email","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/auth/confirm-email.astro","pathname":"/auth/confirm-email","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.C1E69U30.css"}],"routeData":{"route":"/auth/signin","isIndex":false,"type":"page","pattern":"^\\/auth\\/signin\\/?$","segments":[[{"content":"auth","dynamic":false,"spread":false}],[{"content":"signin","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/auth/signin.astro","pathname":"/auth/signin","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.C1E69U30.css"}],"routeData":{"route":"/auth/signup","isIndex":false,"type":"page","pattern":"^\\/auth\\/signup\\/?$","segments":[[{"content":"auth","dynamic":false,"spread":false}],[{"content":"signup","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/auth/signup.astro","pathname":"/auth/signup","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.C1E69U30.css"}],"routeData":{"route":"/dashboard/intake","isIndex":false,"type":"page","pattern":"^\\/dashboard\\/intake\\/?$","segments":[[{"content":"dashboard","dynamic":false,"spread":false}],[{"content":"intake","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/dashboard/intake.astro","pathname":"/dashboard/intake","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.C1E69U30.css"}],"routeData":{"route":"/dashboard","isIndex":false,"type":"page","pattern":"^\\/dashboard\\/?$","segments":[[{"content":"dashboard","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/dashboard.astro","pathname":"/dashboard","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"serverLike":true,"middlewareMode":"classic","base":"/","trailingSlash":"ignore","compressHTML":true,"experimentalQueuedRendering":{"enabled":false,"poolSize":0,"contentCache":false},"componentMetadata":[["/Users/antek/projekty/TrAIner/src/pages/auth/confirm-email.astro",{"propagation":"none","containsHead":true}],["/Users/antek/projekty/TrAIner/src/pages/auth/signin.astro",{"propagation":"none","containsHead":true}],["/Users/antek/projekty/TrAIner/src/pages/auth/signup.astro",{"propagation":"none","containsHead":true}],["/Users/antek/projekty/TrAIner/src/pages/dashboard.astro",{"propagation":"none","containsHead":true}],["/Users/antek/projekty/TrAIner/src/pages/dashboard/intake.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000virtual:astro:actions/noop-entrypoint":"chunks/noop-entrypoint_DsBX4kaI.mjs","\u0000virtual:astro:middleware":"virtual_astro_middleware.mjs","\u0000virtual:astro:session-driver":"chunks/_virtual_astro_session-driver_Csu6PJY6.mjs","\u0000virtual:astro:server-island-manifest":"chunks/_virtual_astro_server-island-manifest_CFl7y3Qj.mjs","virtual:cloudflare/worker-entry":"entry.mjs","\u0000virtual:astro:page:src/pages/api/auth/signin@_@ts":"chunks/signin_DCg3vIAI.mjs","\u0000virtual:astro:page:src/pages/api/auth/signout@_@ts":"chunks/signout_C2hh_YVl.mjs","\u0000virtual:astro:page:src/pages/api/auth/signup@_@ts":"chunks/signup_C_xmuMJT.mjs","\u0000virtual:astro:page:src/pages/api/training-intakes@_@ts":"chunks/training-intakes_C8ZT11Tp.mjs","\u0000virtual:astro:page:src/pages/api/training-plans/accept@_@ts":"chunks/accept_CCcUu6Xa.mjs","\u0000virtual:astro:page:src/pages/api/training-plans/generate@_@ts":"chunks/generate_Bd8n8ICx.mjs","\u0000virtual:astro:page:src/pages/api/training-plans/revise@_@ts":"chunks/revise_DRtiBH8n.mjs","\u0000virtual:astro:page:src/pages/auth/confirm@_@ts":"chunks/confirm_BR3pIVon.mjs","\u0000virtual:astro:page:src/pages/auth/confirm-email@_@astro":"chunks/confirm-email_Ba5uz4qo.mjs","\u0000virtual:astro:page:src/pages/auth/signin@_@astro":"chunks/signin_DCz5wGJq.mjs","\u0000virtual:astro:page:src/pages/auth/signup@_@astro":"chunks/signup_CL5WzpPn.mjs","\u0000virtual:astro:page:src/pages/dashboard/intake@_@astro":"chunks/intake_DbOR6COZ.mjs","\u0000virtual:astro:page:src/pages/dashboard@_@astro":"chunks/dashboard_DggLiJmP.mjs","\u0000virtual:astro:page:src/pages/index@_@astro":"chunks/index_xvMsnzGH.mjs","/Users/antek/projekty/TrAIner/node_modules/@astrojs/cloudflare/dist/entrypoints/image-service-workerd.js":"chunks/image-service-workerd_BzCJbTXl.mjs","/Users/antek/projekty/TrAIner/src/pages/dashboard.astro?astro&type=script&index=0&lang.ts":"_astro/dashboard.astro_astro_type_script_index_0_lang.kSVfRVBe.js","@/components/auth/SignInForm":"_astro/SignInForm.CgO4ky2R.js","@/components/auth/SignUpForm":"_astro/SignUpForm.C4gPSy6x.js","@/components/intake/GoalAndConstraintsForm":"_astro/GoalAndConstraintsForm.DEViqUiQ.js","@/components/plans/PlanRevisionForm":"_astro/PlanRevisionForm.BlZqVgWX.js","@astrojs/react/client.js":"_astro/client.DIL4A8Tw.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/Users/antek/projekty/TrAIner/src/pages/dashboard.astro?astro&type=script&index=0&lang.ts","globalThis.process??={};globalThis.process.env??={};document.querySelectorAll(\"[data-plan-native-form]\").forEach(t=>{t.addEventListener(\"submit\",()=>{const e=t.querySelector(\"[data-plan-submit]\");e instanceof HTMLButtonElement&&(e.disabled=!0,e.textContent=e.dataset.loadingLabel||\"Generating...\")})});"]],"assets":["/favicon.png","/template.png","/_astro/GoalAndConstraintsForm.DEViqUiQ.js","/_astro/PasswordToggle.Bgn3IxRM.js","/_astro/PlanRevisionForm.BlZqVgWX.js","/_astro/ServerError.BqboxyEj.js","/_astro/SignInForm.CgO4ky2R.js","/_astro/SignUpForm.C4gPSy6x.js","/_astro/button.hCRj9bDz.js","/_astro/client.DIL4A8Tw.js","/_astro/heart-pulse.B6Uycr4l.js","/_astro/index.-zEpYVTL.js","/_astro/index.pEiVuAFl.js","/_astro/Layout.C1E69U30.css"],"buildFormat":"directory","checkOrigin":true,"actionBodySizeLimit":1048576,"serverIslandBodySizeLimit":1048576,"allowedDomains":[],"key":"n2ooPo3FgEVsIeKkAdaX19lgU9Rp/g1lPBv8o4tVp/I=","sessionConfig":{"driver":"unstorage/drivers/cloudflare-kv-binding","options":{"binding":"SESSION"}},"image":{},"devToolbar":{"enabled":false,"debugInfoOutput":""},"logLevel":"info","shouldInjectCspMetaTags":false});
const manifestRoutes = _manifest.routes;
const manifest = Object.assign(_manifest, {
  renderers,
  actions: () => import("./noop-entrypoint_DsBX4kaI.mjs"),
  middleware: () => import("../virtual_astro_middleware.mjs"),
  sessionDriver: () => import("./_virtual_astro_session-driver_Csu6PJY6.mjs"),
  serverIslandMappings: () => import("./_virtual_astro_server-island-manifest_CFl7y3Qj.mjs"),
  routes: manifestRoutes,
  pageMap
});
const createApp$1 = ({ streaming } = {}) => {
  const app2 = new App(manifest, streaming);
  app2.setFetchHandler(fetchable);
  return app2;
};
const createApp = createApp$1;
const createGetEnv = (env2) => (key) => {
  const v = env2[key];
  if (typeof v === "undefined" || typeof v === "string") {
    return v;
  }
  if (typeof v === "boolean" || typeof v === "number") {
    return v.toString();
  }
  return void 0;
};
function getFirstForwardedValue(multiValueHeader) {
  return multiValueHeader?.toString()?.split(",").map((e) => e.trim())?.[0];
}
const IP_RE = /^[0-9a-fA-F.:]{1,45}$/;
function isValidIpAddress(value) {
  return IP_RE.test(value);
}
function getValidatedIpFromHeader(headerValue) {
  const raw = getFirstForwardedValue(headerValue);
  if (raw && isValidIpAddress(raw)) {
    return raw;
  }
  return void 0;
}
setGetEnv(createGetEnv(env));
const app = createApp();
async function handle(request, env2, context) {
  const { pathname: requestPathname } = new URL(request.url);
  if (env2[sessionKVBindingName]) {
    const sessionConfigOptions = app.manifest.sessionConfig?.options ?? {};
    Object.assign(sessionConfigOptions, {
      binding: env2[sessionKVBindingName]
    });
  }
  if (app.manifest.assets.has(requestPathname)) {
    return env2.ASSETS.fetch(request.url.replace(/\.html$/, ""));
  }
  let routeData = void 0;
  if (app.isDev()) {
    const result = await app.devMatch(app.getPathnameFromRequest(request));
    if (result) {
      routeData = result.routeData;
    }
  } else {
    routeData = app.match(request);
  }
  if (!routeData) {
    const asset = await env2.ASSETS.fetch(
      request.url.replace(/index.html$/, "").replace(/\.html$/, "")
    );
    if (asset.status !== 404) {
      return asset;
    }
  }
  const locals = {
    cfContext: context
  };
  Object.defineProperty(locals, "runtime", {
    enumerable: false,
    value: {
      get env() {
        throw new Error(
          `Astro.locals.runtime.env has been removed in Astro v6. Use 'import { env } from "cloudflare:workers"' instead.`
        );
      },
      get cf() {
        throw new Error(
          `Astro.locals.runtime.cf has been removed in Astro v6. Use 'Astro.request.cf' instead.`
        );
      },
      get caches() {
        throw new Error(
          `Astro.locals.runtime.caches has been removed in Astro v6. Use the global 'caches' object instead.`
        );
      },
      get ctx() {
        throw new Error(
          `Astro.locals.runtime.ctx has been removed in Astro v6. Use 'Astro.locals.cfContext' instead.`
        );
      }
    }
  });
  const waitUntil = context.waitUntil.bind(context);
  const response = await app.render(request, {
    routeData,
    locals,
    waitUntil,
    prerenderedErrorPageFetch: async (url) => {
      return env2.ASSETS.fetch(url.replace(/\.html$/, ""));
    },
    clientAddress: getValidatedIpFromHeader(request.headers.get("cf-connecting-ip"))
  });
  if (app.setCookieHeaders) {
    for (const setCookieHeader of app.setCookieHeaders(response)) {
      response.headers.append("Set-Cookie", setCookieHeader);
    }
  }
  return response;
}
var server_default = {
  fetch: handle
};
const workerEntry = server_default ?? {};
export {
  React$1 as R,
  reactExports as a,
  requireReactDom as b,
  isRemoteAllowed as i,
  renderComponent as r,
  spreadAttributes as s,
  workerEntry as w
};

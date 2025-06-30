"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_fetch_1 = require("node-fetch");
function sendToValidator() {
    return __awaiter(this, void 0, void 0, function () {
        var markets, _i, markets_1, market, res, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    markets = [
                        {
                            marketName: "Who will win the 2026 US Election?",
                            options: ["Biden", "Trump", "Kennedy"],
                            deadline: "2026-11-04"
                        },
                        {
                            marketName: "Which team will win the 2025 ICC World Cup?",
                            options: ["India", "Australia", "England"],
                            deadline: "2025-10-15"
                        },
                        {
                            marketName: "Who will not win the Ballon d'Or 2025?",
                            options: ["Messi", "Ronaldo", "Mbappe"],
                            deadline: "2025-12-01"
                        }
                    ];
                    _i = 0, markets_1 = markets;
                    _a.label = 1;
                case 1:
                    if (!(_i < markets_1.length)) return [3 /*break*/, 7];
                    market = markets_1[_i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, (0, node_fetch_1.default)("http://localhost:4000/chat", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(market)
                        })];
                case 3:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 4:
                    data = _a.sent();
                    console.log("\nValidator Response for market: ".concat(market.marketName));
                    console.log(data);
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    console.error("Validator Agent Error:", err_1);
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function sendToResolver() {
    return __awaiter(this, void 0, void 0, function () {
        var resolutions, _i, resolutions_1, resolution, res, data, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resolutions = [
                        {
                            marketName: "Who will win IPL 2026?",
                            options: ["RCB", "MI", "CSK"],
                            deadline: "47328957",
                            userId: "predictorx",
                            userName: "predictorx"
                        },
                        {
                            marketName: "Who will win the 2024 US Presidential Election?",
                            options: ["Joe Biden", "Donald Trump", "Robert F. Kennedy Jr."],
                            deadline: "2024-11-05",
                            userId: "predictorx",
                            userName: "predictorx"
                        },
                        {
                            marketName: "Winner of Euro 2024?",
                            options: ["France", "Spain", "Germany"],
                            deadline: "2024-07-15",
                            userId: "predictorx",
                            userName: "predictorx"
                        }
                    ];
                    _i = 0, resolutions_1 = resolutions;
                    _a.label = 1;
                case 1:
                    if (!(_i < resolutions_1.length)) return [3 /*break*/, 7];
                    resolution = resolutions_1[_i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, (0, node_fetch_1.default)("http://localhost:4002/chat", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(resolution)
                        })];
                case 3:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 4:
                    data = _a.sent();
                    console.log("\nResolver Response for market: ".concat(resolution.marketName));
                    console.log(data);
                    return [3 /*break*/, 6];
                case 5:
                    err_2 = _a.sent();
                    console.error("Resolver Agent Error:", err_2);
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n--- Sending to Validator Agent (4000) ---");
                    return [4 /*yield*/, sendToValidator()];
                case 1:
                    _a.sent();
                    console.log("\n--- Sending to Resolver Agent (4002) ---");
                    return [4 /*yield*/, sendToResolver()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
run();

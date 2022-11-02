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
Object.defineProperty(exports, "__esModule", { value: true });
const parse_record_1 = require("../src/connector/parse-record");
const util_1 = require("../src/graph/util");
describe("main tests", () => {
    it("All nodes were loaded", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, util_1.cleanup)();
        const result = yield (0, parse_record_1.importReportFile)();
        expect(result.nodesCreated).toEqual(105);
    }));
});

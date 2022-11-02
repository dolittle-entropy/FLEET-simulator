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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const graphnode_1 = require("../graph/graphnode");
const app = (0, express_1.default)();
app.get('/api/graph/fields', (req, res) => {
    res.json({
        edges_fields: [
            { field_name: "id", type: "string" },
            { field_name: "source", type: "string" },
            { field_name: "target", type: "string" },
        ],
        nodes_fields: [
            { field_name: "id", type: "string" },
            { field_name: "title", type: "string" }
        ]
    });
});
app.get('/api/graph/data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield (0, graphnode_1.experiment)();
        res.json(data);
    }
    catch (e) {
        console.log('neo4j not ready, try later');
        res.json({});
    }
}));
app.get('/api/health', (req, res) => {
    res.send('ok');
});
const port = 5000;
app.listen(port, () => console.log(`running on ${port}`));

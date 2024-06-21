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
const razonSocialBusqueda_1 = require("./utils/razonSocialBusqueda");
const rucBusqueda_1 = require("./utils/rucBusqueda");
const documentoBusqueda_1 = require("./utils/documentoBusqueda");
const exportar_1 = require("./utils/exportar");
// import { busquedaCoincidencias } from './utils/rucBusqueda';
const app = (0, express_1.default)();
const cors = require('cors');
const port = 3000;
app.use(cors());
app.get("/busqueda", (req, res) => {
    const tipoBusqueda = req.get("tipo_busqueda");
    const tipoDocumento = req.get("tipoDocumento");
    const value = req.get("value");
    // const result : RucResult = coincidenciasRazonSocial(value);
    // res.json(result);
});
app.get('/', (req, res) => {
    res.json({ msg: "SUNAT WEBSCRAPPING" });
});
app.get("/documento/:tipo_documento/:n_documento", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //opciones: dni, carnet, pasaporte, cedula
        let documentoParam = req.params.tipo_documento;
        let tipoDocumento;
        //convertir a valor usado en SUNAT
        switch (documentoParam) {
            case "dni":
                tipoDocumento = "1";
                break;
            case "carnet":
                tipoDocumento = "4";
                break;
            case "pasaporte":
                tipoDocumento = "7";
                break;
            case "cedula":
                tipoDocumento = "A";
                break;
            default:
                tipoDocumento = "0";
                break;
        }
        const nDocumento = req.params.n_documento;
        const result = yield (0, documentoBusqueda_1.documentoBusqueda)(tipoDocumento, nDocumento);
        res.json({ data: result });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.get("/ruc/:ruc", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const value = (_a = req.params.ruc) !== null && _a !== void 0 ? _a : "";
        const result = yield (0, rucBusqueda_1.rucBusqueda)(value);
        res.json({ data: result });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.get("/razon_social/:razon_social", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const value = (_a = req.params.razon_social) !== null && _a !== void 0 ? _a : "";
        const coincidencias = yield (0, razonSocialBusqueda_1.razonSocialBusqueda)(value);
        res.json({ data: coincidencias });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.use(express_1.default.json());
app.post("/download", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body.data;
        const fileName = req.body.fileName;
        const path = yield (0, exportar_1.exportData)(data, fileName);
        res.download(path);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=index.js.map
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
exports.documentoBusqueda = void 0;
const chromium_1 = __importDefault(require("@sparticuz/chromium"));
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const puppeteer = require('puppeteer');
const { Browser, Page } = puppeteer;
const documentoBusqueda = (tipoDocumento, numeroDocumento) => __awaiter(void 0, void 0, void 0, function* () {
    let browser = null;
    try {
        browser = yield puppeteer_core_1.default.launch({
            args: chromium_1.default.args,
            defaultViewport: chromium_1.default.defaultViewport,
            executablePath: yield chromium_1.default.executablePath(),
            headless: chromium_1.default.headless,
        });
        const page = yield browser.newPage();
        yield page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        yield page.goto('https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/FrameCriterioBusquedaWeb.jsp', { waitUntil: 'networkidle2' });
        yield page.waitForSelector('#btnPorDocumento');
        yield page.click('#btnPorDocumento');
        yield page.waitForSelector('#cmbTipoDoc');
        yield page.select('#cmbTipoDoc', tipoDocumento);
        yield page.type('#txtNumeroDocumento', numeroDocumento);
        yield page.waitForSelector('#txtNumeroDocumento');
        yield page.click('#btnAceptar');
        yield page.waitForSelector(".list-group-item.clearfix.aRucs");
        yield page.content();
        //iteramos por los items del list group para convertir al modelo
        const documentoResult = yield page.evaluate(() => {
            const resultadoElement = document.querySelectorAll(".list-group-item.clearfix.aRucs[data-ruc]");
            let results = [];
            resultadoElement.forEach((el) => {
                var _a;
                results.push({
                    ruc: el.querySelectorAll(".list-group-item-heading")[0].innerText.split(":")[1].trim(),
                    razonSocial: el.querySelectorAll(".list-group-item-heading")[1].innerText,
                    ubicacion: el.querySelectorAll(".list-group-item-text")[0].innerText,
                    estado: (_a = el.querySelector(".list-group-item-text strong")) === null || _a === void 0 ? void 0 : _a.innerText,
                });
            });
            return results;
        });
        return documentoResult;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error en documentoBusqueda:', error.message);
        }
        else {
            console.error('Error en documentoBusqueda:', error);
        }
        throw new Error('Error en la consulta. Verifique el tipo y/o numero de documento');
    }
    finally {
        if (browser) {
            yield browser.close();
        }
    }
});
exports.documentoBusqueda = documentoBusqueda;
//# sourceMappingURL=documentoBusqueda.js.map
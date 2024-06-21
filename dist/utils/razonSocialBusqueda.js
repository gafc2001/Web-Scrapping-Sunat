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
exports.coincidenciasRazonSocial = exports.razonSocialBusqueda = void 0;
const puppeteer = require('puppeteer');
const razonSocialBusqueda = (razonSocial) => __awaiter(void 0, void 0, void 0, function* () {
    let coincidencias = [];
    const browser = yield puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = yield browser.newPage();
    try {
        yield page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        yield page.goto('https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/FrameCriterioBusquedaWeb.jsp', { waitUntil: 'networkidle2' });
        yield page.waitForSelector('#btnPorRazonSocial');
        yield page.click('#btnPorRazonSocial');
        yield page.waitForSelector('#txtNombreRazonSocial');
        yield page.type('#txtNombreRazonSocial', razonSocial);
        yield page.waitForSelector('#txtNombreRazonSocial');
        yield page.click('#btnAceptar');
        yield page.waitForSelector(".list-group-item.clearfix.aRucs[data-ruc]");
        yield page.content();
        coincidencias = yield page.evaluate(() => {
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
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error en razonSocialBusqueda:', error.message);
        }
        else {
            console.error('Error en razonSocialBusqueda:', error);
        }
        throw new Error('Error en la consulta. Verifique la razon social');
    }
    yield browser.close();
    return coincidencias;
});
exports.razonSocialBusqueda = razonSocialBusqueda;
const coincidenciasRazonSocial = (ruc) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    try {
        const page = yield browser.newPage();
        yield page.waitForSelector(`a[data-ruc='${ruc}']`);
        yield page.click(`a[data-ruc='${ruc}']`);
        yield browser.close();
    }
    catch (error) {
        console.error('Error en el script:', error);
        yield browser.close();
    }
});
exports.coincidenciasRazonSocial = coincidenciasRazonSocial;
//# sourceMappingURL=razonSocialBusqueda.js.map
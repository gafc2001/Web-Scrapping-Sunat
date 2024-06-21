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
exports.rucBusqueda = void 0;
const chromium_1 = __importDefault(require("@sparticuz/chromium"));
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const puppeteer = require('puppeteer');
const { Browser, Page } = puppeteer;
const rucBusqueda = (ruc) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield page.waitForSelector('#txtRuc');
        yield page.type('#txtRuc', ruc);
        yield Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
            page.click('#btnAceptar'),
        ]);
        yield page.waitForSelector('.col-sm-7 .list-group-item-heading');
        var parserDatevar = function (str) {
            const [day, month, year] = str.split('/').map(Number);
            return new Date(year, month - 1, day);
        };
        yield page.exposeFunction("parserDatevar", parserDatevar);
        // extraer la información, se almacena los valores de campos en array
        const resultArray = yield page.evaluate(() => {
            const items = document.querySelectorAll('.list-group-item');
            const resultArray = [];
            Array.from(items).forEach(item => {
                var _a, _b;
                const columns = item.querySelectorAll('.col-sm-5, .col-sm-7, .col-sm-3');
                // se toma de dos en dos los datos datos(key, value)
                if (columns.length % 2 === 0) {
                    for (let i = 0; i < columns.length; i += 2) {
                        let value = ((_b = (_a = columns[i + 1].querySelector('h4, p')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || '';
                        const table = columns[i + 1].querySelector('table');
                        if (table) {
                            const tdValues = Array.from(table.querySelectorAll('tr td')).map(td => { var _a; return ((_a = td.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; });
                            value = tdValues.join(', ');
                        }
                        // se remueve los espacios o caracteres extra
                        value = value.replace(/\s+/g, ' ').trim();
                        resultArray.push(value);
                    }
                }
            });
            return resultArray;
        });
        // funcion para convertir fecha de SUNAT a Date
        const parseDate = (str) => {
            const [day, month, year] = str.split('/').map(Number);
            return new Date(year, month - 1, day);
        };
        //convertir a modelo usando los elementos del array
        const rucResult = {
            ruc: resultArray[0] || '',
            tipo_contribuyente: resultArray[1] || '',
            tipo_documento: resultArray[2] || '',
            nombre_comercial: resultArray[3] || '',
            fecha_inscripcion: parseDate(resultArray[4] || ''),
            fecha_inicio_actividades: parseDate(resultArray[5] || ''),
            estado_contribuyente: resultArray[6] || '',
            condicion_contribuyente: resultArray[7] || '',
            domicilio_fiscal: resultArray[8] || '',
            sistema_emision_comprobante: resultArray[9] || '',
            actividad_comercio_exterior: resultArray[10] || '',
            sistema_contabilidad: resultArray[11] || '',
            actividades_economicas: (resultArray[12] || '').split(', '),
            comprobantes_pago: (resultArray[13] || '').split(', '),
            sistema_emision_electronica: (resultArray[14] || '').split(', '),
            emisor_electronico_desde: parseDate(resultArray[15] || ''),
            comprobantes_electronicos: resultArray[16] || '',
            afiliado_ple_desde: resultArray[17] ? parseDate(resultArray[17]) : undefined,
            padrones: (resultArray[18] || '').split(', '),
        };
        return rucResult;
        ;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error en rucBusqueda:', error.message);
        }
        else {
            console.error('Error en rucBusqueda:', error);
        }
        throw new Error('Error en la consulta. Verifique el numero de RUC');
    }
    finally {
        if (browser) {
            yield browser.close();
        }
    }
});
exports.rucBusqueda = rucBusqueda;
//# sourceMappingURL=rucBusqueda.js.map
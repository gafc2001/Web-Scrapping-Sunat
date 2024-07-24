import { text } from "stream/consumers";
import { RucResult } from "../models/RucResult";

const puppeteer = require('puppeteer');

const { Browser, Page } = puppeteer;

export const rucBusqueda = async (ruc: string): Promise<RucResult> => {
	let browser: typeof Browser | null = null;
	try {
		browser = await puppeteer.launch({
			headless: true,
			args: ['--no-sandbox', '--disable-setuid-sandbox']
		});

		const page: typeof Page = await browser.newPage();
		await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
		await page.goto('https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/FrameCriterioBusquedaWeb.jsp', { waitUntil: 'networkidle2' });

		await page.waitForSelector('#txtRuc');
		await page.type('#txtRuc', ruc);

		await page.on("dialog", async () => {
			browser.close();
		})
		await Promise.all([
			page.waitForNavigation({ waitUntil: 'networkidle2' }),
			page.click('#btnAceptar'),
		]);

		await page.waitForSelector('.col-sm-7 .list-group-item-heading');

		var parserDatevar = function (str: string): Date {
			const [day, month, year] = str.split('/').map(Number);
			return new Date(year, month - 1, day);
		}
		await page.exposeFunction("parserDatevar", parserDatevar);

		// extraer la información, se almacena los valores de campos en array
		const resultArray = await page.evaluate(() => {
			const items = document.querySelectorAll('.list-group-item');
			let resultArray: object = {};
			Array.from(items).forEach(item => {
				const columns = item.querySelectorAll('.col-sm-5, .col-sm-7, .col-sm-3');
				// se toma de dos en dos los datos datos(key, value)
				if (columns.length === 2) {
					const key: string = columns[0].querySelector("h4.list-group-item-heading")?.textContent?.trim() || "";
					const table = columns[1].querySelector(".tblResultado");
					let value : string = "";
					if (table) {
						const tdValues = Array.from(table.querySelectorAll('td')).map(td => td.textContent?.trim() || '');
						value = tdValues.join("|");
					} else {
						value = columns[1].querySelector('h4, p')?.textContent?.trim() || '';
					}
					value = value.replace(/\s+/g, ' ').trim();
					resultArray = {
						...resultArray,
						[key]: value,
					}
				} else if (columns.length === 4) {
					let key: string = columns[0].querySelector("h4.list-group-item-heading")?.textContent?.trim() || "";
					let value = columns[1].querySelector('h4, p')?.textContent?.trim() || '';
					value = value.replace(/\s+/g, ' ').trim();
					resultArray = {
						...resultArray,
						[key]: value,
					}

					key = columns[2].querySelector("h4.list-group-item-heading")?.textContent?.trim() || "";
					value = columns[3].querySelector('h4, p')?.textContent?.trim() || '';
					value = value.replace(/\s+/g, ' ').trim();
					resultArray = {
						...resultArray,
						[key]: value,
					}

				}
			});

			return resultArray;
		});		

		// funcion para convertir fecha de SUNAT a Date
		const parseDate = (str: string): Date => {
			const [day, month, year] = str.split('/').map(Number);
			return new Date(year, month - 1, day);
		}

		//convertir a modelo usando los elementos del array
		const textRucName : string  = resultArray["Número de RUC:"];
		const indexOfLine = textRucName.indexOf("-");
		const rucValue = textRucName.slice(0,indexOfLine).trim();
		const razonSocial = textRucName.slice(indexOfLine + 1,textRucName.length).trim();
		const rucResult: RucResult = {
			ruc: rucValue,
			razon_social: razonSocial,
			tipo_contribuyente: resultArray["Tipo Contribuyente:"] || '',
			tipo_documento: resultArray["Tipo de Documento:"] || '',
			nombre_comercial: resultArray["Nombre Comercial:"] || '',
			fecha_inscripcion: parseDate(resultArray["Fecha de Inscripción:"] || ''),
			fecha_inicio_actividades: parseDate(resultArray["Fecha de Inicio de Actividades:"] || ''),
			estado_contribuyente: resultArray["Estado del Contribuyente:"] || '',
			condicion_contribuyente: resultArray["Condición del Contribuyente:"] || '',
			domicilio_fiscal: resultArray["Domicilio Fiscal:"] || '',
			sistema_emision_comprobante: resultArray["Sistema Emisión de Comprobante:"] || '',
			actividad_comercio_exterior: resultArray["Actividad Comercio Exterior:"] || '',
			sistema_contabilidad: resultArray["Sistema Contabilidad:"] || '',
			actividades_economicas: (resultArray["Actividad(es) Económica(s):"] || '').split(', '),
			comprobantes_pago: (resultArray["Comprobantes de Pago c/aut. de impresión (F. 806 u 816):"] || '').split(', '),
			sistema_emision_electronica: (resultArray["Sistema de Emisión Electrónica:"] || '').split(', '),
			emisor_electronico_desde: parseDate(resultArray["Emisor electrónico desde:"] || ''),
			comprobantes_electronicos: resultArray["Comprobantes Electrónicos:"] || '',
			afiliado_ple_desde: resultArray["Afiliado al PLE desde:"] ? parseDate(resultArray["Afiliado al PLE desde:"]) : undefined,
			padrones: (resultArray["Padrones:"] || '').split(', '),
		};

		return rucResult;;
	} catch (error: any) {
		if (error instanceof Error) {
			console.error('Error en rucBusqueda:', error.message);
		} else {
			console.error('Error en rucBusqueda:', error);
		}
		throw new Error('Error en la consulta. Verifique el numero de RUC' + error.message);
	} finally {
		if (browser) {
			await browser.close();
		}
	}
}

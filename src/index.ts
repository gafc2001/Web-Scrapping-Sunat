import { RucResult } from "./models/RucResult";

const puppeteer = require('puppeteer');
const {Browser,Page} = puppeteer;
async function consultaRUC(ruc: string): Promise<RucResult> {
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

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('#btnAceptar'),
    ]);

    await page.waitForSelector('.col-sm-7 .list-group-item-heading');

    var parserDatevar = function(str: string): Date {
      const [day, month, year] = str.split('/').map(Number);
      return new Date(year, month - 1, day);
    }
    await page.exposeFunction("parserDatevar", parserDatevar);

    // extraer la información, se almacena los valores de campos en array
    const resultArray = await page.evaluate(() => {
      const items = document.querySelectorAll('.list-group-item');
      const resultArray: string[] = [];

      Array.from(items).forEach(item => {
        const columns = item.querySelectorAll('.col-sm-5, .col-sm-7, .col-sm-3');
        // se toma de dos en dos los datos datos(key, value)
        if (columns.length % 2 === 0) { 
          for (let i = 0; i < columns.length; i += 2) {
            let value = columns[i + 1].querySelector('h4, p')?.textContent?.trim() || '';

            const table = columns[i + 1].querySelector('table');
            if (table) {
              const tdValues = Array.from(table.querySelectorAll('tr td')).map(td => td.textContent?.trim() || '');
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

    // funcion para convertir fecha de Sunat a Date
    const parseDate = (str: string): Date => {
      const [day, month, year] = str.split('/').map(Number);
      return new Date(year, month - 1, day);
    }

    const rucResult: RucResult = {
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

    return rucResult;;
  } catch (error) {
    console.error('Error en consultaRUC:', error);
    throw new Error('Error en la consulta');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function main() {
  try {
    const ruc = '10074893550'; 
    const results = await consultaRUC(ruc);
    console.log('Resultados: ', JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Error en el script:', error);
  }
}

main();

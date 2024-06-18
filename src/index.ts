const puppeteer = require('puppeteer');
const {Browser,Page} = puppeteer;
async function consultaRUC(ruc: string): Promise<string> {
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

    const result: string = await page.evaluate(() => {
      const resultadoElement = document.querySelector('.col-sm-7 .list-group-item-heading');
      return resultadoElement ? resultadoElement.textContent?.trim() || 'No se encontraron resultados' : 'No se encontraron resultados';
    });

    return result;
  } catch (error) {
    console.error('Error en consultaRUC:', error);
    return 'Error en la consulta';
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function main() {
  try {
    const ruc = '10101666692'; 
    const result = await consultaRUC(ruc);
    console.log(`Resultado para RUC ${ruc}: ${result}`);
  } catch (error) {
    console.error('Error en el script:', error);
  }
}

main();

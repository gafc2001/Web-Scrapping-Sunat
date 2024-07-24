import { sleep } from "./utils";

const puppeteer = require('puppeteer');

const { Browser, Page,HTTPRequest } = puppeteer;

export async function getSireToken(
    ruc : string,
    usuario : string,
    clave : string,
){
    let message = "";
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    var page = await browser.newPage();
    try{
        const url = 'https://api-seguridad.sunat.gob.pe/v1/clientessol/4f3b88b3-d9d6-402a-b85d-6a0bc857746a/oauth2/loginMenuSol?originalUrl=https://e-menu.sunat.gob.pe/cl-ti-itmenu/AutenticaMenuInternet.htm&state=rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAAEZXhlY3B0AAZwYXJhbXN0AEsqJiomL2NsLXRpLWl0bWVudS9NZW51SW50ZXJuZXQuaHRtJmI2NGQyNmE4YjVhZjA5MTkyM2IyM2I2NDA3YTFjMWRiNDFlNzMzYTZ0AANleGVweA=='
    
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.goto(url, {waitUntil: 'networkidle2', timeout: 40000});

        page.on('request', async(request :typeof HTTPRequest) => {
            if(request.url().startsWith("https://e-factura.sunat.gob.pe/app/contribuyentems/servicio/consultacpe/consulta/")){
                const url = request.url().split("token=")[1]
                message = url
                await browser.close();   
            }
        });

        page.on("dialog",async () => {
            await page.close();
            await browser.close();
            throw new Error("Se abrio un dialogo, navegacion incorrecta");
        });
        await page.setViewport({width: 1080, height: 1024});
    
        await page.waitForSelector('#txtRuc');
        await page.type('#txtRuc', ruc);
    
        await page.waitForSelector('#txtUsuario');
        await page.type('#txtUsuario', usuario);
    
        await page.waitForSelector('#txtContrasena');
        await page.type('#txtContrasena', clave);
        
        await page.waitForSelector('#btnAceptar');
        
        await sleep(10000);
        await page.click('#btnAceptar');

        await sleep(5000);
        const urlMenu = "https://e-menu.sunat.gob.pe/cl-ti-itmenu/MenuInternet.htm?pestana=*&agrupacion=*";
        await page.goto(urlMenu, {waitUntil: 'networkidle2', timeout: 40000});

        await page.waitForSelector("#ifrVCE");

        await page.waitForFunction('document.querySelector("#ifrVCE").src="MenuInternet.htm?action=execute&code=11.38.1.1.1&s=ww1"');

        await sleep(2000);
    }catch(err : any){
        throw new Error(err.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
    return message;
}
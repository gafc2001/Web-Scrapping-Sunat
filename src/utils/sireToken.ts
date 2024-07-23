import { sleep } from "./utils";

const puppeteer = require('puppeteer');

const { Browser, Page,HTTPRequest } = puppeteer;

export async function getSireToken(){
    let message = "";
    const browser = await puppeteer.launch({
        headless: true,
    });
    var page = await browser.newPage();
    try{
        const url = 'https://api-seguridad.sunat.gob.pe/v1/clientessol/4f3b88b3-d9d6-402a-b85d-6a0bc857746a/oauth2/loginMenuSol?originalUrl=https://e-menu.sunat.gob.pe/cl-ti-itmenu/AutenticaMenuInternet.htm&state=rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAAEZXhlY3B0AAZwYXJhbXN0AEsqJiomL2NsLXRpLWl0bWVudS9NZW51SW50ZXJuZXQuaHRtJmI2NGQyNmE4YjVhZjA5MTkyM2IyM2I2NDA3YTFjMWRiNDFlNzMzYTZ0AANleGVweA=='
    
        page.on("dialog",async () => {
            await page.close();
            await browser.close();
            throw new Error("Se abrio un dialogo, navegacion incorrecta");
        });

        await page.goto(url, {waitUntil: 'load', timeout: 40000});
    
        // Set screen size.
        await page.setViewport({width: 1080, height: 1024});
    
        await page.waitForSelector('#txtRuc');
        await page.type('#txtRuc', "20535014940");
    
        await page.waitForSelector('#txtUsuario');
        await page.type('#txtUsuario', "OGYMOZON");
    
        await page.waitForSelector('#txtContrasena');
        await page.type('#txtContrasena', "CHRISTIAN");
        
        await page.waitForSelector('#btnAceptar');
        
        await sleep(2000);
        await page.click('#btnAceptar');

        page.on('request', async(request :typeof HTTPRequest) => {
            if(request.url().startsWith("https://e-factura.sunat.gob.pe/app/contribuyentems/servicio/consultacpe/consulta/")){
                const url = request.url().split("token=")[1]
                message = url
                await browser.close();   
            }
        })
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
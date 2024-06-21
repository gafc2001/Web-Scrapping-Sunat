import { RazonSocial } from "../models/RazonSocial";
import chromium from '@sparticuz/chromium';
import puppeteerCore from 'puppeteer-core';

const puppeteer = require('puppeteer');

const {Browser,Page} = puppeteer;

export const documentoBusqueda = async (tipoDocumento: string, numeroDocumento: string): Promise<RazonSocial[]> => {
    let browser: typeof Browser | null = null;
    
    try {
      browser = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
  
      const page: typeof Page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      await page.goto('https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/FrameCriterioBusquedaWeb.jsp', { waitUntil: 'networkidle2' });
  
      await page.waitForSelector('#btnPorDocumento');
      await page.click('#btnPorDocumento');
  
      await page.waitForSelector('#cmbTipoDoc');
      await page.select('#cmbTipoDoc', tipoDocumento);
      
      await page.type('#txtNumeroDocumento', numeroDocumento);
      await page.waitForSelector('#txtNumeroDocumento');
  
      await page.click('#btnAceptar');
  
      await page.waitForSelector(".list-group-item.clearfix.aRucs");
    
      await page.content();
    
      //iteramos por los items del list group para convertir al modelo
      const documentoResult = await page.evaluate(() => {
        const resultadoElement = document.querySelectorAll(".list-group-item.clearfix.aRucs[data-ruc]");
        let results : RazonSocial[] = [];
        resultadoElement.forEach( (el)  => {
          results.push({
            ruc : el.querySelectorAll<HTMLElement>(".list-group-item-heading")[0].innerText.split(":")[1].trim(),
            razonSocial : el.querySelectorAll<HTMLElement>(".list-group-item-heading")[1].innerText,
            ubicacion : el.querySelectorAll<HTMLElement>(".list-group-item-text")[0].innerText,
            estado : el.querySelector<HTMLElement>(".list-group-item-text strong")?.innerText,
          })
        })
        return results;
      });
  
      return documentoResult;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error en documentoBusqueda:', error.message);
      } else {
        console.error('Error en documentoBusqueda:', error);
      }
      throw new Error('Error en la consulta. Verifique el tipo y/o numero de documento');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
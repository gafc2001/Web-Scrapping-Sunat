import express, { Request, Response } from 'express';
import { RucResult } from './models/RucResult';
import { CustomResponse } from './models/Response';
import { RazonSocial } from './models/RazonSocial';
import { coincidenciasRazonSocial, razonSocialBusqueda } from './utils/razonSocialBusqueda';
import { rucBusqueda } from './utils/rucBusqueda';
import { documentoBusqueda } from './utils/documentoBusqueda';
// import { busquedaCoincidencias } from './utils/rucBusqueda';

const app = express();
const port = 3000;

app.get("/busqueda", (req : Request, res : CustomResponse<RucResult>) => {

  const tipoBusqueda : string | undefined = req.get("tipo_busqueda");
  const tipoDocumento : string | undefined = req.get("tipoDocumento");
  const value : string | undefined = req.get("value");

  
  // const result : RucResult = coincidenciasRazonSocial(value);
  // res.json(result);
});


app.get("/documento/:tipo_documento/:n_documento", async (req : Request, res : CustomResponse<RazonSocial[]>) => {
  //opciones: dni, carnet, pasaporte, cedula
  let documentoParam: string = req.params.tipo_documento;
  let tipoDocumento : string | undefined;
  //convertir a valor usado en SUNAT
  switch ( documentoParam ) {
    case "dni":
      tipoDocumento = "1";
      break;
    case "carnet":
      tipoDocumento = "4";
      break;
    case "pasaporte" : 
      tipoDocumento = "7";
      break;
    case "cedula" : 
      tipoDocumento = "A";
      break;
    default: 
      tipoDocumento = "0";
      break;
 }
  const nDocumento : string | undefined = req.params.n_documento;
  const result : RazonSocial[] = await documentoBusqueda(tipoDocumento, nDocumento);
  res.json(result);
});

app.get("/ruc/:ruc", async (req : Request, res : CustomResponse<RucResult>) => {
  const value = req.params.ruc ?? "";
  const result : RucResult = await rucBusqueda(value);
  res.json(result);
});

app.get("/razon_social/:razon_social", async(req : Request, res : CustomResponse<any[]>) => {
  const value = req.params.razon_social ?? "";
  const coincidencias = await razonSocialBusqueda(value);
  res.json(coincidencias);
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

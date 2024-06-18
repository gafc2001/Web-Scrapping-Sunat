import express, { Request, Response } from 'express';
import { RucResult } from './models/RucResult';
import { CustomResponse } from './models/Response';
import { RazonSocial } from './models/RazonSocial';
import { busquedaCoincidencias, coincidenciasRazonSocial } from './utils/rucBusqueda';
// import { busquedaCoincidencias } from './utils/rucBusqueda';

const app = express();
const port = 3000;

app.get("/ruc", (req : Request, res : CustomResponse<RucResult>) => {

  const tipoBusqueda : string | undefined = req.get("tipo_busqueda");
  const tipoDocumento : string | undefined = req.get("tipoDocumento");
  const value : string | undefined = req.get("value");

  
  // const result : RucResult = coincidenciasRazonSocial(value);
  // res.json(result);
});
app.get("/razon_social/:razon_social", async(req : Request, res : CustomResponse<any[]>) => {
  const value = req.params.razon_social ?? "";
  const coincidencias = await busquedaCoincidencias(value);
  res.json(coincidencias);
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

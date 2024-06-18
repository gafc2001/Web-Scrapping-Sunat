import express, { Request, Response } from 'express';
import { RucResult } from './models/RucResult';
import { CustomResponse } from './models/Response';
const app = express();
const port = 3000;

app.get("/", (req : Request, res : CustomResponse<RucResult>) => {

  const tipoBusqueda : string | undefined = req.get("tipo_busqueda");
  const tipoDocumento : string | undefined = req.get("tipoDocumento");
  const value : string | undefined = req.get("value");

  
  const result : RucResult ={
    ruc: "mobile",
    tipo_contribuyente: "SOCIEDAD ANONIMA CERRADA",
    nombre_comercial: "Soul tesla Northeast",
    fecha_inscripcion: new Date(),
    estado_contribuyente: "Specialist",
    condicion_contribuyente: "woot",
    domicilio_fiscal: "375",
    sistema_emision_comprobante: "black",
    sistema_contabilidad: "Convertible",
    actividades_economicas: [],
    comprantes_pago: [],
    sistema_emision_electronica: [],
    emisor_electronico_desde: new Date(),
    comprobantes_electronicos: "turquoise",
    afiliado_ple_desde: new Date(),
    padrones: "black",
    fecha_inicio_actividades: new Date(),
  }

  res.json(result);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

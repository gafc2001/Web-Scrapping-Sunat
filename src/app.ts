import express, { Request, Response } from 'express';
const app = express();
const port = 3000;

app.get("/", (req : Request, res : Response) => {
  res.json({
    ruc: "mobile",
    tipo_contribuyente: 30,
    nombre_comercial: "Soul tesla Northeast",
    fecha_inscripcion: 1718725296,
    estado_contribuyente: "Specialist",
    condicion_contribuyente: "woot",
    domicilio_fiscal: "375",
    sistema_emision_comprobante: "black",
    sistema_contabilidad: "Convertible",
    actividades_economicas: [],
    comprantes_pago: [],
    sistema_emision_electronica: "Norwegian",
    emisor_electronico_desde: 1718725296,
    comprobantes_electronicos: "turquoise",
    afiliado_ple_desde: 1718725296,
    padrones: "black",
    fecha_inicio_actividades: 1718725296,
    id: "1",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

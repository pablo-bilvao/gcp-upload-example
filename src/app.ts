import express from "express";
import multer from "multer";
import {
  bucketExists,
  createBucket,
  defaultBucketName,
  deleteBucket,
  uploadFile,
} from "./gcp-storage";
import {
  createDataset,
  createTable,
  datasetExists,
  defaultDatasetName,
  defaultTableName,
  defaultTmpBucketName,
  defaultTmpFileName,
  loadFromGCS,
  tableExists,
} from "./bigquery";

const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer({ storage: multer.memoryStorage() }); //

// Endpoint para subir archivo a Google Cloud Storage
app.post(
  "/upload/gcp-storage",
  upload.single("file"),
  async (req: any, res) => {
    try {
      // Verificar si hay un archivo en la solicitud
      if (!req.file) {
        return res.status(400).send("No se proporcionó un archivo.");
      }

      // Verificar que el archivo es CSV
      if (
        !["text/csv", "application/octet-stream"].includes(req.file.mimetype)
      ) {
        return res.status(400).send("El archivo debe ser de tipo CSV.");
      }

      const { bucketName, subfolder } = req.body;
      if (!bucketName) {
        const exists = await bucketExists(defaultBucketName);

        if (!exists) {
          await createBucket(defaultBucketName);
        }
      }

      const fileName = req.file.originalname;

      await uploadFile(
        bucketName || defaultBucketName,
        subfolder ? `${subfolder}/${fileName}` : fileName,
        req.file.buffer
      );

      res
        .status(200)
        .send(
          `Archivo ${fileName} subido exitosamente a Google Cloud Storage.`
        );
    } catch (error) {
      console.log("Error subiendo archivo:", error);

      res.status(500).send("Error subiendo archivo");
    }
  }
);

// Endpoint para subir un archivo CSV a BigQuery
app.post("/upload/bigquery", upload.single("file"), async (req: any, res) => {
  try {
    // Verificar si hay un archivo en la solicitud
    if (!req.file) {
      return res.status(400).send("No se proporcionó un archivo.");
    }
    // Verificar que el archivo es CSV
    if (!["text/csv", "application/octet-stream"].includes(req.file.mimetype)) {
      return res.status(400).send("El archivo debe ser de tipo CSV.");
    }

    let { datasetId, tableId } = req.body;
    const existsDataset = await datasetExists(datasetId || defaultDatasetName);
    if (!existsDataset) {
      datasetId = await createDataset(defaultDatasetName);
    }

    const existsTable = await tableExists(
      datasetId || defaultDatasetName,
      tableId || defaultTableName
    );
    if (!existsTable) {
      tableId = await createTable(
        datasetId || defaultDatasetName,
        tableId || defaultTableName
      );
    }

    // 1. Verificar si el bucket tmp existe, si no existe, crearlo
    const exists = await bucketExists(defaultTmpBucketName);
    if (!exists) {
      await createBucket(defaultTmpBucketName);
    }

    // 2. Subir el archivo a GCS (bucket tmp)
    await uploadFile(defaultTmpBucketName, defaultTmpFileName, req.file.buffer);

    // 3. Cargar el archivo a BigQuery
    await loadFromGCS(
      datasetId || defaultDatasetName,
      tableId || defaultTableName
    );

    // 4. Eliminar el bucket tmp
    await deleteBucket(defaultTmpBucketName);

    res
      .status(200)
      .send(
        `Archivo ${req.file.originalname} cargado exitosamente a BigQuery.`
      );
  } catch (error) {
    console.error("Error cargando archivo a BigQuery:", error);
    res.status(500).send("Error cargando archivo a BigQuery");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

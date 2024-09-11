import { BigQuery } from "@google-cloud/bigquery";
import path from "path";
import { getBucket } from "../gcp-storage";

// ##### Configurar BigQuery #####
const bigquery = new BigQuery({
  keyFilename: path.join(__dirname, "credentials.json"),
});

export const defaultDatasetName = "gcp_export_data_dataset";
export const defaultTableName = "gcp_export_data_table";
export const defaultTmpBucketName = "gcp-export-data-tmp-bucket";
export const defaultTmpFileName = "file-tmp.csv";

// ##### Utils BigQuery #####
export const createDataset = async (datasetId?: string): Promise<string> => {
  const datasetToCreate = datasetId || defaultDatasetName;
  console.log(`Creating dataset in BigQuery: ${datasetToCreate}`);

  await bigquery.createDataset(datasetToCreate);

  console.log(`Dataset ${datasetToCreate} created.`);

  return datasetToCreate;
};

export const datasetExists = async (datasetId: string): Promise<boolean> => {
  try {
    const [exists] = await bigquery.dataset(datasetId).exists();
    return exists;
  } catch (error) {
    console.log(`Error verificando la existencia del dataset: ${datasetId}`);
    throw error;
  }
};

export const tableExists = async (
  datasetId: string,
  tableId: string
): Promise<boolean> => {
  try {
    const [exists] = await bigquery.dataset(datasetId).table(tableId).exists();
    return exists;
  } catch (error) {
    console.log(`Error verificando la existencia de la tabla: ${tableId}`);
    throw error;
  }
};

export const createTable = async (
  datasetId: string,
  tableName?: string
): Promise<string> => {
  const tableToCreate = tableName || defaultTableName;
  console.log(
    `Creating table in BigQuery. Dataset: ${datasetId}, Table: ${tableToCreate}`
  );
  const dataset = bigquery.dataset(datasetId);
  const options = {};

  await dataset.createTable(tableToCreate, options);

  console.log(`Table ${tableToCreate} created.`);

  return tableToCreate;
};

export const loadFromGCS = async (datasetId: string, tableId: string) => {
  console.log(
    `Loading data from GCS to BigQuery. Dataset: ${datasetId}, Table: ${tableId}`
  );

  const bucket = getBucket(defaultTmpBucketName, defaultTmpFileName);

  const [job] = await bigquery.dataset(datasetId).table(tableId).load(bucket, {
    sourceFormat: "CSV",
    skipLeadingRows: 1,
    autodetect: true,
    location: "US",
  });

  console.log(`Data loaded from GCS to BigQuery. Job ID: ${job.id}`);
};

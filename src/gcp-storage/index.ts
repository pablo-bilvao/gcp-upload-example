import { Storage } from "@google-cloud/storage";
import path from "path";

// ##### Configurar Google Cloud Storage #####
const storage = new Storage({
  keyFilename: path.join(__dirname, "credentials.json"), // Pedir al cliente
});

export const defaultBucketName = "gcp_export_data_bucket";

// ##### Utils GCP Storage #####
export const bucketExists = async (bucketName: string): Promise<boolean> => {
  try {
    const [exists] = await storage.bucket(bucketName).exists();
    return exists;
  } catch (error) {
    console.log(
      `Error verificando la existencia del bucket: ${bucketName}`,
      error
    );
    throw error;
  }
};

export const createBucket = async (bucketName?: string): Promise<string> => {
  const bucketToCreate = bucketName || defaultBucketName;
  console.log(`Creating bucket in Google Cloud Storage: ${bucketToCreate}`);

  await storage.createBucket(bucketToCreate);

  console.log(`Bucket ${bucketToCreate} created.`);

  return bucketToCreate;
};

export const uploadFile = async (
  bucketName: string,
  fileName: string,
  buffer: any
) => {
  console.log(
    `Uploading file ${fileName} to Google Cloud Storage bucket ${bucketName}`
  );
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);

  await file.save(buffer);

  console.log(`File ${fileName} uploaded to ${bucketName}.`);
};

export const checkFileExists = async (
  bucketName: string,
  fileName: string
): Promise<boolean> => {
  try {
    const [exists] = await storage.bucket(bucketName).file(fileName).exists();
    if (exists) {
      console.log(`El archivo ${fileName} existe en el bucket ${bucketName}.`);
    } else {
      console.log(
        `El archivo ${fileName} no existe en el bucket ${bucketName}.`
      );
    }
    return exists;
  } catch (error) {
    console.info(
      `Error al verificar el archivo ${bucketName}/${fileName}`,
      error
    );

    throw error;
  }
};

export const deleteBucket = async (bucketName: string) => {
  console.log(`Deleting bucket in Google Cloud Storage: ${bucketName}`);
  const bucket = storage.bucket(bucketName);

  // Listar todos los archivos del bucket
  const [files] = await bucket.getFiles();

  // Borrar todos los archivos del bucket
  await Promise.all(files.map((file) => file.delete()));

  console.log(
    `Todos los objetos en el bucket ${bucketName} han sido eliminados.`
  );

  // Eliminar el bucket vacío
  await bucket.delete();

  console.log(`Bucket ${bucketName} deleted.`);
};

export const getBucket = (bucketName: string, fileName: string) => {
  return storage.bucket(bucketName).file(fileName);
};

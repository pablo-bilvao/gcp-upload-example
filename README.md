## Prueba de Concepto: Integración con Google Cloud Storage y BigQuery

Esta prueba de concepto muestra cómo integrar Google Cloud Storage (GCS) y BigQuery en una aplicación Node.js utilizando las credenciales de una cuenta de servicio.

### Requisitos Previos

- Node.js (v14 o superior)
- NPM (v6 o superior)
- Cuenta de Google Cloud con permisos de acceso a Google Cloud Storage y BigQuery
- Proyecto de Google Cloud con acceso a las APIs de Google Cloud Storage y BigQuery

### Configuración del Proyecto en Google Cloud

1. Habilitar las APIs de Google Cloud

    Para utilizar Google Cloud Storage y BigQuery, debes habilitar las siguientes APIs en tu proyecto de Google Cloud:

1. Ve a la Google Cloud Console.
2. Selecciona tu proyecto.
3. Dirígete a APIs & Services > Library.
4. Busca y habilita las siguientes APIs:

   - Google Cloud Storage JSON API
   - BigQuery API

5. Crear una Cuenta de Servicio y Generar Credenciales

   Para que tu aplicación pueda acceder a GCS y BigQuery, necesitas crear una cuenta de servicio y descargar el archivo de credenciales JSON.

   1. En la Google Cloud Console, ve a IAM & Admin > Service Accounts.
   2. Haz clic en Create Service Account.
      - Proporciona un nombre para la cuenta de servicio (por ejemplo, my-storage-bigquery-service-account)
      - Haz clic en Create and Continue.
   3. Asigna los siguientes roles a la cuenta de servicio:
      - Storage Admin (para acceso completo a Google Cloud Storage)
      - BigQuery Data Editor (para acceso completo a BigQuery)
      - Haz clic en Continue y luego en Done.
   4. En la lista de cuentas de servicio, selecciona la cuenta que acabas de crear.
   5. Ve a la pestaña Keys y haz clic en Add Key > Create New Key.
      - Selecciona JSON como tipo de clave y haz clic en Create.
      - Guarda el archivo JSON descargado en un lugar seguro. No compartas este archivo, ya que contiene información confidencial de acceso.

6. Configurar las Credenciales en tu Aplicación

- Coloca el archivo JSON de credenciales en los directorios:
  - `src/bigquery/credentials.json`
  - `stc/gcp-storage/credentials.json`

### Configuración de la Aplicación

1. Clonar el Repositorio

   Clona este repositorio en tu máquina local:

   ```bash
   $ git clone https://github.com/pablo-bilvao/gcp-upload-example
   $ cd gcp-upload-example
   ```

2. Instalar Dependencias

   Instala las dependencias necesarias usando NPM:

   ```bash
   $ npm install
   ```

### Ejecutar la Aplicación

Ejecuta la aplicación:

```bash
$ npm start
```

### Test

Se puede probar ejecutando los requests que se encuentran en el directorio `src/requests`

Para poder ejecutarlos directamente desde el VS Code hay que instalar la extención de `REST Client`

### Contribuciones

Siéntete libre de crear un Pull Request o abrir un Issue para mejorar esta prueba de concepto.

### Licencia

Este proyecto está bajo la licencia MIT.

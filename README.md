# DGII-UTILS
DGII-Utils es un paquete de herramientas diseñado para simplificar la interacción con las aplicaciones web de la Dirección General de Impuestos Internos (DGII) en la República Dominicana. Este paquete incluye funciones para validar formatos fiscales como RNCs, cédulas, y comprobantes fiscales.

## Consultas

### consultRNC
Esta función realiza consultas sobre el Registro Nacional de Contribuyentes (RNC), obteniendo información relevante sobre un contribuyente específico según su RNC. Es útil para verificar la validez y detalles de un RNC en sistemas fiscales o administrativos.

### consultCuidadanos
Esta función realiza consulta que muestran a las personas inscritas en el RNC como:  Propietario de Vehículos/Inmuebles, Empleado/Asalariado, Diplomático/Cónsul, Participación en Empresas, Sucesiones y Otras ocupaciones 

**Nota:** No todas las Cedulas o RNC funcionan

### consultNCF
Esta función permite consultar información sobre Números de Comprobantes Fiscales (NCF). Es utilizada para verificar la validez de un NCF y para obtener detalles relacionados con los comprobantes fiscales emitidos.

### consultENCF
Función que realiza consultas sobre Números de Comprobantes Fiscales Electrónicos (e-CF). Proporciona detalles y verifica la autenticidad de un e-CF, asegurando que cumple con las normativas y está correctamente registrado.

## Objetos 

### RNC
Este objeto contiene funciones para trabajar con el Registro Nacional de Contribuyentes (RNC O Cedulas). Incluye:

- **valid:** Valida si un RNC dado cumple con el formato y los criterios establecidos por la DGII.
- **format:** Aplica el formato estándar a un RNC, añadiendo los separadores correspondientes si es necesario.
- **clear:** Elimina cualquier carácter no numérico, dejando solo los dígitos del RNC.

### NCF
Este objeto maneja funciones para los Números de Comprobantes Fiscales (NCF). Incluye:

- **valid:** Verifica si un NCF cumple con el formato y las reglas de validación oficiales.
- **format:** Da formato a un NCF, estructurándolo según las normas de presentación.
- **clear:** Elimina caracteres innecesarios, dejando el NCF en su forma más simple y utilizable.

### ENCF
Este objeto está diseñado para gestionar funciones relacionadas con los Números de Comprobantes Fiscales Electrónicos (e-CF). Incluye:

- **valid:** Valida un e-CF asegurando que cumple con los requisitos de formato y validación.
- **format:** Aplica el formato adecuado a un e-CF, garantizando que siga el estándar requerido.
- **clear:** Limpia el e-CF de caracteres no esenciales, manteniendo solo la información relevante.

### CarPlate 
Este objeto ofrece herramientas para manejar y validar placas de vehículos. Sus funciones principales incluyen:

**valid:** Verifica si una placa de vehículo es válida según los formatos y reglas establecidos.
**getType:** Identifica y devuelve el tipo de placa de vehículo basándose en su código.

### isSecureCode
Esta función valida el formato del Código de Seguridad de un e-CF. 

### DGIIReceiptTypes
Este objeto maneja los diferentes tipos de comprobantes fiscales (NCF) reconocidos por la Dirección General de Impuestos Internos (DGII). Permite identificar, clasificar y trabajar con los distintos tipos de comprobantes según sus códigos y características.

## Nota Importante
Las WebApps de la DGII puede que den uno que otro error por unos segundos.
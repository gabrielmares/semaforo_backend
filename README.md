
# Renovaciones de créditos, Back-end

En este repo diseñe la funcionalidad que complementa y agrega capas de seguridad al sistema actual de la empresa. Importamos registros desde una BD en **Firebird** con la libreria [Node-Firebird](https://www.npmjs.com/package/node-firebird)  que son almacenados en [MySql](https://www.npmjs.com/package/mysql2) para su manejo y mejor acceso.



# Creación y migración

Con [CronJobs](https://www.npmjs.com/package/node-schedule) se migran los datos diariamente durante las noches, al siguiente día con los saldos actualizados de los clientes se pueden procesar renovaciones, siempre y cuando cumplan con los siguientes filtros

 - Saldo pendiente < al 10% del crédito*
 - Fecha de vencimiento del crédito actual dentro de los próximos 15 días*

*Parámetros validados en el Front-end
 
 Si el cliente cumple con es los anteriores parámetros, el sistema le permite generar la solicitud de crédito con los datos obligatorios para acceder a la renovación de su crédito, si no pasa esos parámetros, no se puede generar la solicitud de crédito.
 
![Mysql](https://github.com/gabrielmares/semaforo_backend/blob/main/ejemplos/DB.JPG)

![Node](https://github.com/gabrielmares/semaforo_backend/blob/main/ejemplos/syncDB.JPG)

# Sesiones de Usuarios
Integra [BcryptJS](https://www.npmjs.com/package/bcryptjs) , [JsonWebToken](https://www.npmjs.com/package/jsonwebtoken), [Passport](https://www.npmjs.com/package/passport)  entre las dependencias que gestionan el acceso de los usuarios a la información. 

Cuando el usuario inicia sesión, solicita el token al servidor enviando sus credenciales, este le responde con el token almacenado en cookies. [SignIn](https://github.com/gabrielmares/semaforo_backend/blob/2bae13acd80d132ea4ee403b584140a05d240a5d/src/routes/login.js#L10)

Si el usuario actualiza la pagina en el front-end, este valida la vigencia de las credenciales del actual usuario [CurrentUser](https://github.com/gabrielmares/semaforo_backend/blob/2bae13acd80d132ea4ee403b584140a05d240a5d/src/routes/login.js#L14)
 
Solo el administrador tiene privilegios para las siguientes acciones

 [SignUp, crear nuevos usuarios](https://github.com/gabrielmares/semaforo_backend/blob/a7b492ab9929cebf64f4b1aab5dc27d4142b00ef/src/routes/login.js#L8)
 
 [Ver lista de usuarios](https://github.com/gabrielmares/semaforo_backend/blob/2e55a4638c0d7b6717685ed8738c3361a2c86df5/src/routes/login.js#L22)

[Actualizar informacion de usuario](https://github.com/gabrielmares/semaforo_backend/blob/2e55a4638c0d7b6717685ed8738c3361a2c86df5/src/routes/login.js#L26)

[Bloquear usuario](https://github.com/gabrielmares/semaforo_backend/blob/2e55a4638c0d7b6717685ed8738c3361a2c86df5/src/routes/login.js#L29)

[Eliminar usuario](https://github.com/gabrielmares/semaforo_backend/blob/2e55a4638c0d7b6717685ed8738c3361a2c86df5/src/routes/login.js#L31)


la aplicacion se ejecuta dentro de la intranet de la empresa, no tiene certificado SSL y su trafico a internet esta bloqueado por el Firewall.

** Por seguridad de la empresa, no puedo publicar mas datos ni informacion **
> Written with [StackEdit](https://stackedit.io/).

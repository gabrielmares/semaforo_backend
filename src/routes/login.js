let router = require('express').Router();
let { signup, signin, usersList, currentUser, logOut, deleteUser, updateUser, blockUser } = require('../controllers/login');
const middleware = require('../helpers/middleware')
const isAdmin = require('../helpers/adminRequest')


// endpoint de registro de usuarios
router.post('/signup', isAdmin, signup)
// endpont para iniciar sesion de usuarios
router.post('/signin', signin)

// endpoint para recuperar la informacion del usuario actual en la sesion
// si el token esta vencido, se le reenvia a iniciar sesion
router.get('/currentuser', middleware, currentUser)

// borramos el token del usuario en el cliente
// si accede otro usuario desde el equipo,
// no acceda con el token del anterior usuario
router.get('/logout', logOut)

// lista de usuarios activos en el sistema
router.get('/userslist', isAdmin, usersList)


// actualizacion de usuarios en BD
router.put('/update', isAdmin, updateUser);

// bloqueo de cuentas de usuarios en BD
router.put('/denied', isAdmin, blockUser);

router.delete('/delete', isAdmin, deleteUser);



module.exports = router;
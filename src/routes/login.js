let router = require('express').Router();
let { signup, signin, usersList, currentUser, logOut } = require('../controllers/login');
const middleware = require('../helpers/middleware')


// endpoint de registro de usuarios
router.post('/signup', signup)
// endpont para iniciar sesion de usuarios
router.post('/signin', signin)

// endpoint para recuperar la informacion del usuario actual en la sesion
// si el token esta vencido, se le reenvia a 
router.get('/currentuser', currentUser)

// borramos el token del usuario en el cliente
// si accede otro usuario desde el equipo,
// no acceda con el token del anterior usuario
router.get('/logout', logOut)

// lista de usuarios activos en el sistema
router.get('/userslist', middleware, usersList)


module.exports = router;
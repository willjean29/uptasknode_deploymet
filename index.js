const express = require('express');
const routes =require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

// extraer valores de varibles .env
require('dotenv').config({path:'variables.env'})

// helpers con algunas funciones
const helpers = require('./helpers');

// Crear la conexion a la base de datos
const db = require('./config/db');
// Importar los modelos
require('./models/Proyecto');
require('./models/Tarea');
require('./models/Usuarios');
// Sincronizar la base de datos
db.sync()
    .then(() => console.log('Conectado al Servidor'))
    .catch((error) => console.log(error));


// Crear una app de express
const app = express();

// Donde cargar los archivos estaticos
app.use(express.static('public'));

// Habilitar Pug
app.set('view engine', 'pug');

// Habilitar bodyParser para leer datos de un formulario
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Agregamos express validator a toda la aplicacion
// app.use(expressValidator());

// Añadir la carpeta vista
app.set('views',path.join(__dirname,'/views'));

// Agregar flash mesages
app.use(flash());

app.use(cookieParser());

// Sesiones nos permite navegar entre ditintas paginas sin volvernos a auntentificar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Pasar vardump a la aplicacion
app.use((req,res,next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});



app.use('/',routes());
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
app.listen(port,host);


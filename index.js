//Librerias externas
const express = require('express');
const fs = require('fs');
const {v4: uuidv4} = require('uuid');

    //Insertar bitácora al listar
    const moment = require('moment')
    const time = moment().format('YYYY-MM-DD HH:mm:ss')
    const log = JSON.parse(fs.readFileSync('access_log.json', 'utf8'))

 //Modulos internas
 const { readFile, writeFile } = require('./src/files');

 const app = express();
 const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || 'My App';
 const FILE_NAME = './db/carros.txt';

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('views', './src/views');
app.set('view engine', 'ejs') //DEBEMOS CREAR LA CARPETA

app.get('/read-file', (req, res)=>{
    const data = readFile(FILE_NAME);
    res.send(data);
})

//WEB LISTAR CARROS
app.get('/carros', (req, res) =>{
    const data = readFile(FILE_NAME);
    res.render('carros/index', {carros : data});

    log.insert_request_dates.push(
        new_record = {"date": time})
        fs.writeFileSync('access_log.json', JSON.stringify(log))
})

//WEB CREAR CARRO
app.get('/carros/create', (req,res) =>{
    //Mostrar el formulario
    res.render('carros/create');
})

app.post('/carros', (req,res) =>{
    try{
        //Leer el archivo de carros
        const data = readFile(FILE_NAME);
    
        //Agregar el nuevo registro
        const newCar = req.body;
        newCar.id = uuidv4();
        console.log(newCar)
        data.push(newCar); //agrego nuevo elemento
        //Escribir en el archivo
        writeFile(FILE_NAME, data);
        res.redirect('/carros')
    }catch (error){
            console.error(error);
            res.json({message: ' Error al almacenar el carro'});
        }
})

//WEB ELIMINAR CARRO
app.post('/carros/Delete/:id', (req, res) =>{
    console.log(req.params.id);
    //GUARDAR ID
    const id = req.params.id
    //leer contenido del archivo
    const cars = readFile(FILE_NAME)

    //BUSCAR EL CARRO CON EL ID QUE RECIBE
    const carroIndex = cars.findIndex(carro => carro.id === id)
    if(carroIndex < 0){
        res.status(404).json({'ok': false, message:"car not found"})
        return;
    }
    //eliminar el carro en la posicion
    cars.splice(carroIndex,1);
    writeFile(FILE_NAME, cars)
    res.redirect('/carros');
})


//API
//Listar Mascotas
app.get('/api/carros', (req,res) =>{
    const data = readFile(FILE_NAME);
    res.json(data);
})


//Crear Mascota
app.post('/api/carros', (req, res) => {
    try{
    //Leer el archivo de mascotas
    const data = readFile(FILE_NAME);

    //Agregar el nuevo carro
    const newCar = req.body;
    newCar.id = uuidv4();
    console.log(newCar)
    data.push(newCar); //agrego nuevo elemento
    //Escribir en el archivo
    writeFile(FILE_NAME, data);
    res.json({message: 'La mascota fue creada'});
    }catch (error){
        console.error(error);
        res.json({message: ' Error al almacenar la mascota'});
    }

});

//Obtener una sola mascota (usamos los dos puntos por que es un path param)
app.get('/api/carros/:id', (req, res) =>{
    console.log(req.params.id);
    //GUARDAR ID
    const id = req.params.id
    //leer contenido del archivo
    const pets = readFile(FILE_NAME)

    //BUSCAR LA MASCOTA CON EL ID QUE RECIBE
    const petFound = pets.find(carro => carro.id === id)
    if(!petFound){
        res.status(404).json({'ok': false, message:"Pet not found"})
        return;
    }

    res.json({'ok': true, pet: petFound});
})
//ACTUALIZAR UN DATO
app.put('/api/pets/:id', (req, res) =>{
    console.log(req.params.id);
    //GUARDAR ID
    const id = req.params.id
    //leer contenido del archivo
    const pets = readFile(FILE_NAME)

    //BUSCAR LA MASCOTA CON EL ID QUE RECIBE
    const petIndex = pets.findIndex(pet => pet.id === id)
    if(petIndex < 0){
        res.status(404).json({'ok': false, message:"Pet not found"})
        return;
    }
    let pet = pets[petIndex]; //sacar del arreglo
    pet={...pet, ...req.body}
    pets[petIndex] = pet //Poner la mascota en el mismo lugar
    writeFile(FILE_NAME, pets);
    //SI LA MASCOTA EXISTE MODIFICAR LOS DATOS Y ALMACENAR NUEVAMENTE


    res.json({'ok': true, pet: pet});
})

//Delete, eliminar un dato
app.delete('/api/pets/:id', (req, res) =>{
    console.log(req.params.id);
    //GUARDAR ID
    const id = req.params.id
    //leer contenido del archivo
    const pets = readFile(FILE_NAME)

    //BUSCAR LA MASCOTA CON EL ID QUE RECIBE
    const petIndex = pets.findIndex(pet => pet.id === id)
    if(petIndex < 0){
        res.status(404).json({'ok': false, message:"Pet not found"})
        return;
    }
    //eliminar la mascota en la posicion
    pets.splice(petIndex,1);
    writeFile(FILE_NAME, pets)
    res.json({'ok': true});
})

app.listen(3000, () => {
    console.log(`${APP_NAME} está corriendo en http://localhost:${PORT}`);
});
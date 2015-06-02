exports = module.exports = function(app, mongoose) {

  var userSchema = new mongoose.Schema({
    nombre: {type: String},
    apellidos: {type: String},
    edad: {type: Number},
    login: {type: String},
    password: {type: String},
    direcion: {type: String},
    mail: {type: String},
    rol: 		{
      type: String,
      enum: ['cliente', 'monitor', 'admin']
    }

  });

  mongoose.model('user', userSchema);
};
//
// exports = module.exports = function(app, mongoose) {
//   var rutinasSchema = new mongoose.Schema({
//     nombre: {type: String},
//     descripcion: {type: String}
//   });
//   mongoose.model('rutinas', rutinasSchema);
// };
//
// exports = module.exports = function(app, mongoose) {
//   var ejerciciosSchema = new mongoose.Schema({
//     nombre: {type: String},
//     descripcion: {type: String},
//     foto: {type: String}
//   });
//   mongoose.model('ejercicios', ejerciciosSchema);
// };
//
// exports = module.exports = function(app, mongoose) {
//   var ejercicios_rutinasSchema = new mongoose.Schema({
//     id_ejercicio: Object,
//     id_rutina: Object,
//     repeticiones: Number
//   });
//   mongoose.model('ejercicios_rutinas', ejercicios_rutinasSchema);
// };
//
// exports = module.exports = function(app, mongoose) {
//   var rutinas_ejercicios_sociosSchema = new Schema({
//
//
//   });
//   mongoose.model('rutinas_ejercicios_socios', rutinas_ejercicios_sociosSchema);
// };
//
// exports = module.exports = function(app, mongoose) {
//   var tarifasSchema = new mongoose.Schema({
//     nombre: {type: String},
//     duracion: Number, //ponerla en milisegundos?
//     precio: Number
//   });
//
//   mongoose.model('tarifas', tarifasSchema);
// };
//
// exports = module.exports = function(app, mongoose) {
//   var tarifas_sociosSchema = new mongoose.Schema({
//     id_socio: Object,
//     id_tarifa: Object,
//     f_inicio: date
//   });
//   mongoose.model('tarifas_socios', tarifas_sociosSchema);
// };

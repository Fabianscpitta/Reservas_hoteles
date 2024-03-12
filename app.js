require('colors');
const { guardarDB, leerDB } = require('./helpers/guardarArchivo');

const {
  inquirerMenu,
  pausa,
  leerInput,
  crearReserva,
  verListaReservas,
  registrarCheckIn,
  registrarCheckOut,
  verHabitacionesDisponibles,
  gestionarServiciosParaHabitacion
} = require('./helpers/inquirer')

const main = async () => {
  let opt = '';
  // const reservas = [];
  const reservas = leerDB('data.json');

  do {
      opt = await inquirerMenu();

      switch (opt) {
          case '1':
              await crearReserva(reservas);
              break;

          case '2':
              verListaReservas(reservas);
              await pausa();
              break;

          case '3':
              await registrarCheckIn(reservas);
              break;

          case '4':
              await registrarCheckOut(reservas);
              break;

          case '5':
              await gestionarServiciosParaHabitacion(reservas);
              break;
      }
      guardarDB(reservas);
  } while (opt !== '0');
}

main();
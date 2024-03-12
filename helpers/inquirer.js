const inquirer = require('inquirer');
require('colors');

const preguntas = [
  {
      type: 'list',
      name: 'opcion',
      message: `${ 'que desea hacer?'.blue}`,
      choices: [
          {
              value: '1',
              name: `${ '1.'.red } ${ 'Realizar una reserva'.yellow}`
          },
          {
              value: '2',
              name: `${ '2.'.red } ${ 'Ver lista de reservas'.yellow}`
          },
          {
              value: '3',
              name: `${ '3.'.red } ${ 'Habilitar Habitacion'.yellow}`
          },
          {
              value: '4',
              name: `${ '4.'.red } ${ 'Desabilitar Habitacion'.yellow}`
          },
          {
              value: '5',
              name: `${ '5.'.red } ${ 'Gestionar servicios'.yellow}`
          },
          {
              value: '0',
              name: `${ '0.'.red } ${ 'Salir'.yellow}`
          },
      ]
  }
];
const inquirerMenu = async () => {
  console.clear();
  console.log('=========================='.red);
  console.log('  Gestión de Hotel'.white);
  console.log('==========================\n'.red);

  const { opcion } = await inquirer.prompt(preguntas);
  return opcion;
}
const pausa = async() => {
    
  const question = [
      {
          type: 'input',
          name: 'enter',
          message: `Presione ${ 'enter'.red } para continuar`
      }
  ];

  console.log('\n');
  await inquirer.prompt(question);
}

const leerInput = async( message ) => {

  const question = [
      {
          type: 'input',
          name: 'desc',
          message,
          validate( value ) {
              if( value.length === 0 ) {
                  return 'Por favor ingrese un valor';
              }
              return true;
          }
      }
  ];

  const { desc } = await inquirer.prompt(question);
  return desc;
}
const crearReserva = async (reservas) => {
  console.log('Crear una nueva reserva:\n'.red);

  const nombre = await leerInput(`${'Nombre:'.yellow}`);
  const apellido = await leerInput(`${'Apellido:'.yellow}`);
  const habitacion = await leerInput(`${'Numero de habitacion:'.yellow}`);
  
  // Verificar si ya existe una reserva activa en la habitación
  const reservaExistente = reservas.find(r => r.habitacion === habitacion && !r.checkOut);

  if (reservaExistente) {
      console.log(`\nYa existe una reserva activa en la habitación ${habitacion}. No se puede crear una nueva reserva.`.red);
  } else {
      const fechaInicio = await leerInput(`${'Fecha de inicio (YYYY-MM-DD):'.yellow}`) ;
      const fechaFin = await leerInput(`${'Fecha de fin (YYYY-MM-DD):'.yellow}`) ;

      const reserva = {
          nombre,
          apellido,
          habitacion,
          fechaInicio,
          fechaFin,
          checkIn: false,
          checkOut: false
      };

      reservas.push(reserva);

      console.log('\nReserva creada exitosamente.'.red);
  }

  await pausa();
}

const verListaReservas = (reservas) => {
console.log('Lista de Reservas:\n'.red);
reservas.forEach((reserva, index) => {
    const estado = reserva.checkOut ? 'Check-Out realizado' : reserva.checkIn ? 'Check-In realizado' : 'Pendiente';
    const servicios = reserva.servicios ? Object.keys(reserva.servicios).filter(servicio => reserva.servicios[servicio]).join(', ') : 'Ninguno';
    console.log(`${(index + 1 + '.').red} 
    Nombre y apellidos: ${reserva.nombre.yellow} ${reserva.apellido.yellow}
    Habitación: ${reserva.habitacion.yellow}
    Inicio: ${reserva.fechaInicio.yellow}
    Fin: ${reserva.fechaFin.yellow}
    Estado: ${estado.yellow}
    Servicios: ${servicios.yellow}`);
});
console.log();
}
const registrarCheckIn = async (reservas) => {
  console.log('Habilitar habitacion:\n'.red);
  const habitacion = await leerInput(`${'Número de habitación para habilitarla:'.yellow}`);
  const reserva = reservas.find(r => r.habitacion === habitacion);

  if (reserva) {
      if (!reserva.checkIn) {
          reserva.checkIn = true;
          console.log('\nhabitacion habilitada exitosamente.'.red);
      } else {
          console.log('\nEl habitacion ya ha sido registrado anteriormente.'.red);
      }
  } else {
      console.log('\nHabitación no encontrada o ya ha sido registrada.'.red);
  }

  await pausa();
}

const registrarCheckOut = async (reservas) => {
  console.log('Desabilitar Habitacion:\n'.red);
  const habitacion = await leerInput(`${'Número de habitación para desahabilitarla:'.yellow}`);
  const reservaIndex = reservas.findIndex(r => r.habitacion === habitacion);

  if (reservaIndex !== -1) {
    const reserva = reservas[reservaIndex];

    if (reserva.checkIn && !reserva.checkOut) {
      reserva.checkOut = true;
      console.log('\n habitacion desabilitada exitosamente.'.red);
      console.log('Registro eliminado.'.red);

      // Elimina la reserva del array
      reservas.splice(reservaIndex, 1);
    } else if (!reserva.checkIn) {
      console.log('\nPrimero debe realizar la habilitacion para esta habitación.'.red);
    } else if (reserva.checkOut) {
      console.log('\nEl ya ha sido desabilitado anteriormente.'.red);
    }
  } else {
    console.log('\nHabitación no encontrada o no ha sido registrada.'.red);
  }

  await pausa();
}



const gestionarServiciosParaHabitacion = async (reservas) => {
    console.log('Gestionar Servicios para una Habitación Registrada:\n'.red);
    const habitacion = await leerInput(`${'Número de habitación para gestionar servicios:'.yellow}`); 
    const reserva = reservas.find(r => r.habitacion === habitacion);

    if (reserva) {
        console.log(`Usted está gestionando servicios para la habitación ${habitacion}:\n`.red);

        const servicios = reserva.servicios || {}; // Inicializar servicios si no existen

        // Pedir los servicios por consola
        console.log(`${'Ingrese el estado de los servicios:'.yellow}`);
        console.log(`${'Ejemplo: spa true (para habilitar el spa) o piscina false (para deshabilitar la piscina)'.yellow}`);  
        console.log(`${'Deje vacío y presione Enter para continuar sin cambios.'.yellow}`); 

        const opciones = ['spa', 'piscina', 'limpieza', 'gimnasio'];

        for (const servicio of opciones) {
            const input = await leerInput(`${servicio.yellow}: `);
            if (input.trim() !== '') {
                const [nombre, estado] = input.trim().split(' ');
                servicios[nombre] = estado === 'true';
            }
        }

        // Actualizar los servicios en la reserva
        reserva.servicios = servicios;

        console.log('\nServicios actualizados exitosamente.'.red);
    } else {
        console.log('\nHabitación no encontrada o no ha sido registrada.'.red);
    }

    await pausa();
}

module.exports = {
  inquirerMenu,
  pausa,
  leerInput,
  crearReserva,
  verListaReservas,
  registrarCheckIn,
  registrarCheckOut,
  gestionarServiciosParaHabitacion
};
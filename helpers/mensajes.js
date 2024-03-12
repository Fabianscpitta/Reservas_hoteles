require('colors');


const mostrarMenu = () => {

    return new Promise( resolve => {

        console.clear();
        console.log('=========================='.green);
        console.log('  Seleccione una opción'.green);
        console.log('==========================\n'.green);

        console.log(`${ '1.'.green } Crear reserva`);
        console.log(`${ '2.'.green } Ver lista de reservas`);
        console.log(`${ '3.'.green } Registrar check-in`);
        console.log(`${ '4.'.green } Registrar check-out`);
        console.log(`${ '5.'.green } Ver lista de habitaciones disponibles`);
        console.log(`${ '6.'.green } Gestionar servicios`);
        console.log(`${ '0.'.green } Salir \n`);

        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readline.question('Seleccione una opción: ', (opt) => {
            readline.close();
            resolve(opt);
        })

    });

    

}

const pausa = () => {

    return new Promise( resolve => {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
    
        readline.question(`\nPresione ${ 'ENTER'.green } para continuar\n`, (opt) => {
            readline.close();
            resolve();
        })
    });
}


module.exports = {
    mostrarMenu,
    pausa
}
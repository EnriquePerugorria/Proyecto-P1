export default class Telecentro {
	constructor(){
		this.operadores = [];
		this.llamadas 	= [];
	}

	agregarOperador(operador){
		let mensaje = "";

		if (!this.verificarNombreOperador(operador.nombre)) {
			this.operadores.push(operador);
			mensaje = "El operador fue agregado con éxito.";
		} else{
			mensaje = "Ya existe un operador con ese nombre.";
		}

		return mensaje;		
	}

    agregarLlamada(llamada){
    	let mensaje = "";
    	if (verificarNumCelular) {
    		this.llamadas.push(llamada);
    		mensaje= "La llamada se agregó correctamente";
    	}else{
			mensaje= "El número del celular es incorrecto";
    	}
    	return mensaje;
	}

	obtenerIdLlamada(){
		let idUltimaLlamada = this.llamadas[this.llamadas.length - 1].id;
		return idUltimaLlamada + 1;
	}

	verificarNombreOperador(nombre) {
		let esta = false;
		let cont = 0;

		while(!esta && cont < this.operadores.length) {
			if(this.operadores[cont].nombre == nombre) {
				esta = true;
			}
		}

		return esta;
	}

	verificarNumCelular(numero){
		let correcto = false;
		let primeros = parseInt(numero.silce(0,2))
		if (primeros >=91 && primeros<=99) {
			correcto=true;
		}
		return	correcto;
	}
	//ToDo: Agregar método toString
}

export default class Operador{
	constructor(nombre,edad,mail){
		this.nombre = nombre;
		this.edad   = edad;
		this.mail   = mail;
	}
	//ToDo: Agregar método toString
}

export default class Llamada{
	constructor(id,operador,descripcion,motivo,duracion,celular){
		this.id 		 = id;
		this.operador 	 = operador;
		this.descripcion = descripcion;
		this.motivo 	 = motivo;
		this.duracion 	 = duracion;
		this.celular 	 = celular;
	}
	//ToDo: Agregar método toString

}
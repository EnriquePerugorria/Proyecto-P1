class Telecentro {
    constructor() {
        this.operadores = [];
        this.llamadas = [];
    }

    agregarOperador(operador) {
        let mensaje = {};

        if (!this.verificarNombreOperador(operador.nombre)) {
            this.operadores.push(operador);
            mensaje.codigo = "exito";
            mensaje.mensaje = "El operador fue agregado con éxito.";
        } else {
            mensaje.codigo = "error";
            mensaje.mensaje = "Ya existe un operador con ese nombre.";
        }

        return mensaje;
    }

    ordenarOperadores(clave) {
        let operadores = this.operadores;

        for (let i = operadores.length - 1; i >= 0; i--) {
            let max = operadores[i][clave];
            let posMax = i;

            for (let j = 0; j <= i; j++) {
                if (operadores[j][clave].toUpperCase() > max.toUpperCase()) {
                    max = operadores[j][clave];
                    posMax = j;
                }
            }

            let aux = operadores[i];

            operadores[i] = operadores[posMax];
            operadores[posMax] = aux;
        }

        this.operadores = operadores;
    }

    verificarNombreOperador(nombre) {
        let esta = false;
        let cont = 0;

        if (this.operadores.length > 0) {
            while (!esta && cont < this.operadores.length) {
                if (this.operadores[cont].nombre == nombre) {
                    esta = true;
                }

                cont = cont + 1;
            }
        }

        return esta;
    }


    agregarLlamada(llamada) {
        let mensaje = {};

        if (telecentro.verificarNumCelular(llamada.celular)) {
            this.llamadas.push(llamada);
            mensaje.codigo = "exito";
            mensaje.mensaje = "La llamada se agregó correctamente.";
        } else {
            mensaje.codigo = "error";
            mensaje.mensaje = "El número de celular proporcionado es incorrecto.";
        }

        return mensaje;
    }

    ordenarLlamadas(clave){
	    if (clave=="id") {
	        this.llamadas.sort(function(a,b){
	            if(a.id < b.id)return -1;
	            if(a.id > b.id)return 1;
	            return 0;
	        });
	    } else {
	        this.llamadas.sort(function(a,b){
	            if(a.id < b.id)return -1;
	            if(a.id > b.id)return 1;
	            return 0;
	        });
	        this.llamadas.sort(function(a,b){
	            if(a.operador.toLowerCase() < b.operador.toLowerCase())return -1;
	            if(a.operador.toLowerCase() > b.operador.toLowerCase())return 1;
	            return 0;
	        });  
	      
	    }            
    }

    obtenerIdLlamada() {
        let idUltimaLlamada
        
        if (this.llamadas.length == 0) {
            idUltimaLlamada =1
        } else{
        	let max = 1;
            for (let i = 0; i < this.llamadas.length; i++) {
               	if (this.llamadas[i].id > max) {
                	max=this.llamadas[i].id;
            	}
        	}
           
        	idUltimaLlamada = max + 1;
        }

        return idUltimaLlamada;
    }
 
    verificarNumCelular(numero) {
        let correcto = false;
        let primeros = parseInt(numero.slice(0, 3));
        
        if (primeros >= 91 && primeros <= 99) {
            correcto = true;
        }

        return correcto;
    }
}

class Operador {
    constructor(nombre, edad, mail) {
        this.nombre = nombre;
        this.edad = edad;
        this.mail = mail;
    }
}

class Llamada {
    constructor(id, operador, descripcion, motivo, duracion, celular) {
        this.id = id;
        this.operador = operador;
        this.descripcion = descripcion;
        this.motivo = motivo;
        this.duracion = duracion;
        this.celular = celular;
    }
}

window.addEventListener("load", inicio);

let telecentro;

function inicio() {
    telecentro = new Telecentro();

    document.getElementById("btn-agregar-operador").addEventListener("click", agregarOperador);
    document.getElementById("radio-nombre").addEventListener("click", listarOperadores);
    document.getElementById("radio-edad").addEventListener("click", listarOperadores);
    document.getElementById("radio-numero").addEventListener("click", listarLlamadas);
    document.getElementById("radio-nombre-numero").addEventListener("click", listarLlamadas);
    document.getElementById("btn-consultar-historia").addEventListener("click", consultarHistoria);
    document.getElementById("btn-distribucion").addEventListener("click", dibujarGrafico);
    document.getElementById("btn-agregar-llamada").addEventListener("click", agregarLlamada);
    document.getElementById("btn-consultar-palabras").addEventListener("click", consultaPorPalabras);
    document.getElementById("btn-consultar-operadores-duracion").addEventListener("click", consultarPorDuracion);

    listarOperadores();
    listarLlamadas();
    cargarSelector("select-operador-llamadas");
    cargarSelector("select-operador-consultas");

    manejarElementoPorNombre("resultado-consulta-por-operador", "none");
}

//CHART

function dibujarGrafico() {
    if (telecentro.operadores.length != 0 && telecentro.llamadas.length != 0) {
        let totalLlamadas = telecentro.llamadas.length;
        let datos = [];

        for (let i = 0; i < telecentro.operadores.length; i++) {
            let dato = {};
            let llamadas = 0;

            dato.label = telecentro.operadores[i].nombre;

            for (let j = 0; j < telecentro.llamadas.length; j++) {
                if (telecentro.operadores[i].nombre == telecentro.llamadas[j].operador) {
                    llamadas = llamadas + 1;
                }
            }

            dato.y = parseInt((llamadas * 100) / totalLlamadas);
            datos.push(dato);
        }

        let chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            data: [{
                type: "pie",
                startAngle: 0,
                yValueFormatString: "##0.00\"%\"",
                indexLabel: "{label} {y}",
                dataPoints: datos
            }]
        });

        chart.render();
    } else {
        mostrarMensaje("chartContainer", "No hay datos suficientes para ejecutar esta consulta.");
    }
}

//OPERADORES

function agregarOperador() {
    let nombre = document.getElementById("txt-nombre-operador").value;
    let edad = document.getElementById("txt-edad-operador").value;
    let mail = document.getElementById("txt-email-operador").value;
    let forma = document.getElementById("form-operador");

    if (forma.reportValidity()) {
        let operador = new Operador(nombre, edad, mail);
        let mensaje = telecentro.agregarOperador(operador);

        listarOperadores();
        cargarSelector("select-operador-llamadas");
        cargarSelector("select-operador-consultas");

        mostrarMensaje("mensaje-operador", mensaje.mensaje, mensaje.codigo);
    } else {
        mostrarMensaje("mensaje-operador", "Revise los campos.", "error");
    }
}

function listarOperadores() {
    limpiarLista("lista-operadores");

    if (document.getElementById("radio-nombre").checked) {
        telecentro.ordenarOperadores("nombre");
    } else {
        telecentro.ordenarOperadores("edad");
    }

    popularListaOperadores(telecentro.operadores);
}

function popularListaOperadores(operadores) {
    let lista = document.getElementById("lista-operadores");

    for (let i = 0; i < operadores.length; i++) {
        let operador = operadores[i];
        let nodo = document.createElement("li");
        let dato = document.createTextNode(operador.nombre + " - " + operador.edad + " - " + operador.mail);
        
        nodo.appendChild(dato);
        lista.appendChild(nodo);
    }
}

//LLAMADAS
function agregarLlamada() {
    let idCall = telecentro.obtenerIdLlamada();
    let nameOperador = document.getElementById("select-operador-llamadas").value;
    let descripcionCall = document.getElementById("txt-descripcion").value;
    let motivoCall = parseInt(document.getElementById("txt-motivo").value);
    let duracion = parseInt(document.getElementById("txt-duracion").value);
    let celular = document.getElementById("txt-celular").value;
    let formaCall = document.getElementById("form-operador");
    
    if (formaCall.reportValidity() && nameOperador != "Seleccione operador") {
       if(motivoCall < 1 || motivoCall > 6) {
           mostrarMensaje("mensaje-llamada", "El motivo ingresado no es válido.", "error");
       } else {
           let llamada = new Llamada(idCall,nameOperador,descripcionCall,
           motivoCall,duracion,celular);
           let mensaje = telecentro.agregarLlamada(llamada);
    
           mostrarMensaje("mensaje-llamada", mensaje.mensaje, mensaje.codigo);
       }
    } else {
       mostrarMensaje("mensaje-llamada", "Revise los campos.", "error");
    }

    listarLlamadas();
}


function listarLlamadas(){
    limpiarLista("body-table-llamada");
    
    if (document.getElementById("radio-numero").checked) {
        telecentro.ordenarLlamadas("id");
    } else {
        telecentro.ordenarLlamadas("operador");
    }
 	
 	cuerpoTabla("body-table-llamada");   
}

//CONSULTAS
function consultarHistoria() {
    let indice = document.getElementById("select-operador-consultas").selectedIndex;
    let operador = telecentro.operadores[indice - 1].nombre;
    let datos = datosConsultaPorOperador(operador);

    manejarElementoPorNombre("resultado-consulta-por-operador", "block");

    if (datos.llamada) {
        document.getElementById("llamada-larga-operador").innerHTML = "Número: " + datos.llamada.id + ", Duración: " + datos.llamada.duracion + " minutos";
        document.getElementById("promedio-llamadas-operador").innerHTML = datos.promedio + " minutos";
    } else {
        document.getElementById("llamada-larga-operador").innerHTML = "No existen llamadas registradas.";
        document.getElementById("promedio-llamadas-operador").innerHTML = "Sin datos para promediar.";
    }

    limpiarLista("iconos-motivo-no-atendio");

    for (let i = 1; i <= 6; i++) {
        if (datos.motivosAtendidos) {
            if (datos.motivosAtendidos.indexOf(i) == -1) {
                let iconos = document.getElementById("iconos-motivo-no-atendio");
                let icono = document.createElement("img");
                icono.classList.add("icon");
                icono.alt = "Icono que representa el motivo " + i;
                icono.src = "img/" + i + ".svg";
                iconos.appendChild(icono);
            }
        } else {
            let iconos = document.getElementById("iconos-motivo-no-atendio");
            let icono = document.createElement("img");
            icono.classList.add("icon");
            icono.alt = "Icono que representa el motivo " + i;
            icono.src = "img/" + i + ".svg";
            iconos.appendChild(icono);
        }
    }
}

function datosConsultaPorOperador(operador) {
    let resultado = {};
    let motivosAtendidos = [];
    let maximo = 0;
    let contador = 0;
    let duracionTotal = 0;

    for (let i = 0; i < telecentro.llamadas.length; i++) {
        if (telecentro.llamadas[i].operador == operador) {
            if (motivosAtendidos.indexOf(telecentro.llamadas[i].motivo) == -1) {
                motivosAtendidos.push(telecentro.llamadas[i].motivo);
            }
            contador = contador + 1;
            duracionTotal = duracionTotal + telecentro.llamadas[i].duracion;

            if (telecentro.llamadas[i].duracion > maximo) {
                maximo = telecentro.llamadas[i].duracion;
                resultado.llamada = telecentro.llamadas[i];
            }
        }
    }

    if (contador > 0) {
        resultado.promedio = duracionTotal / contador;
        resultado.motivosAtendidos = motivosAtendidos;
    }

    return resultado;
}
function consultaPorPalabras() {
    let palabras = document.getElementById("txt-palabra-consulta").value;
    let filtros = palabras.toUpperCase().split(" ");
    let idLlamadas = [];
    let llamadas = [];
    
    limpiarLista("body-tabla-palabras");
    
    for(let i = 0; i < telecentro.llamadas.length; i++) {
	    let palabrasLlamada = telecentro.llamadas[i].descripcion.toUpperCase().split(" ");
	    
	    for(let j = 0; j < palabrasLlamada.length; j++) {
		    if(filtros.indexOf(palabrasLlamada[j]) != -1) {
			    if(idLlamadas.indexOf(telecentro.llamadas[i].id) == -1) {
			    	idLlamadas.push(telecentro.llamadas[i].id);
			    	llamadas.push(telecentro.llamadas[i]);
			    }
		    }
	    }
    }

    cuerpoTabla("body-tabla-palabras");
}

function consultarPorDuracion() {
	let duracion = document.getElementById("txt-duracion-consulta").value;
	let operadores = [];
	let lista = document.getElementById("lista-duracion");

	limpiarLista("lista-duracion");

	for (let i = 0; i < telecentro.llamadas.length; i++) {
		if(telecentro.llamadas[i].duracion == duracion) {
			if(operadores.indexOf(telecentro.llamadas[i].operador) == -1) {
				operadores.push(telecentro.llamadas[i].operador);
				let li = document.createElement("li");
				li.innerHTML = telecentro.llamadas[i].operador;
				lista.appendChild(li);
			}
		}
	}
}

//HELPERS

function mostrarMensaje(label, mensaje, codigo) {
    document.getElementById(label).innerHTML = mensaje;

    if (codigo && codigo == "exito") {
        document.getElementById(label).classList.replace("error", codigo);
    } else {
        document.getElementById(label).classList.replace("exito", codigo);
    }

    setTimeout(function() {
        document.getElementById(label).innerHTML = "";
    }, 4000);
}

function limpiarLista(id) {
    let lista = document.getElementById(id);
    let child = lista.lastElementChild;

    while (child) {
        lista.removeChild(child);
        child = lista.lastElementChild;
    }
}

function cargarSelector(id) {
    let select = document.getElementById(id);

    limpiarLista(id);

    let option = document.createElement("option");
    option.innerHTML = "Seleccione operador";
    select.appendChild(option);

    for (let i = 0; i < telecentro.operadores.length; i++) {
        let option = document.createElement("option");
        option.innerHTML = telecentro.operadores[i].nombre;
        select.appendChild(option);
    }
}

function manejarElementoPorNombre(name, display) {
    let elementos = document.getElementsByName(name);

    for (let i = 0; i < elementos.length; i++) {
        elementos[i].style.display = display;
    }
}

function cuerpoTabla(id){
    let cuerpoTabla = document.getElementById(id);
    
    for(let x = 0; x < telecentro.llamadas.length; x++) {
    let row = document.createElement("tr");
    
    let id = document.createElement("td");
    id.innerHTML = telecentro.llamadas[x].id;
    row.appendChild(id);
    
    let operador = document.createElement("td");
    operador.innerHTML = telecentro.llamadas[x].operador;
    row.appendChild(operador);
    
    let descripcion = document.createElement("td");
    descripcion.innerHTML = telecentro.llamadas[x].descripcion;
    row.appendChild(descripcion);
    
    let motivo = document.createElement("td");
    let icono = document.createElement("img");
    icono.classList.add("icon");
    icono.alt = "Icono que representa el motivo " + telecentro.llamadas[x].motivo;
    icono.src = "img/" + telecentro.llamadas[x].motivo + ".svg";
    motivo.appendChild(icono);
    row.appendChild(motivo);
    
    let duracion = document.createElement("td");
    duracion.innerHTML = telecentro.llamadas[x].duracion;
    row.appendChild(duracion);
    
    let celular = document.createElement("td");
    celular.innerHTML = telecentro.llamadas[x].celular;
    row.appendChild(celular);
    
    cuerpoTabla.appendChild(row);
    }
}

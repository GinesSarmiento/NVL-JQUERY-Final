
$(document).ready(function() {
	
	//Declaramos dos variables una para el turno actual y otra para el oponente
	var turno = "X";
	var oponente = "O";

	//Creamos un evento sobre las celdas que se ejecutará al hacer click sobre ella
	$("td").on({
		"click":function(){
			//Comprobamos si está seleccionada
			if ($(this).hasClass("seleccionado")){
				//Si está seleccionada la deseleccionamos
				$(this).removeClass("seleccionado");
			}else{
				//Si no está seleccionada, quitamos la selección de la celda seleccionada
				$("td").removeClass("seleccionado");
				//Seleccionamos la celda sobre la que se ha hecho click
				$(this).addClass("seleccionado");
			}
		},

		//Si se pulsa dos veces sobre una celda ejecuta la función que asigna la celda a un jugador
		"dblclick":function(){
			marcar(this);
		},

		//Si se pasa por encima de una celda la seleccióna
		"mouseover":function(){
				//Quitamos la selección de otras celdas
				$("td").removeClass("seleccionado");
				//Seleccionamos la celda sobre la que se ha hecho click
				$(this).addClass("seleccionado");
			}
		});
	
	//Creamos una función que se ejecutará al pulsar una tecla
	$(document).keydown(function(e){
		//Obtenemos la celda seleccionada
		var  viejo = $(".seleccionado");
		//Declaramos una variable que almacenará la celda de destino, le asignamos el valor de la celda inicial por si la tecla pulsada no es una flecha
		var nuevo = viejo;
		//Comprobamos si hay una celda seleccionada
		if (viejo.length!==0){
			//Borramos la selección de la celda
			$(viejo).removeClass("seleccionado");
			//Declaramos una variable que almacenará la clase columna de la celda seleccionada
			var columna = $(viejo).attr("class");
			
			//Ejecutamos diferentes códigos en función de la tecla pulsada
			switch (e.which){
			//Acción si se pulsa la flecha izquierda
			case 37:
			//Comprobamos si la celda seleccionada pertenece a la primera columna
			if ($(viejo).hasClass("c1")===false){
				//En caso negativo seleccionamos la celda siguiente
				nuevo= $(viejo).prev();
			}else{
				//En caso positivo, buscamos dentro del padre(la misma fila) la celda correspondiente a la última columna y seleccionamos dicha celda
				nuevo= $(viejo).parent().find(".c3")
			}
			break;

			//Acción si se pulsa la flecha arriba
			case 38:
			//Comprobamos si la celda seleccionada esá en la primera fila
			if ($(viejo).parent("tr").hasClass("f1")===false){
				//En caso negativo buscamos en el siguiente hermano del siguiente padre la celda correspondiente a la misma columna y la seleccionamos
				nuevo= $(viejo).parent().prev().find("."+columna);
			}else{
				//En caso positivo buscamos en el abuelo la última fila y dentro de esta la celda correspondiente a la misma columna y la seleccionamos
				nuevo= $(viejo).parent().parent().find(".f3").find("."+columna);
			}
			break;

			//Acción si se pulsa la flecha derecha
			case 39:
			//Comprobamos si la celda seleccionada pertenece a la última columna
			if ($(viejo).hasClass("c3")===false){
				//En caso negativo seleccionamos la celda anterior
				nuevo= $(viejo).next();
			}else{
				//En caso positivo, buscamos dentro del padre(la misma fila) la celda correspondiente a la primera columna y seleccionamos dicha celda
				nuevo= $(viejo).parent().find(".c1")
			}
			break;

			//Acción si se pulsa la flecha abajo
			case 40:
			//Comprobamos si la celda seleccionada esá en la última fila
			if ($(viejo).parent("tr").hasClass("f3")===false){
				//En caso negativo buscamos en el siguiente hermano del anterior padre la celda correspondiente a la misma columna y la seleccionamos
				nuevo= $(viejo).parent().next().find("."+columna);
			}else{
				//En caso positivo buscamos en el abuelo la primera fila y dentro de esta la celda correspondiente a la misma columna y la seleccionamos
				nuevo= $(viejo).parent().parent().find(".f1").find("."+columna);
			}
			break;

		}
		//Si se pulsa la tecla intro o espacio ejecuta una función que asigna la celda a un jugador
		if (e.which == 13 || e.which == 32){
			marcar(viejo);
		}
		//Por último añadimos la clase a la celda seleccionada
		$(nuevo).addClass("seleccionado");
	}
});

	//Declaramos una función para asignar la celda a un jugador
	function marcar(celda){

		//Comprobamos el valor de la celda
		switch ($(celda).attr("value")){
			//Si coincide con el jugador del turno actual
			case turno:
			//Pregunta si quiere quitar la celda seleccionada
			var quitar = confirm("¿Quieres quitar tu ficha de la casilla?");
			if (quitar == true){
				$(celda).attr("value","");
			}
			//Quite o no la celda cambiamos el turno, ya más adelante en el código lo volveremos a cambiar(una pequeña trama en el código)
			turno = oponente;
			break;
			//Si se pulsa sobre una celda del oponente
			case oponente:
			//Pregunta si se quiere cambiar la ficha del oponente por la del jugador actual
			var cambiar = confirm("¿Quieres cambiar la ficha de tu oponente por la tuya?");
			if (cambiar == true){
				$(celda).attr("value",turno);
			}else{
				//En caso negativo(si no quiere cambiarla) cambiamos el turno, ya más adelante en el código lo volveremos a cambiar y cómo no ha realizado
				// ninguna acción debería mantener el turno (otra pequeña trama en el código)
				turno= oponente;
			}	
			break;
			//Si la celda está vacía asignamos el valor del jugador actual
			default:
			$(celda).attr("value",turno);
			break;
		}

		//Cambiamos el turno del jugador por el del oponente
		if(turno == "X"){
			turno = "O";
			oponente = "X";
		}else{
			turno = "X";
			oponente = "O";
		}

		//Comprobamos si se ha hecho tres en raya
		//Declaramos una variable que almacenará el resultado
		var resultado = "";
		//Comprobamos con una fórmula las filas
		resultado += comprobar($(".f1").children("td"));
		resultado += comprobar($(".f2").children("td"));
		resultado += comprobar($(".f3").children("td"));

		//Comprobamos con una fórmula las columnas
		resultado += comprobar($(".c1"));
		resultado += comprobar($(".c2"));
		resultado += comprobar($(".c3"));

		//Declaramos una variable que almacenará las celdas de la diagonal ascendente
		var diagonal_asc = [];
		diagonal_asc.push($(".f3").find(".c1"));
		diagonal_asc.push($(".f2").find(".c2"));
		diagonal_asc.push($(".f1").find(".c3"));
		//Comprobamos con una fórmula la diagonal ascendente
		resultado +=comprobar(diagonal_asc);

		//Declaramos una variable que almacenará las celdas de la diagonal descendente
		var diagonal_des = [];
		diagonal_des.push($(".f1").find(".c1"));
		diagonal_des.push($(".f2").find(".c2"));
		diagonal_des.push($(".f3").find(".c3"));
		//Comprobamos con una fórmula la diagonal descendente
		resultado +=comprobar(diagonal_des);

		//Si el resultado de la comprobación es uno de los dos jugadores cambiamos el color del texto de enhorabuena
		if(resultado == "X"){
			$("#ganador").css("color","#00A08A");
		}else{
			$("#ganador").css("color","#BB008B");
		}

		//Si el resultado de la comprobación es uno de los jugadores
		if (resultado !== ""){
			//Obtenemos el nombre del jugador
			var ganador = $("#nombre" + resultado).val();

			//En caso de que no se haya introducido ningún nombre, se pone X o O como nombre del jugador
			if (ganador == ""){
				ganador = resultado;
			}
			//Escribimos en el texto de enhorabuena el nombre del ganador
			$("#nombre_ganador").text(ganador.toUpperCase());
				
			//Ocultamos el contenedor durante un tiempo
			$("#contenedor").hide().delay(3000).fadeIn(100);
			//Mostramos el mensaje de enhorabuena durante un tiempo
			$("#ganador").fadeIn().delay(2500).fadeOut(100);

			//Sumamos un punto en el marcador del ganador
			$("#puntos"+resultado).text(parseInt($("#puntos"+resultado).text())+1);
			//Reseteamos la tabla para volver a empezar
			$("td").attr("value","");
		}

		//Declaramos una variable que comprobará si hay empate
		var empate="";
		//Con un bucle recorremos todas las celdas y almacenamos su valor
		$("td").each( function( index, celda ) {
			empate +=$(celda).attr("value");
		});
		//Si todas las celdas tienen valor, bien de un jugador o de otro
		if (empate.length == 9){
			//Ocultamos el contenedor durante un tiempo
			$("#contenedor").hide().delay(3000).fadeIn(100);
			//Mostramos el mensaje de empate durante un tiempo
			$("#empate").fadeIn().delay(2500).fadeOut(100);
			$("td").attr("value","");
		}
	}

	//Función que comprobará las celdas que se le pasen como una matriz para ver si hay tres en raya
	function comprobar(celdas){

		//Declaramos una variable que almacenará los valores de las celdas
		var elementos = [];
		//Recorremos la matriz
		$(celdas).each( function( index, celda ) {
			//Almacenamos los valores en la matriz auxiliar
			elementos.push($(celda).attr("value"));
		});
		//Comprueba si las tres celdas tienen el mismo valor, es decir, están marcadas por el mismo jugador
		if (elementos[0] == elementos[1] && elementos[1] == elementos[2]){
			//En caso afirmativo, comprobamos a que jugador pertenece y devolvemos su símbolo como resultado de la función
			switch (elementos[0]){
				case "X":
				return "X";
				break;
				case "O":
				return "O";
				break;
				default:
				return "";
			}
		}else{
			return "";
		}
	}

	//Asignamos una función al pulsar el botón que resetea los puntos
	$("#b-puntos").on({
		"click":function(){
			$("#puntosX").text("0");
			$("#puntosO").text("0");
		}
	});

	//Asignamos una función al pulsar el botón que resetea la tabla
	$("#b-tablero").on({
		"click":function(){
			$("td").attr("value","");
		}
	});
});
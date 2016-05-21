$(document).ready(function() {

  var json = {};
  var usuarios_asignados = {};
  var collections = {};
  var tupla = {};
  var current_collection = [];
  var collectionfind = false;
  var hotelfind = false;
  var iniciado = false;
  var tokenshow = false;
  var coleccion_seleccionada = false;
  var existe_hotel = false;
  var click_map = false;
  var nombre_current_col= "";
  var nombre_current_hotel = "";
  var apiKey = 'AIzaSyC5hQk4LZTwNNfMJoYXYiUIZL94sWipgXk';

  var reposTags = [
      "X-Nav-Practica-Hoteles",
      "DAT_JSON",
    ];

  var urlTags = [
      "https://alexeal90.github.io/X-Nav-Practica-Hoteles/",
      "https://alexeal90.github.io/DAT_JSON/",
    ];

  var idTags = [
      //"+GregorioRobles",
      "116088532860862074518",
      "+NACHOMANRIQUE",
    ];


$("#tags").val("");
$("#id_usuariosGOOGLE").val("");

$("#repositorio").autocomplete({
  source: reposTags
});

$("#url").autocomplete({
  source: urlTags
});

$("#id_usuariosGOOGLE").autocomplete({
  source: idTags
});

function show_accomodation(){
  $("#hotel-info").show();
  if (click_map == false){
    var accomodation = accomodations[$(this).attr('no')];
    tupla[accomodation.basicData.name] = $(this).attr('no');
  }else{
    var textoparse = $("#map").text().split("mas info");
    textoparse = textoparse[0].substr(1);
    var numero = tupla[textoparse];
    var accomodation = accomodations[numero];
  }
  var lat = accomodation.geoData.latitude;
  var lon = accomodation.geoData.longitude;
  var adr = accomodation.geoData.address;
  var url = accomodation.basicData.web;
  var name = accomodation.basicData.name;
  nombre_current_hotel = name;
  var desc = accomodation.basicData.body;
  var img = [];
  for (var i=0; i < accomodation.multimedia.media.length; i++ ){
    img.push(accomodation.multimedia.media[i].url);
  }
  var cat = accomodation.extradata.categorias.categoria.item[1]['#text'];
  var subcat = accomodation.extradata.categorias.categoria
   .subcategorias.subcategoria.item[1]['#text'];
  L.marker([lat, lon]).addTo(map)
   .bindPopup('<a id="'+ name +'" href="' + url + '">' + name + '</a><br/>' + "<button class='hotel_map'>mas info</button>")
   .openPopup();
  map.setView([lat, lon], 15);
  $('#current-hotel').html('<h2>' + name + '</h2>'
   + '<p>Tipo: ' + cat + ', Valoración: ' + subcat + '</p>'
   + '<p>Direccion: ' + adr + '</p>' + desc);

  $(".carousel-indicators").empty();
  $(".carousel-inner").empty();
  if(img.length != 0){
    $(".carousel-indicators").show();
    $(".carousel-inner").show();
    $("#leftbutton").show();
    $("#rightbutton").show();
    for (var i=0; i < img.length; i++ ){
      if(i==0){
        $(".carousel-indicators").append("<li data-target='#myCarousel' data-slide-to='" + i + "' class='active'></li>");
        $(".carousel-inner").append("<div class='item active'><img src='"+ img[i] +"'></div>");
      }else{
        $(".carousel-indicators").append("<li data-target='#myCarousel' data-slide-to='" + i + "'></li>");
        $(".carousel-inner").append("<div class='item'><img src='"+ img[i] +"'></div>");
      }
    }
  }else{
    $(".carousel-indicators").hide();
    $(".carousel-inner").hide();
    $("#leftbutton").hide();
    $("#rightbutton").hide();
  }

  $('#alojados').html('<h2>' + name + '</h2>'
   + '<p>Tipo: ' + cat + ', Valoración: ' + subcat + '</p>'
   + '<p>Direccion: ' + adr + '</p>' + desc);

  if(usuarios_asignados[nombre_current_hotel] != undefined){
    $('#lista_usuariosGOOGLE').empty();
    gapi.client.setApiKey(apiKey);
    gapi.client.load('plus', 'v1', function() {
      for(i=0; i < usuarios_asignados[nombre_current_hotel].length; i++){
        var request = gapi.client.plus.people.get({
          'userId': usuarios_asignados[nombre_current_hotel][i],//mi Id de Google+ = 116088532860862074518
          // For instance:
          // 'userId': '+GregorioRobles'
        });
        request.execute(function(resp) {
          $('#lista_usuariosGOOGLE').append("<li class='col-md-12'><img src='" + resp.image.url + "'></img>  " + resp.displayName + "</li>");
        });
      };
    });
  }else{
    $('#lista_usuariosGOOGLE').empty();
  }

};

function get_accomodations(){
  iniciado = true;
  $.getJSON("alojamientos.json", function(data) {
    $('#getbutton').empty();
    $("#listas").show();
    accomodations = data.serviceList.service
    var list = '<ul>';
    for (var i = 0; i < accomodations.length; i++) {
      list = list + '<li no=' + i + '>' + accomodations[i].basicData.title + '</li>';
    }
    list = list + '</ul>';

    $('#hotel-list').html(list);
    $('#hotel-list2').html(list);
    $("#hotel-list2 *").draggable({stack: "#current-collection2", revert: true });

    $('li').click(show_accomodation);
  });
};


/*CAMBIO DE PESTAÑA*/

  $(".button-menu").click(function(){
    if (iniciado){
      if ($(this).attr('id') == "button-principal"){
        $("#pantalla-principal").show();
    		$("#pantalla-colecciones").hide();
    		$("#pantalla-alojados").hide();
      } else if ($(this).attr('id') == "button-colecciones"){
        $("#pantalla-principal").hide();
    		$("#pantalla-colecciones").show();
    		$("#pantalla-alojados").hide();
      } else if ($(this).attr('id') == "button-alojados"){
        $("#pantalla-principal").hide();
    		$("#pantalla-colecciones").hide();
    		$("#pantalla-alojados").show();
      }

      /*MOSTRAR FORMULARIOS PARA GUARDAR O CARGAR JSON*/
      if ($(this).attr('id') == "button-guardar"){
        if (!tokenshow) {
          $("#formulario-git").show();
          $("#rest-form-guardar").show();
          $("#rest-form-cargar").hide();
          tokenshow = true;
        }else{
          $("#formulario-git").hide();
          $("#rest-form-guardar").hide();
          $("#rest-form-cargar").hide();
          tokenshow = false;
        }
      }else if ($(this).attr('id') == "button-cargar"){
        if (!tokenshow) {
          $("#formulario-git").show();
          $("#rest-form-guardar").hide();
          $("#rest-form-cargar").show();
          tokenshow = true;
        }else{
          $("#formulario-git").hide();
          $("#rest-form-guardar").hide();
          $("#rest-form-cargar").hide();
          tokenshow = false;
        }
      }
    }
  });

  $("#guardar").click(function(){
    var token = $("#token").val();
    var repositorio = $("#repositorio").val();
    if (reposTags.indexOf(repositorio) == -1){
      reposTags.push(repositorio);
    }
    var fichero = $("#fichero").val()
    var user = "alexeal90";
    var github =  new Github({token:token,auth: "oauth"});
    json = {colecciones: collections, usuarios: usuarios_asignados};

    var texto = JSON.stringify(json);
    var repositorio_git = github.getRepo(user, repositorio);

    repositorio_git.write('master', fichero, texto, 'fichero de prueba', function(err) {});
  })

  function cargar(url){
    $.getJSON(url)
    .done(function(data) {
      var contenido = atob(data.content);
      contenido = decodeURIComponent(escape(contenido));
      var contenido_parsed = JSON.parse(contenido);
      collections = contenido_parsed.colecciones;
      usuarios_asignados = contenido_parsed.usuarios;

      //ACTUALIZA LA LISTA DE COLECCIONES//
      nombre_current_col= "";
      $(".collections").empty();
      $(".nombrecoleccion").empty();
      $(".current-collection-list").empty();
      $.each(collections, function(key, value){
        $(".collections").append("<li class='collect' id= '" + key + "'>" + key + "</li>");
      });

      actualizar_hoteles();

      //ACTUALIZA LA LISTA DE USUARIOS//
      nombre_current_hotel= "";
      $('#alojados').empty();
      $('#lista_usuariosGOOGLE').empty();
      $("#id_usuariosGOOGLE").val("");
    })
    .fail(function() {
      alert("No existe dicho recurso");
    });
  }

  $("#cargar").click(function(){
    var token = $("#token").val();
    var github =  new Github({token:token,auth: "oauth"});
    var url_parsed = $("#url").val().split("/");
    var user = "alexeal90";
    var repositorio_git = github.getRepo(user, url_parsed[3]);
    var url = "https://api.github.com/repos/" + user + "/" + url_parsed[3] + "/contents/" + url_parsed[4]
    cargar(url);
  });

  function encontrado(hotel){
		hotelfind = false;
		for(i=0;i< current_collection.length;i++) {
			if(hotel == current_collection[i]){
				hotelfind = true;
			}
		}
	}

	function comprobar_coleccion(hotel){
		encontrado(hotel)
		if(!hotelfind){
			current_collection.push(hotel);
		}
	}

	function pintar_coleccion(col){
		$(".current-collection-list").empty();
		for(i=0;i< col.length;i++) {
			$(".current-collection-list").append("<li>" + col[i] + "</li>");
		}
	}

/*CREAR COLECCION*/

$("#crear").click(function(){
  var nombre = $("#tags").val();
  collectionfind = false;
  if (nombre.length == 0){
    alert("Ese nombre no es válido, escoja otro.")
  }else{
    if( nombre in collections ) {
      collectionfind = true;
    }
    if(!collectionfind){
      collections[nombre] = [];
    }else{
      alert("Ese nombre de colección ya existe, escoja otro.")
    }
    $(".collections").empty();
    $.each(collections, function(key, value){
      $(".collections").append("<li class='collect' id= '" + key + "'>" + key + "</li>");
    });

    $("#tags").val("");
  }

  actualizar_hoteles();

});

function actualizar_hoteles(){
  $(".collect").click(function(){
    if (nombre_current_col.length != 0){
      collections[nombre_current_col] = current_collection;
    }

    nombre_current_col = this.id;
    coleccion_seleccionada = true;
    current_collection = collections[nombre_current_col];
    pintar_coleccion(collections[nombre_current_col]);
    $(".nombrecoleccion").empty();
    $(".nombrecoleccion").append(nombre_current_col);
  });
}

/*AÑADIR USUARIO GOOGLE*/

  function makeApiCall(id_user){
    gapi.client.setApiKey(apiKey);
    gapi.client.load('plus', 'v1', function() {
      var request = gapi.client.plus.people.get({
        'userId': id_user,//mi Id de Google+ = 116088532860862074518
        // For instance:
        // 'userId': '+GregorioRobles'
      });

      request.execute(function(resp) {
        if (resp.displayName == undefined){
          alert("Usuario no encontrado");
        }else if(usuarios_asignados[nombre_current_hotel].indexOf(id_user) == -1){
          usuarios_asignados[nombre_current_hotel].push(id_user);
          $('#lista_usuariosGOOGLE').prepend("<li class='col-md-12'><img src='" + resp.image.url + "'></img>  " + resp.displayName + "</li>");
        }else{
          alert("Este usuario ya esta añadido")
        }
      });
    });

  };

  $("#boton_usuariosGOOGLE").click(function(){
    if(nombre_current_hotel.length == 0){
      alert("No hay ningún hotel seleccionado. Seleccione primero un hotel.");
    }else{
      var id_user = $("#id_usuariosGOOGLE").val();
      if (idTags.indexOf(id_user) == -1){
        idTags.push(id_user);
      }
      if(usuarios_asignados[nombre_current_hotel] == undefined){
        usuarios_asignados[nombre_current_hotel] = [];
      }
      makeApiCall(id_user);
    }
  });


/*ACTUALIZAR COLECCION ACTUAL*/

	$("#current-collection2").droppable({
    over: function( event, ui ) {
        $( this )
        .addClass( "ui-state-highlight" )

    },
    out: function( event, ui ) {
        $( this )
        .removeClass( "ui-state-highlight" )

    },
		drop: function( event, ui ) {
  			$(this)
  			.removeClass( "ui-state-highlight" )

      if (coleccion_seleccionada){
        comprobar_coleccion($(ui.draggable).text());
        pintar_coleccion(current_collection);
      }else{
        alert("No hay colección seleccionada. Elija una.")
      }

		},
  });

  map = L.map('map').setView([40.4175, -3.708], 11);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  $("#get").click(get_accomodations);

  $("#map").on("click", ".hotel_map", function(){
    click_map = true;
    show_accomodation();
    click_map = false;
  });
});

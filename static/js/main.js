document.addEventListener("DOMContentLoaded", function() {
    var canvas = document.getElementById("experimentCanvas");
    var ctx = canvas.getContext("2d");
    var plumaImg = new Image(); // Variable global para la imagen de la pluma
    var martilloImg = new Image(); // Variable global para la imagen del martillo
    
    // Ajustes de la simulación
    var g = 9.81; // Aceleración debido a la gravedad (m/s^2)
    var densidadAire = 1.2; // Densidad del aire (kg/m^3)
    var coeficienteArrastrePluma = 0.47; // Coeficiente de arrastre para la pluma
    var coeficienteArrastreMartillo = 0.42; // Coeficiente de arrastre para el martillo
    var masaPluma = 0.001; // Masa de la pluma (kg)
    var masaMartillo = 0.1; // Masa del martillo (kg)
    var areaFrontalPluma = 0.005; // Área frontal de la pluma (m^2)
    var areaFrontalMartillo = 0.01; // Área frontal del martillo (m^2)
    
    // Función para cargar las imágenes de la pluma y el martillo
    function cargarImagenes() {
        // Cargar las imágenes de la pluma y el martillo
        var promesaPluma = cargarImagen("static/img/pluma.png");
        var promesaMartillo = cargarImagen("static/img/martillo.png");
        
        // Devolver una promesa que se resuelve cuando ambas imágenes se han cargado
        return Promise.all([promesaPluma, promesaMartillo]);
    }
    
    // Función para cargar una imagen
    function cargarImagen(src) {
        return new Promise(function(resolve, reject) {
            var img = new Image();
            img.onload = function() {
                // Ajustar el tamaño de la imagen después de cargarla
                img.width *= 0.2; // Reducir el ancho de la imagen al 20%
                img.height *= 0.2; // Reducir la altura de la imagen al 20%
                resolve(img);
            };
            img.src = src;
        });
    }
    
    // Función para calcular la velocidad de caída con resistencia del aire
    function calcularVelocidadConAire(masa, coeficienteArrastre, areaFrontal, tiempo) {
        var fuerzaGravedad = masa * g; // Fuerza de gravedad
        var velocidadTerminal = Math.sqrt((2 * fuerzaGravedad) / (densidadAire * coeficienteArrastre * areaFrontal)); // Velocidad terminal
        return velocidadTerminal * (1 - Math.exp((-coeficienteArrastre * densidadAire * areaFrontal * tiempo) / masa)); // Velocidad de caída con resistencia del aire
    }
    
    // Posición inicial de la pluma y el martillo
    var plumaY = 0;
    var martilloY = 0;
    var tiempo = 0; // Tiempo transcurrido
    
    // Función para dibujar la simulación
    function drawSimulation(conAire) {
        // Limpiar el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calcular la velocidad de caída de la pluma y el martillo
        var velocidadPluma = conAire ? calcularVelocidadConAire(masaPluma, coeficienteArrastrePluma, areaFrontalPluma, tiempo) : Math.sqrt(2 * g * plumaY);
        var velocidadMartillo = conAire ? calcularVelocidadConAire(masaMartillo, coeficienteArrastreMartillo, areaFrontalMartillo, tiempo) : Math.sqrt(2 * g * martilloY);
        
        // Dibujar la pluma y el martillo
        ctx.drawImage(plumaImg, 100, plumaY, plumaImg.width, plumaImg.height);
        ctx.drawImage(martilloImg, 200, martilloY, martilloImg.width, martilloImg.height);
        
        // Actualizar las posiciones de la pluma y el martillo
        plumaY += velocidadPluma * 0.05; // Incrementar la posición Y de la pluma
        martilloY += velocidadMartillo * 0.05; // Incrementar la posición Y del martillo
        
        // Incrementar el tiempo transcurrido
        tiempo += 0.05;
        
        // Solicitar la próxima animación
        requestAnimationFrame(drawSimulation.bind(null, conAire));
    }
    
    // Evento de clic en el botón "Comenzar Experimento"
    document.getElementById("startExperiment").addEventListener("click", function() {
        // Reiniciar las posiciones de la pluma y el martillo
        plumaY = 0;
        martilloY = 0;
        tiempo = 0;
        
        // Determinar si se debe simular con aire o sin aire
        var conAire = document.getElementById("conAire").checked;
        
        // Cargar las imágenes y luego iniciar la simulación
        cargarImagenes().then(function(imagenes) {
            plumaImg = imagenes[0];
            martilloImg = imagenes[1];
            // Iniciar la simulación
            drawSimulation(conAire);
        });
    });

        // Función para abrir la ventana emergente con la descripción del proyecto
        document.getElementById('openDescription').addEventListener('click', function() {
            // Abre una nueva ventana con la descripción del proyecto
            window.open('about.html', '_blank', 'width=600,height=600');
        });
});

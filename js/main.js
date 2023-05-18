// Variables:
let costo = 0;
const jsonArrayProductos = "../json/arrayProductos.json";

// Arrays:
let carrito = [];
let productos = [];

// Elementos:

const listaCarrito = document.getElementById("listaCarrito");
const totalCarrito = document.getElementById("totalCarrito");
const formDatos = document.getElementById("formDatos");
const botonDatos = document.getElementById("enviarDatos");
const nombreUsuario = document.getElementById("nombre");
const emailUsuario = document.getElementById("correo");
const contenedorProductos = document.getElementById("contenedorProductos");
const botonVaciar = document.getElementById("botonVaciar");
const botonComprar = document.getElementById("botonComprar");

// Funciones:
function agregarAlCarrito(producto, cantidad) {
    let productoAgregado = { prod: producto, cant: cantidad };
    carrito.push(productoAgregado);
}

function buscarPrecio(nombre) {
    const encontrado = productos.find((el) => {
        return el.nombre == nombre;
    });

    return encontrado.precio;
}

function vaciarCarrito() {

    costo = 0;
    carrito = [];
    listaCarrito.innerHTML = "<li> El carrito de compra está vacío </li>";
    totalCarrito.innerText = "$0";
}


// Programa carrito:
async function obtenerDatosProductos() {

    const resp = await fetch(jsonArrayProductos);
    const datos = await resp.json();
    datos.forEach(prod => {
        productos.push(prod);
    })


    productos.forEach(producto => {

        let card = document.createElement('div');
        card.className = "cardProducto";
        card.innerHTML = `<img src="img/${producto.nombre}.png" alt="${producto.nombre}">
        <h2> ${producto.nombre} </h2>
        <p> $${producto.precio} </p>
        <select id="listaCantidad${producto.nombre}">
            <option value=1> 1 </option>
            <option value=2> 2 </option>
            <option value=3> 3 </option>
            <option value=4> 4 </option>
            <option value=5> 5 </option>
            <option value=6> 6 </option>
            <option value=7> 7 </option>
            <option value=8> 8 </option>
            <option value=9> 9 </option>
            <option value=10> 10 </option>
        </select>
        <button id="botonAgregar${producto.nombre}"> Agregar al carrito </button>`;
        contenedorProductos.appendChild(card);
    })

    productos.forEach(producto => {
        let boton = document.getElementById(`botonAgregar${producto.nombre}`);
        let listCantidad = document.getElementById(`listaCantidad${producto.nombre}`);

        boton.onclick = () => {

            let cantidad = listCantidad.options[listCantidad.selectedIndex].value;

            Toastify({
                text: "Producto agregado al carrito",
                duration: 3000,
                close: true,
            }).showToast();

            agregarAlCarrito(producto.nombre, cantidad);

            listaCarrito.innerHTML = "";

            carrito.forEach(producto => {
                let li = document.createElement('li');
                li.innerText = `${producto.prod} x ${producto.cant}`;
                listaCarrito.appendChild(li);
            });

            costo = costo + (cantidad * parseInt(buscarPrecio(producto.nombre)));
            totalCarrito.innerText = `$${costo}`;
        }
    });
}

obtenerDatosProductos();
vaciarCarrito();


botonVaciar.onclick = () => {

    vaciarCarrito();

    Toastify({
        text: "Carrito de compras vaciado",
        duration: 3000,
        close: true,
        style: {
            background: "linear-gradient(90deg, rgba(255,143,143,1) 0%, rgba(221,51,51,1) 100%)",
        }
    }).showToast();
}

botonComprar.onclick = () => {

    if (carrito.length != 0) {

        Swal.fire({
            title: 'Confirmar compra',
            text: ` Total: $${costo}`,
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Finalizar Compra',
            cancelButtonText: 'Seguir comprando'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Compra realizada',
                    '¡Muchas gracias por tu compra!',
                    'success'
                );

                vaciarCarrito();
            }
        });

    } else {

        Swal.fire({
            icon: 'warning',
            text: 'Tu carrito de compra está vacío'
        });
    }
}

botonDatos.onclick = () => {

    if (nombreUsuario.value == "" || emailUsuario.value == "") {
        Swal.fire({
            icon: 'error',
            text: 'Por favor completa los datos'
        });

    } else {
        let usuario = { nombre: nombreUsuario.value, email: emailUsuario.value };
        localStorage.setItem("usuario", JSON.stringify(usuario));
        Swal.fire({
            icon: 'success',
            text: 'Datos ingresados correctamente'
        });

        formDatos.innerHTML = "<h3> Ya ingresaste tus datos en el formulario </h3>"
    }
}

if (localStorage.getItem("usuario") != null) {
    formDatos.innerHTML = "<h3> Ya ingresaste tus datos en el formulario </h3>"
}
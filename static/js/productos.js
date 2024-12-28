//variables--------------------------------------------------
const carrito=document.querySelector('#shopping-basket')
const contenedorCarrito=document.querySelector('#lista-carrito tbody')
const vaciarCarritoBtn=document.querySelector('#clear-basket')
const listaProductos=document.querySelector('#cards-products')

const comprarCarrito=document.querySelector('#buy-basket')
const contenedorAbrirModal=document.querySelector('#modal')
const contenedorCerrarModal=document.querySelector('#close-modal')
const contenedorConfirmarCompra=document.querySelector('#buy-accepted')

//agrego el carrito de compras--------------------------------
let productoCarrito=[]
cargarEventos()


//funciones--------------------------------------------------
//1ra funcion----
function cargarEventos(){
    //agrega productos al carrito----------------------------
    listaProductos.addEventListener('click',agregarProducto)
    //elimina productos del carrito-------------------------
    carrito.addEventListener('click',eliminarProducto)
    //vaciar el carrito  completo vaciarCArritoBtn------------------
    vaciarCarritoBtn.addEventListener('click',()=>{
        //console.log('vaciando carrrito')
        productoCarrito=[]//resetea el carrito
        limpiarHTML()//elimina el html del carrito
    })
    //muestra los cursos que estan en el local storage--------------
    document.addEventListener('DOMContentLoaded',()=>{
        productoCarrito=JSON.parse(localStorage.getItem('carrito'))||[]
        carritoHTML()
    })
    //hace el calculo del total
    comprarCarrito.addEventListener('click',()=>{
        aletraCarritoVacio()
        if (aletraCarritoVacio()===true){
            totalCarritoHTML()
        }
    })
    //cierro la ventana modal de la finalizacion de la compra
    contenedorCerrarModal.addEventListener('click',()=>{
        contenedorAbrirModal.close()
    })
    //finalizo la compra
    contenedorConfirmarCompra.addEventListener('click',()=>{
        alert("Felicidades Compra Realizada con Exito!!")
        contenedorAbrirModal.close()
        limpiarHTML()//limpia el carrito
        productoCarrito=[]//borra lo que haya en el memoria
    })
}
//2dafuncion-----
function agregarProducto(e){
    e.preventDefault()
    //console.log(e.target.classList)
    if(e.target.classList.contains('fa-solid')){
        let productoSeleccionado=e.target.parentElement.parentElement.parentElement.parentElement
        leerDatosProducto(productoSeleccionado)
    }
}
//3ra funcion----------
function leerDatosProducto(producto){
    //console.log(producto)
    //creo un objeto para extraer los valores de productos------
    const infoProducto={
        imagen:producto.querySelector('img').src,
        nombre:producto.querySelector('h3').textContent,
        precio:producto.querySelector('p.product-price').textContent,
        cantidad:1,
        id:producto.querySelector('i.fa-solid.fa-basket-shopping').getAttribute('id-basket')
        
    }
    //console.log(infoProducto)
    //revisa si un elemento exsiste
    const exsiste=productoCarrito.some(producto=>producto.id===infoProducto.id)
    if (exsiste){
        const producto=productoCarrito.map(producto=>{
            if(producto.id===infoProducto.id){
                producto.cantidad++
                return producto//retorna el objeto actualizado
            }else{
                return producto//retorna los no duplicados
            }
        })
    }
    else{
        productoCarrito=[...productoCarrito,infoProducto]
    }
    //console.log(productoCarrito)
    carritoHTML()
}

//4ta funcion--------
function carritoHTML(){
    limpiarHTML() 
    //crea el html pero los repite
    productoCarrito.forEach((producto)=>{
        //mejoro el codigo poniendo un destructuring
        const {imagen,nombre,precio,cantidad,id}=producto

        const row=document.createElement('tr')
        row.innerHTML=`
        <td class="data"><img src='${imagen}' width=100></td>
        <td class="data">${nombre}</td>
        <td class="data">$${precio}</td>
        <td class="data">${cantidad}</td>
        <td class="data"><a href="#" class="borrar-producto" data-id="${id}">X</a></td>
        `
        contenedorCarrito.appendChild(row)
    })
     //agregar un local storage-----------------------------------------
    sincronizarLocalStorage()
}

function limpiarHTML(){
    contenedorCarrito.innerHTML=''}


function eliminarProducto(e){
    //console.log(e.target.classList.value)
    if (e.target.classList.value==='borrar-producto'){
        // console.log(e.target.getAttribute('data-id'))
        const productoid=e.target.getAttribute('data-id')
        //elimina del arreglo articuloCarrito por el data-id
        productoCarrito=productoCarrito.filter(producto=>producto.id!==productoid)
        // console.log(productoCarrito)
        carritoHTML()//itera sobre el carrito y muestra el html
    }
}

function sincronizarLocalStorage(){
    localStorage.setItem('carrito',JSON.stringify(productoCarrito))
}

function aletraCarritoVacio(){

    if(productoCarrito != false){
        return true
    }else{
        alert('No tienes Productos en tu carrito!!')
    }
}

function totalCarritoHTML(){
    // console.log("el total de la compra es ....")
    let total=0
    productoCarrito.forEach((producto)=>{
        const {imagen,nombre,precio,cantidad,id}=producto
        total=(precio)*(cantidad)+total
    })
    const iva=1.21
    let total_iva=iva*total
    document.querySelector(`#total_iva`).textContent=total_iva
    contenedorAbrirModal.showModal()
}

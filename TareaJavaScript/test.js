function request (url){
    return new Promise( (resolve,reject) => {
        let req = new XMLHttpRequest()
        req.open('GET', url)
        req.onload = function() {
            if (req.status == 200){
                resolve(req.response)
            }
            else{
                reject(req.statusText)
            }
        }
        req.send()
    })
}

let promise1 = request('https://gist.githubusercontent.com/josejbocanegra/be0461060d1c2d899740b8247089ba22/raw/916d2141e32e04031bda79c8886e8e4df0ae7f24/productos.json')
let promise2 = request('https://gist.githubusercontent.com/josejbocanegra/7b6febf87e9d986048a648487b35e693/raw/576531a2d0e601838fc3de997e021816a4b730f8/detallePedido.json')


promise2.then( (response) => {
    let pedidos = eval(response)
    promise1.then( (response2) => {
        productos = eval(response2)
        let maxVeces = 0
        let maxProducto = productos[0]
        for (var i=0; i<productos.length; i++){
            let cont = 0
            for (var j=0; j<pedidos.length; j++){
                if(pedidos[j].idproducto == productos[i].idproducto){
                    cont++
                }
            }
            if (cont > maxVeces){
                maxVeces = cont
                maxProducto = productos[i]
            }
        }

        console.log("El producto más pedido es: " + maxProducto.nombreProducto + " que ha sido pedido un total de " + maxVeces + " veces")
    } )
} )

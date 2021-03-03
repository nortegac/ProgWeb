const http = require('http')
const fs = require('fs')
const axios = require('axios')
const { error } = require('console')

function writeTable(url, isClient){
    return new Promise( async (resolve,reject) => {
        let json = await axios.get(url)
        json = json.data
        fs.readFile('dummy.html', 'utf-8', (err,data) => {
            const inicio_titulo = data.substring(0, data.indexOf('<table'))
            const tabla_tbody = data.substring(data.indexOf('<table'),data.indexOf('</tbody>'))
            const tbody_fin = data.substring(data.indexOf('</tbody>'))
    
            const t = (isClient ? 'Listado de clientes' : 'Listado de proveedores')
            const title = '<h1 class="text-center">' + t + '</h1>'
            
            let filas = ''
            for (let i=0; i<json.length; i++){
                var id = isClient ? json[i].idCliente : json[i].idproveedor
                var compania = isClient ? json[i].NombreCompania : json[i].nombrecompania
                var contacto = isClient ? json[i].NombreContacto : json[i].nombrecontacto
                filas += '<tr><td>' + id + '</td><td>' + compania + '</td><td>' + contacto + '</td></tr>'
            }
    
            const fullHtml = inicio_titulo + title + tabla_tbody + filas + tbody_fin
            resolve(fullHtml)
        })
    })
}

http.createServer(async function (req,res){
    const url = req.url

    let isClient = undefined
    if (url == '/api/proveedores') isClient = false
    else if (url == '/api/clientes') isClient =  true
    else {
        res.writeHead(404, {'Content-Type': 'text/html'})
        res.end('URL no encontrada')
        throw error
    }
    let prom
    if (isClient) prom = writeTable('https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json', isClient)
    else  prom = writeTable('https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json',isClient)
    
    console.log('Rendering ' + url + ' ...')

    prom.then( (response) => {
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(response)
        res.end()
    })
}).listen(8080)

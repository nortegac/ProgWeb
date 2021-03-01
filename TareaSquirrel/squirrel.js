const fetchData = fetch('https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json')
fetchData.then((resp) => resp.json()).then((json) => {
    createTable(json)
    createTable2(json)
})

function createTable(json){
    let table = document.getElementById('cuerpoTabla1')

    for (let i=0; i<json.length; i++){
        let tr = document.createElement('tr')
        let linea = json[i]

        let number = document.createElement('td')
        number.innerText = i+1

        let events = document.createElement('td')
        let evs = linea.events
        let text = ''
        for (let j=0; j<evs.length; j++){
            if (j == evs.length-1) text += evs[j]
            else text += evs[j] + ', '
        }
        events.innerText = text

        let squirrel = document.createElement('td')
        squirrel.innerText = linea.squirrel


        tr.appendChild(number)
        tr.appendChild(events)
        tr.appendChild(squirrel)

        if (linea.squirrel == true){
            tr.setAttribute("class", "table-danger")
        }
        
        table.appendChild(tr)
    }
}


function createTable2(json){   
    let distinctEvents = new Array()
    for (let i=0; i<json.length; i++){
        let evs = json[i].events
        for (let j=0; j<evs.length; j++){
            if (!distinctEvents.includes(evs[j])){
                distinctEvents.push(evs[j])
            }
        }
    }

    for (let i=0; i<distinctEvents.length; i++){
        let truePos = 0
        let trueNeg = 0
        let falsePos = 0
        let falseNeg = 0

        for (let j=0; j<json.length; j++){
            let linea = json[j]
            if (linea.events.includes(distinctEvents[i])){
                if (linea.squirrel == true) truePos++
                else falseNeg++
            }
            else{
                if (linea.squirrel == true) falsePos++
                else trueNeg++
            }    
        }
        let mcc = ((truePos*trueNeg)-(falsePos*falseNeg))/(((truePos+falsePos)*(truePos+falseNeg)*(trueNeg+falsePos)*(trueNeg+falseNeg))**(1/2)) 
        //console.log(distinctEvents[i]+' - '+mcc)
        distinctEvents[i] = {"event": distinctEvents[i], "mcc": mcc}
    }
    distinctEvents.sort(compare)

    let table = document.getElementById('cuerpoTabla2')
    for (let i=0; i<distinctEvents.length; i++){
        let tr = document.createElement('tr')

        let number = document.createElement('td')
        number.innerText = i+1

        let event = document.createElement('td')
        event.innerText = distinctEvents[i].event

        let corr = document.createElement('td')
        corr.innerText = distinctEvents[i].mcc

        tr.appendChild(number)
        tr.appendChild(event)
        tr.appendChild(corr)

        table.appendChild(tr)
    }

}

function compare(a,b){
    let corrA = a.mcc
    let corrB = b.mcc
    let comp = 0

    if (corrA > corrB) comp = 1
    else if (corrA < corrB) comp = -1

    return comp * -1
}
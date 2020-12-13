const api_url = 'https://api.carbonintensity.org.uk/generation';

async function getGenMix() {
    const response = await fetch(api_url);
    const data = await response.json();
    console.log(data)
    let dateFrom = data.data.from
    let parsedDateFrom = new Date(dateFrom)
    let DateStringFrom = parsedDateFrom.toDateString()
    let TimeStringFrom = parsedDateFrom.toLocaleTimeString('en-UK')


    let dateTo = data.data.to
    let parsedDateTo = new Date(dateTo)
    let DateStringTo = parsedDateTo.toDateString()
    let TimeStringTo = parsedDateTo.toLocaleTimeString('en-UK')


    console.log(parsedDateFrom.toLocaleTimeString('en-UK'))
    console.log(parsedDateFrom.toDateString())

    let timePara = document.createElement("P");
    timePara.innerHTML = "This energy mix is true between " + TimeStringFrom + " and " + TimeStringTo + " Zulu Time on " + DateStringFrom;
    document.getElementById("myDiv1").appendChild(timePara);

    for (let i = 0; i < data.data.generationmix.length; i++) {


        let fuel = data.data.generationmix[i].fuel
        let percentage = data.data.generationmix[i].perc
        // console.log(fuel + " " + percentage)
        let para = document.createElement("P");
        para.innerHTML = "The percentage mix of " + fuel + " is " + percentage + "%";
        document.getElementById("myDiv").appendChild(para);
    }

}

getGenMix();

// setInterval(getGenMix, 1000);
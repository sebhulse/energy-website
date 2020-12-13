
const api_url = 'https://api.carbonintensity.org.uk/generation';

let generationData = new Map()
let energyLabels = []
let generationMixData = []

async function getGenMix() {
    const response = await fetch(api_url);
    const data = await response.json();

    let generationMix = data.data.generationmix
    let dateFrom = data.data.from
    let parsedDateFrom = new Date(dateFrom)
    let DateStringFrom = parsedDateFrom.toDateString()
    let TimeStringFrom = parsedDateFrom.toLocaleTimeString('en-UK')

    let dateTo = data.data.to
    let parsedDateTo = new Date(dateTo)
    let TimeStringTo = parsedDateTo.toLocaleTimeString('en-UK')

    let timePara = document.createElement("P");
    timePara.innerHTML = "This energy mix is true between " + TimeStringFrom + " and " + TimeStringTo + " Zulu Time on " + DateStringFrom;
    document.getElementById("myDiv1").appendChild(timePara);


    for (let i = 0; i < generationMix.length; i++) {

        let fuel = data.data.generationmix[i].fuel
        let percentage = data.data.generationmix[i].perc
        generationData.set(fuel, percentage)

        // let para = document.createElement("P");
        // para.innerHTML = "The percentage mix of " + fuel + " is " + percentage + "%";
        // document.getElementById("myDiv").appendChild(para);
    }

    // sort map
    generationData[Symbol.iterator] = function* () {
        yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
    }

    // create separate arrays from map to pass to chart
    for (let [key, value] of generationData) {
        energyLabels.push(key)
        generationMixData.push(value)
    }


    let ctx = document.getElementById('myChart').getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            datasets: [{

                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                label: 'My First dataset',
                // backgroundColor: 'rgb(255, 99, 132)',
                // borderColor: 'rgb(255, 99, 132)',
                data: generationMixData
            }],
            labels: energyLabels,
        },

        options: {
            responsive:true,
            maintainAspectRatio: false
        }
    });

}

getGenMix();

setInterval(getGenMix, 1800000);
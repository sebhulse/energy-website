const api_url = 'https://api.carbonintensity.org.uk/generation';

let generationData = new Map()
let energyLabels = []
let generationMixData = []
let requestTime = Date.now()

async function getGenMix() {
    const response = await fetch(api_url);
    const data = await response.json();

    let generationMix = data.data.generationmix

    // date/time variables
    let dateFrom = data.data.from
    let parsedDateFrom = new Date(dateFrom)
    // let DateStringFrom = parsedDateFrom.toDateString()
    let TimeStringFrom = (parsedDateFrom.toLocaleTimeString('en-UK')).slice(0, 4) + " PM"

    let dateTo = data.data.to
    let parsedDateTo = new Date(dateTo)
    let parsedDateTo2 = Date.parse(parsedDateTo)
    let TimeStringTo = (parsedDateTo.toLocaleTimeString('en-UK')).slice(0, 4) + " PM"

    // time difference
    let timeSinceRequested = requestTime - parsedDateTo2
    console.log(timeSinceRequested)

    function msToTime(duration) {
        let milliseconds = parseInt((duration % 1000) / 100),
            seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? hours : hours;
        minutes = (minutes < 10) ? minutes : minutes;
        seconds = (seconds < 10) ? seconds : seconds;
        
        let returnStatement = seconds + " seconds"
        if (hours > 0) {
            returnStatement = hours + " hours, " + minutes + " minutes and " + seconds + " seconds"
        } else if (minutes > 0) {
            returnStatement = minutes + " minutes and " + seconds + " seconds"
        }

        return returnStatement;
    }

    console.log(msToTime(timeSinceRequested))


    let timePara = document.createElement("P");
    timePara.innerHTML = "This was the energy generation mix from " + TimeStringFrom + " to " + TimeStringTo
        + " UTC today (last updated " + msToTime(timeSinceRequested) + " ago)."
    document.getElementById("myDiv1").appendChild(timePara);

    // create map of json data
    for (let i = 0; i < generationMix.length; i++) {

        let fuel = data.data.generationmix[i].fuel
        let percentage = data.data.generationmix[i].perc
        generationData.set(fuel, percentage)

    }

    // sort map
    generationData[Symbol.iterator] = function* () {
        yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
    }

    // title case function for chart labels
    function toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

    // create separate arrays from map to pass to chart
    for (let [key, value] of generationData) {
        energyLabels.push(toTitleCase(key))
        generationMixData.push(value)
    }

    // create chart
    let ctx = document.getElementById('myChart').getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            datasets: [{
                backgroundColor: [
                    'rgba(249, 65, 68, 1)',
                    'rgba(39, 125, 161, 1)',
                    'rgba(243, 114, 44, 1)',
                    'rgba(87, 117, 144, 1)',
                    'rgba(248, 150, 30, 1)',
                    'rgba(77, 144, 142, 1)',
                    'rgba(249, 132, 74, 1)',
                    'rgba(67, 170, 139, 1)',
                    'rgba(249, 199, 79, 1)',
                    'rgba(144, 190, 109, 1)'
                ],
                label: 'UK Energy Mix',
                data: generationMixData
            }],
            labels: energyLabels,
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

        }
    });

}

// create page
getGenMix();

// update every half an hour
setTimeout(function(){
    location = ''
},1800000)
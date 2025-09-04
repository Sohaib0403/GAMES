function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function getRandomInt(max) {

    while (newQuesArr.length < max) {
        var randomnumber = Math.floor(Math.random() * 26 + 1);
        if (newQuesArr.indexOf(randomnumber) > -1)
            continue;
        newQuesArr[newQuesArr.length] = randomnumber;
    }
    console.log(newQuesArr);
}

// var minVal = Math.min.apply(null, newQuesArr)
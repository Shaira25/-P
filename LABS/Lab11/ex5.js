attributes = "Shane;30;30.5;-29.5";
parts = attributes.split();

//for (i=0; i < parts.length; i++){
    //console.log(`${parts[i]} isNonNegInt ${isNonNegInt(parts[i], true)}`);
//}
parts.forEach(function (item, Index){
console.log( (typeof item == 'string' && item.length > 0)?true:false )});

function printIt(item, Index){
    console.log(`${item} isNonNegInt ${isNonNegInt(item, true)}`);
}
console.log(parts.join());

function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first

    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer

    return returnErrors ? errors : (errors.length == 0); 

}

//console.log(isNonNegInt());
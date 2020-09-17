var age = 30;
var count = 1;
while(count++ < age) {

     
    if (count > age/2) {
    process.exit();
    console.log("Don't ask how old I am");
    continue;

    }

console.log(count);
}

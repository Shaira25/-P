
name = 'Shane';
likesBeer = true;


if (!likesBeer) {
    console.log('Beer is something I dislike');}
  
 else{ console.log('I like Beer');}

// -- Price depends on quantity
quantity =  25;

if ( quantity > 0 ) {
    price = 100;
    if ( quantity >= 10 ) {
        price = 50 ;
        if ( quantity >= 25 ) {
            price = 35;
        }
    }
}
else
    price = "no purchase" ;

console.log( quantity + ' products will cost ' + price + ' each.' ) ;

year = 2020
switch (year % 12) 
{
    case 0:
        yearName = 'January';
        break;
    case 1:
        yearName = 'February';
        break;
    case 2: 
        yearName = 'March';
        break;
    case 3: 
        yearName = 'April';
        break;
    case 4: 
        yearName = 'May';
        break;
    case 5: 
        yearName = 'June';
        break;
    case 6:
        yearName = 'July';
        break;
    case 7:
        yearName = 'August';
        break;
    case 8:
        yearName = 'September';
        break;
    case 9:
        yearName = 'October';
        break;
    case 10:
        yearName = 'November';
        break;
    case 11:
        yearName = 'December';
        break;
    
}
console.log(`Year ${year} is a ${yearName}`);
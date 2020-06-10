const express = require('express')
const app = express()
var pug = require('pug');

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'pug');

app.get('/', function (req, res) {
    res.render('index', { title: 'Password Generator', low: true, upp: true, num: true});
});

app.post('/',function(req, res, next){
    const inputtedData = req.body;
    console.log(inputtedData);
    var vatIncMaterialCost = 0, vatIncLaborCost = 0;
    var orderDiscountMaterialCost = 0, orderDiscountLaborCost = 0;
    var vatMaterialCost = 0, vatLaborCost = 0;
    var vatExMaterialCost = 0, vatExLaborCost = 0;
    var orderDiscountAppliedMaterialCost = 0, orderDiscountAppliedLaborCost = 0;
    var discountedTotalMaterialCost = 0, discountedTotalLaborCost = 0;
    var addVatMaterialCost = 0, addVatLaborCost = 0;
    var ewtLaborCost = 0;

    if (inputtedData['vendorVatStatus'] == 'VAT' && inputtedData['priceVatStatus'] == 'VATInc') {
        vatIncMaterialCost = 37180.80;
        vatIncLaborCost = 8000;

        if(inputtedData['discountAppliedOn'] == 'VATInc Price') {
            if(inputtedData['percentOfCostDiscountedOn'] == 'Material Cost' || inputtedData['percentOfCostDiscountedOn'] == 'Total Cost') {
                orderDiscountMaterialCost = vatIncMaterialCost * inputtedData['percentOfCostDiscount'] / 100;
            }
            if (inputtedData['fixedAmountDiscountedOn'] == 'Material Cost') {
                orderDiscountMaterialCost += parseFloat(inputtedData['fixedAmount']);
            }
    
            if(inputtedData['percentOfCostDiscountedOn'] == 'L&E Cost' || inputtedData['percentOfCostDiscountedOn'] == 'Total Cost') {
                orderDiscountLaborCost = vatIncLaborCost * inputtedData['percentOfCostDiscount'] / 100;
            }
            if (inputtedData['fixedAmountDiscountedOn'] == 'L&E Cost') {
                orderDiscountLaborCost += parseFloat(inputtedData['fixedAmount']);
            }
        }

        vatMaterialCost = (vatIncMaterialCost - orderDiscountMaterialCost) * 0.12;
        vatLaborCost = (vatIncLaborCost - orderDiscountLaborCost) * 0.12;

    } 

    if(inputtedData['discountAppliedOn'] == 'VATEx Price') {
        if(inputtedData['priceVatStatus'] == 'VATInc') {
            if(inputtedData['percentOfCostDiscountedOn'] == 'Material Cost' || inputtedData['percentOfCostDiscountedOn'] == 'Total Cost') {
                orderDiscountAppliedMaterialCost = (vatIncMaterialCost - vatMaterialCost) * inputtedData['percentOfCostDiscount'] / 100;
            }

            if(inputtedData['percentOfCostDiscountedOn'] == 'L&E Cost' || inputtedData['percentOfCostDiscountedOn'] == 'Total Cost') {
                orderDiscountAppliedLaborCost = (vatIncLaborCost - vatLaborCost) * inputtedData['percentOfCostDiscount'] / 100;
            }
        } else {
            if(inputtedData['percentOfCostDiscountedOn'] == 'Material Cost' || inputtedData['percentOfCostDiscountedOn'] == 'Total Cost') {
                orderDiscountAppliedMaterialCost = vatExMaterialCost * inputtedData['percentOfCostDiscount'] / 100;
            }

            if(inputtedData['percentOfCostDiscountedOn'] == 'L&E Cost' || inputtedData['percentOfCostDiscountedOn'] == 'Total Cost') {
                orderDiscountAppliedLaborCost = vatExLaborCost * inputtedData['percentOfCostDiscount'] / 100;
            }
        }

        if (inputtedData['fixedAmountDiscountedOn'] == 'Material Cost') {
            orderDiscountAppliedMaterialCost += parseFloat(inputtedData['fixedAmount']);
        }
        if (inputtedData['fixedAmountDiscountedOn'] == 'L&E Cost') {
            orderDiscountAppliedLaborCost += parseFloat(inputtedData['fixedAmount']);
        }
    } 

    if(inputtedData['priceVatStatus'] == 'VATInc') {
        vatExMaterialCost = vatExMaterialCost - orderDiscountMaterialCost - vatMaterialCost;
        vatExLaborCost = vatExLaborCost - orderDiscountLaborCost - vatLaborCost;

        discountedTotalMaterialCost = vatIncMaterialCost;
        discountedTotalLaborCost = vatIncLaborCost;
    } else {
        vatExMaterialCost = 37180.80;
        vatExLaborCost = 8000;

        discountedTotalMaterialCost = vatExMaterialCost;
        discountedTotalMaterialCost = vatExLaborCost;
    }


    discountedTotalMaterialCost = discountedTotalMaterialCost - orderDiscountMaterialCost - vatMaterialCost - orderDiscountAppliedMaterialCost;
    discountedTotalLaborCost = discountedTotalLaborCost - orderDiscountLaborCost - vatLaborCost - orderDiscountAppliedLaborCost;

    addVatMaterialCost = discountedTotalMaterialCost * (inputtedData['vendorVatStatus'] == 'VAT' ? 0.12 : 0);
    addVatLaborCost = discountedTotalLaborCost * (inputtedData['vendorVatStatus'] == 'VAT' ? 0.12 : 0);

    ewtLaborCost = discountedTotalLaborCost * parseFloat(inputtedData['ewtRate']) / 100;

    var netTotalTotalCost = (discountedTotalMaterialCost + discountedTotalLaborCost) + (addVatMaterialCost + addVatLaborCost) - (ewtLaborCost) + 1200;

    let pageData = { 
        title: 'VAT Calculator', 
        computedData: true, 
        vatIncMaterialCost,
        vatIncLaborCost,
        vatIncTotalCost: vatIncMaterialCost + vatIncLaborCost,
        orderDiscountMaterialCost,
        orderDiscountLaborCost,
        orderDiscountTotalCost: orderDiscountMaterialCost + orderDiscountLaborCost,
        vatMaterialCost,
        vatLaborCost,
        vatTotalCost: vatMaterialCost + vatLaborCost,
        vatExMaterialCost,
        vatExLaborCost,
        vatExTotalCost: vatExMaterialCost + vatExLaborCost,
        orderDiscountAppliedMaterialCost,
        orderDiscountAppliedLaborCost,
        orderDiscountAppliedTotalCost: orderDiscountAppliedMaterialCost + orderDiscountAppliedLaborCost,
        discountedTotalMaterialCost,
        discountedTotalLaborCost,
        discountedTotalTotalCost: discountedTotalMaterialCost + discountedTotalLaborCost,
        addVatMaterialCost,
        addVatLaborCost,
        addVatTotalCost: addVatMaterialCost + addVatLaborCost,
        ewtLaborCost,
        shipmentTotalCost: 1200,
        netTotalTotalCost, 
        ...req.body
    }
    res.render('index', pageData);
});

app.listen(3000, () => console.log('listening on port 3000'))
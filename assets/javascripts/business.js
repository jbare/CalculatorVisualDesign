var totalNet = "totalNet";
var totalCosts = "totalCosts";
var totalSavings = "totalSavings";
var airTaxes = "airTaxes";
var seatMiles = "seatMiles";
var percentSplit = "percentSplit";
var homeTaxes = "homeEnergyLosses";
var heatingType = "heating";
var usageComp = "percentOfAverage";
var exactEnergy = "exactEnergy";
var utilityCostRate = "utilities";
var split = "split";
var displayElectricBlock = "displayElectricBlock";
var chosenUtility = "utilities";
var utilityList = "utilityList";
var zipcode = "zipcode";
var displayUtilityBlock = "displayUtilityBlock";
var autoUpdateChosenUtility = "autoUpdateChosenUtility";
var displayEnergyResult = "displayEnergyResult";
var thermsNatGas = "thermsNatGas";
var gallonsFuelOil = "gallonsFuelOil";
var kWhElec = "kWhElec";
var natGasLosses = "natGasLosses";
var fuelOilLosses = "fuelOilLosses";
var elecLosses = "elecLosses";
var natGas = 0;
var fuelOil = 1;
var elec = 2;
var wood = 3;
var other = 4;
var displayApproxPercentage = "displayApproxPercentage";
var noClicked = "noClicked";
var income = "income";
var salesTax = "salesTaxPayment";
var salesTaxRate = "salesTaxRate";
var salesTaxSavings = "salesTaxSavings";
var autoUpdateSalesTax = "autoUpdateSalesTax";
var income1 = "income1";
var eitc = "eitc";
var wfr = "wfrSavings";
var dependents = "dependents";
var taxStatus = "taxStatus";
var autoUpdateEITC = "autoUpdateEITC";
var gasolineCalcMethod = "gasolineCalcMethod";
var gallons = "gallons";
var gallonsTimeframe = "gasTimeframe";
var dollars = "dollars";
var dollarsTimeframe = "dollarTimeframe";
var miles = "miles";
var milesTimeframe = "mileageTimeframe";
var mpg = "mpg";
var gasolineTaxes = "gasolineLosses";
var dpg = "gasCost";
var calculateWFR = "calculateWFR";
var salesTaxBlock = "salesTaxBlock";
var displaySalesTaxBlock = "displaySalesTaxBlock";
var displayBOTaxBlock = "displayBOTaxBlock";
var BOTaxSavings = "BOTaxSavings";
var BOTaxes = "BOTaxes";
var airPayments = "airPayments";
var airTaxesCalcMethod = "airTaxesCalcMethod";

$(document).ready(function () {
  $( document ).tooltip(); 
  
  var calc = new Calculator();
  var nodes = {};

  //Summary data

  nodes.totalNet = new Node(calc, {type: "num", round: 0}, totalNet, 0);
  nodes.totalNet.divs = {save: $("#save"), pay: $("#pay"), zero: $("#zero")};
  nodes.totalNet.computeSpecific = function() {
    this.value = Math.round(this.children[totalSavings].getValue() - this.children[totalCosts].getValue());

    if (this.value > 0) {
      this.divs.save.css( "display", "block");
      this.divs.pay.css( "display", "none");
      this.divs.zero.css( "display", "none");
    } else if (this.value < 0) {
      this.divs.save.css( "display", "none");
      this.divs.pay.css( "display", "block");
      this.divs.zero.css( "display", "none");
    } else {
      this.divs.save.css( "display", "none");
      this.divs.pay.css( "display", "none");
      this.divs.zero.css( "display", "block");
    }
  }  

  nodes.totalCosts = new Node(calc, {type: "num", round: 0}, totalCosts, 0, [nodes.totalNet]);
  nodes.totalCosts.computeSpecific = function() {
    this.value = Math.round(this.children[gasolineTaxes].getValue() + this.children[airTaxes].getValue() + this.children[homeTaxes].getValue());

  }
  nodes.totalSavings = new Node(calc, {type: "num", round: 0}, totalSavings, 0, [nodes.totalNet]);
  nodes.totalSavings.computeSpecific = function() {
    this.value = Math.round(this.children[salesTaxSavings].getValue() + this.children[BOTaxSavings].getValue());

  }

  //Sales tax

  nodes.salesTaxSavings = new Node(calc, {type: "num", round: 0}, salesTaxSavings, 0, [nodes.totalSavings]);
  nodes.salesTaxSavings.computeSpecific = function() {
    this.value = Math.round(this.children[salesTax].getValue()/this.children[salesTaxRate].getValue());
  }

  nodes.salesTaxRate = new Node(calc, {type: "num", round: 2}, salesTaxRate, 8.95, [nodes.salesTaxSavings]);

  nodes.salesTax = new Node(calc, {type: "num", round: 0}, salesTax, 0, [nodes.salesTaxSavings]);
  nodes.salesTax.divs = {salesTaxBlock: $("#salesTax")};
  nodes.salesTax.computeSpecific = function() {
    if (this.children[displaySalesTaxBlock].getValue()) {
      this.divs.salesTaxBlock.css( "display", "block");
    }
  }
  nodes.displaySalesTaxBlock = new Node(calc, {type: "bool"}, displaySalesTaxBlock, false, [nodes.salesTax]);


  //B&O Tax

  nodes.BOTaxSavings = new Node(calc, {type: "num", round: 0}, BOTaxSavings, 0, [nodes.totalSavings]);
  nodes.BOTaxSavings.computeSpecific = function() {
    this.value = Math.round(this.children[BOTaxes].getValue());
  }

  nodes.BOTaxes = new Node(calc, {type: "num", round: 0}, BOTaxes, 0, [nodes.BOTaxSavings]);
  nodes.BOTaxes.divs = {BOTaxBlock: $("#BOTax")};
  nodes.BOTaxes.computeSpecific = function() {
    if (this.children[displayBOTaxBlock].getValue()) {
      this.divs.BOTaxBlock.css( "display", "block");
    }
  }
  nodes.displayBOTaxBlock = new Node(calc, {type: "bool"}, displayBOTaxBlock, false, [nodes.BOTaxes]);



  //Gasoline tax

  nodes.gasolineTaxes = new Node(calc, {type: "num", round: 0}, gasolineTaxes, 0, [nodes.totalCosts]);
  nodes.gasolineTaxes.computeSpecific = function() {
    if (this.children[gasolineCalcMethod].getValue() == 0) {
      this.value = Math.round(this.children[gallons].getValue()*this.children[gallonsTimeframe].getValue()*8.91/1000*25);
    } else if (this.children[gasolineCalcMethod].getValue() == 1) {
      this.value = Math.round(this.children[dollars].getValue()/this.children[dpg].getValue()*this.children[dollarsTimeframe].getValue()*8.91/1000*25);
    } else {
      this.value = Math.round(this.children[miles].getValue()/this.children[mpg].getValue()*this.children[milesTimeframe].getValue()*8.91/1000*25);
    }

  }

  nodes.gasolineCalcMethod = new Node(calc, {type: "num", round: 0}, gasolineCalcMethod, 0, [nodes.gasolineTaxes]);

  nodes.gallons = new Node(calc, {type: "num", round: 2}, gallons, 0, [nodes.gasolineTaxes]);

  nodes.gallonsTimeframe = new Node(calc, {type: "num", round: 0}, gallonsTimeframe, 52, [nodes.gasolineTaxes]);

  nodes.dollars = new Node(calc, {type: "num", round: 2}, dollars, 0, [nodes.gasolineTaxes]);

  nodes.dollarsTimeframe = new Node(calc, {type: "num", round: 0}, dollarsTimeframe, 52, [nodes.gasolineTaxes]);

  nodes.dpg = new Node(calc, {type: "num", round: 2}, dpg, 2.40, [nodes.gasolineTaxes]);

  nodes.miles = new Node(calc, {type: "num", round: 0}, miles, 0, [nodes.gasolineTaxes]);

  nodes.milesTimeframe = new Node(calc, {type: "num", round: 0}, milesTimeframe, 1, [nodes.gasolineTaxes]);

  nodes.mpg = new Node(calc, {type: "num", round: 0}, mpg, 0, [nodes.gasolineTaxes]);


  //Air travel tax

  nodes.airTaxes = new Node(calc, {type: "num", round: 0}, airTaxes, 0, [nodes.totalCosts]);
  nodes.airTaxes.computeSpecific = function() {
    if (this.children[airTaxesCalcMethod].getValue() == 0) {
      this.value = Math.round(this.children[seatMiles].getValue()/60*9.57/1000*25);
    }
    else {
      this.value = Math.round(this.children[airPayments].getValue()/0.13/2/60*9.57/1000*25);
    }
  }
  nodes.seatMiles = new Node(calc, {type: "num", round: 0}, seatMiles, 0, [nodes.airTaxes]);

  nodes.airTaxesCalcMethod = new Node(calc, {type: "num", round: 0}, airTaxesCalcMethod, 0, [nodes.airTaxes]);

  nodes.airPayments = new Node(calc, {type: "num", round: 0}, airPayments, 0, [nodes.airTaxes]);



  //Building energy use tax

  nodes.homeTaxes = new Node(calc, {type: "num", round: 0}, homeTaxes, 0, [nodes.totalCosts]);
  nodes.homeTaxes.divs = {energyResult: $("#energyResult"), approxPercentage: $("#approxPercentage")};
  nodes.homeTaxes.computeSpecific = function() {
    
    if (this.children[displayApproxPercentage].getValue() && this.children[noClicked].getValue()) {
      this.divs.approxPercentage.css( "display", "block");
    }

    if (this.children[displayEnergyResult].getValue()) {
      this.value = Math.round(this.children[natGasLosses].getValue() + this.children[fuelOilLosses].getValue() + this.children[elecLosses].getValue());

      this.divs.energyResult.css( "display", "block");
    }
  }
  nodes.noClicked = new Node(calc, {type: "bool"}, noClicked, false, [nodes.homeTaxes]);
  nodes.displayApproxPercentage = new Node(calc, {type: "bool"}, displayApproxPercentage, false, [nodes.homeTaxes]);
  nodes.displayEnergyResult = new Node(calc, {type: "bool"}, displayEnergyResult, false, [nodes.homeTaxes]);

  nodes.natGasLosses = new Node(calc, {type: "num", round: 0}, natGasLosses, 0, [nodes.homeTaxes]);
  nodes.natGasLosses.computeSpecific = function() {
    if (this.children[exactEnergy].getValue()) {
      this.value = Math.round(5.306*25*this.children[thermsNatGas].getValue()/1000);
    } else {
      if (this.children[heatingType].getValue() == natGas || this.children[heatingType].getValue() == other) {
        this.value = Math.round(5.306*25*732/1000*this.children[usageComp].getValue()/100);
      } else {
        this.value = 0;
      }
    }
  }

  nodes.fuelOilLosses = new Node(calc, {type: "num", round: 0}, fuelOilLosses, 0, [nodes.homeTaxes]);
  nodes.fuelOilLosses.computeSpecific = function() {
    if (this.children[exactEnergy].getValue()) {
      this.value = Math.round(10.15*25*this.children[gallonsFuelOil].getValue()/1000);
    } else {
      if (this.children[heatingType].getValue() == fuelOil) {
        this.value = Math.round(10.15*25*527/1000*this.children[usageComp].getValue()/100);
      } else {
        this.value = 0;
      }
    }
  }

  nodes.elecLosses = new Node(calc, {type: "num", round: 0}, elecLosses, 0, [nodes.homeTaxes]);
  nodes.elecLosses.computeSpecific = function() {
    if (this.children[exactEnergy].getValue()) {
      this.value = Math.round(this.children[utilityCostRate].getValue()*this.children[kWhElec].getValue()/100);
    } else {
      if (this.children[heatingType].getValue() == elec) {
        this.value = Math.round(this.children[utilityCostRate].getValue()*(11000 + 11360)/100*this.children[usageComp].getValue()/100);
      } else {
        this.value = Math.round(this.children[utilityCostRate].getValue()*(11000)/100*this.children[usageComp].getValue()/100);
      }
    }
  }
  nodes.heatingType = new Node(calc, {type: "num"}, heatingType, natGas, [nodes.natGasLosses, nodes.fuelOilLosses, nodes.elecLosses]);

  nodes.usageComp = new Node(calc, {type: "num", round: 0}, usageComp, 100, [nodes.natGasLosses, nodes.fuelOilLosses, nodes.elecLosses]);
  
  
  nodes.thermsNatGas = new Node(calc, {type: "num", round: 0}, thermsNatGas, 0, [nodes.natGasLosses]);
  nodes.gallonsFuelOil = new Node(calc, {type: "num", round: 0}, gallonsFuelOil, 0, [nodes.fuelOilLosses]);
  nodes.kWhElec = new Node(calc, {type: "num", round: 0}, kWhElec, 0, [nodes.elecLosses]);
  
  nodes.exactEnergy = new Node(calc, {type: "bool"}, exactEnergy, true, [nodes.natGasLosses, nodes.fuelOilLosses, nodes.elecLosses]);
  
  nodes.utilityCostRate = new Node(calc, {type: "num", round: 2}, utilityCostRate, 1, [nodes.elecLosses]);
  nodes.utilityCostRate.computeSpecific = function() {
    this.value = getUtilityStats(this.children[chosenUtility].getValue())[1];
  }

  nodes.chosenUtility = new Node(calc, {type: "utility"}, chosenUtility, ["Seattle City Light", 0.02], [nodes.utilityCostRate]);
  nodes.chosenUtility.computeSpecific = function() {
    if (this.children[autoUpdateChosenUtility].getValue()) {
      this.value = this.children[utilityList].getValue()[0];
    }

  }
  nodes.autoUpdateChosenUtility = new Node(calc, {type: "bool"}, autoUpdateChosenUtility, true, [nodes.chosenUtility]);
  nodes.utilityList = new Node(calc, {type: "utilityList"}, utilityList, ["SCL","","","",""], [nodes.chosenUtility]);
  nodes.utilityList.divs = {utilityBlock: $("#utilityBlock"), approxOrExact: $("#approxOrExact")};

  nodes.utilityList.computeSpecific = function() {
    this.value = getUtilities(this.children[zipcode].getValue());
    $('#utilities').empty();
    for (var i = 0; i < 5; i ++) {
      if (this.value[i].length > 0) {
        var utilityStats = getUtilityStats(this.value[i]);
        $('#utilities').append($('<option>').text(utilityStats[0]).attr('value', this.value[i]));
      }
    }

    if (this.children[displayUtilityBlock].getValue()) {
      this.divs.utilityBlock.css( "display", "block");
      this.divs.approxOrExact.css( "display", "block");
    }
  }

  nodes.displayUtilityBlock = new Node(calc, {type: "bool"}, displayUtilityBlock, false, [nodes.utilityList]);
  nodes.zipcode = new Node(calc, {type: "zipcode", round: 0}, zipcode, 98105, [nodes.utilityList]);





  //Physical form elements are linked to their corresonding nodes that were created above


  var elements = {};

  //Summary data

  elements.totalNet = new FormElement(totalNet, $("#" + totalNet));
  elements.totalNet.setNode(nodes.totalNet);
  nodes.totalNet.setFormElement(elements.totalNet);
  elements.totalCosts = new FormElement(totalCosts, $("#" + totalCosts));
  elements.totalCosts.setNode(nodes.totalCosts);
  nodes.totalCosts.setFormElement(elements.totalCosts);
  elements.totalSavings = new FormElement(totalSavings, $("#" + totalSavings));
  elements.totalSavings.setNode(nodes.totalSavings);
  nodes.totalSavings.setFormElement(elements.totalSavings);

  
  //Sales tax

  elements.salesTaxSavings = new FormElement(salesTaxSavings, $("#" + salesTaxSavings));
  elements.salesTaxSavings.setNode(nodes.salesTaxSavings);
  nodes.salesTaxSavings.setFormElement(elements.salesTaxSavings);

  elements.salesTax = new FormElement(salesTax, $("#" + salesTax));
  elements.salesTax.setNode(nodes.salesTax);
  nodes.salesTax.setFormElement(elements.salesTax);

  elements.salesTaxRate = new FormElement(salesTaxRate, $("#" + salesTaxRate));
  elements.salesTaxRate.setNode(nodes.salesTaxRate);
  nodes.salesTaxRate.setFormElement(elements.salesTaxRate);


  //B&O tax

  elements.BOTaxSavings = new FormElement(BOTaxSavings, $("#" + BOTaxSavings));
  elements.BOTaxSavings.setNode(nodes.BOTaxSavings);
  nodes.BOTaxSavings.setFormElement(elements.BOTaxSavings);

  elements.BOTaxes = new FormElement(BOTaxes, $("#" + BOTaxes));
  elements.BOTaxes.setNode(nodes.BOTaxes);
  nodes.BOTaxes.setFormElement(elements.BOTaxes);


  //Gasoline tax

  elements.gasolineTaxes = new FormElement(gasolineTaxes, $("#" + gasolineTaxes));
  elements.gasolineTaxes.setNode(nodes.gasolineTaxes);
  nodes.gasolineTaxes.setFormElement(elements.gasolineTaxes);

  elements.gasolineCalcMethod = new FormElement(gasolineCalcMethod, $("#" + gasolineCalcMethod));
  elements.gasolineCalcMethod.setNode(nodes.gasolineCalcMethod);
  nodes.gasolineCalcMethod.setFormElement(elements.gasolineCalcMethod);

  elements.gallons = new FormElement(gallons, $("#" + gallons));
  elements.gallons.setNode(nodes.gallons);
  nodes.gallons.setFormElement(elements.gallons);

  elements.gallonsTimeframe = new FormElement(gallonsTimeframe, $("#" + gallonsTimeframe));
  elements.gallonsTimeframe.setNode(nodes.gallonsTimeframe);
  nodes.gallonsTimeframe.setFormElement(elements.gallonsTimeframe);
  elements.gallonsTimeframe.setAppearance = function() {

  }

  elements.dollars = new FormElement(dollars, $("#" + dollars));
  elements.dollars.setNode(nodes.dollars);
  nodes.dollars.setFormElement(elements.dollars);

  elements.dollarsTimeframe = new FormElement(dollarsTimeframe, $("#" + dollarsTimeframe));
  elements.dollarsTimeframe.setNode(nodes.dollarsTimeframe);
  nodes.dollarsTimeframe.setFormElement(elements.dollarsTimeframe);
  elements.dollarsTimeframe.setAppearance = function() {

  }

  elements.dpg = new FormElement(dpg, $("#" + dpg));
  elements.dpg.setNode(nodes.dpg);
  nodes.dpg.setFormElement(elements.dpg);

  elements.miles = new FormElement(miles, $("#" + miles));
  elements.miles.setNode(nodes.miles);
  nodes.miles.setFormElement(elements.miles);

  elements.milesTimeframe = new FormElement(milesTimeframe, $("#" + milesTimeframe));
  elements.milesTimeframe.setNode(nodes.milesTimeframe);
  nodes.milesTimeframe.setFormElement(elements.milesTimeframe);
  elements.milesTimeframe.setAppearance = function() {

  }

  elements.mpg = new FormElement(mpg, $("#" + mpg));
  elements.mpg.setNode(nodes.mpg);
  nodes.mpg.setFormElement(elements.mpg);



  //Air travel tax

  elements.airTaxes = new FormElement(airTaxes, $("#" + airTaxes));
  elements.airTaxes.setNode(nodes.airTaxes);
  nodes.airTaxes.setFormElement(elements.airTaxes);
  
  elements.seatMiles = new FormElement(seatMiles, $("#" + seatMiles));
  elements.seatMiles.setNode(nodes.seatMiles);
  nodes.seatMiles.setFormElement(elements.seatMiles);

  elements.airPayments = new FormElement(airPayments, $("#" + airPayments));
  elements.airPayments.setNode(nodes.airPayments);
  nodes.airPayments.setFormElement(elements.airPayments);


  //Building energy use tax

  elements.homeTaxes = new FormElement(homeTaxes, $("#" + homeTaxes));
  elements.homeTaxes.setNode(nodes.homeTaxes);
  nodes.homeTaxes.setFormElement(elements.homeTaxes);

  elements.natGasLosses = new FormElement(natGasLosses, $("#" + natGasLosses));
  elements.natGasLosses.setNode(nodes.natGasLosses);
  nodes.natGasLosses.setFormElement(elements.natGasLosses);

  elements.fuelOilLosses = new FormElement(fuelOilLosses, $("#" + fuelOilLosses));
  elements.fuelOilLosses.setNode(nodes.fuelOilLosses);
  nodes.fuelOilLosses.setFormElement(elements.fuelOilLosses);

  elements.elecLosses = new FormElement(elecLosses, $("#" + elecLosses));
  elements.elecLosses.setNode(nodes.elecLosses);
  nodes.elecLosses.setFormElement(elements.elecLosses);

  elements.thermsNatGas = new FormElement(thermsNatGas, $("#" + thermsNatGas));
  elements.thermsNatGas.setNode(nodes.thermsNatGas);
  nodes.thermsNatGas.setFormElement(elements.thermsNatGas);

  elements.gallonsFuelOil = new FormElement(gallonsFuelOil, $("#" + gallonsFuelOil));
  elements.gallonsFuelOil.setNode(nodes.gallonsFuelOil);
  nodes.gallonsFuelOil.setFormElement(elements.gallonsFuelOil);

  elements.kWhElec = new FormElement(kWhElec, $("#" + kWhElec));
  elements.kWhElec.setNode(nodes.kWhElec);
  nodes.kWhElec.setFormElement(elements.kWhElec);

  elements.zipcode = new FormElement(zipcode, $("#" + zipcode));
  elements.zipcode.setNode(nodes.zipcode);
  nodes.zipcode.setFormElement(elements.zipcode);
  elements.zipcode.setError("Please enter a valid zipcode for the state of Washington");

  elements.chosenUtility = new FormElement(chosenUtility, $("#" + chosenUtility));
  elements.chosenUtility.setNode(nodes.chosenUtility);
  nodes.chosenUtility.setFormElement(elements.chosenUtility);
  elements.chosenUtility.setAppearance = function() {

  }

  elements.usageComp = new FormElement(usageComp, $("#" + usageComp));
  elements.usageComp.setNode(nodes.usageComp);
  nodes.usageComp.setFormElement(elements.usageComp);
  


  //Setting up the event handler for user input to the calculator


  //Sales tax

  $("#submitSalesTax").on("click", 
    function () {
      nodes.displaySalesTaxBlock.setValueBasic(true);
      elements.salesTax.updateNode();
      calc.compute();
    }
  );

  $("#submitSalesTaxRate").on("click", 
    function () {
      elements.salesTaxRate.updateNode();
      calc.compute();
    }
  );


  //B&O tax

  $("#skip").click(
    function () {
      $( "#accordion" ).accordion( "option", "active", 2 );
    }
  );

  $("#submitBOTax").click(
      function () {
        nodes.displayBOTaxBlock.setValueBasic(true);
        elements.BOTaxes.updateNode();
        calc.compute();
    }
  );


  //Gasoline tax

  $("#submitGallons").click(
      function () {
        nodes.gasolineCalcMethod.setValueBasic(0);
        elements.gallons.updateNode();
        elements.gallonsTimeframe.updateNode();
        calc.compute();
    }
  );

  $("#submitDollars").click(
      function () {
        nodes.gasolineCalcMethod.setValueBasic(1);
        elements.dollars.updateNode();
        elements.dollarsTimeframe.updateNode();
        elements.dpg.updateNode();
        calc.compute();
    }
  );

  $("#submitMileage").click(
      function () {
        nodes.gasolineCalcMethod.setValueBasic(2);
        elements.miles.updateNode();
        elements.milesTimeframe.updateNode();
        elements.mpg.updateNode();
        calc.compute();
    }
  );


  //Air travel tax

  $("#submitSeatMiles").on("click", 
    function () {
      nodes.airTaxesCalcMethod.setValueBasic(0);
      elements.seatMiles.updateNode();
      calc.compute();
    }
  );

  $("#submitAirPayments").on("click", 
    function () {
      nodes.airTaxesCalcMethod.setValueBasic(1);
      elements.airPayments.updateNode();
      calc.compute();
    }
  );


  //Building energy use tax

  $("#submitZipcode").on("click", 
    function () {
      nodes.displayUtilityBlock.setValueBasic(true);
      nodes.autoUpdateChosenUtility.setValue(true);
      elements.zipcode.updateNode();
      calc.compute();
    }
  );

  $("#utilities").on("change", 
    function () {
      nodes.autoUpdateChosenUtility.setValue(false);
      elements.chosenUtility.updateNode();
      calc.compute();
    }
  );

  $("#yes").on("click", 
    function () {
      nodes.noClicked.setValueBasic(false);
      nodes.exactEnergy.setValue(true);
      calc.compute();
      $("#approxEnergy").css("display", "none");
      $("#approxPercentage").css("display", "none");
      $("#energyUsage").css("display", "block");
    }
  );

  $("#no").on("click", 
    function () {
      nodes.noClicked.setValueBasic(true);
      nodes.exactEnergy.setValue(false);
      calc.compute();
      $("#approxEnergy").css("display", "block");
      $("#energyUsage").css("display", "none");
    }
  );

  $("#submitUsage").on("click", 
    function () {
      nodes.displayEnergyResult.setValueBasic(true);
      elements.thermsNatGas.updateNode();
      elements.gallonsFuelOil.updateNode();
      elements.kWhElec.updateNode();
      calc.compute();
    }
  );

  var heatingRadios = document.getElementsByName( "heating" );
  for(var i = 0; i < heatingRadios.length; i++) {
    (function (_i) {
      heatingRadios[_i].onclick = function() {
        nodes.displayApproxPercentage.setValueBasic(true);
        nodes.displayEnergyResult.setValueBasic(true);
        nodes.heatingType.setValue(_i);
        calc.compute();
        
      };
    })(i);
  }

  $("#submitPercentOfAverage").on("click", 
    function () {
      nodes.displayEnergyResult.setValueBasic(true);
      elements.usageComp.updateNode();
      calc.compute();
      
    }
  );

}
);

function inheritPrototype(childObject, parentObject) {
  var copyOfParent = Object.create(parentObject.prototype);
  copyOfParent.constructor = childObject;
  childObject.prototype = copyOfParent;
}

function FormElement(name, object) {
  this.setName(name);
  this.setObject(object);
}

FormElement.prototype.setName = function(name) {
  this.name = name;
}

FormElement.prototype.getName = function() {
  return this.name;
}

FormElement.prototype.setObject = function(object) {
  this.object = object;
}

FormElement.prototype.getObject = function() {
  return this.object;
}

FormElement.prototype.setNode = function(node) {
  this.node = node;
}

FormElement.prototype.getNode = function() {
  return this.node;
}

FormElement.prototype.setValue = function(value) {
  this.value = value;
}

FormElement.prototype.getValue = function() {
  return this.value;
}

FormElement.prototype.setAppearance = function(value) {
  this.object.val(value);
}

FormElement.prototype.setError = function(error) {
  this.error = error;
}

FormElement.prototype.getError = function() {
  return this.error;
}

FormElement.prototype.updateNode = function() {
  this.getNode().setValue(this.getObject().val());
}

FormElement.prototype.validator = function() {
  this.object.prop("title", "");
  this.object.css("background-color", "white");
  this.object.tooltip({ content: "" });
}

FormElement.prototype.invalidator = function() {
  if (this.error) {
    this.object.prop("title", this.error);
  } else {
    this.object.prop("title", "Please enter a valid number");
  }

  this.object.css("background-color", "#FFCCCC");
  this.object.tooltip();
}

function Node(calc, dataType, name, value, parentNodes) {
  this.calc = calc;
  this.setName(name);
  this.parents = {};
  this.children = {};

  this.dataType = dataType;

  this.value = value;

  for (index in parentNodes) {
    this.addParent(parentNodes[index]);
    parentNodes[index].addChild(this);
  }

  this.changed = false;
  this.root = false;

}

Node.prototype.setName = function(name) {
  this.name = name;
}

Node.prototype.getName = function() {
  return this.name;
}

Node.prototype.setChanged = function(changed) {
  this.changed = changed;
  var parents = this.getParents();
  for (key in parents) {
    parents[key].setChanged(true);
  }

  if (Object.keys(parents).length == 0) {
    this.setRoot(true);
  }
}

Node.prototype.getChanged = function() {
  return this.changed;
}

Node.prototype.setRoot = function(root) {
  this.root = root;
  this.calc.addRoot(this);
}

Node.prototype.getRoot = function() {
  return this.root;
}

Node.prototype.setValue = function(value) {
  var valid = this.validSet(value);

  if (valid) {
    this.setChanged(true);
    if (this.getFormElement()) {
      this.getFormElement().validator();
    }
  } else if (this.getFormElement()) {
    this.getFormElement().invalidator();
  }
}

Node.prototype.setValueBasic = function(value) {
  var valid = this.validSet(value);

  if (valid) {
    if (this.getFormElement()) {
      this.getFormElement().validator();
    }
  } else if (this.getFormElement()) {
    this.getFormElement().invalidator();
  }
}

Node.prototype.getValue = function() {
  return this.value;
}

Node.prototype.setFormElement = function(formElement) {
  this.formElement = formElement;
}

Node.prototype.getFormElement = function() {
  return this.formElement;
}

Node.prototype.addParent = function(parentNode) {
  this.parents[parentNode.getName()] = parentNode;
}

Node.prototype.getParents = function() {
  return this.parents;
}

Node.prototype.addChild = function(childNode) {
  this.children[childNode.getName()] = childNode;
}

Node.prototype.compute = function() {
  for (key in this.children) {
    if (this.children[key].getChanged() == true) {
      this.children[key].compute();
    }
  }

  this.computeSpecific();

  if (this.getFormElement()) {
    this.getFormElement().validator();
  }

  this.changed = false;
  if (this.getFormElement()) {
    this.getFormElement().setAppearance(Math.abs(this.getValue()).toFixed(this.dataType.round));
  }
  return this.getValue();

}

Node.prototype.computeSpecific = function() {

}

Node.prototype.validSet = function(value) {
  

  if (this.dataType.type == "num" ) {
    value = String(value).replace(",", "").replace("%", "").replace("$", "");
    if (isNumber(value)) {
      this.value = parseFloat(value);
      return true;
    } else {
      return false;
    }
  } else if (this.dataType.type == "str") {
    this.value = value;
    return true;
  } else if (this.dataType.type == "bool") {
    this.value = value;
    return true;
  } else if (this.dataType.type == "utility") {
    this.value = value;
    return true;
  } else if (this.dataType.type == "zipcode") {
    value = String(value).replace(",", "").replace("%", "").replace("$", "");
    if (isNumber(value) && value.length == 5 && getUtilities(value) != 0) {
      this.value = parseFloat(value);
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }

}

Node.prototype.validCheck = function() {
  console.log(this.value);
  this.value = String(this.value).replace(",", "").replace("%", "").replace("$", "");

  if (isNumber(this.value)) {
    this.value = Math.round(this.value);
    this.getFormElement().validator();
    return true;
  } else {
    this.getFormElement().invalidator();
    return false;
  }

}

function isNumber(str) {
  var patt = new RegExp(/^((\d*)(\.\d*)?)$/gi);
  return patt.test(str);
}

function Calculator() {
  this.nodeDictionary = {};
  this.roots = [];
}

Calculator.prototype.compute = function() {
  for (var idx in this.roots) {
    this.roots[idx].compute();
  }
  this.roots = [];
}

Calculator.prototype.addNode = function(node) {

  this.nodeDictionary[node.getName()] = node;
}

Calculator.prototype.getNode = function(name) {
  return this.nodeDictionary[name];
}

Calculator.prototype.addRoot = function(node) {
  return this.roots.push(node);
}



function getUtilities(zipcode) {
  var utilityArray = 
  [
      [98001,"PSE","","","",""  ],
      [98002,"PSE","","","",""  ],
      [98003,"PSE","Milton","","",""  ],
      [98004,"PSE","","","",""  ],
      [98005,"PSE","","","",""  ],
      [98006,"PSE","","","",""  ],
      [98007,"PSE","","","",""  ],
      [98008,"PSE","","","",""  ],
      [98009,"PSE","","","",""  ],
      [98010,"PSE","","","",""  ],
      [98011,"PSE","","","",""  ],
      [98012,"Sno","","","",""  ],
      [98014,"PSE","Tanner","","",""  ],
      [98019,"PSE","","","",""  ],
      [98020,"Sno","","","",""  ],
      [98021,"Sno","","","",""  ],
      [98022,"PSE","","","",""  ],
      [98023,"PSE","Tacoma","","",""  ],
      [98024,"PSE","Tanner","","",""  ],
      [98026,"Sno","","","",""  ],
      [98027,"PSE","","","",""  ],
      [98028,"PSE","","","",""  ],
      [98029,"PSE","","","",""  ],
      [98030,"PSE","","","",""  ],
      [98031,"PSE","","","",""  ],
      [98032,"PSE","","","",""  ],
      [98033,"PSE","","","",""  ],
      [98034,"PSE","","","",""  ],
      [98035,"PSE","","","",""  ],
      [98036,"Sno","","","",""  ],
      [98037,"Sno","","","",""  ],
      [98038,"PSE","","","",""  ],
      [98039,"PSE","","","",""  ],
      [98040,"PSE","","","",""  ],
      [98041,"PSE","","","",""  ],
      [98042,"PSE","","","",""  ],
      [98043,"Sno","","","",""  ],
      [98045,"PSE","Tanner","","",""  ],
      [98046,"Sno","","","",""  ],
      [98047,"PSE","","","",""  ],
      [98050,"PSE","","","",""  ],
      [98051,"PSE","","","",""  ],
      [98052,"PSE","Sno","","",""  ],
      [98053,"PSE","Tanner","","",""  ],
      [98055,"PSE","","","",""  ],
      [98056,"PSE","","","",""  ],
      [98057,"PSE","SCL","","",""  ],
      [98058,"PSE","","","",""  ],
      [98059,"PSE","","","",""  ],
      [98065,"PSE","Tanner","","",""  ],
      [98068,"PSE","","","",""  ],
      [98070,"PSE","","","",""  ],
      [98072,"PSE","Sno","","",""  ],
      [98074,"PSE","Tanner","","",""  ],
      [98075,"PSE","","","",""  ],
      [98077,"PSE","Sno","","",""  ],
      [98087,"Sno","","","",""  ],
      [98092,"PSE","","","",""  ],
      [98101,"SCL","","","",""  ],
      [98102,"SCL","","","",""  ],
      [98103,"SCL","","","",""  ],
      [98104,"SCL","","","",""  ],
      [98105,"SCL","","","",""  ],
      [98106,"SCL","","","",""  ],
      [98107,"SCL","","","",""  ],
      [98108,"SCL","","","",""  ],
      [98109,"SCL","","","",""  ],
      [98110,"PSE","","","",""  ],
      [98112,"SCL","","","",""  ],
      [98115,"SCL","","","",""  ],
      [98116,"SCL","","","",""  ],
      [98117,"SCL","","","",""  ],
      [98118,"SCL","","","",""  ],
      [98119,"SCL","","","",""  ],
      [98121,"SCL","","","",""  ],
      [98122,"SCL","","","",""  ],
      [98125,"SCL","","","",""  ],
      [98126,"SCL","","","",""  ],
      [98129,"SCL","","","",""  ],
      [98131,"SCL","","","",""  ],
      [98132,"SCL","","","",""  ],
      [98133,"SCL","","","",""  ],
      [98134,"SCL","","","",""  ],
      [98136,"SCL","","","",""  ],
      [98144,"SCL","","","",""  ],
      [98146,"SCL","","","",""  ],
      [98148,"PSE","SCL","","",""  ],
      [98154,"SCL","","","",""  ],
      [98155,"SCL","","","",""  ],
      [98160,"SCL","","","",""  ],
      [98161,"SCL","","","",""  ],
      [98164,"SCL","","","",""  ],
      [98166,"PSE","SCL","","",""  ],
      [98168,"SCL","","","",""  ],
      [98171,"SCL","","","",""  ],
      [98174,"SCL","","","",""  ],
      [98177,"SCL","","","",""  ],
      [98178,"SCL","","","",""  ],
      [98188,"PSE","SCL","","",""  ],
      [98195,"SCL","","","",""  ],
      [98198,"PSE","","","",""  ],
      [98199,"SCL","","","",""  ],
      [98201,"Sno","","","",""  ],
      [98203,"Sno","","","",""  ],
      [98204,"Sno","","","",""  ],
      [98205,"Sno","","","",""  ],
      [98207,"Sno","","","",""  ],
      [98208,"Sno","","","",""  ],
      [98220,"PSE","","","",""  ],
      [98221,"PSE","","","",""  ],
      [98222,"Opalco","","","",""  ],
      [98223,"Sno","","","",""  ],
      [98224,"PSE","","","",""  ],
      [98225,"PSE","","","",""  ],
      [98226,"PSE","","","",""  ],
      [98229,"PSE","","","",""  ],
      [98230,"Blaine","PSE","","",""  ],
      [98232,"PSE","","","",""  ],
      [98233,"PSE","","","",""  ],
      [98235,"PSE","","","",""  ],
      [98236,"PSE","","","",""  ],
      [98237,"PSE","","","",""  ],
      [98238,"PSE","","","",""  ],
      [98239,"PSE","","","",""  ],
      [98240,"PSE","","","",""  ],
      [98241,"Sno","PSE","","",""  ],
      [98243,"Opalco","","","",""  ],
      [98244,"PSE","","","",""  ],
      [98245,"Opalco","","","",""  ],
      [98247,"PSE","","","",""  ],
      [98248,"PSE","Whatcom","","",""  ],
      [98249,"PSE","","","",""  ],
      [98250,"Opalco","","","",""  ],
      [98251,"PSE","Sno","","",""  ],
      [98252,"Sno","","","",""  ],
      [98253,"PSE","","","",""  ],
      [98255,"PSE","","","",""  ],
      [98256,"Sno","","","",""  ],
      [98257,"PSE","","","",""  ],
      [98258,"Sno","","","",""  ],
      [98260,"PSE","","","",""  ],
      [98261,"Opalco","","","",""  ],
      [98262,"PSE","","","",""  ],
      [98263,"PSE","","","",""  ],
      [98264,"PSE","","","",""  ],
      [98266,"PSE","","","",""  ],
      [98267,"PSE","","","",""  ],
      [98270,"Sno","","","",""  ],
      [98271,"Sno","","","",""  ],
      [98272,"Sno","","","",""  ],
      [98273,"PSE","","","",""  ],
      [98274,"PSE","","","",""  ],
      [98275,"Sno","","","",""  ],
      [98276,"PSE","","","",""  ],
      [98277,"PSE","","","",""  ],
      [98278,"PSE","","","",""  ],
      [98279,"Opalco","","","",""  ],
      [98280,"Opalco","","","",""  ],
      [98281,"PSE","","","",""  ],
      [98282,"Sno","","","",""  ],
      [98283,"PSE","","","",""  ],
      [98284,"PSE","","","",""  ],
      [98286,"Opalco","","","",""  ],
      [98287,"Sno","","","",""  ],
      [98288,"PSE","","","",""  ],
      [98290,"Sno","","","",""  ],
      [98292,"Sno","PSE","","",""  ],
      [98294,"Sno","","","",""  ],
      [98295,"Sumas","PSE","","",""  ],
      [98296,"Sno","","","",""  ],
      [98297,"Opalco","","","",""  ],
      [98303,"Tanner","","","",""  ],
      [98304,"Lewis","PSE","","",""  ],
      [98305,"Clallam","","","",""  ],
      [98310,"PSE","","","",""  ],
      [98311,"PSE","","","",""  ],
      [98312,"PSE","Mason3","","",""  ],
      [98314,"PSE","","","",""  ],
      [98315,"PSE","","","",""  ],
      [98320,"Mason3","Mason1","Jefferson","",""  ],
      [98321,"PSE","","","",""  ],
      [98323,"PSE","","","",""  ],
      [98325,"Jefferson","","","",""  ],
      [98326,"Clallam","","","",""  ],
      [98327,"PSE","","","",""  ],
      [98328,"Tacoma","PSE","Ohop","Alder","Eaton"  ],
      [98329,"Peninsula","PSE","","",""  ],
      [98330,"PSE","Lewis","","",""  ],
      [98331,"Clallam","Grays","Jefferson","",""  ],
      [98332,"Peninsula","","","",""  ],
      [98333,"Peninsula","","","",""  ],
      [98335,"Peninsula","","","",""  ],
      [98336,"Lewis","","","",""  ],
      [98337,"PSE","","","",""  ],
      [98338,"Tacoma","PSE","Ohop","",""  ],
      [98339,"PSE","Jefferson","","",""  ],
      [98340,"PSE","","","",""  ],
      [98342,"PSE","","","",""  ],
      [98345,"PSE","","","",""  ],
      [98346,"PSE","","","",""  ],
      [98349,"Peninsula","","","",""  ],
      [98350,"Clallam","","","",""  ],
      [98351,"Peninsula","","","",""  ],
      [98353,"PSE","","","",""  ],
      [98354,"Milton","","","",""  ],
      [98355,"Lewis","","","",""  ],
      [98356,"Lewis","","","",""  ],
      [98357,"Clallam","","","",""  ],
      [98358,"PSE","Jefferson","","",""  ],
      [98359,"PSE","","","",""  ],
      [98360,"PSE","Tacoma","","",""  ],
      [98361,"Lewis","","","",""  ],
      [98362,"Clallam","PortAng","","",""  ],
      [98363,"Clallam","PortAng","","",""  ],
      [98364,"PSE","","","",""  ],
      [98365,"PSE","Jefferson","","",""  ],
      [98366,"PSE","","","",""  ],
      [98367,"PSE","Mason3","","",""  ],
      [98368,"PSE","Jefferson","","",""  ],
      [98370,"PSE","","","",""  ],
      [98371,"Tacoma","PSE","Milton","",""  ],
      [98372,"PSE","","","",""  ],
      [98373,"Tacoma","PSE","Elmhurst","",""  ],
      [98374,"Tacoma","PSE","","",""  ],
      [98375,"Tacoma","PSE","Elmhurst","",""  ],
      [98376,"PSE","Jefferson","","",""  ],
      [98377,"Lewis","","","",""  ],
      [98380,"PSE","Mason3","","",""  ],
      [98381,"Clallam","","","",""  ],
      [98382,"Clallam","Jefferson","","",""  ],
      [98383,"PSE","","","",""  ],
      [98385,"PSE","","","",""  ],
      [98387,"Tacoma","PSE","Ohop","Elmhurst",""  ],
      [98388,"Steilacoom","Tacoma","PSE","",""  ],
      [98390,"PSE","","","",""  ],
      [98391,"PSE","","","",""  ],
      [98392,"PSE","","","",""  ],
      [98393,"PSE","","","",""  ],
      [98394,"Peninsula","","","",""  ],
      [98396,"PSE","","","",""  ],
      [98402,"Tacoma","","","",""  ],
      [98403,"Tacoma","","","",""  ],
      [98404,"Tacoma","","","",""  ],
      [98405,"Tacoma","","","",""  ],
      [98406,"Tacoma","","","",""  ],
      [98407,"Tacoma","Ruston","","",""  ],
      [98408,"Tacoma","","","",""  ],
      [98409,"Tacoma","","","",""  ],
      [98413,"Tacoma","","","",""  ],
      [98416,"Tacoma","","","",""  ],
      [98418,"Tacoma","","","",""  ],
      [98421,"Tacoma","","","",""  ],
      [98422,"Tacoma","Milton","","",""  ],
      [98424,"Tacoma","PSE","Milton","",""  ],
      [98430,"PSE","","","",""  ],
      [98433,"Tacoma","PSE","","",""  ],
      [98438,"Tacoma","PSE","","",""  ],
      [98439,"PSE","","","",""  ],
      [98442,"Tacoma","","","",""  ],
      [98443,"Tacoma","","","",""  ],
      [98444,"Tacoma","PSE","Parkland","Elmhurst","Lakeview"  ],
      [98445,"Tacoma","PSE","Parkland","Elmhurst",""  ],
      [98446,"Tacoma","PSE","Elmhurst","",""  ],
      [98447,"Parkland","","","",""  ],
      [98465,"Tacoma","","","",""  ],
      [98466,"Tacoma","","","",""  ],
      [98467,"Tacoma","Lakeview","","",""  ],
      [98492,"Tacoma","","","",""  ],
      [98498,"Tacoma","PSE","Lakeview","Steilacoom",""  ],
      [98499,"Tacoma","PSE","Lakeview","",""  ],
      [98501,"PSE","","","",""  ],
      [98502,"PSE","Mason3","Grays","",""  ],
      [98503,"PSE","","","",""  ],
      [98506,"PSE","","","",""  ],
      [98512,"PSE","","","",""  ],
      [98513,"PSE","","","",""  ],
      [98516,"PSE","","","",""  ],
      [98520,"Grays","","","",""  ],
      [98524,"Mason3","","","",""  ],
      [98526,"Grays","","","",""  ],
      [98527,"PacificPUD","","","",""  ],
      [98528,"Mason3","Peninsula","","",""  ],
      [98530,"PSE","","","",""  ],
      [98531,"Lewis","Centralia","PSE","",""  ],
      [98532,"Lewis","PacificPUD","Centralia","",""  ],
      [98533,"Lewis","","","",""  ],
      [98535,"Grays","","","",""  ],
      [98536,"Grays","","","",""  ],
      [98537,"Grays","PacificPUD","Lewis","",""  ],
      [98538,"Lewis","","","",""  ],
      [98541,"Mason3","Grays","","",""  ],
      [98542,"Lewis","","","",""  ],
      [98544,"Lewis","","","",""  ],
      [98546,"Mason1","Mason3","","",""  ],
      [98547,"Grays","PacificPUD","","",""  ],
      [98548,"Mason1","Mason3","","",""  ],
      [98550,"Grays","","","",""  ],
      [98552,"Grays","","","",""  ],
      [98555,"Mason1","Mason3","","",""  ],
      [98557,"McCleary","Grays","","",""  ],
      [98558,"PSE","","","",""  ],
      [98559,"Grays","","","",""  ],
      [98560,"Mason3","Grays","","",""  ],
      [98562,"Grays","","","",""  ],
      [98563,"Grays","Mason3","","",""  ],
      [98564,"Lewis","Cowlitz","","",""  ],
      [98565,"Lewis","","","",""  ],
      [98568,"Grays","Lewis","PacificPUD","",""  ],
      [98569,"Grays","","","",""  ],
      [98570,"Lewis","","","",""  ],
      [98571,"Grays","","","",""  ],
      [98572,"Lewis","PacificPUD","Cowlitz","Wah",""  ],
      [98575,"Grays","Mason3","","",""  ],
      [98576,"PSE","","","",""  ],
      [98577,"PacificPUD","Lewis","Grays","",""  ],
      [98579,"PSE","Lewis","Grays","",""  ],
      [98580,"PSE","Tacoma","Parkland","Ohop","Elmhurst"  ],
      [98581,"Cowlitz","Lewis","Wah","",""  ],
      [98582,"Lewis","","","",""  ],
      [98583,"Grays","","","",""  ],
      [98584,"Mason1","Mason3","Grays","",""  ],
      [98585,"Lewis","","","",""  ],
      [98586,"PacificPUD","","","",""  ],
      [98587,"Grays","","","",""  ],
      [98588,"Mason3","Mason1","","",""  ],
      [98589,"PSE","","","",""  ],
      [98590,"Grays","PacificPUD","","",""  ],
      [98591,"Lewis","","","",""  ],
      [98592,"Mason1","Mason3","","",""  ],
      [98593,"Lewis","","","",""  ],
      [98595,"Grays","Cowlitz","","",""  ],
      [98596,"Lewis","","","",""  ],
      [98597,"PSE","Cowlitz","Tacoma","Lewis","Alder"  ],
      [98601,"Clark","Cowlitz","","",""  ],
      [98602,"Klick","","","",""  ],
      [98603,"Cowlitz","Clark","","",""  ],
      [98604,"Clark","","","",""  ],
      [98605,"Skam","Klick","","",""  ],
      [98606,"Clark","","","",""  ],
      [98607,"Clark","","","",""  ],
      [98609,"Cowlitz","","","",""  ],
      [98610,"Skam","","","",""  ],
      [98611,"Cowlitz","Lewis","","",""  ],
      [98612,"Wah","Cowlitz","","",""  ],
      [98613,"Klick","Skam","BREA","PacifiCorp",""  ],
      [98614,"PacificPUD","","","",""  ],
      [98616,"Cowlitz","Skam","Clark","",""  ],
      [98617,"Klick","","","",""  ],
      [98619,"Klick","Yakama","","",""  ],
      [98620,"Klick","","","",""  ],
      [98621,"Wah","","","",""  ],
      [98622,"Clark","PacificPUD","","",""  ],
      [98624,"PacificPUD","","","",""  ],
      [98625,"Cowlitz","","","",""  ],
      [98626,"Cowlitz","","","",""  ],
      [98628,"Klick","","","",""  ],
      [98629,"Clark","","","",""  ],
      [98631,"PacificPUD","","","",""  ],
      [98632,"Cowlitz","Wah","","",""  ],
      [98635,"Klick","","","",""  ],
      [98638,"Wah","PacificPUD","","",""  ],
      [98639,"Skam","","","",""  ],
      [98640,"PacificPUD","","","",""  ],
      [98641,"PacificPUD","","","",""  ],
      [98642,"Clark","Cowlitz","","",""  ],
      [98643,"Wah","","","",""  ],
      [98644,"PacificPUD","","","",""  ],
      [98645,"Cowlitz","","","",""  ],
      [98647,"Wah","","","",""  ],
      [98648,"Skam","Cowlitz","Lewis","Klick","Clark"  ],
      [98649,"Cowlitz","Lewis","Skam","",""  ],
      [98650,"Klick","Yakama","","",""  ],
      [98651,"Skam","Klick","","",""  ],
      [98660,"Clark","","","",""  ],
      [98661,"Clark","","","",""  ],
      [98662,"Clark","","","",""  ],
      [98663,"Clark","","","",""  ],
      [98664,"Clark","","","",""  ],
      [98665,"Clark","","","",""  ],
      [98666,"Clark","","","",""  ],
      [98668,"Clark","","","",""  ],
      [98670,"Klick","","","",""  ],
      [98671,"Clark","Skam","","",""  ],
      [98672,"Klick","Skam","","",""  ],
      [98673,"Klick","","","",""  ],
      [98674,"Cowlitz","Clark","","",""  ],
      [98675,"Clark","Skam","","",""  ],
      [98682,"Clark","","","",""  ],
      [98683,"Clark","","","",""  ],
      [98684,"Clark","","","",""  ],
      [98685,"Clark","","","",""  ],
      [98686,"Clark","","","",""  ],
      [98687,"Clark","","","",""  ],
      [98801,"Chelan","Kitti","","",""  ],
      [98802,"Douglas","Chelan","","",""  ],
      [98807,"Chelan","","","",""  ],
      [98811,"Chelan","","","",""  ],
      [98812,"OkanoganPUD","Douglas","OCEC","",""  ],
      [98813,"Douglas","OkanoganPUD","Chelan","",""  ],
      [98814,"OkanoganPUD","OCEC","Chelan","",""  ],
      [98815,"Chelan","","","",""  ],
      [98816,"Chelan","OkanoganPUD","Douglas","",""  ],
      [98817,"Chelan","","","",""  ],
      [98819,"OkanoganPUD","","","",""  ],
      [98821,"Chelan","","","",""  ],
      [98822,"Chelan","Douglas","","",""  ],
      [98823,"Grant","","","",""  ],
      [98824,"Grant","","","",""  ],
      [98826,"Chelan","Sno","","",""  ],
      [98827,"OkanoganPUD","","","",""  ],
      [98828,"Chelan","Chelan","Kitti","",""  ],
      [98829,"OkanoganPUD","OCEC","","",""  ],
      [98830,"Douglas","Grant","OkanoganPUD","Nespelum","CouleeDam"  ],
      [98831,"Chelan","OkanoganPUD","","",""  ],
      [98832,"Grant","Avista","Inland","BigBend",""  ],
      [98833,"OkanoganPUD","OCEC","","",""  ],
      [98834,"OkanoganPUD","Douglas","Chelan","",""  ],
      [98836,"Chelan","","","",""  ],
      [98837,"Grant","","","",""  ],
      [98840,"OkanoganPUD","Nespelum","","",""  ],
      [98841,"OkanoganPUD","Nespelum","","",""  ],
      [98843,"Douglas","Chelan","","",""  ],
      [98844,"OkanoganPUD","Chelan","","",""  ],
      [98845,"Douglas","Grant","","",""  ],
      [98846,"OkanoganPUD","","","",""  ],
      [98847,"Chelan","Kitti","","",""  ],
      [98848,"Grant","Douglas","Kitti","",""  ],
      [98849,"OkanoganPUD","OCEC","","",""  ],
      [98850,"Douglas","Grant","Chelan","Kitti",""  ],
      [98851,"Grant","Douglas","","",""  ],
      [98852,"Chelan","Sno","OkanoganPUD","OCEC",""  ],
      [98853,"Grant","","","",""  ],
      [98855,"OkanoganPUD","Nespelum","","",""  ],
      [98856,"OkanoganPUD","OCEC","Chelan","",""  ],
      [98857,"Grant","Avista","BigBend","",""  ],
      [98858,"Douglas","Grant","","",""  ],
      [98859,"OkanoganPUD","","","",""  ],
      [98860,"Grant","","","",""  ],
      [98862,"OkanoganPUD","OCEC","","",""  ],
      [98901,"PacifiCorp","Kitti","","",""  ],
      [98902,"PacifiCorp","","","",""  ],
      [98903,"BREA","PacifiCorp","","",""  ],
      [98908,"PacifiCorp","","","",""  ],
      [98921,"BREA","PacifiCorp","","",""  ],
      [98922,"PSE","Kitti","Chelan","",""  ],
      [98923,"BREA","PacifiCorp","","",""  ],
      [98925,"PSE","","","",""  ],
      [98926,"Chelan","PSE","Kitti","Ellensburg",""  ],
      [98929,"PacifiCorp","","","",""  ],
      [98930,"BREA","PacifiCorp","","",""  ],
      [98932,"BREA","PacifiCorp","","",""  ],
      [98933,"BREA","PacifiCorp","Yakama","",""  ],
      [98934,"PSE","Kitti","","",""  ],
      [98935,"BREA","PacifiCorp","Klick","Yakama",""  ],
      [98936,"BREA","PacifiCorp","Grant","Benton",""  ],
      [98937,"PacifiCorp","Kitti","Lewis","",""  ],
      [98938,"BREA","PacifiCorp","","",""  ],
      [98939,"BREA","PacifiCorp","","",""  ],
      [98940,"PSE","","","",""  ],
      [98941,"PSE","Kitti","","",""  ],
      [98942,"PacifiCorp","","","",""  ],
      [98943,"PSE","Kitti","","",""  ],
      [98944,"Benton","BREA","PacifiCorp","",""  ],
      [98946,"PSE","Kitti","","",""  ],
      [98947,"PacifiCorp","","","",""  ],
      [98948,"BREA","PacifiCorp","Yakama","",""  ],
      [98950,"Klick","","","",""  ],
      [98951,"BREA","PacifiCorp","Yakama","",""  ],
      [98952,"BREA","PacifiCorp","Yakama","",""  ],
      [98953,"BREA","PacifiCorp","","",""  ],
      [99001,"Avista","Inland","","",""  ],
      [99003,"Avista","Inland","","",""  ],
      [99004,"Avista","Inland","Cheney","",""  ],
      [99005,"Avista","Inland","","",""  ],
      [99006,"Avista","Inland","PendO","",""  ],
      [99008,"Avista","Inland","","",""  ],
      [99009,"Inland","PendO","","",""  ],
      [99011,"Avista","","","",""  ],
      [99012,"Avista","Inland","","",""  ],
      [99013,"Avista","Inland","Ferry","",""  ],
      [99014,"Avista","Inland","","",""  ],
      [99016,"Avista","Inland","Vera","",""  ],
      [99017,"Avista","Inland","BigBend","",""  ],
      [99018,"Avista","Inland","","",""  ],
      [99019,"Avista","Inland","","",""  ],
      [99020,"Avista","Inland","","",""  ],
      [99021,"Avista","Inland","","",""  ],
      [99022,"Avista","Inland","","",""  ],
      [99023,"Avista","Inland","","",""  ],
      [99025,"Avista","Inland","","",""  ],
      [99026,"Avista","Inland","","",""  ],
      [99027,"Avista","Inland","","",""  ],
      [99029,"Avista","Inland","Ferry","",""  ],
      [99030,"Avista","Inland","","",""  ],
      [99031,"Avista","Inland","","",""  ],
      [99032,"Avista","Inland","BigBend","",""  ],
      [99033,"Avista","Inland","Clearwater","",""  ],
      [99034,"Avista","","","",""  ],
      [99036,"Avista","Inland","","",""  ],
      [99037,"Avista","Inland","Vera","",""  ],
      [99039,"Avista","Inland","","",""  ],
      [99040,"Avista","Ferry","","",""  ],
      [99101,"Avista","Ferry","","",""  ],
      [99102,"Avista","Inland","","",""  ],
      [99103,"Grant","Avista","Inland","",""  ],
      [99104,"Avista","Inland","Clearwater","",""  ],
      [99105,"Avista","BigBend","Inland","",""  ],
      [99107,"Avista","Ferry","PendO","",""  ],
      [99109,"Avista","Chewelah","Ferry","PendO",""  ],
      [99110,"Avista","Inland","","",""  ],
      [99111,"Avista","Inland","Clearwater","",""  ],
      [99113,"Avista","Inland","Clearwater","",""  ],
      [99114,"Avista","PendO","","",""  ],
      [99115,"Grant","Douglas","","",""  ],
      [99116,"CouleeDam","Douglas","Nespelum","OkanoganPUD",""  ],
      [99117,"Avista","Inland","Ferry","",""  ],
      [99118,"Ferry","OkanoganPUD","","",""  ],
      [99119,"PendO","","","",""  ],
      [99121,"Ferry","","","",""  ],
      [99122,"Avista","Inland","Ferry","",""  ],
      [99123,"Grant","Douglas","","",""  ],
      [99124,"Nespelum","","","",""  ],
      [99125,"Avista","Inland","BigBend","CREA",""  ],
      [99126,"Avista","","","",""  ],
      [99128,"Avista","Inland","Clearwater","",""  ],
      [99129,"Avista","Ferry","","",""  ],
      [99130,"Avista","Inland","Clearwater","",""  ],
      [99131,"Avista","Ferry","","",""  ],
      [99133,"Grant","Douglas","Nespelum","CouleeDam",""  ],
      [99134,"Avista","Inland","BigBend","CREA",""  ],
      [99135,"Grant","Douglas","","",""  ],
      [99136,"Avista","Inland","","",""  ],
      [99137,"Avista","Ferry","","",""  ],
      [99138,"Ferry","Avista","Nespelum","",""  ],
      [99139,"PendO","","","",""  ],
      [99140,"Ferry","Inland","Nespelum","",""  ],
      [99141,"Avista","PendO","","",""  ],
      [99143,"Avista","Inland","BigBend","CREA",""  ],
      [99144,"Avista","Inland","","",""  ],
      [99146,"Ferry","Avista","","",""  ],
      [99147,"Avista","Inland","","",""  ],
      [99148,"Avista","PendO","","",""  ],
      [99149,"Avista","Inland","Clearwater","",""  ],
      [99150,"Ferry","","","",""  ],
      [99151,"Avista","","","",""  ],
      [99152,"PendO","","","",""  ],
      [99153,"PendO","","","",""  ],
      [99154,"Avista","Inland","","",""  ],
      [99155,"OkanoganPUD","Nespelum","","",""  ],
      [99156,"PendO","Inland","Northern","",""  ],
      [99157,"Avista","PendO","","",""  ],
      [99158,"Avista","Inland","Clearwater","",""  ],
      [99159,"Avista","Inland","BigBend","Grant",""  ],
      [99160,"Avista","Ferry","","",""  ],
      [99161,"Avista","Inland","Clearwater","",""  ],
      [99163,"Avista","Inland","Clearwater","",""  ],
      [99164,"Avista","Inland","Clearwater","",""  ],
      [99166,"Ferry","Nespelum","OkanoganPUD","",""  ],
      [99167,"Avista","","","",""  ],
      [99169,"Avista","BigBend","Inland","Grant",""  ],
      [99170,"Avista","Inland","","",""  ],
      [99171,"Avista","Inland","","",""  ],
      [99173,"Avista","Ferry","","",""  ],
      [99174,"Avista","Inland","","",""  ],
      [99176,"Avista","Inland","Clearwater","",""  ],
      [99179,"Avista","Inland","Clearwater","",""  ],
      [99180,"PendO","","","",""  ],
      [99181,"Avista","Ferry","PendO","",""  ],
      [99185,"Avista","Inland","","",""  ],
      [99201,"Avista","","","",""  ],
      [99202,"Avista","Vera","","",""  ],
      [99203,"Avista","","","",""  ],
      [99204,"Avista","","","",""  ],
      [99205,"Avista","","","",""  ],
      [99206,"Avista","Inland","MEWCO","Vera",""  ],
      [99207,"Avista","","","",""  ],
      [99208,"Avista","Inland","","",""  ],
      [99212,"Avista","MEWCO","Vera","Inland",""  ],
      [99216,"Avista","MEWCO","Vera","",""  ],
      [99217,"Avista","Inland","","",""  ],
      [99218,"Avista","Inland","","",""  ],
      [99219,"Avista","Inland","","",""  ],
      [99223,"Avista","Inland","Vera","",""  ],
      [99224,"Avista","Inland","","",""  ],
      [99301,"BigBend","Franklin","","",""  ],
      [99320,"Benton","BREA","","",""  ],
      [99321,"Grant","","","",""  ],
      [99322,"Klick","","","",""  ],
      [99323,"CREA","PacifiCorp","","",""  ],
      [99324,"CREA","PacifiCorp","","",""  ],
      [99326,"BigBend","Franklin","Avista","",""  ],
      [99328,"CREA","PacifiCorp","","",""  ],
      [99329,"CREA","PacifiCorp","","",""  ],
      [99330,"BigBend","Franklin","","",""  ],
      [99333,"Avista","Inland","","",""  ],
      [99335,"BigBend","Franklin","","",""  ],
      [99336,"Benton","BREA","","",""  ],
      [99337,"Benton","BREA","","",""  ],
      [99338,"Benton","BREA","","",""  ],
      [99341,"Avista","BigBend","Grant","",""  ],
      [99343,"BigBend","Franklin","","",""  ],
      [99344,"Avista","BigBend","Grant","CREA","Franklin"  ],
      [99345,"Benton","BREA","","",""  ],
      [99346,"Benton","BREA","","",""  ],
      [99347,"CREA","Inland","PacifiCorp","Avista",""  ],
      [99348,"CREA","PacifiCorp","","",""  ],
      [99349,"Grant","Franklin","Kitti","",""  ],
      [99350,"Benton","BREA","Klick","",""  ],
      [99352,"Benton","BREA","Richland","",""  ],
      [99353,"Benton","BREA","Richland","",""  ],
      [99354,"Benton","BREA","Richland","",""  ],
      [99356,"Klick","","","",""  ],
      [99357,"Grant","","","",""  ],
      [99359,"Avista","CREA","BigBend","Inland",""  ],
      [99360,"CREA","PacifiCorp","","",""  ],
      [99361,"CREA","PacifiCorp","","",""  ],
      [99362,"CREA","PacifiCorp","","",""  ],
      [99363,"CREA","PacifiCorp","","",""  ],
      [99371,"Avista","BigBend","CREA","Inland",""  ],
      [99401,"Clearwater","Avista","","",""  ],
      [99402,"Clearwater","Avista","Inland","Asotin",""  ],
      [99403,"Avista","Clearwater","Inland","Asotin",""  ],
    ];


  for (var i = 0; i < utilityArray.length; i++) {
    if (utilityArray[i][0] == zipcode) {
      return (new Array(utilityArray[i][1], utilityArray[i][2], utilityArray[i][3], utilityArray[i][4], utilityArray[i][5]));
    }
  }

  return 0;
}

function getUtilityStats(utility) {
  var utilityArray = 
  [
    ["PSE","Puget Sound Energy",1  ],
    ["Avista","Avista Corp",0.83  ],
    ["PacifiCorp","Pacific Power and Light",1.13  ],
    ["SCL","Seattle City Light",0.02  ],
    ["Sno","PUD No 1 of Snohomish County",0.08  ],
    ["Cowlitz","PUD No 1 of Cowlitz County",0.07  ],
    ["Tacoma","Tacoma Power",0.07  ],
    ["Clark","PUD No 1 of Clark County",0.21  ],
    ["Grant","PUD No 2 of Grant County",0.37  ],
    ["Benton","PUD No 1 of Benton County",0.17  ],
    ["Chelan","PUD No 1 of Chelan County",0.18  ],
    ["Grays","PUD No 1 of Grays Harbor County",0.05  ],
    ["Franklin","PUD No 1 of Franklin County",0.14  ],
    ["PendO","PUD No 1 of Pend Oreille County",0.01  ],
    ["Lewis","PUD No 1 of Lewis County",0.1  ],
    ["Inland","Inland Power & Light Co",0.06  ],
    ["Richland","City of Richland",0.07  ],
    ["PortAng","City of Port Angeles",0.05  ],
    ["Douglas","PUD No 1 of Douglas County",0  ],
    ["Mason3","PUD No 3 of Mason County",0.05  ],
    ["Clallam","PUD No 1 of Clallam County",0.05  ],
    ["OkanoganPUD","PUD No 1 of Okanogan County",0.09  ],
    ["Peninsula","Peninsula Light Co",0.06  ],
    ["BREA","Benton Rural Electric Assoc",0.07  ],
    ["BigBend","Big Bend Electric Coop",0.06  ],
    ["Klick","PUD No 1 of Klickitat County",0.11  ],
    ["CREA","Columbia Rural Electric Assoc",0.12  ],
    ["PacificPUD","PUD No 2 of Pacific County",0.08  ],
    ["Centralia","City of Centralia",0.05  ],
    ["Elmhurst","Elmhurst Mutual Power & Light Co",0.05  ],
    ["Lakeview","Lakeview Light & Power",0.05  ],
    ["Vera","Vera Water & Power",0.09  ],
    ["MEWCO","Modern Electric Water Co",0.05  ],
    ["Opalco","Orcas Power & Light Coop",0.05  ],
    ["Ellensburg","City of Ellensburg",0.05  ],
    ["Whatcom","PUD No 1 of Whatcom County",0.05  ],
    ["Cheney","City of Cheney",0.07  ],
    ["Skam","PUD No 1 of Skamania County",0.05  ],
    ["Parkland","Parkland Light & Water Co",0.05  ],
    ["Ferry","PUD No 1 of Ferry County",0.05  ],
    ["Kitti","PUD No 1 of Kittitas County",0.05  ],
    ["Tanner","Tanner Electric Coop",0.05  ],
    ["Jefferson","Jefferson County PUD",0.05  ],
    ["Ohop","Ohop Mutual Light Co",0.05  ],
    ["Blaine","City of Blaine",0.05  ],
    ["Mason1","PUD No 1 of Mason County",0.05  ],
    ["Milton","City of Milton",0.05  ],
    ["OCEC","Okanogan County Electric Coop",0.05  ],
    ["Nespelum","Nespelem Valley Electric Coop",0.05  ],
    ["Wah","PUD No 1 of Wahkiakum County",0.05  ],
    ["Steilacoom","Town of Steilacoom",0.05  ],
    ["McCleary","McCleary Light & Power",0.05  ],
    ["Sumas","City of Sumas",0.05  ],
    ["Eaton","Town of Eatonville",0.05  ],
    ["Chewelah","Chewelah Light Dept",0.05  ],
    ["CouleeDam","Coulee Dam Light Dept",0.05  ],
    ["Clearwater","Clearwater Power Co",0.05  ],
    ["Ruston","Ruston Electric Utility",0.07  ],
    ["Alder","Alder Mutual Light Co",0.05  ],
    ["Northern","Northern Lights, Inc",0.05  ],
    ["Asotin","PUD No 1 of Asotin County",0.05  ]
  ];

  for (var i = 0; i < utilityArray.length; i++) {
    if (utilityArray[i][0] == utility) {
      return (new Array(utilityArray[i][1], utilityArray[i][2]));
    }
  }

}
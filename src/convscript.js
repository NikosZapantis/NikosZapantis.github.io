function selectConversion() {
    var type = document.getElementById("unit-type").value;
    var options;

    //Options declaration so every time user select the specific category to show only this category's options
    if(type === "storage") {
        options = ["Bytes", "Kilobytes", "Megabytes", "Gigabytes", "Terabytes"];
        document.getElementById("InputA").type = "number";
    }else if(type === "number") {
        options = ["Binary", "Decimal", "Octal", "Hexadecimal"];
        document.getElementById("InputA").type = "text";
    }else if(type === "temperature") {
        options = ["Celsius", "Fahrenheit", "Kelvin"];
        document.getElementById("InputA").type = "number";
    }else if(type === "currency") {
        options = ["Euro", "USD", "Bitcoin", "Czech koruna", "Albanian Lek", "Russian ruble"];
        document.getElementById("InputA").type = "number";
    }else {
        options = [];
        document.getElementById("InputA").type = "text";
    }

    //Creating 2 elements for the user to choose the starting unit and the unit he wants the amount to be converted to
    var select1 = document.createElement("select");
    select1.id = "unit1";
    var select2 = document.createElement("select");
    select2.id = "unit2";

    //Creating options for specific type that has been selected
    for(var i = 0; i < options.length; i++) {
        
        var option1 = document.createElement("option");
        option1.value = options[i];
        option1.text = options[i];
        option1.id = "storageUnit";

        var option2 = document.createElement("option");
        option2.value = options[i];
        option2.text = options[i];
        option2.id = "numberUnit";

        select1.add(option1);
        select2.add(option2);
    }

    //passing with innerHtml the elements at the page
    var div = document.getElementById("conversion-options");
    div.innerHTML = "";
    div.appendChild(select1);
    div.innerHTML += " to ";
    div.appendChild(select2);

    resetInputs();
}

function resetInputs() {

    document.getElementById("InputA").value = "";
    document.getElementById("Output").value = "";
}

//?DONE todo: every time user change the unit1 or unit2 both input and output has to get ""
function validateInput() {
    var type = document.getElementById("unit-type").value;
    var unit1 = document.getElementById("unit1").value;
    var InputA = document.getElementById("InputA").value;

    // Only allow 0-1 if unit1 is Binary
    if(type === "number" && unit1 === "Binary") {
        var regex = /^[01]*$/i;

        if(!regex.test(InputA)) {

            // If input is invalid, remove non 0-1 characters
            InputA = InputA.replace(/[^01]/ig, '');
            document.getElementById("InputA").value = InputA;
        }
    }else if(type === "number" && unit1 === "Octal") { // Only allow 0-7 if unit1 is Octal
        var regex = /^[0-7]*$/i;

        if(!regex.test(InputA)) {

            // If input is invalid, remove non 0-7 characters
            InputA = InputA.replace(/[^0-7]/ig, '');
            document.getElementById("InputA").value = InputA;
        }
    }

    // Only allow A-F and numbers 0-9 if unit1 is Hexademical
    if(type === "number" && unit1 === "Hexadecimal") {
        var regex = /^[0-9A-F.]*$/i;

        if(!regex.test(InputA)) {

            // If input is invalid, remove non A-F characters
            InputA = InputA.replace(/[^0-9A-F]/ig, '');
            document.getElementById("InputA").value = InputA;
        }
    } else {

        // If unit1 is not Hexademical, I remove all non-numeric characters except from . (floating point)
        InputA = InputA.replace(/[^0-9.]/g, '');
        document.getElementById("InputA").value = InputA;
    }
}

//?DONE todo: Add temperature and currency conversion
function convert() {
    var type = document.getElementById("unit-type").value;
    var unit1 = document.getElementById("unit1").value;
    var unit2 = document.getElementById("unit2").value;
    var InputA = document.getElementById("InputA").value;
    var Output = document.getElementById("Output");

    document.getElementById("InputA").addEventListener("keypress", function(e) {
        var type = document.getElementById("unit-type").value;
        var unit1 = document.getElementById("unit1").value;
        
        if(type === "number" || (type === "storage" && unit1 !== "Hexadecimal")) {
            return true;
        }
    
        if(e.key.match(/[^0-9ABCDEF]/i)) {
            e.preventDefault();
        }
    });

    if(type === "storage") {

        //adjusting ratios so the conversions done in seconds
        var ratios = {
            "Bytes": 1,
            "Kilobytes": 1024,
            "Megabytes": 1048576,
            "Gigabytes": 1073741824,
            "Terabytes": 1099511627776
        };

        var ratio1 = ratios[unit1];
        var ratio2 = ratios[unit2];
        
        var currentRes = (InputA * ratio1 / ratio2);

        if(Number.isInteger(currentRes)) {

            Output.value = currentRes.toString() + "  " + unit2;
        }else {

            Output.value = currentRes.toFixed(1) + "  " + unit2;
        }
    }else if(type === "number") {

        //adjusting ratios so the conversions done in seconds
        var radixes = {
            "Binary": 2, 
            "Decimal": 10,
            "Octal": 8,
            "Hexadecimal": 16
        };

        var radix1 = radixes[unit1];
        var radix2 = radixes[unit2];

        if(radix1 === 10) {
             
            Output.value = parseInt(InputA).toString(radix2);
        }else if(radix2 === 10) {

            Output.value = parseInt(InputA, radix1).toString(10);
        }else { 

            Output.value = parseInt(InputA, radix1).toString(radix2);
        }
    }else if(type === "temperature") {

        var InputA = parseInt(document.getElementById("InputA").value);
        const conversionFormulas = [
            {unit1: "Celsius", unit2: "Celsius", formula: (c) => c} ,
            {unit1: "Celsius", unit2: "Fahrenheit", formula: (c) => c * 1.8 + 32} ,
            {unit1: "Celsius", unit2: "Kelvin", formula: (c) => c + 273.15} , 
            {unit1: "Fahrenheit", unit2: "Fahrenheit", formula: (f) => f} ,
            {unit1: "Fahrenheit", unit2: "Celsius", formula: (f) => (f - 32) / 1.8} ,
            {unit1: "Fahrenheit", unit2: "Kelvin", formula: (f) => (f + 459.67) * (5/9)} ,
            {unit1: "Kelvin", unit2: "Kelvin", formula: (k) => k} ,
            {unit1: "Kelvin", unit2: "Celsius", formula: (k) => k - 273.15} ,
            {unit1: "Kelvin", unit2: "Fahrenheit", formula: (k) => k * 1.8 - 459.67}
        ]

        const formula = conversionFormulas.find(
            (f) => f.unit1 === unit1 && f.unit2 === unit2
        ).formula;
        
        const result = formula(InputA);
    
        Output.value = result.toFixed(2) + " " + unit2;
    }else if(type === "currency") {

        //?DONE todo: make a 2d array with all the exchange rate from unit1 to unit2's so in every conversion i can peek the specific exchange rate and just multiply the input
        const currencyRates = {
            "Euro": {"Euro": 1, "USD": 1.093, "Bitcoin": 0.000039, "Czech koruna": 23.51, "Albanian Lek": 112.79, "Russian ruble": 89.17} , 
            "USD": {"Euro": 0.91, "USD": 1, "Bitcoin": 0.000036, "Czech koruna": 21.38, "Albanian Lek": 102.59, "Russian ruble": 81.1} , 
            "Bitcoin": {"Euro": 25358.16, "USD": 27884.5, "Bitcoin": 1, "Czech koruna": 596201.28, "Albanian Lek": 2860587.2, "Russian ruble": 2261432.95} ,
            "Czech koruna": {"Euro": 0.043, "USD": 0.047, "Bitcoin": 0.0000017, "Czech koruna": 1, "Albanian Lek": 4.8, "Russian ruble": 3.79} , 
            "Albanian Lek": {"Euro": 0.0089, "USD": 0.0098, "Bitcoin": 0.000000357, "Czech koruna": 0.21, "Albanian Lek": 1, "Russian ruble": 0.79} ,
            "Russian ruble": {"Euro": 0.011, "USD": 0.012, "Bitcoin": 0.000000442, "Czech koruna": 0.26, "Albanian Lek": 1.26, "Russian ruble": 1}
        }

        var rate1 = currencyRates[unit1][unit2];
        var result;

        result = InputA * rate1;

        Output.value = result.toFixed(2) + " " + unit2;
    }
}

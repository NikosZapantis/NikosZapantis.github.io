//Setting all option categories with their id's and input type in one container and in the selectConversion() function i choose the specific one
const conversionOptions = {
    //?Done todo: Add the conversion rates for exabytes-geopbytes at the convert() function
    storage: {options: ["Bytes", "Kilobytes", "Megabytes", "Gigabytes", "Terabytes", "Petabytes", "Exabytes", "Zettabytes", "Yottabytes", "Brontobytes", "Geopbytes"], inputType: "number", id: "secondOpts"} ,
    number: {options: ["Binary", "Decimal", "Octal", "Hexadecimal"], inputType: "text", id: "secondOpts"} ,
    temperature: {options: ["Celsius", "Fahrenheit", "Kelvin", "Rankine"], inputType: "number", id: "secondOpts"} ,
    time : {options: ["Decades", "Years", "Months", "Weeks", "Days", "Hours", "Minutes", "Seconds"], inputType: "number", id: "secondOpts"} ,
    //?DONE todo: Add all the new currencies in the options table
    currency: {options: ["Euro", "USD", "British Pound", "Bitcoin", "Czech koruna", "Albanian Lek", 
                        "Russian ruble", "Bulgarian Lev", "Turkish Lira", "Cypriot Pound"], inputType: "number", id: "secondOpts"}
}

//?DONE todo: Add rankine at temperature units and their conversion formulas
//?DONE todo: Add time conversion at the convert() function
function selectConversion() {
    const type = document.getElementById("unit-type").value;
    const {options, inputType} = conversionOptions[type] || {
        options: [],
        inputType: "text",
    };

    const inputA = document.getElementById("InputA");
    inputA.type = inputType;

    const select1 = document.createElement("select");
    select1.id = "unit1";
    const select2 = document.createElement("select");
    select2.id = "unit2";

    for (let i = 0; i < options.length; i++) {
        const option1 = document.createElement("option");
        option1.value = options[i];
        option1.textContent = options[i];
        option1.id = conversionOptions[type]?.id;

        const option2 = document.createElement("option");
        option2.value = options[i];
        option2.textContent = options[i];
        option2.id = conversionOptions[type]?.id;

        select1.add(option1);
        select2.add(option2);
    }

    const div = document.getElementById("conversion-options");
    div.textContent = "";
    div.appendChild(select1);
    div.appendChild(document.createTextNode(" to "));
    div.appendChild(select2);

    resetCurrentInputs();
}

//reseting input and output every time the selectConversion() function ends
function resetCurrentInputs() {
    const inputA = document.getElementById("InputA");
    const output = document.getElementById("Output");
  
    inputA.value = "";
    output.value = "";
}

//Validating the input for all the categories , such as binary can accept only 0 and 1 as input etc.
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

document.addEventListener("keydown", function(event) {
    var keyCode = event.keyCode;
    var keyValue = event.key;
    var validKeys = ["Enter", "Delete"/*, "Backspace"*/];
    
    if(validKeys.includes(keyValue)) {
        if(keyValue === "Enter") {
            convert();  
        }else if(keyValue === "Delete"/*Could be backspace too*/) {
            resetCurrentInputs();
        }
    }
});

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

        //adjusting ratios
        var ratios = 
            {"Bytes": 1, 
            "Kilobytes": 2 ** 10, 
            "Megabytes": 2 ** 20, 
            "Gigabytes": 2 ** 30, 
            "Terabytes": 2 ** 40, 
            "Petabytes": 2 ** 50,
            "Exabytes": 2 ** 60,
            "Zettabytes": 2 ** 70,
            "Yottabytes": 2 ** 80,
            "Brontobytes": 2 ** 90,
            "Geopbytes": 2 ** 100
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

        //adjusting ratios
        var radixes = 
            {"Binary": 2, 
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
    }else if(type === "time") {
        var InputA = parseInt(document.getElementById("InputA").value);
        //?DONE todo: Adjust the Tratios const to peek the specific ratios and then make the conversions
        const Tratios = 
            {"Decades": 10 * 365.25 * 24 * 60 * 60, 
            "Years": 365.25 * 24 * 60 * 60, 
            "Months": 30.44 * 24 * 60 * 60,
            "Weeks": 7 * 24 * 60 * 60, 
            "Days": 24 * 60 * 60, 
            "Hours": 60 * 60, 
            "Minutes": 60, 
            "Seconds": 1
        };
                    
        const inputInSeconds = InputA * Tratios[unit1];
        Output.value = inputInSeconds / Tratios[unit2] + " " + unit2;

    }else if(type === "temperature") {

        var InputA = parseInt(document.getElementById("InputA").value);
        //?DONE todo: Add the rankine unit formulas and adjust the other for rankine too.
        const conversionFormulas = [
            {unit1: "Celsius", unit2: "Celsius", formula: (c) => c} ,
            {unit1: "Celsius", unit2: "Fahrenheit", formula: (c) => c * 1.8 + 32} ,
            {unit1: "Celsius", unit2: "Kelvin", formula: (c) => c + 273.15} ,
            {unit1: "Celsius", unit2: "Rankine", formula: (c) => c * 1.8 + 491.67} , 
            {unit1: "Fahrenheit", unit2: "Fahrenheit", formula: (f) => f} ,
            {unit1: "Fahrenheit", unit2: "Celsius", formula: (f) => (f - 32) / 1.8} ,
            {unit1: "Fahrenheit", unit2: "Kelvin", formula: (f) => (f + 459.67) * (5/9)} ,
            {unit1: "Fahrenheit", unit2: "Rankine", formula: (f) => f + 459.67} ,
            {unit1: "Kelvin", unit2: "Kelvin", formula: (k) => k} ,
            {unit1: "Kelvin", unit2: "Celsius", formula: (k) => k - 273.15} ,
            {unit1: "Kelvin", unit2: "Fahrenheit", formula: (k) => k * 1.8 - 459.67} ,
            {unit1: "Kelvin", unit2: "Rankine", formula: (k) => k * 1.8} ,
            {unit1: "Rankine", unit2: "Rankine", formula: (r) => r} ,
            {unit1: "Rankine", unit2: "Celsius", formula: (r) => (r - 491.67) * (5/9)} ,
            {unit1: "Rankine", unit2: "Fahrenheit", formula: (r) => r - 459.67} ,
            {unit1: "Rankine", unit2: "Kelvin", formula: (r) => r * (5/9)}
        ]

        //Finding the specific formula that represents the conversion between unit1 and unit2 that the user just chose
        const formula = conversionFormulas.find(
            (f) => f.unit1 === unit1 && f.unit2 === unit2
        ).formula;
        
        const result = formula(InputA);
    
        Output.value = result.toFixed(1) + " " + unit2;
    }else if(type === "currency") {

        var InputA = parseInt(document.getElementById("InputA").value);
        //?DONE todo: make a 2d array with all the exchange rate from unit1 to unit2's so in every conversion I can peek the specific exchange rate and just multiply the input
        const currencyRates = {
            "Euro": {"Euro": 1, "USD": 1.093, "British Pound": 0.88, "Bitcoin": 0.000039, "Czech koruna": 23.51, "Albanian Lek": 112.79, 
                    "Russian ruble": 89.17, "Bulgarian Lev": 1.96, "Turkish Lira": 21.05, "Cypriot Pound": 0.532} , 
            "USD": {"Euro": 0.91, "USD": 1, "British Pound": 0.80, "Bitcoin": 0.000036, "Czech koruna": 21.38, "Albanian Lek": 102.59, 
                    "Russian ruble": 81.1, "Bulgarian Lev": 1.79, "Turkish Lira": 19.29, "Cypriot Pound": 0.88} , 
            "British Pound": {"Euro": 1.14, "USD": 1.24, "British Pound": 1, "Bitcoin": 0.000041, "Czech koruna": 26.68, "Albanian Lek": 128.61, 
                              "Russian ruble": 102.16, "Bulgarian Lev": 2.23, "Turkish Lira": 23.99, "Cypriot Pound": 0.661} ,
            "Bitcoin": {"Euro": 25358.16, "USD": 27884.5, "British Pound": 24170.09, "Bitcoin": 1, "Czech koruna": 596201.28, "Albanian Lek": 2860587.2, 
                        "Russian ruble": 2261432.95, "Bulgarian Lev": 53921.82, "Turkish Lira": 580378.7, "Cypriot Pound": 0} ,
            "Czech koruna": {"Euro": 0.043, "USD": 0.047, "British Pound": 0.037, "Bitcoin": 0.0000017, "Czech koruna": 1, "Albanian Lek": 4.8, 
                            "Russian ruble": 3.79, "Bulgarian Lev": 0.084, "Turkish Lira": 0.9, "Cypriot Pound": 0.2471} , 
            "Albanian Lek": {"Euro": 0.0089, "USD": 0.0098, "British Pound": 0.0078, "Bitcoin": 0.000000357, "Czech koruna": 0.21, "Albanian Lek": 1, 
                            "Russian ruble": 0.79, "Bulgarian Lev": 0.017, "Turkish Lira": 0.19, "Cypriot Pound": 0.005057} ,
            "Russian ruble": {"Euro": 0.011, "USD": 0.012, "British Pound": 0.0098, "Bitcoin": 0.000000442, "Czech koruna": 0.26, "Albanian Lek": 1.26, 
                            "Russian ruble": 1, "Bulgarian Lev": 0.022, "Turkish Lira": 0.24, "Cypriot Pound": 0.016} ,
            "Bulgarian Lev": {"Euro": 0.51, "USD": 0.56, "British Pound": 0.45, "Bitcoin": 0.000019, "Czech koruna": 11.97, "Albanian Lek": 57.69, 
                            "Russian ruble": 45.76, "Bulgarian Lev": 1, "Turkish Lira": 10.76, "Cypriot Pound": 0.29} ,
            "Turkish Lira": {"Euro": 0.048, "USD": 0.052, "British Pound": 0.042, "Bitcoin": 0.0000017, "Czech koruna": 1.113, "Albanian Lek": 5.36, 
                            "Russian ruble": 4.25, "Bulgarian Lev": 0.093, "Turkish Lira": 1, "Cypriot Pound": 0.02783} ,
            //?DONE todo: Add Cypriot pound to all currencies exchange rate 
            "Cypriot Pound": {"Euro": 1.708, "USD": 1.86, "British Pound": 1.49, "Bitcoin": 0.000000067, "Czech koruna": 40.1, "Albanian Lek": 192.82, 
                            "Russian ruble": 153.44, "Bulgarian Lev": 3.34, "Turkish Lira": 35.96, "Cypriot Pound": 1} 
        }

        var rate1 =  currencyRates[unit1][unit2];
        var result = InputA * rate1;

        Output.value = result.toFixed(2) + " " + unit2;
    }
}

function selectConversion() {
    var type = document.getElementById("unit-type").value;
    var options;

    //Options declaration so every time user select the specific category to show only this category's options
    if(type === "storage") {

        options = ["Bytes", "Kilobytes", "Megabytes", "Gigabytes", "Terabytes"];
    }else if(type === "number") {

        options = ["Binary", "Decimal", "Octal", "Hexadecimal"];
    }else {

        options = [];
    }

    //Creating 2 elements for the user to choose the starting unit and the unit he wants the amount to be converted to
    var select1 = document.createElement("select");
    select1.id = "unit1";
    var select2 = document.createElement("select");
    select2.id = "unit2";

    //Creating 
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

    //clearing buffer
    resetInputs();
}

function validateInput() {
    var type = document.getElementById("unit-type").value;
    var unit1 = document.getElementById("unit1").value;
    var InputA = document.getElementById("InputA").value;

    // Only allow 0-1 if unit1 is Binary
    if(type === "number" && unit1 === "Binary") {
        var regex = /^[01]*$/i;

        if(!regex.test(InputA)) {

            // If input is invalid, remove non-0-1 characters
            InputA = InputA.replace(/[^01]/ig, '');
            document.getElementById("InputA").value = InputA;
        }
    }else if(type === "number" && unit1 === "Octal") { // Only allow 0-7 if unit1 is Octal
        var regex = /^[0-7]*$/i;

        if(!regex.test(InputA)) {

            // If input is invalid, remove non-0-7 characters
            InputA = InputA.replace(/[^0-7]/ig, '');
            document.getElementById("InputA").value = InputA;
        }
    }

    // Only allow A-F if unit1 is Hexademical
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

function resetInputs() {

    document.getElementById("InputA").value = "";
    document.getElementById("Output").value = "";
}

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

            Output.value = currentRes.toString();
        }else {

            Output.value = currentRes.toFixed(1);
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
    }
}
// Set up listener
document.addEventListener('DOMContentLoaded', function() { 
    // Reference elements
    const totalSecondsInput = document.getElementById('totalSeconds'); 
    const secondsDisplay = document.getElementById('secondsDisplay'); 
    const tierInputs = document.querySelectorAll('input[name="tier"]');
    const localeInput = document.getElementById('locale');

    // Set up event listeners
    totalSecondsInput.addEventListener('input', function() { 
        secondsDisplay.innerText = this.value;
        calculateCost();
    });

    tierInputs.forEach(input => {
        input.addEventListener('change', calculateCost);
    });

    localeInput.addEventListener('input', calculateCost);
});

function calculateCost() { 
    // Acquire user inputs
    const tier = document.querySelector('input[name="tier"]:checked').value; 
    const totalSeconds = parseInt(document.getElementById('totalSeconds').value); 
    const taxRate = parseFloat(document.getElementById('locale').value) / 100; 

    // Establish per-tier base cost 
    const baseCost = 150; 
    const tierMultiplier = tier === 'A' ? 1 : 2; 

    // Define scaling factors
    const baseScale = baseCost / 10; 
    const aggressiveScaleFactor = 1; 
    const taperScaleFactor = 0.1; 

    // Define power function parameters
    const powerBase = 1.02; 
    const powerOffset = 1; 

    // Calculate additional cost
    let additionalCost = 0;
    let powerFunctionUnder90 = 0;
    let powerFunctionOver90 = 0;

    if (totalSeconds > 10 && totalSeconds <= 90) {
        powerFunctionUnder90 = powerFunction(totalSeconds - 10, powerBase, powerOffset); 
        additionalCost = baseScale * powerFunctionUnder90 * aggressiveScaleFactor;

    } else if (totalSeconds > 90) {
        powerFunctionUnder90 = powerFunction(90 - 10, powerBase, powerOffset); 
        const costForFirst90Seconds = baseScale * powerFunctionUnder90 * aggressiveScaleFactor;

        const over90Seconds = totalSeconds - 90;
        powerFunctionOver90 = powerFunction(over90Seconds, powerBase, powerOffset); 
        const costForAdditionalSeconds = baseScale * powerFunctionOver90 * taperScaleFactor;

        additionalCost = costForFirst90Seconds + costForAdditionalSeconds;
    }

    // Output debug information
    outputInputFactors(tier, totalSeconds, taxRate, powerBase, powerOffset);
    outputPowerFunctions(additionalCost, aggressiveScaleFactor, taperScaleFactor, powerFunctionUnder90, powerFunctionOver90);

    // Calculate subtotal
    const subtotal = (baseCost + additionalCost) * tierMultiplier;
    outputIntermediateCalculations(baseCost, additionalCost, tierMultiplier);

    // Calculate and display total cost including sales tax 
    const totalCost = subtotal * (1 + taxRate);
    displayTotalCost(totalCost);
}

// Function to compute power function value
function powerFunction(x, base, offset) {
    return Math.pow(x, base) + offset;
}

// Output debug information on user inputs
function outputInputFactors(tier, totalSeconds, taxRate, powerBase, powerOffset) {
    document.getElementById('inputTier').innerText = `Selected tier: ${tier}`;
    document.getElementById('inputTotalSeconds').innerText = `Total seconds: ${totalSeconds}`;
    document.getElementById('inputTaxRate').innerText = `Tax rate: ${taxRate * 100}%`;
    document.getElementById('powerBase').innerText = `Power function base: ${powerBase}`;
    document.getElementById('powerOffset').innerText = `Power function offset: ${powerOffset}`;
}

// Output debug information on power functions
function outputPowerFunctions(additionalCost, aggressiveScaleFactor, taperScaleFactor, powerFunctionUnder90, powerFunctionOver90) {
    document.getElementById('additionalCost').innerText = `Additional cost: $${additionalCost.toFixed(2)}`;
    document.getElementById('powerFunctionUnder90').innerText = `Power function under 90: ${powerFunctionUnder90.toFixed(2)}`;
    document.getElementById('powerFunctionOver90').innerText = `Power function over 90: ${powerFunctionOver90.toFixed(2)}`;
    document.getElementById('scaleFactor1').innerText = `Aggressive scale factor: ${aggressiveScaleFactor}`;
    document.getElementById('scaleFactor2').innerText = `Taper scale factor: ${taperScaleFactor}`;
}

// Output intermediate calculations
function outputIntermediateCalculations(baseCost, additionalCost, tierMultiplier) {
    document.getElementById('baseCost').innerText = `Base cost: $${baseCost.toFixed(2)}`;
    document.getElementById('additionalCost').innerText = `Additional cost: $${additionalCost.toFixed(2)}`;
    document.getElementById('tierMultiplier').innerText = `Tier multiplier: ${tierMultiplier}`;
}

// Display total cost
function displayTotalCost(totalCost) {
    document.getElementById('totalCost').innerText = `${totalCost.toFixed(2)}`;
}

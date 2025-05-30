// --- DOM Elements ---
const calorimeterWrapper = document.getElementById('calorimeterWrapper');
const tooltip = document.getElementById('tooltip');
const infoPanel = document.getElementById('infoPanel');
const infoText = document.getElementById('infoText');
const infoPanelTitle = infoPanel.querySelector('h3');
const closeInfoPanelButton = document.getElementById('closeInfoPanelButton');
const startButton = document.getElementById('startButton');
const nextButton = document.getElementById('nextButton');
const resetButton = document.getElementById('resetButton');
const calculateButton = document.getElementById('calculateButton');

const calculationScreen = document.getElementById('calculationScreen');
const fuelSelect = document.getElementById('fuelSelect');
const barChartContainer = document.getElementById('barChartContainer');
const calorificValueChartCanvas = document.getElementById('calorificValueChart');
let calorificValueBarChart = null;

const userCalorificValueInput = document.getElementById('userCalorificValueInput');
const checkCalorificValueButton = document.getElementById('checkCalorificValueButton');
const calculationFeedback = document.getElementById('calculationFeedback');
const calculationParametersDiv = document.getElementById('calculationParameters');
const calculationFormulaDiv = document.getElementById('calculationFormula');
const simulationCompleteMessage = document.getElementById('simulationCompleteMessage');

const thermometerMercury = document.getElementById('thermometerMercury');
const sampleElement = document.getElementById('sample');
const stirrerBlade = document.getElementById('stirrerBlade');
const stirrerGroup = document.getElementById('stirrerGroup');
const ignitionCoil = document.getElementById('ignitionCoil');
const ignitionWires = document.querySelectorAll('.ignition-wire');
const svgElements = document.querySelectorAll('.hoverable');
let activeHighlightedElement = null;

// --- Global State Variables ---
let simulationActive = false;
let simulationStep = 0;
let currentSelectedFuel = null;

// --- Component Information (Tooltips & Details) ---
const componentInfo = {
    outerCasing: "The protective outer shell of the calorimeter.",
    outerCasingTop: "The top face of the outer casing.",
    insulatingJacket: "Provides insulation to minimize heat loss to the surroundings.",
    bucket: "Holds the water and the bomb, absorbing heat from the reaction.",
    water: "The heat sink; its temperature change is measured to calculate heat released.",
    airSpace: "Air gap for additional insulation between the bucket and outer casing.",
    steelBomb: "A strong, sealed container where the combustion reaction occurs.",
    bombLid: "The top part of the steel bomb, sealed to contain the reaction.",
    crucible: "A small cup inside the bomb that holds the sample.",
    sample: "The substance undergoing combustion.",
    ignitionCoil: "Heats up to ignite the sample in the presence of oxygen.",
    ignitionWireLeft: "Carries current to the ignition coil.",
    ignitionWireRight: "Carries current to the ignition coil.",
    ignitionWireTopLeft: "Connects to the external power source.",
    ignitionWireTopRight: "Connects to the external power source.",
    stirrerGroup: "Continuously mixes the water to ensure uniform temperature distribution.",
    thermometer: "Measures the temperature change of the water.",
    oxygenTube: "Delivers oxygen to the bomb.",
    oxygenValve: "Controls the flow of oxygen into the bomb.",
    oxygenTubeBomb: "Connects the oxygen supply to the bomb interior.",
    heaterLeft: "Used to initially adjust or maintain water temperature.",
    heaterRight: "Used to initially adjust or maintain water temperature.",
    batteryGroup: "Battery: Supplies the electrical energy to ignite the sample."
};

const componentDetails = {
    outerCasing: { title: "Outer Casing", description: "This is the outermost protective layer of the bomb calorimeter. It houses all the internal components and provides structural integrity. Its robust design ensures safety during experiments." },
    insulatingJacket: { title: "Insulating Jacket", description: "The insulating jacket, often made of air or a vacuum, minimizes heat exchange between the calorimeter's internal components and the external external. This ensures that almost all heat from the reaction is absorbed by the water." },
    bucket: { title: "Calorimeter Bucket", description: "This metallic bucket contains the water that absorbs the heat released by the combustion reaction. It's designed to efficiently transfer heat from the bomb to the water." },
    water: { title: "Water (Heat Sink)", description: "A precisely measured quantity of water acts as the heat sink. The temperature change of this water is the primary measurement used to calculate the heat of combustion. Water's high specific heat capacity makes it ideal for this purpose." },
    steelBomb: { title: "Steel Bomb (Combustion Vessel)", description: "This thick-walled, sealed steel vessel is where the sample is combusted in a high-pressure oxygen atmosphere. It's built to withstand the pressure and heat generated during the exothermic reaction." },
    crucible: { title: "Crucible", description: "A small, heat-resistant cup (often platinum or stainless steel) that holds the sample to be combusted within the steel bomb. It ensures the sample is contained and completely burned." },
    sample: { title: "Sample", description: "The substance (e.g., food, fuel) whose heat of combustion is being determined. A small, precisely weighed amount is placed in the crucible." },
    ignitionCoil: { title: "Ignition Coil / Wire", description: "A thin wire (often platinum or nickel-chromium) that is heated electrically to initiate the combustion of the sample. Once the wire glows red, it ignites the sample." },
    stirrerGroup: { title: "Stirrer", description: "The stirrer continuously mixes the water in the calorimeter bucket. This ensures that the heat released from the bomb is uniformly distributed throughout the water, allowing for an accurate temperature measurement by the thermometer." },
    thermometer: { title: "Thermometer", description: "A highly accurate thermometer (e.g., a Beckmann thermometer or digital thermometer) is used to measure the initial and final temperatures of the water. The precision of this measurement is critical for accurate heat calculations." },
    oxygenTube: { title: "Oxygen Inlet Tube", description: "This tube allows for the controlled introduction of high-pressure oxygen into the steel bomb before combustion. Oxygen is essential for complete combustion of the sample." },
    oxygenValve: { title: "Oxygen Supply Valve", description: "Controls the flow of oxygen from an external tank into the bomb." },
    heaterLeft: { title: "Immersion Heater", description: "Sometimes a small immersion heater is included to precisely adjust the initial temperature of the water to a desired starting point before the experiment begins." },
    heaterRight: { title: "Immersion Heater", description: "Sometimes a small immersion heater is included to precisely adjust the initial temperature of the water to a desired starting point before the experiment begins." },
    batteryGroup: { title: "Battery", description: "This battery supplies the necessary current to heat the ignition coil. The current initiates combustion inside the bomb by igniting the fuel sample." }
};

// --- Simulation Steps Configuration ---
const initialThermometerHeight = 200;
const initialThermometerY = 380;
const maxThermometerRise = 100;

const simulationSteps = [
    {
        description: "Welcome! Click 'Start Simulation' to begin learning about the bomb calorimeter. Once the simulation is complete, you can click on individual parts for more details.",
        action: () => {
            infoPanel.classList.add('visible');
            infoPanelTitle.textContent = "Welcome!";
            startButton.disabled = false;
            nextButton.disabled = true;
            resetButton.disabled = true;
            calculateButton.classList.add('hidden');
            calculateButton.disabled = true;
            resetVisuals();
            enableIndividualInteractions();
            closeInfoPanelButton.style.display = 'none';
            simulationCompleteMessage.classList.add('hidden');
        },
        highlight: []
    },
    {
        description: "Step 1: **Sample Preparation & Oxygenation.** A known mass of the sample is placed in the crucible within the steel bomb. The bomb is then pressurized with pure oxygen.",
        action: () => {
            infoPanelTitle.textContent = "Simulation Step 1:";
            closeInfoPanelButton.style.display = 'none';
            document.getElementById('sample').classList.add('highlighted');
            document.getElementById('crucible').classList.add('highlighted');
            document.getElementById('steelBomb').classList.add('highlighted');
            document.getElementById('oxygenTube').classList.add('highlighted');
            document.getElementById('oxygenValve').classList.add('highlighted');
            svgElements.forEach(el => {
                if (!['sample', 'crucible', 'steelBomb', 'oxygenTube', 'oxygenValve'].includes(el.id)) {
                    el.classList.add('fade-out');
                } else {
                     el.classList.remove('fade-out');
                }
            });
        },
        highlight: ['sample', 'crucible', 'steelBomb', 'oxygenTube', 'oxygenValve']
    },
    {
        description: "Step 2: **Calorimeter Assembly.** The sealed bomb is carefully placed into the known quantity of water within the calorimeter bucket. The stirrer and thermometer are then inserted into the water.",
        action: () => {
            infoPanelTitle.textContent = "Simulation Step 2:";
            closeInfoPanelButton.style.display = 'none';
            document.getElementById('bucket').classList.add('highlighted');
            document.getElementById('water').classList.add('highlighted');
            document.getElementById('thermometer').classList.add('highlighted');
            stirrerGroup.classList.add('highlighted');
            document.getElementById('steelBomb').classList.add('highlighted');
            svgElements.forEach(el => {
                if (!['bucket', 'water', 'thermometer', 'stirrerGroup', 'steelBomb', 'bombLid'].includes(el.id)) {
                     el.classList.add('fade-out');
                } else {
                    el.classList.remove('fade-out');
                }
            });
        },
        highlight: ['bucket', 'water', 'thermometer', 'stirrerGroup', 'steelBomb']
    },
    {
        description: "Step 3: **Ignition.** An electric current is briefly passed through the ignition wires, causing the ignition coil to heat up and ignite the sample in the oxygen-rich environment.",
        action: () => {
            infoPanelTitle.textContent = "Simulation Step 3:";
            closeInfoPanelButton.style.display = 'none';
            ignitionCoil.classList.add('igniting');
            ignitionWires.forEach(wire => wire.classList.add('igniting'));
            document.querySelectorAll('.battery-wire').forEach(wire => wire.classList.add('igniting'));

            gsap.to(sampleElement, { duration: 1, fill: '#555', ease: "power1.inOut" });

            document.getElementById('ignitionCoil').classList.add('highlighted');
            document.getElementById('ignitionWireLeft').classList.add('highlighted');
            document.getElementById('ignitionWireRight').classList.add('highlighted');
            document.getElementById('ignitionWireTopLeft').classList.add('highlighted');
            document.getElementById('ignitionWireTopRight').classList.add('highlighted');
            document.getElementById('batteryGroup').classList.add('highlighted');
            document.getElementById('sample').classList.add('highlighted');

            svgElements.forEach(el => {
                const relevantIDs = ['ignitionCoil', 'ignitionWireLeft', 'ignitionWireRight', 'ignitionWireTopLeft', 'ignitionWireTopRight', 'batteryGroup', 'sample', 'crucible', 'steelBomb', 'bucket', 'water', 'thermometer', 'stirrerGroup'];
                if (!relevantIDs.includes(el.id)) {
                     el.classList.add('fade-out');
                } else {
                    el.classList.remove('fade-out');
                }
            });
        },
        highlight: ['ignitionCoil', 'ignitionWireLeft', 'ignitionWireRight', 'ignitionWireTopLeft', 'ignitionWireTopRight', 'batteryGroup', 'sample', 'crucible', 'steelBomb']
    },
    {
        description: "Step 4: **Heat Transfer & Stirring.** The heat released from the combustion rapidly transfers from the bomb to the surrounding water. The stirrer continuously mixes the water to ensure even heat distribution.",
        action: () => {
            infoPanelTitle.textContent = "Simulation Step 4:";
            closeInfoPanelButton.style.display = 'none';
            ignitionCoil.classList.remove('igniting');
            ignitionWires.forEach(wire => wire.classList.remove('igniting'));
            document.querySelectorAll('.battery-wire').forEach(wire => wire.classList.remove('igniting'));

            gsap.to(stirrerBlade, {
                duration: 1.5,
                rotation: 360,
                repeat: -1,
                ease: "none",
                transformOrigin: "0% 0%"
            });

            gsap.to(thermometerMercury, {
                duration: 3,
                attr: {
                    height: initialThermometerHeight + maxThermometerRise,
                    y: initialThermometerY - maxThermometerRise
                },
                ease: "power1.out"
            });

            document.getElementById('water').classList.add('highlighted');
            stirrerGroup.classList.add('highlighted');
            document.getElementById('thermometer').classList.add('highlighted');
            document.getElementById('steelBomb').classList.add('highlighted');

            svgElements.forEach(el => {
                const relevantIDs = ['water', 'stirrerGroup', 'thermometer', 'steelBomb', 'bucket', 'bombLid'];
                if (!relevantIDs.includes(el.id)) {
                     el.classList.add('fade-out');
                } else {
                    el.classList.remove('fade-out');
                }
            });
        },
        highlight: ['water', 'stirrerGroup', 'thermometer', 'steelBomb']
    },
    {
        description: "Step 5: **Temperature Measurement.** The thermometer measures the highest temperature reached by the water. The total temperature change, along with the calorimeter's heat capacity, is used to calculate the heat of combustion.",
        action: () => {
            infoPanelTitle.textContent = "Simulation Step 5:";
            closeInfoPanelButton.style.display = 'none';
            gsap.killTweensOf(stirrerBlade);
            gsap.to(thermometerMercury, {
                duration: 1,
                attr: {
                    height: initialThermometerHeight + maxThermometerRise,
                    y: initialThermometerY - maxThermometerRise
                },
                ease: "power1.out"
            });
            document.getElementById('thermometer').classList.add('highlighted');
            svgElements.forEach(el => {
                const relevantIDs = ['thermometer', 'water', 'steelBomb', 'bucket', 'stirrerGroup', 'bombLid'];
                if (!relevantIDs.includes(el.id)) {
                     el.classList.add('fade-out');
                } else {
                    el.classList.remove('fade-out');
                }
            });
        },
        highlight: ['thermometer', 'water', 'steelBomb', 'bucket', 'stirrerGroup']
    },
    {
        description: "Simulation complete. Please click on the 'Calculate' button to continue.",
        action: () => {
            infoPanelTitle.textContent = "Simulation Complete!";
            nextButton.disabled = true;
            resetButton.disabled = false;
            calculateButton.classList.remove('hidden');
            calculateButton.disabled = false;
            enableIndividualInteractions();
            resetVisuals();
            closeInfoPanelButton.style.display = 'block';
            simulationCompleteMessage.classList.remove('hidden');
            simulationCompleteMessage.classList.add('visible');
        },
        highlight: []
    }
];

// --- Fuel Data for Calculation ---
const WATER_MASS_W = 2000;
const SPECIFIC_HEAT_WATER = 4.184;
const CAL_TO_JOULE_FACTOR = 4.184;

function parseRangeValue(rangeStr) {
    const cleanedStr = rangeStr.replace(/["~]/g, '').trim();
    const parts = cleanedStr.split(/–|-/).map(s => parseFloat(s.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return (parts[0] + parts[1]) / 2;
    } else if (parts.length === 1 && !isNaN(parts[0])) {
        return parts[0];
    }
    return 0;
}

const newFuelDataRaw = `Fuel,State,Sample Mass (g),Water Mass W (g),Water Equivalent w (g),Temp Rise ΔT (°C),Correction C (cal),Typical CV (kcal/kg)
Bituminous Coal,Solid,1,2000,500,2.5 – 3.5,10 – 20,6500 – 8500
Anthracite Coal,Solid,1,2000,500,2.8 – 3.8,10 – 20,8000 – 9000
Lignite,Solid,1,2000,500,1.5 – 2.5,10 – 20,4000 – 5000
Wood (dry),Solid,1.0 – 1.2,2000,480 – 520,1.8 – 2.5,10 – 15,3500 – 4500
Charcoal,Solid,1,2000,500,3.0 – 3.8,10 – 15,7000 – 8000
Peat (dry),Solid,1,2000,500,1.0 – 2.0,10 – 15,3000 – 4000
Bagasse (dry),Solid,1,2000,500,1.0 – 1.8,10 – 15,2000 – 2500
Biomass Briquette,Solid,1,2000,500,2.2 – 3.0,10 – 15,4000 – 5000
Petrol,Liquid,0.5 – 0.8,2000,480 – 520,3.0 – 3.8,10 – 15,"10,500 – 11,500"
Diesel,Liquid,0.8 – 1.0,2000,500,3.0 – 3.5,10 – 15,"10,000 – 11,000"
Kerosene,Liquid,0.8 – 1.0,2000,500,2.8 – 3.5,10 – 15,"10,000 – 10,500"
Ethanol,Liquid,0.8 – 1.0,2000,500,2.2 – 2.8,10 – 15,7000 – 7500
Methanol,Liquid,0.8 – 1.0,2000,500,1.8 – 2.3,10 – 15,5600 – 6000
Biodiesel,Liquid,1,2000,500,2.5 – 3.3,10 – 15,8800 – 9500
Furnace Oil,Liquid,1,2000,500,3.0 – 3.5,10 – 15,"~10,000"`;

const fuelData = {};
const initialBaseTemp = 25.0;

const lines = newFuelDataRaw.trim().split('\n');
for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    const fuelName = parts[0].trim();
    const fuelKey = fuelName.toLowerCase().replace(/[^a-z0-9]/g, '');

    const sampleMass = parseRangeValue(parts[2]);
    const deltaTRangeStr = parts[5];
    const avgDeltaT = parseRangeValue(deltaTRangeStr);

    const initialTemp = initialBaseTemp;
    const finalTemp = initialBaseTemp + avgDeltaT;

    fuelData[fuelKey] = {
        name: fuelName,
        calc: {
            massFuel: sampleMass,
            initialTemp: initialTemp,
            finalTemp: finalTemp,
        },
        formulaExplanation: "Where: <br> CV = Calorific Value (J/g) <br> W = Water Mass (2000g, constant) <br> w = Water Equivalent (g, configurable per setup) <br> ΔT = Temperature Rise (Final Temp - Initial Temp) (°C) <br> C = Correction factor for fuse, cotton, etc. (J) <br> m = Mass of fuel burned (g) <br> Specific Heat Water = 4.184 J/g°C"
    };
}

// --- Core Functions ---

function resetVisuals() {
    gsap.killTweensOf(stirrerBlade);
    gsap.killTweensOf(thermometerMercury);
    gsap.killTweensOf(ignitionCoil);
    ignitionWires.forEach(wire => gsap.killTweensOf(wire));
    document.querySelectorAll('.battery-wire').forEach(wire => gsap.killTweensOf(wire));

    svgElements.forEach(el => {
        el.classList.remove('highlighted', 'fade-out', 'fade-in', 'igniting');
    });
    gsap.set(thermometerMercury, { attr: { height: initialThermometerHeight, y: initialThermometerY } });
    gsap.set(ignitionCoil, { stroke: '#ff4500' });
    ignitionWires.forEach(wire => gsap.set(wire, { stroke: '#ff0000' }));
    document.querySelectorAll('.battery-wire').forEach(wire => gsap.set(wire, { stroke: '#ff0000' }));
    sampleElement.style.fill = 'url(#gradSample)';

    ignitionCoil.classList.remove('igniting');
    ignitionWires.forEach(wire => wire.classList.remove('igniting'));
    document.querySelectorAll('.battery-wire').forEach(wire => wire.classList.remove('igniting'));
   
    gsap.set(stirrerBlade, { rotation: 0 });
}

function updateSimulationDisplay() {
    const step = simulationSteps[simulationStep];
    infoPanel.classList.add('visible');
    infoPanelTitle.textContent = simulationStep === 0 ? "Welcome!" : `Simulation Step ${simulationStep}:`;
    infoText.innerHTML = step.description;

    resetVisuals();

    step.action();

    if (simulationStep > 0 && simulationStep < simulationSteps.length - 1) {
         disableIndividualInteractions();
    } else {
         enableIndividualInteractions();
    }
}

function handleMouseOver(event) {
    if (simulationActive) return;

    const componentId = event.currentTarget.id;
    let idToUse = componentId;
    if (!componentInfo[componentId]) {
        const parentWithId = event.currentTarget.closest('[id]');
        if (parentWithId) {
            idToUse = parentWithId.id;
        }
    }

    if (componentInfo[idToUse]) {
        tooltip.textContent = componentInfo[idToUse];
        tooltip.classList.add('visible');
        positionTooltip(event);
    }
}

function handleMouseOut() {
    if (simulationActive) return;
    tooltip.classList.remove('visible');
}

function handleMouseMove(event) {
    if (simulationActive) return;
    if (tooltip.classList.contains('visible')) {
        positionTooltip(event);
    }
}

function handleClick(event) {
    if (simulationActive) return;

    if (activeHighlightedElement) {
        activeHighlightedElement.classList.remove('highlighted');
    }
    infoPanel.classList.remove('visible');

    const componentId = event.currentTarget.id;
    let idToUse = componentId;
    if (!componentDetails[componentId]) {
        const parentWithId = event.currentTarget.closest('[id]');
        if (parentWithId) {
            idToUse = parentWithId.id;
        }
    }

    if (componentDetails[idToUse]) {
        infoPanel.classList.add('visible');
        infoPanelTitle.textContent = componentDetails[idToUse].title;
        infoText.textContent = componentDetails[idToUse].description;
        event.currentTarget.classList.add('highlighted');
        activeHighlightedElement = event.currentTarget;
        closeInfoPanelButton.style.display = 'block';
    } else {
        infoPanel.classList.remove('visible');
        infoPanelTitle.textContent = "Click on a component to learn more!";
        infoText.textContent = "";
        activeHighlightedElement = null;
        closeInfoPanelButton.style.display = 'none';
    }
}

function positionTooltip(event) {
    const wrapperRect = calorimeterWrapper.getBoundingClientRect();
    let mouseX = event.clientX - wrapperRect.left;
    let mouseY = event.clientY - wrapperRect.top;

    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    const padding = 15;

    let finalX = mouseX + padding;
    let finalY = mouseY + padding;

    if (finalX + tooltipWidth > wrapperRect.width) {
        finalX = mouseX - tooltipWidth - padding;
        if (finalX < 0) finalX = mouseX + padding;
    }
    if (finalY + tooltipHeight > wrapperRect.height) {
        finalY = mouseY - tooltipHeight - padding;
        if (finalY < 0) finalY = mouseY + padding;
    }

    tooltip.style.left = `${finalX}px`;
    tooltip.style.top = `${finalY}px`;
}

function enableIndividualInteractions() {
    calorimeterWrapper.classList.remove('simulation-active');
    svgElements.forEach(element => {
        element.addEventListener('mouseover', handleMouseOver);
        element.addEventListener('mouseout', handleMouseOut);
        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('click', handleClick);
    });
    document.addEventListener('click', handleClickOutsideInteractions);
}

function disableIndividualInteractions() {
    calorimeterWrapper.classList.add('simulation-active');
    svgElements.forEach(element => {
        element.removeEventListener('mouseover', handleMouseOver);
        element.removeEventListener('mouseout', handleMouseOut);
        element.removeEventListener('click', handleClick);
    });
    tooltip.classList.remove('visible');
    if (activeHighlightedElement) {
        activeHighlightedElement.classList.remove('highlighted');
        activeHighlightedElement = null;
    }
    document.removeEventListener('click', handleClickOutsideInteractions);
}

function handleClickOutsideInteractions(event) {
    const isClickOutsideWrapper = !calorimeterWrapper.contains(event.target);
    const isClickOutsideInfoPanel = !infoPanel.contains(event.target);
    const isClickOutsideControls = !startButton.contains(event.target) && !nextButton.contains(event.target) && !resetButton.contains(event.target) && !calculateButton.contains(event.target) && !fuelSelect.contains(event.target) && !userCalorificValueInput.contains(event.target) && !checkCalorificValueButton.contains(event.target);
    const isClickOutsideMessage = !simulationCompleteMessage.contains(event.target);

    if (isClickOutsideWrapper && isClickOutsideInfoPanel && isClickOutsideControls && isClickOutsideMessage) {
        infoPanel.classList.remove('visible');
        if (activeHighlightedElement) {
            activeHighlightedElement.classList.remove('highlighted');
            activeHighlightedElement = null;
        }
    }
}

// --- Event Listeners for Simulation Controls ---
startButton.addEventListener('click', () => {
    simulationActive = true;
    simulationStep = 1;
    updateSimulationDisplay();
    startButton.disabled = true;
    nextButton.disabled = false;
    resetButton.disabled = false;
    calculateButton.classList.add('hidden');
    calculateButton.disabled = true;
    showSimulationScreen();
    simulationCompleteMessage.classList.add('hidden');
});

nextButton.addEventListener('click', () => {
    if (simulationActive && simulationStep < simulationSteps.length - 1) {
        simulationStep++;
        updateSimulationDisplay();
    }
    if (simulationStep === simulationSteps.length - 1) {
        nextButton.disabled = true;
    }
});

resetButton.addEventListener('click', () => {
    simulationActive = false;
    simulationStep = 0;
    updateSimulationDisplay();
    startButton.disabled = false;
    nextButton.disabled = true;
    resetButton.disabled = true;
    calculateButton.classList.add('hidden');
    calculateButton.disabled = true;
    showSimulationScreen();
    simulationCompleteMessage.classList.add('hidden');
});

closeInfoPanelButton.addEventListener('click', () => {
    infoPanel.classList.remove('visible');
    if (activeHighlightedElement) {
        activeHighlightedElement.classList.remove('highlighted');
        activeHighlightedElement = null;
    }
});

// --- New Calculation Screen Functions ---

calculateButton.addEventListener('click', showCalculationScreen);
fuelSelect.addEventListener('change', (event) => {
    const selectedFuelKey = event.target.value;
    if (selectedFuelKey) {
        currentSelectedFuel = selectedFuelKey;
        displayFuelData(selectedFuelKey);
    } else {
        if (calorificValueBarChart) {
            calorificValueBarChart.destroy();
            calorificValueBarChart = null;
        }
        barChartContainer.innerHTML = '<canvas id="calorificValueChart"></canvas>';
        calculationParametersDiv.innerHTML = '';
        calculationFormulaDiv.innerHTML = '';
        userCalorificValueInput.value = '';
        calculationFeedback.textContent = '';
        currentSelectedFuel = null;
    }
});
checkCalorificValueButton.addEventListener('click', checkUserCalorificValue);

function showCalculationScreen() {
    calorimeterWrapper.classList.add('hidden');
    infoPanel.classList.add('hidden');
    simulationCompleteMessage.classList.add('hidden');
    calculationScreen.classList.remove('hidden');
    disableIndividualInteractions();
    clearHighlight();
    tooltip.classList.remove('visible');

    populateFuelDropdown();
    drawCalorificValueBarChart();

    fuelSelect.value = "";
    calculationParametersDiv.innerHTML = '';
    calculationFormulaDiv.innerHTML = '';
    userCalorificValueInput.value = '';
    calculationFeedback.textContent = '';
    currentSelectedFuel = null;

    calorificValueCalculator.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showSimulationScreen() {
    calorimeterWrapper.classList.remove('hidden');
    infoPanel.classList.remove('hidden');
    calculationScreen.classList.add('hidden');
    enableIndividualInteractions();
    simulationCompleteMessage.classList.add('hidden');
}

function populateFuelDropdown() {
    fuelSelect.innerHTML = '<option value="">-- Select a Fuel --</option>';
    for (const key in fuelData) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = fuelData[key].name;
        fuelSelect.appendChild(option);
    }
}

function drawCalorificValueBarChart() {
    if (calorificValueBarChart) {
        calorificValueBarChart.destroy();
    }

    let currentCanvas = document.getElementById('calorificValueChart');
    if (!currentCanvas) {
        barChartContainer.innerHTML = '<canvas id="calorificValueChart"></canvas>';
        currentCanvas = document.getElementById('calorificValueChart');
    }
    const ctx = currentCanvas.getContext('2d');

    const labels = [];
    const dataValues = [];
    const backgroundColors = [];
    const borderColors = [];

    const keys = Object.keys(fuelData);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const fuel = fuelData[key];

        const defaultW = 500;
        const defaultC_cal = 15;
        const defaultC_joules = defaultC_cal * CAL_TO_JOULE_FACTOR;

        const chartParams = {
            massFuel: fuel.calc.massFuel,
            initialTemp: fuel.calc.initialTemp,
            finalTemp: fuel.calc.finalTemp,
            w: defaultW,
            C_joules: defaultC_joules
        };

        labels.push(fuel.name);
        const calculatedCV = calculateCalorificValue(key, { [key]: { ...fuel, calculatedParams: chartParams } });
        dataValues.push(calculatedCV);
       
        const hue = (i * 137) % 360;
        backgroundColors.push(`hsl(${hue}, 70%, 70%)`);
        borderColors.push(`hsl(${hue}, 70%, 50%)`);
    }

    calorificValueBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Calorific Value (J/g)',
                data: dataValues,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1,
                borderRadius: 5,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Comparison of Fuel Calorific Values',
                    font: {
                        size: 18,
                        weight: 'bold',
                        family: 'Inter, sans-serif'
                    },
                    color: '#333'
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y.toFixed(2) + ' J/g';
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Calorific Value (J/g)',
                        font: {
                            size: 14,
                            family: 'Inter, sans-serif'
                        },
                        color: '#555'
                    },
                    grid: {
                        color: '#e0e0e0'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Fuel Type',
                        font: {
                            size: 14,
                            family: 'Inter, sans-serif'
                        },
                        color: '#555'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function displayFuelData(fuelKey) {
    const fuel = fuelData[fuelKey];
    if (!fuel) return;

    const currentFuelCalcParams = { ...fuel.calc };
    currentFuelCalcParams.w = getRandomArbitrary(480, 520);
    currentFuelCalcParams.C_cal = getRandomArbitrary(10, 20);
    currentFuelCalcParams.C_joules = currentFuelCalcParams.C_cal * CAL_TO_JOULE_FACTOR;

    fuel.calculatedParams = currentFuelCalcParams;

    calculationParametersDiv.innerHTML = `
        <p class="calc-param"><span>Water Mass (W):</span> <span>${WATER_MASS_W} g</span></p>
        <p class="calc-param"><span>Water Equivalent (w):</span> <span>${currentFuelCalcParams.w.toFixed(2)} g</span></p>
        <p class="calc-param"><span>Temperature Rise (ΔT):</span> <span>${(currentFuelCalcParams.finalTemp - currentFuelCalcParams.initialTemp).toFixed(2)} °C</span></p>
        <p class="calc-param"><span>Correction Factor (C):</span> <span>${currentFuelCalcParams.C_joules.toFixed(2)} J (${currentFuelCalcParams.C_cal.toFixed(2)} cal)</span></p>
        <p class="calc-param"><span>Mass of Fuel (m):</span> <span>${currentFuelCalcParams.massFuel} g</span></p>
        <p class="calc-param"><span>Specific Heat Water:</span> <span>${SPECIFIC_HEAT_WATER} J/g°C</span></p>
    `;

    calculationFormulaDiv.innerHTML = `
        <h4>Formula:</h4>
        <p style="font-style: italic; text-align: center; background-color: #e6eefc; padding: 10px; border-radius: 8px; border: 1px solid #c0d9f0;">
            CV (J/g) = ((W + w) × ΔT × Specific Heat Water - C) / m
        </p>
        <p style="font-size: 0.9em; text-align: left; color: #555; margin-top: 10px;">
            ${fuel.formulaExplanation}
        </p>
    `;

    userCalorificValueInput.value = '';
    calculationFeedback.textContent = '';
    calculationFeedback.classList.remove('feedback-correct', 'feedback-wrong');
}

function calculateCalorificValue(fuelKey, sourceData = fuelData) {
    const fuel = sourceData[fuelKey];
    if (!fuel) return NaN;

    let paramsToUse = fuel.calculatedParams;
    if (!paramsToUse && sourceData[fuelKey] && sourceData[fuelKey].calculatedParams) {
        paramsToUse = sourceData[fuelKey].calculatedParams;
    }
    if (!paramsToUse) {
        paramsToUse = {
            w: getRandomArbitrary(480, 520),
            C_joules: getRandomArbitrary(10, 20) * CAL_TO_JOULE_FACTOR,
            massFuel: fuel.calc.massFuel,
            initialTemp: fuel.calc.initialTemp,
            finalTemp: fuel.calc.finalTemp
        };
    }

    const { massFuel, initialTemp, finalTemp, w, C_joules } = paramsToUse;

    const deltaT = finalTemp - initialTemp;
    const numerator = (WATER_MASS_W + w) * deltaT * SPECIFIC_HEAT_WATER - C_joules;
    const calorificValue = numerator / massFuel;

    return calorificValue;
}

function checkUserCalorificValue() {
    if (!currentSelectedFuel) {
        calculationFeedback.textContent = "Please select a fuel first.";
        calculationFeedback.classList.remove('feedback-correct');
        calculationFeedback.classList.add('feedback-wrong');
        return;
    }

    const userValue = parseFloat(userCalorificValueInput.value);
    if (isNaN(userValue)) {
        calculationFeedback.textContent = "Please enter a valid number.";
        calculationFeedback.classList.remove('feedback-correct');
        calculationFeedback.classList.add('feedback-wrong');
        return;
    }

    const correctValue = calculateCalorificValue(currentSelectedFuel, fuelData);
    const tolerance = 0.01;

    if (Math.abs(userValue - correctValue) < tolerance) {
        calculationFeedback.textContent = "Correct! 100% accurate.";
        calculationFeedback.classList.remove('feedback-wrong');
        calculationFeedback.classList.add('feedback-correct');
    } else {
        let accuracy = (1 - (Math.abs(userValue - correctValue) / correctValue)) * 100;
        if (accuracy < 0) {
            accuracy = 0;
        }
        const accuracyMessage = accuracy.toFixed(2);

        calculationFeedback.innerHTML = `Wrong! You were ${accuracyMessage}% accurate. The correct calorific value is ${correctValue.toFixed(2)} J/g. <br>Please try again.`;
        calculationFeedback.classList.remove('feedback-correct');
        calculationFeedback.classList.add('feedback-wrong');
    }
}

function clearHighlight() {
    if (activeHighlightedElement) {
        activeHighlightedElement.classList.remove('highlighted');
        activeHighlightedElement = null;
    }
    svgElements.forEach(el => {
        el.classList.remove('fade-out');
    });
}

// --- Initial Setup on Page Load ---
document.addEventListener('DOMContentLoaded', () => {
    updateSimulationDisplay();
});
